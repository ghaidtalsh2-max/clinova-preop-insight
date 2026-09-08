import fs from 'fs';
import type { IncomingMessage, ServerResponse } from 'http';

function getEnvConfig() {
  const env: Record<string, string> = {};
  try {
    const envContent = fs.readFileSync('.env', 'utf-8');
    envContent.split('\n').forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        env[match[1]] = value;
      }
    });
  } catch (e) {
    console.warn('Could not read .env file, using process.env');
  }

  const openRouterKey = env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY || '';
  const speechmaticsKey = env.SPEECHMATICS_API_KEY || process.env.SPEECHMATICS_API_KEY || '';
  const model = env.OPENROUTER_MODEL || process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';

  return { openRouterKey, speechmaticsKey, model };
}

export function clinicalServerMiddleware() {
  return {
    name: 'clinova-api-server',
    configureServer(server: any) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        const url = req.url || '';

        // 1. Health check endpoint
        if (url === '/api/health') {
          const { openRouterKey, speechmaticsKey, model } = getEnvConfig();
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              status: 'healthy',
              speechmaticsConfigured: !!speechmaticsKey,
              openrouterConfigured: !!openRouterKey,
              model
            })
          );
          return;
        }

        // 2. Speechmatics Ephemeral JWT Token Generator (Keeps Master Key Secure on Server!)
        if (url === '/api/speechmatics/token') {
          const { speechmaticsKey } = getEnvConfig();
          if (!speechmaticsKey) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'SPEECHMATICS_API_KEY is not configured on server' }));
            return;
          }

          try {
            const smRes = await fetch('https://mp.speechmatics.com/v1/api_keys?type=rt', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${speechmaticsKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ ttl: 3600 })
            });

            if (!smRes.ok) {
              const errData = await smRes.text();
              res.statusCode = smRes.status;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Speechmatics Token Generation Failed', details: errData }));
              return;
            }

            const smData = (await smRes.json()) as any;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: true,
                token: smData.key_value,
                ttl: 3600
              })
            );
            return;
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Speechmatics Network Error', message: err.message }));
            return;
          }
        }

        // 3. OpenRouter Clinical Reasoning & Extraction Endpoint (Server-Side)
        if (url === '/api/clinical/analyze' && req.method === 'POST') {
          const { openRouterKey, model } = getEnvConfig();
          if (!openRouterKey) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'OPENROUTER_API_KEY is not configured on server' }));
            return;
          }

          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });

          req.on('end', async () => {
            try {
              const { transcript, patient, selectedOptionId } = JSON.parse(body || '{}');

              if (!transcript || transcript.trim().length < 5) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ status: 'insufficient_transcript' }));
                return;
              }

              const systemPrompt = `You are Clinova AI, a specialized Pre-Operative Clinical Decision Support System and clinical dialogue understanding engine.
Analyze the doctor-patient conversation in real time alongside the patient's Electronic Health Record (EHR).

MANDATORY CLINICAL KNOWLEDGE REFERENCES TO INCORPORATE:
1. MOH-SA-PROTOCOLS: Saudi Ministry of Health National Clinical Protocols (Pre-operative assessment, medication reconciliation, surgical antimicrobial prophylaxis).
2. PHA-WEQAYA-2024: Saudi Public Health Authority (Weqaya) Chronic Disease & Metabolic Risk Guidelines.
3. US-FDA-DRUGS: U.S. FDA Drug Safety, Black Box Warnings & Anticoagulant cessation windows.
4. NICE-GUIDELINES: NICE Preoperative Tests Guidance (NG45) for routine tests (ECG, renal profile, fasting glucose).
5. WHO-ICD-11: WHO International Classification of Diseases standard coding.
6. WHO-AI-ETHICS-2021: Human oversight, clinician decision autonomy, and transparency.

Strict Extraction & Analysis Directives:
1. EXTRACTED INFORMATION: extract symptoms, duration, triggers, medications, allergies, and relevant medical history from the dialogue.
2. PATIENT MEMORY RETRIEVAL: cross-reference mentioned medications/surgeries/tests against EHR. If patient mentions a medication (e.g., blood thinner, BP drug, or painkiller), match it to EHR and state: "Possible match from patient record - clinician verification required" (تطابق محتمل من السجل الطبي - يلزم التحقق السريري).
3. WHAT NEEDS ATTENTION: produce 2 to 3 high-yield items classified as:
   - "Missing Information" (معلومات ناقصة)
   - "Medication Discrepancy" (تعارض دوائي)
   - "Conflicting Information" (معلومات متعارضة)
   - "Potential Clinical Finding" (مؤشر سريري محتمل)
4. SMART QUESTIONS: generate EXACTLY ONE targeted clarifying question at a time with options ["Yes", "No", "Not sure"] / ["نعم", "لا", "غير متأكد"].
5. CLINICAL POSSIBILITIES: suggest 2 to 3 differential possibilities with qualitative likelihoods ("Higher likelihood", "Moderate likelihood", "Lower likelihood"), supporting evidence from Conversation and from Patient Record, and 1 to 2 discriminating questions.
6. CLINICAL REFERENCES: cite 2 to 3 applicable references from the mandatory list above with tag, Arabic title, English title, rationale in Arabic and English, and official URL.
7. Return STRICTLY valid JSON without markdown fences.

JSON Schema:
{
  "extractedInformation": {
    "symptoms": [{"text": "Dizziness", "textAr": "دوخة"}],
    "duration": "3 weeks",
    "trigger": "Standing",
    "medications": [{"name": "Blood pressure pill", "status": "unconfirmed"}],
    "allergies": ["Penicillin"],
    "relevantHistory": ["Hypertension"]
  },
  "patientMemoryMatches": [
    {
      "category": "medication",
      "matchedEntity": "Amlodipine 5 mg",
      "matchedEntityAr": "أملوديبين 5 ملجم",
      "source": "MOH",
      "statement": "Possible match from patient record - clinician verification required",
      "statementAr": "تطابق محتمل من السجل الطبي - يلزم التحقق السريري"
    }
  ],
  "whatNeedsAttention": [
    {
      "id": "att-1",
      "category": "Medication Discrepancy",
      "categoryAr": "تعارض دوائي",
      "title": "Verbal report mentions unknown blood pressure med matching Amlodipine 5mg in MOH record",
      "titleAr": "المريض ذكر دواء ضغط غير محدد يطابق أملوديبين 5 ملجم في سجل وصفتي",
      "severity": "high"
    }
  ],
  "smartQuestion": {
    "id": "sq-1",
    "question": "Has the patient experienced any fainting, blackout, or near-fainting episodes upon standing?",
    "questionAr": "هل عانى المريض من أي نوبات إغماء أو شبه إغماء أو سقوط مفاجئ عند الوقوف؟",
    "options": ["Yes", "No", "Not sure"],
    "optionsAr": ["نعم", "لا", "غير متأكد"]
  },
  "clinicalPossibilities": [
    {
      "id": "pos-1",
      "name": "Orthostatic Hypotension",
      "nameAr": "هبوط الضغط الانتصابي",
      "likelihood": "Higher likelihood",
      "likelihoodAr": "احتمالية مرتفعة",
      "evidenceFromConversation": ["Dizziness when standing up quickly", "Started 3 weeks ago"],
      "evidenceFromConversationAr": ["دوخة عند الوقوف بسرعة", "بدأت منذ 3 أسابيع"],
      "evidenceFromRecord": ["Hypertension", "Amlodipine medication"],
      "evidenceFromRecordAr": ["ارتفاع ضغط الدم", "علاج أملوديبين"],
      "discriminatingQuestions": [
        { "question": "Does the dizziness improve quickly after sitting or lying down?", "questionAr": "هل تتحسن الدوخة سريعاً بعد الجلوس أو الاستلقاء؟" }
      ]
    }
  ],
  "clinicalSummary": {
    "en": "Pre-op evaluation indicates postural dizziness likely related to antihypertensive therapy. Cross-referenced with MOH and NICE pre-op protocols.",
    "ar": "التقييم ما قبل الجراحة يشير إلى دوخة وضعية مرتبطة على الأرجح بعلاج الضغط وفق الدليل الوطني لوزارة الصحة وإرشادات NICE."
  },
  "clinicalReferences": [
    {
      "tag": "MOH-SA-PROTOCOLS",
      "titleAr": "الأدلة السريرية والبروتوكولات الوطنية — وزارة الصحة السعودية",
      "titleEn": "Saudi MOH National Clinical Practice Protocols",
      "rationaleAr": "مطابقة بروتوكول تقييم ما قبل التخدير وتدقيق أدوية الضغط والتحقق من الاستقرار الوعائي.",
      "rationaleEn": "Pre-anesthesia assessment baseline and cardiovascular medication reconciliation.",
      "url": "https://www.moh.gov.sa/en/ministry/mediacenter/publications/pages/protocols.aspx"
    },
    {
      "tag": "PHA-WEQAYA-2024",
      "titleAr": "دليل عوامل الخطورة والأمراض المزمنة — هيئة الصحة العامة (وقاية)",
      "titleEn": "Public Health Authority (PHA) Risk Factors Guidelines",
      "rationaleAr": "تقييم مخاطر الأمراض المزمنة وضبط ضغط الدم لتفادي هبوط الدورة الدموية أثناء التخدير.",
      "rationaleEn": "Chronic disease risk stratification for perioperative safety.",
      "url": "https://www.pha.gov.sa/ar-sa/Healthportal/Pages/RiskFactor.aspx"
    },
    {
      "tag": "US-FDA-DRUGS",
      "titleAr": "قاعدة بيانات سلامة الأدوية — هيئة الغذاء والدواء (FDA)",
      "titleEn": "FDA Drugs Safety Database",
      "rationaleAr": "التحقق من الآثار الجانبية ومخاطر النزيف وهبوط الضغط المصاحب للأدوية الموصوفة.",
      "rationaleEn": "Pharmacovigilance checks on antihypertensive side effects and drug clearance.",
      "url": "https://www.fda.gov/drugs"
    }
  ]
}`;

              let aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${openRouterKey}`,
                  'Content-Type': 'application/json',
                  'HTTP-Referer': 'http://localhost:5173',
                  'X-Title': 'Clinova - PreOp Insight'
                },
                body: JSON.stringify({
                  model: model,
                  temperature: 0.1,
                  response_format: { type: 'json_object' },
                  messages: [
                    { role: 'system', content: systemPrompt },
                    {
                      role: 'user',
                      content: `CURRENT PATIENT RECORD:\n${JSON.stringify(patient, null, 2)}\n\nLIVE CONVERSATION TRANSCRIPT:\n"""\n${transcript}\n"""\n\nSELECTED DISCRIMINATING OPTION: ${selectedOptionId || 'none'}`
                    }
                  ]
                })
              });

              // Fallback to verified active models if primary model is unavailable or 404
              if (!aiRes.ok && (aiRes.status === 404 || aiRes.status === 400)) {
                console.warn(`Primary model ${model} failed with ${aiRes.status}, falling back to openai/gpt-4o-mini`);
                aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${openRouterKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'http://localhost:5173',
                    'X-Title': 'Clinova - PreOp Insight'
                  },
                  body: JSON.stringify({
                    model: 'openai/gpt-4o-mini',
                    temperature: 0.1,
                    response_format: { type: 'json_object' },
                    messages: [
                      { role: 'system', content: systemPrompt },
                      {
                        role: 'user',
                        content: `CURRENT PATIENT RECORD:\n${JSON.stringify(patient, null, 2)}\n\nLIVE CONVERSATION TRANSCRIPT:\n"""\n${transcript}\n"""\n\nSELECTED DISCRIMINATING OPTION: ${selectedOptionId || 'none'}`
                      }
                    ]
                  })
                });
              }

              if (!aiRes.ok) {
                const errText = await aiRes.text();
                res.statusCode = aiRes.status;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'OpenRouter API Error', details: errText }));
                return;
              }

              const aiData = (await aiRes.json()) as any;
              const content = aiData.choices?.[0]?.message?.content;
              const parsed = JSON.parse(content || '{}');

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, data: parsed }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Clinical Analysis Server Error', message: err.message }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}
