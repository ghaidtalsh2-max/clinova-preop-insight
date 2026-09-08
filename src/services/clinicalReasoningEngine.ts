import type { Patient, ExtractedEntity, ConflictItem, MissingGap, DynamicQuestion, ClinicalPossibility } from '../types/clinical';

export interface AnalysisResult {
  extractedEntities: ExtractedEntity[];
  conflicts: ConflictItem[];
  missingGaps: MissingGap[];
  dynamicQuestions: DynamicQuestion[];
  initialDifferentials: ClinicalPossibility[];
  isNarrowGap: boolean;
  weightedDefinitiveDiagnosis: ClinicalPossibility;
  ruledOutDiagnosis: ClinicalPossibility | null;
  summaryInsights: {
    en: string;
    ar: string;
  };
}

export function analyzePatientConversation(
  patient: Patient,
  _transcript: string,
  selectedDiscriminatingOptionId?: string
): AnalysisResult {
  // =========================================================================
  // PATIENT 1: خالد محمد العتيبي (KHALID AL-OTAIBI) - PAT-001
  // Scenario: Unmentioned Penicillin Allergy + Blood Thinner Match
  // =========================================================================
  if (patient.id === 'pat-001') {
    const isOption1Selected = selectedDiscriminatingOptionId === 'opt-1' || !selectedDiscriminatingOptionId;

    const extractedEntities: ExtractedEntity[] = [
      {
        id: 'ent-k1',
        text: 'Hypertension (10 years)',
        textAr: 'فرط ضغط الدم المزمن (منذ 10 سنوات)',
        category: 'condition',
        confidence: 0.99,
        status: 'verified'
      },
      {
        id: 'ent-k2',
        text: 'Unspecified Blood Thinner Pill',
        textAr: 'حبوب سيولة غير محددة الاسم أو الجرعة',
        category: 'medication',
        confidence: 0.97,
        status: 'conflicting'
      },
      {
        id: 'ent-k3',
        text: 'Verbal Denial of Medication Allergy',
        textAr: 'نفي شفهي لوجود حساسية دوائية ("لا حسب علمي ما عندي")',
        category: 'risk',
        confidence: 0.99,
        status: 'conflicting'
      },
      {
        id: 'ent-k4',
        text: 'Postural Dizziness (3 weeks)',
        textAr: 'دوخة عند القيام والوقوف (منذ 3 أسابيع)',
        category: 'symptom',
        confidence: 0.94,
        status: 'unconfirmed'
      },
      {
        id: 'ent-k5',
        text: 'Prior Surgery under Anesthesia',
        textAr: 'عملية جراحية سابقة قبل سنوات',
        category: 'condition',
        confidence: 0.95,
        status: 'verified'
      }
    ];

    const conflicts: ConflictItem[] = [
      {
        id: 'conf-k1',
        type: 'preop_risk',
        severity: 'high',
        title: 'Allergy discrepancy',
        titleAr: 'تعارض في تسجيل الحساسية (Allergy discrepancy)',
        description: 'Patient reports no known allergies, while an existing record documents Penicillin allergy. Clinician verification required.',
        descriptionAr: 'المريض أفاد بعدم وجود أي حساسية، بينما السجل الطبي يحتوي على حساسية سابقة وموثقة من Penicillin. يلزم التحقق السريري من الطبيب.',
        affectedSectors: ['NGHA', 'MOH'],
        medicationsInvolved: ['Penicillin'],
        recommendedAction: 'Verify allergy history directly with patient and document specific symptoms (rash, bronchospasm).',
        recommendedActionAr: 'التحقق المباشر من تفاصيل الحساسية وتوثيق الأعراض الدقيقة (طفح جلدي، ضيق تنفس) وتجنب مشتقات البيتا لاكتام.',
        status: 'open'
      },
      {
        id: 'conf-k2',
        type: 'unidentified_drug',
        severity: 'medium',
        title: 'Possible medication match found: Apixaban 5 mg',
        titleAr: 'تطابق دوائي محتمل: Apixaban 5 mg',
        description: 'Patient’s verbal description has not been confirmed to match this medication. Clinician verification required.',
        descriptionAr: 'الوصف الشفهي للمريض لم يتم تأكيد تطابقه مع هذا الدواء بعد. وجد النظام تطابقاً محتملاً فقط، ويلزم التحقق السريري لتجنب مخاطر النزيف.',
        affectedSectors: ['NGHA'],
        medicationsInvolved: ['Apixaban 5 mg'],
        recommendedAction: 'Confirm exact medication name and last taken dose with pharmacy or Sahaty app before surgery.',
        recommendedActionAr: 'تأكيد اسم الدواء وتوقيت آخر جرعة مع الصيدلية أو تطبيق صحتي لجدولة إيقافه قبل الجراحة.',
        status: 'open'
      },
      {
        id: 'conf-k3',
        type: 'preop_risk',
        severity: 'low',
        title: 'Anesthesia History: Uncertain / Not Assessed',
        titleAr: 'تاريخ التخدير: غير مؤكد / لم يتم التقييم بدقة',
        description: 'Patient recalled surgery years ago but is uncertain about anesthesia complications. Status: Uncertain / Not Assessed. Clinician verification required without assuming complications.',
        descriptionAr: 'المريض ذكر إجراء جراحة قبل سنوات لكنه غير متأكد من حدوث مضاعفات مع التخدير. الحالة: غير مؤكد (Uncertain / Not Assessed). يلزم التحقق السريري دون اختلاق تشخيص غير مؤكد.',
        affectedSectors: ['MOH'],
        medicationsInvolved: ['General Anesthesia'],
        recommendedAction: 'Review past surgical records or request pre-anesthesia clarification.',
        recommendedActionAr: 'مراجعة سجلات الجراحة السابقة أو طلب استيضاح تخديري إضافي.',
        status: 'open'
      }
    ];

    const missingGaps: MissingGap[] = [
      {
        id: 'gap-k1',
        category: 'medication_clarification',
        question: 'Has the patient ever experienced swelling, rash, or shortness of breath after penicillin?',
        questionAr: 'هل سبق أن ظهرت عليك أعراض مثل طفح جلدي أو ضيق تنفس بعد استخدام البنسلين؟',
        clinicalReason: 'Resolves verbal vs electronic allergy discrepancy.',
        clinicalReasonAr: 'حل التعارض بين النفي الشفهي والسجل الإلكتروني.',
        resolved: true,
        answer: 'Confirmed prior dental penicillin allergic reaction in 2019.'
      }
    ];

    const initialDifferentials: ClinicalPossibility[] = [
      {
        id: 'pos-k1',
        condition: 'Severe Beta-Lactam / Penicillin Hypersensitivity Risk',
        conditionAr: 'خطورة صدمة تحسسية تجاه مشتقات البنسلين (Penicillin Allergy)',
        probability: 'high',
        confidencePercent: 94,
        extractedSymptoms: 'Prior documented severe urticaria and bronchospasm post amoxicillin in 2019.',
        extractedSymptomsAr: 'توثيق سابق لطفح جلدي وتشنج قصبي حاد عقب تناول أموكسيسيلين في 2019.',
        inferredCauses: 'IgE-mediated beta-lactam hypersensitivity cross-matched with NGHA 2019 record.',
        inferredCausesAr: 'تحسس مناعي وسريري تجاه البنسلين ومطابق مع سجل الحرس الوطني 2019.',
        evidenceLinks: [
          { type: 'medication', text: 'EHR documented penicillin anaphylaxis on 2019-06-20', textAr: 'سجل الحرس يوثق حساسية بنسلين 2019' },
          { type: 'symptom', text: 'Patient recalled dental antibiotic severe reaction upon clinical probing', textAr: 'تأكيد المريض حدوث طفح وضيق نفس سابقاً' }
        ]
      },
      {
        id: 'pos-k2',
        condition: 'Orthostatic Hypotension secondary to Amlodipine 10mg',
        conditionAr: 'هبوط ضغط دم انتصابي خفيف ناجم عن أملوديبين 10 ملجم',
        probability: 'moderate',
        confidencePercent: 78,
        extractedSymptoms: 'Dizziness upon standing for 3 weeks without syncope.',
        extractedSymptomsAr: 'دوخة عند القيام والوقوف منذ 3 أسابيع دون حدوث إغماء.',
        inferredCauses: 'Arterial vasodilation from dihydropyridine calcium channel blocker.',
        inferredCausesAr: 'توسع وعائي شرياني محيطي بسبب دواء أملوديبين 10 ملجم.',
        evidenceLinks: [
          { type: 'medication', text: 'Active Amlodipine 10mg daily prescription (MOH)', textAr: 'وصفة أملوديبين 10 ملجم من وزارة الصحة' },
          { type: 'symptom', text: 'Elevated sitting BP 148/92 mmHg with postural drop', textAr: 'ضغط جلوس 148/92 مع هبوط انتصابي' }
        ]
      }
    ];

    return {
      extractedEntities,
      conflicts,
      missingGaps,
      dynamicQuestions: [],
      initialDifferentials,
      isNarrowGap: false,
      weightedDefinitiveDiagnosis: isOption1Selected ? initialDifferentials[0] : initialDifferentials[1],
      ruledOutDiagnosis: isOption1Selected ? null : initialDifferentials[0],
      summaryInsights: {
        en: 'Detected critical contradiction: Patient verbally denied allergies while EHR confirms severe Penicillin reaction. Beta-lactam antibiotic prophylaxis must be substituted.',
        ar: 'رصد تعارض حرج: المريض نفى الحساسية شفهياً بينما السجل يوثق حساسية بنسلين شديدة. تم حظر البنسلين واستبداله ببديل آمن للجراحة.'
      }
    };
  }

  // =========================================================================
  // PATIENT 2: نورة أحمد الحربي (NOURA AL-HARBI) - PAT-002
  // Scenario: Test 27 / High PONV Risk + Family Anesthesia History
  // =========================================================================
  if (patient.id === 'pat-002') {
    const isOption1Selected = selectedDiscriminatingOptionId === 'opt-1' || !selectedDiscriminatingOptionId;

    const extractedEntities: ExtractedEntity[] = [
      {
        id: 'ent-n1',
        text: 'Prior Appendectomy with Severe Vomiting',
        textAr: 'استئصال زائدة سابق مع قيء حاد بعد التخدير (PONV)',
        category: 'symptom',
        confidence: 0.98,
        status: 'verified'
      },
      {
        id: 'ent-n2',
        text: 'Family History: Sister Severe Anesthesia Sickness',
        textAr: 'تاريخ عائلي: معاناة الأخت الشديدة مع التخدير والعمليات',
        category: 'risk',
        confidence: 0.95,
        status: 'verified'
      },
      {
        id: 'ent-n3',
        text: 'No Known Medication Allergies',
        textAr: 'لا توجد حساسية دوائية معروفة (NKDA)',
        category: 'condition',
        confidence: 0.99,
        status: 'verified'
      }
    ];

    const conflicts: ConflictItem[] = [
      {
        id: 'conf-n1',
        type: 'preop_risk',
        severity: 'medium',
        title: 'High Risk for Postoperative Nausea & Vomiting (Apfel Score 3)',
        titleAr: 'خطورة مرتفعة للغثيان والقيء بعد التخدير (مقياس أبفل: 3/4)',
        description: 'Patient exhibits female gender, non-smoker status, and previous history of severe PONV.',
        descriptionAr: 'المريضة أنثى، غير مدخنة، ولديها تاريخ سابق للقيء التخديري الحاد.',
        affectedSectors: ['MOH'],
        medicationsInvolved: ['Ondansetron 4mg', 'Dexamethasone 4mg', 'Propofol TIVA'],
        recommendedAction: 'Implement dual anti-emetic prophylaxis and Total Intravenous Anesthesia (TIVA).',
        recommendedActionAr: 'تطبيق البروتوكول الوقائي المزدوج واستخدام التخدير الوريدي الكامل TIVA.',
        status: 'resolved'
      }
    ];

    const missingGaps: MissingGap[] = [
      {
        id: 'gap-n1',
        category: 'surgical_history',
        question: 'Did the sister experience Malignant Hyperthermia symptoms (high fever, rigidity)?',
        questionAr: 'هل عانت الأخت من أعراض فرط الحرارة الخبيث (حرارة شديدة، تيبس عضلي)؟',
        clinicalReason: 'Rules out hereditary ryanodine receptor genetic risk.',
        clinicalReasonAr: 'استبعاد خطر متلازمة فرط الحرارة الخبيث الوراثية.',
        resolved: true,
        answer: 'No, confirmed simple severe PONV, no ICU admission.'
      }
    ];

    const initialDifferentials: ClinicalPossibility[] = [
      {
        id: 'pos-n1',
        condition: 'High-Risk Postoperative Nausea & Vomiting (PONV Apfel 3)',
        conditionAr: 'قابلية عالية للغثيان والقيء التخديري (Apfel Score 3)',
        probability: 'high',
        confidencePercent: 88,
        extractedSymptoms: 'Past history of severe emesis post appendectomy + female non-smoker.',
        extractedSymptomsAr: 'تاريخ سابق لقيء شديد بعد استئصال الزائدة + أنثى غير مدخنة.',
        inferredCauses: 'Multifactorial susceptibility (Female, non-smoker, prior post-op vomiting).',
        inferredCausesAr: 'عوامل خطورة ثلاثية (أنثى، غير مدخنة، قيء تخديري سابق).',
        evidenceLinks: [
          { type: 'timeline', text: 'Previous prolonged PACU stay for nausea in 2016', textAr: 'ملاحظة مطولة في الإفاقة عام 2016' },
          { type: 'symptom', text: 'Family history of anesthesia-induced emesis in sister', textAr: 'تاريخ عائلي لقيء التخدير لدى الأخت' }
        ]
      }
    ];

    return {
      extractedEntities,
      conflicts,
      missingGaps,
      dynamicQuestions: [],
      initialDifferentials,
      isNarrowGap: false,
      weightedDefinitiveDiagnosis: isOption1Selected ? initialDifferentials[0] : initialDifferentials[0],
      ruledOutDiagnosis: null,
      summaryInsights: {
        en: 'Patient is at high risk for PONV (Apfel Score 3). Ruled out Malignant Hyperthermia. Dual antiemetic prophylaxis and TIVA recommended.',
        ar: 'المريضة معرضة بنسبة عالية للغثيان التخديري (درجة 3). تم استبعاد فرط الحرارة الخبيث، ويوصى ببروتوكول الوقاية المزدوج والتخدير الوريدي.'
      }
    };
  }

  // =========================================================================
  // PATIENT 3: فهد عبدالله الغامدي (FAHAD AL-GHAMDI) - PAT-003
  // Scenario: Test 28 / Hidden OTC NSAIDs with CKD Stage 2 & Bleeding Ulcer
  // =========================================================================
  if (patient.id === 'pat-003') {
    const extractedEntities: ExtractedEntity[] = [
      {
        id: 'ent-f1',
        text: 'Frequent OTC Analgesic Intake (Ibuprofen 400mg)',
        textAr: 'تناول متكرر لمسكنات الصيدلية اللاوصفية (بروفين 3-4 مرات أسبوعياً)',
        category: 'medication',
        confidence: 0.98,
        status: 'conflicting'
      },
      {
        id: 'ent-f2',
        text: 'Chronic Kidney Disease Stage 2 (eGFR 52)',
        textAr: 'قصور كلوي مزمن الدرجة الثانية (تصفية 52)',
        category: 'condition',
        confidence: 0.99,
        status: 'verified'
      },
      {
        id: 'ent-f3',
        text: 'Prior Upper GI Bleeding Ulcer',
        textAr: 'تاريخ سابق لنزيف قرحة معدية استدعى نقل دم',
        category: 'risk',
        confidence: 0.97,
        status: 'verified'
      }
    ];

    const conflicts: ConflictItem[] = [
      {
        id: 'conf-f1',
        type: 'preop_risk',
        severity: 'high',
        title: 'Contraindicated NSAID Use in CKD & Bleeding Ulcer History',
        titleAr: 'تناول مسكنات لاسترودية محظورة مع القصور الكلوي وقرحة المعدة',
        description: 'Patient frequently consumes OTC Ibuprofen for knee pain. Directly conflicts with documented CKD Stage 2 and prior bleeding ulcer.',
        descriptionAr: 'تناول مسكنات البروفين دون وصفة يتعارض بشدة مع القصور الكلوي وتاريخ نزيف القرحة المعدية.',
        affectedSectors: ['PRIVATE', 'NGHA'],
        medicationsInvolved: ['OTC Ibuprofen', 'Lisinopril 10mg'],
        recommendedAction: 'Discontinue NSAIDs immediately; switch to Paracetamol 1g and topical analgesia.',
        recommendedActionAr: 'إيقاف البروفين فوراً واستبداله بالباراسيتامول الآمن كلوياً ومعدياً.',
        status: 'resolved'
      }
    ];

    const initialDifferentials: ClinicalPossibility[] = [
      {
        id: 'pos-f1',
        condition: 'High Risk for Acute Kidney Injury & Perioperative Bleeding',
        conditionAr: 'خطورة اعتلال كلوي حاد ونزيف هضمي ناجم عن مسكنات البروفين',
        probability: 'high',
        confidencePercent: 92,
        extractedSymptoms: 'OTC NSAID intake 3-4x weekly including day of consultation.',
        extractedSymptomsAr: 'تناول مسكنات البروفين 3-4 مرات أسبوعياً حتى صباح اليوم.',
        inferredCauses: 'Inhibition of renal prostaglandins and gastric mucosal protection by NSAIDs.',
        inferredCausesAr: 'تثبيط البروستاغلاندين الكلوي وحماية الغشاء المخاطي للمعدة بفعل البروفين.',
        evidenceLinks: [
          { type: 'timeline', text: 'Serum Creatinine 1.45 mg/dL (eGFR 52 mL/min)', textAr: 'الكرياتينين 1.45 وتصفية الكلى 52' },
          { type: 'timeline', text: 'History of endoscopic hemostasis for bleeding peptic ulcer in 2022', textAr: 'قرحة نازفة تم حقنها بالمنظار 2022' }
        ]
      }
    ];

    return {
      extractedEntities,
      conflicts,
      missingGaps: [],
      dynamicQuestions: [],
      initialDifferentials,
      isNarrowGap: false,
      weightedDefinitiveDiagnosis: initialDifferentials[0],
      ruledOutDiagnosis: null,
      summaryInsights: {
        en: 'Identified hazardous OTC NSAID intake in patient with CKD Stage 2 and prior GI bleed. Immediate cessation and safe analgesic substitution ordered.',
        ar: 'تم كشف استخدام خطير للمسكنات اللاوصفية لدى مريض بقصور كلوي وقرحة نازفة. تم إيقافها فوراً واستبدالها بمسكن آمن.'
      }
    };
  }

  // =========================================================================
  // PATIENT 4: سارة خالد الزهراني (SARAH AL-ZAHRANI) - PAT-004
  // Scenario: Test 29 / Palpitations & Functional METs Exercise Tolerance Drop
  // =========================================================================
  if (patient.id === 'pat-004') {
    const extractedEntities: ExtractedEntity[] = [
      {
        id: 'ent-s1',
        text: 'Decreased Exercise Tolerance (4 flights ➔ 2 flights)',
        textAr: 'تراجع اللياقة والتحمل البدني (من 4 طوابق إلى طابقين)',
        category: 'symptom',
        confidence: 0.96,
        status: 'unconfirmed'
      },
      {
        id: 'ent-s2',
        text: 'Intermittent Nocturnal Palpitations',
        textAr: 'خفقان قلبي متقطع أثناء الليل',
        category: 'symptom',
        confidence: 0.94,
        status: 'unconfirmed'
      },
      {
        id: 'ent-s3',
        text: 'Mild Microcytic Anemia on Iron Therapy (Hb 11.2)',
        textAr: 'فقر دم خفيف تحت العلاج بمكملات الحديد (هيموجلوبين 11.2)',
        category: 'condition',
        confidence: 0.98,
        status: 'verified'
      }
    ];

    const conflicts: ConflictItem[] = [
      {
        id: 'conf-s1',
        type: 'preop_risk',
        severity: 'medium',
        title: 'New Functional Decline Requiring Pre-Op ECG Screening',
        titleAr: 'تراجع اللياقة البدنية يتطلب تخطيط قلب احترازي قبل التخدير',
        description: 'Patient reports recent decrease in METs stair-climbing capacity from 4 flights to 2 flights accompanied by nocturnal palpitations.',
        descriptionAr: 'المريضة تشكو من تراجع القدرة على صعود الدرج مع خفقان ليلي متقطع.',
        affectedSectors: ['MOH'],
        medicationsInvolved: ['12-Lead Resting ECG'],
        recommendedAction: 'Perform 12-lead ECG in clinic to rule out paroxysmal supraventricular arrhythmia.',
        recommendedActionAr: 'إجراء تخطيط قلب 12-Lead بالعيادة لاستبعاد اضطرابات النظم الأذينية.',
        status: 'resolved'
      }
    ];

    const initialDifferentials: ClinicalPossibility[] = [
      {
        id: 'pos-s1',
        condition: 'Physiologic Tachycardia secondary to Mild Anemia vs Stress Arrhythmia',
        conditionAr: 'خفقان وتراجع لياقة ناجم عن فقر الدم أو إجهاد العمل',
        probability: 'high',
        confidencePercent: 86,
        extractedSymptoms: 'Stair climbing dyspnea + nocturnal palpitations without chest pain.',
        extractedSymptomsAr: 'ضيق نفس عند صعود طابقين وخفقان ليلي دون ألم صدري.',
        inferredCauses: 'Sympathetic hyperactivity, stress, and mild remaining hemoglobin deficit.',
        inferredCausesAr: 'زيادة نشاط الجهاز الودي وإجهاد مع نقص خفيف بالهيموجلوبين.',
        evidenceLinks: [
          { type: 'timeline', text: 'Prior normal exercise stress tolerance >4 METs in 2025', textAr: 'لياقة بدنية سابقة ممتازة في 2025' },
          { type: 'timeline', text: 'Recent hemoglobin recovery to 11.2 g/dL on Ferrous Sulfate', textAr: 'تحسن الهيموجلوبين إلى 11.2' }
        ]
      }
    ];

    return {
      extractedEntities,
      conflicts,
      missingGaps: [],
      dynamicQuestions: [],
      initialDifferentials,
      isNarrowGap: false,
      weightedDefinitiveDiagnosis: initialDifferentials[0],
      ruledOutDiagnosis: null,
      summaryInsights: {
        en: 'Functional METs decline detected. Pre-op 12-lead ECG ordered to confirm normal sinus rhythm before laparoscopic surgery.',
        ar: 'رصد تراجع في التحمل البدني وخفقان ليلي. تم توجيه عمل تخطيط قلب احترازي لتأكيد النظم الجيبي قبل جراحة المنظار.'
      }
    };
  }

  // =========================================================================
  // PATIENT 5: عبدالله يوسف (ABDULLAH YOUSEF) - PAT-005
  // Scenario: Test 26 / Near-Syncope + Amlodipine Over-dosing
  // =========================================================================
  const extractedEntities: ExtractedEntity[] = [
    {
      id: 'ent-a1',
      text: 'Accidental Antihypertensive Double Dosing (10mg BID)',
      textAr: 'تناول جرعة مضاعفة من علاج الضغط (حبة صباحاً وحبة ليلاً)',
      category: 'medication',
      confidence: 0.99,
      status: 'conflicting'
    },
    {
      id: 'ent-a2',
      text: 'Near-Syncope and Postural Dizziness (Morning)',
      textAr: 'نوبات كادت تؤدي للسقوط ودوخة انتصابية حادة بالصباح',
      category: 'symptom',
      confidence: 0.96,
      status: 'unconfirmed'
    },
    {
      id: 'ent-a3',
      text: 'Documented Low Blood Pressure (92/58 mmHg)',
      textAr: 'توثيق قراءة ضغط منخفضة بالسجل (92/58 ملم زئبق)',
      category: 'vital',
      confidence: 0.98,
      status: 'verified'
    }
  ];

  const conflicts: ConflictItem[] = [
    {
      id: 'conf-a1',
      type: 'dosage_mismatch',
      severity: 'high',
      title: 'Iatrogenic Hypotension due to Patient Taking Twice Prescribed Dose',
      titleAr: 'هبوط ضغط دوائي ناتج عن تناول المريض جرعة مضاعفة يومياً',
      description: 'Patient takes Amlodipine 10mg twice daily instead of once daily, resulting in symptomatic hypotension (92/58 mmHg).',
      descriptionAr: 'المريض يتناول 10 ملجم مرتين يومياً بالخطأ مما سبب هبوطاً مستمراً في الضغط 92/58 وشبه إغماء.',
      affectedSectors: ['MOH'],
      medicationsInvolved: ['Amlodipine 10mg BID (Overdose)'],
      recommendedAction: 'Reduce Amlodipine to 5mg once daily; stabilize hemodynamics prior to elective hernia repair.',
      recommendedActionAr: 'تخفيض الجرعة إلى 5 ملجم مرة واحدة صباحاً واستقرار العلامات الحيوية قبل العملية.',
      status: 'resolved'
    }
  ];

  const initialDifferentials: ClinicalPossibility[] = [
    {
      id: 'pos-a1',
      condition: 'Iatrogenic Orthostatic Hypotension from Calcium Channel Overdose',
      conditionAr: 'هبوط ضغط دم انتصابي دوائي ناتج عن مضاعفة جرعة أملوديبين',
      probability: 'high',
      confidencePercent: 95,
      extractedSymptoms: 'Near-syncope upon sudden morning standing + recorded BP 92/58.',
      extractedSymptomsAr: 'نوبات كادت تؤدي للإغماء عند الوقوف صباحاً وضغط 92/58.',
      inferredCauses: 'Over-medication with dihydropyridine calcium channel blockers induces excessive arterial vasodilation.',
      inferredCausesAr: 'الإفراط الدوائي سبب توسعاً شريانياً زائداً وهبوطاً انتصابياً حاداً.',
      evidenceLinks: [
        { type: 'medication', text: 'Patient admitted taking pills twice daily', textAr: 'اعتراف المريض بتناول حبة صباحاً ومساءً' },
        { type: 'timeline', text: 'Documented recent near-syncope in PHC record (92/58)', textAr: 'توثيق نوبة شبه إغماء وضغط 92/58' }
      ]
    }
  ];

  return {
    extractedEntities,
    conflicts,
    missingGaps: [],
    dynamicQuestions: [],
    initialDifferentials,
    isNarrowGap: false,
    weightedDefinitiveDiagnosis: initialDifferentials[0],
    ruledOutDiagnosis: null,
    summaryInsights: {
      en: 'Patient is inadvertently double-dosing Amlodipine leading to severe orthostatic hypotension (92/58 mmHg). Dose reduced to 5mg once daily.',
      ar: 'المريض كان يضاعف جرعة دواء الضغط عن طريق الخطأ مما سبب هبوطاً انتصابياً حرجاً 92/58. تم تصحيح الجرعة إلى 5 ملجم مرة واحدة.'
    }
  };
}
