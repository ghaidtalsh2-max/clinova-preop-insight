import React, { useState } from 'react';
import type { TimelineEvent } from '../types/clinical';
import { History } from 'lucide-react';

interface VerticalTimelineRibbonProps {
  timeline: TimelineEvent[];
  lang: 'ar' | 'en';
}

export const VerticalTimelineRibbon: React.FC<VerticalTimelineRibbonProps> = ({
  timeline,
  lang
}) => {
  const isAr = lang === 'ar';
  const [isHoveredOrExpanded, setIsHoveredOrExpanded] = useState<boolean>(false);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);

  // Fallback events if timeline is short
  const events = timeline && timeline.length > 0 ? timeline : [
    { id: 'e1', year: 2026, titleAr: 'تعديل جرعة العلاج (طوارئ الحرس)', title: 'Dose Adjustment (NGHA Emergency)', sectorAr: 'الحرس الوطني', sector: 'NGHA', highlight: true },
    { id: 'e2', year: 2025, titleAr: 'مراجعة طوارئ الحرس', title: 'NGHA ER Visit', sectorAr: 'الحرس الوطني', sector: 'NGHA' },
    { id: 'e3', year: 2024, titleAr: 'تشخيص السكري', title: 'Diabetes Diagnosis', sectorAr: 'وزارة الصحة', sector: 'MOH' },
    { id: 'e4', year: 2023, titleAr: 'قسطرة تشخيصية', title: 'Diagnostic Catheterization', sectorAr: 'وزارة الصحة', sector: 'MOH' },
  ];

  return (
    <div
      className={`col-timeline-ribbon ${isHoveredOrExpanded ? 'expanded' : ''}`}
      onMouseEnter={() => setIsHoveredOrExpanded(true)}
      onMouseLeave={() => {
        setIsHoveredOrExpanded(false);
        setActiveEventId(null);
      }}
      aria-label={isAr ? 'شريط المسار الزمني الصحي' : 'Clinical Journey Timeline'}
      style={{
        background: '#2D2254',
        color: '#FFFFFF',
        position: 'relative',
        zIndex: 20,
        boxShadow: isHoveredOrExpanded ? '0 8px 30px rgba(0,0,0,0.3)' : 'none'
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isHoveredOrExpanded ? 'space-between' : 'center',
          width: '100%',
          padding: isHoveredOrExpanded ? '0.4rem 0.5rem 0.8rem' : '0.2rem 0 0.8rem',
          borderBottom: isHoveredOrExpanded ? '1px solid rgba(255,255,255,0.1)' : 'none'
        }}
      >
        {isHoveredOrExpanded ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <History size={16} strokeWidth={1.5} style={{ color: '#A5B4FC' }} />
            <strong style={{ fontSize: '0.84rem', fontFamily: 'var(--font-heading)', color: '#FFFFFF' }}>
              {isAr ? 'السجل الزمني' : 'Timeline'}
            </strong>
          </div>
        ) : (
          <div
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#FFFFFF',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={isAr ? 'الخط الزمني الصحي' : 'Clinical Timeline'}
          >
            <History size={16} strokeWidth={1.5} />
          </div>
        )}
      </div>

      {/* Vertical Spine Line */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isHoveredOrExpanded ? 'stretch' : 'center',
          gap: isHoveredOrExpanded ? '1rem' : '1.35rem',
          flex: 1,
          marginTop: '0.5rem'
        }}
      >
        {/* Continuous center spine line */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            bottom: 20,
            right: isHoveredOrExpanded ? (isAr ? '20px' : 'auto') : '50%',
            left: isHoveredOrExpanded ? (isAr ? 'auto' : '20px') : 'auto',
            transform: isHoveredOrExpanded ? 'none' : 'translateX(50%)',
            width: '2px',
            background: 'rgba(255, 255, 255, 0.18)',
            zIndex: 1
          }}
        />

        {/* Milestone Nodes */}
        {events.map((event, idx) => {
          const isLatest = idx === 0 || event.year === 2026;
          const isConflictEvent = isLatest;

          return (
            <div
              key={event.id || idx}
              onClick={() => setActiveEventId(activeEventId === event.id ? null : event.id)}
              style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
                padding: isHoveredOrExpanded ? '0.2rem 0.4rem' : '0'
              }}
            >
              {/* Year Node Circle */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isConflictEvent ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                  border: isConflictEvent ? '2px solid #EF4444' : '1.5px solid rgba(255, 255, 255, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  color: isConflictEvent ? '#FCA5A5' : '#FFFFFF',
                  fontFamily: 'var(--font-heading)',
                  boxShadow: isConflictEvent ? '0 0 10px rgba(239, 68, 68, 0.4)' : 'none',
                  flexShrink: 0,
                  position: 'relative',
                  transition: 'all 200ms ease'
                }}
              >
                {String(event.year)}

                {/* Status Dot */}
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: isConflictEvent ? '#EF4444' : '#818CF8',
                    border: '1.5px solid #2D2254'
                  }}
                />
              </div>

              {/* Expanded details in drawer */}
              {isHoveredOrExpanded && (
                <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.2rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {isAr ? event.titleAr : event.title}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.66rem', color: '#A5B4FC', marginTop: '0.15rem' }}>
                    {isAr ? event.sectorAr : event.sector}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
