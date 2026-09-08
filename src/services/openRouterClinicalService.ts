import type { Patient } from '../types/clinical';
import { analyzePatientConversation, type AnalysisResult } from './clinicalReasoningEngine';

export interface OpenRouterConfig {
  apiKey?: string;
  model?: string;
}

export async function analyzeConversationWithOpenRouter(
  patient: Patient,
  transcript: string,
  selectedDiscriminatingOptionId?: string,
  config?: OpenRouterConfig
): Promise<AnalysisResult> {
  const apiKey =
    config?.apiKey ||
    (typeof window !== 'undefined' && localStorage.getItem('VITE_OPENROUTER_API_KEY')) ||
    (import.meta as any).env?.VITE_OPENROUTER_API_KEY ||
    (import.meta as any).env?.Openrouter_API_KEY ||
    '';

  const model =
    config?.model ||
    (import.meta as any).env?.VITE_OPENROUTER_MODEL ||
    'openai/gpt-4o-mini';

  // Fallback to local deterministic clinical engine if no API key is provided
  if (!apiKey || !apiKey.trim() || transcript.trim().length < 5) {
    return analyzePatientConversation(patient, transcript, selectedDiscriminatingOptionId);
  }

  const patientContext = `
PATIENT RECORD (EHR):
- Name: ${patient.nameAr} (${patient.name})
- MRN: ${patient.mrn}, National ID: ${patient.nationalId}
- Age: ${patient.age}, Gender: ${patient.genderAr}, Blood: ${patient.bloodGroup}
- Known Allergies: ${patient.allergies.map((a) => `${a.substanceAr} (${a.substance}) - ${a.severity}`).join(', ') || 'No known allergies'}
- Chronic Conditions: ${(patient.chronicConditions || []).map((c) => `${c.nameAr} (${c.name})`).join(', ') || 'None recorded'}
- Scheduled Surgery: ${patient.scheduledProcedureAr} (${patient.scheduledProcedure}) on ${patient.procedureDate}
- Unified Medications across sectors:
  ${patient.medications
    .map(
      (m) =>
        `* [${m.sector}] ${m.name} (${m.genericName}) ${m.dose} - ${m.frequency} (Prescribed: ${m.prescribedDate}, Hospital: ${m.sectorHospitalAr}) [Status: ${m.status}, MentionStatus: ${m.mentionStatus}]`
    )
    .join('\n  ')}
- Past Labs & ECGs:
  ${patient.pastLabs.map((l) => `* ${l.testNameAr} (${l.testName}): Result: ${l.resultAr} [Date: ${l.date}]`).join('\n  ')}
- Past Procedures:
  ${patient.pastProcedures.map((p) => `* ${p.procedureNameAr} (${p.procedureName}) at ${p.hospitalAr} [Date: ${p.date}]`).join('\n  ')}
- Timeline Journey:
  ${patient.timeline.map((t) => `* [${t.year}] ${t.titleAr}: ${t.descriptionAr}`).join('\n  ')}
`;

  const systemPrompt = `You are Clinova AI, a Clinical Decision Support System specializing in perioperative assessment and clinical dialogue analysis.
Your purpose is to assist the attending physician by cross-referencing real-time doctor-patient conversation with the patient's Electronic Health Record (EHR).

Strict Clinical Guidelines:
1. ALWAYS identify if the patient mentions forgotten medications (e.g., "أدوية قلب بس ناسيها") and match them against the patient's EHR (e.g. Aspirin 81mg from NGHA).
2. ALWAYS check if the doctor or patient asks about previous investigations (e.g., "متى سويت تخطيط قلب؟") and retrieve the exact date, hospital, and ECG findings from past labs.
3. ALWAYS check for contradictions between verbal patient statements and EHR documentation (e.g., verbal denial of allergy vs documented Penicillin anaphylaxis).
4. Propose discriminating questions that can narrow down differentials and adjust likelihood percentages.
5. All clinical output must be bilingual (Arabic and English) and output STRICTLY VALID JSON with no markdown backticks.

JSON Output Schema:
{
  "extractedEntities": [
    { "id": "ent-1", "text": "English", "textAr": "عربي", "category": "symptom"|"condition"|"medication"|"vital"|"risk", "confidence": 0.95, "status": "verified"|"unconfirmed"|"conflicting" }
  ],
  "conflicts": [
    { "id": "conf-1", "type": "dosage_mismatch"|"unidentified_drug"|"duplicate_therapy"|"preop_risk", "severity": "high"|"medium"|"low", "title": "English", "titleAr": "عربي", "description": "English", "descriptionAr": "عربي", "affectedSectors": ["MOH","NGHA"], "medicationsInvolved": ["Aspirin"], "recommendedAction": "English", "recommendedActionAr": "عربي", "status": "open"|"resolved" }
  ],
  "missingGaps": [
    { "id": "gap-1", "category": "medication_clarification", "question": "English", "questionAr": "عربي", "clinicalReason": "English", "clinicalReasonAr": "عربي", "resolved": false }
  ],
  "initialDifferentials": [
    {
      "id": "pos-1",
      "condition": "English",
      "conditionAr": "عربي",
      "probability": "high"|"moderate"|"consider",
      "confidencePercent": 85,
      "extractedSymptoms": "English",
      "extractedSymptomsAr": "عربي",
      "inferredCauses": "English",
      "inferredCausesAr": "عربي",
      "evidenceLinks": [
        { "type": "medication"|"timeline"|"symptom", "text": "English", "textAr": "عربي" }
      ]
    }
  ],
  "isNarrowGap": false,
  "weightedDefinitiveDiagnosis": { /* matches ClinicalPossibility structure */ },
  "ruledOutDiagnosis": null,
  "summaryInsights": {
    "en": "Concise English clinical reasoning summary",
    "ar": "ملخص سريري موجز باللغة العربية"
  }
}`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Clinova - Soft Clinical Intelligence'
      },
      body: JSON.stringify({
        model: model,
        temperature: 0.1,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: `CURRENT CONVERSATION TRANSCRIPT:\n"""\n${transcript}\n"""\n\n${patientContext}\n\nSELECTED DISCRIMINATING OPTION ID: ${selectedDiscriminatingOptionId || 'none'}`
          }
        ]
      })
    });

    if (!response.ok) {
      console.warn('OpenRouter API returned error status:', response.status, 'Falling back to local engine.');
      return analyzePatientConversation(patient, transcript, selectedDiscriminatingOptionId);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return analyzePatientConversation(patient, transcript, selectedDiscriminatingOptionId);
    }

    const parsed = JSON.parse(content);
    return {
      extractedEntities: parsed.extractedEntities || [],
      conflicts: parsed.conflicts || [],
      missingGaps: parsed.missingGaps || [],
      dynamicQuestions: [],
      initialDifferentials: parsed.initialDifferentials || [],
      isNarrowGap: !!parsed.isNarrowGap,
      weightedDefinitiveDiagnosis:
        parsed.weightedDefinitiveDiagnosis || parsed.initialDifferentials?.[0],
      ruledOutDiagnosis: parsed.ruledOutDiagnosis || null,
      summaryInsights: parsed.summaryInsights || {
        en: 'Analyzed with OpenRouter AI.',
        ar: 'تم التحليل بواسطة نموذج الذكاء الاصطناعي عبر OpenRouter.'
      }
    };
  } catch (error) {
    console.warn('Failed to fetch from OpenRouter, using local reasoning fallback:', error);
    return analyzePatientConversation(patient, transcript, selectedDiscriminatingOptionId);
  }
}
