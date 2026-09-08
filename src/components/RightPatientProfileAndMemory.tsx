import React, { useState } from 'react';
import type { Patient } from '../types/clinical';
import { User, Clock, FileText, Activity, Shield, Sparkles, X, ChevronRight, CheckCircle2 } from 'lucide-react';
import type { PatientMemoryMatchItem } from '../services/clinicalAnalysisService';

interface RightPatientProfileAndMemoryProps {
  patient: Patient;
  patientMemoryMatches?: PatientMemoryMatchItem[];
  lang: 'ar' | 'en';
  onClose?: () => void;
}

export const RightPatientProfileAndMemory: React.FC<RightPatientProfileAndMemoryProps> = ({
  patient,
  patientMemoryMatches = [],
  lang,
  onClose
}) => {
  const isAr = lang === 'ar';
  const [openSection, setOpenSection] = useState<'timeline' | 'notes' | 'recent' | 'memory' | null>('recent');

  return (
    <aside
      className="col-right-patient-memory"
      style={{
        width: '320px',
        minWidth: '320px',
        background: '#FAF9FC',
        borderLeft: isAr ? 'none' : '1px solid var(--line)',
        borderRight: isAr ? '1px solid var(--line)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflowY: 'auto',
        position: 'relative'
      }}
    >
      {/* 1. Header */}
      <div
        style={{
          padding: '0.85rem 1rem',
          borderBottom: '1px solid var(--line)',
          background: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              background: '#F4F0F9',
              color: '#6B4699',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <User size={15} />
          </div>
          <strong style={{ fontSize: '0.9rem', color: '#2D2254', fontFamily: 'var(--font-heading)' }}>
            {isAr ? 'الملف والذاكرة السريرية' : 'Patient Profile'}
          </strong>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--ink-soft)',
              cursor: 'pointer',
              padding: '0.2rem'
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1 }}>
        {/* 2. Mini Profile Box */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid var(--line)',
            padding: '0.85rem',
            boxShadow: '0 2px 6px rgba(41, 38, 58, 0.03)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img
              src={patient.photoUrl || '/saud.jpg'}
              alt={patient.name}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #A88BC4'
              }}
            />
            <div>
              <h4 style={{ margin: 0, fontSize: '0.94rem', color: '#2D2254', fontWeight: 700 }}>
                {isAr ? patient.nameAr : patient.name}
              </h4>
              <div style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', marginTop: '0.15rem' }}>
                {patient.age} {isAr ? 'سنة' : 'years'} · {isAr ? patient.genderAr : patient.gender} · {patient.mrn}
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.68rem',
                  color: '#DC2626',
                  background: '#FEE2E2',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '12px',
                  fontWeight: 700,
                  marginTop: '0.35rem'
                }}
              >
                <span>⚠</span>
                <span>{isAr ? 'حساسية بنسلين' : 'Penicillin Allergy'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Real-time Patient Memory Match Alert (Surfaced dynamically) */}
        {patientMemoryMatches.length > 0 ? (
          <div
            style={{
              background: 'linear-gradient(135deg, #F8F5FC 0%, #EFF8F4 100%)',
              borderRadius: '12px',
              border: '1.5px solid #DCD2EC',
              padding: '0.85rem',
              boxShadow: '0 2px 8px rgba(168, 139, 196, 0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#6B4699', fontWeight: 700, fontSize: '0.78rem' }}>
                <Sparkles size={14} />
                <span>{isAr ? 'مطابقة السجل الطبي (Patient Memory)' : 'Patient Memory Match'}</span>
              </div>
              <span style={{ fontSize: '0.66rem', color: '#059669', background: '#D1FAE5', padding: '0.1rem 0.4rem', borderRadius: '10px', fontWeight: 600 }}>
                {isAr ? 'تطابق محتمل' : 'Possible Match'}
              </span>
            </div>

            {patientMemoryMatches.map((match, idx) => (
              <div
                key={idx}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '8px',
                  padding: '0.55rem',
                  border: '1px solid #EAE6F2',
                  marginTop: '0.4rem',
                  fontSize: '0.74rem'
                }}
              >
                <div style={{ fontWeight: 700, color: 'var(--ink)' }}>
                  {isAr ? match.matchedEntityAr || match.matchedEntity : match.matchedEntity}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#6B4699', fontWeight: 600, marginTop: '0.15rem' }}>
                  {isAr ? `المصدر: ${match.source}` : `Source: ${match.source}`}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--ink-soft)', fontStyle: 'italic', marginTop: '0.2rem' }}>
                  {isAr ? match.statementAr || match.statement : match.statement}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {/* 4. Timeline Accordion */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid var(--line)',
            overflow: 'hidden'
          }}
        >
          <div
            onClick={() => setOpenSection(openSection === 'timeline' ? null : 'timeline')}
            style={{
              padding: '0.75rem 0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              background: openSection === 'timeline' ? '#FAF9FC' : '#FFFFFF'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Clock size={15} color="#6B4699" />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink)' }}>
                {isAr ? 'الخط الزمني للحالات' : 'Timeline'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.68rem', color: '#6B4699' }}>{isAr ? 'عرض الكل' : 'View all'}</span>
              <ChevronRight size={14} color="#958EA3" style={{ transform: openSection === 'timeline' ? 'rotate(90deg)' : 'none' }} />
            </div>
          </div>

          {openSection === 'timeline' && (
            <div style={{ padding: '0.65rem 0.85rem', borderTop: '1px solid var(--line)', fontSize: '0.74rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div>• 2019: {isAr ? 'ارتفاع ضغط الدم المزمن' : 'Hypertension (Diagnosis)'}</div>
              <div>• 2021: {isAr ? 'بدء ميتفورمين 500 ملجم' : 'Metformin (Medication)'}</div>
              <div>• 2023: {isAr ? 'استئصال الزائدة الدودية' : 'Appendectomy (Procedure)'}</div>
              <div>• 2025: {isAr ? 'بدء أملوديبين 5 ملجم' : 'Amlodipine (Medication)'}</div>
            </div>
          )}
        </div>

        {/* 5. Notes Accordion */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid var(--line)',
            overflow: 'hidden'
          }}
        >
          <div
            onClick={() => setOpenSection(openSection === 'notes' ? null : 'notes')}
            style={{
              padding: '0.75rem 0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              background: openSection === 'notes' ? '#FAF9FC' : '#FFFFFF'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <FileText size={15} color="#6B4699" />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink)' }}>
                {isAr ? 'ملاحظات الطبيب السابقة' : 'Notes'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.68rem', color: '#6B4699' }}>{isAr ? 'عرض الكل' : 'View all'}</span>
              <ChevronRight size={14} color="#958EA3" style={{ transform: openSection === 'notes' ? 'rotate(90deg)' : 'none' }} />
            </div>
          </div>

          {openSection === 'notes' && (
            <div style={{ padding: '0.65rem 0.85rem', borderTop: '1px solid var(--line)', fontSize: '0.72rem', color: 'var(--ink-soft)', lineHeight: 1.4 }}>
              {isAr
                ? 'المريض منضبط بالعلاجات المزمنة، لوحظت شكوى سابقة من دوخة عند الوقوف المفاجئ بعد تعديل جرعة علاج الضغط في 2025.'
                : 'Patient compliant with chronic medications. Previous transient postural dizziness noted following antihypertensive adjustment in 2025.'}
            </div>
          )}
        </div>

        {/* 6. Recent Activity Section */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid var(--line)',
            padding: '0.85rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.65rem' }}>
            <Activity size={15} color="#6B4699" />
            <strong style={{ fontSize: '0.82rem', color: '#2D2254', fontFamily: 'var(--font-heading)' }}>
              {isAr ? 'النشاط الأخير بالعيادة' : 'Recent Activity'}
            </strong>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.72rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6B4699' }} />
                <span>{isAr ? 'تحديث الملف السريري' : 'Patient record updated'}</span>
              </div>
              <span style={{ color: 'var(--ink-soft)' }}>10:42 AM</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }} />
                <span>{isAr ? 'قياس العلامات الحيوية' : 'Vitals measured'}</span>
              </div>
              <span style={{ color: 'var(--ink-soft)' }}>10:28 AM</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D97706' }} />
                <span>{isAr ? 'مراجعة الأدوية المشتركة' : 'Medication reviewed'}</span>
              </div>
              <span style={{ color: 'var(--ink-soft)' }}>09:45 AM</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Bottom Trust & Safety Badges */}
      <div
        style={{
          padding: '0.85rem 1rem',
          borderTop: '1px solid var(--line)',
          background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(244, 240, 249, 0.6) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          fontSize: '0.68rem',
          color: '#6B7280'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Shield size={12} color="#059669" />
          <span>{isAr ? 'آمن ومعتمد' : 'Secure'}</span>
        </div>
        <span>•</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <CheckCircle2 size={12} color="#4F46E5" />
          <span>{isAr ? 'موثوق سريرياً' : 'Reliable'}</span>
        </div>
        <span>•</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Sparkles size={12} color="#6B4699" />
          <span>{isAr ? 'مدعوم بالذكاء الاصطناعي' : 'AI Assisted'}</span>
        </div>
      </div>
    </aside>
  );
};
