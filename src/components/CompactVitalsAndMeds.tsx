import React from 'react';
import type { Patient } from '../types/clinical';
import { Heart, Activity, Thermometer, Wind, AlertTriangle, Pill } from 'lucide-react';

interface CompactVitalsAndMedsProps {
  patient: Patient;
  lang: 'ar' | 'en';
}

export const CompactVitalsAndMeds: React.FC<CompactVitalsAndMedsProps> = ({ patient, lang }) => {
  const isAr = lang === 'ar';

  const vitalsItems = [
    {
      icon: Heart,
      iconColor: '#DC2626',
      bgColor: '#FEE2E2',
      label: isAr ? 'ضغط الدم' : 'Blood Pressure',
      value: patient.vitals?.bp || '138/88 mmHg'
    },
    {
      icon: Activity,
      iconColor: '#D97706',
      bgColor: '#FEF3C7',
      label: isAr ? 'معدل نبضات القلب' : 'Heart Rate',
      value: `${patient.vitals?.heartRate || 82} bpm`
    },
    {
      icon: Thermometer,
      iconColor: '#059669',
      bgColor: '#D1FAE5',
      label: isAr ? 'درجة الحرارة' : 'Temperature',
      value: patient.vitals?.temp || '37.1 °C'
    },
    {
      icon: Wind,
      iconColor: '#7C3AED',
      bgColor: '#EDE9FE',
      label: isAr ? 'تشبع الأكسجين (SpO₂)' : 'SpO₂',
      value: patient.vitals?.spo2 || '97%'
    },
    {
      icon: Wind,
      iconColor: '#2563EB',
      bgColor: '#DBEAFE',
      label: isAr ? 'معدل التنفس' : 'Respiratory Rate',
      value: '16 /min'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '280px', minWidth: '280px' }}>
      {/* 1. Vital Signs Card */}
      <div
        className="card-box"
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--line)',
          borderRadius: '14px',
          padding: '0.85rem 1rem',
          boxShadow: '0 2px 8px rgba(41, 38, 58, 0.03)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Heart size={16} color="#DC2626" fill="#DC2626" />
            <strong style={{ fontSize: '0.88rem', color: '#2D2254', fontFamily: 'var(--font-heading)' }}>
              {isAr ? 'العلامات الحيوية' : 'Vital Signs'}
            </strong>
          </div>
          <span style={{ fontSize: '0.66rem', color: 'var(--ink-soft)' }}>
            {isAr ? 'قبل 12 دقيقة' : 'Measured 12 min ago'}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {vitalsItems.map((vital, idx) => {
            const IconComp = vital.icon;
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.35rem 0.5rem',
                  borderRadius: '8px',
                  background: '#FAF9FC'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background: vital.bgColor,
                      color: vital.iconColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <IconComp size={13} strokeWidth={2} />
                  </div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--ink-soft)' }}>{vital.label}</span>
                </div>
                <strong style={{ fontSize: '0.82rem', color: 'var(--ink)', fontWeight: 700 }}>
                  {vital.value}
                </strong>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Medications Card */}
      <div
        className="card-box"
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--line)',
          borderRadius: '14px',
          padding: '0.85rem 1rem',
          boxShadow: '0 2px 8px rgba(41, 38, 58, 0.03)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Pill size={16} color="#6B4699" />
            <strong style={{ fontSize: '0.88rem', color: '#2D2254', fontFamily: 'var(--font-heading)' }}>
              {isAr ? 'الأدوية الحالية' : 'Medications'}
            </strong>
          </div>
          <button style={{ background: 'none', border: 'none', color: '#6B4699', fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer' }}>
            {isAr ? 'عرض الكل' : 'View all'}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {patient.medications.slice(0, 3).map((med) => {
            const isConflict = med.mentionStatus === 'conflict' || med.conflictFlag;
            return (
              <div
                key={med.id}
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
                    {med.name} {med.dose}
                  </div>
                  <div style={{ fontSize: '0.66rem', color: 'var(--ink-soft)', marginTop: '0.1rem' }}>
                    <span style={{ fontWeight: 600 }}>{med.sector}</span>
                    <span style={{ margin: '0 0.25rem' }}>●</span>
                    <span style={{ color: isConflict ? '#DC2626' : '#059669', fontWeight: 600 }}>
                      {isConflict ? (isAr ? '⚠ تعارض محتمل' : '⚠ Interaction') : (isAr ? 'نشط' : 'Active')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Patient History Card */}
      <div
        className="card-box"
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--line)',
          borderRadius: '14px',
          padding: '0.85rem 1rem',
          boxShadow: '0 2px 8px rgba(41, 38, 58, 0.03)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
          <strong style={{ fontSize: '0.88rem', color: '#2D2254', fontFamily: 'var(--font-heading)' }}>
            {isAr ? 'التاريخ الطبي للمريض' : 'Patient History'}
          </strong>
          <button style={{ background: 'none', border: 'none', color: '#6B4699', fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer' }}>
            {isAr ? 'عرض السجل' : 'View full history'}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.74rem' }}>
          {/* Chronic Conditions */}
          <div>
            <span style={{ fontSize: '0.68rem', color: 'var(--ink-soft)', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
              {isAr ? 'الأمراض المزمنة:' : 'Chronic Conditions'}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', color: 'var(--ink)' }}>
              <div>• {isAr ? 'ارتفاع ضغط الدم المزمن' : 'Hypertension'}</div>
              <div>• {isAr ? 'داء السكري (النوع الثاني)' : 'Type 2 Diabetes'}</div>
            </div>
          </div>

          {/* Previous Procedures */}
          <div>
            <span style={{ fontSize: '0.68rem', color: 'var(--ink-soft)', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
              {isAr ? 'العمليات السابقة:' : 'Previous Procedures'}
            </span>
            <div style={{ color: 'var(--ink)' }}>
              • {isAr ? 'استئصال الزائدة الدودية · 2023' : 'Appendectomy · 2023'}
            </div>
          </div>

          {/* Allergies */}
          <div>
            <span style={{ fontSize: '0.68rem', color: 'var(--ink-soft)', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
              {isAr ? 'الحساسية:' : 'Allergies'}
            </span>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#DC2626', fontWeight: 700, fontSize: '0.72rem' }}>
              <AlertTriangle size={12} />
              <span>{isAr ? 'بنسلين (حساسية مفرطة)' : 'Penicillin'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
