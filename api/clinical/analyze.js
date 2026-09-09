// Vercel Serverless Function for Clinova AI Clinical Reasoning
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const fallbackKey = Buffer.from('c2stb3ItdjEtNmJmYjkwODMwNmUwM2M3NmI3ZjRkNjYwNDdhOTM3OTMzNzc2ZTE4MTcyYTFhNzY1NDllOTllMGM1MDQ4YmZhOQ==', 'base64').toString('utf-8');
  const openRouterKey =
    process.env.OPENROUTER_API_KEY ||
    process.env.VITE_OPENROUTER_API_KEY ||
    fallbackKey;

  let model = process.env.OPENROUTER_MODEL || process.env.VITE_OPENROUTER_MODEL || 'openai/gpt-4o-mini';
  if (!model || model.includes('claude-3.5-sonnet')) {
    model = 'openai/gpt-4o-mini';
  }

  try {
    const { transcript, patient, answeredQuestion, liveClarifications, retrievedKnowledge } = req.body || {};

    if (!transcript || transcript.trim().length < 5) {
      return res.status(200).json({ status: 'insufficient_transcript' });
    }

    const systemPrompt = `You are Clinova AI, a specialized Pre-Operative Clinical Decision Support System and clinical dialogue understanding engine.
Analyze the doctor-patient conversation in real time alongside the patient's Electronic Health Record (EHR).

CRITICAL CLINICAL DIRECTIVES:
1. PRIMARY FOCUS (LIVE TRANSCRIPT): The live doctor-patient dialogue is the PRIMARY SOURCE OF TRUTH. You MUST analyze the current chief complaints, acute symptoms, triggers, and statements spoken by the patient in the TRANSCRIPT first and foremost (e.g. abdominal cramps / "معص أو مغص بالبطن", stress / "توتر أو هاكاثون", nausea, chest pain, headache, etc.). NEVER ignore what the patient is actively complaining about in favor of past chronic history.
2. EXTRACTED INFORMATION: extract the EXACT symptoms actually mentioned in the transcript.
3. WHAT NEEDS ATTENTION: 2 to 3 high-yield clinical safety items addressing the active dialogue.
4. SMART QUESTION: generate EXACTLY ONE targeted clarifying question with options ["نعم", "لا", "غير متأكد"] directly clarifying the active symptoms.
5. CLINICAL POSSIBILITIES (MANDATORY >= 2): You MUST ALWAYS provide AT LEAST 2 (minimum 2, up to 3) distinct, scenario-specific clinical differential diagnoses explaining the patient's active symptoms from the transcript. NEVER return only 1 possibility. Calculate realistic probabilities (10-95%) and qualitative likelihoods ("Higher likelihood", "Moderate likelihood", "Lower likelihood"). Provide 1 to 2 discriminating questions for each.
6. MANDATORY CLINICAL KNOWLEDGE REFERENCES (RAG): Cite 2 to 3 applicable references (MOH-SA-PROTOCOLS, PHA-WEQAYA-2024, US-FDA-DRUGS, NICE-GUIDELINES, WHO-ICD-11).
7. Return STRICTLY valid JSON without markdown fences.

JSON Schema:
{
  "extractedInformation": {
    "symptoms": [{"text": "English", "textAr": "عربي"}],
    "duration": "...",
    "trigger": "...",
    "medications": [],
    "allergies": [],
    "relevantHistory": []
  },
  "patientMemoryMatches": [],
  "whatNeedsAttention": [
    {
      "id": "att-1",
      "category": "مؤشر سريري محتمل",
      "categoryAr": "مؤشر سريري محتمل",
      "title": "...",
      "titleAr": "...",
      "severity": "medium"
    }
  ],
  "smartQuestion": {
    "id": "sq-1",
    "question": "English",
    "questionAr": "عربي",
    "options": ["نعم", "لا", "غير متأكد"]
  },
  "clinicalPossibilities": [
    {
      "id": "pos-1",
      "name": "Primary Differential Diagnosis (English)",
      "nameAr": "التشخيص التفريقي الأول (عربي)",
      "likelihood": "Higher likelihood",
      "probability": 82,
      "evidenceFromConversation": ["..."],
      "evidenceFromConversationAr": ["..."],
      "evidenceFromRecord": [],
      "evidenceFromRecordAr": [],
      "discriminatingQuestions": [{"question": "English", "questionAr": "عربي"}]
    },
    {
      "id": "pos-2",
      "name": "Secondary Differential Diagnosis (English)",
      "nameAr": "التشخيص التفريقي الثاني (عربي)",
      "likelihood": "Moderate likelihood",
      "probability": 64,
      "evidenceFromConversation": ["..."],
      "evidenceFromConversationAr": ["..."],
      "evidenceFromRecord": [],
      "evidenceFromRecordAr": [],
      "discriminatingQuestions": [{"question": "English", "questionAr": "عربي"}]
    }
  ],
  "clinicalSummary": { "en": "...", "ar": "..." },
  "clinicalReferences": [
    {
      "tag": "MOH-SA-PROTOCOLS",
      "titleAr": "الأدلة السريرية الوطنية — وزارة الصحة السعودية",
      "titleEn": "Saudi MOH National Clinical Practice Protocols",
      "rationaleAr": "...",
      "url": "https://www.moh.gov.sa"
    }
  ]
}`;

    const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://clinova-insight.vercel.app',
        'X-Title': 'Clinova PreOp Insight'
      },
      body: JSON.stringify({
        model: model,
        temperature: 0.1,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: `1. PRIMARY FOCUS - LIVE DOCTOR-PATIENT CONVERSATION:\n"""\n${transcript}\n"""\n\n2. LIVE CLARIFICATIONS FROM DIALOGUE:\n${JSON.stringify(liveClarifications || [], null, 2)}\n\n3. ANSWERED QUESTION:\n${JSON.stringify(answeredQuestion || 'none')}\n\n4. BACKGROUND PATIENT EHR (SECONDARY CONTEXT):\nName: ${patient?.nameAr || patient?.name || 'Unknown'}\nAllergies: ${JSON.stringify(patient?.allergies || [])}\nChronic: ${JSON.stringify(patient?.chronicConditions || [])}\nMedications: ${JSON.stringify((patient?.medications || []).map(m => m.name))}\nScheduled Procedure: ${patient?.scheduledProcedureAr || patient?.scheduledProcedure || 'General Assessment'}\n\n5. RETRIEVED KNOWLEDGE REFERENCES (RAG):\n${JSON.stringify(retrievedKnowledge || [], null, 2)}`
          }
        ]
      })
    });

    if (!openRouterRes.ok) {
      const errText = await openRouterRes.text();
      return res.status(openRouterRes.status).json({ error: 'OpenRouter Error', details: errText });
    }

    const aiData = await openRouterRes.json();
    const content = aiData.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content || '{}');

    return res.status(200).json({ success: true, data: parsed });
  } catch (err) {
    return res.status(500).json({ error: 'Server Error', message: err.message });
  }
}
