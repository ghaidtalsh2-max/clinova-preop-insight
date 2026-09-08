import React from 'react';
import type { Patient } from '../types/clinical';
import { Heart, Activity, Thermometer, Wind, Pill, AlertTriangle, FileClock, Clock } from 'lucide-react';

interface LeftClinicalReferencePanelProps {
  patient: Patient;
  lang: 'ar' | 'en';
}

export const LeftClinicalReferencePanel: React.FC<LeftClinicalReferencePanelProps> = ({ patient, lang }) => {
  const isAr = lang === 'ar';

  const vitals = [
    {
      icon: Heart,
      color: '#DC2626',
      bg: '#FEE2E2',
      label: isAr ? 'ضغط الدم' : 'Blood Pressure',
      value: patient.vitals?.bp || '138/88 mmHg'
    },
    {
      icon: Activity,
      color: '#D97706',
      bg: '#FEF3C7',
      label: isAr ? 'نبضات القلب' : 'Heart Rate',
      value: `${patient.vitals?.heartRate || 82} bpm`
    },
    {
      icon: Thermometer,
      color: '#059669',
      bg: '#D1FAE5',
      label: isAr ? 'درجة الحرارة' : 'Temperature',
      value: patient.vitals?.temp || '37.1 °C'
    },
    {
      icon: Wind,
      color: '#7C3AED',
      bg: '#EDE9FE',
      label: isAr ? 'تشبع الأكسجين' : 'SpO₂',
      value: patient.vitals?.spo2 || '97%'
    },
    {
      icon: Wind,
      color: '#2563EB',
      bg: '#DBEAFE',
      label: isAr ? 'معدل التنفس' : 'Respiratory Rate',
      value: '16 /min'
    }
  ];

  return (
    <aside
      className="col-clinical-reference-panel"
      style={{
        width: '310px',
        minWidth: '310px',
        background: '#FAF9FC',
        borderRight: isAr ? '1px solid var(--line)' : 'none',
        borderLeft: isAr ? 'none' : '1px solid var(--line)',
        height: '100%',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.9rem',
        padding: '1rem',
        flexShrink: 0
      }}
    >
      {/* 1. العلامات الحيوية (Vital Signs) */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--line)',
          borderRadius: '14px',
          padding: '0.85rem 1rem',
          boxShadow: '0 2px 6px rgba(41, 38, 58, 0.03)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Heart size={16} color="#DC2626" fill="#DC2626" />
            <strong style={{ fontSize: '0.86rem', color: '#2D2254', fontFamily: 'var(--font-heading)' }}>
              {isAr ? 'العلامات الحيوية' : 'Vital Signs'}
            </strong>
          </div>
          <span style={{ fontSize: '0.66rem', color: 'var(--ink-soft)' }}>
            {isAr ? 'قبل 12 دقيقة' : 'Measured 12m ago'}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {vitals.map((v, idx) => {
            const Icon = v.icon;
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.35rem 0.55rem',
                  borderRadius: '8px',
                  background: '#FAF9FC'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '6px',
                      background: v.bg,
                      color: v.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon size={12} strokeWidth={2} />
                  </div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--ink-soft)' }}>{v.label}</span>
                </div>
                <strong style={{ fontSize: '0.8rem', color: 'var(--ink)', fontWeight: 700 }}>
                  {v.value}
                </strong>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. الأدوية السابقة والحالية (Medications) */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--line)',
          borderRadius: '14px',
          padding: '0.85rem 1rem',
          boxShadow: '0 2px 6px rgba(41, 38, 58, 0.03)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Pill size={16} color="#6B4699" />
            <strong style={{ fontSize: '0.86rem', color: '#2D2254', fontFamily: 'var(--font-heading)' }}>
              {isAr ? 'الأدوية السابقة والحالية' : 'Medications'}
            </strong>
          </div>
          <span style={{ fontSize: '0.68rem', color: '#6B4699', fontWeight: 600 }}>
            {patient.medications.length} {isAr ? 'أدوية' : 'meds'}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {patient.medications.map((m) => {
            const isConflict = m.mentionStatus === 'conflict' || m.conflictFlag;
            return (
              <div
                key={m.id}
                style={{
                  padding: '0.45rem 0.6rem',
                  borderRadius: '8px',
                  background: isConflict ? '#FFF5F5' : '#FAF9FC',
                  border: isConflict ? '1px solid #FECACA' : '1px solid #EAE6F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink)' }}>
                    {m.name} {m.dose}
                  </div>
                  <div style={{ fontSize: '0.66rem', color: 'var(--ink-soft)', marginTop: '0.1rem' }}>
                    <span style={{ fontWeight: 600 }}>{m.sector}</span>
                    <span style={{ margin: '0 0.25rem' }}>●</span>
                    <span style={{ color: isConflict ? '#DC2626' : '#059669', fontWeight: 600 }}>
                      {isConflict ? (isAr ? '⚠ تعارض / تفاعل' : '⚠ Interaction') : (isAr ? 'نشط' : 'Active')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. التاريخ الطبي للمريض (Patient History) */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--line)',
          borderRadius: '14px',
          padding: '0.85rem 1rem',
          boxShadow: '0 2px 6px rgba(41, 38, 58, 0.03)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem' }}>
          <FileClock size={16} color="#6B4699" />
          <strong style={{ fontSize: '0.86rem', color: '#2D2254', fontFamily: 'var(--font-heading)' }}>
            {isAr ? 'التاريخ الطبي (Patient History)' : 'Patient History'}
          </strong>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.74rem' }}>
          <div>
            <span style={{ fontSize: '0.68rem', color: 'var(--ink-soft)', fontWeight: 600, display: 'block', marginBottom: '0.15rem' }}>
              {isAr ? 'الأمراض المزمنة:' : 'Chronic Conditions:'}
            </span>
            <div style={{ color: 'var(--ink)', lineHeight: 1.4 }}>
              {(patient.chronicConditions || []).map((c, i) => (
                <div key={i}>• {isAr ? c.nameAr : c.name}</div>
              ))}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.68rem', color: 'var(--ink-soft)', fontWeight: 600, display: 'block', marginBottom: '0.15rem' }}>
              {isAr ? 'العمليات الجراحية السابقة:' : 'Previous Procedures:'}
            </span>
            <div style={{ color: 'var(--ink)' }}>
              • {isAr ? 'استئصال الزائدة الدودية (Appendectomy) · 2023' : 'Appendectomy · 2023'}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.68rem', color: 'var(--ink-soft)', fontWeight: 600, display: 'block', marginBottom: '0.15rem' }}>
              {isAr ? 'الحساسية المسجلة:' : 'Allergies:'}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#DC2626', fontWeight: 700, fontSize: '0.72rem' }}>
                <AlertTriangle size={12} />
                <span>{isAr ? 'دوائية: بنسلين (حساسية مفرطة)' : 'Drug: Penicillin (Severe)'}</span>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#D97706', fontWeight: 600, fontSize: '0.72rem' }}>
                <span>🥜</span>
                <span>{isAr ? 'غذائية: حساسية الفول السوداني (خفيفة)' : 'Food: Peanut Allergy (Mild)'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. النشاط الأخير بالعيادة (Recent Activity) */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--line)',
          borderRadius: '14px',
          padding: '0.85rem 1rem',
          boxShadow: '0 2px 6px rgba(41, 38, 58, 0.03)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem' }}>
          <Clock size={16} color="#6B4699" />
          <strong style={{ fontSize: '0.86rem', color: '#2D2254', fontFamily: 'var(--font-heading)' }}>
            {isAr ? 'النشاط الأخير بالعيادة' : 'Recent Activity'}
          </strong>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.72rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6B4699' }} />
              <span>{isAr ? 'تحديث السجل السريري' : 'Record updated'}</span>
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
              <span>{isAr ? 'مراجعة الأدوية المشتركة' : 'Medications reviewed'}</span>
            </div>
            <span style={{ color: 'var(--ink-soft)' }}>09:45 AM</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
