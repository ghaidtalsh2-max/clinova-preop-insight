import React, { useState, useRef, useEffect } from 'react';
import {
  Sun,
  Moon,
  Globe,
  FileDown,
  BookOpen,
  Settings
} from 'lucide-react';
import { getAssetPath } from '../utils/assetHelper';

interface DoctorAppHeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  fontScale: number;
  onChangeFontScale: (scale: number) => void;
  lang: 'ar' | 'en';
  onToggleLang: () => void;
  onOpenPreOpModal: () => void;
  onOpenKnowledgeBase?: () => void;
  onOpenApiKeys?: () => void;
  hasCriticalConflicts?: boolean;
  preOpReadiness?: 'ready' | 'needs_clearance' | 'high_risk';
}

export const DoctorAppHeader: React.FC<DoctorAppHeaderProps> = ({
  theme,
  onToggleTheme,
  fontScale,
  onChangeFontScale,
  lang,
  onToggleLang,
  onOpenPreOpModal,
  onOpenKnowledgeBase,
  onOpenApiKeys: _onOpenApiKeys,
  hasCriticalConflicts: _hasCriticalConflicts,
  preOpReadiness = 'needs_clearance'
}) => {
  const isAr = lang === 'ar';
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    if (isSettingsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSettingsOpen]);

  return (
    <header
      style={{
        height: 'var(--header-height)',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--line)',
        padding: '0 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-subtle)'
      }}
    >
      {/* Brand & Platform Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.15rem' }}>
        <div
          style={{
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent'
          }}
        >
          <img
            src={getAssetPath('/assets/clinova_logo_transparent.png')}
            alt="Clinova — PreOp Insight"
            style={{
              height: '38px',
              width: 'auto',
              objectFit: 'contain',
              display: 'block'
            }}
          />
        </div>
      </div>



      {/* Right Tools & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Active Physician Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.25rem 0.6rem',
            background: 'var(--bg)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <div style={{ position: 'relative', width: '30px', height: '30px' }}>
            <img
              src={getAssetPath('/doctor.jpg')}
              alt="Dr."
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid var(--lavender)'
              }}
            />
            {/* 🟢 Online dot */}
            <span
              style={{
                position: 'absolute',
                bottom: '-1px',
                right: '-1px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--mint)',
                border: '1.5px solid var(--surface)',
                animation: 'pulse 2s infinite',
                boxShadow: '0 0 6px rgba(155, 205, 185, 0.6)'
              }}
              title="Online"
            />
          </div>
          <div>
            <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span>{isAr ? 'د. سارة محمد' : 'Dr. Sarah Mohammed'}</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--mint)', fontWeight: 500, animation: 'pulse 2s infinite', display: 'inline-block' }}>● Online</span>
            </div>
            <div style={{ fontSize: '0.64rem', color: 'var(--ink-soft)' }}>
              {isAr ? 'استشاري' : 'Consultant'}
            </div>
          </div>
        </div>

        {/* Knowledge Base & Medical Sources Trigger */}
        {onOpenKnowledgeBase && (
          <button
            onClick={onOpenKnowledgeBase}
            style={{
              background: 'rgba(168, 139, 196, 0.12)',
              color: 'var(--deep-plum)',
              border: '1px solid var(--lavender-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.4rem 0.75rem',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontFamily: 'var(--font-heading)',
              transition: 'all 160ms ease'
            }}
            title={isAr ? 'عرض المراجع السريرية وميثاق الذكاء الاصطناعي' : 'View Clinical Knowledge Base & AI Ethics'}
          >
            <BookOpen size={16} strokeWidth={2} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <span>{isAr ? 'قاعدة المعرفة' : 'Knowledge Base'}</span>
          </button>
        )}

        {/* Feature 3: Pre-Op Readiness Gauge (مؤشر جاهزية ما قبل العملية) */}
        {(() => {
          const cfg = {
            ready: {
              color: 'var(--mint)',
              bg: 'var(--mint-soft)',
              border: 'var(--mint-border)',
              dotColor: 'var(--mint)',
              labelAr: 'جاهز للجراحة',
              labelEn: 'Ready'
            },
            needs_clearance: {
              color: 'var(--gold)',
              bg: 'var(--gold-soft)',
              border: 'var(--gold-border)',
              dotColor: 'var(--gold)',
              labelAr: 'يحتاج فحص إضافي',
              labelEn: 'Needs Clearance'
            },
            high_risk: {
              color: 'var(--crit)',
              bg: 'var(--crit-soft)',
              border: 'var(--crit-border)',
              dotColor: 'var(--crit)',
              labelAr: 'خطر مرتفع',
              labelEn: 'High Risk'
            }
          }[preOpReadiness];

          return (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.35rem 0.75rem',
                background: cfg.bg,
                border: `1.5px solid ${cfg.border}`,
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.76rem',
                fontWeight: 700,
                color: cfg.color,
                fontFamily: 'var(--font-heading)',
                boxShadow: 'var(--shadow-subtle)',
                transition: 'all 200ms ease'
              }}
              title={isAr ? 'مؤشر الجاهزية السريرية للعملية الجراحية' : 'Pre-Op Readiness Status'}
            >
              <span
                style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  background: cfg.dotColor,
                  display: 'inline-block',
                  boxShadow: `0 0 8px ${cfg.dotColor}`,
                  animation: preOpReadiness === 'high_risk' ? 'pulse 1.2s infinite' : 'none'
                }}
              />
              <span>{isAr ? cfg.labelAr : cfg.labelEn}</span>
            </div>
          );
        })()}

        {/* Pre-Op Clearance Summary Modal Trigger */}
        <button
          onClick={onOpenPreOpModal}
          style={{
            background: 'var(--primary-dark)',
            color: '#FAF8F5',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '0.45rem 0.95rem',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontFamily: 'var(--font-heading)',
            boxShadow: '0 2px 8px rgba(53, 42, 70, 0.12)',
            transition: 'all 160ms ease'
          }}
        >
          <FileDown size={16} strokeWidth={2} style={{ color: 'var(--lavender)', flexShrink: 0 }} />
          <span>{isAr ? 'تقرير التقييم السريري' : 'Clinical Report'}</span>
        </button>

        {/* Unified Settings Button & Preferences Popover (Language, Mode, Font Scale) */}
        <div ref={settingsRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setIsSettingsOpen((prev) => !prev)}
            style={{
              background: isSettingsOpen ? 'rgba(79, 70, 229, 0.12)' : 'var(--bg)',
              border: `1px solid ${isSettingsOpen ? 'var(--primary)' : 'var(--line)'}`,
              color: isSettingsOpen ? 'var(--primary)' : 'var(--ink-soft)',
              borderRadius: 'var(--radius-sm)',
              width: '34px',
              height: '34px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 160ms ease'
            }}
            title={isAr ? 'الإعدادات والمظهر' : 'Settings & Preferences'}
          >
            <Settings
              size={17}
              strokeWidth={2}
              style={{
                transform: isSettingsOpen ? 'rotate(45deg)' : 'none',
                transition: 'transform 200ms ease'
              }}
            />
          </button>

          {isSettingsOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                [isAr ? 'left' : 'right']: 0,
                width: '260px',
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '12px',
                padding: '0.9rem 1rem',
                boxShadow: '0 10px 28px rgba(0,0,0,0.14)',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                animation: 'popIn 160ms cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* Dropdown Header */}
              <div
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--ink)',
                  fontFamily: 'var(--font-heading)',
                  paddingBottom: '0.5rem',
                  borderBottom: '1px solid var(--line-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Settings size={14} style={{ color: 'var(--primary)' }} />
                <span>{isAr ? 'الإعدادات والمظهر' : 'Settings & Preferences'}</span>
              </div>

              {/* 1. Language Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: 'var(--ink)', fontWeight: 600 }}>
                  <Globe size={15} style={{ color: 'var(--primary)' }} />
                  <span>{isAr ? 'اللغة' : 'Language'}</span>
                </div>
                <button
                  onClick={onToggleLang}
                  style={{
                    background: 'var(--bg)',
                    border: '1px solid var(--line)',
                    color: 'var(--ink)',
                    borderRadius: '6px',
                    padding: '0.28rem 0.75rem',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    transition: 'all 120ms'
                  }}
                >
                  <span>{isAr ? 'English (EN)' : 'العربية (AR)'}</span>
                </button>
              </div>

              {/* 2. Theme Mode Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: 'var(--ink)', fontWeight: 600 }}>
                  {theme === 'dark' ? <Sun size={15} style={{ color: 'var(--amber)' }} /> : <Moon size={15} style={{ color: 'var(--violet)' }} />}
                  <span>{isAr ? 'المظهر' : 'Mode'}</span>
                </div>
                <button
                  onClick={onToggleTheme}
                  style={{
                    background: 'var(--bg)',
                    border: '1px solid var(--line)',
                    color: 'var(--ink)',
                    borderRadius: '6px',
                    padding: '0.28rem 0.75rem',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 120ms'
                  }}
                >
                  {theme === 'dark' ? <Sun size={13} style={{ color: 'var(--amber)' }} /> : <Moon size={13} style={{ color: 'var(--violet)' }} />}
                  <span>{theme === 'dark' ? (isAr ? 'الوضع النهاري' : 'Light') : (isAr ? 'الوضع الليلي' : 'Dark')}</span>
                </button>
              </div>

              {/* 3. Font Scale Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--ink)', fontWeight: 600 }}>
                  {isAr ? 'حجم الخط' : 'Font Size'}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'var(--bg)',
                    border: '1px solid var(--line)',
                    borderRadius: '6px',
                    padding: '2px'
                  }}
                >
                  {[
                    { label: 'A', scale: 1 },
                    { label: 'A+', scale: 1.1 },
                    { label: 'A++', scale: 1.2 }
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => onChangeFontScale(item.scale)}
                      style={{
                        background: fontScale === item.scale ? 'var(--violet)' : 'transparent',
                        color: fontScale === item.scale ? '#FFFFFF' : 'var(--ink-soft)',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.18rem 0.5rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 120ms'
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
