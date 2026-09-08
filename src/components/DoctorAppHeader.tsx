import React from 'react';
import {
  Sun,
  Moon,
  Globe,
  FileDown,
  BookOpen,
  Key
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
  onOpenApiKeys,
  hasCriticalConflicts: _hasCriticalConflicts
}) => {
  const isAr = lang === 'ar';

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

        {/* NPHIES Compliance Status */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.2rem 0.6rem',
            background: 'rgba(155, 205, 185, 0.15)',
            border: '1px solid rgba(155, 205, 185, 0.4)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.68rem',
            fontWeight: 600,
            color: 'var(--mint-dark)'
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--mint)' }} />
          <span>{isAr ? 'متوافق مع معايير نَفيس (NPHIES)' : 'NPHIES / FHIR R4 Ready'}</span>
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

        {/* API Keys Configuration Trigger */}
        {onOpenApiKeys && (
          <button
            onClick={onOpenApiKeys}
            style={{
              background: 'rgba(155, 205, 185, 0.15)',
              color: 'var(--mint-dark, #065F46)',
              border: '1px solid rgba(155, 205, 185, 0.4)',
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
            title={isAr ? 'إدخال مفاتيح الـ API (OpenRouter & Speechmatics)' : 'Configure API Keys'}
          >
            <Key size={16} strokeWidth={2} style={{ color: '#059669', flexShrink: 0 }} />
            <span>{isAr ? 'مفاتيح الـ API' : 'API Keys'}</span>
          </button>
        )}

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

        {/* Font Scaling Controls (A, A+, A++) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-sm)',
            padding: '2px'
          }}
          title={isAr ? 'التحكم بحجم الخط' : 'Adjust Font Scale'}
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
                borderRadius: 'var(--radius-xs)',
                padding: '0.2rem 0.45rem',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 120ms'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Dark / Light Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="btn-icon"
          title={theme === 'dark' ? (isAr ? 'تفعيل الوضع النهاري' : 'Light Mode') : (isAr ? 'تفعيل الوضع الليلي الهادئ' : 'Dark Mode')}
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--line)',
            color: 'var(--ink-soft)',
            borderRadius: 'var(--radius-sm)',
            width: '32px',
            height: '32px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          {theme === 'dark' ? <Sun size={16} strokeWidth={2} style={{ color: 'var(--amber)', flexShrink: 0 }} /> : <Moon size={16} strokeWidth={2} style={{ color: 'var(--violet)', flexShrink: 0 }} />}
        </button>

        {/* Language Toggle (عربي / EN) */}
        <button
          onClick={onToggleLang}
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--line)',
            color: 'var(--ink-soft)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.35rem 0.65rem',
            fontSize: '0.74rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            flexShrink: 0
          }}
        >
          <Globe size={15} strokeWidth={2} style={{ flexShrink: 0 }} />
          <span>{isAr ? 'EN' : 'عربي'}</span>
        </button>
      </div>
    </header>
  );
};
