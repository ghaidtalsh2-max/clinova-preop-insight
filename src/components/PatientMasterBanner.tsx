import React, { useState } from 'react';
import type { Patient } from '../types/clinical';
import {
  ShieldCheck,
  Zap,
  AlertTriangle,
  History,
  Heart,
  Droplet,
  User,
  Stethoscope
} from 'lucide-react';

interface PatientMasterBannerProps {
  patient: Patient;
  lang: 'ar' | 'en';
}

export const PatientMasterBanner: React.FC<PatientMasterBannerProps> = ({
  patient,
  lang
}) => {
  const isAr = lang === 'ar';
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

  const hasConflict = patient.medications.some((m) => m.mentionStatus === 'conflict');

  // Helper for timeline node color by event category
  const getEventCategoryColor = (year: number, title: string, idx: number) => {
    if (year === 2026 || title.toLowerCase().includes('conflict') || title.includes('تعارض')) {
      return { bg: '#D5B46A', text: '#8C6D1F', label: 'major', dot: '#D5B46A' }; // 🟠 Major Event / Alert
    }
    if (idx === 0) return { bg: '#899BCB', text: '#2D3E6B', label: 'diagnosis', dot: '#899BCB' }; // 🔵 Diagnosis
    if (idx === 1) return { bg: '#9B82BA', text: '#473263', label: 'visit', dot: '#9B82BA' }; // 🟣 Visit
    if (idx === 2) return { bg: '#A88BC4', text: '#4B3666', label: 'medication', dot: '#A88BC4' }; // 💜 Medication
    return { bg: '#82BFA4', text: '#1E5841', label: 'procedure', dot: '#82BFA4' }; // 🟢 Procedure
  };

  return (
    <div
      className="card-box patient-master-banner"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-md)',
        padding: '1.15rem 1.4rem',
        boxShadow: 'var(--shadow-card)',
        marginBottom: '1.15rem',
        position: 'relative'
      }}
      aria-label={isAr ? 'بطاقة المريض والمسار الزمني الموحد' : 'Patient Master Profile & Journey'}
    >
      {/* Top Row: Patient Demographics & Surgery */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingBottom: '0.9rem',
          borderBottom: '1px solid var(--line-subtle)'
        }}
      >
        {/* Patient Photo & Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
          {/* Avatar with Soft Lavender Ring */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img
              src={patient.photoUrl}
              alt={patient.name}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--surface)',
                boxShadow: '0 0 0 2px var(--lavender)'
              }}
            />
            <span
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                background: 'var(--mint)',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--surface)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
              }}
              title={isAr ? 'هوية موثقة رقمياً' : 'Verified Identity'}
            >
              <ShieldCheck size={11} strokeWidth={2} />
            </span>
          </div>

          <div>
            {/* Name and Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <h1
                style={{
                  fontSize: '1.3rem',
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--ink)',
                  margin: 0,
                  fontWeight: 600,
                  letterSpacing: '-0.01em'
                }}
              >
                {isAr ? patient.nameAr : patient.name}
              </h1>

              {/* Nafath Badge */}
              <span
                style={{
                  fontSize: '0.7rem',
                  background: 'var(--mint-soft)',
                  color: 'var(--mint)',
                  border: '1px solid var(--mint-border)',
                  padding: '0.12rem 0.55rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <ShieldCheck size={12} strokeWidth={1.5} />
                <span>{isAr ? 'موثّق عبر نفاذ' : 'Nafath Verified'}</span>
              </span>

              {/* NPHIES Compliance Badge */}
              <span
                style={{
                  fontSize: '0.7rem',
                  background: 'var(--lavender-soft)',
                  color: 'var(--ink)',
                  border: '1px solid var(--lavender-border)',
                  padding: '0.12rem 0.55rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <Zap size={12} strokeWidth={1.5} style={{ color: 'var(--lavender)' }} />
                <span>{isAr ? 'NPHIES / FHIR' : 'NPHIES / FHIR'}</span>
              </span>

              {/* Critical Conflict Tag if present */}
              {hasConflict && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    background: 'var(--crit-soft)',
                    color: 'var(--crit)',
                    border: '1px solid var(--crit-border)',
                    padding: '0.12rem 0.55rem',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <AlertTriangle size={12} strokeWidth={1.5} />
                  <span>{isAr ? 'يوجد تعارض دوائي' : 'Medication Conflict'}</span>
                </span>
              )}
            </div>

            {/* Metadata Pills Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                flexWrap: 'wrap',
                marginTop: '0.35rem',
                fontSize: '0.78rem',
                color: 'var(--ink-soft)'
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <User size={12} strokeWidth={1.5} style={{ color: 'var(--ink-muted)' }} />
                <span><strong>{isAr ? 'الهوية:' : 'ID:'}</strong> {patient.nationalId}</span>
              </span>

              <span>•</span>

              <span><strong>{patient.mrn}</strong></span>

              <span>•</span>

              <span>{patient.age} {isAr ? 'سنة' : 'yrs'} ({isAr ? patient.genderAr : patient.gender})</span>

              <span>•</span>

              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <Droplet size={12} strokeWidth={1.5} style={{ color: 'var(--crit)' }} />
                <span><strong>{isAr ? 'الفصيلة:' : 'Blood:'}</strong> {patient.bloodGroup}</span>
              </span>

              <span>•</span>

              {/* 🔴 Allergy Badge */}
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  color: patient.allergies.length > 0 ? 'var(--crit)' : 'var(--mint)',
                  background: patient.allergies.length > 0 ? 'var(--crit-soft)' : 'transparent',
                  padding: patient.allergies.length > 0 ? '0.1rem 0.5rem' : '0',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 600
                }}
              >
                <Heart size={12} strokeWidth={1.5} />
                <span>
                  <strong>{isAr ? 'الحساسية:' : 'Allergies:'}</strong>{' '}
                  {patient.allergies.length > 0
                    ? (isAr ? patient.allergies.map(a => a.substanceAr).join(', ') : patient.allergies.map(a => a.substance).join(', '))
                    : (isAr ? 'لا توجد حساسية' : 'No allergies')}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Scheduled Surgery Details Card */}
        <div
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.6rem 0.95rem',
            textAlign: isAr ? 'left' : 'right',
            minWidth: '210px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: isAr ? 'flex-start' : 'flex-end', fontSize: '0.7rem', color: 'var(--ink-soft)' }}>
            <Stethoscope size={13} strokeWidth={1.5} style={{ color: 'var(--lavender)' }} />
            <span>{isAr ? 'الإجراء الجراحي المقرر' : 'Scheduled Procedure'}</span>
          </div>
          <strong style={{ fontSize: '0.9rem', color: 'var(--ink)', display: 'block', marginTop: '0.15rem', fontWeight: 600 }}>
            {isAr ? patient.scheduledProcedureAr : patient.scheduledProcedure}
          </strong>
          <span style={{ fontSize: '0.7rem', color: 'var(--ink-muted)', marginTop: '0.1rem', display: 'block' }}>
            {isAr ? patient.hospitalAr : patient.hospital}
          </span>
        </div>
      </div>

      {/* Bottom Row: Patient Journey — Timeline (Color Coded & Alive) */}
      <div style={{ marginTop: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--lavender)' }}>
            <History size={15} strokeWidth={1.8} />
            <strong style={{ fontSize: '0.82rem', fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--ink)' }}>
              {isAr ? 'المسار الصحي الزمني الموحد' : 'Patient Journey — Timeline'}
            </strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.68rem', color: 'var(--ink-muted)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#899BCB' }} />
              {isAr ? 'تشخيص' : 'Diagnosis'}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#9B82BA' }} />
              {isAr ? 'زيارة' : 'Visit'}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#A88BC4' }} />
              {isAr ? 'دواء' : 'Medication'}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#82BFA4' }} />
              {isAr ? 'إجراء' : 'Procedure'}
            </span>
          </div>
        </div>

        {/* Timeline Horizontal Stepper with Central Soft Lavender/Blue Line */}
        <div style={{ position: 'relative', padding: '0.5rem 0.25rem' }}>
          {/* Connecting Line */}
          <div
            style={{
              position: 'absolute',
              top: '24px',
              left: '4%',
              right: '4%',
              height: '2px',
              background: 'var(--timeline-blue)',
              opacity: 0.5,
              zIndex: 1
            }}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${patient.timeline.length}, 1fr)`,
              gap: '0.5rem',
              position: 'relative',
              zIndex: 2
            }}
          >
            {patient.timeline.map((event, idx) => {
              const cat = getEventCategoryColor(event.year, event.title, idx);
              const isHovered = hoveredEventId === event.id;

              return (
                <div
                  key={event.id}
                  onMouseEnter={() => setHoveredEventId(event.id)}
                  onMouseLeave={() => setHoveredEventId(null)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  {/* Event Node Dot */}
                  <div
                    style={{
                      width: isHovered ? '20px' : '15px',
                      height: isHovered ? '20px' : '15px',
                      borderRadius: '50%',
                      background: cat.dot,
                      border: '2px solid var(--surface)',
                      boxShadow: isHovered ? `0 0 0 4px rgba(156, 145, 199, 0.35)` : '0 1px 3px rgba(0,0,0,0.1)',
                      transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                      marginBottom: '0.45rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  />

                  {/* Year Tag */}
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: isHovered ? 'var(--ink)' : 'var(--ink-soft)',
                      fontFamily: 'var(--font-heading)'
                    }}
                  >
                    {event.year}
                  </span>

                  {/* Event Title */}
                  <span
                    style={{
                      fontSize: '0.74rem',
                      color: 'var(--ink)',
                      fontWeight: 500,
                      marginTop: '0.15rem',
                      maxWidth: '120px',
                      lineHeight: 1.3
                    }}
                  >
                    {isAr ? event.titleAr : event.title}
                  </span>

                  {/* Hover Tooltip Details */}
                  {isHovered && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '100%',
                        marginBottom: '8px',
                        background: 'var(--surface)',
                        border: '1px solid var(--line)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.5rem 0.75rem',
                        boxShadow: 'var(--shadow-float)',
                        fontSize: '0.72rem',
                        color: 'var(--ink)',
                        zIndex: 100,
                        width: '180px',
                        textAlign: isAr ? 'right' : 'left',
                        animation: 'fadeIn 150ms ease'
                      }}
                    >
                      <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '0.2rem' }}>
                        {isAr ? event.sectorAr : event.sector} ({event.year})
                      </div>
                      <div style={{ color: 'var(--ink-soft)' }}>
                        {event.clinicalValueAr || event.clinicalValue || (isAr ? event.titleAr : event.title)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

