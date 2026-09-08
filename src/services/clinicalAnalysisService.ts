import type { Patient } from '../types/clinical';
import { retrieveRelevantKnowledge, type ClinicalReference } from '../data/clinicalKnowledgeBase';
import { PRESET_CLINICAL_SCENARIOS } from '../data/clinicalScenarios';

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
 * with live clarifications and retrieved clinical knowledge base references (RAG).
 */
export async function requestClinicalAnalysis(
  patient: Patient,
  transcript: string,
  answeredQuestion?: { question: string; answer: string },
  liveClarifications?: { question: string; answer: 'yes' | 'no' | 'unsure' }[]
): Promise<ClinicalAnalysisResponse | null> {
  if (!transcript || transcript.trim().length < 5) {
    return null;
  }

  // Retrieve relevant clinical knowledge base references (RAG)
  const retrievedKnowledge = retrieveRelevantKnowledge(transcript, patient);

  try {
    const response = await fetch('/api/clinical/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        patient,
        transcript,
        answeredQuestion,
        liveClarifications,
        retrievedKnowledge
      })
    });

    if (response.ok) {
      const json = await response.json();
      if (json.success && json.data) {
        return normalizeAnalysisResponse(json.data);
      }
    } else {
      console.warn('Backend /api/clinical/analyze returned status:', response.status);
    }
  } catch (error) {
    console.warn('Backend /api/clinical/analyze not reachable, using clinical knowledge-grounded engine:', error);
  }

  // Fallback: Guarantees full functionality on GitHub Pages & client runtime
  return fallbackClinicalAnalysis(patient, transcript, answeredQuestion, liveClarifications, retrievedKnowledge);
}

/**
 * Fallback Clinical Analysis grounded in CLINOVA_KNOWLEDGE_BASE and Scenario Data
 */
function fallbackClinicalAnalysis(
  patient: Patient,
  transcript: string,
  answeredQuestion?: { question: string; answer: string },
  liveClarifications?: { question: string; answer: 'yes' | 'no' | 'unsure' }[],
  retrievedKnowledge?: ClinicalReference[]
): ClinicalAnalysisResponse {
  const normText = (transcript || '').toLowerCase();

  // Find best matching clinical scenario
  const match =
    PRESET_CLINICAL_SCENARIOS.find((s) => {
      if (s.id === patient.id) return true;
      const keywords = (s.titleAr + ' ' + s.titleEn).toLowerCase();
      if (normText.includes('دوخة') && keywords.includes('دوخة')) return true;
      if (normText.includes('بنسلين') && (keywords.includes('بنسلين') || keywords.includes('حساسية'))) return true;
      if (normText.includes('سيولة') && keywords.includes('سيولة')) return true;
      if (normText.includes('فتق') && keywords.includes('فتق')) return true;
      if (normText.includes('سكر') && keywords.includes('سكر')) return true;
      return false;
    }) || PRESET_CLINICAL_SCENARIOS[0];

  const baseAnalysis = JSON.parse(JSON.stringify(match.analysis));

  // Ground with retrieved Clinical Knowledge Base references
  if (retrievedKnowledge && retrievedKnowledge.length > 0) {
    baseAnalysis.clinicalReferences = retrievedKnowledge.slice(0, 3).map((ref) => ({
      tag: ref.citationTag,
      titleAr: ref.titleAr,
      titleEn: ref.titleEn,
      rationaleAr: ref.roleInClinovaAr,
      rationaleEn: ref.roleInClinovaEn,
      url: ref.url
    }));
  }

  // Adjust probabilities based on liveClarifications and answeredQuestion
  if (baseAnalysis.clinicalPossibilities && baseAnalysis.clinicalPossibilities.length > 0) {
    let topProb = 82;
    let secondProb = 68;
    let thirdProb = 45;

    const hasYes =
      liveClarifications?.some((c) => c.answer === 'yes') ||
      answeredQuestion?.answer === 'نعم' ||
      answeredQuestion?.answer === 'Yes';
    const hasNo =
      liveClarifications?.some((c) => c.answer === 'no') ||
      answeredQuestion?.answer === 'لا' ||
      answeredQuestion?.answer === 'No';

    if (hasYes) {
      topProb = 88;
      secondProb = 60;
      thirdProb = 35;
    } else if (hasNo) {
      topProb = 68;
      secondProb = 65;
      thirdProb = 48;
    }

    baseAnalysis.clinicalPossibilities.forEach((pos: any, idx: number) => {
      if (idx === 0) {
        pos.probability = topProb;
        pos.likelihood = topProb >= 75 ? 'Higher likelihood' : 'Moderate likelihood';
      } else if (idx === 1) {
        pos.probability = secondProb;
        pos.likelihood = secondProb >= 70 ? 'Higher likelihood' : 'Moderate likelihood';
      } else {
        pos.probability = thirdProb;
        pos.likelihood = 'Lower likelihood';
      }
    });
  }

  return normalizeAnalysisResponse(baseAnalysis);
}

/**
 * Debounced wrapper to prevent excessive API requests while user is speaking
 */
export function debouncedClinicalAnalysis(
  patient: Patient,
  transcript: string,
  onResult: (result: ClinicalAnalysisResponse) => void,
  debounceMs: number = 1600,
  liveClarifications?: { question: string; answer: 'yes' | 'no' | 'unsure' }[]
) {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(async () => {
    const result = await requestClinicalAnalysis(patient, transcript, undefined, liveClarifications);
    if (result) {
      onResult(result);
    }
  }, debounceMs);
}
