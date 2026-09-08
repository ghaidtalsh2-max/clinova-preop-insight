import React from 'react';
import {
  Mic,
  Database,
  HelpCircle,
  Brain,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Stethoscope,
  GitBranch,
  AlertCircle,
  FileText
} from 'lucide-react';

interface OfficialPresentationPosterProps {
  onBack?: () => void;
}

export const OfficialPresentationPoster: React.FC<OfficialPresentationPosterProps> = ({ onBack }) => {
  return (
    <div
      style={{
        background: '#FAF8F5',
        minHeight: '100vh',
        padding: '2.5rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: '#262135'
      }}
    >
      {/* Top Controls when viewed in web app */}
      {onBack && (
        <div style={{ width: '100%', maxWidth: '1120px', display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <button
            onClick={onBack}
            style={{
              background: '#2D2254',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.55rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            ← Back to Clinova Platform
          </button>
          <button
            onClick={() => window.print()}
            style={{
              background: '#0D8275',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.55rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            🖨️ Print / Save as PDF
          </button>
        </div>
      )}

      {/* ====================================================================
          POSTER CANVAS (1120px width, 100% English, Swiss Medical Design)
          ==================================================================== */}
      <div
        id="clinova-printable-poster"
        dir="ltr"
        style={{
          width: '100%',
          maxWidth: '1120px',
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '1.5px solid #EAE3D9',
          boxShadow: '0 14px 45px rgba(45, 34, 84, 0.09)',
          overflow: 'hidden',
          padding: '2.5rem 2.85rem',
          textAlign: 'left'
        }}
      >
        {/* ====================================================================
            1. TOP HEADER: OFFICIAL PARTNERS & HACKATHON TITLE (100% English)
            ==================================================================== */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid #F1EEF8',
            paddingBottom: '1.5rem',
            marginBottom: '1.75rem',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}
        >
          {/* Partner Logos */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src="/assets/taif_university_logo.png"
                alt="Taif University"
                style={{ height: '56px', width: 'auto', objectFit: 'contain' }}
              />
            </div>

            <div style={{ height: '36px', width: '1px', background: '#EAE3D9' }} />

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src="/assets/taif_health_cluster_logo.jpg"
                alt="Taif Health Cluster"
                style={{ height: '50px', width: 'auto', objectFit: 'contain' }}
              />
            </div>

            <div style={{ height: '36px', width: '1px', background: '#EAE3D9' }} />

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src="/assets/clinova_logo.jpg"
                alt="Clinova"
                style={{ height: '52px', width: 'auto', objectFit: 'contain' }}
              />
            </div>
          </div>

          {/* Hackathon Event Title */}
          <div style={{ textAlign: 'right' }}>
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#6D28D9',
                background: '#EDE9FE',
                padding: '0.2rem 0.65rem',
                borderRadius: '999px',
                display: 'inline-block',
                marginBottom: '0.35rem',
                letterSpacing: '0.04em'
              }}
            >
              TAIF HEALTH INNOVATION 2026
            </span>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#2D2254', lineHeight: 1.3 }}>
              Taif University Hackathon for AI & Health Innovation
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6E667E', fontWeight: 600 }}>
              Track: Clinical Decision Intelligence & Surgical Safety
            </div>
          </div>
        </div>

        {/* ====================================================================
            2. HERO: PROJECT TITLE & CORE VALUE SYNTHESIS
            ==================================================================== */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FAF8F5 0%, #F5F1FB 100%)',
            border: '1.5px solid #EAE3D9',
            borderRadius: '18px',
            padding: '1.75rem 2rem',
            marginBottom: '1.85rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.45rem' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0D8275', background: '#E0F7F6', border: '1px solid #BCEAE6', padding: '0.15rem 0.65rem', borderRadius: '999px' }}>
              TEAM CLINOVA
            </span>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#6D28D9', background: '#EDE9FE', padding: '0.15rem 0.65rem', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Sparkles size={12} color="#6D28D9" /> AI Clinical Reasoning Assistant
            </span>
          </div>

          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#2D2254', margin: '0 0 0.45rem 0', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            PreOp Insight <span style={{ color: '#0D8275' }}>— Ambient Clinical Reasoning Assistant</span>
          </h1>

          <div style={{ fontSize: '0.94rem', color: '#262135', lineHeight: 1.65, fontWeight: 400, marginTop: '0.5rem' }}>
            An intelligent clinical companion that listens to patient consultations, automatically extracts and structures clinical concepts, cross-references multi-source health records to detect diagnostic gaps and contradictions, and applies explainable clinical reasoning to guide physicians during pre-operative evaluation—<strong>while keeping final judgment and decision-making 100% in the hands of the practitioner.</strong>
          </div>
        </div>

        {/* ====================================================================
            3. HOW IT WORKS: 5-STAGE CLINICAL INTELLIGENCE PIPELINE
            ==================================================================== */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GitBranch size={19} color="#0D8275" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2D2254', margin: 0 }}>
                System Architecture & Clinical Pipeline
              </h2>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#6E667E', fontWeight: 600 }}>
              Continuous Ingestion → Reconciliation → Reasoning → Verification
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem' }}>
            {/* Step 1 */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #EAE3D9',
                borderRadius: '14px',
                padding: '1.15rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 8px rgba(45, 34, 84, 0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#FDF0EE', color: '#E85B48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mic size={17} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#E85B48', background: '#FDF0EE', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                  01. INGEST
                </span>
              </div>
              <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#2D2254', margin: '0 0 0.35rem 0' }}>
                Ambient Dialogue Structuring
              </h3>
              <p style={{ fontSize: '0.76rem', color: '#6E667E', margin: 0, lineHeight: 1.5 }}>
                Passively captures doctor-patient conversation and maps unstructured natural speech into standardized clinical entities and symptoms.
              </p>
            </div>

            {/* Step 2 */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #EAE3D9',
                borderRadius: '14px',
                padding: '1.15rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 8px rgba(45, 34, 84, 0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#E0F7F6', color: '#0D8275', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Database size={17} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0D8275', background: '#E0F7F6', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                  02. RECONCILE
                </span>
              </div>
              <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#2D2254', margin: '0 0 0.35rem 0' }}>
                Multi-Source EHR Alignment
              </h3>
              <p style={{ fontSize: '0.76rem', color: '#6E667E', margin: 0, lineHeight: 1.5 }}>
                Cross-references real-time consultation intake with longitudinal medical records, dispensed pharmacy histories, and previous lab panels.
              </p>
            </div>

            {/* Step 3 */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #EAE3D9',
                borderRadius: '14px',
                padding: '1.15rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 8px rgba(45, 34, 84, 0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#FEF8EC', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertCircle size={17} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#D97706', background: '#FEF8EC', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                  03. DETECT
                </span>
              </div>
              <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#2D2254', margin: '0 0 0.35rem 0' }}>
                Gap & Conflict Flagging
              </h3>
              <p style={{ fontSize: '0.76rem', color: '#6E667E', margin: 0, lineHeight: 1.5 }}>
                Surfaces undisclosed medications, missing surgical histories, or direct contradictions between verbal statements and recorded charts.
              </p>
            </div>

            {/* Step 4 */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #EAE3D9',
                borderRadius: '14px',
                padding: '1.15rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 8px rgba(45, 34, 84, 0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#EDE9FE', color: '#6D28D9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <HelpCircle size={17} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#6D28D9', background: '#EDE9FE', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                  04. CLARIFY
                </span>
              </div>
              <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#2D2254', margin: '0 0 0.35rem 0' }}>
                Adaptive Clarification Prompts
              </h3>
              <p style={{ fontSize: '0.76rem', color: '#6E667E', margin: 0, lineHeight: 1.5 }}>
                Generates precise, context-aware inquiry prompts in real time to help the clinician confirm critical pre-op details without disruption.
              </p>
            </div>

            {/* Step 5 */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #EAE3D9',
                borderRadius: '14px',
                padding: '1.15rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 8px rgba(45, 34, 84, 0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#D1FAE5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Brain size={17} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#059669', background: '#D1FAE5', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                  05. REASON
                </span>
              </div>
              <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#2D2254', margin: '0 0 0.35rem 0' }}>
                Explainable Clinical Reasoning
              </h3>
              <p style={{ fontSize: '0.76rem', color: '#6E667E', margin: 0, lineHeight: 1.5 }}>
                Computes explainable differential risk models and synthesis notes, empowering the practitioner to make informed final clearances.
              </p>
            </div>
          </div>
        </div>

        {/* ====================================================================
            4. CLINICAL IN-ACTION DEMONSTRATION (Real-World Case Flow)
            ==================================================================== */}
        <div
          style={{
            background: '#FAF8F5',
            border: '1.5px solid #EAE3D9',
            borderRadius: '16px',
            padding: '1.35rem 1.65rem',
            marginBottom: '1.85rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Stethoscope size={18} color="#2D2254" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#2D2254', margin: 0 }}>
                Clinical Reasoning In Action: High-Risk Surgical Evaluation Scenario
              </h3>
            </div>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#0D8275', background: '#E0F7F6', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
              Live Clinical Case Flow
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', alignItems: 'center', gap: '0.75rem' }}>
            {/* Box 1: Verbal Input */}
            <div style={{ background: '#FFFFFF', padding: '0.9rem', borderRadius: '12px', border: '1px solid #EAE3D9' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#E85B48', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                1. Patient Mentions
              </div>
              <div style={{ fontSize: '0.8rem', color: '#262135', fontStyle: 'italic', lineHeight: 1.4 }}>
                "I take a small blood thinner pill and some herbal garlic capsules for my circulation..."
              </div>
            </div>

            <ArrowRight size={18} color="#A29BAE" />

            {/* Box 2: Automated Gap Detection & Clarification */}
            <div style={{ background: '#FFFFFF', padding: '0.9rem', borderRadius: '12px', border: '1.5px solid #DCD5ED' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#6D28D9', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                2. AI Identifies Gap & Prompts
              </div>
              <div style={{ fontSize: '0.78rem', color: '#262135', lineHeight: 1.4 }}>
                <strong>Flag:</strong> Unrecorded Warfarin + Garlic synergism increases intraoperative bleeding risk.
                <div style={{ fontSize: '0.72rem', color: '#6D28D9', marginTop: '0.25rem', fontWeight: 600 }}>
                  Prompt: "Confirm exact hour of last dose and order immediate PT/INR."
                </div>
              </div>
            </div>

            <ArrowRight size={18} color="#A29BAE" />

            {/* Box 3: Clinician Verified Decision */}
            <div style={{ background: '#FFFFFF', padding: '0.9rem', borderRadius: '12px', border: '1px solid #C4E9E2' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0D8275', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                3. Clinician Final Clearance
              </div>
              <div style={{ fontSize: '0.78rem', color: '#262135', lineHeight: 1.4 }}>
                Physician verifies INR profile, schedules 48-hour anticoagulant bridge protocol, and signs certified pre-op clearance report.
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================================
            5. CORE DESIGN PILLARS (Synthesized Medical Excellence)
            ==================================================================== */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.75rem' }}>
          {/* Pillar 1 */}
          <div style={{ background: '#FFFFFF', border: '1.5px solid #EAE3D9', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#E0F7F6', color: '#0D8275', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={18} />
              </div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#2D2254', margin: 0 }}>
                Proactive Patient Safety
              </h4>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#6E667E', margin: 0, lineHeight: 1.55 }}>
              Prevents overlooked comorbidities, dangerous cross-facility drug interactions, and unverified allergies before patients reach the operating room.
            </p>
          </div>

          {/* Pillar 2 */}
          <div style={{ background: '#FFFFFF', border: '1.5px solid #EAE3D9', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#EDE9FE', color: '#6D28D9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={18} />
              </div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#2D2254', margin: 0 }}>
                Unified Clinical Context
              </h4>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#6E667E', margin: 0, lineHeight: 1.55 }}>
              Aggregates fragmented multi-source records into an intuitive, chronological pre-operative timeline, saving clinician cognitive bandwidth.
            </p>
          </div>

          {/* Pillar 3 */}
          <div style={{ background: '#FFFFFF', border: '1.5px solid #EAE3D9', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FEF8EC', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={18} />
              </div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#2D2254', margin: 0 }}>
                Augmented Clinical Clarity
              </h4>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#6E667E', margin: 0, lineHeight: 1.55 }}>
              Equips surgeons and anesthesiologists with transparent diagnostic reasoning and risk calculations while keeping clinical control strictly human-led.
            </p>
          </div>
        </div>

        {/* ====================================================================
            6. CLINICAL GOVERNANCE, ETHICS & BASE KNOWLEDGE REFERENCES
            ==================================================================== */}
        <div
          style={{
            background: '#FAF8F5',
            border: '1.5px solid #EAE3D9',
            borderRadius: '16px',
            padding: '1.25rem 1.4rem',
            marginBottom: '1.5rem'
          }}
        >
          {/* Top Banner: WHO Ethics & Human-in-the-Loop */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              paddingBottom: '0.9rem',
              borderBottom: '1px solid #EAE3D9',
              marginBottom: '0.9rem'
            }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#FEF8EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={20} color="#D97706" />
            </div>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#2D2254' }}>
                AI Ethics & Clinical Governance: Built on WHO Guidance (2021)
              </div>
              <div style={{ fontSize: '0.76rem', color: '#6E667E', lineHeight: 1.4 }}>
                Clinova strictly adheres to WHO consensus principles on Health AI: Protecting Clinician Autonomy, Continuous Human Warranty, Algorithm Explainability, and Transparent Clinical Oversight.
              </div>
            </div>
          </div>

          {/* 8 Verified Knowledge Base Sources */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2D2254', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.6rem' }}>
              Base Knowledge & Evidence-Based Clinical Sources:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.6rem' }}>
              {[
                { tag: 'MOH Saudi 🇸🇦', title: 'MOH Clinical Protocols', desc: 'National Saudi practice pathways' },
                { tag: 'Weqaya / PHA', title: 'Public Health Authority', desc: 'Chronic risk & epidemiology' },
                { tag: 'WHO Guidance', title: 'Ethics of AI in Health', desc: 'WHO 2021 Governance Charter' },
                { tag: 'WHO ICD-11', title: 'Diagnostic Ontologies', desc: 'NPHIES/EHR clinical mapping' },
                { tag: 'U.S. FDA Drugs', title: 'FDA Safety & Warnings', desc: 'Drug interactions & contraindications' },
                { tag: 'NICE UK 🇬🇧', title: 'NICE Clinical Guidelines', desc: 'Evidence-based differential logic' },
                { tag: 'MedlinePlus', title: 'NLM / NIH Knowledge', desc: 'Diagnostic & lab etiologies' },
                { tag: 'openFDA / JSON', title: 'Open REST APIs & FHIR', desc: 'Adverse events & data schema' }
              ].map((src) => (
                <div
                  key={src.title}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #EAE3D9',
                    borderRadius: '8px',
                    padding: '0.55rem 0.65rem'
                  }}
                >
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#6D28D9', marginBottom: '0.15rem' }}>
                    {src.tag}
                  </div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#2D2254', lineHeight: 1.2 }}>
                    {src.title}
                  </div>
                  <div style={{ fontSize: '0.66rem', color: '#6E667E', marginTop: '0.15rem', lineHeight: 1.25 }}>
                    {src.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ====================================================================
            7. FOOTER (Single Clean Attribution - No Duplicate Logos)
            ==================================================================== */}
        <div
          style={{
            borderTop: '1px solid #EAE3D9',
            paddingTop: '1.15rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.78rem',
            color: '#6E667E'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 800, color: '#2D2254' }}>Clinova: PreOp Insight</span>
            <span>•</span>
            <span>Taif University Hackathon for AI & Health Innovation 2026</span>
          </div>

          <div style={{ fontStyle: 'italic', color: '#0D8275', fontWeight: 600 }}>
            "From Taif... Towards Safer, Smarter Healthcare"
          </div>
        </div>
      </div>
    </div>
  );
};
