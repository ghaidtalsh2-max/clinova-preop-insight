import React, { useState } from 'react';
import type { ConflictItem, MissingGap, DynamicQuestion, ClinicalPossibility } from '../types/clinical';
import {
  AlertTriangle,
  HelpCircle,
  MessageSquare,
  Stethoscope,
  CheckCircle2,
  Send,
  Info
} from 'lucide-react';

interface WhatNeedsAttentionProps {
  conflicts: ConflictItem[];
  missingGaps: MissingGap[];
  dynamicQuestions: DynamicQuestion[];
  clinicalPossibilities: ClinicalPossibility[];
  onAnswerQuestion: (questionId: string, answer: string) => void;
  lang: 'ar' | 'en';
}

export const WhatNeedsAttention: React.FC<WhatNeedsAttentionProps> = ({
  conflicts,
  missingGaps,
  dynamicQuestions,
  clinicalPossibilities,
  onAnswerQuestion,
  lang
}) => {
  const isAr = lang === 'ar';
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(dynamicQuestions[0]?.id || null);
  const [customAnswer, setCustomAnswer] = useState<string>('');

  const activeQuestion = dynamicQuestions.find((q) => q.id === activeQuestionId);

  const handleSelectSuggested = (qId: string, val: string) => {
    onAnswerQuestion(qId, val);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeQuestionId && customAnswer.trim()) {
      onAnswerQuestion(activeQuestionId, customAnswer.trim());
      setCustomAnswer('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
      {/* Section Header: What Needs Attention */}
      <div
        style={{
          borderBottom: '2px solid var(--teal-800)',
          paddingBottom: '0.65rem',
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '2px',
              background: 'var(--teal-800)',
              transform: 'rotate(45deg)'
            }}
          />
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: 0,
              letterSpacing: '-0.01em'
            }}
          >
            {isAr ? 'ما يتطلب انتباه الطبيب (What Needs Attention)' : 'What Needs Attention: Cross-Sector Analysis'}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.8rem' }}>
          <span style={{ color: 'var(--conflict-red)', fontWeight: 700 }}>
            {conflicts.filter((c) => c.status === 'open').length} {isAr ? 'تعارضات نشطة' : 'Active Conflicts'}
          </span>
          <span style={{ color: 'var(--border-medium)' }}>•</span>
          <span style={{ color: 'var(--review-amber)', fontWeight: 600 }}>
            {missingGaps.filter((g) => !g.resolved).length} {isAr ? 'ثغرات سريرية ناقصة' : 'Missing Gaps'}
          </span>
        </div>
      </div>

      {/* Grid: 2 Columns for Desktop */}
      <div className="grid-2col">
        {/* LEFT COLUMN: Conflicts & Missing Information */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* 1. Cross-Sector Conflicts (Red strictly for conflicts) */}
          <div className="clinical-card" style={{ borderLeft: isAr ? undefined : '4px solid var(--conflict-red)', borderRight: isAr ? '4px solid var(--conflict-red)' : undefined }}>
            <div className="clinical-card-header" style={{ background: '#FFFDFD' }}>
              <div className="clinical-card-title">
                <div className="icon-container" style={{ background: 'var(--conflict-red-light)', color: 'var(--conflict-red)', borderColor: 'var(--conflict-red-border)' }}>
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.98rem', margin: 0, fontWeight: 700, color: 'var(--conflict-red-dark)' }}>
                    {isAr ? '⚠️ التعارضات المكتشفة بين القطاعات (Conflicts)' : '⚠️ Cross-Sector Conflicts'}
                  </h3>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    {isAr ? 'تناقضات في الجرعات أو الوصفات بين ملفات المستشفيات' : 'Discrepancies identified across different sector health files'}
                  </span>
                </div>
              </div>

              <span className="badge-conflict">
                {conflicts.length} {isAr ? 'تعارض' : 'Conflict'}
              </span>
            </div>

            <div style={{ padding: '1rem 1.4rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {conflicts.map((conf) => {
                const isResolved = conf.status === 'resolved';
                return (
                  <div
                    key={conf.id}
                    style={{
                      background: isResolved ? 'var(--verified-green-light)' : 'var(--bg-canvas)',
                      border: '1px solid ' + (isResolved ? 'var(--verified-green-border)' : 'var(--conflict-red-border)'),
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      transition: 'all 200ms'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <strong style={{ fontSize: '0.9rem', color: isResolved ? 'var(--verified-green-dark)' : 'var(--conflict-red-dark)' }}>
                        {isAr ? conf.titleAr : conf.title}
                      </strong>
                      {isResolved ? (
                        <span className="badge-verified" style={{ fontSize: '0.7rem' }}>
                          <CheckCircle2 size={12} />
                          {isAr ? 'تمت المطابقة' : 'Reconciled'}
                        </span>
                      ) : (
                        <span className="badge-conflict" style={{ fontSize: '0.7rem' }}>
                          {isAr ? 'نشط وغير مطابق' : 'Unreconciled'}
                        </span>
                      )}
                    </div>

                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0.45rem 0', lineHeight: 1.5 }}>
                      {isAr ? conf.descriptionAr : conf.description}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', margin: '0.5rem 0' }}>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {isAr ? 'القطاعات المتأثرة:' : 'Involved Sectors:'}
                      </span>
                      {conf.affectedSectors.map((sec) => (
                        <span key={sec} className={`badge-sector ${sec.toLowerCase()}`} style={{ fontSize: '0.68rem' }}>
                          {sec}
                        </span>
                      ))}
                    </div>

                    <div
                      style={{
                        background: 'var(--bg-surface)',
                        border: '1px dashed var(--border-medium)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.78rem',
                        color: 'var(--text-primary)',
                        marginTop: '0.5rem'
                      }}
                    >
                      <strong style={{ color: 'var(--teal-800)' }}>
                        {isAr ? 'الإجراء السريري الموصى به: ' : 'Clinical Recommendation: '}
                      </strong>
                      {isAr ? conf.recommendedActionAr : conf.recommendedAction}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Missing Clinical Information (Amber) */}
          <div className="clinical-card" style={{ borderLeft: isAr ? undefined : '4px solid var(--review-amber)', borderRight: isAr ? '4px solid var(--review-amber)' : undefined }}>
            <div className="clinical-card-header" style={{ background: '#FFFDF8' }}>
              <div className="clinical-card-title">
                <div className="icon-container" style={{ background: 'var(--review-amber-light)', color: 'var(--review-amber)', borderColor: 'var(--review-amber-border)' }}>
                  <HelpCircle size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.98rem', margin: 0, fontWeight: 700, color: 'var(--review-amber-text)' }}>
                    {isAr ? '🔎 المعلومات السريرية الناقصة (Missing Information)' : '🔎 Missing Clinical Information'}
                  </h3>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    {isAr ? 'ثغرات حرجة يجب استيضاحها لتأمين سلامة المريض قبل الجراحة' : 'Critical blindspots requiring clarification for perioperative safety'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ padding: '1rem 1.4rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {missingGaps.map((gap) => (
                <div
                  key={gap.id}
                  style={{
                    background: gap.resolved ? 'var(--verified-green-light)' : 'var(--bg-canvas)',
                    border: '1px solid ' + (gap.resolved ? 'var(--verified-green-border)' : 'var(--border-subtle)'),
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.86rem', fontWeight: 600, color: gap.resolved ? 'var(--verified-green-dark)' : 'var(--text-primary)' }}>
                      {isAr ? gap.questionAr : gap.question}
                    </span>
                    {gap.resolved ? (
                      <span className="badge-verified" style={{ fontSize: '0.68rem', padding: '0.1rem 0.45rem' }}>
                        <CheckCircle2 size={11} />
                        {isAr ? 'تم الاستيضاح' : 'Clarified'}
                      </span>
                    ) : (
                      <span className="badge-review" style={{ fontSize: '0.68rem', padding: '0.1rem 0.45rem' }}>
                        {isAr ? 'مطلوب' : 'Pending'}
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.35rem 0 0 0' }}>
                    <strong>{isAr ? 'الأهمية الجراحية: ' : 'Surgical Relevance: '}</strong>
                    {isAr ? gap.clinicalReasonAr : gap.clinicalReason}
                  </p>

                  {gap.resolved && gap.answer && (
                    <div
                      style={{
                        marginTop: '0.5rem',
                        padding: '0.45rem 0.65rem',
                        background: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        color: 'var(--verified-green-dark)',
                        border: '1px solid var(--verified-green-border)'
                      }}
                    >
                      <strong>{isAr ? 'إجابة المريض الموثقة: ' : 'Verified Answer: '}</strong>
                      {gap.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Dynamic Smart Questions & Possible Conditions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* 3. Dynamic Follow-Up Questions (Interactive Dialogue Bridge) */}
          <div className="clinical-card" style={{ borderTop: '3px solid var(--teal-800)' }}>
            <div className="clinical-card-header">
              <div className="clinical-card-title">
                <div className="icon-container">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.98rem', margin: 0, fontWeight: 700 }}>
                    {isAr ? '💬 الأسئلة السريرية الذكية (Dynamic Questions)' : '💬 Dynamic Clinical Questions'}
                  </h3>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    {isAr ? 'أسئلة تتولد ديناميكياً بحسب تضارب البيانات وتاريخ المريض' : 'Generated in context of conflicting records & symptom presentation'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ padding: '1rem 1.4rem' }}>
              {/* Question selector tabs */}
              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '0.3rem' }}>
                {dynamicQuestions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setActiveQuestionId(q.id)}
                    style={{
                      background: activeQuestionId === q.id ? 'var(--teal-800)' : 'var(--bg-surface-soft)',
                      color: activeQuestionId === q.id ? '#FFF' : 'var(--text-secondary)',
                      border: '1px solid ' + (activeQuestionId === q.id ? 'var(--teal-800)' : 'var(--border-subtle)'),
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.3rem 0.75rem',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <span>{isAr ? `السؤال ${idx + 1}` : `Question ${idx + 1}`}</span>
                    {q.status === 'answered' && <CheckCircle2 size={12} style={{ color: activeQuestionId === q.id ? '#86EFAC' : 'var(--verified-green)' }} />}
                  </button>
                ))}
              </div>

              {/* Active question details & quick answer buttons */}
              {activeQuestion && (
                <div
                  style={{
                    background: 'var(--bg-canvas)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.15rem'
                  }}
                >
                  <div style={{ marginBottom: '0.65rem' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--teal-800)', fontWeight: 700, textTransform: 'uppercase' }}>
                      {isAr ? 'سياق السؤال والمطابقة:' : 'Clinical Context:'}
                    </span>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.15rem 0 0 0' }}>
                      {isAr ? activeQuestion.contextAr : activeQuestion.context}
                    </p>
                  </div>

                  <p
                    style={{
                      fontSize: '0.94rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      lineHeight: 1.5,
                      marginBottom: '1rem',
                      padding: '0.65rem 0.85rem',
                      background: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    “{isAr ? activeQuestion.textAr : activeQuestion.text}”
                  </p>

                  {/* Suggested Quick Answer Options */}
                  {activeQuestion.suggestedAnswers && activeQuestion.suggestedAnswers.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
                        {isAr ? 'خيارات إجابة سريعة من المريض (انقر للاعتماد المباشر):' : 'One-Click Patient Response:'}
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                        {activeQuestion.suggestedAnswers.map((ans, i) => (
                          <button
                            key={i}
                            onClick={() => handleSelectSuggested(activeQuestion.id, isAr ? ans.labelAr : ans.label)}
                            style={{
                              textAlign: isAr ? 'right' : 'left',
                              padding: '0.5rem 0.85rem',
                              borderRadius: 'var(--radius-sm)',
                              background: activeQuestion.answer === (isAr ? ans.labelAr : ans.label) ? 'var(--teal-100)' : 'var(--bg-surface)',
                              border: '1px solid ' + (activeQuestion.answer === (isAr ? ans.labelAr : ans.label) ? 'var(--teal-800)' : 'var(--border-subtle)'),
                              color: activeQuestion.answer === (isAr ? ans.labelAr : ans.label) ? 'var(--teal-900)' : 'var(--text-primary)',
                              fontSize: '0.82rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              transition: 'all 120ms'
                            }}
                          >
                            <span>{isAr ? ans.labelAr : ans.label}</span>
                            {activeQuestion.answer === (isAr ? ans.labelAr : ans.label) && (
                              <CheckCircle2 size={14} style={{ color: 'var(--teal-800)', flexShrink: 0 }} />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Custom Answer Input */}
                  <form onSubmit={handleCustomSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      value={customAnswer}
                      onChange={(e) => setCustomAnswer(e.target.value)}
                      placeholder={isAr ? 'أو اكتب إجابة المريض الشفهية هنا...' : 'Or type custom patient reply...'}
                      style={{
                        flex: 1,
                        padding: '0.45rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-medium)',
                        background: 'var(--bg-surface)',
                        fontSize: '0.84rem',
                        fontFamily: 'inherit',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="submit"
                      className="btn-primary"
                      style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                    >
                      <Send size={13} />
                      <span>{isAr ? 'حفظ' : 'Submit'}</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* 4. Possible Clinical Conditions (Diagnostic Hypotheses) */}
          <div className="clinical-card">
            <div className="clinical-card-header">
              <div className="clinical-card-title">
                <div className="icon-container">
                  <Stethoscope size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.98rem', margin: 0, fontWeight: 700 }}>
                    {isAr ? '🩺 الاحتمالات السريرية المقترحة (Clinical Conditions)' : '🩺 Clinical Possibilities & Hypotheses'}
                  </h3>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    {isAr ? 'احتمالات مبنية على ربط الأعراض بسجل الأدوية وتاريخ المريض' : 'Evidence-backed differentials linked to medication changes & symptoms'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ padding: '1rem 1.4rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {clinicalPossibilities.slice(0, 3).map((pos, idx) => (
                <div
                  key={pos.id}
                  style={{
                    background: 'var(--bg-canvas)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.95rem 1.1rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: 'var(--teal-800)',
                          color: '#FFFFFF',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {idx + 1}
                      </span>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        {isAr ? pos.conditionAr : pos.condition}
                      </strong>
                    </div>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.5rem',
                        borderRadius: 'var(--radius-full)',
                        background: pos.probability === 'high' ? 'var(--teal-100)' : 'var(--bg-surface-soft)',
                        color: pos.probability === 'high' ? 'var(--teal-900)' : 'var(--text-secondary)',
                        border: '1px solid ' + (pos.probability === 'high' ? 'var(--teal-200)' : 'var(--border-subtle)')
                      }}
                    >
                      {pos.probability === 'high'
                        ? isAr ? 'احتمال مرتفع (88%)' : 'High Likelihood (88%)'
                        : pos.probability === 'moderate'
                        ? isAr ? 'احتمال متوسط (62%)' : 'Moderate (62%)'
                        : isAr ? 'يؤخذ بالاعتبار' : 'Consider'}
                    </span>
                  </div>

                  {/* Extracted Symptoms */}
                  <div style={{ marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>{isAr ? 'الأعراض المستخلصة من الكلام: ' : 'Extracted Symptoms: '}</strong>
                    {isAr ? pos.extractedSymptomsAr : pos.extractedSymptoms}
                  </div>

                  {/* Inferred Causes */}
                  <div style={{ marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--teal-900)', background: 'var(--teal-50)', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--teal-100)' }}>
                    <strong style={{ color: 'var(--teal-950)' }}>{isAr ? 'الأسباب المستنتجة والربط: ' : 'Inferred Causes: '}</strong>
                    {isAr ? pos.inferredCausesAr : pos.inferredCauses}
                  </div>

                  {/* Evidence Links */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {isAr ? 'الأدلة المربوطة:' : 'Linked Evidence:'}
                    </span>
                    {pos.evidenceLinks.map((ev, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.7rem',
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border-hairline)',
                          padding: '0.1rem 0.45rem',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        • {isAr ? ev.textAr : ev.text}
                      </span>
                    ))}
                  </div>

                  {/* Per-card mandatory notice */}
                  <div
                    style={{
                      background: 'var(--review-amber-light)',
                      border: '1px solid var(--review-amber-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.35rem 0.65rem',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: 'var(--review-amber-text)'
                    }}
                  >
                    ⚠️ {isAr ? 'يجب مراجعة الطبيب للتشخيص والتأكيد منه' : 'Must be reviewed and confirmed by a qualified doctor'}
                  </div>
                </div>
              ))}

              {/* MANDATORY CLINICAL DISCLAIMER */}
              <div
                style={{
                  background: 'var(--review-amber-light)',
                  border: '1px solid var(--review-amber-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem'
                }}
              >
                <Info size={16} style={{ color: 'var(--review-amber-text)', flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '0.76rem', color: 'var(--review-amber-text)', lineHeight: 1.5, margin: 0, fontWeight: 600 }}>
                  <strong>{isAr ? 'تنبيه سريري إلزامي: ' : 'Mandatory Clinical Notice: '}</strong>
                  {isAr
                    ? 'هذا التشخيص مقترح ومتوقع مبني على تحليل الذكاء الاصطناعي للاسترشاد السريري فقط، ولا يُعتد به كتشخيص نهائي. يجب مراجعة الطبيب للتشخيص والتأكيد منه.'
                    : 'This is an AI-suggested clinical differential intended for guidance only, and is NOT a definitive diagnosis. Must be reviewed and confirmed by a qualified doctor.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
