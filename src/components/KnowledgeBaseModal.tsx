import React from 'react';
import { X, ExternalLink, BookOpen, Scale } from 'lucide-react';
import { CLINOVA_KNOWLEDGE_BASE } from '../data/clinicalKnowledgeBase';

interface KnowledgeBaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
}

export const KnowledgeBaseModal: React.FC<KnowledgeBaseModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  if (!isOpen) return null;

  const isAr = lang === 'ar';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(33, 30, 39, 0.72)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--surface)',
          borderRadius: '20px',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(45, 34, 84, 0.25)',
          border: '1.5px solid var(--line)',
          overflow: 'hidden',
          color: 'var(--text-main)'
        }}
        onClick={(e) => e.stopPropagation()}
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(168, 139, 196, 0.15)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <BookOpen size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                {isAr ? 'قاعدة المعرفة والمراجع السريرية والأخلاقية' : 'Clinical Knowledge Base & AI Governance References'}
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-sub)', margin: '0.2rem 0 0 0' }}>
                {isAr
                  ? 'المصادر والبروتوكولات الطبية الوطنية والعالمية المعتمدة لمحرك Clinova'
                  : 'Verified National & International Medical Sources Powering the Clinova Engine'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-sub)',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* WHO AI Ethics Highlight Banner */}
          <div
            style={{
              background: 'rgba(168, 139, 196, 0.08)',
              border: '1.5px solid rgba(168, 139, 196, 0.3)',
              borderRadius: '14px',
              padding: '1.1rem 1.25rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <Scale size={18} color="var(--primary)" />
              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                {isAr ? 'ميثاق حوكمة وأخلاقيات الذكاء الاصطناعي الصحي (WHO Guidance 2021)' : 'WHO Health AI Ethics & Governance Charter'}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)', lineHeight: 1.6, margin: 0 }}>
              {isAr
                ? 'تلتزم Clinova بالمبادئ الأخلاقية الستة الصادرة عن منظمة الصحة العالمية لضمان سلامة المرضى، وحماية استقلالية الطبيب (Protect Autonomy)، وتحقيق الضمانة السريرية البشرية (Human Warranty) ومنع التحيز الخوارزمي في جميع الاستنتاجات.'
                : 'Clinova strictly complies with the 6 core WHO ethical principles ensuring human autonomy, human-in-the-loop warranty, algorithmic explainability, and bias mitigation across all clinical predictions.'}
            </p>
          </div>

          {/* References Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1rem' }}>
            {CLINOVA_KNOWLEDGE_BASE.map((ref) => (
              <div
                key={ref.id}
                style={{
                  background: 'var(--bg)',
                  borderRadius: '12px',
                  border: '1px solid var(--line)',
                  padding: '1.1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        background: 'rgba(168, 139, 196, 0.15)',
                        color: 'var(--primary)'
                      }}
                    >
                      {ref.badge}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-sub)', fontFamily: 'monospace' }}>
                      [{ref.citationTag}]
                    </span>
                  </div>

                  <h3 style={{ fontSize: '0.9rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: 'var(--text-main)', lineHeight: 1.4 }}>
                    {isAr ? ref.titleAr : ref.titleEn}
                  </h3>

                  <div style={{ fontSize: '0.76rem', color: 'var(--primary-dark)', fontWeight: 600, marginBottom: '0.5rem' }}>
                    {isAr ? ref.organizationAr : ref.organizationEn}
                  </div>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-sub)', lineHeight: 1.5, margin: 0 }}>
                    {isAr ? ref.roleInClinovaAr : ref.roleInClinovaEn}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--line)', paddingTop: '0.6rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--primary)',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <span>{isAr ? 'فتح المرجع الرسمي' : 'Visit Official Resource'}</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1rem 1.75rem',
            borderTop: '1px solid var(--line)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--bg)'
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>
            {isAr
              ? 'جميع التوصيات السريرية تتطلب التحقق والاعتماد النهائي من الطبيب المعالج.'
              : 'All AI-generated clinical insights require final physician verification and sign-off.'}
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'var(--deep-plum)',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.55rem 1.3rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
