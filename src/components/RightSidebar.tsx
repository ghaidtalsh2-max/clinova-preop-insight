import React, { useState, useRef, useEffect } from 'react';
import type { Patient } from '../types/clinical';
import {
  User, FileText, Activity, Heart, Thermometer, Wind, Droplets,
  AlertTriangle, Plus, Check, Shield, Clock, Pill, History,
  ChevronDown, ChevronUp
} from 'lucide-react';

interface Props {
  patient: Patient;
  lang: 'ar' | 'en';
}

const CountUpVital: React.FC<{ value: string; patientId: string }> = ({ value, patientId }) => {
  const [displayValue, setDisplayValue] = useState<string>(value);
  const animatedRef = useRef<string | null>(null);

  useEffect(() => {
    if (animatedRef.current === patientId) {
      setDisplayValue(value);
      return;
    }
    animatedRef.current = patientId;

    const numbers = value.match(/\d+(\.\d+)?/g);
    if (!numbers || numbers.length === 0) {
      setDisplayValue(value);
      return;
    }

    const start = performance.now();
    const duration = 750;
    let frameId: number;

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      const current = value.replace(/\d+(\.\d+)?/g, (match) => {
        const target = parseFloat(match);
        const isDecimal = match.includes('.');
        const val = target * ease;
        return isDecimal ? val.toFixed(1) : Math.round(val).toString();
      });

      setDisplayValue(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [value, patientId]);

  return <span>{displayValue}</span>;
};

export const RightSidebar: React.FC<Props> = ({ patient, lang }) => {
  const isAr = lang === 'ar';
  const [newNote, setNewNote] = useState('');
  const [isPatientDetailsOpen, setIsPatientDetailsOpen] = useState(false);
  const [notes, setNotes] = useState<string[]>([
    isAr ? 'المريض يلتزم بمواعيد الفحص، ولكن يحتاج مراجعة جرعة الأملوديبين.' : 'Patient is compliant, but Amlodipine dosage needs reassessment.'
  ]);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setNotes([newNote.trim(), ...notes]);
    setNewNote('');
  };

  return (
    <aside
      aria-label={isAr ? 'الملف الطبي والمؤشرات الحيوية' : 'Patient Clinical Profile and Vitals'}
      style={{
        width: 320,
        minWidth: 320,
        maxWidth: 340,
        flexShrink: 0,
        background: '#FAF9FC',
        borderRight: isAr ? 'none' : '1px solid var(--line)',
        borderLeft: isAr ? '1px solid var(--line)' : 'none',
        height: 'calc(100vh - var(--header-height))',
        maxHeight: 'calc(100vh - var(--header-height))',
        position: 'sticky',
        top: 'var(--header-height)',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        overscrollBehaviorY: 'contain',
        padding: '0.75rem 0.85rem 8rem 0.85rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        boxSizing: 'border-box',
        zIndex: 20,
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--primary) #F1F5F9'
      }}
    >
      {/* 1. Patient Profile Card - Sticky so photo and icon NEVER disappear */}
      <div
        className="card-box"
        style={{
          padding: '0.85rem 1rem',
          textAlign: 'center',
          background: '#FFFFFF',
          borderRadius: 12,
          position: 'sticky',
          top: 0,
          zIndex: 30,
          boxShadow: '0 2px 10px rgba(0,0,0,0.06)'
        }}
      >
        <div
          onClick={() => setIsPatientDetailsOpen(!isPatientDetailsOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem',
            cursor: 'pointer',
            userSelect: 'none'
          }}
          title={isAr ? 'اضغط لإظهار أو إخفاء التفاصيل' : 'Click to toggle details'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <div style={{
              width: 28, height: 28, minWidth: 28, flexShrink: 0, borderRadius: '7px',
              background: 'rgba(79, 70, 229, 0.12)', color: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <User size={16} />
            </div>
            <span style={{ fontSize: '0.86rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              {isAr ? 'ملف المريض' : 'Patient Profile'}
              {isPatientDetailsOpen ? (
                <ChevronUp size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
              ) : (
                <ChevronDown size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
              )}
            </span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600 }}>
            {patient.nationalId}
          </span>
        </div>

        <img
          src={patient.photoUrl || '/saud.jpg'}
          alt={patient.name}
          style={{
            width: 70,
            height: 70,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '3px solid var(--lavender)',
            margin: '0 auto 0.6rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
        />

        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--ink)' }}>
          {isAr ? patient.nameAr : patient.name}
        </div>
        <div style={{ fontSize: '0.76rem', color: 'var(--ink-soft)', marginTop: '0.2rem' }}>
          {patient.age} {isAr ? 'سنة' : 'years'} • {isAr ? patient.genderAr : patient.gender === 'male' ? 'Male' : 'Female'} • MRN <strong style={{ color: 'var(--primary)' }}>{patient.mrn}</strong>
        </div>

        {patient.allergies.length > 0 && (
          <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
            {patient.allergies.map((a, i) => (
              <span key={i} style={{
                fontSize: '0.68rem', background: '#FEE2E2', color: '#DC2626',
                border: '1px solid #FECACA', padding: '0.15rem 0.5rem', borderRadius: 6, fontWeight: 700,
                display: 'inline-flex', alignItems: 'center', gap: '0.3rem'
              }}>
                <AlertTriangle size={12} style={{ flexShrink: 0 }} />
                {isAr ? a.substanceAr : a.substance} ({isAr ? 'حساسية' : 'Allergy'})
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 2, 3, 4: Collapsible Details (Vitals, Medications, History) */}
      {isPatientDetailsOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {/* 2. Vital Signs Card */}
      <div className="card-box" style={{ padding: '0.85rem 1rem', background: '#FFFFFF', borderRadius: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <div style={{
              width: 28, height: 28, minWidth: 28, flexShrink: 0, borderRadius: '7px',
              background: '#FEE2E2', color: '#DC2626',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Heart size={15} />
            </div>
            <span style={{ fontSize: '0.86rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
              {isAr ? 'العلامات الحيوية' : 'Vital Signs'}
            </span>
          </div>
          <span style={{ fontSize: '0.66rem', color: 'var(--ink-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={12} style={{ flexShrink: 0 }} />
            {isAr ? patient.vitals.measuredTimeAgoAr : patient.vitals.measuredTimeAgo}
          </span>
        </div>

        {[
          { icon: <Activity size={15} />, label: isAr ? 'ضغط الدم' : 'Blood Pressure', val: patient.vitals.bp, color: '#DC2626', badge: isAr ? 'مرتفع قليلاً' : 'Slightly High' },
          { icon: <Heart size={15} />, label: isAr ? 'نبض القلب' : 'Heart Rate', val: `${patient.vitals.heartRate} bpm`, color: '#E11D48' },
          { icon: <Thermometer size={15} />, label: isAr ? 'حرارة الجسم' : 'Temperature', val: patient.vitals.temp, color: '#D97706' },
          { icon: <Droplets size={15} />, label: isAr ? 'تشبع الأكسجين' : 'SpO₂', val: patient.vitals.spo2, color: '#0891B2' },
          { icon: <Wind size={15} />, label: isAr ? 'معدل التنفس' : 'Respiratory', val: '16 /min', color: '#059669' },
        ].map((v, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.45rem 0',
              borderTop: i ? '1px solid var(--line-subtle)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--ink)', fontSize: '0.78rem' }}>
              <div style={{
                width: 26, height: 26, minWidth: 26, flexShrink: 0,
                borderRadius: 6, background: `${v.color}15`, color: v.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {v.icon}
              </div>
              <span style={{ fontWeight: 500 }}>{v.label}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <strong style={{ fontSize: '0.82rem', color: 'var(--ink)' }}>
                <CountUpVital value={v.val} patientId={patient.id} />
              </strong>
              {v.badge && (
                <span style={{ fontSize: '0.62rem', background: '#FEF2F2', color: '#DC2626', padding: '0.1rem 0.4rem', borderRadius: 4, fontWeight: 700 }}>
                  {v.badge}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Medications Card */}
      <div className="card-box" style={{ padding: '0.85rem 1rem', background: '#FFFFFF', borderRadius: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <div style={{
              width: 28, height: 28, minWidth: 28, flexShrink: 0, borderRadius: '7px',
              background: '#FEF3C7', color: '#D97706',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Pill size={15} />
            </div>
            <span style={{ fontSize: '0.86rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
              {isAr ? 'الأدوية الموثقة' : 'Current Medications'}
            </span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600 }}>
            {patient.medications.length} {isAr ? 'أدوية' : 'meds'}
          </span>
        </div>

        {patient.medications.map((m, i) => {
          const isConflict = m.mentionStatus === 'conflict' || m.conflictFlag;
          return (
            <div
              key={m.id}
              style={{
                padding: '0.5rem 0',
                borderTop: i ? '1px solid var(--line-subtle)' : 'none',
                background: isConflict ? '#FFFBEB' : 'transparent',
                borderRadius: isConflict ? '6px' : '0',
                margin: isConflict ? '0.2rem -0.3rem' : '0',
                paddingInline: isConflict ? '0.3rem' : '0'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: '0.8rem', color: 'var(--ink)' }}>{m.name}</strong>
                <span style={{ fontSize: '0.74rem', color: 'var(--ink-soft)', fontWeight: 600 }}>{m.dose}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.2rem', fontSize: '0.68rem' }}>
                <span style={{ color: 'var(--ink-muted)' }}>{m.sector || (isAr ? 'وزارة الصحة' : 'MOH')}</span>
                <span style={{
                  color: isConflict ? '#DC2626' : '#059669',
                  fontWeight: 700,
                  background: isConflict ? '#FEE2E2' : '#ECFDF5',
                  padding: '0.12rem 0.45rem',
                  borderRadius: 4
                }}>
                  {isConflict ? (isAr ? '⚠ تعارض محتمل' : '⚠ Conflict') : (isAr ? '✓ فعّال' : '✓ Active')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Patient History Card */}
      <div className="card-box" style={{ padding: '0.85rem 1rem', background: '#FFFFFF', borderRadius: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <div style={{
              width: 28, height: 28, minWidth: 28, flexShrink: 0, borderRadius: '7px',
              background: '#EEF2FF', color: '#4F46E5',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <History size={15} />
            </div>
            <span style={{ fontSize: '0.86rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
              {isAr ? 'التاريخ الطبي والعمليات' : 'Medical History'}
            </span>
          </div>
        </div>

        {/* Chronic Conditions */}
        <div style={{ marginBottom: '0.55rem' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ink-soft)', marginBottom: '0.25rem' }}>
            {isAr ? 'الأمراض المزمنة:' : 'Chronic Conditions:'}
          </div>
          {patient.chronicConditions && patient.chronicConditions.length > 0 ? (
            patient.chronicConditions.map((c, i) => (
              <div key={i} style={{ fontSize: '0.76rem', color: 'var(--ink)', paddingInlineStart: '0.4rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />
                <span>{isAr ? c.nameAr : c.name}</span>
              </div>
            ))
          ) : (
            <div style={{ fontSize: '0.72rem', color: 'var(--ink-muted)' }}>{isAr ? 'لا يوجد' : 'None'}</div>
          )}
        </div>

        {/* Past Procedures */}
        <div style={{ marginBottom: '0.55rem' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ink-soft)', marginBottom: '0.25rem' }}>
            {isAr ? 'العمليات السابقة:' : 'Past Procedures:'}
          </div>
          {patient.pastProcedures && patient.pastProcedures.length > 0 ? (
            patient.pastProcedures.map((p) => (
              <div key={p.id} style={{ fontSize: '0.76rem', color: 'var(--ink)', paddingInlineStart: '0.4rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#D97706', flexShrink: 0 }} />
                <span>{isAr ? p.procedureNameAr : p.procedureName} ({p.date.slice(0, 4)})</span>
              </div>
            ))
          ) : (
            <div style={{ fontSize: '0.72rem', color: 'var(--ink-muted)' }}>{isAr ? 'لا يوجد' : 'None'}</div>
          )}
        </div>
      </div>
        </div>
      )}

      {/* 5. Clinical Notes Card (Interactive) */}
      <div className="card-box" style={{ padding: '0.85rem 1rem', background: '#FFFFFF', borderRadius: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <div style={{
              width: 28, height: 28, minWidth: 28, flexShrink: 0, borderRadius: '7px',
              background: 'rgba(79, 70, 229, 0.12)', color: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <FileText size={15} />
            </div>
            <span style={{ fontSize: '0.86rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
              {isAr ? 'الملاحظات السريرية' : 'Clinical Notes'}
            </span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--ink-muted)' }}>{notes.length}</span>
        </div>

        <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.6rem' }}>
          <input
            type="text"
            placeholder={isAr ? 'أضف ملاحظة سريعة...' : 'Add quick note...'}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
            style={{
              flex: 1,
              padding: '0.4rem 0.65rem',
              borderRadius: '7px',
              border: '1px solid var(--line)',
              fontSize: '0.76rem',
              outline: 'none',
              background: 'var(--bg)'
            }}
          />
          <button
            onClick={handleAddNote}
            style={{
              background: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '7px',
              padding: '0.4rem 0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Plus size={15} style={{ flexShrink: 0 }} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {notes.map((note, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--line-subtle)',
                borderRadius: '7px',
                padding: '0.5rem 0.7rem',
                fontSize: '0.74rem',
                color: 'var(--ink)',
                lineHeight: 1.55
              }}
            >
              {note}
            </div>
          ))}
        </div>
      </div>

      {/* 6. Recent Activity */}
      <div className="card-box" style={{ padding: '0.85rem 1rem', background: '#FFFFFF', borderRadius: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <div style={{
              width: 28, height: 28, minWidth: 28, flexShrink: 0, borderRadius: '7px',
              background: 'rgba(16, 185, 129, 0.12)', color: '#10B981',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Activity size={15} />
            </div>
            <span style={{ fontSize: '0.86rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
              {isAr ? 'النشاط الأخير' : 'Recent Activity'}
            </span>
          </div>
        </div>

        {[
          { label: isAr ? 'تم بدء المعاينة السريرية' : 'Clinical visit started', time: '10:42 AM' },
          { label: isAr ? 'تحديث العلامات الحيوية' : 'Vitals recorded', time: '10:38 AM' },
          { label: isAr ? 'مطابقة السجل الوطني (نفيس)' : 'NPHIES record synced', time: '09:45 AM' },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.45rem 0',
              borderTop: i ? '1px solid var(--line-subtle)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
              <span style={{ fontSize: '0.76rem', color: 'var(--ink)' }}>{item.label}</span>
            </div>
            <span style={{ fontSize: '0.66rem', color: 'var(--ink-muted)' }}>{item.time}</span>
          </div>
        ))}
      </div>

      {/* 7. Healthcare Standards & Security */}
      <div style={{ textAlign: 'center', padding: '0.75rem 0', marginTop: '0.5rem' }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--ink-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>
          {isAr ? 'متوافق مع منصة نفيس (NPHIES) ومعايير الأمان الصحي' : 'Compliant with NPHIES & Saudi Health Data Security'}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: 'var(--ink-soft)' }}>
            <Shield size={14} color="#10B981" style={{ flexShrink: 0 }} />
            <span>{isAr ? 'آمن ومشفر' : 'Encrypted'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: 'var(--ink-soft)' }}>
            <Check size={14} color="var(--primary)" style={{ flexShrink: 0 }} />
            <span>{isAr ? 'موثق' : 'Verified'}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
