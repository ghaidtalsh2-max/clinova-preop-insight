import React, { useState, useRef, useEffect } from 'react';
import type { Patient } from '../types/clinical';
import { X, CheckCircle2, ShieldCheck, Printer, FileText, Edit3, Save, RotateCcw, AlertTriangle, PenTool } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PreOpSummaryModalProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (clinicianName: string, notes: string) => void;
  lang: 'ar' | 'en';
}

export const PreOpSummaryModal: React.FC<PreOpSummaryModalProps> = ({
  patient,
  isOpen,
  onClose,
  onApprove,
  lang
}) => {
  if (!isOpen) return null;

  const isAr = lang === 'ar';
  const preOp = patient.preOpSummary;

  // Edit Mode state
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editableAsa, setEditableAsa] = useState<string>(preOp.asaClass);
  const [editableAirway, setEditableAirway] = useState<string>(isAr ? preOp.airwayRiskAr : preOp.airwayRisk);
  const [editableCardiac, setEditableCardiac] = useState<string>(isAr ? preOp.cardiacRiskAr : preOp.cardiacRisk);
  const [editableMetabolic, setEditableMetabolic] = useState<string>(isAr ? preOp.metabolicStatusAr : preOp.metabolicStatus);

  const [clinicianName, setClinicianName] = useState<string>(
    preOp.clinicianName || (isAr ? 'د. سارة محمد (استشاري)' : 'Dr. Sarah Mohammed (Consultant)')
  );
  const [clinicianNotes, setClinicianNotes] = useState<string>(
    preOp.clinicianNotes || (isAr ? 'تمت مراجعة نتائج الاستيضاح مع المريض ومطابقة جرعة الضغط مع تطبيق صحتي. المريض لائق للجراحة مع تطبيق بروتوكول التخدير المعتمد.' : 'Pre-op reconciliation confirmed with patient. Medication plan verified. Patient cleared for surgery under specified precautions.')
  );

  // Digital Signature Canvas states
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [hasSignature, setHasSignature] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#2D2254';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [isOpen, preOp.verifiedByClinician]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const applyDigitalStamp = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.fillStyle = '#1E5841';
    ctx.fillText('✓ DIGITAL VERIFIED CLINICAL STAMP', 15, 30);
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#352A46';
    ctx.fillText(`Clinician: ${clinicianName}`, 15, 52);
    ctx.fillText(`SCFHS Reg: 24-MD-89214 | ${new Date().toLocaleDateString()}`, 15, 70);
    setHasSignature(true);
  };

  const handleApprove = () => {
    onApprove(clinicianName, clinicianNotes);
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const statusStep = preOp.verifiedByClinician ? 'approved' : clinicianNotes.trim() ? 'review' : 'draft';

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(33, 30, 39, 0.6)', backdropFilter: 'blur(3px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div
        className="modal-sheet"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '860px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-float)',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--surface)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--lavender-soft)',
                color: 'var(--lavender)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--lavender-border)'
              }}
            >
              <FileText size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0, color: 'var(--ink)', fontFamily: 'var(--font-heading)' }}>
                {isAr ? 'التقرير والملخص السريري الموحد (Clinova Clinical Report)' : 'Clinova Unified Clinical Report'}
              </h2>
              <span style={{ fontSize: '0.72rem', color: 'var(--ink-soft)' }}>
                {isAr ? 'التقييم السريري المعتمد وفق معيار نفيس الوطني NPHIES' : 'Certified Clinical Synthesis — NPHIES Compliant'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {/* Status Pipeline: AI Draft → Physician Review → Approved ✓ */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'var(--bg)',
                border: '1px solid var(--line)',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.7rem'
              }}
            >
              <span style={{ color: statusStep === 'draft' ? 'var(--lavender)' : 'var(--ink-muted)', fontWeight: statusStep === 'draft' ? 700 : 500 }}>
                {isAr ? 'مسودة AI' : 'AI Draft'}
              </span>
              <span style={{ color: 'var(--ink-muted)' }}>→</span>
              <span style={{ color: statusStep === 'review' ? 'var(--gold)' : 'var(--ink-muted)', fontWeight: statusStep === 'review' ? 700 : 500 }}>
                {isAr ? 'مراجعة الطبيب' : 'Physician Review'}
              </span>
              <span style={{ color: 'var(--ink-muted)' }}>→</span>
              <span style={{ color: statusStep === 'approved' ? 'var(--mint)' : 'var(--ink-muted)', fontWeight: statusStep === 'approved' ? 700 : 500 }}>
                {isAr ? 'معتمد ✓' : 'Approved ✓'}
              </span>
            </div>

            <button
              onClick={handlePrint}
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.35rem 0.75rem',
                fontSize: '0.76rem',
                color: 'var(--ink)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
              title={isAr ? 'طباعة التقرير' : 'Print summary'}
            >
              <Printer size={13} />
              <span>{isAr ? '🖨 طباعة' : '🖨 Print'}</span>
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--ink-soft)',
                padding: '0.35rem'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {/* WHO AI Governance & Human Warranty Alert Banner */}
          <div
            style={{
              background: 'rgba(213, 180, 106, 0.12)',
              border: '1.5px solid var(--gold-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.85rem 1.15rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <AlertTriangle size={20} style={{ color: 'var(--gold)', flexShrink: 0 }} />
              <div style={{ fontSize: '0.76rem', color: 'var(--ink)', lineHeight: 1.5 }}>
                <strong>{isAr ? 'الضمانة السريرية البشرية (وفق ميثاق منظمة الصحة العالمية WHO 2021):' : 'Human-in-the-Loop Warranty (WHO Guidance 2021):'}</strong>{' '}
                {isAr
                  ? 'هذا التقرير مُعد بمساعدة الذكاء الاصطناعي (Clinova AI) ولا يُعد معتمداً أو نافذاً إلا بعد مراجعة الطبيب الاستشاري وتوقيعه الرقمي.'
                  : 'This report is generated with clinical AI assistance and is legally/clinically valid only upon attending physician review and digital signature.'}
              </div>
            </div>

            {/* Edit Mode Toggle Button */}
            {!preOp.verifiedByClinician && (
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                style={{
                  background: isEditMode ? 'var(--lavender)' : 'var(--surface)',
                  color: isEditMode ? '#FFFFFF' : 'var(--deep-plum)',
                  border: '1px solid var(--lavender-border)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  flexShrink: 0,
                  transition: 'all 160ms ease'
                }}
              >
                {isEditMode ? <Save size={13} /> : <Edit3 size={13} />}
                <span>{isEditMode ? (isAr ? 'حفظ التعديلات' : 'Save Edits') : (isAr ? 'تعديل التقرير' : 'Edit Report')}</span>
              </button>
            )}
          </div>

          {/* Patient Demographic & Procedure Info */}
          <div
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.85rem 1.15rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.75rem',
              fontSize: '0.8rem'
            }}
          >
            <div>
              <span style={{ color: 'var(--ink-soft)', display: 'block', fontSize: '0.7rem' }}>
                {isAr ? 'اسم المريض' : 'Patient Name'}
              </span>
              <strong style={{ color: 'var(--ink)' }}>{isAr ? patient.nameAr : patient.name}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--ink-soft)', display: 'block', fontSize: '0.7rem' }}>
                {isAr ? 'الهوية الوطنية / العمر' : 'National ID / Age'}
              </span>
              <span style={{ color: 'var(--ink)' }}>{patient.nationalId} ({patient.age} {isAr ? 'سنة' : 'yo'})</span>
            </div>

            <div>
              <span style={{ color: 'var(--ink-soft)', display: 'block', fontSize: '0.7rem' }}>
                {isAr ? 'العملية الجراحية المقررة' : 'Planned Procedure'}
              </span>
              <strong style={{ color: 'var(--lavender)' }}>
                {isAr ? patient.scheduledProcedureAr : patient.scheduledProcedure}
              </strong>
            </div>

            <div>
              <span style={{ color: 'var(--ink-soft)', display: 'block', fontSize: '0.7rem' }}>
                {isAr ? 'المنشأة الطبية' : 'Surgical Facility'}
              </span>
              <span style={{ color: 'var(--ink)' }}>{isAr ? patient.hospitalAr : patient.hospital}</span>
            </div>
          </div>

          {/* Clinical Risk Categorization Cards (Editable or Read-Only) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {/* ASA Classification */}
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem 0.95rem'
              }}
            >
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--lavender)' }}>
                {isAr ? 'تصنيف الحالة البدنية (ASA Class):' : 'ASA Physical Status:'}
              </span>
              {isEditMode ? (
                <input
                  type="text"
                  value={editableAsa}
                  onChange={(e) => setEditableAsa(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.3rem 0.5rem',
                    marginTop: '0.25rem',
                    borderRadius: '4px',
                    border: '1px solid var(--lavender)',
                    fontSize: '0.82rem',
                    fontFamily: 'inherit'
                  }}
                />
              ) : (
                <p style={{ fontSize: '0.84rem', fontWeight: 600, margin: '0.2rem 0 0 0', color: 'var(--ink)' }}>
                  {editableAsa}
                </p>
              )}
            </div>

            {/* Airway Assessment */}
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem 0.95rem'
              }}
            >
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--lavender)' }}>
                {isAr ? 'تقييم المسالك الهوائية (Airway Risk):' : 'Airway Assessment:'}
              </span>
              {isEditMode ? (
                <input
                  type="text"
                  value={editableAirway}
                  onChange={(e) => setEditableAirway(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.3rem 0.5rem',
                    marginTop: '0.25rem',
                    borderRadius: '4px',
                    border: '1px solid var(--lavender)',
                    fontSize: '0.82rem',
                    fontFamily: 'inherit'
                  }}
                />
              ) : (
                <p style={{ fontSize: '0.84rem', fontWeight: 600, margin: '0.2rem 0 0 0', color: 'var(--ink)' }}>
                  {editableAirway}
                </p>
              )}
            </div>

            {/* Cardiac Evaluation */}
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem 0.95rem'
              }}
            >
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--lavender)' }}>
                {isAr ? 'تقييم مخاطر القلب والدورة الدموية:' : 'Cardiovascular Risk:'}
              </span>
              {isEditMode ? (
                <input
                  type="text"
                  value={editableCardiac}
                  onChange={(e) => setEditableCardiac(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.3rem 0.5rem',
                    marginTop: '0.25rem',
                    borderRadius: '4px',
                    border: '1px solid var(--lavender)',
                    fontSize: '0.82rem',
                    fontFamily: 'inherit'
                  }}
                />
              ) : (
                <p style={{ fontSize: '0.84rem', fontWeight: 600, margin: '0.2rem 0 0 0', color: 'var(--ink)' }}>
                  {editableCardiac}
                </p>
              )}
            </div>

            {/* Metabolic Status */}
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem 0.95rem'
              }}
            >
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--lavender)' }}>
                {isAr ? 'الحالة الأيضية والغدد:' : 'Metabolic / Glycemic Status:'}
              </span>
              {isEditMode ? (
                <input
                  type="text"
                  value={editableMetabolic}
                  onChange={(e) => setEditableMetabolic(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.3rem 0.5rem',
                    marginTop: '0.25rem',
                    borderRadius: '4px',
                    border: '1px solid var(--lavender)',
                    fontSize: '0.82rem',
                    fontFamily: 'inherit'
                  }}
                />
              ) : (
                <p style={{ fontSize: '0.84rem', fontWeight: 600, margin: '0.2rem 0 0 0', color: 'var(--ink)' }}>
                  {editableMetabolic}
                </p>
              )}
            </div>
          </div>

          {/* Pre-Op Medication Plan Table */}
          <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
            <div style={{ background: 'var(--bg)', padding: '0.6rem 0.95rem', borderBottom: '1px solid var(--line)' }}>
              <strong style={{ fontSize: '0.84rem', color: 'var(--ink)' }}>
                {isAr ? 'خطة مطابقة الأدوية وتوجيهات يوم العملية (Medication Plan):' : 'Perioperative Medication Management Plan:'}
              </strong>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: isAr ? 'right' : 'left' }}>
              <thead>
                <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--line)' }}>
                  <th style={{ padding: '0.45rem 0.85rem', color: 'var(--ink-soft)' }}>{isAr ? 'الدواء' : 'Medication'}</th>
                  <th style={{ padding: '0.45rem 0.65rem', color: 'var(--ink-soft)' }}>{isAr ? 'الجرعة' : 'Dose'}</th>
                  <th style={{ padding: '0.45rem 0.65rem', color: 'var(--ink-soft)' }}>{isAr ? 'القطاع' : 'Sector'}</th>
                  <th style={{ padding: '0.45rem 0.65rem', color: 'var(--ink-soft)' }}>{isAr ? 'التوجيه الجراحي' : 'Pre-Op Order'}</th>
                  <th style={{ padding: '0.45rem 0.85rem', color: 'var(--ink-soft)' }}>{isAr ? 'التبرير السريري' : 'Clinical Rationale'}</th>
                </tr>
              </thead>
              <tbody>
                {preOp.medicationPlan.map((plan, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '0.55rem 0.85rem', fontWeight: 600, color: 'var(--ink)' }}>{plan.medication}</td>
                    <td style={{ padding: '0.55rem 0.65rem', color: 'var(--ink-soft)' }}>{plan.dose}</td>
                    <td style={{ padding: '0.55rem 0.65rem' }}>
                      <span
                        style={{
                          fontSize: '0.66rem',
                          fontWeight: 600,
                          padding: '0.08rem 0.4rem',
                          borderRadius: 'var(--radius-full)',
                          background: plan.sector === 'MOH' ? 'var(--mint-soft)' : plan.sector === 'NGHA' ? 'var(--lavender-soft)' : 'var(--gold-soft)',
                          color: plan.sector === 'MOH' ? '#1A7052' : plan.sector === 'NGHA' ? '#4B3666' : '#8C6D1F',
                          border: '1px solid ' + (plan.sector === 'MOH' ? 'var(--mint-border)' : plan.sector === 'NGHA' ? 'var(--lavender-border)' : 'var(--gold-border)')
                        }}
                      >
                        {plan.sector}
                      </span>
                    </td>
                    <td style={{ padding: '0.55rem 0.65rem' }}>
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: '0.72rem',
                          padding: '0.12rem 0.45rem',
                          borderRadius: 'var(--radius-xs)',
                          background: plan.action === 'reconcile' ? 'var(--crit-soft)' : 'var(--mint-soft)',
                          color: plan.action === 'reconcile' ? 'var(--crit)' : '#1A7052',
                          border: '1px solid ' + (plan.action === 'reconcile' ? 'var(--crit-border)' : 'var(--mint-border)')
                        }}
                      >
                        {isAr ? plan.actionAr : plan.action.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '0.55rem 0.85rem', color: 'var(--ink-soft)' }}>
                      {isAr ? plan.rationaleAr : plan.rationale}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Clinician Review & Digital Signature Card */}
          <div
            style={{
              background: preOp.verifiedByClinician ? 'var(--mint-soft)' : 'var(--bg)',
              border: '1px solid ' + (preOp.verifiedByClinician ? 'var(--mint-border)' : 'var(--line)'),
              borderRadius: 'var(--radius-sm)',
              padding: '1.1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
              <ShieldCheck size={17} style={{ color: preOp.verifiedByClinician ? 'var(--mint)' : 'var(--lavender)' }} />
              <strong style={{ fontSize: '0.88rem', color: 'var(--ink)' }}>
                {isAr ? 'المصادقة والتوقيع السريري الرقمي الإلزامي' : 'Mandatory Digital Clinician Signature'}
              </strong>
            </div>

            {preOp.verifiedByClinician ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#1A7052', fontWeight: 600, fontSize: '0.84rem' }}>
                  <CheckCircle2 size={15} />
                  <span>{isAr ? 'تم اعتماد التقييم السريري وتوقيعه رقمياً بنجاح' : 'Assessment formally approved & digitally signed'}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', marginTop: '0.35rem' }}>
                  <p style={{ margin: '0.15rem 0' }}><strong>{isAr ? 'الممارس المعتمد: ' : 'Signing Clinician: '}</strong> {preOp.clinicianName}</p>
                  <p style={{ margin: '0.15rem 0' }}><strong>{isAr ? 'توقيت الاعتماد: ' : 'Timestamp: '}</strong> {preOp.approvalTimestamp || new Date().toLocaleString()}</p>
                  <p style={{ margin: '0.15rem 0' }}><strong>{isAr ? 'الملاحظات السريرية: ' : 'Clinician Notes: '}</strong> {preOp.clinicianNotes}</p>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--ink-soft)', display: 'block', marginBottom: '0.2rem' }}>
                    {isAr ? 'اسم وصفة الممارس الصحي المعتمد:' : 'Clinician Full Name & Title:'}
                  </label>
                  <input
                    type="text"
                    value={clinicianName}
                    onChange={(e) => setClinicianName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.4rem 0.65rem',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--line)',
                      background: 'var(--surface)',
                      fontSize: '0.82rem',
                      color: 'var(--ink)',
                      fontFamily: 'inherit',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--ink-soft)', display: 'block', marginBottom: '0.2rem' }}>
                    {isAr ? 'ملاحظات التخدير والجراحة وتعديلات الطبيب:' : 'Final Anesthetic & Surgical Directives:'}
                  </label>
                  <textarea
                    rows={2}
                    value={clinicianNotes}
                    onChange={(e) => setClinicianNotes(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.4rem 0.65rem',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--line)',
                      background: 'var(--surface)',
                      fontSize: '0.82rem',
                      color: 'var(--ink)',
                      fontFamily: 'inherit',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Digital Signature Canvas Box */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <PenTool size={13} style={{ color: 'var(--primary)' }} />
                      <span>{isAr ? 'لوحة التوقيع الرقمي للطبيب:' : 'Physician Digital Signature Canvas:'}</span>
                    </label>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        onClick={clearSignature}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--ink-soft)',
                          fontSize: '0.7rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.2rem'
                        }}
                      >
                        <RotateCcw size={11} />
                        <span>{isAr ? 'مسح' : 'Clear'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={applyDigitalStamp}
                        style={{
                          background: 'rgba(168, 139, 196, 0.15)',
                          border: '1px solid var(--lavender-border)',
                          borderRadius: '4px',
                          color: 'var(--deep-plum)',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.45rem',
                          cursor: 'pointer'
                        }}
                      >
                        {isAr ? 'ختم توقيع رقمي معتمد' : 'Stamp Official Signature'}
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      border: '1.5px dashed var(--lavender-border)',
                      borderRadius: '8px',
                      background: '#FFFFFF',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                  >
                    <canvas
                      ref={canvasRef}
                      width={780}
                      height={90}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      style={{ width: '100%', height: '90px', cursor: 'crosshair', touchAction: 'none' }}
                    />
                    {!hasSignature && (
                      <span style={{ position: 'absolute', pointerEvents: 'none', color: '#B8B2C4', fontSize: '0.75rem', fontStyle: 'italic' }}>
                        {isAr ? 'وقع هنا بيدك أو اضغط على "ختم توقيع رقمي معتمد"' : 'Sign here with mouse/stylus or click "Stamp Official Signature"'}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.35rem' }}>
                  <button
                    onClick={onClose}
                    style={{
                      background: 'var(--bg)',
                      border: '1px solid var(--line)',
                      color: 'var(--ink-soft)',
                      padding: '0.4rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    onClick={handleApprove}
                    style={{
                      background: 'var(--primary-dark)',
                      color: '#FAF8F5',
                      border: 'none',
                      padding: '0.45rem 1.1rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      boxShadow: '0 2px 8px rgba(53, 42, 70, 0.12)'
                    }}
                  >
                    <CheckCircle2 size={15} />
                    <span>{isAr ? 'اعتماد التقييم السريري وتوقيع الملف (Approve)' : 'Approve & Finalize Report'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

