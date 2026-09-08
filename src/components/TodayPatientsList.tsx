import React, { useState } from 'react';
import type { Patient } from '../types/clinical';
import { ChevronRight, ChevronLeft, Search, Users } from 'lucide-react';
import { getAssetPath } from '../utils/assetHelper';

interface TodayPatientsListProps {
  patients: Patient[];
  selectedPatientId: string;
  onSelectPatient: (patientId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  lang: 'ar' | 'en';
}

export const TodayPatientsList: React.FC<TodayPatientsListProps> = ({
  patients,
  selectedPatientId,
  onSelectPatient,
  isCollapsed,
  onToggleCollapse,
  lang
}) => {
  const isAr = lang === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'waiting' | 'in_progress' | 'completed'>('all');

  const filteredPatients = patients.filter((p) => {
    const nameMatch = isAr
      ? p.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) || p.name.toLowerCase().includes(searchTerm.toLowerCase())
      : p.name.toLowerCase().includes(searchTerm.toLowerCase());

    const status = p.visitStatus || (p.triageLevel === 'high' ? 'In Progress' : 'Waiting');
    if (activeFilter === 'waiting') return nameMatch && status === 'Waiting';
    if (activeFilter === 'in_progress') return nameMatch && status === 'In Progress';
    if (activeFilter === 'completed') return nameMatch && status === 'Completed';
    return nameMatch;
  });

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'In Progress':
        return {
          dotColor: '#4F46E5',
          label: isAr ? 'قيد المعاينة' : 'In Progress',
          textColor: '#4F46E5'
        };
      case 'Waiting':
        return {
          dotColor: '#D97706',
          label: isAr ? 'بالانتظار' : 'Waiting',
          textColor: '#D97706'
        };
      case 'Completed':
        return {
          dotColor: '#059669',
          label: isAr ? 'مكتمل' : 'Completed',
          textColor: '#059669'
        };
      default:
        return {
          dotColor: '#6B7280',
          label: isAr ? 'مجدول' : 'Scheduled',
          textColor: '#6B7280'
        };
    }
  };

  return (
    <aside
      className={`col-patients-queue ${isCollapsed ? 'collapsed' : 'expanded'}`}
      aria-label={isAr ? 'قائمة مراجعي اليوم' : "Today's Patient Queue"}
      style={{
        width: isCollapsed ? '64px' : '260px',
        minWidth: isCollapsed ? '64px' : '260px',
        background: '#FAF9FC',
        borderLeft: isAr ? '1px solid var(--line)' : 'none',
        borderRight: isAr ? 'none' : '1px solid var(--line)',
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - var(--header-height))',
        position: 'sticky',
        top: 'var(--header-height)',
        transition: 'all 240ms cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
        zIndex: 20
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          padding: isCollapsed ? '0.85rem 0.4rem' : '1rem 1rem 0.75rem 1rem',
          borderBottom: '1px solid var(--line)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          background: '#FFFFFF'
        }}
      >
        {!isCollapsed && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  background: 'rgba(168, 139, 196, 0.15)',
                  color: '#6B4699',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Users size={15} strokeWidth={2} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.92rem', margin: 0, fontWeight: 700, color: '#2D2254', fontFamily: 'var(--font-heading)' }}>
                  {isAr ? 'مراجعي اليوم' : "Today's Patients"}
                </h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--ink-soft)' }}>
                  {isAr ? `${patients.length} مرضى` : `${patients.length} patients`}
                </span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          title={isCollapsed ? (isAr ? 'توسيع القائمة' : 'Expand') : (isAr ? 'طي القائمة' : 'Collapse')}
          style={{
            background: '#F4F0F9',
            border: '1px solid #E2D9F3',
            color: '#6B4699',
            borderRadius: '8px',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          {isCollapsed ? (
            isAr ? <ChevronLeft size={16} /> : <ChevronRight size={16} />
          ) : (
            isAr ? <ChevronRight size={16} /> : <ChevronLeft size={16} />
          )}
        </button>
      </div>

      {!isCollapsed && (
        <>
          {/* Search Box */}
          <div style={{ padding: '0.75rem 1rem 0.5rem 1rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: '#FFFFFF',
                border: '1px solid #E8E2D8',
                borderRadius: '8px',
                padding: '0.4rem 0.65rem'
              }}
            >
              <Search size={14} color="#958EA3" />
              <input
                type="text"
                placeholder={isAr ? 'بحث عن مريض...' : 'Search patients...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.76rem',
                  width: '100%',
                  background: 'transparent',
                  color: 'var(--ink)'
                }}
              />
            </div>
          </div>

          {/* Filter Tabs: All, Waiting, In Progress, Completed */}
          <div
            style={{
              padding: '0 1rem 0.65rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              overflowX: 'auto'
            }}
          >
            {[
              { id: 'all', label: isAr ? 'الكل' : 'All' },
              { id: 'waiting', label: isAr ? 'بالانتظار' : 'Waiting' },
              { id: 'in_progress', label: isAr ? 'قيد المعاينة' : 'In Progress' },
              { id: 'completed', label: isAr ? 'مكتمل' : 'Completed' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                style={{
                  padding: '0.22rem 0.55rem',
                  borderRadius: '14px',
                  fontSize: '0.68rem',
                  fontWeight: activeFilter === tab.id ? 700 : 500,
                  border: activeFilter === tab.id ? '1px solid #6B4699' : '1px solid #E8E2D8',
                  background: activeFilter === tab.id ? '#6B4699' : '#FFFFFF',
                  color: activeFilter === tab.id ? '#FFFFFF' : 'var(--ink-soft)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 150ms ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Patients List (ONLY NAME + SIMPLE VISIT STATUS) */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: isCollapsed ? '0.5rem 0.35rem' : '0.25rem 0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem'
        }}
      >
        {filteredPatients.map((pat) => {
          const isSelected = pat.id === selectedPatientId;
          const statusInfo = getStatusBadge(pat.visitStatus);

          return (
            <div
              key={pat.id}
              onClick={() => onSelectPatient(pat.id)}
              className="patient-queue-card"
              style={{
                padding: isCollapsed ? '0.5rem 0' : '0.6rem 0.75rem',
                borderRadius: '10px',
                background: isSelected ? '#FFFFFF' : 'transparent',
                border: isSelected ? '1.5px solid #A88BC4' : '1px solid transparent',
                boxShadow: isSelected ? 'var(--shadow-card)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'space-between',
                transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {!isCollapsed ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
                    {/* Patient Avatar */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <img
                        src={getAssetPath(pat.photoUrl || '/saud.jpg')}
                        alt={pat.name}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: isSelected ? '1.5px solid #6B4699' : '1px solid #E8E2D8'
                        }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '-1px',
                          right: '-1px',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: statusInfo.dotColor,
                          border: '1.5px solid #FFFFFF'
                        }}
                      />
                    </div>

                    {/* ONLY Name and Visit Status */}
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: isSelected ? 700 : 600,
                          color: isSelected ? '#2D2254' : 'var(--ink)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {isAr ? pat.nameAr : pat.name}
                      </div>
                      <div
                        style={{
                          fontSize: '0.68rem',
                          color: statusInfo.textColor,
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          marginTop: '0.1rem'
                        }}
                      >
                        <span>●</span>
                        <span>{statusInfo.label}</span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight
                    size={15}
                    style={{
                      color: isSelected ? '#6B4699' : '#C4BDD0',
                      transform: isAr ? 'rotate(180deg)' : 'none',
                      flexShrink: 0
                    }}
                  />
                </>
              ) : (
                <div style={{ position: 'relative' }}>
                  <img
                    src={getAssetPath(pat.photoUrl || '/saud.jpg')}
                    alt={pat.name}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: isSelected ? '2px solid #6B4699' : '1px solid #E8E2D8'
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-1px',
                      right: '-1px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: statusInfo.dotColor,
                      border: '1.5px solid #FFFFFF'
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Botanical Watermark Illustration */}
      {!isCollapsed && (
        <div
          style={{
            padding: '1rem',
            borderTop: '1px solid var(--line)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(238, 248, 243, 0.4) 100%)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#6B7280'
          }}
        >
          <div style={{ fontSize: '1.2rem', opacity: 0.7 }}>🌿</div>
          <div style={{ fontSize: '0.68rem', fontStyle: 'italic', color: 'var(--ink-soft)' }}>
            {isAr ? 'رؤى أعمق لرعاية أكثر أماناً' : 'Better insights for safer care'}
          </div>
        </div>
      )}
      <style>{`
        .patient-queue-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-float) !important;
          background: #FFFFFF !important;
        }
      `}</style>
    </aside>
  );
};
