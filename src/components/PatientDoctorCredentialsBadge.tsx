import React from 'react';
import type { Patient, SectorSource } from '../types/clinical';
import { ShieldCheck, UserCheck, AlertOctagon, Heart, Calendar, Building, Award } from 'lucide-react';
import { getAssetPath } from '../utils/assetHelper';

interface PatientDoctorCredentialsBadgeProps {
  patient: Patient;
  lang: 'ar' | 'en';
}

export const PatientDoctorCredentialsBadge: React.FC<PatientDoctorCredentialsBadgeProps> = ({
  patient,
  lang
}) => {
  const isAr = lang === 'ar';

  const getSectorBadge = (sector: SectorSource) => {
    switch (sector) {
      case 'MOH':
        return (
          <span key={sector} className="badge-sector moh">
            MOH · {isAr ? 'وزارة الصحة' : 'MOH'}
          </span>
        );
      case 'NGHA':
        return (
          <span key={sector} className="badge-sector ngha">
            NGHA · {isAr ? 'الحرس الوطني' : 'NGHA'}
          </span>
        );
      case 'PRIVATE':
        return (
          <span key={sector} className="badge-sector private">
            PRIVATE · {isAr ? 'القطاع الخاص' : 'Private'}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)',
        gap: '1.25rem',
        marginBottom: '1.5rem'
      }}
    >
      {/* 1. PATIENT CLINICAL ID BADGE */}
      <div
        className="clinical-card"
        style={{
          border: '1px solid var(--border-medium)',
          background: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Card Header Stamp */}
        <div
          style={{
            padding: '0.65rem 1.25rem',
            background: 'var(--bg-surface-soft)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.76rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--teal-800)', fontWeight: 700 }}>
            <UserCheck size={15} />
            <span>{isAr ? 'بطاقة التحقق السريري وهوية المريض (Patient Clinical Identity)' : 'Patient Clinical Identity & Security Badge'}</span>
          </div>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              color: 'var(--verified-green)',
              fontWeight: 700,
              fontSize: '0.72rem',
              background: 'var(--verified-green-light)',
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--verified-green-border)'
            }}
          >
            <ShieldCheck size={13} />
            {isAr ? 'هوية موثقة عبر نفاذ والسجل الصحي' : 'Verified via Nafath & National EHR'}
          </span>
        </div>

        {/* Card Body with Portrait & Credentials */}
        <div style={{ padding: '1.15rem 1.25rem', display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Patient Portrait Photo */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img
              src={patient.photoUrl}
              alt={patient.name}
              style={{
                width: '92px',
                height: '92px',
                borderRadius: 'var(--radius-md)',
                objectFit: 'cover',
                border: '2px solid var(--teal-800)',
                boxShadow: 'var(--shadow-card)'
              }}
            />
            <span
              title={isAr ? 'تمت مطابقة الهوية الحيوية' : 'Biometric Match Confirmed'}
              style={{
                position: 'absolute',
                bottom: '-6px',
                right: isAr ? '-6px' : 'auto',
                left: isAr ? 'auto' : '-6px',
                background: 'var(--verified-green)',
                color: 'white',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              ✓
            </span>
          </div>

          {/* Patient Bio & Surgical Metadata */}
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  {isAr ? patient.nameAr : patient.name}
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {patient.name} · {patient.age} {isAr ? 'سنة' : 'yrs'} ({isAr ? patient.genderAr : patient.gender})
                </span>
              </div>

              <div style={{ textAlign: isAr ? 'left' : 'right' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block' }}>
                  {isAr ? 'الرقم الطبي الموحد (MRN)' : 'National Unified MRN'}
                </span>
                <code style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--teal-800)' }}>
                  {patient.mrn}
                </code>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                margin: '0.75rem 0',
                padding: '0.45rem 0.75rem',
                background: 'var(--bg-surface-soft)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                flexWrap: 'wrap'
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)' }}>{isAr ? 'الهوية الوطنية: ' : 'National ID: '}</span>
                <strong>{patient.nationalId}</strong>
              </div>

              <span style={{ color: 'var(--border-subtle)' }}>|</span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Heart size={13} style={{ color: '#E11D48' }} />
                <span style={{ color: 'var(--text-muted)' }}>{isAr ? 'الفصيلة: ' : 'Blood: '}</span>
                <strong style={{ color: '#E11D48' }}>{patient.bloodGroup}</strong>
              </div>

              <span style={{ color: 'var(--border-subtle)' }}>|</span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <AlertOctagon size={13} style={{ color: 'var(--conflict-red)' }} />
                <span style={{ color: 'var(--text-muted)' }}>{isAr ? 'الحساسية: ' : 'Allergies: '}</span>
                <strong style={{ color: 'var(--conflict-red)' }}>
                  {isAr ? patient.allergies[0].substanceAr : patient.allergies[0].substance} ({isAr ? 'شديدة' : 'Severe'})
                </strong>
              </div>
            </div>

            {/* Scheduled Surgery & Connected Sectors */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
                <Calendar size={14} style={{ color: 'var(--teal-800)' }} />
                <strong style={{ color: 'var(--teal-900)' }}>
                  {isAr ? patient.scheduledProcedureAr : patient.scheduledProcedure}
                </strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>
                  ({patient.procedureDate})
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.35rem' }}>
                {patient.sectors.map((s) => getSectorBadge(s))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ATTENDING CONSULTANT ID BADGE (ANTI-FRAUD & INTEGRITY) */}
      <div
        className="clinical-card"
        style={{
          border: '1px solid var(--border-medium)',
          background: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Card Header Stamp */}
        <div
          style={{
            padding: '0.65rem 1.25rem',
            background: 'var(--bg-surface-soft)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.76rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--teal-800)', fontWeight: 700 }}>
            <Award size={15} />
            <span>{isAr ? 'الاستشاري الطبي المسؤول (Attending Physician)' : 'Licensed Attending Consultant'}</span>
          </div>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              color: 'var(--teal-800)',
              fontWeight: 700,
              fontSize: '0.72rem',
              background: 'var(--teal-50)',
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--teal-100)'
            }}
          >
            <ShieldCheck size={13} />
            {isAr ? 'مرخص رسمياً - SCFHS' : 'SCFHS Licensed'}
          </span>
        </div>

        {/* Doctor Details */}
        <div style={{ padding: '1.15rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <img
            src={getAssetPath('/doctor.jpg')}
            alt="Attending Consultant"
            style={{
              width: '84px',
              height: '84px',
              borderRadius: 'var(--radius-md)',
              objectFit: 'cover',
              border: '2px solid var(--border-medium)',
              boxShadow: 'var(--shadow-card)',
              flexShrink: 0
            }}
          />

          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {isAr ? 'د. فيصل بن فهد العتيبي' : 'Dr. Faisal Fahad Al-Otaibi, MD'}
            </h4>
            <span style={{ fontSize: '0.78rem', color: 'var(--teal-800)', fontWeight: 600, display: 'block', marginTop: '0.15rem' }}>
              {isAr ? 'استشاري التخدير وعناية العمليات الحرجة' : 'Consultant Anesthesiologist & Perioperative Care'}
            </span>

            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <div>
                <span>{isAr ? 'ترخيص الهيئة السعودية (SCFHS): ' : 'SCFHS License: '}</span>
                <strong style={{ color: 'var(--text-primary)' }}>14-R-M-008924</strong>
              </div>
              <div style={{ marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Building size={12} />
                <span>{isAr ? 'مدينة الملك فهد الطبية - عيادة ما قبل التخدير' : 'King Fahad Medical City - Pre-Anesthesia Clinic'}</span>
              </div>
            </div>

            <div
              style={{
                marginTop: '0.5rem',
                fontSize: '0.7rem',
                color: 'var(--verified-green-dark)',
                background: 'var(--verified-green-light)',
                padding: '0.2rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--verified-green-border)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <span>🔒 {isAr ? 'مصادقة بيومترية نشطة لمنع انتحال الشخصية والتحايل' : 'Active Biometric Sign-off Session (Anti-Fraud Guard)'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
