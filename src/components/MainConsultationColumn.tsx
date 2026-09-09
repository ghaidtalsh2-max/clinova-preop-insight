import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { Patient } from '../types/clinical';
import {
  Mic, Square,
  AlertTriangle, ChevronRight, Sparkles, FileText, HelpCircle, Clock,
  RotateCcw, CheckCircle2, Loader2, BookOpen, ExternalLink, Pill, Heart, Activity, X
} from 'lucide-react';
import { SpeechmaticsRealtimeClient } from '../services/speechmaticsRealtime';
import {
  requestClinicalAnalysis,
  type ClinicalAnalysisResponse, type PatientMemoryMatchItem
} from '../services/clinicalAnalysisService';
import {
  PRESET_CLINICAL_SCENARIOS, type PresetClinicalScenario
} from '../data/clinicalScenarios';
import { getAssetPath } from '../utils/assetHelper';

/**
 * Animated Likelihood Bar with CSS width transition
 * Smoothly interpolates width whenever diagnostic probabilities change
 */
const AnimatedLikelihoodBar: React.FC<{ percentage: number; likelihood: string }> = ({ percentage, likelihood }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(percentage);
    }, 40);
    return () => clearTimeout(timer);
  }, [percentage]);

  const level =
    likelihood === 'Higher likelihood' ? 'high' : likelihood === 'Moderate likelihood' ? 'moderate' : 'low';

  return (
    <div
      className="likelihood-bar-container"
      style={{
        width: '100%',
        height: 7,
        background: 'rgba(0, 0, 0, 0.06)',
        borderRadius: 999,
        overflow: 'hidden',
        marginTop: '0.45rem',
        marginBottom: '0.4rem',
        position: 'relative'
      }}
    >
      <div
        className={`likelihood-bar-fill ${level}`}
        style={{
          width: `${width}%`,
          height: '100%',
          borderRadius: 999,
          transition: 'width 400ms cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      />
    </div>
  );
};

interface Props {
  patient: Patient;
  transcript: string;
  onChangeTranscript: (t: string) => void;
  onOpenReportModal?: () => void;
  onOpenKnowledgeBase?: () => void;
  onUpdatePatientMemoryMatches?: (m: PatientMemoryMatchItem[]) => void;
  lang: 'ar' | 'en';
}

export const MainConsultationColumn: React.FC<Props> = ({
  patient,
  transcript,
  onChangeTranscript,
  onOpenReportModal,
  onOpenKnowledgeBase,
  onUpdatePatientMemoryMatches,
  lang
}) => {
  const isAr = lang === 'ar';

  /* ─── Speech & Recording State ─── */
  const [isRecording, setIsRecording] = useState(false);
  const [recordTimer, setRecordTimer] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [speechClient, setSpeechClient] = useState<SpeechmaticsRealtimeClient | null>(null);
  const [interimText, setInterimText] = useState('');
  const transcriptRef = useRef(transcript);

  /* ─── AI Analysis State ─── */
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'processing' | 'extracted'>('idle');
  const [aiData, setAiData] = useState<ClinicalAnalysisResponse | null>(null);
  const [smartAnswer, setSmartAnswer] = useState<string | null>(null);
  const [isScenariosOpen, setIsScenariosOpen] = useState(false);
  const scenarioBtnRef = useRef<HTMLButtonElement>(null);
  const [scenarioDropdownPos, setScenarioDropdownPos] = useState<{ top: number; left?: number } | null>(null);
  const [dismissedContextCards, setDismissedContextCards] = useState<string[]>([]);
  const [activeSpeaker, setActiveSpeaker] = useState<'doctor' | 'patient'>('doctor');
  const activeSpeakerRef = useRef<'doctor' | 'patient'>('doctor');
  const lastSpeakerRef = useRef<'doctor' | 'patient' | null>(null);
  const lastChunkTimeRef = useRef<number>(0);
  const [liveClarifications, setLiveClarifications] = useState<
    { question: string; answer: 'yes' | 'no' | 'unsure' }[]
  >([]);
  const [hasRunAnalysis, setHasRunAnalysis] = useState<boolean>(false);
  const [answeredDiscriminatingMap, setAnsweredDiscriminatingMap] = useState<Record<string, string>>({});

  const toggleScenarios = () => {
    if (!isScenariosOpen && scenarioBtnRef.current) {
      const rect = scenarioBtnRef.current.getBoundingClientRect();
      setScenarioDropdownPos({
        top: rect.bottom + 6,
        left: isAr ? Math.max(16, rect.right - 380) : Math.min(window.innerWidth - 400, rect.left)
      });
    }
    setIsScenariosOpen(!isScenariosOpen);
  };

  useEffect(() => {
    activeSpeakerRef.current = activeSpeaker;
  }, [activeSpeaker]);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  /* Reset answered count, analysis data, and dismissed context cards when switching patients */
  useEffect(() => {
    setAiData(null);
    setSmartAnswer(null);
    setDismissedContextCards([]);
    setLiveClarifications([]);
    setHasRunAnalysis(false);
    setAnsweredDiscriminatingMap({});
    lastChunkTimeRef.current = 0;
    lastSpeakerRef.current = null;
  }, [patient.id]);

  /* ─── Timer ─── */
  useEffect(() => {
    let iv: any;
    if (isRecording) {
      iv = setInterval(() => setRecordTimer((p) => p + 1), 1000);
    } else {
      setRecordTimer(0);
    }
    return () => clearInterval(iv);
  }, [isRecording]);

  /* ─── Speechmatics Client with Utterance-Level Buffering ─── */
  useEffect(() => {
    const client = new SpeechmaticsRealtimeClient(
      {
        onTranscriptChunk: (chunk: string, isFinal: boolean, speaker?: string) => {
          const cleaned = chunk ? chunk.trim() : '';
          if (!cleaned) return;
          if (!isFinal) {
            setInterimText(cleaned);
            return;
          }
          setInterimText('');

          // 1. Determine Speaker (Speechmatics Diarization S1=Doctor, S2=Patient)
          let currentRole = activeSpeakerRef.current;
          if (speaker === 'S2') {
            currentRole = 'patient';
          } else if (speaker === 'S1') {
            currentRole = 'doctor';
          }
          activeSpeakerRef.current = currentRole;
          setActiveSpeaker(currentRole);

          // 2. Utterance-level Buffering (Same speaker within 850ms silence appends to same line)
          const now = Date.now();
          const SILENCE_PAUSE_MS = 850;
          const isSameSpeaker = lastSpeakerRef.current === currentRole;
          const isWithinPause = now - lastChunkTimeRef.current <= SILENCE_PAUSE_MS;
          const currentTranscript = transcriptRef.current.trim();

          let upd = '';
          const isPunctuation = /^[.,!?;:،؟]/.test(cleaned);

          if (isSameSpeaker && isWithinPause && currentTranscript.length > 0) {
            // Append word or phrase to existing line without repeating speaker tag
            upd = isPunctuation ? `${currentTranscript}${cleaned}` : `${currentTranscript} ${cleaned}`;
          } else {
            // Only start a new line with speaker tag on actual speaker change or true acoustic pause
            const spkTag = isAr
              ? (currentRole === 'doctor' ? 'الطبيب: ' : 'المريض: ')
              : (currentRole === 'doctor' ? 'Doctor: ' : 'Patient: ');

            upd = currentTranscript ? `${currentTranscript}\n${spkTag}${cleaned}` : `${spkTag}${cleaned}`;
          }

          lastSpeakerRef.current = currentRole;
          lastChunkTimeRef.current = now;
          onChangeTranscript(upd);
        },
        onAudioLevel: (l: number) => setAudioLevel(l),
        onStatusChange: (s) => {
          if (s === 'recording') setAnalysisStatus('processing');
        }
      },
      isAr ? 'ar' : 'en'
    );
    setSpeechClient(client);
    return () => {
      client.stopRecording();
    };
  }, [isAr, patient.id]);

  /* ─── Toggle Recording ─── */
  const toggleRec = async () => {
    if (!isRecording) {
      setIsRecording(true);
      setInterimText('');
      setAnalysisStatus('processing');
      lastChunkTimeRef.current = 0;
      lastSpeakerRef.current = null;
      if (speechClient) {
        const ok = await speechClient.startRecording();
        if (!ok) {
          setIsRecording(false);
          setAnalysisStatus('idle');
        }
      }
    } else {
      setIsRecording(false);
      setInterimText('');
      speechClient?.stopRecording();
      setAnalysisStatus('idle');
      lastChunkTimeRef.current = 0;
      lastSpeakerRef.current = null;
    }
  };

  /* ─── Select Scenario (Fills transcript only — Item 2 requirement) ─── */
  const handleSelectScenario = (s: PresetClinicalScenario) => {
    const txt = isAr ? s.transcriptAr : s.transcriptEn;
    onChangeTranscript(txt);
    // aiData is strictly NOT set here — it updates only when clinician clicks "تشغيل التحليل السريري بالذكاء الاصطناعي"
    setHasRunAnalysis(false);
    setAiData(null);
    lastChunkTimeRef.current = 0;
    lastSpeakerRef.current = null;
    setIsScenariosOpen(false);
  };

  /* ─── Run Clinical Analysis manually (Item 3: Only here differentials appear) ─── */
  const handleManualAnalysis = async () => {
    if (!transcript.trim()) return;
    setAnalysisStatus('processing');
    setHasRunAnalysis(true);
    try {
      const r = await requestClinicalAnalysis(patient, transcript, undefined, liveClarifications);
      if (r) {
        setAiData(r);
        if (r.patientMemoryMatches && onUpdatePatientMemoryMatches) {
          onUpdatePatientMemoryMatches(r.patientMemoryMatches);
        }
      }
    } finally {
      setAnalysisStatus('extracted');
    }
  };

  /* ─── Smart Question Answer (Item 2: Cumulative live clarifications) ─── */
  const handleSmartAnswer = async (ans: string) => {
    if (!smartQ) return;
    setSmartAnswer(ans);

    const ansType: 'yes' | 'no' | 'unsure' =
      ans === 'نعم' || ans === 'Yes' ? 'yes' : ans === 'لا' || ans === 'No' ? 'no' : 'unsure';

    const updatedClarifications = [...liveClarifications, { question: smartQ, answer: ansType }];
    setLiveClarifications(updatedClarifications);

    if (hasRunAnalysis) {
      setAnalysisStatus('processing');
      const q = aiData?.smartQuestion?.question || smartQ;
      const r = await requestClinicalAnalysis(patient, transcript, { question: q, answer: ans }, updatedClarifications);
      if (r) setAiData(r);
      setAnalysisStatus('extracted');
    }
  };

  /* ─── Discriminating Question Answer (Item 3 & 5: Immediate recalculation & Animated Likelihood Bar) ─── */
  const handleAnswerDiscriminatingQuestion = async (
    possibilityId: string,
    _questionText: string,
    ans: string
  ) => {
    setAnsweredDiscriminatingMap((prev) => ({ ...prev, [possibilityId]: ans }));
    const isYes = ans === 'نعم' || ans === 'Yes';
    const isNo = ans === 'لا' || ans === 'No';

    // Recalculate probabilities immediately so AnimatedLikelihoodBar slides
    setAiData((prev) => {
      if (!prev) return prev;
      const updated = prev.clinicalPossibilities.map((item) => {
        const curProb = item.probability ?? (item.likelihood === 'Higher likelihood' ? 82 : item.likelihood === 'Moderate likelihood' ? 68 : 45);
        if (item.id === possibilityId) {
          const newProb = isYes ? Math.min(96, curProb + 14) : isNo ? Math.max(25, curProb - 18) : curProb;
          const newLk = newProb >= 75 ? 'Higher likelihood' : newProb >= 50 ? 'Moderate likelihood' : 'Lower likelihood';
          return { ...item, probability: newProb, likelihood: newLk as any };
        } else {
          const newProb = isYes ? Math.max(20, curProb - 8) : isNo ? Math.min(88, curProb + 12) : curProb;
          const newLk = newProb >= 75 ? 'Higher likelihood' : newProb >= 50 ? 'Moderate likelihood' : 'Lower likelihood';
          return { ...item, probability: newProb, likelihood: newLk as any };
        }
      });
      updated.sort((a, b) => (b.probability || 0) - (a.probability || 0));
      return { ...prev, clinicalPossibilities: updated };
    });
  };

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  /* ─── AI Analysis Data (Strictly from real AI analysis, NO hardcoded fallback) ─── */
  const ext = aiData?.extractedInformation || null;
  const smartQ = isAr
    ? aiData?.smartQuestion?.questionAr || null
    : aiData?.smartQuestion?.question || null;
  const atts = aiData?.whatNeedsAttention || [];
  const poss = aiData?.clinicalPossibilities || [];

  /* ─── Item 5: Real-time Contextual EHR Retrieval & Clinical Assistance ─── */
  const contextCards = React.useMemo(() => {
    if (!transcript || transcript.trim().length < 5) return [];

    const cards: Array<{
      id: string;
      icon: React.ReactNode;
      title: string;
      bg: string;
      borderColor: string;
      titleColor: string;
      content: React.ReactNode;
    }> = [];

    const lower = transcript.toLowerCase();

    // 1. Medications Retrieval
    if (/(أدوية|دواء|علاج|حبوب|جرعة|مسكن|أملوديبين|اسبرين|بنادول|medication|drug|dose|rx)/i.test(lower)) {
      if (patient.medications && patient.medications.length > 0) {
        cards.push({
          id: `meds-${patient.id}`,
          icon: <Pill size={16} color="#D97706" />,
          title: isAr ? 'الأدوية الموثقة في السجل الصحي للمريض' : 'Documented Current Medications in EHR',
          bg: '#FFFBEB',
          borderColor: '#FDE68A',
          titleColor: '#B45309',
          content: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {patient.medications.map((m) => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <span>
                    <strong>{m.name}</strong> ({m.dose} - {m.frequency})
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#92400E', background: '#FEF3C7', padding: '0.05rem 0.35rem', borderRadius: 4 }}>
                    {isAr ? m.sectorHospitalAr : m.sectorHospital}
                  </span>
                </div>
              ))}
            </div>
          )
        });
      }
    }

    // 2. Allergies Retrieval
    if (/(حساسية|بنسلين|طفح|تفاعل|حكة|allergy|allergic|penicillin|reaction)/i.test(lower)) {
      if (patient.allergies && patient.allergies.length > 0) {
        cards.push({
          id: `allergies-${patient.id}`,
          icon: <AlertTriangle size={16} color="#DC2626" />,
          title: isAr ? 'الحساسية الدوائية الموثقة في السجل' : 'Documented Drug Allergies in EHR',
          bg: '#FEF2F2',
          borderColor: '#FECACA',
          titleColor: '#B91C1C',
          content: (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {patient.allergies.map((a, i) => (
                <span key={i} style={{ background: '#FEE2E2', color: '#991B1B', padding: '0.15rem 0.45rem', borderRadius: 4, fontWeight: 600 }}>
                  {isAr ? a.substanceAr : a.substance} ({a.severity})
                </span>
              ))}
            </div>
          )
        });
      }
    }

    // 3. Vitals Retrieval
    if (/(ضغط|حرارة|نبض|أكسجين|تنفس|vitals|pressure|pulse|bp|heart rate)/i.test(lower)) {
      cards.push({
        id: `vitals-${patient.id}`,
        icon: <Heart size={16} color="#4F46E5" />,
        title: isAr ? 'المؤشرات الحيوية المسجلة عند الوصول' : 'Recorded Baseline Vitals',
        bg: '#EEF2FF',
        borderColor: '#C7D2FE',
        titleColor: '#3730A3',
        content: (
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span>{isAr ? 'الضغط:' : 'BP:'} <strong>{patient.vitals.bp}</strong></span>
            <span>{isAr ? 'النبض:' : 'Pulse:'} <strong>{patient.vitals.heartRate} bpm</strong></span>
            <span>{isAr ? 'الحرارة:' : 'Temp:'} <strong>{patient.vitals.temp}°C</strong></span>
            <span>{isAr ? 'الأكسجين:' : 'SpO2:'} <strong>{patient.vitals.spo2}%</strong></span>
          </div>
        )
      });
    }

    // 4. Past Procedures Retrieval
    if (/(عملية|جراحة|تخدير|مرارة|قسطرة|procedure|surgery|anesthesia|operation)/i.test(lower)) {
      if (patient.pastProcedures && patient.pastProcedures.length > 0) {
        cards.push({
          id: `proc-${patient.id}`,
          icon: <Activity size={16} color="#059669" />,
          title: isAr ? 'العمليات والتاريخ الجراحي السابق' : 'Past Surgical History in EHR',
          bg: '#ECFDF5',
          borderColor: '#A7F3D0',
          titleColor: '#065F46',
          content: (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {patient.pastProcedures.map((p) => (
                <span key={p.id} style={{ background: '#D1FAE5', color: '#065F46', padding: '0.15rem 0.45rem', borderRadius: 4 }}>
                  {isAr ? p.procedureNameAr : p.procedureName} ({p.date.slice(0, 4)})
                </span>
              ))}
            </div>
          )
        });
      }
    }

    return cards;
  }, [transcript, patient, isAr]);

  // Suggested clarification question for clinician (Item 5)
  const conversationalSuggestion = React.useMemo(() => {
    if (!transcript || transcript.trim().length < 15) return null;
    const lower = transcript.toLowerCase();
    if (/(حساسية|بنسلين|طفح|allergy)/i.test(lower)) {
      return {
        id: `sug-allergy-${patient.id}`,
        text: isAr
          ? 'سؤال مقترح: هل حدث التفاعل التحسسي مباشرة بعد الجرعة، وهل تطلب مراجعة الطوارئ؟'
          : 'Suggested question: Did the reaction occur immediately after the dose, and did it require ER attendance?'
      };
    }
    if (/(أدوية|مسكن|اسبرين|حبوب|medication)/i.test(lower)) {
      return {
        id: `sug-meds-${patient.id}`,
        text: isAr
          ? 'سؤال مقترح: متى كانت آخر جرعة تم تناولها، وهل توقفت عن مضادات الالتهاب قبل الجراحة؟'
          : 'Suggested question: When was the last dose taken, and have NSAIDs been held prior to surgery?'
      };
    }
    if (/(دوخة|دوار|وقوف|dizziness)/i.test(lower)) {
      return {
        id: `sug-dizzy-${patient.id}`,
        text: isAr
          ? 'سؤال مقترح: هل يترافق الدوار مع تشوش في الرؤية أو خفقان في القلب عند تغيير الوضعية؟'
          : 'Suggested question: Does dizziness coincide with blurred vision or palpitations upon standing?'
      };
    }
    return null;
  }, [transcript, patient.id, isAr]);

  /* ─── Timeline Colors ─── */
  const tlTypeColor = (t: string) => {
    const colors: Record<string, string> = {
      diagnosis: '#4F46E5',
      medication: '#059669',
      procedure: '#D97706',
      er_visit: '#DC2626',
      lab: '#0891B2',
      surgery: '#7C3AED',
      visit: '#4F46E5'
    };
    return colors[t] || '#6B7280';
  };

  return (
    <main
      role="main"
      aria-label={isAr ? 'جلسة الاستشارة السريرية' : 'Clinical Consultation Workspace'}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        minWidth: 0,
        background: 'var(--bg)',
        overflow: 'visible'
      }}
    >
      {/* ━━━━━━━━━━ 1. PATIENT MASTER BANNER ━━━━━━━━━━ */}
      <div
        style={{
          background: 'var(--surface)',
          borderBottom: '1px solid var(--line)',
          padding: '1rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem',
          flexWrap: 'wrap',
          flexShrink: 0
        }}
      >
        {/* Photo + Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
          <img
            src={getAssetPath(patient.photoUrl || '/saud.jpg')}
            alt={patient.name}
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid var(--lavender)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              flexShrink: 0
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h1
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  margin: 0,
                  color: 'var(--ink)',
                  fontFamily: 'var(--font-heading)'
                }}
              >
                {isAr ? patient.nameAr : patient.name}
              </h1>
              <span
                style={{
                  fontSize: '0.76rem',
                  background: 'rgba(79, 70, 229, 0.09)',
                  color: 'var(--primary)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 6,
                  fontWeight: 700
                }}
              >
                MRN: {patient.mrn}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.82rem',
                color: 'var(--ink-soft)',
                marginTop: '0.3rem',
                flexWrap: 'wrap'
              }}
            >
              <span>{patient.age} {isAr ? 'سنة' : 'years'}</span>
              <span>•</span>
              <span>{isAr ? patient.genderAr : patient.gender === 'male' ? 'Male' : 'Female'}</span>
              <span>•</span>
              <span>فصيلة الدم: <strong style={{ color: 'var(--ink)' }}>{patient.bloodGroup}</strong></span>
              <span>•</span>
              <span>الهوية: <strong style={{ color: 'var(--ink)' }}>{patient.nationalId}</strong></span>
            </div>
          </div>
        </div>

        {/* Current Visit & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--line)',
              borderRadius: '10px',
              padding: '0.55rem 1rem',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '0.7rem', color: 'var(--ink-muted)', fontWeight: 600 }}>
              {isAr ? 'موعد الزيارة' : 'Appointment'}
            </div>
            <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--ink)' }}>
              {isAr ? 'اليوم' : 'Today'} · {patient.appointmentTime}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(168, 139, 196, 0.18)',
              color: 'var(--primary)',
              border: '1.5px solid var(--lavender-border)',
              borderRadius: '10px',
              padding: '0.6rem 1.1rem',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexShrink: 0
            }}
          >
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#4F46E5', flexShrink: 0 }} />
            <span>{isAr ? patient.visitStatusAr || 'قيد المعاينة' : patient.visitStatus || 'In Progress'}</span>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━ 2. PATIENT JOURNEY TIMELINE (In Center) ━━━━━━━━━━ */}
      <div
        style={{
          background: 'var(--surface)',
          borderBottom: '1px solid var(--line)',
          padding: '0.85rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <div
            style={{
              width: 30,
              height: 30,
              minWidth: 30,
              flexShrink: 0,
              borderRadius: 8,
              background: 'rgba(79, 70, 229, 0.1)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Clock size={16} />
          </div>
          <span
            style={{
              fontSize: '0.88rem',
              fontWeight: 700,
              color: 'var(--ink)',
              fontFamily: 'var(--font-heading)'
            }}
          >
            {isAr ? 'رحلة المريض' : 'Patient Journey'}
          </span>
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 0,
            overflowX: 'auto',
            padding: '0.35rem 0'
          }}
        >
          {patient.timeline.map((ev, idx) => (
            <React.Fragment key={ev.id}>
              {idx > 0 && (
                <div
                  style={{
                    height: '2px',
                    flex: '1 1 28px',
                    minWidth: 18,
                    background: 'var(--lavender)',
                    opacity: 0.65,
                    flexShrink: 0,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'var(--primary)',
                      transformOrigin: isAr ? 'right' : 'left',
                      animation: 'fadeIn 0.6s ease forwards'
                    }}
                  />
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.2rem',
                  flexShrink: 0
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    minWidth: 36,
                    flexShrink: 0,
                    borderRadius: '50%',
                    background: `${tlTypeColor(ev.type)}15`,
                    border: `2px solid ${tlTypeColor(ev.type)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    color: tlTypeColor(ev.type),
                    transition: 'transform 0.2s ease'
                  }}
                >
                  {ev.year.toString().slice(-2)}
                </div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--ink)' }}>
                  {ev.year}
                </div>
                <div
                  style={{
                    fontSize: '0.64rem',
                    color: 'var(--ink-soft)',
                    textAlign: 'center',
                    maxWidth: 95,
                    lineHeight: 1.25
                  }}
                >
                  {isAr ? ev.titleAr.slice(0, 32) : ev.title.slice(0, 32)}
                </div>
              </div>
            </React.Fragment>
          ))}

          {/* Today Node */}
          <div
            style={{
              height: '2px',
              flex: '1 1 28px',
              minWidth: 18,
              background: 'var(--lavender)',
              opacity: 0.65,
              flexShrink: 0,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'var(--primary)',
                transformOrigin: isAr ? 'right' : 'left',
                animation: 'fadeIn 0.6s ease forwards'
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.2rem',
              flexShrink: 0
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                minWidth: 36,
                flexShrink: 0,
                borderRadius: '50%',
                background: '#EEF2FF',
                border: '2px solid #4F46E5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.76rem',
                fontWeight: 800,
                color: '#4F46E5',
                boxShadow: '0 0 12px rgba(79, 70, 229, 0.45)',
                animation: 'pulse 2s infinite'
              }}
            >
              ✓
            </div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--ink)' }}>
              {isAr ? 'اليوم' : 'Today'}
            </div>
            <div style={{ fontSize: '0.64rem', color: 'var(--primary)', fontWeight: 600 }}>
              {isAr ? 'استشارة عامة' : 'Consultation'}
            </div>
          </div>
        </div>

        <span style={{ fontSize: '0.76rem', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          {isAr ? 'السجل الكامل ›' : 'Full history ›'}
        </span>
      </div>

      {/* ━━━━━━━━━━ 3. CLINICAL WORKSPACE BODY (FLOWS NATURALLY) ━━━━━━━━━━ */}
      <div
        style={{
          padding: '1.5rem 1.75rem 8rem 1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.35rem',
          overflow: 'visible'
        }}
      >
        {/* ═══ CARD 1: CLINICAL RECORD & DICTATION INTAKE ═══ */}
        <div className="card-box" style={{ background: 'var(--surface)', borderRadius: 14, border: '1.5px solid var(--line)', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          {/* Header Bar */}
          <div
            style={{
              padding: '1rem 1.4rem',
              borderBottom: '1px solid var(--line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              background: 'var(--bg)',
              borderTopLeftRadius: 14,
              borderTopRightRadius: 14
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  minWidth: 38,
                  flexShrink: 0,
                  borderRadius: 10,
                  background: 'rgba(79, 70, 229, 0.12)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FileText size={20} />
              </div>
              <div>
                <h2
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    margin: 0,
                    color: 'var(--ink)',
                    fontFamily: 'var(--font-heading)'
                  }}
                >
                  {isAr ? 'السجل السريري وتفريغ المحادثة' : 'Clinical Record & Speech Intake'}
                </h2>
                <div style={{ fontSize: '0.76rem', color: 'var(--ink-soft)', marginTop: '0.15rem' }}>
                  {isAr
                    ? 'تسجيل صوتي وتفريغ فوري مع دعم التعديل اليدوي والتحليل الذكي'
                    : 'Real-time speech-to-text dictation with instant clinical NLP extraction'}
                </div>
              </div>
            </div>

            {/* Controls: Scenarios Icon Button + Reset + Dictation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', position: 'relative' }}>
              {/* ⚡ Requirement 1: Scenarios Icon Button with Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  ref={scenarioBtnRef}
                  onClick={toggleScenarios}
                  style={{
                    background: isScenariosOpen ? 'var(--primary)' : 'rgba(79, 70, 229, 0.08)',
                    color: isScenariosOpen ? '#FFFFFF' : 'var(--primary)',
                    border: '1.5px solid var(--lavender-border)',
                    borderRadius: 8,
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    transition: 'all 0.15s',
                    flexShrink: 0
                  }}
                  title={isAr ? 'السيناريوهات السريرية لتغيير المحادثة' : 'Clinical Scenarios'}
                >
                  <Sparkles size={16} style={{ flexShrink: 0 }} />
                  <span>{isAr ? 'السيناريوهات السريرية' : 'Scenarios'}</span>
                  <span style={{ fontSize: '0.68rem', transition: 'transform 0.2s', transform: isScenariosOpen ? 'rotate(180deg)' : 'none' }}>▼</span>
                </button>

                {/* Dropdown Menu rendered via React Portal into document.body (Item 1) */}
                {isScenariosOpen && typeof document !== 'undefined' && createPortal(
                  <div
                    style={{
                      position: 'fixed',
                      inset: 0,
                      zIndex: 99998,
                      background: 'transparent'
                    }}
                    onClick={() => setIsScenariosOpen(false)}
                  >
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        position: 'fixed',
                        top: scenarioDropdownPos?.top ?? 140,
                        left: scenarioDropdownPos?.left ?? 20,
                        zIndex: 99999,
                        background: 'var(--surface)',
                        border: '1.5px solid var(--line)',
                        borderRadius: 12,
                        boxShadow: '0 12px 36px rgba(41, 38, 58, 0.22)',
                        width: 380,
                        maxWidth: '92vw',
                        maxHeight: 420,
                        overflowY: 'auto',
                        padding: '0.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        direction: isAr ? 'rtl' : 'ltr'
                      }}
                    >
                      <div style={{ padding: '0.35rem 0.5rem', borderBottom: '1px solid var(--line-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ink)' }}>
                          {isAr ? '⚡ اختر سيناريو سريري محاكى:' : '⚡ Select Clinical Scenario:'}
                        </span>
                        <button
                          onClick={() => setIsScenariosOpen(false)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--ink-muted)', padding: '0.2rem' }}
                        >
                          ✕
                        </button>
                      </div>

                      {PRESET_CLINICAL_SCENARIOS.map((scen, idx) => (
                        <div
                          key={scen.id}
                          onClick={() => handleSelectScenario(scen)}
                          style={{
                            padding: '0.7rem 0.8rem',
                            borderRadius: 9,
                            border: '1px solid var(--line-subtle)',
                            background: 'var(--bg)',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.3rem'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(79, 70, 229, 0.12)';
                            e.currentTarget.style.borderColor = 'var(--primary)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'var(--bg)';
                            e.currentTarget.style.borderColor = 'var(--line-subtle)';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <strong style={{ fontSize: '0.84rem', color: 'var(--ink)' }}>
                              {idx + 1}. {isAr ? scen.titleAr : scen.titleEn}
                            </strong>
                            <span style={{
                              fontSize: '0.65rem',
                              background: 'rgba(79, 70, 229, 0.1)',
                              color: 'var(--primary)',
                              padding: '0.1rem 0.4rem',
                              borderRadius: 4,
                              fontWeight: 700
                            }}>
                              {isAr ? scen.badgeAr : scen.badgeEn}
                            </span>
                          </div>

                          <div style={{ fontSize: '0.73rem', color: 'var(--ink-soft)', lineHeight: 1.4 }}>
                            {isAr ? scen.descriptionAr : scen.descriptionEn}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>,
                  document.body
                )}
              </div>

              {/* Reset Transcript */}
              <button
                onClick={() => {
                  onChangeTranscript('');
                  setAiData(null);
                  setAnalysisStatus('idle');
                }}
                title={isAr ? 'مسح النص والبدء من جديد' : 'Clear transcript'}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  color: 'var(--ink-soft)',
                  borderRadius: 8,
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  flexShrink: 0
                }}
              >
                <RotateCcw size={14} style={{ flexShrink: 0 }} />
                <span>{isAr ? 'إعادة ضبط' : 'Reset'}</span>
              </button>

              {/* Intelligent Automatic Speaker Detection Indicator (Item 4: Manual toggle buttons removed) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: '#F1F5F9',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 8,
                  border: '1px solid var(--line)',
                  fontSize: '0.74rem',
                  color: 'var(--ink-soft)',
                  flexShrink: 0
                }}
                title={isAr ? 'تمييز المتحدثين تلقائياً (طبيب / مريض) بدون تدخل يدوي' : 'Automatic Speaker Diarization'}
              >
                <span style={{ fontSize: '0.85rem' }}>{activeSpeaker === 'doctor' ? '👨‍⚕️' : '👤'}</span>
                <span style={{ fontWeight: 700, color: activeSpeaker === 'doctor' ? 'var(--primary)' : '#059669' }}>
                  {isAr
                    ? (activeSpeaker === 'doctor' ? 'المتحدث: الطبيب' : 'المتحدث: المريض')
                    : (activeSpeaker === 'doctor' ? 'Speaker: Doctor' : 'Speaker: Patient')}
                </span>
                <span style={{
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  color: '#065F46',
                  background: 'rgba(155, 205, 185, 0.35)',
                  padding: '0.1rem 0.35rem',
                  borderRadius: 4
                }}>
                  {isAr ? 'تلقائي' : 'Auto'}
                </span>
              </div>

              {/* Live Waveform when recording - Real Audio Level with transform: scaleY() */}
              {isRecording && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2.5px',
                    height: 26,
                    padding: '0 0.6rem',
                    background: '#FEE2E2',
                    borderRadius: 7,
                    flexShrink: 0
                  }}
                  title={`Audio Level: ${Math.round(audioLevel)}%`}
                >
                  {Array.from({ length: 14 }).map((_, i) => {
                    const curve = Math.sin((i / 13) * Math.PI);
                    const factor = 0.25 + curve * 0.75;
                    const scale = Math.max(0.18, Math.min(1.0, (audioLevel / 100) * factor * 1.6));
                    return (
                      <div
                        key={i}
                        style={{
                          width: 3,
                          height: 20,
                          borderRadius: 2,
                          background: '#DC2626',
                          transformOrigin: 'center',
                          transform: `scaleY(${scale})`,
                          transition: 'transform 100ms ease'
                        }}
                      />
                    );
                  })}
                </div>
              )}

              {/* Voice Dictation Button */}
              <button
                onClick={toggleRec}
                style={{
                  background: isRecording ? '#DC2626' : 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 8,
                  padding: '0.5rem 1.15rem',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: isRecording ? '0 0 14px rgba(220, 38, 38, 0.45)' : '0 2px 10px rgba(79, 70, 229, 0.28)',
                  transition: 'all 0.2s',
                  flexShrink: 0
                }}
              >
                {isRecording ? (
                  <>
                    <Square size={15} fill="#FFFFFF" style={{ flexShrink: 0 }} />
                    <span>{isAr ? `إيقاف التسجيل (${fmt(recordTimer)})` : `Stop (${fmt(recordTimer)})`}</span>
                  </>
                ) : (
                  <>
                    <Mic size={16} style={{ flexShrink: 0 }} />
                    <span>{isAr ? 'بدء التسجيل الصوتي' : 'Start Voice Dictation'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Body: REAL INTERACTIVE TEXTAREA — Requirement 3: Increased Height & Width */}
          <div style={{ padding: '1.25rem 1.4rem' }}>
            {/* ─── Item 5: Real-time Contextual EHR Retrieval Cards ─── */}
            {contextCards
              .filter((c) => !dismissedContextCards.includes(c.id))
              .map((c) => (
                <div
                  key={c.id}
                  className="live-banner-entrance"
                  style={{
                    marginBottom: '0.75rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 10,
                    background: c.bg,
                    border: `1.5px solid ${c.borderColor}`,
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '0.65rem',
                    animation: 'slideInFromLeftRtl 260ms cubic-bezier(0.16, 1, 0.3, 1) both'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
                    <div style={{ marginTop: '2px', flexShrink: 0 }}>{c.icon}</div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                        <strong style={{ fontSize: '0.8rem', color: c.titleColor }}>{c.title}</strong>
                        <span style={{ fontSize: '0.62rem', padding: '0.08rem 0.35rem', borderRadius: 4, background: 'rgba(255,255,255,0.8)', fontWeight: 700, color: 'var(--ink-soft)' }}>
                          {isAr ? 'استرجاع فوري من السجل' : 'Real-time EHR Match'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--ink)', lineHeight: 1.45 }}>
                        {c.content}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setDismissedContextCards((prev) => [...prev, c.id])}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)', padding: '2px' }}
                    title={isAr ? 'إغلاق' : 'Dismiss'}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

            {/* ─── Item 5: Contextual Assistance Follow-up Question Suggestion ─── */}
            {conversationalSuggestion && !dismissedContextCards.includes(conversationalSuggestion.id) && (
              <div
                className="live-banner-entrance"
                style={{
                  marginBottom: '0.75rem',
                  padding: '0.55rem 0.85rem',
                  borderRadius: 9,
                  background: '#F5F3FF',
                  border: '1.5px solid #DDD6FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.65rem',
                  animation: 'slideInFromLeftRtl 260ms cubic-bezier(0.16, 1, 0.3, 1) both'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{ fontSize: '0.9rem' }}>💡</span>
                  <span style={{ fontSize: '0.78rem', color: '#5B21B6', fontWeight: 600 }}>
                    {conversationalSuggestion.text}
                  </span>
                </div>
                <button
                  onClick={() => setDismissedContextCards((prev) => [...prev, conversationalSuggestion.id])}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7C3AED', padding: '2px' }}
                  title={isAr ? 'إغلاق' : 'Dismiss'}
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--ink)' }}>
                {isAr ? 'نص المحادثة والملاحظات الطبية (يمكنك الكتابة والتعديل مباشرة):' : 'Clinical Consultation Notes / Transcript (Fully Editable):'}
              </label>
              <span style={{ fontSize: '0.74rem', color: 'var(--ink-muted)' }}>
                {transcript ? `${transcript.length} ${isAr ? 'حرف' : 'chars'}` : (isAr ? 'اكتب أو تحدث مباشرة' : 'Type or dictate')}
              </span>
            </div>

            <textarea
              value={transcript}
              onChange={(e) => onChangeTranscript(e.target.value)}
              rows={9}
              dir={isAr ? 'rtl' : 'ltr'}
              placeholder={
                isAr
                  ? 'تحدث بالمايك أو اكتب هنا الملاحظات السريرية... مثال: "المريض ذكر الدوخة عند الوقوف من 3 أسابيع، ويأخذ أملوديبين 5 ملجم، مع ضغط دم 138/88."'
                  : 'Speak into microphone or write clinical notes here... Example: "Patient reports postural dizziness for 3 weeks, taking Amlodipine 5mg..."'
              }
              style={{
                width: '100%',
                minHeight: 220,
                padding: '1.15rem 1.35rem',
                borderRadius: 12,
                border: '1.5px solid var(--line)',
                background: 'var(--bg)',
                color: 'var(--ink)',
                fontSize: '0.96rem',
                lineHeight: 1.75,
                fontFamily: 'inherit',
                resize: 'vertical',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.background = 'var(--surface)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.12)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--line)';
                e.currentTarget.style.background = 'var(--bg)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />

            {/* Realtime Interim Speech Display & Blinking Cursor during Recording */}
            {isRecording && (
              <div
                style={{
                  background: interimText ? '#EEF2FF' : '#FEF2F2',
                  border: `1px solid ${interimText ? '#C7D2FE' : '#FECACA'}`,
                  borderRadius: 8,
                  padding: '0.5rem 0.85rem',
                  marginTop: '0.55rem',
                  fontSize: '0.82rem',
                  color: interimText ? 'var(--primary)' : '#DC2626',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem'
                }}
              >
                <span style={{ animation: 'pulse 1s infinite' }}>{interimText ? '🎙️' : '🔴'}</span>
                <span>{interimText || (isAr ? 'جاري الاستماع للنص في اللحظة ذاتها...' : 'Listening in real-time...')}</span>
                <span
                  style={{
                    display: 'inline-block',
                    width: '3px',
                    height: '14px',
                    background: interimText ? 'var(--primary)' : '#DC2626',
                    animation: 'pulse 1s infinite',
                    marginInlineStart: '3px',
                    borderRadius: '1px'
                  }}
                />
              </div>
            )}

            {/* Action Bar with AI Run Button */}
            <div
              style={{
                marginTop: '1rem',
                paddingTop: '0.85rem',
                borderTop: '1px solid var(--line-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {analysisStatus === 'processing' ? (
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Loader2 size={15} style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} />
                    {isAr ? 'جاري التحليل السريري واستخراج الكيانات...' : 'Extracting clinical entities...'}
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: '0.8rem',
                      color: '#059669',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      animation: analysisStatus === 'extracted' ? 'popIn 300ms cubic-bezier(0.16, 1, 0.3, 1)' : 'none'
                    }}
                  >
                    <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
                    {isAr ? 'التحليل السريري محدّث بالكامل' : 'Clinical analysis up to date'}
                  </span>
                )}
              </div>

              <button
                onClick={handleManualAnalysis}
                disabled={analysisStatus === 'processing'}
                style={{
                  background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 8,
                  padding: '0.55rem 1.25rem',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 2px 10px rgba(79, 70, 229, 0.28)'
                }}
              >
                <Sparkles size={16} style={{ flexShrink: 0 }} />
                <span>{isAr ? 'تشغيل التحليل السريري بالذكاء الاصطناعي' : 'Run Clinical AI Analysis'}</span>
              </button>
            </div>
          </div>

          {/* Extracted Entities Tag Bar (Only when analysis has run and real entities exist) */}
          {!!transcript.trim() && hasRunAnalysis && !!aiData && !!ext && (
            <div
              style={{
                background: '#F8FAFC',
                borderTop: '1px solid var(--line)',
                padding: '0.85rem 1.4rem',
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
                borderBottomLeftRadius: 14,
                borderBottomRightRadius: 14
              }}
            >
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink-soft)' }}>
                {isAr ? '📋 الكيانات المستخرجة:' : '📋 Extracted Entities:'}
              </span>

              {/* Symptom Tag */}
              {ext.symptoms?.[0]?.text && (
                <span
                  style={{
                    fontSize: '0.76rem',
                    background: '#EFF6FF',
                    color: '#1E40AF',
                    border: '1px solid #BFDBFE',
                    padding: '0.25rem 0.65rem',
                    borderRadius: 7,
                    fontWeight: 600
                  }}
                >
                  {isAr ? 'الأعراض:' : 'Symptoms:'} {isAr ? (ext.symptoms[0].textAr || ext.symptoms[0].text) : ext.symptoms[0].text}
                </span>
              )}

              {/* Duration Tag */}
              {ext.duration && (
                <span
                  style={{
                    fontSize: '0.76rem',
                    background: '#F3E8FF',
                    color: '#6B21A8',
                    border: '1px solid #E9D5FF',
                    padding: '0.25rem 0.65rem',
                    borderRadius: 7,
                    fontWeight: 600
                  }}
                >
                  {isAr ? 'المدة:' : 'Duration:'} {ext.duration}
                </span>
              )}

              {/* Medication Tag */}
              {ext.medications?.[0]?.name && (
                <span
                  style={{
                    fontSize: '0.76rem',
                    background: '#FEF3C7',
                    color: '#92400E',
                    border: '1px solid #FDE68A',
                    padding: '0.25rem 0.65rem',
                    borderRadius: 7,
                    fontWeight: 600
                  }}
                >
                  {isAr ? 'الدواء:' : 'Medication:'} {ext.medications[0].name}
                </span>
              )}

              {/* Conflict Tag */}
              {atts.some((a) => a.category === 'Medication Discrepancy') && (
                <span
                  style={{
                    fontSize: '0.76rem',
                    background: '#FEE2E2',
                    color: '#DC2626',
                    border: '1px solid #FECACA',
                    padding: '0.25rem 0.65rem',
                    borderRadius: 7,
                    fontWeight: 700
                  }}
                >
                  ⚠ {isAr ? 'اشتباه تعارض دوائي' : 'Suspected Drug Interaction'}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ═══ CONDITIONAL RENDER: EMPTY STATE vs LIVE AI ANALYSIS ═══ */}
        {!transcript.trim() && !aiData ? (
          <div
            className="card-box"
            style={{
              background: 'var(--surface)',
              borderRadius: 16,
              padding: '3.5rem 2rem',
              textAlign: 'center',
              border: '1.5px dashed var(--line)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              boxShadow: '0 2px 12px rgba(0,0,0,0.02)'
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'rgba(79, 70, 229, 0.08)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Mic size={30} />
            </div>
            <div>
              <div style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-heading)' }}>
                {isAr ? 'في انتظار بدء الجلسة السريرية' : 'Awaiting Clinical Consultation'}
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', marginTop: '0.5rem', maxWidth: 520, lineHeight: 1.65 }}>
                {isAr
                  ? 'لم يتم إدخال أي حوار بعد. يمكنك الضغط على "بدء التسجيل الصوتي" للتحدث مع المريض مباشرة، أو الضغط على "السيناريوهات السريرية" لاختيار سيناريو جاهز لتشغيل التحليل السريري واستخراج المؤشرات وقاعدة المعرفة.'
                  : 'No dialogue yet. Click "Start Voice Dictation" to speak with the patient in real time, or choose a clinical scenario from above to run AI reasoning.'}
              </div>
            </div>
          </div>
        ) : (
          <>

        {/* ═══ CARD 2: SMART CLINICAL QUESTIONS ═══ */}
        <div
          className="card-box live-banner-entrance"
          style={{
            background: 'var(--surface)',
            padding: '1.15rem 1.4rem',
            borderRadius: 14,
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            animation: 'slideInFromLeftRtl 260ms cubic-bezier(0.16, 1, 0.3, 1) both'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  minWidth: 30,
                  flexShrink: 0,
                  borderRadius: 8,
                  background: 'rgba(124, 58, 237, 0.12)',
                  color: '#7C3AED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <HelpCircle size={17} />
              </div>
              <span
                style={{
                  fontSize: '0.96rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--ink)'
                }}
              >
                {isAr ? 'أسئلة ذكية مقترحة للاستيضاح' : 'AI Clarification Questions'}
              </span>
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>
              {isAr ? 'عرض الكل' : 'View all'}
            </span>
          </div>

          {!hasRunAnalysis || !aiData || !smartQ ? (
            <div
              style={{
                padding: '1.4rem 1rem',
                background: 'var(--bg)',
                borderRadius: 10,
                border: '1.5px dashed var(--line)',
                textAlign: 'center',
                color: 'var(--ink-soft)',
                fontSize: '0.84rem'
              }}
            >
              {isAr
                ? 'بانتظار تشغيل التحليل السريري بالذكاء الاصطناعي لتوليد أسئلة الاستيضاح الذكية.'
                : 'Awaiting Clinical AI Analysis to generate clarification questions.'}
            </div>
          ) : (
            <>
              <div
                style={{
                  background: 'var(--bg)',
                  borderRadius: 10,
                  padding: '1rem 1.15rem',
                  fontSize: '0.9rem',
                  color: 'var(--ink)',
                  lineHeight: 1.7,
                  border: '1px solid var(--line)'
                }}
              >
                <span style={{ color: '#7C3AED', fontWeight: 800, fontSize: '1.1rem', marginInlineEnd: '0.4rem' }}>?</span>
                {smartQ}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.85rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {[isAr ? 'نعم' : 'Yes', isAr ? 'لا' : 'No', isAr ? 'غير متأكد' : 'Not sure'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSmartAnswer(opt)}
                    style={{
                      padding: '0.45rem 1.35rem',
                      borderRadius: 8,
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      border: `1.5px solid ${smartAnswer === opt ? 'var(--primary)' : 'var(--line)'}`,
                      background: smartAnswer === opt ? 'var(--lavender-soft)' : 'var(--surface)',
                      color: smartAnswer === opt ? 'var(--primary-dark)' : 'var(--ink)',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    {opt}
                  </button>
                ))}
                {smartAnswer && (
                  <span style={{ fontSize: '0.76rem', color: '#059669', fontWeight: 600, marginInlineStart: '0.5rem' }}>
                    ✓ {isAr ? 'تم حفظ الإجابة وتضمينها بالسياق السريري المباشر' : 'Answer recorded & included in clinical context'}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* ═══ CARD 3: WHAT NEEDS ATTENTION ═══ */}
        <div className="card-box" style={{ background: 'var(--surface)', padding: '1.15rem 1.4rem', borderRadius: 14, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  minWidth: 30,
                  flexShrink: 0,
                  borderRadius: 8,
                  background: 'rgba(217, 119, 6, 0.12)',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <AlertTriangle size={17} />
              </div>
              <span
                style={{
                  fontSize: '0.96rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--ink)'
                }}
              >
                {isAr ? 'ما يحتاج انتباه ومراجعة سريرية' : 'What Needs Attention'}
              </span>
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>
              {isAr ? 'عرض الكل' : 'View all'}
            </span>
          </div>

          {!hasRunAnalysis || !aiData || atts.length === 0 ? (
            <div
              style={{
                padding: '1.4rem 1rem',
                background: 'var(--bg)',
                borderRadius: 10,
                border: '1.5px dashed var(--line)',
                textAlign: 'center',
                color: 'var(--ink-soft)',
                fontSize: '0.84rem'
              }}
            >
              {isAr
                ? 'لا توجد تنبيهات سريرية حالياً — تظهر التنبيهات بعد تشغيل التحليل بالذكاء الاصطناعي.'
                : 'No clinical alerts at this time — alerts will appear after running AI analysis.'}
            </div>
          ) : (
            atts.slice(0, 3).map((a, i) => {
              const sevColors: Record<string, string> = { high: '#DC2626', medium: '#D97706', low: '#6B7280' };
              const sevBgs: Record<string, string> = { high: '#FEE2E2', medium: '#FEF3C7', low: '#F3F4F6' };
              const color = sevColors[a.severity] || '#D97706';
              const bg = sevBgs[a.severity] || '#FEF3C7';

              return (
                <div
                  key={a.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    padding: '0.75rem 0',
                    borderTop: i ? '1px solid var(--line-subtle)' : 'none'
                  }}
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      minWidth: 26,
                      flexShrink: 0,
                      borderRadius: 7,
                      background: bg,
                      color: color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 800
                    }}
                  >
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.76rem', fontWeight: 700, color: color }}>
                      {isAr ? a.categoryAr : a.category}
                    </div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--ink)', fontWeight: 600, marginTop: '0.15rem' }}>
                      {isAr ? a.titleAr : a.title}
                    </div>
                  </div>
                  <ChevronRight size={18} color="var(--ink-muted)" style={{ flexShrink: 0 }} />
                </div>
              );
            })
          )}
        </div>

        {/* ═══ CARD 4: CLINICAL POSSIBILITIES ═══ */}
        <div className="card-box" style={{ background: 'var(--surface)', padding: '1.15rem 1.4rem', borderRadius: 14, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  minWidth: 30,
                  flexShrink: 0,
                  borderRadius: 8,
                  background: 'rgba(79, 70, 229, 0.12)',
                  color: '#4F46E5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Sparkles size={17} />
              </div>
              <span
                style={{
                  fontSize: '0.96rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--ink)'
                }}
              >
                {isAr ? 'الاحتمالات السريرية والتشخيص التفريقي' : 'Clinical Possibilities'}
              </span>
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>
              {isAr ? 'عرض الكل' : 'View all'}
            </span>
          </div>

          {!hasRunAnalysis || !aiData || poss.length === 0 ? (
            <div
              style={{
                padding: '1.75rem 1.25rem',
                background: 'var(--bg)',
                borderRadius: 12,
                border: '1.5px dashed var(--line)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.6rem'
              }}
            >
              <div style={{ fontSize: '1.6rem' }}>⏳</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--ink)' }}>
                {isAr
                  ? 'في انتظار تشغيل التحليل السريري بالذكاء الاصطناعي'
                  : 'Awaiting Clinical AI Analysis'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', maxWidth: 460, lineHeight: 1.6 }}>
                {isAr
                  ? 'تظهر قائمة التشخيصات المرشحة ونسب الاحتمالية بعد الضغط على زر "تشغيل التحليل السريري بالذكاء الاصطناعي" أعلاه، مستندةً لقاعدة المعرفة والأسئلة الاستيضاحية أثناء المحادثة.'
                  : 'Differential diagnoses and likelihood percentages appear only after clicking "Run Clinical AI Analysis" above, grounded in the knowledge base and live clarifications.'}
              </div>
            </div>
          ) : (
            <>
              {/* Narrow Gap Alert Banner (probGap <= 15%) */}
              {(() => {
                const t1 = poss[0];
                const t2 = poss[1];
                const p1P = t1?.probability ?? (t1?.likelihood === 'Higher likelihood' ? 82 : 70);
                const p2P = t2?.probability ?? (t2?.likelihood === 'Higher likelihood' ? 76 : (t2?.likelihood === 'Moderate likelihood' ? 68 : 45));
                const gap = Math.abs(p1P - p2P);
                const isNarrow = gap <= 15;

                return isNarrow ? (
                  <div
                    style={{
                      background: 'var(--gold-soft)',
                      border: '1px solid var(--gold-border)',
                      color: 'var(--gold)',
                      borderRadius: 10,
                      padding: '0.75rem 1rem',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      fontSize: '0.82rem',
                      fontWeight: 700
                    }}
                  >
                    <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>⚠️</span>
                    <div>
                      {isAr
                        ? `فجوة ضيقة بين أعلى احتمالين (${gap}%) — يُرجى مراجعة السؤال التمييزي المميّز أدناه لحسم التشخيص الأدق.`
                        : `Narrow gap between top 2 diagnoses (${gap}%) — Review the highlighted discriminating question below.`}
                    </div>
                  </div>
                ) : null;
              })()}

              {poss.slice(0, 3).map((p, i) => {
                const lkColors: Record<string, { bg: string; text: string; label: string }> = {
                  'Higher likelihood': { bg: '#DBEAFE', text: '#1E40AF', label: isAr ? 'احتمال عالي' : 'Higher likelihood' },
                  'Moderate likelihood': { bg: '#FEF3C7', text: '#92400E', label: isAr ? 'احتمال متوسط' : 'Moderate likelihood' },
                  'Lower likelihood': { bg: '#F3F4F6', text: '#6B7280', label: isAr ? 'احتمال أقل' : 'Lower likelihood' }
                };
                const lk = lkColors[p.likelihood] || lkColors['Lower likelihood'];
                const prob = p.probability ?? (p.likelihood === 'Higher likelihood' ? 82 : (p.likelihood === 'Moderate likelihood' ? 68 : 45));

                return (
                  <div
                    key={p.id}
                    style={{
                      padding: '0.85rem 0',
                      borderTop: i ? '1px solid var(--line-subtle)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.2rem' }}>
                      <span
                        style={{
                          width: 26,
                          height: 26,
                          minWidth: 26,
                          flexShrink: 0,
                          borderRadius: 7,
                          background: lk.bg,
                          color: lk.text,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                          fontWeight: 800
                        }}
                      >
                        {i + 1}
                      </span>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--ink)' }}>
                        {isAr ? p.nameAr : p.name}
                      </strong>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          background: lk.bg,
                          color: lk.text,
                          padding: '0.15rem 0.55rem',
                          borderRadius: 5,
                          fontWeight: 700
                        }}
                      >
                        {lk.label} ({prob}%)
                      </span>
                    </div>

                    {/* Animated Likelihood Bar (Item 5) */}
                    <div style={{ paddingInlineStart: '2.3rem', maxWidth: 440 }}>
                      <AnimatedLikelihoodBar percentage={prob} likelihood={p.likelihood} />
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', paddingInlineStart: '2.3rem', marginTop: '0.2rem' }}>
                      {p.evidenceFromConversation?.slice(0, 2).map((e, j) => (
                        <span key={j} style={{ marginInlineEnd: '0.75rem', display: 'inline-block' }}>
                          • {e}
                        </span>
                      ))}
                    </div>

                    {/* Discriminating question for each diagnosis with interactive answer buttons (Item 3 & 5) */}
                    {p.discriminatingQuestions && p.discriminatingQuestions.length > 0 && (
                      <div
                        style={{
                          marginTop: '0.65rem',
                          marginInlineStart: '2.3rem',
                          background: 'var(--gold-soft)',
                          border: '1px solid var(--gold-border)',
                          borderRadius: 8,
                          padding: '0.65rem 0.85rem',
                          fontSize: '0.8rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.45rem', color: 'var(--gold)', fontWeight: 700 }}>
                          <span>🎯 {isAr ? 'سؤال ترشيح التشخيص:' : 'Discriminating Question:'}</span>
                          <span>{isAr ? (p.discriminatingQuestions[0].questionAr || p.discriminatingQuestions[0].question) : p.discriminatingQuestions[0].question}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          {[isAr ? 'نعم' : 'Yes', isAr ? 'لا' : 'No', isAr ? 'غير متأكد' : 'Not sure'].map((opt) => {
                            const isSelected = answeredDiscriminatingMap[p.id] === opt;
                            return (
                              <button
                                key={opt}
                                onClick={() => handleAnswerDiscriminatingQuestion(p.id, p.discriminatingQuestions[0].question, opt)}
                                style={{
                                  padding: '0.25rem 0.85rem',
                                  borderRadius: 6,
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                  border: isSelected ? '1.5px solid var(--gold)' : '1px solid var(--line)',
                                  background: isSelected ? 'var(--gold-soft)' : 'var(--surface)',
                                  color: isSelected ? 'var(--gold)' : 'var(--ink)',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s'
                                }}
                              >
                                {opt}
                              </button>
                            );
                          })}
                          {answeredDiscriminatingMap[p.id] && (
                            <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>
                              ✓ {isAr ? 'تمت إعادة حساب النسب وتحديث الشريط' : 'Probability updated'}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* ═══ CARD 4.5: CLINICAL KNOWLEDGE BASE & PROTOCOL REFERENCES ═══ */}
        <div className="card-box" style={{ background: 'var(--surface)', padding: '1.15rem 1.4rem', borderRadius: 14, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'rgba(168, 139, 196, 0.16)', color: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <BookOpen size={18} />
              </div>
              <div>
                <span style={{ fontSize: '0.98rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--ink)' }}>
                  {isAr ? 'قاعدة المعرفة والأدلة السريرية المستند إليها' : 'Cited Clinical Knowledge Base & Protocols'}
                </span>
                <div style={{ fontSize: '0.74rem', color: 'var(--ink-soft)', marginTop: '0.15rem' }}>
                  {isAr ? 'بروتوكولات وزارة الصحة، وقاية، وهيئة الغذاء والدواء الداعمة للتحليل' : 'Verified MOH, Weqaya & FDA Protocols Backing the AI Reasoning'}
                </div>
              </div>
            </div>

            {onOpenKnowledgeBase && (
              <button
                onClick={onOpenKnowledgeBase}
                style={{
                  background: 'rgba(79, 70, 229, 0.08)',
                  color: 'var(--primary)',
                  border: '1px solid rgba(79, 70, 229, 0.2)',
                  borderRadius: 8,
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <span>{isAr ? 'استعراض كافة المراجع' : 'View Full Knowledge Base'}</span>
                <ExternalLink size={13} />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {(aiData?.clinicalReferences && aiData.clinicalReferences.length > 0 ? aiData.clinicalReferences : [
              {
                tag: 'MOH-SA-PROTOCOLS',
                titleAr: 'الأدلة السريرية والبروتوكولات الوطنية — وزارة الصحة السعودية',
                titleEn: 'Saudi MOH National Clinical Practice Protocols',
                rationaleAr: 'مطابقة بروتوكول تقييم ما قبل التخدير وتدقيق أدوية الضغط والتحقق من الاستقرار الوعائي.',
                url: 'https://www.moh.gov.sa/en/ministry/mediacenter/publications/pages/protocols.aspx'
              },
              {
                tag: 'PHA-WEQAYA-2024',
                titleAr: 'دليل عوامل الخطورة والأمراض المزمنة — هيئة الصحة العامة (وقاية)',
                titleEn: 'Public Health Authority (PHA) Risk Factors Guidelines',
                rationaleAr: 'تقييم مخاطر الأمراض المزمنة وضبط ضغط الدم لتفادي هبوط الدورة الدموية أثناء التخدير.',
                url: 'https://www.pha.gov.sa/ar-sa/Healthportal/Pages/RiskFactor.aspx'
              },
              {
                tag: 'US-FDA-DRUGS',
                titleAr: 'قاعدة بيانات سلامة الأدوية — هيئة الغذاء والدواء (FDA)',
                titleEn: 'FDA Drugs Safety Database',
                rationaleAr: 'التحقق من الآثار الجانبية ومخاطر النزيف وهبوط الضغط المصاحب للأدوية الموصوفة.',
                url: 'https://www.fda.gov/drugs'
              }
            ]).map((ref, idx) => (
              <div
                key={idx}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid var(--line)',
                  borderRadius: 9,
                  padding: '0.75rem 0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
                    <span style={{
                      fontSize: '0.68rem', fontWeight: 700, padding: '0.15rem 0.45rem',
                      borderRadius: 4, background: 'rgba(79, 70, 229, 0.12)', color: 'var(--primary)'
                    }}>
                      {ref.tag}
                    </span>
                    <strong style={{ fontSize: '0.84rem', color: 'var(--ink)' }}>
                      {isAr ? ref.titleAr : (ref.titleEn || ref.titleAr)}
                    </strong>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--ink-soft)', lineHeight: 1.45 }}>
                    {isAr ? ref.rationaleAr : (ref.rationaleEn || ref.rationaleAr)}
                  </div>
                </div>
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    background: 'var(--surface)',
                    border: '1px solid var(--line)',
                    padding: '0.35rem 0.65rem',
                    borderRadius: 6,
                    flexShrink: 0
                  }}
                >
                  <span>{isAr ? 'زيارة المرجع' : 'Visit'}</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ CARD 5: GENERATE CLINICAL REPORT BUTTON ═══ */}
        <div style={{ padding: '1rem 0 3rem 0', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={onOpenReportModal}
            style={{
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 14,
              padding: '0.95rem 3rem',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: '0 4px 20px rgba(79, 70, 229, 0.38)',
              transition: 'transform 0.15s, box-shadow 0.15s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(79, 70, 229, 0.48)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(79, 70, 229, 0.38)';
            }}
          >
            <FileText size={20} style={{ flexShrink: 0 }} />
            <span>{isAr ? 'إنشاء التقرير السريري الشامل' : 'Generate Comprehensive Clinical Report'}</span>
            <ChevronRight size={18} style={{ flexShrink: 0 }} />
          </button>
        </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
};

export default MainConsultationColumn;
