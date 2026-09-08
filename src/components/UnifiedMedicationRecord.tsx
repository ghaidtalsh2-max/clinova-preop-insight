import React, { useState } from 'react';
import type { MedicationRecord, SectorSource } from '../types/clinical';
import { Pill, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

interface UnifiedMedicationRecordProps {
  medications: MedicationRecord[];
  lang: 'ar' | 'en';
}

export const UnifiedMedicationRecord: React.FC<UnifiedMedicationRecordProps> = ({
  medications,
  lang
}) => {
  const isAr = lang === 'ar';
  const [selectedSector, setSelectedSector] = useState<string>('ALL');

  const filteredMeds = selectedSector === 'ALL'
    ? medications
    : medications.filter((m) => m.sector === selectedSector);

  const conflictMeds = medications.filter((m) => m.conflictFlag);

  const getSectorBadge = (sector: SectorSource) => {
    switch (sector) {
      case 'MOH':
        return (
          <span className="badge-sector moh">
            <span className="network-dot" style={{ background: '#0D5C54' }}></span>
            {isAr ? 'وزارة الصحة (MOH)' : 'MOH'}
          </span>
        );
      case 'NGHA':
        return (
          <span className="badge-sector ngha">
            <span className="network-dot" style={{ background: '#1E40AF' }}></span>
            {isAr ? 'الحرس الوطني (NGHA)' : 'NGHA'}
          </span>
        );
      case 'PRIVATE':
        return (
          <span className="badge-sector private">
            <span className="network-dot" style={{ background: '#854D0E' }}></span>
            {isAr ? 'القطاع الخاص (دله/الحبيب)' : 'Private Sector'}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="clinical-card" style={{ marginBottom: '1.5rem' }}>
      <div className="clinical-card-header">
        <div className="clinical-card-title">
          <div className="icon-container">
            <Pill size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>
              {isAr ? 'سجل الأدوية الموحد عبر القطاعات' : 'Unified Cross-Sector Medication Record'}
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.1rem 0 0 0' }}>
              {isAr
                ? 'مطابقة الأدوية المصروفة عبر مختلف المنشآت الصحية لكشف الازدواجية والتعارضات'
                : 'Aggregating dispensed prescriptions across hospitals to prevent duplication & dosage discrepancies'}
            </p>
          </div>
        </div>

        {/* Sector Filter Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {['ALL', 'MOH', 'NGHA', 'PRIVATE'].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSector(s)}
              style={{
                background: selectedSector === s ? 'var(--teal-800)' : 'transparent',
                color: selectedSector === s ? 'white' : 'var(--text-secondary)',
                border: '1px solid ' + (selectedSector === s ? 'var(--teal-800)' : 'var(--border-subtle)'),
                borderRadius: 'var(--radius-sm)',
                padding: '0.25rem 0.6rem',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 120ms'
              }}
            >
              {s === 'ALL'
                ? isAr ? 'الكل' : 'All Sectors'
                : s === 'MOH'
                ? isAr ? 'الصحة' : 'MOH'
                : s === 'NGHA'
                ? isAr ? 'الحرس' : 'NGHA'
                : isAr ? 'الخاص' : 'Private'}
            </button>
          ))}
        </div>
      </div>

      {/* Cross-Sector Conflict Warning Banner (CRITICAL RED ONLY) */}
      {conflictMeds.length > 0 && (
        <div
          style={{
            background: 'var(--conflict-red-light)',
            borderBottom: '1px solid var(--conflict-red-border)',
            borderTop: '1px solid var(--conflict-red-border)',
            padding: '0.85rem 1.4rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem'
          }}
        >
          <AlertTriangle size={20} style={{ color: 'var(--conflict-red)', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <strong style={{ color: 'var(--conflict-red-dark)', fontSize: '0.88rem' }}>
                {isAr ? '⚠️ تعارض سريري عبر القطاعات الصحية (Medication Conflict)' : '⚠️ Medication Conflict Detected Across Healthcare Sectors'}
              </strong>
              <span className="badge-conflict" style={{ fontSize: '0.7rem' }}>
                {isAr ? 'يتطلب مطابقة فورية' : 'Immediate Reconciliation Required'}
              </span>
            </div>
            <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.84rem', color: 'var(--conflict-red-dark)', lineHeight: 1.5 }}>
              {isAr
                ? 'تم رصد اختلافات حرجة في الجرعات أو ازدواجية في الوصفات لنفس المريض بين مستشفيات وزارة الصحة والحرس الوطني أو القطاع الخاص. يرجى مراجعة الجدول أدناه وتحديد الجرعة الفعلية المتناولة بالمنزل قبل العملية.'
                : 'Significant dose discrepancies or duplicate drug therapies are recorded between MOH, NGHA, and Private Sector files. Verify actual home adherence before administering anesthesia.'}
            </p>
          </div>
        </div>
      )}

      {/* Medication Table / Editorial Rows */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isAr ? 'right' : 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-surface-soft)', borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: '0.75rem 1.4rem', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {isAr ? 'الدواء والتركيب العلمي' : 'Medication & Generic'}
              </th>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {isAr ? 'الجرعة والتكرار' : 'Dose & Regimen'}
              </th>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {isAr ? 'القطاع والمستشفى المصدر' : 'Sector & Facility'}
              </th>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {isAr ? 'الحالة وتاريخ الصرف' : 'Status & Date'}
              </th>
              <th style={{ padding: '0.75rem 1.4rem', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {isAr ? 'الملاحظات السريرية والتعارض' : 'Clinical Context & Conflict'}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredMeds.map((med, index) => {
              const hasConflict = med.conflictFlag;
              return (
                <tr
                  key={med.id}
                  style={{
                    borderBottom: '1px solid var(--border-hairline)',
                    background: hasConflict ? '#FFF9F9' : index % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-surface-soft)',
                    transition: 'background 120ms'
                  }}
                >
                  {/* Medication Name */}
                  <td style={{ padding: '0.9rem 1.4rem', verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <strong style={{ fontSize: '0.94rem', color: hasConflict ? 'var(--conflict-red)' : 'var(--text-primary)' }}>
                        {med.name}
                      </strong>
                      {hasConflict && (
                        <span
                          title={isAr ? 'يوجد تعارض في الجرعة أو ازدواجية' : 'Dosage or drug conflict'}
                          style={{
                            background: 'var(--conflict-red)',
                            color: 'white',
                            fontSize: '0.66rem',
                            fontWeight: 700,
                            padding: '0.1rem 0.4rem',
                            borderRadius: 'var(--radius-full)'
                          }}
                        >
                          {isAr ? 'تعارض' : 'CONFLICT'}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.15rem' }}>
                      {med.genericName}
                    </span>
                  </td>

                  {/* Dose & Frequency */}
                  <td style={{ padding: '0.9rem 1rem', verticalAlign: 'top' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        color: hasConflict ? 'var(--conflict-red-dark)' : 'var(--teal-900)',
                        background: hasConflict ? 'var(--conflict-red-light)' : 'var(--teal-50)',
                        padding: '0.15rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid ' + (hasConflict ? 'var(--conflict-red-border)' : 'var(--teal-100)')
                      }}
                    >
                      {med.dose}
                    </span>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', display: 'block', marginTop: '0.25rem' }}>
                      {med.frequency}
                    </span>
                  </td>

                  {/* Sector */}
                  <td style={{ padding: '0.9rem 1rem', verticalAlign: 'top' }}>
                    {getSectorBadge(med.sector)}
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', display: 'block', marginTop: '0.35rem', fontWeight: 500 }}>
                      {isAr ? med.sectorHospitalAr : med.sectorHospital}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>
                      {med.prescriberName}
                    </span>
                  </td>

                  {/* Status & Prescribed Date */}
                  <td style={{ padding: '0.9rem 1rem', verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                      {med.status === 'active' ? (
                        <span className="badge-verified" style={{ fontSize: '0.72rem', padding: '0.1rem 0.5rem' }}>
                          <CheckCircle2 size={12} />
                          {isAr ? 'نشط (Active)' : 'Active'}
                        </span>
                      ) : (
                        <span className="badge-review" style={{ fontSize: '0.72rem', padding: '0.1rem 0.5rem' }}>
                          <Clock size={12} />
                          {isAr ? 'سابق (Previous)' : 'Previous'}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block' }}>
                      {med.prescribedDate}
                    </span>
                  </td>

                  {/* Clinical Context & Reconciliation */}
                  <td style={{ padding: '0.9rem 1.4rem', verticalAlign: 'top' }}>
                    {hasConflict ? (
                      <div
                        style={{
                          background: 'var(--conflict-red-light)',
                          border: '1px solid var(--conflict-red-border)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.45rem 0.65rem',
                          fontSize: '0.78rem',
                          color: 'var(--conflict-red-dark)'
                        }}
                      >
                        <strong>{isAr ? 'ملحوظة التعارض:' : 'Conflict Note:'} </strong>
                        {isAr ? med.conflictDescriptionAr : med.conflictDescription}
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {isAr ? med.notesAr : med.notes}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
