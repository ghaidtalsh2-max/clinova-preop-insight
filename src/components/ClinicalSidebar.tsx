import React, { useState } from 'react';
import type { Patient } from '../types/clinical';
import {
  Pill,
  History,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Activity,
  FlaskConical,
  HeartPulse,
  Clock,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Wind
} from 'lucide-react';

interface ClinicalSidebarProps {
  patient: Patient;
  lang: 'ar' | 'en';
}

export const ClinicalSidebar: React.FC<ClinicalSidebarProps> = ({
  patient,
  lang
}) => {
  const isAr = lang === 'ar';
  const [activeTab, setActiveTab] = useState<'labs' | 'procedures' | 'ecg'>('labs');
  const [isSigned, setIsSigned] = useState<boolean>(false);
  const [signTime, setSignTime] = useState<string>('10:42:15');

  // Accordion Expand/Collapse States
  const [isVitalsOpen, setIsVitalsOpen] = useState<boolean>(true);
  const [isMedsOpen, setIsMedsOpen] = useState<boolean>(true);
  const [isTabsOpen, setIsTabsOpen] = useState<boolean>(true);
  const [isAuditOpen, setIsAuditOpen] = useState<boolean>(true);

  const toggleAll = () => {
    const allOpen = isVitalsOpen && isMedsOpen && isTabsOpen && isAuditOpen;
    setIsVitalsOpen(!allOpen);
    setIsMedsOpen(!allOpen);
    setIsTabsOpen(!allOpen);
    setIsAuditOpen(!allOpen);
  };

  const handleSign = () => {
    setIsSigned(true);
    const now = new Date();
    setSignTime(now.toTimeString().split(' ')[0]);
  };

  return (
    <aside
      className="col-left-sidebar"
      aria-label={isAr ? 'العلامات الحيوية والأدوية الموحدة' : 'Vitals & Unified Medications'}
      style={{
        width: '350px',
        overflowY: 'scroll',
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-y',
        padding: '0.85rem 1rem 6rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.95rem'
      }}
    >
      {/* Top Sidebar Action Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.2rem 0.25rem',
          borderBottom: '1px solid var(--line)',
          paddingBottom: '0.5rem'
        }}
      >
        <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--ink-soft)' }}>
          {isAr ? 'الملف السريري والمؤشرات' : 'Clinical Indicators & EHR'}
        </span>
        <button
          onClick={toggleAll}
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--line)',
            color: 'var(--ink-soft)',
            fontSize: '0.68rem',
            fontWeight: 600,
            padding: '0.2rem 0.55rem',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
          title={isAr ? 'فتح أو طي كافة الأقسام' : 'Toggle all sections'}
        >
          <ChevronsUpDown size={12} />
          <span>{isAr ? 'فتح / طي الكل' : 'Toggle All'}</span>
        </button>
      </div>

      {/* ====================================================================
          1. لوحة العلامات الحيوية الملونة الدلالية (COLOR-CODED VITALS PANEL)
          ==================================================================== */}
      <div className="card-box" style={{ background: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', boxShadow: 'var(--shadow-card)' }}>
        <div
          onClick={() => setIsVitalsOpen(!isVitalsOpen)}
          className="card-box-header"
          style={{
            padding: '0.8rem 1.15rem',
            borderBottom: isVitalsOpen ? '1px solid var(--line)' : 'none',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Activity size={16} strokeWidth={1.8} style={{ color: 'var(--lavender)' }} />
            <h3 style={{ fontSize: '0.9rem', margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--ink)' }}>
              {isAr ? 'العلامات الحيوية (Vital Signs)' : 'Vital Signs'}
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ fontSize: '0.66rem', color: 'var(--ink-muted)' }}>10:42 AM</span>
            {isVitalsOpen ? <ChevronUp size={15} color="var(--ink-soft)" /> : <ChevronDown size={15} color="var(--ink-soft)" />}
          </div>
        </div>

        {isVitalsOpen && (
          <div style={{ padding: '0.85rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.55rem' }}>
              {/* 🩸 Blood Pressure */}
              <div
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--line)',
                  borderRight: isAr ? '3px solid #D98B82' : undefined,
                  borderLeft: !isAr ? '3px solid #D98B82' : undefined,
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.55rem 0.75rem'
                }}
              >
                <div style={{ fontSize: '0.7rem', color: 'var(--ink-soft)', marginBottom: '0.15rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{isAr ? 'ضغط الدم' : 'Blood Pressure'}</span>
                  <span style={{ color: '#D98B82', fontSize: '0.8rem' }}>🩸</span>
                </div>
                <strong style={{ fontSize: '1.05rem', color: 'var(--ink)', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                  {patient.vitals.bp || '138/88'}
                </strong>
                <div style={{ fontSize: '0.64rem', color: '#D5B46A', fontWeight: 600, marginTop: '0.1rem' }}>
                  {patient.vitals.bp === '148/92' ? (isAr ? '⚠️ مرتفع قليلاً' : '⚠️ Elevated') : (isAr ? '● طبيعي' : '● Normal')}
                </div>
              </div>

              {/* ❤️ Heart Rate */}
              <div
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--line)',
                  borderRight: isAr ? '3px solid #D97878' : undefined,
                  borderLeft: !isAr ? '3px solid #D97878' : undefined,
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.55rem 0.75rem'
                }}
              >
                <div style={{ fontSize: '0.7rem', color: 'var(--ink-soft)', marginBottom: '0.15rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{isAr ? 'نبض القلب' : 'Heart Rate'}</span>
                  <span style={{ color: '#D97878', fontSize: '0.8rem' }}>❤️</span>
                </div>
                <strong style={{ fontSize: '1.05rem', color: 'var(--ink)', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                  {patient.vitals.heartRate || 82} <span style={{ fontSize: '0.68rem', fontWeight: 500, color: 'var(--ink-muted)' }}>bpm</span>
                </strong>
                <div style={{ fontSize: '0.64rem', color: 'var(--mint)', fontWeight: 600, marginTop: '0.1rem' }}>
                  {isAr ? '● طبيعي' : '● Normal'}
                </div>
              </div>

              {/* 🌡 Temperature */}
              <div
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--line)',
                  borderRight: isAr ? '3px solid #D5B46A' : undefined,
                  borderLeft: !isAr ? '3px solid #D5B46A' : undefined,
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.55rem 0.75rem'
                }}
              >
                <div style={{ fontSize: '0.7rem', color: 'var(--ink-soft)', marginBottom: '0.15rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{isAr ? 'حرارة الجسم' : 'Temperature'}</span>
                  <span style={{ color: '#D5B46A', fontSize: '0.8rem' }}>🌡</span>
                </div>
                <strong style={{ fontSize: '1.05rem', color: 'var(--ink)', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                  {patient.vitals.temp || '37.1 °C'}
                </strong>
                <div style={{ fontSize: '0.64rem', color: 'var(--mint)', fontWeight: 600, marginTop: '0.1rem' }}>
                  {isAr ? '● طبيعي' : '● Normal'}
                </div>
              </div>

              {/* 🫁 SpO2 */}
              <div
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--line)',
                  borderRight: isAr ? '3px solid #82BFA4' : undefined,
                  borderLeft: !isAr ? '3px solid #82BFA4' : undefined,
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.55rem 0.75rem'
                }}
              >
                <div style={{ fontSize: '0.7rem', color: 'var(--ink-soft)', marginBottom: '0.15rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{isAr ? 'الأكسجين' : 'SpO₂'}</span>
                  <span style={{ color: '#82BFA4', fontSize: '0.8rem' }}>🫁</span>
                </div>
                <strong style={{ fontSize: '1.05rem', color: 'var(--ink)', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                  {patient.vitals.spo2 || '97%'}
                </strong>
                <div style={{ fontSize: '0.64rem', color: 'var(--mint)', fontWeight: 600, marginTop: '0.1rem' }}>
                  {isAr ? '● طبيعي' : '● Normal'}
                </div>
              </div>
            </div>

            {/* 🌬 Respiratory Rate - Full Width Card */}
            <div
              style={{
                marginTop: '0.55rem',
                background: 'var(--bg)',
                border: '1px solid var(--line)',
                borderRight: isAr ? '3px solid var(--lavender)' : undefined,
                borderLeft: !isAr ? '3px solid var(--lavender)' : undefined,
                borderRadius: 'var(--radius-sm)',
                padding: '0.45rem 0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Wind size={13} color="var(--lavender)" />
                <span style={{ fontSize: '0.72rem', color: 'var(--ink-soft)' }}>{isAr ? 'معدل التنفس (Respiratory Rate)' : 'Respiratory Rate'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <strong style={{ fontSize: '0.95rem', color: 'var(--ink)' }}>16 /min</strong>
                <span style={{ fontSize: '0.64rem', color: 'var(--mint)', fontWeight: 600 }}>{isAr ? '● طبيعي' : '● Normal'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ====================================================================
          2. سجل الأدوية الموحد (MEDICATIONS WITH MOH/NGHA/PRIVATE BADGES)
          ==================================================================== */}
      <div className="card-box" style={{ background: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', boxShadow: 'var(--shadow-card)' }}>
        <div
          onClick={() => setIsMedsOpen(!isMedsOpen)}
          className="card-box-header"
          style={{
            padding: '0.8rem 1.15rem',
            borderBottom: isMedsOpen ? '1px solid var(--line)' : 'none',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--lavender)' }}>
            <Pill size={16} strokeWidth={1.8} />
            <h3 style={{ fontSize: '0.9rem', margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--ink)' }}>
              {isAr ? 'الأدوية الموحدة (Medications)' : 'Medications'}
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ fontSize: '0.66rem', color: 'var(--ink-soft)', background: 'var(--bg)', border: '1px solid var(--line)', padding: '0.1rem 0.45rem', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
              {patient.medications.length} {isAr ? 'أدوية' : 'Meds'}
            </span>
            {isMedsOpen ? <ChevronUp size={15} color="var(--ink-soft)" /> : <ChevronDown size={15} color="var(--ink-soft)" />}
          </div>
        </div>

        {isMedsOpen && (
          <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {patient.medications.map((med) => {
              const isConflict = med.mentionStatus === 'conflict';
              
              const getSectorStyle = (sector: string) => {
                if (sector === 'MOH') return { bg: 'var(--mint-soft)', color: '#1A7052', border: 'var(--mint-border)', label: 'MOH' };
                if (sector === 'NGHA') return { bg: 'var(--lavender-soft)', color: '#4B3666', border: 'var(--lavender-border)', label: 'NGHA' };
                return { bg: 'var(--gold-soft)', color: '#8C6D1F', border: 'var(--gold-border)', label: 'Private' };
              };

              const sectorStyle = getSectorStyle(med.sector);

              return (
                <div
                  key={med.id}
                  style={{
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.6rem 0.75rem',
                    background: isConflict ? 'var(--crit-soft)' : 'var(--bg)',
                    border: '1px solid',
                    borderColor: isConflict ? 'var(--crit-border)' : 'var(--line)',
                    borderRight: isAr && isConflict ? '3px solid var(--crit)' : undefined,
                    borderLeft: !isAr && isConflict ? '3px solid var(--crit)' : undefined,
                    transition: 'all 150ms ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <div>
                      <strong style={{ fontSize: '0.84rem', color: 'var(--ink)', fontWeight: 600 }}>
                        {med.name}
                      </strong>
                      <div style={{ fontSize: '0.7rem', color: 'var(--ink-soft)', marginTop: '0.1rem' }}>
                        {med.dose} · {med.frequency}
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: '0.64rem',
                        fontWeight: 600,
                        background: sectorStyle.bg,
                        color: sectorStyle.color,
                        border: `1px solid ${sectorStyle.border}`,
                        padding: '0.1rem 0.45rem',
                        borderRadius: 'var(--radius-full)',
                        flexShrink: 0
                      }}
                    >
                      {isAr ? med.sectorAr : sectorStyle.label}
                    </span>
                  </div>

                  {med.conflictFlag && (
                    <div
                      style={{
                        marginTop: '0.4rem',
                        padding: '0.35rem 0.55rem',
                        background: 'rgba(201, 108, 108, 0.1)',
                        border: '1px solid var(--crit-border)',
                        borderRadius: '4px',
                        fontSize: '0.68rem',
                        color: 'var(--crit)',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.3rem'
                      }}
                    >
                      <AlertCircle size={12} style={{ flexShrink: 0, marginTop: '1px' }} />
                      <span>{isAr ? (med.conflictDescriptionAr || 'تطابق محتمل يتطلب التحقق السريري') : med.conflictDescription}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ====================================================================
          3. العمليات السابقة والتحاليل المخبرية والتخطيط (TABS: LABS / PROCEDURES / ECG)
          ==================================================================== */}
      <div className="card-box" style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--line)', boxShadow: '0 2px 14px rgba(38, 33, 53, 0.03)' }}>
        <div
          onClick={() => setIsTabsOpen(!isTabsOpen)}
          style={{
            padding: '0.75rem 0.85rem',
            borderBottom: isTabsOpen ? '1px solid var(--line)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <strong style={{ fontSize: '0.86rem', color: '#2D2254', fontFamily: 'var(--font-heading)' }}>
            {isAr ? 'الفحوصات والعمليات السابقة' : 'Past Labs, ECG & Procedures'}
          </strong>
          {isTabsOpen ? <ChevronUp size={15} color="var(--ink-soft)" /> : <ChevronDown size={15} color="var(--ink-soft)" />}
        </div>

        {isTabsOpen && (
          <>
            <div style={{ padding: '0.5rem 0.75rem 0 0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#FAF8F5', padding: '3px', borderRadius: '8px' }}>
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveTab('labs'); }}
                  style={{
                    flex: 1,
                    padding: '0.35rem 0.45rem',
                    fontSize: '0.72rem',
                    fontWeight: activeTab === 'labs' ? 700 : 500,
                    background: activeTab === 'labs' ? '#FFFFFF' : 'transparent',
                    color: activeTab === 'labs' ? '#2D2254' : 'var(--ink-soft)',
                    border: activeTab === 'labs' ? '1px solid var(--line)' : 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem',
                    boxShadow: activeTab === 'labs' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  <FlaskConical size={12} />
                  <span>{isAr ? 'التحاليل' : 'Labs'}</span>
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); setActiveTab('procedures'); }}
                  style={{
                    flex: 1,
                    padding: '0.35rem 0.45rem',
                    fontSize: '0.72rem',
                    fontWeight: activeTab === 'procedures' ? 700 : 500,
                    background: activeTab === 'procedures' ? '#FFFFFF' : 'transparent',
                    color: activeTab === 'procedures' ? '#2D2254' : 'var(--ink-soft)',
                    border: activeTab === 'procedures' ? '1px solid var(--line)' : 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem',
                    boxShadow: activeTab === 'procedures' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  <History size={12} />
                  <span>{isAr ? 'العمليات' : 'Procedures'}</span>
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); setActiveTab('ecg'); }}
                  style={{
                    flex: 1,
                    padding: '0.35rem 0.45rem',
                    fontSize: '0.72rem',
                    fontWeight: activeTab === 'ecg' ? 700 : 500,
                    background: activeTab === 'ecg' ? '#FFFFFF' : 'transparent',
                    color: activeTab === 'ecg' ? '#2D2254' : 'var(--ink-soft)',
                    border: activeTab === 'ecg' ? '1px solid var(--line)' : 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem',
                    boxShadow: activeTab === 'ecg' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  <HeartPulse size={12} />
                  <span>{isAr ? 'التخطيط' : 'ECG'}</span>
                </button>
              </div>
            </div>

            <div style={{ padding: '0.75rem', maxHeight: '220px', overflowY: 'auto' }}>
              {/* TAB 1: LABS */}
              {activeTab === 'labs' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {patient.pastLabs.map((lab) => (
                    <div
                      key={lab.id}
                      style={{
                        background: '#FAF8F5',
                        border: '1px solid var(--line)',
                        borderRadius: '8px',
                        padding: '0.55rem 0.7rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <strong style={{ fontSize: '0.8rem', color: '#2D2254', fontWeight: 600 }}>
                          {isAr ? lab.testNameAr : lab.testName}
                        </strong>
                        <span style={{ fontSize: '0.64rem', color: '#059669', background: '#D1FAE5', padding: '0.08rem 0.35rem', borderRadius: '4px', fontWeight: 600 }}>
                          {isAr ? 'طبيعي' : 'Normal'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#0D8275', fontWeight: 700, marginTop: '0.15rem' }}>
                        {isAr ? lab.resultAr : lab.result}
                      </div>
                      <div style={{ fontSize: '0.66rem', color: 'var(--ink-soft)', marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={11} />
                        <span>{lab.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 2: PROCEDURES */}
              {activeTab === 'procedures' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {patient.pastProcedures.map((proc) => (
                    <div
                      key={proc.id}
                      style={{
                        background: '#FAF8F5',
                        border: '1px solid var(--line)',
                        borderRadius: '8px',
                        padding: '0.55rem 0.7rem'
                      }}
                    >
                      <strong style={{ fontSize: '0.8rem', color: '#2D2254', fontWeight: 600 }}>
                        {isAr ? proc.procedureNameAr : proc.procedureName}
                      </strong>
                      <div style={{ fontSize: '0.7rem', color: 'var(--ink-soft)', marginTop: '0.15rem' }}>
                        {isAr ? proc.hospitalAr : proc.hospital}
                      </div>
                      <div style={{ fontSize: '0.66rem', color: 'var(--ink-soft)', marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={11} />
                        <span>{proc.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: ECG */}
              {activeTab === 'ecg' && (
                <div style={{ background: '#FAF8F5', border: '1px solid var(--line)', borderRadius: '8px', padding: '0.65rem 0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <strong style={{ fontSize: '0.8rem', color: '#2D2254' }}>
                      12-Lead Resting ECG
                    </strong>
                    <span style={{ fontSize: '0.64rem', color: '#059669', background: '#D1FAE5', padding: '0.08rem 0.35rem', borderRadius: '4px', fontWeight: 600 }}>
                      {isAr ? 'سليم' : 'Normal'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: 'var(--ink-soft)', margin: 0, lineHeight: 1.5 }}>
                    {isAr
                      ? 'نظم جيبي منتظم 82 نبضة/دقيقة. لا توجد علامات نقص تروية أو تضخم بالبطين.'
                      : 'Normal Sinus Rhythm 82 bpm. No ST-T changes or acute ischemia.'}
                  </p>
                  <div style={{ fontSize: '0.66rem', color: 'var(--ink-soft)', marginTop: '0.3rem' }}>
                    {isAr ? 'تاريخ التخطيط: 2026-08-30' : 'Date: 2026-08-30'}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ====================================================================
          4. سجل التدقيق والمصادقة الرقمية (CLINICAL AUDIT TRAIL)
          ==================================================================== */}
      <div className="card-box" style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--line)', boxShadow: '0 2px 14px rgba(38, 33, 53, 0.03)' }}>
        <div
          onClick={() => setIsAuditOpen(!isAuditOpen)}
          className="card-box-header"
          style={{
            padding: '0.8rem 1.15rem',
            borderBottom: isAuditOpen ? '1px solid var(--line)' : 'none',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <FileCheck size={16} style={{ color: '#0D8275' }} />
            <h3 style={{ fontSize: '0.88rem', margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 600, color: '#2D2254' }}>
              {isAr ? 'سجل التدقيق والمصادقة' : 'Clinical Audit & Sign-off'}
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.64rem', color: '#059669', background: '#D1FAE5', padding: '0.08rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>
              {isAr ? 'ختم موثق' : 'Verified'}
            </span>
            {isAuditOpen ? <ChevronUp size={15} color="var(--ink-soft)" /> : <ChevronDown size={15} color="var(--ink-soft)" />}
          </div>
        </div>

        {isAuditOpen && (
          <div style={{ padding: '0.8rem 1.15rem' }}>
            <div style={{ fontSize: '0.73rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
              <div>{isAr ? 'الطبيب المعالج:' : 'Attending Physician:'} <strong>{isAr ? 'د. سارة محمد (استشاري)' : 'Dr. Sarah Mohammed (Consultant)'}</strong></div>
              <div>{isAr ? 'الترخيص الطبي:' : 'License:'} <strong>R-M-008924-14 (CBAHI / SCFHS)</strong></div>
              <div>{isAr ? 'وقت المطابقة:' : 'Timestamp:'} <strong>{signTime}</strong></div>
            </div>

            <button
              onClick={handleSign}
              style={{
                width: '100%',
                marginTop: '0.7rem',
                padding: '0.45rem 0.85rem',
                fontSize: '0.76rem',
                fontWeight: 700,
                borderRadius: '8px',
                border: 'none',
                background: isSigned ? '#D1FAE5' : '#2D2254',
                color: isSigned ? '#059669' : '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                transition: 'all 200ms ease'
              }}
            >
              {isSigned ? (
                <>
                  <CheckCircle2 size={14} />
                  <span>{isAr ? 'تمت المصادقة الرقمية بنجاح ✓' : 'Digitally Signed ✓'}</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={14} />
                  <span>{isAr ? 'مصادقة الطبيب على التقييم السريري' : 'Sign-off Assessment'}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
