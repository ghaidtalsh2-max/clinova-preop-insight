import React from 'react';
import type { Patient } from '../types/clinical';
import { Stethoscope, Globe, Moon, Sun, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  currentPatient: Patient;
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
  lang: 'ar' | 'en';
  onToggleLang: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  fontScale: number;
  onChangeFontScale: (scale: number) => void;
  onOpenPreOpModal: () => void;
  hasConflicts: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentPatient,
  patients,
  onSelectPatient,
  lang,
  onToggleLang,
  theme,
  onToggleTheme,
  fontScale,
  onChangeFontScale,
  onOpenPreOpModal,
  hasConflicts
}) => {
  const isAr = lang === 'ar';

  return (
    <header style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
      {/* Top Clinical & Accessibility Toolbar */}
      <div
        style={{
          borderBottom: '1px solid var(--border-hairline)',
          padding: '0.45rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          background: 'var(--bg-surface-soft)',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: 'var(--teal-800)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
            {isAr ? 'منصة الذكاء السريري عبر القطاعات الصحية' : 'Cross-Sector Clinical Intelligence Platform'}
          </span>
          <span style={{ color: 'var(--border-medium)' }}>|</span>
          <span>{isAr ? 'التقييم السريري قبل العمليات (MOH / CBAHI / JCI)' : 'Pre-Operative Assessment Framework'}</span>
        </div>

        {/* Accessibility Tools: Font Zoom, Dark/Light, Language Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Text Zoom Controls (A- / A / A+) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '1px 3px'
            }}
          >
            <button
              onClick={() => onChangeFontScale(1)}
              style={{
                background: fontScale === 1 ? 'var(--teal-800)' : 'transparent',
                color: fontScale === 1 ? '#FFF' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '3px',
                padding: '0.15rem 0.45rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              title={isAr ? 'حجم خط طبيعي (100%)' : 'Normal Text (100%)'}
            >
              A
            </button>
            <button
              onClick={() => onChangeFontScale(1.12)}
              style={{
                background: fontScale === 1.12 ? 'var(--teal-800)' : 'transparent',
                color: fontScale === 1.12 ? '#FFF' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '3px',
                padding: '0.15rem 0.45rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              title={isAr ? 'حجم خط متوسط (112%)' : 'Medium Text (112%)'}
            >
              A+
            </button>
            <button
              onClick={() => onChangeFontScale(1.25)}
              style={{
                background: fontScale === 1.25 ? 'var(--teal-800)' : 'transparent',
                color: fontScale === 1.25 ? '#FFF' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '3px',
                padding: '0.15rem 0.45rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              title={isAr ? 'حجم خط كبير (125%)' : 'Large Text (125%)'}
            >
              A++
            </button>
          </div>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleTheme}
            className="btn-secondary"
            style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', gap: '0.35rem' }}
            title={isAr ? 'تبديل المظهر النهاري / الليلي' : 'Toggle Light / Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={13} style={{ color: '#FBBF24' }} /> : <Moon size={13} />}
            <span>{theme === 'dark' ? (isAr ? 'نهاري' : 'Light') : (isAr ? 'ليلي' : 'Dark')}</span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="btn-secondary"
            style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', gap: '0.35rem' }}
            title={isAr ? 'English Interface' : 'الواجهة العربية'}
          >
            <Globe size={13} />
            <span>{isAr ? 'English' : 'العربية'}</span>
          </button>
        </div>
      </div>

      {/* Main Bar: Brand Logo & Patient Switcher */}
      <div
        style={{
          padding: '0.9rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        {/* Brand Logo with Clinova Image */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.95rem' }}>
          <div
            style={{
              height: '46px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '10px',
              overflow: 'hidden',
              background: '#FFFFFF',
              border: '1px solid var(--line)',
              padding: '2px 6px',
              boxShadow: '0 2px 8px rgba(45, 34, 84, 0.05)'
            }}
          >
            <img
              src="/assets/clinova_logo.jpg"
              alt="Clinova Logo"
              style={{
                height: '42px',
                width: 'auto',
                objectFit: 'contain'
              }}
              onError={(e) => {
                // Fallback if image path varies
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <h1
                style={{
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  color: '#2D2254',
                  letterSpacing: '-0.02em',
                  margin: 0,
                  fontFamily: 'var(--font-heading)'
                }}
              >
                Clinova
              </h1>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '0.12rem 0.55rem',
                  borderRadius: 'var(--radius-full)',
                  background: '#E0F7F6',
                  color: '#0D8275',
                  border: '1px solid #BCEAE6'
                }}
              >
                PreOp Insight
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  padding: '0.12rem 0.55rem',
                  borderRadius: 'var(--radius-full)',
                  background: '#EDE9FE',
                  color: '#6D28D9',
                  border: '1px solid #DDD6FE'
                }}
              >
                {isAr ? 'المساعد السريري الذكي' : 'AI Clinical Reasoning'}
              </span>
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--ink-soft)', margin: '0.15rem 0 0 0' }}>
              {isAr ? 'منظومة التقييم السريري الذكي الموحد عبر القطاعات الصحية' : 'Cross-Sector Unified Clinical Intelligence Platform'}
            </p>
          </div>
        </div>

        {/* Doctor & Accreditation & Patient Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          {/* NPHIES Compliance Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: '#FAF8F5',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.35rem 0.65rem',
              fontSize: '0.72rem',
              color: 'var(--ink-soft)'
            }}
          >
            <span style={{ color: '#059669', fontWeight: 'bold' }}>⚡</span>
            <span>{isAr ? 'معيار نفيس الوطني (NPHIES/FHIR)' : 'NPHIES / FHIR Certified'}</span>
          </div>

          {/* Doctor Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#FFFFFF',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.3rem 0.65rem'
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: '#2D2254',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 600
              }}
            >
              د.ف
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#2D2254', lineHeight: 1.2 }}>
                {isAr ? 'د. فيصل العتيبي' : 'Dr. Faisal Al-Otaibi'}
              </div>
              <div style={{ fontSize: '0.66rem', color: 'var(--ink-soft)' }}>
                {isAr ? 'استشاري التخدير والطب السريري' : 'Consultant Anesthesiologist'}
              </div>
            </div>
          </div>

          {/* Patient Switcher */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
            <select
              value={currentPatient.id}
              onChange={(e) => onSelectPatient(e.target.value)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--line)',
                background: '#FFFFFF',
                color: '#2D2254',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                outline: 'none',
                minWidth: '240px'
              }}
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {isAr ? p.nameAr : p.name} ({p.age} {isAr ? 'سنة' : 'yo'}) — {isAr ? (p.visitReasonAr || p.scheduledProcedureAr) : (p.visitReason || p.scheduledProcedure)}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onOpenPreOpModal}
            className="btn-primary"
            style={{
              padding: '0.45rem 0.95rem',
              fontSize: '0.82rem',
              borderRadius: 'var(--radius-sm)',
              background: '#2D2254',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(45, 34, 84, 0.18)'
            }}
          >
            <Stethoscope size={15} />
            <span>{isAr ? 'تقرير التقييم السريري' : 'Clinical Summary'}</span>
            {currentPatient.preOpSummary.verifiedByClinician ? (
              <CheckCircle2 size={14} style={{ color: '#86EFAC' }} />
            ) : hasConflicts ? (
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#F87171' }} />
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
};
