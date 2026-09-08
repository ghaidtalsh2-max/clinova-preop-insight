import type { Patient } from '../types/clinical';

export interface ExtractedInfoItem {
  symptoms: { text: string; textAr: string }[];
  duration: string;
  trigger: string;
  medications: { name: string; status: string }[];
  allergies: string[];
  relevantHistory: string[];
}

export interface PatientMemoryMatchItem {
  category: string;
  matchedEntity: string;
  matchedEntityAr: string;
  source: string;
  statement: string;
  statementAr: string;
}

export interface WhatNeedsAttentionItem {
  id: string;
  category: string;
  categoryAr: string;
  title: string;
  titleAr: string;
  severity: 'high' | 'medium' | 'low';
}

export interface SmartQuestionItem {
  id: string;
  question: string;
  questionAr: string;
  options: string[];
}

export interface ClinicalPossibilityItem {
  id: string;
  name: string;
  nameAr: string;
  likelihood: 'Higher likelihood' | 'Moderate likelihood' | 'Lower likelihood';
  probability?: number;
  evidenceFromConversation: string[];
  evidenceFromConversationAr: string[];
  evidenceFromRecord: string[];
  evidenceFromRecordAr: string[];
  discriminatingQuestions: {
    question: string;
    questionAr: string;
  }[];
}

export interface DifferentialDiagnosis {
  id: string;
  name: string;
  nameAr: string;
  likelihood: 'Higher likelihood' | 'Moderate likelihood' | 'Lower likelihood';
  probability?: number;
  discriminatingQuestion?: string;
  discriminatingQuestionAr?: string;
  evidence?: string[];
  evidenceAr?: string[];
}

export interface ClinicalReferenceCitation {
  tag: string;
  titleAr: string;
  titleEn: string;
  rationaleAr: string;
  rationaleEn?: string;
  url: string;
}

export interface ClinicalAnalysisResponse {
  extractedInformation: ExtractedInfoItem;
  patientMemoryMatches: PatientMemoryMatchItem[];
  whatNeedsAttention: WhatNeedsAttentionItem[];
  smartQuestion: SmartQuestionItem;
  clinicalPossibilities: ClinicalPossibilityItem[];
  differentialDiagnoses?: DifferentialDiagnosis[];
  clinicalSummary: {
    en: string;
    ar: string;
  };
  clinicalReferences?: ClinicalReferenceCitation[];
}

let debounceTimer: any = null;

/**
 * Normalizes clinical possibilities to ensure both clinicalPossibilities and differentialDiagnoses exist
 */
function normalizeAnalysisResponse(data: any): ClinicalAnalysisResponse {
  if (!data) return data;

  // Derive probability if missing
  const possibilities: ClinicalPossibilityItem[] = (data.clinicalPossibilities || []).map((p: any, idx: number) => {
    let prob = p.probability;
    if (!prob) {
      if (p.likelihood === 'Higher likelihood') prob = idx === 0 ? 82 : 72;
      else if (p.likelihood === 'Moderate likelihood') prob = 58;
      else prob = 35;
    }
    return { ...p, probability: prob };
  });

  // Map to differentialDiagnoses
  const differentialDiagnoses: DifferentialDiagnosis[] = data.differentialDiagnoses || possibilities.map((p) => ({
    id: p.id,
    name: p.name,
    nameAr: p.nameAr,
    likelihood: p.likelihood,
    probability: p.probability,
    discriminatingQuestion: p.discriminatingQuestions?.[0]?.question || '',
    discriminatingQuestionAr: p.discriminatingQuestions?.[0]?.questionAr || '',
    evidence: p.evidenceFromConversation,
    evidenceAr: p.evidenceFromConversationAr
  }));

  return {
    ...data,
    clinicalPossibilities: possibilities,
    differentialDiagnoses
  };
}

/**
 * Sends conversation transcript and patient record to secure backend endpoint /api/clinical/analyze
 * which calls OpenRouter with verified models (OpenAI/Llama) and returns structured clinical data.
 */
export async function requestClinicalAnalysis(
  patient: Patient,
  transcript: string,
  answeredQuestion?: { question: string; answer: string }
): Promise<ClinicalAnalysisResponse | null> {
  if (!transcript || transcript.trim().length < 5) {
    return null;
  }

  try {
    const response = await fetch('/api/clinical/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        patient,
        transcript,
        answeredQuestion
      })
    });

    if (!response.ok) {
      console.warn('Server clinical analysis returned non-200 status:', response.status);
      return null;
    }

    const json = await response.json();
    if (json.success && json.data) {
      return normalizeAnalysisResponse(json.data);
    }
    return null;
  } catch (error) {
    console.error('Failed to request clinical analysis:', error);
    return null;
  }
}

/**
 * Debounced wrapper to prevent excessive API requests while user is speaking
 */
export function debouncedClinicalAnalysis(
  patient: Patient,
  transcript: string,
  onResult: (result: ClinicalAnalysisResponse) => void,
  debounceMs: number = 1600
) {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(async () => {
    const result = await requestClinicalAnalysis(patient, transcript);
    if (result) {
      onResult(result);
    }
  }, debounceMs);
}
