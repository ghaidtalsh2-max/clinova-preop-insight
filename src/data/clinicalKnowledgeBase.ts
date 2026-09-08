export interface ClinicalReference {
  id: string;
  category: 'national_saudi' | 'global_clinical' | 'drug_safety' | 'ethical_governance' | 'standards_apis';
  titleAr: string;
  titleEn: string;
  organizationAr: string;
  organizationEn: string;
  url: string;
  roleInClinovaAr: string;
  roleInClinovaEn: string;
  badge: string;
  citationTag: string;
}

export const CLINOVA_KNOWLEDGE_BASE: ClinicalReference[] = [
  {
    id: 'ref-moh-protocols',
    category: 'national_saudi',
    titleAr: 'الأدلة السريرية والبروتوكولات الوطنية المعتمدة',
    titleEn: 'MOH Saudi National Clinical Practice Protocols',
    organizationAr: 'وزارة الصحة بالمملكة العربية السعودية',
    organizationEn: 'Ministry of Health (MOH) — Kingdom of Saudi Arabia',
    url: 'https://www.moh.gov.sa/en/ministry/mediacenter/publications/pages/protocols.aspx',
    roleInClinovaAr: 'المرجع الوطني الإلزامي لمطابقة مسارات العلاج والتشخيص والبروتوكولات السريرية المعتمدة في المستشفيات السعودية.',
    roleInClinovaEn: 'Mandatory national baseline for diagnostic pathways, clinical pathways, and therapeutic protocols across Saudi healthcare facilities.',
    badge: 'MOH Saudi 🇸🇦',
    citationTag: 'MOH-SA-PROTOCOLS'
  },
  {
    id: 'ref-pha-risk',
    category: 'national_saudi',
    titleAr: 'دليل عوامل الخطورة والأمراض المزمنة والصحة العامة',
    titleEn: 'Public Health Risk Factors & Chronic Disease Guidelines',
    organizationAr: 'هيئة الصحة العامة (وقاية)',
    organizationEn: 'Public Health Authority (Weqaya / PHA)',
    url: 'https://www.pha.gov.sa/ar-sa/Healthportal/Pages/RiskFactor.aspx',
    roleInClinovaAr: 'تقييم مخاطر الأمراض المزمنة (السكري، الضغط، التدخين) وتوجيه التدخلات الوقائية المخصصة للمجتمع السعودي.',
    roleInClinovaEn: 'Stratifying cardiovascular & chronic metabolic risk factors, guiding tailored preventative interventions for the Saudi population.',
    badge: 'Weqaya / وقاية',
    citationTag: 'PHA-WEQAYA-2024'
  },
  {
    id: 'ref-who-ethics-ai',
    category: 'ethical_governance',
    titleAr: 'أخلاقيات وحوكمة الذكاء الاصطناعي في الصحة — إرشادات منظمة الصحة العالمية',
    titleEn: 'Ethics and Governance of Artificial Intelligence for Health (WHO Guidance)',
    organizationAr: 'منظمة الصحة العالمية',
    organizationEn: 'World Health Organization (WHO)',
    url: 'https://www.who.int/publications/i/item/9789240029200',
    roleInClinovaAr: 'الأساس الحاكم لحوكمة الذكاء الاصطناعي في Clinova: حماية استقلالية الطبيب (Human Autonomy)، الضمانة السريرية البشرية (Human Warranty)، الشفافية وقابلية التفسير (Explainability)، ومنع التحيز.',
    roleInClinovaEn: 'The core AI ethics charter governing Clinova: protecting clinician autonomy, human-in-the-loop warranty, algorithmic explainability, and bias mitigation.',
    badge: 'WHO Ethics 2021 ⚖️',
    citationTag: 'WHO-AI-ETHICS-2021'
  },
  {
    id: 'ref-who-icd',
    category: 'standards_apis',
    titleAr: 'التصنيف الدولي للأمراض والمشاكل الصحية المتعلقة بها (ICD-10 / ICD-11)',
    titleEn: 'WHO International Classification of Diseases (ICD-10 / ICD-11)',
    organizationAr: 'منظمة الصحة العالمية',
    organizationEn: 'World Health Organization (WHO)',
    url: 'https://icd.who.int/en/',
    roleInClinovaAr: 'الترميز السريري المعياري لجميع التشاخيص والأمراض لضمان التوافق مع منصة نفيس (NPHIES) والملفات الطبية الإلكترونية.',
    roleInClinovaEn: 'Standard diagnostic coding ontology mapping clinical differentials to NPHIES and universal EHR schemas.',
    badge: 'WHO ICD-11 🌐',
    citationTag: 'WHO-ICD-11'
  },
  {
    id: 'ref-fda-drugs',
    category: 'drug_safety',
    titleAr: 'قاعدة بيانات ومعلومات الأدوية والتحذيرات السريرية (FDA Drugs)',
    titleEn: 'FDA Drugs Database & Clinical Safety Information',
    organizationAr: 'إدارة الغذاء والدواء الأمريكية (U.S. FDA)',
    organizationEn: 'U.S. Food and Drug Administration (FDA)',
    url: 'https://www.fda.gov/drugs',
    roleInClinovaAr: 'الكشف عن التعارضات الدوائية الخطرة، محاذير الاستخدام، والجرعات المعتمدة وموانع الجراحة.',
    roleInClinovaEn: 'Real-time drug-drug interaction detection, black box warnings, dosing benchmarks, and surgical contraindications.',
    badge: 'FDA Drugs 💊',
    citationTag: 'US-FDA-DRUGS'
  },
  {
    id: 'ref-nice-guidance',
    category: 'global_clinical',
    titleAr: 'إرشادات التميز السريري والرعاية الصحية المسندة بالبراهين',
    titleEn: 'NICE Clinical Guidelines & Evidence Summaries',
    organizationAr: 'المعهد الوطني للتميز في الرعاية الصحية (المملكة المتحدة)',
    organizationEn: 'National Institute for Health and Care Excellence (NICE UK)',
    url: 'https://www.nice.org.uk/guidance',
    roleInClinovaAr: 'توفير البراهين السريرية لتسلسل الأسئلة التفريقية (Discriminating Questions) وترجيح الاحتمالات التشخيصية.',
    roleInClinovaEn: 'Evidence-based criteria for discriminating question logic, diagnostic threshold weights, and pre-op clearance criteria.',
    badge: 'NICE UK 🇬🇧',
    citationTag: 'NICE-GUIDELINES'
  },
  {
    id: 'ref-medline-plus',
    category: 'global_clinical',
    titleAr: 'المكتبة الوطنية للطب — قاعدة المعارف والأبحاث السريرية (MedlinePlus)',
    titleEn: 'MedlinePlus — National Library of Medicine (NLM / NIH)',
    organizationAr: 'المعاهد الوطنية الأمريكية للصحة (NIH)',
    organizationEn: 'National Institutes of Health (NIH) / NLM',
    url: 'https://medlineplus.gov',
    roleInClinovaAr: 'قاعدة معارف سريرية شاملة للأعراض، التحاليل المخبرية، والأمراض التداخلية لتثقيف المريض وتوجيه الفحص السريري.',
    roleInClinovaEn: 'Comprehensive clinical knowledge base for symptom etiology, lab interpretation, and patient-centered diagnostic education.',
    badge: 'MedlinePlus 📚',
    citationTag: 'NIH-MEDLINEPLUS'
  },
  {
    id: 'ref-openfda-json',
    category: 'standards_apis',
    titleAr: 'واجهات برمجة التطبيقات المفتوحة والمعايير الهيكلية (OpenFDA API & JSON Standards)',
    titleEn: 'openFDA APIs & Standard Structured Data Schemas (JSON.org / openFDA)',
    organizationAr: 'openFDA & JSON Standard Organization',
    organizationEn: 'openFDA API Project & JSON Standard Working Group',
    url: 'https://api.fda.gov/animalandveterinary/event.json',
    roleInClinovaAr: 'المعمارية البرمجية لتبادل الأحداث والتقارير الطبية وهيكلة البيانات المعيارية وتوافق FHIR/JSON.',
    roleInClinovaEn: 'Open API querying for adverse events, pharmacovigilance surveillance, and standardized JSON/FHIR clinical interoperability.',
    badge: 'openFDA / JSON ⚙️',
    citationTag: 'OPENFDA-REST-API'
  }
];
