import React, { useState, useEffect } from 'react';
import { Mic, Square, Send, RotateCcw } from 'lucide-react';
import type { ExtractedEntity } from '../types/clinical';

interface ClinicalIntakeProps {
  transcript: string;
  onChangeTranscript: (text: string) => void;
  extractedEntities: ExtractedEntity[];
  onTriggerAnalysis: () => void;
  lang: 'ar' | 'en';
  defaultCaseTranscript: string;
}

export const ClinicalIntake: React.FC<ClinicalIntakeProps> = ({
  transcript,
  onChangeTranscript,
  extractedEntities,
  onTriggerAnalysis,
  lang,
  defaultCaseTranscript
}) => {
  const isAr = lang === 'ar';
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioTimer, setAudioTimer] = useState<number>(0);

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setAudioTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setAudioTimer(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate speech-to-text dictation adding to transcript if empty
      if (!transcript || transcript.trim() === '') {
        onChangeTranscript(defaultCaseTranscript);
      }
    } else {
      setIsRecording(false);
      onTriggerAnalysis();
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="clinical-card" style={{ marginBottom: '1.5rem' }}>
      <div className="clinical-card-header">
        <div className="clinical-card-title">
          <div className="icon-container">
            <Mic size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>
              {isAr ? 'مدخلات المحادثة السريرية (Clinical Speech / Text Intake)' : 'Natural Clinical Conversation Intake'}
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.1rem 0 0 0' }}>
              {isAr
                ? 'استماع وتفريغ فوري للمحادثة بين الطبيب والمريض مع استخراج الكيانات السريرية'
                : 'Real-time clinician-patient dialogue capture with continuous clinical entity extraction'}
            </p>
          </div>
        </div>

        {/* Recording Controls & Reset */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            onClick={() => onChangeTranscript(defaultCaseTranscript)}
            className="btn-secondary"
            style={{ padding: '0.3rem 0.65rem', fontSize: '0.76rem' }}
            title={isAr ? 'استعادة الحوار النموذجي' : 'Reset to default scenario'}
          >
            <RotateCcw size={13} />
            {isAr ? 'إعادة ضبط الحوار' : 'Reset Transcript'}
          </button>

          <button
            onClick={toggleRecording}
            style={{
              background: isRecording ? 'var(--conflict-red)' : 'var(--teal-800)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '0.35rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: isRecording ? '0 0 12px rgba(197, 48, 48, 0.4)' : 'none',
              transition: 'all 150ms'
            }}
          >
            {isRecording ? (
              <>
                <Square size={14} fill="white" />
                <span>{isAr ? `جاري التسجيل (${formatTimer(audioTimer)})` : `Recording (${formatTimer(audioTimer)})`}</span>
              </>
            ) : (
              <>
                <Mic size={14} />
                <span>{isAr ? 'بدء التسجيل الصوتي' : 'Start Voice Dictation'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Pulsing Audio Waveform Bar (When recording) */}
      {isRecording && (
        <div
          style={{
            background: '#FEF2F2',
            borderBottom: '1px solid var(--conflict-red-border)',
            padding: '0.6rem 1.4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: 'var(--conflict-red)',
                display: 'inline-block',
                animation: 'pulse 1s infinite'
              }}
            />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--conflict-red-dark)' }}>
              {isAr ? 'اللاقط الصوتي نشط · جاري التفريغ اللحظي والربط بالملف الطبي...' : 'Live dictation active · Processing clinical speech stream...'}
            </span>
          </div>

          {/* Simple waveform bars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '18px' }}>
            {[14, 22, 10, 26, 18, 28, 12, 20, 16, 24, 12].map((height, i) => (
              <div
                key={i}
                style={{
                  width: '3px',
                  height: `${height}px`,
                  background: 'var(--conflict-red)',
                  borderRadius: '1px',
                  animation: `bounce 0.8s ease-in-out ${i * 0.08}s infinite alternate`
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Transcript Text Editor */}
      <div style={{ padding: '1.2rem 1.4rem 0.8rem 1.4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {isAr ? 'نص المحادثة المكتشف أو ملاحظات الطبيب:' : 'Clinician-Patient Dialogue Transcript / Clinical Notes:'}
          </label>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {isAr ? 'يمكنك تعديل النص مباشرة أو الضغط على تحليل الذكاء السريري' : 'Edit text directly or click re-analyze'}
          </span>
        </div>

        <textarea
          value={transcript}
          onChange={(e) => onChangeTranscript(e.target.value)}
          rows={6}
          dir={isAr ? 'rtl' : 'ltr'}
          placeholder={
            isAr
              ? 'تحدث أو اكتب هنا الملاحظات السريرية... مثال: "المريض عنده صداع ودوخة من أسبوع، ويقول إنه يأخذ دواء للضغط، لكن مو متأكد من اسمه."'
              : 'Dictate or write clinical notes here... Example: "Patient reports persistent headache and dizziness for 1 week, taking an unspecified antihypertensive..."'
          }
          style={{
            width: '100%',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid #DCD2EC',
            background: '#FFFFFF',
            color: '#29263A',
            fontSize: '0.92rem',
            lineHeight: 1.6,
            fontFamily: 'inherit',
            resize: 'vertical',
            outline: 'none',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)'
          }}
        />

        {/* Cross-Sector Realism Callout */}
        <div
          style={{
            marginTop: '0.65rem',
            background: 'var(--teal-50)',
            border: '1px solid var(--teal-200)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.55rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ fontSize: '0.85rem' }}>🔍</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--teal-900)', fontWeight: 600 }}>
              {isAr
                ? 'المريض لا يذكر جهات الصرف: يتولى النظام مطابقة الوصف مع السجلات الموحدة (وزارة الصحة، الحرس، الخاص) ليعاينها الطبيب بنفسه.'
                : 'Patient does not state dispensing sources: MedConflict cross-matches speech against unified national records for the physician to inspect.'}
            </span>
          </div>

          <button
            onClick={onTriggerAnalysis}
            className="btn-primary"
            style={{ fontSize: '0.82rem', padding: '0.35rem 0.85rem' }}
          >
            <Send size={13} />
            <span>{isAr ? 'تحليل ومطابقة عبر القطاعات' : 'Run Cross-Sector Analysis'}</span>
          </button>
        </div>
      </div>

      {/* Extracted Entities Tag Bar (Capture Domain) */}
      <div
        style={{
          background: 'var(--bg-surface-soft)',
          borderTop: '1px solid var(--border-hairline)',
          padding: '0.85rem 1.4rem',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.65rem'
        }}
      >
        <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          {isAr ? '📋 الكيانات السريرية المستخرجة (Extracted):' : '📋 Extracted Clinical Entities:'}
        </span>

        {extractedEntities.map((ent) => {
          let badgeStyle = {
            bg: 'var(--teal-50)',
            text: 'var(--teal-900)',
            border: 'var(--teal-100)'
          };

          if (ent.status === 'conflicting') {
            badgeStyle = {
              bg: 'var(--conflict-red-light)',
              text: 'var(--conflict-red-dark)',
              border: 'var(--conflict-red-border)'
            };
          } else if (ent.status === 'unconfirmed') {
            badgeStyle = {
              bg: 'var(--review-amber-light)',
              text: 'var(--review-amber-text)',
              border: 'var(--review-amber-border)'
            };
          }

          return (
            <span
              key={ent.id}
              style={{
                background: badgeStyle.bg,
                color: badgeStyle.text,
                border: `1px solid ${badgeStyle.border}`,
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.76rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <span>{isAr ? ent.textAr : ent.text}</span>
              <span style={{ fontSize: '0.68rem', opacity: 0.75 }}>
                {Math.round(ent.confidence * 100)}%
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
};
