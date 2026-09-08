import React, { useState, useEffect } from 'react';
import { X, Key, Check, AlertCircle, Sparkles, Mic } from 'lucide-react';

interface ApiKeysModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
}

export const ApiKeysModal: React.FC<ApiKeysModalProps> = ({ isOpen, onClose, lang }) => {
  const isAr = lang === 'ar';

  const [openRouterKey, setOpenRouterKey] = useState('');
  const [speechmaticsKey, setSpeechmaticsKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const storedOR = localStorage.getItem('VITE_OPENROUTER_API_KEY') || (import.meta as any).env?.VITE_OPENROUTER_API_KEY || '';
      const storedSM = localStorage.getItem('VITE_SPEECHMATICS_API_KEY') || (import.meta as any).env?.VITE_SPEECHMATICS_API_KEY || '';
      setOpenRouterKey(storedOR);
      setSpeechmaticsKey(storedSM);
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (openRouterKey.trim()) {
      localStorage.setItem('VITE_OPENROUTER_API_KEY', openRouterKey.trim());
    } else {
      localStorage.removeItem('VITE_OPENROUTER_API_KEY');
    }

    if (speechmaticsKey.trim()) {
      localStorage.setItem('VITE_SPEECHMATICS_API_KEY', speechmaticsKey.trim());
    } else {
      localStorage.removeItem('VITE_SPEECHMATICS_API_KEY');
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

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
          background: 'var(--surface, #FFFFFF)',
          borderRadius: '20px',
          maxWidth: '560px',
          width: '100%',
          boxShadow: '0 25px 60px rgba(45, 34, 84, 0.25)',
          border: '1.5px solid var(--line, rgba(0,0,0,0.08))',
          overflow: 'hidden',
          color: 'var(--text-main, #1F2937)',
          direction: isAr ? 'rtl' : 'ltr'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--line, rgba(0,0,0,0.08))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, rgba(168, 139, 196, 0.12) 0%, rgba(155, 205, 185, 0.1) 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'var(--primary-dark, #352A46)',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Key size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink, #1F2937)' }}>
                {isAr ? 'إعدادات مفاتيح الربط (API Keys)' : 'API Integration Settings'}
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: 'var(--ink-soft, #6B7280)' }}>
                {isAr ? 'لتفعيل الاستدلال السريري عبر OpenRouter والتعرف الصوتي المباشر عبر Speechmatics' : 'Connect OpenRouter AI reasoning and Speechmatics real-time transcription'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--ink-soft, #6B7280)',
              padding: '0.4rem',
              borderRadius: '8px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* OpenRouter Field */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink, #1F2937)', marginBottom: '0.4rem' }}>
              <Sparkles size={16} style={{ color: '#8B5CF6' }} />
              <span>{isAr ? 'مفتاح OpenRouter API' : 'OpenRouter API Key'}</span>
            </label>
            <input
              type="password"
              value={openRouterKey}
              onChange={(e) => setOpenRouterKey(e.target.value)}
              placeholder="sk-or-v1-..."
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                border: '1.5px solid var(--line, #E5E7EB)',
                background: 'var(--bg, #F9FAFB)',
                fontSize: '0.85rem',
                fontFamily: 'monospace',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--ink-soft, #6B7280)', marginTop: '0.25rem', display: 'block' }}>
              {isAr ? 'يُستخدم لتحليل المحادثة الطبية واقتراح التشخيصات التفريقية والأسئلة المميزة' : 'Used for clinical differential reasoning and discriminating questions'}
            </span>
          </div>

          {/* Speechmatics Field */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink, #1F2937)', marginBottom: '0.4rem' }}>
              <Mic size={16} style={{ color: '#10B981' }} />
              <span>{isAr ? 'مفتاح Speechmatics API' : 'Speechmatics API Key'}</span>
            </label>
            <input
              type="password"
              value={speechmaticsKey}
              onChange={(e) => setSpeechmaticsKey(e.target.value)}
              placeholder="Speechmatics API Key..."
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                border: '1.5px solid var(--line, #E5E7EB)',
                background: 'var(--bg, #F9FAFB)',
                fontSize: '0.85rem',
                fontFamily: 'monospace',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--ink-soft, #6B7280)', marginTop: '0.25rem', display: 'block' }}>
              {isAr ? 'يُستخدم لتحويل كلام الطبيب والمريض إلى نص مباشر في الوقت الفعلي' : 'Used for real-time bilingual medical speech-to-text'}
            </span>
          </div>

          <div
            style={{
              padding: '0.75rem',
              borderRadius: '10px',
              background: 'rgba(59, 130, 246, 0.08)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              fontSize: '0.74rem',
              color: '#1D4ED8'
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              {isAr
                ? 'يتم حفظ المفاتيح محلياً في متصفحك بشكل آمن (أو يمكنك تعيينها في إعدادات Vercel Environment Variables). في حال عدم إدخال المفاتيح، يعمل النظام بمحرك استدلال سريري محاكي ذكي.'
                : 'Keys are saved locally in your browser (or set via Vercel Environment Variables). If omitted, Clinova operates in high-fidelity simulated clinical mode.'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--line, rgba(0,0,0,0.08))',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            background: 'var(--bg, #F9FAFB)'
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--line, #D1D5DB)',
              background: 'var(--surface, #FFF)',
              color: 'var(--ink, #374151)',
              fontSize: '0.82rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              background: savedSuccess ? '#10B981' : 'var(--primary-dark, #352A46)',
              color: '#FFF',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease'
            }}
          >
            {savedSuccess ? <Check size={16} /> : <Key size={16} />}
            <span>{savedSuccess ? (isAr ? 'تم الحفظ!' : 'Saved!') : (isAr ? 'حفظ المفاتيح' : 'Save Keys')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
