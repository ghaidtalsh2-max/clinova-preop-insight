export type SectorSource = 'MOH' | 'NGHA' | 'PRIVATE';

export type TriageLevel = 'high' | 'medium' | 'low';

export interface VitalsSnapshot {
  measuredTimeAgo: string;
  measuredTimeAgoAr: string;
  bp: string;
  bpStatus: 'high' | 'normal' | 'attention';
  heartRate: number;
  hrStatus: 'high' | 'normal' | 'attention';
  temp: string;
  tempStatus: 'normal' | 'high';
  spo2: string;
  spo2Status: 'normal' | 'attention';
}

export interface MedicationRecord {
  id: string;
  name: string;
  genericName: string;
  dose: string;
  frequency: string;
  route: string;
  sector: SectorSource;
  sectorAr: string;
  sectorHospital: string;
  sectorHospitalAr: string;
  status: 'active' | 'previous' | 'discontinued';
  prescribedDate: string;
  prescriberName: string;
  notes?: string;
  notesAr?: string;
  conflictFlag?: boolean;
  conflictDescription?: string;
  conflictDescriptionAr?: string;
  // Unified visual status required by Section 4-D-2:
  // - historical: Grey (from record, not mentioned in current dialogue)
  // - mentioned: Amber (mentioned by patient in current session & matched)
  // - unmatched: Dashed border (mentioned by patient, no match found)
  // - conflict: Red/Crit (actual conflict between 2 sectors)
  mentionStatus: 'historical' | 'mentioned' | 'unmatched' | 'conflict';
}

export interface PastProcedureRecord {
  id: string;
  procedureName: string;
  procedureNameAr: string;
  date: string;
  hospital: string;
  hospitalAr: string;
  mentionStatus: 'historical' | 'mentioned' | 'unmatched';
}

export interface LabECGRecord {
  id: string;
  testName: string;
  testNameAr: string;
  result: string;
  resultAr: string;
  date: string;
  status: 'normal' | 'attention' | 'critical';
  mentionStatus: 'historical' | 'mentioned';
}

export interface TimelineEvent {
  id: string;
  year: number;
  date: string;
  title: string;
  titleAr: string;
  type: 'diagnosis' | 'procedure' | 'medication' | 'er_visit' | 'lab' | 'surgery';
  sector: SectorSource;
  sectorAr: string;
  description: string;
  descriptionAr: string;
  clinicalValue?: string;
  clinicalValueAr?: string;
  highlight?: boolean;
  severity?: 'critical' | 'moderate' | 'routine';
  doctor?: string;
}

export interface ExtractedEntity {
  id: string;
  text: string;
  textAr: string;
  category: 'symptom' | 'condition' | 'medication' | 'vital' | 'risk';
  confidence: number;
  status: 'verified' | 'unconfirmed' | 'conflicting';
}

export interface MissingGap {
  id: string;
  category: 'medication_clarification' | 'symptom_onset' | 'preop_lab' | 'surgical_history';
  question: string;
  questionAr: string;
  clinicalReason: string;
  clinicalReasonAr: string;
  resolved: boolean;
  answer?: string;
}

export interface DynamicQuestion {
  id: string;
  text: string;
  textAr: string;
  context: string;
  contextAr: string;
  status: 'pending' | 'asked' | 'answered';
  suggestedAnswers?: { label: string; labelAr: string; value: string }[];
  answer?: string;
}

export interface ConflictItem {
  id: string;
  type: 'dosage_mismatch' | 'unidentified_drug' | 'duplicate_therapy' | 'preop_risk';
  severity: 'high' | 'medium' | 'low';
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  affectedSectors: SectorSource[];
  medicationsInvolved: string[];
  recommendedAction: string;
  recommendedActionAr: string;
  status: 'open' | 'resolved' | 'dismissed';
}

export interface LiveQuestionItem {
  id: string;
  clinicalImportance: string;
  clinicalImportanceAr: string;
  question: string;
  questionAr: string;
  isAsked: boolean;
}

export interface DiscriminatingOption {
  id: string;
  text: string;
  textAr: string;
  isAutoInferred?: boolean;
  pointsToDiagnosisId: string;
}

export interface DiscriminatingQuestion {
  id: string;
  title: string;
  titleAr: string;
  clinicalRationale: string;
  clinicalRationaleAr: string;
  question: string;
  questionAr: string;
  autoInferredChoiceIndex: number;
  autoInferredBadge: string;
  autoInferredBadgeAr: string;
  options: DiscriminatingOption[];
  selectedOptionId?: string;
}

export interface ClinicalPossibility {
  id: string;
  condition: string;
  conditionAr: string;
  probability: 'high' | 'moderate' | 'consider';
  confidencePercent: number; // e.g. 88
  extractedSymptoms: string;
  extractedSymptomsAr: string;
  inferredCauses: string;
  inferredCausesAr: string;
  evidenceLinks: {
    type: 'medication' | 'timeline' | 'symptom';
    text: string;
    textAr: string;
  }[];
  isRuledOut?: boolean;
}

export interface PreOpSummary {
  asaClass: string;
  airwayRisk: string;
  airwayRiskAr: string;
  cardiacRisk: string;
  cardiacRiskAr: string;
  metabolicStatus: string;
  metabolicStatusAr: string;
  surgicalProcedure: string;
  surgicalProcedureAr: string;
  plannedDate: string;
  medicationPlan: {
    medication: string;
    dose: string;
    sector: SectorSource;
    action: 'continue' | 'hold_24h' | 'hold_morning_of_surgery' | 'reconcile';
    actionAr: string;
    rationale: string;
    rationaleAr: string;
  }[];
  verifiedByClinician: boolean;
  clinicianName?: string;
  approvalTimestamp?: string;
  clinicianNotes?: string;
}

export interface DialogueUtterance {
  id: string;
  speaker: 'doctor' | 'patient';
  speakerName: string;
  speakerNameAr: string;
  text: string;
  textAr: string;
  timestamp: string;
}

export interface Patient {
  id: string;
  photoUrl: string;
  nationalId: string;
  mrn: string;
  name: string;
  nameAr: string;
  age: number;
  gender: 'male' | 'female';
  genderAr: string;
  bloodGroup: string;
  allergies: { substance: string; substanceAr: string; severity: string }[];
  chronicConditions?: { name: string; nameAr: string }[];
  visitReason?: string;
  visitReasonAr?: string;
  clinicName?: string;
  clinicNameAr?: string;
  doctorName?: string;
  doctorNameAr?: string;
  scheduledProcedure: string;
  scheduledProcedureAr: string;
  procedureDate: string;
  appointmentTime: string;
  appointmentTimeAr: string;
  triageLevel: TriageLevel;
  hospital: string;
  hospitalAr: string;
  primaryDiagnosis: string;
  primaryDiagnosisAr: string;
  sectors: SectorSource[];
  vitals: VitalsSnapshot;
  medications: MedicationRecord[];
  pastProcedures: PastProcedureRecord[];
  pastLabs: LabECGRecord[];
  timeline: TimelineEvent[];
  initialDialogue: DialogueUtterance[];
  defaultTranscript: string;
  defaultTranscriptAr: string;
  liveQuestions: LiveQuestionItem[];
  discriminatingQuestion: DiscriminatingQuestion;
  visitStatus?: 'In Progress' | 'Waiting' | 'Completed';
  visitStatusAr?: 'قيد المعاينة' | 'بالانتظار' | 'مكتمل';
  preOpSummary: PreOpSummary;
}
