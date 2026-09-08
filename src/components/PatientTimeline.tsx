import React, { useState } from 'react';
import type { TimelineEvent, SectorSource } from '../types/clinical';
import { Calendar, Activity, AlertCircle, FileText, CheckCircle2, Stethoscope, Filter } from 'lucide-react';

interface PatientTimelineProps {
  timeline: TimelineEvent[];
  lang: 'ar' | 'en';
}

export const PatientTimeline: React.FC<PatientTimelineProps> = ({ timeline, lang }) => {
  const isAr = lang === 'ar';
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedEventId, setSelectedEventId] = useState<string>(timeline[timeline.length - 2]?.id || timeline[0]?.id);

  const filteredEvents = selectedType === 'ALL'
    ? timeline
    : timeline.filter((e) => e.type === selectedType);

  const selectedEvent = timeline.find((e) => e.id === selectedEventId) || timeline[0];

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'diagnosis':
        return <Stethoscope size={16} />;
      case 'procedure':
        return <CheckCircle2 size={16} />;
      case 'er_visit':
        return <AlertCircle size={16} />;
      case 'medication':
        return <Activity size={16} />;
      case 'lab':
        return <FileText size={16} />;
      default:
        return <Calendar size={16} />;
    }
  };

  const getSectorTag = (sector: SectorSource) => {
    switch (sector) {
      case 'MOH':
        return <span className="badge-sector moh">MOH · {isAr ? 'الصحة' : 'MOH'}</span>;
      case 'NGHA':
        return <span className="badge-sector ngha">NGHA · {isAr ? 'الحرس' : 'NGHA'}</span>;
      case 'PRIVATE':
        return <span className="badge-sector private">PRIVATE · {isAr ? 'الخاص' : 'Private'}</span>;
    }
  };

  return (
    <div className="clinical-card" style={{ marginBottom: '1.5rem' }}>
      {/* Header */}
      <div className="clinical-card-header">
        <div className="clinical-card-title">
          <div className="icon-container">
            <Calendar size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>
              {isAr ? 'الخط الزمني الطبي للمريض (Longitudinal Clinical Timeline)' : 'Longitudinal Clinical Timeline'}
            </h3>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: '0.1rem 0 0 0' }}>
              {isAr
                ? 'ربط وتتبع المحطات الصحية والتحاليل عبر السنوات والمستشفيات لفهم التاريخ المرضي الكامل'
                : 'Correlating multi-year diagnoses, procedures, and lab findings across hospital sectors'}
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <Filter size={12} />
            {isAr ? 'تصفية:' : 'Filter:'}
          </span>
          {[
            { id: 'ALL', labelAr: 'الكل', labelEn: 'All' },
            { id: 'medication', labelAr: 'الأدوية', labelEn: 'Medications' },
            { id: 'diagnosis', labelAr: 'التشخيصات', labelEn: 'Diagnoses' },
            { id: 'procedure', labelAr: 'العمليات', labelEn: 'Procedures' },
            { id: 'er_visit', labelAr: 'الطوارئ', labelEn: 'ER Visits' },
            { id: 'lab', labelAr: 'الأشعة والتحاليل', labelEn: 'Labs' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedType(cat.id)}
              style={{
                background: selectedType === cat.id ? 'var(--teal-800)' : 'var(--bg-surface-soft)',
                color: selectedType === cat.id ? '#FFFFFF' : 'var(--text-secondary)',
                border: '1px solid ' + (selectedType === cat.id ? 'var(--teal-800)' : 'var(--border-subtle)'),
                borderRadius: 'var(--radius-sm)',
                padding: '0.2rem 0.6rem',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 120ms'
              }}
            >
              {isAr ? cat.labelAr : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal Flow Track */}
      <div style={{ padding: '1.5rem 1.4rem 0.5rem 1.4rem', overflowX: 'auto', background: 'var(--bg-canvas)' }}>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            minWidth: '780px',
            padding: '1.75rem 1.5rem 1.5rem 1.5rem'
          }}
        >
          {/* Continuous Track Line */}
          <div
            style={{
              position: 'absolute',
              top: '46px',
              left: '50px',
              right: '50px',
              height: '3px',
              background: 'linear-gradient(90deg, #CBD9D2 0%, var(--teal-800) 70%, #E2A03F 100%)',
              zIndex: 1,
              borderRadius: '2px'
            }}
          />

          {filteredEvents.map((event) => {
            const isSelected = event.id === selectedEventId;
            const isConflictEvent = event.type === 'medication';

            return (
              <div
                key={event.id}
                onClick={() => setSelectedEventId(event.id)}
                style={{
                  position: 'relative',
                  zIndex: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  width: '124px',
                  textAlign: 'center',
                  transition: 'transform 180ms ease'
                }}
              >
                {/* Year Marker Above Node */}
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: isSelected ? 'var(--teal-800)' : 'var(--text-muted)',
                    marginBottom: '0.65rem',
                    fontFamily: 'var(--font-serif)',
                    letterSpacing: '0.04em'
                  }}
                >
                  {event.year}
                </span>

                {/* Milestone Node Circle */}
                <div
                  style={{
                    width: isSelected ? '40px' : '32px',
                    height: isSelected ? '40px' : '32px',
                    borderRadius: '50%',
                    background: isSelected
                      ? 'var(--teal-800)'
                      : isConflictEvent
                      ? 'var(--conflict-red-light)'
                      : 'var(--bg-surface)',
                    border: isSelected
                      ? '3px solid #FFFFFF'
                      : isConflictEvent
                      ? '2px solid var(--conflict-red)'
                      : '2px solid var(--border-medium)',
                    boxShadow: isSelected
                      ? '0 0 0 3px var(--teal-800), 0 4px 10px rgba(13, 92, 84, 0.35)'
                      : '0 2px 5px rgba(0,0,0,0.06)',
                    color: isSelected ? '#FFFFFF' : isConflictEvent ? 'var(--conflict-red)' : 'var(--teal-800)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 180ms ease'
                  }}
                >
                  {getEventIcon(event.type)}
                </div>

                {/* Event Summary Under Node */}
                <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ fontSize: '0.68rem' }}>{getSectorTag(event.sector)}</span>
                  <span
                    style={{
                      fontSize: '0.76rem',
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                      lineHeight: 1.35
                    }}
                  >
                    {isAr ? event.titleAr : event.title}
                  </span>

                  {/* Clinical Metric Pill */}
                  {event.clinicalValue && (
                    <span
                      style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.1rem 0.35rem',
                        fontSize: '0.68rem',
                        color: 'var(--teal-800)',
                        fontWeight: 600,
                        marginTop: '0.2rem'
                      }}
                    >
                      {isAr ? event.clinicalValueAr : event.clinicalValue}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Milestone Rich Clinical Card */}
      {selectedEvent && (
        <div
          style={{
            padding: '1.25rem 1.5rem',
            background: 'var(--bg-surface-soft)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flex: 1, minWidth: '280px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--teal-800)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {getEventIcon(selectedEvent.type)}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                <h4 style={{ fontSize: '1.02rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  {isAr ? selectedEvent.titleAr : selectedEvent.title}
                </h4>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  ({selectedEvent.date})
                </span>
                {getSectorTag(selectedEvent.sector)}
              </div>

              <p style={{ margin: '0.35rem 0', fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {isAr ? selectedEvent.descriptionAr : selectedEvent.description}
              </p>

              {/* Verified Clinical Metric */}
              {selectedEvent.clinicalValue && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.25rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--teal-900)'
                  }}
                >
                  <Activity size={13} style={{ color: 'var(--teal-800)' }} />
                  <span>{isAr ? 'القيمة الطبية المسجلة: ' : 'Documented Clinical Value: '}</span>
                  <strong>{isAr ? selectedEvent.clinicalValueAr : selectedEvent.clinicalValue}</strong>
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px dashed var(--border-medium)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 1rem',
              maxWidth: '300px',
              fontSize: '0.78rem',
              color: 'var(--text-muted)'
            }}
          >
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.2rem' }}>
              {isAr ? 'الارتباط بجراحة التقييم الحالية:' : 'Relevance to Current Pre-Op:'}
            </strong>
            {selectedEvent.type === 'medication'
              ? isAr ? 'هذا الحدث يمثل بداية التعارض في جرعة دواء الضغط وتفاقم الدوخة.' : 'Correlates directly with dose escalation and new onset dizziness.'
              : selectedEvent.type === 'procedure'
              ? isAr ? 'قسطرة 2023 تؤكد سلامة الشرايين وتصنف خطورة القلب بمنخفضة.' : 'Normal cath confirms low perioperative cardiac risk.'
              : isAr ? 'سجل مؤرشف في الملف الموحد للمتابعة السريرية.' : 'Documented in unified EHR for surgical review.'}
          </div>
        </div>
      )}
    </div>
  );
};
