import React, { useState, useEffect } from 'react';
import './styles/design-system.css';
import { SYNTHETIC_PATIENTS } from './data/syntheticPatients';
import type { Patient } from './types/clinical';
import { DoctorAppHeader } from './components/DoctorAppHeader';
import { TodayPatientsList } from './components/TodayPatientsList';
import { MainConsultationColumn } from './components/MainConsultationColumn';
import { RightSidebar } from './components/RightSidebar';
import { PreOpSummaryModal } from './components/PreOpSummaryModal';
import { KnowledgeBaseModal } from './components/KnowledgeBaseModal';
import { ApiKeysModal } from './components/ApiKeysModal';
import SplashScreen from './components/SplashScreen';
import type { PatientMemoryMatchItem } from './services/clinicalAnalysisService';

export const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [fontScale, setFontScale] = useState<number>(1);
  const [patients, setPatients] = useState<Patient[]>(SYNTHETIC_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('pat-001');
  const [isQueueCollapsed, setIsQueueCollapsed] = useState<boolean>(false);
  const [isPreOpModalOpen, setIsPreOpModalOpen] = useState<boolean>(false);
  const [isKnowledgeBaseModalOpen, setIsKnowledgeBaseModalOpen] = useState<boolean>(false);
  const [isApiKeysModalOpen, setIsApiKeysModalOpen] = useState<boolean>(false);
  const [_patientMemoryMatches, setPatientMemoryMatches] = useState<PatientMemoryMatchItem[]>([]);

  const currentPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];
  const [transcript, setTranscript] = useState<string>('');

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontScale.toString());
  }, [fontScale]);

  const handleSelectPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return { ...p, visitStatus: 'In Progress', visitStatusAr: 'قيد المعاينة' };
        } else if (p.visitStatus === 'In Progress') {
          return {
            ...p,
            visitStatus: p.preOpSummary?.verifiedByClinician ? 'Completed' : 'Waiting',
            visitStatusAr: p.preOpSummary?.verifiedByClinician ? 'مكتمل' : 'بالانتظار'
          };
        }
        return p;
      })
    );
    setTranscript('');
    setPatientMemoryMatches([]);
  };

  const handleToggleLang = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar';
    setLang(newLang);
    setTranscript(newLang === 'ar' ? currentPatient.defaultTranscriptAr : currentPatient.defaultTranscript);
  };

  const handleApprovePreOp = (clinicianName: string, notes: string) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === currentPatient.id) {
          return {
            ...p,
            preOpSummary: {
              ...p.preOpSummary,
              verifiedByClinician: true,
              clinicianName,
              clinicianNotes: notes,
              approvalTimestamp: new Date().toLocaleString()
            }
          };
        }
        return p;
      })
    );
    setIsPreOpModalOpen(false);
  };

  const hasCriticalConflicts = currentPatient.medications.some((m) => m.mentionStatus === 'conflict' || m.conflictFlag);

  return (
    <div className="doctor-app-shell">
      <DoctorAppHeader
        theme={theme}
        onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
        fontScale={fontScale}
        onChangeFontScale={setFontScale}
        lang={lang}
        onToggleLang={handleToggleLang}
        onOpenPreOpModal={() => setIsPreOpModalOpen(true)}
        onOpenKnowledgeBase={() => setIsKnowledgeBaseModalOpen(true)}
        onOpenApiKeys={() => setIsApiKeysModalOpen(true)}
        hasCriticalConflicts={hasCriticalConflicts}
      />

      {/* 3-column workspace: Patients | Main | Right Sidebar */}
      <div className="workspace-3col">
        <TodayPatientsList
          patients={patients}
          selectedPatientId={selectedPatientId}
          onSelectPatient={handleSelectPatient}
          isCollapsed={isQueueCollapsed}
          onToggleCollapse={() => setIsQueueCollapsed(!isQueueCollapsed)}
          lang={lang}
        />

        <MainConsultationColumn
          patient={currentPatient}
          transcript={transcript}
          onChangeTranscript={setTranscript}
          onOpenReportModal={() => setIsPreOpModalOpen(true)}
          onOpenKnowledgeBase={() => setIsKnowledgeBaseModalOpen(true)}
          onUpdatePatientMemoryMatches={setPatientMemoryMatches}
          lang={lang}
        />

        <RightSidebar
          patient={currentPatient}
          lang={lang}
        />
      </div>

      <PreOpSummaryModal
        patient={currentPatient}
        isOpen={isPreOpModalOpen}
        onClose={() => setIsPreOpModalOpen(false)}
        onApprove={handleApprovePreOp}
        lang={lang}
      />

      <KnowledgeBaseModal
        isOpen={isKnowledgeBaseModalOpen}
        onClose={() => setIsKnowledgeBaseModalOpen(false)}
        lang={lang}
      />

      <ApiKeysModal
        isOpen={isApiKeysModalOpen}
        onClose={() => setIsApiKeysModalOpen(false)}
        lang={lang}
      />

      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
    </div>
  );
};

export default App;
