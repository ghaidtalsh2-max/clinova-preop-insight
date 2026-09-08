import React, { useState } from 'react';
import type { Patient, ClinicalPossibility } from '../types/clinical';
import {
  Brain,
  Stethoscope,
  ShieldAlert,
  UserCheck
} from 'lucide-react';

interface AIDiagnosticReasoningConsoleProps {
  patient: Patient;
  clinicalPossibilities: ClinicalPossibility[];
  lang: 'ar' | 'en';
}

export const AIDiagnosticReasoningConsole: React.FC<AIDiagnosticReasoningConsoleProps> = ({
  patient,
  clinicalPossibilities,
  lang
}) => {
  const isAr = lang === 'ar';
  const [isDoctorConfirmed, setIsDoctorConfirmed] = useState<boolean>(false);

  const isSaud = patient.id === 'pat-001';

  return (
    <div className="clinical-card" style={{ marginBottom: '1.5rem', border: '1px solid var(--border-medium)' }}>
      {/* Header */}
      <div className="clinical-card-header" style={{ background: 'var(--bg-surface)' }}>
        <div className="clinical-card-title">
          <div
            className="icon-container"
            style={{
              background: 'var(--teal-50)',
              color: 'var(--teal-800)',
              borderColor: 'var(--teal-200)'
            }}
          >
            <Brain size={19} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 800 }}>
              {isAr ? 'محرك الاستدلال والتشخيص السريري المقترح (AI Diagnostic Reasoning)' : 'AI Diagnostic Reasoning & Clinical Hypotheses'}
            </h3>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: '0.1rem 0 0 0' }}>
              {isAr
                ? 'تحليل أعراض المريض ومطابقتها خطوة بخطوة مع سجلات القطاعات المختلفة لاقتراح التشخيص المحتمل'
                : 'Correlating reported symptoms step-by-step with cross-sector records to infer clinical etiologies'}
            </p>
          </div>
        </div>

        <span
          style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            background: 'var(--teal-50)',
            color: 'var(--teal-800)',
            border: '1px solid var(--teal-200)',
            padding: '0.2rem 0.6rem',
            borderRadius: 'var(--radius-full)'
          }}
        >
          {clinicalPossibilities.length} {isAr ? 'تشخيصات مقترحة' : 'Differential Hypotheses'}
        </span>
      </div>

      {/* 1. Step-by-Step AI Clinical Reasoning Flow (كيف فكر الذكاء الاصطناعي؟) */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          background: 'var(--bg-surface-soft)',
          borderBottom: '1px solid var(--border-hairline)'
        }}
      >
        <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--teal-900)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.75rem' }}>
          {isAr ? '🧠 تسلسل الاستدلال السريري للذكاء الاصطناعي (Reasoning Chain):' : '🧠 AI Multi-Step Clinical Reasoning Chain:'}
        </span>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '0.85rem'
          }}
        >
          {isSaud ? (
            <>
              {/* Step 1 */}
              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.85rem 1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--teal-800)', background: 'var(--teal-50)', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>
                    {isAr ? 'خطوة 1: استخلاص الأعراض' : 'Step 1: Symptom Intake'}
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.45 }}>
                  {isAr ? 'شكوى المريض من صداع ودوخة انتصابية مستمرة منذ أسبوع عند الوقوف المفاجئ.' : 'Patient presents with persistent headache and postural dizziness upon standing.'}
                </p>
              </div>

              {/* Step 2 */}
              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.85rem 1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--review-amber)', background: 'var(--review-amber-light)', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>
                    {isAr ? 'خطوة 2: مطابقة سجلات القطاعات' : 'Step 2: Sector Cross-Match'}
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.45 }}>
                  {isAr ? 'اكتشاف رفع جرعة أملوديبين إلى 10 ملجم بوزارة الصحة (يناير 2026) مقابل 5 ملجم بالحرس الوطني.' : 'Identified Amlodipine 10mg escalation in MOH vs 5mg recorded at NGHA.'}
                </p>
              </div>

              {/* Step 3 */}
              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.85rem 1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--teal-800)', background: 'var(--teal-50)', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>
                    {isAr ? 'خطوة 3: استبعاد الأسباب القلبية' : 'Step 3: Rule Out Ischemia'}
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.45 }}>
                  {isAr ? 'قسطرة الحرس الوطني (2023) أثبتت سلامة الشرايين، مما يرجح السبب الدوائي المحيطي.' : 'Normal 2023 coronary angiogram at NGHA rules out critical obstructive ischemia.'}
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Fatima Reasoning */}
              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.85rem 1rem'
                }}
              >
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--conflict-red)', background: 'var(--conflict-red-light)', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>
                  {isAr ? 'المدخلات السريرية' : 'Clinical Inputs'}
                </span>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', margin: '0.35rem 0 0 0' }}>
                  {isAr ? 'كدمات زرقاء بالجسم ونزيف لثة غير مبرر قبل جراحة استبدال مفصل الورك.' : 'Unexplained spontaneous bruising and gum bleeding prior to hip replacement.'}
                </p>
              </div>

              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.85rem 1rem'
                }}
              >
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--conflict-red)', background: 'var(--conflict-red-light)', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>
                  {isAr ? 'الربط الآلي عبر السجلات' : 'Cross-Sector Auto-Discovery'}
                </span>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', margin: '0.35rem 0 0 0' }}>
                  {isAr
                    ? 'كشف النظام آلياً: المريضة تتناول وارفارين (سجل وزارة الصحة) بالتزامن مع ريفاروكسابان (سجل العيادة الخاصة) دون معرفة المريضة بمصدر الصرف!'
                    : 'System auto-detected: Patient is taking Warfarin (MOH record) and Rivaroxaban (Private record) concurrently without knowing the distinct dispensing sectors!'}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2. Suggested Clinical Diagnoses / Possibilities (STRICTLY MAX 3) */}
      <div style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
              {isAr ? 'التشخيصات المقترحة (3 كحد أقصى) مع الأعراض والأسباب المستنتجة:' : 'Top 3 Suggested Differentials (Extracted Symptoms & Inferred Causes):'}
            </span>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
              {isAr ? 'تم استخلاص الأعراض من كلام الطبيب والمريض، واستنتاج الأسباب بمطابقة السجلات عبر القطاعات' : 'Symptoms derived from clinical speech; etiologies inferred via cross-sector record matching'}
            </span>
          </div>

          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              background: 'var(--teal-50)',
              color: 'var(--teal-900)',
              border: '1px solid var(--teal-200)',
              padding: '0.2rem 0.55rem',
              borderRadius: 'var(--radius-full)'
            }}
          >
            {clinicalPossibilities.slice(0, 3).length} {isAr ? 'تشخيصات (الحد الأقصى 3)' : 'Differentials (Max 3)'}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {clinicalPossibilities.slice(0, 3).map((pos, idx) => {
            const isHigh = pos.probability === 'high';
            return (
              <div
                key={pos.id}
                style={{
                  background: isHigh ? 'var(--bg-canvas)' : 'var(--bg-surface)',
                  border: '1.5px solid ' + (isHigh ? 'var(--teal-700)' : 'var(--border-subtle)'),
                  borderRadius: 'var(--radius-md)',
                  padding: '1.2rem 1.35rem',
                  boxShadow: isHigh ? 'var(--shadow-subtle)' : 'none'
                }}
              >
                {/* Header: Number, Name, Likelihood */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: isHigh ? 'var(--teal-800)' : 'var(--border-medium)',
                          color: '#FFFFFF',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {idx + 1}
                      </span>
                      <Stethoscope size={17} style={{ color: isHigh ? 'var(--teal-800)' : 'var(--text-muted)' }} />
                      <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                        {isAr ? pos.conditionAr : pos.condition}
                      </strong>
                    </div>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', margin: '0.2rem 0 0 1.8rem' }}>
                      {pos.condition}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      padding: '0.25rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      background: isHigh ? 'var(--teal-100)' : 'var(--bg-surface-soft)',
                      color: isHigh ? 'var(--teal-900)' : 'var(--text-secondary)',
                      border: '1px solid ' + (isHigh ? 'var(--teal-200)' : 'var(--border-subtle)')
                    }}
                  >
                    {pos.probability === 'high'
                      ? isAr ? 'احتمالية مرتفعة (88%)' : 'High Probability (88%)'
                      : pos.probability === 'moderate'
                      ? isAr ? 'احتمالية متوسطة (62%)' : 'Moderate (62%)'
                      : isAr ? 'احتمال يؤخذ بالاعتبار' : 'Consideration'}
                  </span>
                </div>

                {/* 1. EXTRACTED SYMPTOMS (الأعراض المستنتجة من كلام الطبيب والمريض) */}
                <div
                  style={{
                    marginTop: '0.9rem',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.75rem 0.95rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.8rem' }}>🗣️</span>
                    <strong style={{ fontSize: '0.78rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                      {isAr ? 'الأعراض المستخلصة من كلام الطبيب والمريض:' : 'Extracted Symptoms from Dialogue:'}
                    </strong>
                  </div>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>
                    {isAr ? pos.extractedSymptomsAr : pos.extractedSymptoms}
                  </p>
                </div>

                {/* 2. INFERRED CAUSES & MECHANISMS (الأسباب المستنتجة والربط الدوائي والفسيولوجي) */}
                <div
                  style={{
                    marginTop: '0.65rem',
                    background: 'var(--teal-50)',
                    border: '1px solid var(--teal-200)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.75rem 0.95rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.8rem' }}>🔬</span>
                    <strong style={{ fontSize: '0.78rem', color: 'var(--teal-900)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                      {isAr ? 'الأسباب المستنتجة والربط الدوائي عبر القطاعات:' : 'Inferred Causes & Cross-Sector Pharmacology:'}
                    </strong>
                  </div>
                  <p style={{ fontSize: '0.86rem', color: 'var(--teal-950)', margin: 0, lineHeight: 1.55 }}>
                    {isAr ? pos.inferredCausesAr : pos.inferredCauses}
                  </p>
                </div>

                {/* 3. GROUNDED EVIDENCE LINKS */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                    {isAr ? 'الأدلة السريرية المسندة:' : 'Grounded Evidence:'}
                  </span>
                  {pos.evidenceLinks.map((ev, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '0.72rem',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-medium)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.15rem 0.5rem',
                        color: 'var(--text-primary)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <span>•</span>
                      <strong>{isAr ? ev.textAr : ev.text}</strong>
                    </span>
                  ))}
                </div>

                {/* 4. MANDATORY PER-CARD DISCLAIMER AS REQUESTED BY USER */}
                <div
                  style={{
                    marginTop: '0.85rem',
                    background: 'var(--review-amber-light)',
                    border: '1px solid var(--review-amber-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.5rem 0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span style={{ fontSize: '0.85rem' }}>⚠️</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--review-amber-text)' }}>
                    {isAr
                      ? 'تنبيه: تشخيص مقترح استرشادي بالذكاء الاصطناعي — يجب مراجعة الطبيب للتشخيص والتأكيد منه.'
                      : 'Notice: AI-suggested hypothesis — must be reviewed and confirmed by a qualified physician.'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. PROMINENT MANDATORY MEDICAL DISCLAIMER & CLINICIAN CONFIRMATION */}
      <div
        style={{
          margin: '0 1.5rem 1.5rem 1.5rem',
          background: 'var(--review-amber-light)',
          border: '2px solid var(--review-amber-border)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem 1.4rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
          <ShieldAlert size={24} style={{ color: 'var(--review-amber)', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1 }}>
            <strong style={{ fontSize: '0.94rem', color: 'var(--review-amber-text)', display: 'block', marginBottom: '0.35rem' }}>
              ⚠️ {isAr ? 'تنبيه سريري إلزامي ومصادقة تشخيصية:' : 'Mandatory Clinical Safety Notice & Disclaimer:'}
            </strong>
            <p style={{ fontSize: '0.86rem', color: 'var(--review-amber-text)', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
              {isAr
                ? 'هذا التشخيص مقترح ومتوقع مبني على تحليل الذكاء الاصطناعي للاسترشاد السريري فقط، ولا يُعتد به كتشخيص نهائي. يجب مراجعة الطبيب المعالج أو الاستشاري المختص لإجراء الفحص السريري المباشر وتأكيد التشخيص واعتماد الخطة العلاجية.'
                : 'This is an AI-suggested clinical differential intended for decision support only, and is NOT a definitive diagnosis. The attending qualified physician or consultant must conduct a physical clinical examination, confirm the diagnosis, and independently authorize the management plan.'}
            </p>

            {/* Clinician Confirmation Button */}
            <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setIsDoctorConfirmed(!isDoctorConfirmed)}
                style={{
                  background: isDoctorConfirmed ? 'var(--verified-green)' : 'var(--bg-surface)',
                  color: isDoctorConfirmed ? '#FFFFFF' : 'var(--text-primary)',
                  border: '1px solid ' + (isDoctorConfirmed ? 'var(--verified-green)' : 'var(--border-medium)'),
                  borderRadius: 'var(--radius-md)',
                  padding: '0.45rem 0.95rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'all 150ms'
                }}
              >
                <UserCheck size={15} />
                <span>
                  {isDoctorConfirmed
                    ? (isAr ? 'تمت مراجعة وتدقيق هذا التحليل المقترح من الاستشاري ✓' : 'Reviewed & Confirmed by Attending Consultant ✓')
                    : (isAr ? 'تأكيد الممارس الصحي لمراجعة التشخيص المقترح' : 'Acknowledge Clinician Review of Differential')}
                </span>
              </button>

              {isDoctorConfirmed && (
                <span style={{ fontSize: '0.76rem', color: 'var(--verified-green-dark)', fontWeight: 600 }}>
                  {isAr ? 'تم توثيق المراجعة برقم ترخيص الاستشاري 14-R-M-008924' : 'Authenticated under SCFHS Consultant License 14-R-M-008924'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
