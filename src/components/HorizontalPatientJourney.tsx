import React from 'react';
import type { Patient } from '../types/clinical';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface HorizontalPatientJourneyProps {
  patient: Patient;
  lang: 'ar' | 'en';
}

export const HorizontalPatientJourney: React.FC<HorizontalPatientJourneyProps> = ({
  patient: _patient,
  lang
}) => {
  const isAr = lang === 'ar';

  const milestones = [
    {
      year: '2019',
      title: isAr ? 'ارتفاع ضغط الدم' : 'Hypertension',
      type: isAr ? 'تشخيص' : 'Diagnosis',
      color: '#6B4699'
    },
    {
      year: '2021',
      title: isAr ? 'ميتفورمين' : 'Metformin',
      type: isAr ? 'دواء' : 'Medication',
      color: '#0D8275'
    },
    {
      year: '2023',
      title: isAr ? 'استئصال الزائدة' : 'Appendectomy',
      type: isAr ? 'عملية جراحية' : 'Procedure',
      color: '#3B82F6'
    },
    {
      year: '2025',
      title: isAr ? 'أملوديبين' : 'Amlodipine',
      type: isAr ? 'دواء' : 'Medication',
      color: '#6B4699'
    },
    {
      year: isAr ? 'اليوم' : 'Today',
      title: isAr ? 'تقييم ما قبل الجراحة' : 'Pre-Op Assessment',
      type: isAr ? 'زيارة سريرية' : 'Visit',
      color: '#059669'
    }
  ];

  return (
    <div
      style={{
        padding: '0.2rem 0.2rem 0.5rem 0.2rem',
        margin: '0',
        background: 'transparent',
        border: 'none',
        boxShadow: 'none'
      }}
    >
      {/* عنوان المسار بدون أيقونة وبدون بوكس */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.65rem',
          padding: '0 0.1rem'
        }}
      >
        <span style={{ fontSize: '0.8rem', color: '#4B2B73', fontWeight: 800, letterSpacing: '0.01em' }}>
          {isAr ? 'مسار رحلة المريض (Patient Journey)' : 'Patient Journey Timeline'}
        </span>

        <span
          style={{
            color: 'var(--ink-soft)',
            fontSize: '0.68rem',
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
        >
          <span>{isAr ? 'من 2019 حتى الزيارة الحالية' : 'From 2019 to Present'}</span>
          {isAr ? <ArrowLeft size={11} /> : <ArrowRight size={11} />}
        </span>
      </div>

      {/* شريط المسار الأفقي المفتوح تماماً بدون بوكس وبدون أيقونات */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          position: 'relative',
          padding: '0 0.75rem'
        }}
      >
        {/* خط التوصيل الأفقي الناعم */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '28px',
            right: '28px',
            height: '2px',
            background: 'linear-gradient(90deg, #DCD2EC 0%, #BBEAE5 60%, #059669 100%)',
            zIndex: 1
          }}
        />

        {/* محطات الخط الزمني - بدون أيقونات (نقاط دائرية رقمية أنيقة فقط) */}
        {milestones.map((m, idx) => {
          const isCurrent = idx === milestones.length - 1;

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                zIndex: 2,
                flex: 1,
                cursor: 'pointer',
                transition: 'transform 0.18s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {/* نقطة المحطة بدون أيقونة */}
              <div
                style={{
                  width: isCurrent ? '18px' : '14px',
                  height: isCurrent ? '18px' : '14px',
                  borderRadius: '50%',
                  background: isCurrent ? '#059669' : '#FFFFFF',
                  border: `3px solid ${isCurrent ? '#059669' : m.color}`,
                  boxShadow: isCurrent ? '0 0 0 4px rgba(5, 150, 105, 0.2)' : '0 1px 3px rgba(0,0,0,0.1)',
                  marginBottom: '0.4rem',
                  transition: 'all 0.18s ease'
                }}
              />

              {/* السنة */}
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: isCurrent ? '#059669' : '#2D2254',
                  marginBottom: '0.1rem'
                }}
              >
                {m.year}
              </span>

              {/* العنوان */}
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  color: isCurrent ? '#059669' : 'var(--ink)',
                  textAlign: 'center',
                  maxWidth: '90px',
                  lineHeight: 1.25
                }}
              >
                {m.title}
              </span>

              {/* نوع الحدث */}
              <span
                style={{
                  fontSize: '0.6rem',
                  color: 'var(--ink-soft)',
                  marginTop: '0.1rem'
                }}
              >
                {m.type}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
