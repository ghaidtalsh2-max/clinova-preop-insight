import type { Patient } from '../types/clinical';

export const SYNTHETIC_PATIENTS: Patient[] = [
  // =========================================================================
  // PATIENT 1: خالد محمد العتيبي (KHALID MOHAMMED AL-OTAIBI) - MRN-104582
  // Scenario: Unmentioned Penicillin Allergy + Unspecified Blood Thinner + HTN
  // =========================================================================
  {
    id: 'pat-001',
    photoUrl: '/saud.jpg',
    nationalId: '10234567891',
    mrn: 'MRN-10293',
    name: 'Ahmed Ali Alotaibi',
    nameAr: 'أحمد علي العتيبي',
    age: 45,
    gender: 'male',
    genderAr: 'ذكر',
    bloodGroup: 'O+',
    visitStatus: 'In Progress',
    visitStatusAr: 'قيد المعاينة',
    allergies: [
      { substance: 'Penicillin', substanceAr: 'بنسلين', severity: 'Severe (Anaphylaxis & Urticaria)' }
    ],
    chronicConditions: [
      { name: 'Essential Hypertension', nameAr: 'ارتفاع ضغط الدم المزمن' },
      { name: 'Type 2 Diabetes Mellitus', nameAr: 'داء السكري (النوع الثاني)' }
    ],
    visitReason: 'Pre-operative assessment for elective surgery',
    visitReasonAr: 'تقييم ما قبل عملية اختيارية',
    clinicName: 'Pre-Anesthesia Assessment Clinic',
    clinicNameAr: 'عيادة التقييم السريري والتخدير ما قبل الجراحة',
    doctorName: 'Dr. Sarah Mohammed',
    doctorNameAr: 'د. سارة محمد (استشاري)',
    scheduledProcedure: 'Elective Pre-Op Surgical Clearance',
    scheduledProcedureAr: 'تقييم ما قبل عملية اختيارية (فحص سريري شامل)',
    procedureDate: '2026-09-14',
    appointmentTime: '10:42 AM',
    appointmentTimeAr: '10:42 ص',
    triageLevel: 'high', // Critical allergy mismatch + blood thinner clarification needed
    hospital: 'King Fahad Medical City (MOH)',
    hospitalAr: 'مدينة الملك فهد الطبية (وزارة الصحة)',
    primaryDiagnosis: 'Hypertension & Type 2 Diabetes with Documented Penicillin Allergy and Unconfirmed Anticoagulant',
    primaryDiagnosisAr: 'ضغط دم وسكري مع حساسية بنسلين موثقة بالسجل ومميع دم محتمل (Apixaban)',
    sectors: ['MOH', 'NGHA', 'PRIVATE'],
    vitals: {
      measuredTimeAgo: '12 mins ago (Pre-Op Triage)',
      measuredTimeAgoAr: 'قبل 12 دقيقة (تمريض الفرز المسبق)',
      bp: '138/88 mmHg',
      bpStatus: 'normal',
      heartRate: 82,
      hrStatus: 'normal',
      temp: '37.1 °C',
      tempStatus: 'normal',
      spo2: '97%',
      spo2Status: 'normal'
    },
    medications: [
      {
        id: 'med-101',
        name: 'Amlodipine',
        genericName: 'Amlodipine Besylate',
        dose: '5 mg',
        frequency: 'Once Daily (Morning)',
        route: 'Oral',
        sector: 'MOH',
        sectorAr: 'وزارة الصحة (وصفتي)',
        sectorHospital: 'Al-Malaz Primary Healthcare Center',
        sectorHospitalAr: 'مركز صحي الملز للرعاية الأولية',
        status: 'active',
        prescribedDate: '2025-01-14',
        prescriberName: 'Dr. Tariq Al-Otaibi',
        notes: 'Hypertension maintenance therapy.',
        notesAr: 'علاج صيانة مستمر لارتفاع ضغط الدم.',
        mentionStatus: 'mentioned'
      },
      {
        id: 'med-102',
        name: 'Metformin',
        genericName: 'Metformin Hydrochloride',
        dose: '500 mg',
        frequency: 'Twice Daily with meals',
        route: 'Oral',
        sector: 'PRIVATE',
        sectorAr: 'القطاع الخاص (سليمان الحبيب)',
        sectorHospital: 'Dr. Sulaiman Al Habib Hospital',
        sectorHospitalAr: 'مستشفى الدكتور سليمان الحبيب',
        status: 'active',
        prescribedDate: '2021-06-10',
        prescriberName: 'Dr. Khalid Mansour',
        notes: 'Glycemic control for Type 2 Diabetes.',
        notesAr: 'علاج السكري من النوع الثاني.',
        mentionStatus: 'mentioned'
      },
      {
        id: 'med-103',
        name: 'Apixaban (Blood Thinner)',
        genericName: 'Apixaban',
        dose: '5 mg',
        frequency: 'Twice Daily',
        route: 'Oral',
        sector: 'NGHA',
        sectorAr: 'الشؤون الصحية للحرس الوطني',
        sectorHospital: 'King Abdulaziz Medical City - Riyadh',
        sectorHospitalAr: 'مدينة الملك عبدالعزيز الطبية - الرياض',
        status: 'active',
        prescribedDate: '2024-03-12',
        prescriberName: 'Dr. Reem Al-Dossari',
        notes: 'Oral anticoagulant. Patient did not recall name.',
        notesAr: 'مميع دم فموي مسجل بالسجل وذكره المريض شفهياً دون معرفة اسمه.',
        conflictFlag: true,
        conflictDescription: 'Possible medication match found: Apixaban 5 mg. Patient’s verbal description has not been confirmed to match this medication. Clinician verification required.',
        conflictDescriptionAr: 'تطابق دوائي محتمل: Apixaban 5 mg. لم يتم تأكيد تطابق الوصف الشفهي للمريض مع هذا الدواء بعد. يلزم التحقق السريري لمنع النزيف.',
        mentionStatus: 'conflict'
      }
    ],
    pastProcedures: [
      {
        id: 'proc-101',
        procedureName: 'Appendectomy',
        procedureNameAr: 'استئصال الزائدة الدودية',
        date: '2021-04-12',
        hospital: 'King Abdulaziz Medical City (NGHA)',
        hospitalAr: 'مدينة الملك عبدالعزيز الطبية (الحرس الوطني)',
        mentionStatus: 'mentioned'
      }
    ],
    pastLabs: [
      {
        id: 'lab-101',
        testName: 'PT / INR Coagulation Profile',
        testNameAr: 'فحص سيولة الدم (PT / INR)',
        result: 'INR 1.05 (Normal Range)',
        resultAr: 'INR 1.05 (ضمن المعدل الطبيعي)',
        date: '2026-09-02',
        status: 'normal',
        mentionStatus: 'historical'
      },
      {
        id: 'lab-102',
        testName: 'Penicillin IgE / Allergy Record',
        testNameAr: 'سجل الحساسية الموثق: Penicillin V',
        result: 'Documented Anaphylactic Reaction (2019)',
        resultAr: 'حساسية مفرطة شديدة موثقة (2019)',
        date: '2019-06-20',
        status: 'critical',
        mentionStatus: 'historical'
      }
    ],
    timeline: [
      {
        id: 'tl-101',
        year: 2016,
        date: '2016-03-10',
        title: 'Essential Hypertension Diagnosed',
        titleAr: 'تشخيص فرط ضغط الدم الأولي (منذ 10 سنوات)',
        type: 'diagnosis',
        sector: 'MOH',
        sectorAr: 'وزارة الصحة',
        description: 'Diagnosed with mild hypertension, initiated on lifestyle and pharmacotherapy.',
        descriptionAr: 'تشخيص ضغط الدم المزمن وبدء المتابعة الدورية.',
        clinicalValue: 'BP: 150/94 mmHg',
        clinicalValueAr: 'الضغط: 150/94 ملم زئبق'
      },
      {
        id: 'tl-102',
        year: 2019,
        date: '2019-06-20',
        title: 'Severe Penicillin Reaction Documented',
        titleAr: 'توثيق حساسية مفرطة تجاه البنسلين',
        type: 'er_visit',
        sector: 'NGHA',
        sectorAr: 'الحرس الوطني',
        description: 'Developed severe generalized rash and bronchospasm post amoxicillin prescription.',
        descriptionAr: 'حدوث طفح جلدي وضيق تنفس حاد عقب تناول أموكسيسيلين، وسجلت كحساسية دائمة.',
        clinicalValue: 'Severe Penicillin Allergy',
        clinicalValueAr: 'حساسية بنسلين شديدة',
        highlight: true
      },
      {
        id: 'tl-103',
        year: 2021,
        date: '2021-04-12',
        title: 'Knee Arthroscopy Surgery',
        titleAr: 'عملية تنظير مفصل الركبة',
        type: 'surgery',
        sector: 'NGHA',
        sectorAr: 'الحرس الوطني',
        description: 'Uneventful surgery under spinal anesthesia.',
        descriptionAr: 'إجراء جراحة تنظير الركبة بتخدير نصفي دون مضاعفات حرجة.',
        clinicalValue: 'Spinal Anesthesia Tolerated',
        clinicalValueAr: 'تحمل التخدير النصفي بنجاح'
      },
      {
        id: 'tl-104',
        year: 2026,
        date: '2026-08-30',
        title: 'Gallstones Confirmed (Cholecystitis Risk)',
        titleAr: 'أشعة صوتية: تأكيد حصوات المرارة وقرار الجراحة',
        type: 'lab',
        sector: 'MOH',
        sectorAr: 'وزارة الصحة',
        description: 'Symptomatic cholelithiasis scheduled for laparoscopic cholecystectomy.',
        descriptionAr: 'حصوات مرارية عرضية وتقرر إجراء استئصال بالمنظار.',
        clinicalValue: 'Symptomatic Cholelithiasis',
        clinicalValueAr: 'حصوات مرارية عرضية'
      }
    ],
    initialDialogue: [
      {
        id: 'utt-k1',
        speaker: 'doctor',
        speakerName: 'Dr. Sarah Mohammed',
        speakerNameAr: 'د. سارة محمد (استشاري)',
        text: 'Hello Ahmed, before surgery I would like to ask about your health. Do you have any chronic conditions?',
        textAr: 'الطبيب: أهلًا أحمد، قبل العملية أبغى أسألك عن حالتك الصحية. هل عندك أمراض مزمنة؟',
        timestamp: '10:42 AM'
      },
      {
        id: 'utt-k2',
        speaker: 'patient',
        speakerName: 'Ahmed Ali Alotaibi',
        speakerNameAr: 'أحمد علي العتيبي (المريض)',
        text: 'Yes, I have had high blood pressure for years.',
        textAr: 'المريض: إيه، عندي ضغط من سنوات.',
        timestamp: '10:42 AM'
      },
      {
        id: 'utt-k3',
        speaker: 'doctor',
        speakerName: 'Dr. Sarah Mohammed',
        speakerNameAr: 'د. سارة محمد (استشاري)',
        text: 'Are you currently taking any medications?',
        textAr: 'الطبيب: طيب، تستخدم أدوية حاليًا؟',
        timestamp: '10:43 AM'
      },
      {
        id: 'utt-k4',
        speaker: 'patient',
        speakerName: 'Ahmed Ali Alotaibi',
        speakerNameAr: 'أحمد علي العتيبي (المريض)',
        text: 'Yes, I take blood pressure medication and a blood thinner, but I honestly do not recall the name of the blood thinner or the dosage.',
        textAr: 'المريض: إيه، آخذ دواء للضغط وحبوب سيولة، بس والله ما أتذكر اسم حبوب السيولة ولا الجرعة.',
        timestamp: '10:43 AM'
      },
      {
        id: 'utt-k5',
        speaker: 'doctor',
        speakerName: 'Dr. Sarah Mohammed',
        speakerNameAr: 'د. سارة محمد (استشاري)',
        text: 'Do you have any drug allergies?',
        textAr: 'الطبيب: عندك أي حساسية من أدوية؟',
        timestamp: '10:44 AM'
      },
      {
        id: 'utt-k6',
        speaker: 'patient',
        speakerName: 'Ahmed Ali Alotaibi',
        speakerNameAr: 'أحمد علي العتيبي (المريض)',
        text: 'No, as far as I know, I do not have any.',
        textAr: 'المريض: لا، على حد علمي ما عندي.',
        timestamp: '10:44 AM'
      },
      {
        id: 'utt-k7',
        speaker: 'doctor',
        speakerName: 'Dr. Sarah Mohammed',
        speakerNameAr: 'د. سارة محمد (استشاري)',
        text: 'Have you had prior surgeries or any issues with anesthesia?',
        textAr: 'الطبيب: سبق وسويت عمليات أو صار لك شيء مع التخدير؟',
        timestamp: '10:45 AM'
      },
      {
        id: 'utt-k8',
        speaker: 'patient',
        speakerName: 'Ahmed Ali Alotaibi',
        speakerNameAr: 'أحمد علي العتيبي (المريض)',
        text: 'I had surgery a few years ago, but I do not remember if anything happened with anesthesia.',
        textAr: 'المريض: سويت عملية قبل كم سنة، بس ما أتذكر إذا صار شيء مع التخدير.',
        timestamp: '10:45 AM'
      },
      {
        id: 'utt-k9',
        speaker: 'patient',
        speakerName: 'Ahmed Ali Alotaibi',
        speakerNameAr: 'أحمد علي العتيبي (المريض)',
        text: 'Also lately, I sometimes get dizzy when I stand up quickly.',
        textAr: 'المريض: وبرضه الفترة الأخيرة تجيني دوخة أحيانًا إذا وقفت بسرعة.',
        timestamp: '10:46 AM'
      }
    ],
    defaultTranscript: `Doctor: Hello Ahmed, before surgery I would like to ask about your health. Do you have any chronic conditions?
Patient: Yes, I have had high blood pressure for years.
Doctor: Are you currently taking any medications?
Patient: Yes, I take blood pressure medication and a blood thinner, but I honestly do not recall the name of the blood thinner or the dosage.
Doctor: Do you have any drug allergies?
Patient: No, as far as I know, I do not have any.
Doctor: Have you had prior surgeries or any issues with anesthesia?
Patient: I had surgery a few years ago, but I do not remember if anything happened with anesthesia.
Patient: Also lately, I sometimes get dizzy when I stand up quickly.`,
    defaultTranscriptAr: `الطبيب: أهلًا أحمد، قبل العملية أبغى أسألك عن حالتك الصحية. هل عندك أمراض مزمنة؟
المريض: إيه، عندي ضغط من سنوات.
الطبيب: طيب، تستخدم أدوية حاليًا؟
المريض: إيه، آخذ دواء للضغط وحبوب سيولة، بس والله ما أتذكر اسم حبوب السيولة ولا الجرعة.
الطبيب: عندك أي حساسية من أدوية؟
المريض: لا، على حد علمي ما عندي.
الطبيب: سبق وسويت عمليات أو صار لك شيء مع التخدير؟
المريض: سويت عملية قبل كم سنة، بس ما أتذكر إذا صار شيء مع التخدير.
المريض: وبرضه الفترة الأخيرة تجيني دوخة أحيانًا إذا وقفت بسرعة.`,
    liveQuestions: [
      {
        id: 'lq-k1',
        clinicalImportance: 'التحقق من حساسية البنسلين الموثقة بالسجل وتجنب إعطاء مضادات البيتا لاكتام أثناء الجراحة',
        clinicalImportanceAr: 'التحقق من حساسية البنسلين الموثقة بالسجل وتجنب إعطاء مضادات البيتا لاكتام أثناء الجراحة',
        question: 'هل سبق أن ظهرت عليك أعراض مثل طفح جلدي أو ضيق تنفس بعد استخدام Penicillin أو مشتقاته؟ ومتى حدث ذلك؟',
        questionAr: 'هل سبق أن ظهرت عليك أعراض مثل طفح جلدي أو ضيق تنفس بعد استخدام Penicillin أو مشتقاته؟ ومتى حدث ذلك؟',
        isAsked: false
      },
      {
        id: 'lq-k2',
        clinicalImportance: 'التحقق من مميع الدم المسجل في السجل (Apixaban 5 mg) والتأكيد الشفهي قبل الجراحة',
        clinicalImportanceAr: 'التحقق من مميع الدم المسجل في السجل (Apixaban 5 mg) والتأكيد الشفهي قبل الجراحة',
        question: 'هل دواء السيولة الذي تأخذه هو Apixaban (إليكويس) 5 ملجم مرتين يومياً؟ ومتى كانت آخر حبة أخذتها؟',
        questionAr: 'هل دواء السيولة الذي تأخذه هو Apixaban (إليكويس) 5 ملجم مرتين يومياً؟ ومتى كانت آخر حبة أخذتها؟',
        isAsked: false
      },
      {
        id: 'lq-k3',
        clinicalImportance: 'استيضاح نوبة الدوخة عند الوقوف دون افتراض الإغماء',
        clinicalImportanceAr: 'استيضاح نوبة الدوخة عند الوقوف دون افتراض الإغماء',
        question: 'ذكر المريض دوخة عند الوقوف، لكن لم يذكر فقدان الوعي. هل سبق أن حدث لك إغماء أو شبه إغماء؟',
        questionAr: 'ذكر المريض دوخة عند الوقوف، لكن لم يذكر فقدان الوعي. هل سبق أن حدث لك إغماء أو شبه إغماء؟',
        isAsked: false
      }
    ],
    discriminatingQuestion: {
      id: 'dq-khalid',
      title: 'السؤال الحاسم لتوثيق حساسية البنسلين',
      titleAr: 'السؤال الحاسم لتوثيق حساسية البنسلين ومطابقة السجل',
      clinicalRationale: 'المريض نفى وجود حساسية شفهياً بينما السجل الطبي بالحرس الوطني يوثق حساسية بنسلين شديدة في 2019. تأكيد التفاعل يحمي المريض من الصدمة التحسسية أثناء الجراحة.',
      clinicalRationaleAr: 'المريض نفى وجود حساسية شفهياً بينما السجل الطبي بالحرس الوطني يوثق حساسية بنسلين شديدة في 2019. تأكيد التفاعل يحمي المريض من الصدمة التحسسية أثناء الجراحة.',
      question: 'هل سبق لك تناول مضاد حيوي (مثل Amoxicillin أو Augmentin) وسبب لك تورماً أو طفحاً استدعى مراجعة الطوارئ؟',
      questionAr: 'هل سبق لك تناول مضاد حيوي (مثل Amoxicillin أو Augmentin) وسبب لك تورماً أو طفحاً استدعى مراجعة الطوارئ؟',
      autoInferredChoiceIndex: 0,
      autoInferredBadge: 'Auto-detected EHR Contradiction',
      autoInferredBadgeAr: 'تعارض موثق بالسجل الطبي',
      options: [
        {
          id: 'opt-1',
          text: 'Yes, I recall a severe rash and breathing tightness after a dental antibiotic in 2019 (Matches EHR Penicillin Allergy)',
          textAr: 'نعم، تذكرت الآن.. أخذت مضاداً للأسنان قبل 5 سنوات وسبب لي طفحاً شديداً وضيق نفس واضطررت لإيقافه (يطابق حساسية البنسلين بالسجل)',
          isAutoInferred: true,
          pointsToDiagnosisId: 'pos-k1'
        },
        {
          id: 'opt-2',
          text: 'No, I have taken penicillin recently with no issues at all',
          textAr: 'لا، استخدمت البنسلين مؤخراً دون أي أعراض جانبية إطلاقاً',
          isAutoInferred: false,
          pointsToDiagnosisId: 'pos-k2'
        }
      ]
    },
    preOpSummary: {
      asaClass: 'ASA II (Hypertension under therapy, Penicillin Allergy)',
      airwayRisk: 'Mallampati Class I - Low Intubation Risk',
      airwayRiskAr: 'تصنيف مالامباتي الدرجة الأولى - خطورة تنبيب منخفضة',
      cardiacRisk: 'RCRI Score 1 - Low Cardiac Risk',
      cardiacRiskAr: 'مؤشر الخطورة القلبية 1 - خطورة منخفضة',
      metabolicStatus: 'Normal Renal Function (Cr 1.0), Stable Electrolytes',
      metabolicStatusAr: 'وظائف كلى وأملاح طبيعية',
      surgicalProcedure: 'Laparoscopic Cholecystectomy',
      surgicalProcedureAr: 'استئصال المرارة بالمنظار',
      plannedDate: '2026-09-14',
      medicationPlan: [
        {
          medication: 'Penicillin / Beta-lactams',
          dose: 'STRICT CONTRAINDICATION',
          sector: 'NGHA',
          action: 'hold_morning_of_surgery',
          actionAr: 'حظر تام واستبداله بـ Cefazolin أو Vancomycin وفق بروتوكول الحساسية',
          rationale: 'Prevent fatal intraoperative anaphylaxis.',
          rationaleAr: 'منع حدوث صدمة تحسسية حادة أثناء التخدير العام.'
        },
        {
          medication: 'Aspirin 81mg',
          dose: '81 mg',
          sector: 'NGHA',
          action: 'continue',
          actionAr: 'الاستمرار بالجرعة (آمن في جراحة المنظار)',
          rationale: 'Safe for laparoscopic low bleeding risk procedures.',
          rationaleAr: 'آمن في استئصال المرارة بالمنظار دون خطر نزفي ملموس.'
        },
        {
          medication: 'Amlodipine 10mg',
          dose: '10 mg',
          sector: 'MOH',
          action: 'continue',
          actionAr: 'تناول الجرعة الصباحية مع رشفة ماء',
          rationale: 'Maintain hemodynamic stability.',
          rationaleAr: 'المحافظة على استقرار ضغط الدم أثناء التحريض التخديري.'
        }
      ],
      verifiedByClinician: false
    }
  },

  // =========================================================================
  // PATIENT 2: نورة أحمد الحربي (NOURA AHMED AL-HARBI) - MRN-207341
  // Scenario: Test 27 / PONV & Family History of Severe Anesthesia Reaction
  // =========================================================================
  {
    id: 'pat-002',
    photoUrl: '/noura.jpg',
    nationalId: '10765432109',
    mrn: 'MRN-207341',
    name: 'Sara Mohammed',
    nameAr: 'سارة محمد',
    age: 34,
    gender: 'female',
    genderAr: 'أنثى',
    bloodGroup: 'A+',
    visitStatus: 'Waiting',
    visitStatusAr: 'بالانتظار',
    allergies: [],
    chronicConditions: [
      { name: 'Previous Postoperative Nausea & Vomiting (PONV)', nameAr: 'تاريخ سابق للغثيان والقيء الحاد بعد التخدير (PONV)' }
    ],
    visitReason: 'Pre-operative evaluation for diagnostic laparoscopy',
    visitReasonAr: 'تقييم ما قبل التخدير لجراحة منظار تشخيصي',
    clinicName: 'Day-Surgery & Anesthesia Assessment Unit',
    clinicNameAr: 'وحدة جراحة اليوم الواحد والتقييم التخديري',
    doctorName: 'Dr. Sarah Al-Otaibi',
    doctorNameAr: 'د. سارة العتيبي',
    scheduledProcedure: 'Diagnostic Laparoscopy & Minor Pelvic Intervention',
    scheduledProcedureAr: 'منظار تشخيصي وتدخل حوضي صغرى',
    procedureDate: '2026-09-16',
    appointmentTime: '09:15 AM',
    appointmentTimeAr: '09:15 ص',
    triageLevel: 'medium', // High PONV risk + family history of anesthesia reaction
    hospital: 'King Salman Hospital (MOH)',
    hospitalAr: 'مستشفى الملك سلمان (وزارة الصحة)',
    primaryDiagnosis: 'Pelvic Pain under Investigation with High PONV & Family Anesthesia Sensitivity',
    primaryDiagnosisAr: 'ألم حوضي مع خطورة عالية للغثيان التخديري وتاريخ عائلي لتحسس التخدير',
    sectors: ['MOH', 'PRIVATE'],
    vitals: {
      measuredTimeAgo: '15 mins ago',
      measuredTimeAgoAr: 'قبل 15 دقيقة',
      bp: '116/74 mmHg',
      bpStatus: 'normal',
      heartRate: 72,
      hrStatus: 'normal',
      temp: '36.6 °C',
      tempStatus: 'normal',
      spo2: '99%',
      spo2Status: 'normal'
    },
    medications: [],
    pastProcedures: [
      {
        id: 'proc-201',
        procedureName: 'Minor Abdominal Surgery (Appendectomy)',
        procedureNameAr: 'عملية استئصال الزائدة البسيطة قبل 10 سنوات',
        date: '2016-02-14',
        hospital: 'King Salman Hospital (MOH)',
        hospitalAr: 'مستشفى الملك سلمان (وزارة الصحة)',
        mentionStatus: 'mentioned'
      }
    ],
    pastLabs: [
      {
        id: 'lab-201',
        testName: 'Complete Blood Count (CBC)',
        testNameAr: 'فحص صورة الدم الشاملة',
        result: 'Hb 12.8 g/dL, Platelets 260k (Normal)',
        resultAr: 'هيموجلوبين 12.8 وصفائح طبيعية',
        date: '2026-09-01',
        status: 'normal',
        mentionStatus: 'historical'
      }
    ],
    timeline: [
      {
        id: 'tl-201',
        year: 2016,
        date: '2016-02-14',
        title: 'Appendectomy with Severe Post-Op Vomiting',
        titleAr: 'استئصال الزائدة مع قيء تخديري حاد (PONV)',
        type: 'surgery',
        sector: 'MOH',
        sectorAr: 'وزارة الصحة',
        description: 'Protracted nausea and vomiting requiring extended recovery stay.',
        descriptionAr: 'معاناة من غثيان وقيء شديد بعد الإفاقة استدعى البقاء بالمستشفى للملاحظة.',
        clinicalValue: 'Severe PONV Documented',
        clinicalValueAr: 'توثيق قيء تخديري حاد'
      }
    ],
    initialDialogue: [
      {
        id: 'utt-n1',
        speaker: 'doctor',
        speakerName: 'Dr. Sarah Al-Otaibi',
        speakerNameAr: 'د. سارة العتيبي (استشاري التخدير)',
        text: 'Have you had any previous surgeries?',
        textAr: 'الطبيب: هل سبق وأجريت عمليات؟',
        timestamp: '09:16 AM'
      },
      {
        id: 'utt-n2',
        speaker: 'patient',
        speakerName: 'Noura Al-Harbi',
        speakerNameAr: 'نورة الحربي (المريضة)',
        text: 'Yes, a minor abdominal surgery about ten years ago.',
        textAr: 'المريض: نعم، عملية بسيطة في البطن قبل حوالي عشر سنوات.',
        timestamp: '09:16 AM'
      },
      {
        id: 'utt-n3',
        speaker: 'doctor',
        speakerName: 'Dr. Sarah Al-Otaibi',
        speakerNameAr: 'د. سارة العتيبي (استشاري التخدير)',
        text: 'Did any complications happen?',
        textAr: 'الطبيب: هل حدثت أي مضاعفات؟',
        timestamp: '09:17 AM'
      },
      {
        id: 'utt-n4',
        speaker: 'patient',
        speakerName: 'Noura Al-Harbi',
        speakerNameAr: 'نورة الحربي (المريضة)',
        text: 'No, thank God, everything was normal. Only that I was vomiting a lot after surgery. My mother also mentioned my sister had a very similar severe reaction to anesthesia.',
        textAr: 'المريض: لا، الحمدلله، كل شيء كان طبيعي. فقط أني كنت أرجع كثير بعد العملية. وأمي تقول إن أختي صار لها شيء مشابه جدًا مع التخدير، وكانت تتعب كثير بعد العمليات.',
        timestamp: '09:18 AM'
      }
    ],
    defaultTranscript: `الطبيب: هل سبق وأجريت عمليات؟
المريض: نعم، عملية بسيطة في البطن قبل حوالي عشر سنوات.
الطبيب: هل حدثت أي مضاعفات؟
المريض: لا، الحمدلله، كل شيء كان طبيعي.
الطبيب: هل تتذكر شيئًا عن التخدير؟
المريض: فقط أني كنت أرجع كثير بعد العملية.
الطبيب: هل أخبرك أحد أن لديك حساسية من دواء معين؟
المريض: لا.
المريض: لكن أمي تقول إن أختي صار لها شيء مشابه جدًا مع التخدير، وكانت تتعب كثير بعد العمليات.`,
    defaultTranscriptAr: `الطبيب: هل سبق وأجريت عمليات؟
المريض: نعم، عملية بسيطة في البطن قبل حوالي عشر سنوات.
الطبيب: هل حدثت أي مضاعفات؟
المريض: لا، الحمدلله، كل شيء كان طبيعي.
الطبيب: هل تتذكر شيئًا عن التخدير؟
المريض: فقط أني كنت أرجع كثير بعد العملية.
الطبيب: هل أخبرك أحد أن لديك حساسية من دواء معين؟
المريض: لا.
المريض: لكن أمي تقول إن أختي صار لها شيء مشابه جدًا مع التخدير، وكانت تتعب كثير بعد العمليات.`,
    liveQuestions: [
      {
        id: 'lq-n1',
        clinicalImportance: 'استبعاد خطر فرط الحرارة الخبيث العائلي (Malignant Hyperthermia)',
        clinicalImportanceAr: 'استبعاد خطر فرط الحرارة الخبيث العائلي (Malignant Hyperthermia)',
        question: 'هل دخل أحد من أفراد العائلة العناية المركزة أو عانى من ارتفاع حرارة خطير أو تشنج عضلي أثناء التخدير؟',
        questionAr: 'هل دخل أحد من أفراد العائلة العناية المركزة أو عانى من ارتفاع حرارة خطير أو تشنج عضلي أثناء التخدير؟',
        isAsked: false
      },
      {
        id: 'lq-n2',
        clinicalImportance: 'تطبيق بروتوكول الوقاية الثلاثي للغثيان التخديري (Ondansetron + Dexamethasone)',
        clinicalImportanceAr: 'تطبيق بروتوكول الوقاية الثلاثي للغثيان التخديري (Ondansetron + Dexamethasone)',
        question: 'هل تعانين من دوار الحركة أثناء ركوب السيارة أو الطائرة؟',
        questionAr: 'هل تعانين من دوار الحركة أثناء ركوب السيارة أو الطائرة؟',
        isAsked: false
      }
    ],
    discriminatingQuestion: {
      id: 'dq-noura',
      title: 'السؤال الحاسم لتقييم خطورة التخدير العائلي',
      titleAr: 'السؤال الحاسم لتقييم خطورة التخدير وتفادي فرط الحرارة الخبيث',
      clinicalRationale: 'التمييز بين الغثيان الشائع بعد العمليات (PONV) ومتلازمة فرط الحرارة الخبيث العائلية النادرة والخطرة.',
      clinicalRationaleAr: 'التمييز بين الغثيان الشائع بعد العمليات (PONV) ومتلازمة فرط الحرارة الخبيث العائلية النادرة والخطرة.',
      question: 'هل معاناة أختك كانت مجرد غثيان واستفراغ أم تم إيقاف عمليتها بسبب مضاعفات تنفسية أو حرارة شديدة؟',
      questionAr: 'هل معاناة أختك كانت مجرد غثيان واستفراغ أم تم إيقاف عمليتها بسبب مضاعفات تنفسية أو حرارة شديدة؟',
      autoInferredChoiceIndex: 0,
      autoInferredBadge: 'Inferred PONV Apfel Score 3',
      autoInferredBadgeAr: 'تصنيف خطورة الغثيان (درجة 3)',
      options: [
        {
          id: 'opt-1',
          text: 'Just prolonged vomiting and nausea for 24 hours, no fever or ICU admission (High PONV Risk)',
          textAr: 'فقط غثيان وقيء مستمر استمر 24 ساعة دون حرارة أو تنويم عناية مركزة (يرجح خطورة PONV الشائعة)',
          isAutoInferred: true,
          pointsToDiagnosisId: 'pos-n1'
        },
        {
          id: 'opt-2',
          text: 'She developed high fever and severe muscle stiffness requiring ICU (Malignant Hyperthermia Suspect)',
          textAr: 'ارتفعت حرارتها وتيبست عضلاتها ودخلت العناية المركزة (اشتباه فرط حرارة خبيث)',
          isAutoInferred: false,
          pointsToDiagnosisId: 'pos-n2'
        }
      ]
    },
    preOpSummary: {
      asaClass: 'ASA I-E (Healthy female, High PONV Risk Profile)',
      airwayRisk: 'Mallampati Class I - Normal Airway',
      airwayRiskAr: 'مالامباتي الدرجة الأولى - مجرى هواء طبيعي',
      cardiacRisk: 'RCRI Score 0 - Minimal Risk',
      cardiacRiskAr: 'مؤشر خطورة قلبية 0 - خطورة شبه منعدمة',
      metabolicStatus: 'Normal Baseline Labs',
      metabolicStatusAr: 'فحوصات طبيعية',
      surgicalProcedure: 'Diagnostic Laparoscopy',
      surgicalProcedureAr: 'منظار تشخيصي',
      plannedDate: '2026-09-16',
      medicationPlan: [
        {
          medication: 'Dual Anti-Emetic Prophylaxis (Ondansetron 4mg + Dexamethasone 4mg)',
          dose: 'IV at Induction',
          sector: 'MOH',
          action: 'continue',
          actionAr: 'إعطاء وقائي ثلاثي للغثيان عند بدء التخدير',
          rationale: 'Apfel Score 3 (Female, Non-Smoker, Prior PONV History).',
          rationaleAr: 'درجة خطورة 3 على مقياس أبفل للغثيان التخديري.'
        },
        {
          medication: 'Total Intravenous Anesthesia (TIVA with Propofol)',
          dose: 'Standard Infusion',
          sector: 'MOH',
          action: 'continue',
          actionAr: 'تفضيل التخدير الوريدي الكامل (TIVA) وتجنب الغازات المستنشقة',
          rationale: 'Reduces PONV incidence by 40%.',
          rationaleAr: 'يقلل احتمالية حدوث القيء بنسبة 40% مقارنة بالغازات.'
        }
      ],
      verifiedByClinician: false
    }
  },

  // =========================================================================
  // PATIENT 3: فهد عبدالله الغامدي (FAHAD ABDULLAH AL-GHAMDI) - MRN-315729
  // Scenario: Test 28 / Hidden OTC NSAIDs (Ibuprofen) with CKD Stage 2 & GI Bleed
  // =========================================================================
  {
    id: 'pat-003',
    photoUrl: '/fahad.jpg',
    nationalId: '10987654321',
    mrn: 'MRN-315729',
    name: 'Khalid Omar',
    nameAr: 'خالد عمر',
    age: 67,
    gender: 'male',
    genderAr: 'ذكر',
    bloodGroup: 'B+',
    visitStatus: 'Waiting',
    visitStatusAr: 'بالانتظار',
    allergies: [
      { substance: 'Aspirin', substanceAr: 'الأسبرين', severity: 'Severe (Bronchospasm / Asthma Exacerbation)' }
    ],
    chronicConditions: [
      { name: 'Chronic Kidney Disease (Stage 2)', nameAr: 'قصور كلوي مزمن (الدرجة الثانية)' },
      { name: 'Previous Upper GI Bleeding', nameAr: 'تاريخ سابق لنزيف قرحة هضمية علوية' },
      { name: 'Severe Knee Osteoarthritis', nameAr: 'خشونة متقدمة بمفصل الركبة' }
    ],
    visitReason: 'Pre-operative assessment for Total Knee Replacement',
    visitReasonAr: 'تقييم ما قبل التخدير لجراحة استبدال مفصل الركبة',
    clinicName: 'Orthopedic Joint Replacement Clinic',
    clinicNameAr: 'عيادة جراحة المفاصل والعظام',
    doctorName: 'Dr. Sarah Al-Otaibi',
    doctorNameAr: 'د. سارة العتيبي',
    scheduledProcedure: 'Elective Total Knee Arthroplasty (Right)',
    scheduledProcedureAr: 'استبدال كامل لمفصل الركبة الأيمن (مجدولة)',
    procedureDate: '2026-09-18',
    appointmentTime: '10:00 AM',
    appointmentTimeAr: '10:00 ص',
    triageLevel: 'high', // Severe OTC NSAID nephrotoxicity risk + GI bleed history
    hospital: 'King Abdulaziz Medical City (NGHA)',
    hospitalAr: 'مدينة الملك عبدالعزيز الطبية (الحرس الوطني)',
    primaryDiagnosis: 'Severe Knee Osteoarthritis, CKD Stage 2 & Hidden OTC NSAID Consumption',
    primaryDiagnosisAr: 'خشونة الركبة وقصور كلوي مع تناول مسكنات لاسترودية غير مقيدة بالسجل',
    sectors: ['NGHA', 'PRIVATE'],
    vitals: {
      measuredTimeAgo: '25 mins ago',
      measuredTimeAgoAr: 'قبل 25 دقيقة',
      bp: '142/86 mmHg',
      bpStatus: 'high',
      heartRate: 74,
      hrStatus: 'normal',
      temp: '36.7 °C',
      tempStatus: 'normal',
      spo2: '96%',
      spo2Status: 'normal'
    },
    medications: [
      {
        id: 'med-301',
        name: 'Lisinopril',
        genericName: 'Lisinopril',
        dose: '10 mg',
        frequency: 'Once Daily',
        route: 'Oral',
        sector: 'NGHA',
        sectorAr: 'الحرس الوطني',
        sectorHospital: 'King Abdulaziz Medical City',
        sectorHospitalAr: 'مدينة الملك عبدالعزيز الطبية',
        status: 'active',
        prescribedDate: '2025-05-10',
        prescriberName: 'Dr. Hisham Al-Dossari',
        notes: 'Renal dosing monitored.',
        notesAr: 'علاج ضغط مراقب كلوياً.',
        mentionStatus: 'mentioned'
      },
      {
        id: 'med-302',
        name: 'OTC Ibuprofen (Unlogged Pharmacy Purchase)',
        genericName: 'Ibuprofen 400mg',
        dose: '400 mg',
        frequency: '3-4 times weekly',
        route: 'Oral',
        sector: 'PRIVATE',
        sectorAr: 'صيدلية مجتمعية خاصة (شراء ذاتي OTC)',
        sectorHospital: 'Community Pharmacy OTC',
        sectorHospitalAr: 'صيدلية أهلية (شراء دون وصفة)',
        status: 'active',
        prescribedDate: '2026-08-01',
        prescriberName: 'Self-Administered',
        notes: 'CRITICAL CONFLICT: High risk of worsening CKD and triggering recurrent GI bleed.',
        notesAr: 'تعارض حرج: خطر تفاقم القصور الكلوي وتكرار نزيف المعدة.',
        conflictFlag: true,
        conflictDescription: 'Patient self-administering NSAIDs contraindicated with CKD & GI bleeding history.',
        conflictDescriptionAr: 'المريض يتناول مسكنات بروفين دون وصفة رغم التحذير السابق من خطورتها على الكلى والمعدة.',
        mentionStatus: 'conflict'
      }
    ],
    pastProcedures: [
      {
        id: 'proc-301',
        procedureName: 'Upper Endoscopy (Gastric Ulcer Treated)',
        procedureNameAr: 'منظار علوي لعلاج قرحة نازفة في المعدة',
        date: '2022-11-20',
        hospital: 'King Abdulaziz Medical City',
        hospitalAr: 'مدينة الملك عبدالعزيز الطبية',
        mentionStatus: 'historical'
      }
    ],
    pastLabs: [
      {
        id: 'lab-301',
        testName: 'Serum Creatinine & eGFR',
        testNameAr: 'الكرياتينين ومعدل التصفية الكلوية',
        result: 'Cr: 1.45 mg/dL (eGFR: 52 mL/min - CKD Stage 2)',
        resultAr: 'كرياتينين 1.45 (قصور كلوي من الدرجة الثانية)',
        date: '2026-08-25',
        status: 'attention',
        mentionStatus: 'historical'
      }
    ],
    timeline: [
      {
        id: 'tl-301',
        year: 2022,
        date: '2022-11-20',
        title: 'Upper GI Bleed & Endoscopic Hemostasis',
        titleAr: 'نزيف هضمي علوي وحقن القرحة بالمنظار',
        type: 'er_visit',
        sector: 'NGHA',
        sectorAr: 'الحرس الوطني',
        description: 'Severe melena requiring 2 units PRBC transfusion post NSAID overuse.',
        descriptionAr: 'نزيف معوي حاد تطلب نقل وحدتي دم بعد إفراط بالمسكنات وتوصية صارمة بتجنبها.',
        clinicalValue: 'Prior Bleeding Ulcer',
        clinicalValueAr: 'قرحة نازفة سابقة',
        highlight: true
      }
    ],
    initialDialogue: [
      {
        id: 'utt-f1',
        speaker: 'doctor',
        speakerName: 'Dr. Sarah Al-Otaibi',
        speakerNameAr: 'د. سارة العتيبي (استشاري التخدير)',
        text: 'Are you currently taking any medications?',
        textAr: 'الطبيب: هل تستخدم أدوية بانتظام؟',
        timestamp: '10:02 AM'
      },
      {
        id: 'utt-f2',
        speaker: 'patient',
        speakerName: 'Fahad Al-Ghamdi',
        speakerNameAr: 'فهد الغامدي (المريض)',
        text: 'Just my regular blood pressure medication.',
        textAr: 'المريض: فقط علاج الضغط المعتاد.',
        timestamp: '10:02 AM'
      },
      {
        id: 'utt-f3',
        speaker: 'doctor',
        speakerName: 'Dr. Sarah Al-Otaibi',
        speakerNameAr: 'د. سارة العتيبي (استشاري التخدير)',
        text: 'Do you take anything for pain, including over-the-counter tablets?',
        textAr: 'الطبيب: هل تأخذ مسكنات للألم من الصيدلية للركبة؟',
        timestamp: '10:03 AM'
      },
      {
        id: 'utt-f4',
        speaker: 'patient',
        speakerName: 'Fahad Al-Ghamdi',
        speakerNameAr: 'فهد الغامدي (المريض)',
        text: 'Sometimes I take a couple of tablets when my knee hurts. I bought them from the pharmacy. Maybe 3 or 4 times a week, and I took them this morning.',
        textAr: 'المريض: أحياناً آخذ حبتين إذا اشتد وجع الركبة.. اشتريتها من الصيدلية، يمكن 3 أو 4 مرات بالأسبوع، وأخذتها اليوم الصباح.',
        timestamp: '10:04 AM'
      }
    ],
    defaultTranscript: `الطبيب: هل تستخدم أدوية بانتظام؟
المريض: فقط علاج الضغط المعتاد.
الطبيب: هل تأخذ أي مسكنات للألم أو مكملات، بما في ذلك الأدوية بدون وصفة؟
المريض: لا، ما في شي مهم.
الطبيب: هل تأخذ مسكنات لركبتك؟
المريض: أحياناً آخذ حبتين إذا اشتد وجع الركبة.. اشتريتها من الصيدلية، يمكن 3 أو 4 مرات بالأسبوع.
الطبيب: متى آخر مرة أخذتها؟
المريض: اليوم الصباح.`,
    defaultTranscriptAr: `الطبيب: هل تستخدم أدوية بانتظام؟
المريض: فقط علاج الضغط المعتاد.
الطبيب: هل تأخذ أي مسكنات للألم أو مكملات، بما في ذلك الأدوية بدون وصفة؟
المريض: لا، ما في شي مهم.
الطبيب: هل تأخذ مسكنات لركبتك؟
المريض: أحياناً آخذ حبتين إذا اشتد وجع الركبة.. اشتريتها من الصيدلية، يمكن 3 أو 4 مرات بالأسبوع.
الطبيب: متى آخر مرة أخذتها؟
المريض: اليوم الصباح.`,
    liveQuestions: [
      {
        id: 'lq-f1',
        clinicalImportance: 'إيقاف مسكنات البروفين فوراً لحماية وظائف الكلى وتجنب النزيف الجراحي',
        clinicalImportanceAr: 'إيقاف مسكنات البروفين فوراً لحماية وظائف الكلى وتجنب النزيف الجراحي',
        question: 'هل الدواء المسكن الذي تأخذه لونه وردي أو اسمه إيبوبروفين أو بروفين؟',
        questionAr: 'هل الدواء المسكن الذي تأخذه لونه وردي أو اسمه إيبوبروفين أو بروفين؟',
        isAsked: false
      },
      {
        id: 'lq-f2',
        clinicalImportance: 'استبدال المسكن بالباراسيتامول الآمن كلوياً ومعدياً (Paracetamol)',
        clinicalImportanceAr: 'استبدال المسكن بالباراسيتامول الآمن كلوياً ومعدياً (Paracetamol)',
        question: 'هل جربت استخدام البنادول العادي لتسكين ألم الركبة بدلاً من المسكنات القوية؟',
        questionAr: 'هل جربت استخدام البنادول العادي لتسكين ألم الركبة بدلاً من المسكنات القوية؟',
        isAsked: false
      }
    ],
    discriminatingQuestion: {
      id: 'dq-fahad',
      title: 'السؤال الحاسم لضبط خطة تسكين الألم الآمنة كلوياً',
      titleAr: 'السؤال الحاسم لضبط خطة تسكين الألم الآمنة كلوياً والمعدية',
      clinicalRationale: 'المريض يتناول NSAIDs وهو مصاب بقصور كلوي مزمن ولديه قرحة معدية نازفة سابقة.',
      clinicalRationaleAr: 'المريض يتناول NSAIDs وهو مصاب بقصور كلوي مزمن ولديه قرحة معدية نازفة سابقة.',
      question: 'هل توافق على إيقاف مسكن الصيدلية فوراً واستبداله بمسكن آمن للكلى والمعدة يصفه لك الطبيب الآن؟',
      questionAr: 'هل توافق على إيقاف مسكن الصيدلية فوراً واستبداله بمسكن آمن للكلى والمعدة يصفه لك الطبيب الآن؟',
      autoInferredChoiceIndex: 0,
      autoInferredBadge: 'Urgent Nephrotoxicity Alert',
      autoInferredBadgeAr: 'تنبيه سمية كلوية حرج',
      options: [
        {
          id: 'opt-1',
          text: 'Agree to stop OTC NSAIDs immediately and switch to Paracetamol & Topical Analgesics',
          textAr: 'أوافق على إيقاف مسكن الصيدلية فوراً والاعتماد على الباراسيتامول والدهانات الموضعية',
          isAutoInferred: true,
          pointsToDiagnosisId: 'pos-f1'
        },
        {
          id: 'opt-2',
          text: 'Refuse to stop OTC NSAIDs',
          textAr: 'عدم الرغبة في إيقاف المسكن',
          isAutoInferred: false,
          pointsToDiagnosisId: 'pos-f2'
        }
      ]
    },
    preOpSummary: {
      asaClass: 'ASA III (Severe Knee OA, CKD Stage 2, Prior Bleeding Ulcer)',
      airwayRisk: 'Mallampati Class II - Moderate Risk',
      airwayRiskAr: 'مالامباتي الدرجة الثانية - خطورة معتدلة',
      cardiacRisk: 'RCRI Score 1 - Low Cardiac Risk',
      cardiacRiskAr: 'مؤشر خطورة قلبية 1',
      metabolicStatus: 'CKD Stage 2 (Cr 1.45, eGFR 52 mL/min)',
      metabolicStatusAr: 'قصور كلوي من الدرجة الثانية (تصفية 52)',
      surgicalProcedure: 'Total Knee Arthroplasty',
      surgicalProcedureAr: 'استبدال كامل لمفصل الركبة',
      plannedDate: '2026-09-18',
      medicationPlan: [
        {
          medication: 'OTC Ibuprofen / NSAIDs',
          dose: 'STOP IMMEDIATELY',
          sector: 'PRIVATE',
          action: 'hold_morning_of_surgery',
          actionAr: 'إيقاف فوري وشامل لجميع مضادات الالتهاب اللاستيرويدية',
          rationale: 'Prevent acute-on-chronic renal injury and surgical hemorrhage.',
          rationaleAr: 'منع الفشل الكلوي الحاد وتجنب تكرار النزيف الهضمي.'
        },
        {
          medication: 'Paracetamol 1000mg',
          dose: '1g Q8H PRN',
          sector: 'NGHA',
          action: 'continue',
          actionAr: 'بدء كبديل آمن للألم',
          rationale: 'Safe renal profile for perioperative analgesia.',
          rationaleAr: 'مسكن آمن للكلى والمعدة قبل وبعد العملية.'
        }
      ],
      verifiedByClinician: false
    }
  },

  // =========================================================================
  // PATIENT 4: سارة خالد الزهراني (SARAH KHALID AL-ZAHRANI) - MRN-428615
  // Scenario: Test 29 / Subtle Palpitations & Reduced Exercise Tolerance
  // =========================================================================
  {
    id: 'pat-004',
    photoUrl: '/sarah.jpg',
    nationalId: '10123456789',
    mrn: 'MRN-428615',
    name: 'Fatima Al-Zahrani',
    nameAr: 'فاطمة الزهراني',
    age: 29,
    gender: 'female',
    genderAr: 'أنثى',
    bloodGroup: 'AB+',
    visitStatus: 'Waiting',
    visitStatusAr: 'بالانتظار',
    allergies: [],
    chronicConditions: [
      { name: 'Mild Hypertension', nameAr: 'ارتفاع ضغط دم أولي خفيف' },
      { name: 'Uterine Fibroid (Symptomatic)', nameAr: 'ورم ليفي رحمي عرضي' }
    ],
    visitReason: 'Pre-operative assessment for elective myomectomy',
    visitReasonAr: 'تقييم ما قبل التخدير لعملية استئصال ورم ليفي مجدولة',
    clinicName: 'Women Health & Surgical Pre-Op Clinic',
    clinicNameAr: 'عيادة صحة المرأة والتقييم الجراحي',
    doctorName: 'Dr. Sarah Al-Otaibi',
    doctorNameAr: 'د. سارة العتيبي',
    scheduledProcedure: 'Elective Laparoscopic Myomectomy',
    scheduledProcedureAr: 'استئصال ورم ليفي بالمنظار (مجدولة)',
    procedureDate: '2026-09-20',
    appointmentTime: '10:30 AM',
    appointmentTimeAr: '10:30 ص',
    triageLevel: 'medium', // New onset functional decline + palpitations
    hospital: 'Maternity and Children Hospital (MOH)',
    hospitalAr: 'مستشفى الولادة والأطفال (وزارة الصحة)',
    primaryDiagnosis: 'Symptomatic Uterine Fibroid with Recent Decline in METs Exercise Tolerance',
    primaryDiagnosisAr: 'ورم ليفي رحمي مع تراجع حديث في القدرة البدنية وخفقان ليلي متقطع',
    sectors: ['MOH'],
    vitals: {
      measuredTimeAgo: '15 mins ago',
      measuredTimeAgoAr: 'قبل 15 دقيقة',
      bp: '128/82 mmHg',
      bpStatus: 'normal',
      heartRate: 88,
      hrStatus: 'normal',
      temp: '36.9 °C',
      tempStatus: 'normal',
      spo2: '99%',
      spo2Status: 'normal'
    },
    medications: [
      {
        id: 'med-401',
        name: 'Ferrous Sulfate',
        genericName: 'Iron Supplement',
        dose: '190 mg',
        frequency: 'Once Daily',
        route: 'Oral',
        sector: 'MOH',
        sectorAr: 'وزارة الصحة',
        sectorHospital: 'Maternity Hospital',
        sectorHospitalAr: 'مستشفى الولادة',
        status: 'active',
        prescribedDate: '2026-07-15',
        prescriberName: 'Dr. Huda Al-Mansour',
        notes: 'Correction of microcytic anemia from menorrhagia.',
        notesAr: 'علاج فقر الدم الناجم عن غزارة الطمث.',
        mentionStatus: 'historical'
      }
    ],
    pastProcedures: [],
    pastLabs: [
      {
        id: 'lab-401',
        testName: 'Hemoglobin & Ferritin',
        testNameAr: 'الهيموجلوبين ومخزون الحديد',
        result: 'Hb 11.2 g/dL (Improved), Ferritin 24 ng/mL',
        resultAr: 'هيموجلوبين 11.2 (متحسن)',
        date: '2026-08-20',
        status: 'normal',
        mentionStatus: 'historical'
      }
    ],
    timeline: [
      {
        id: 'tl-401',
        year: 2025,
        date: '2025-10-10',
        title: 'Normal Exercise Stress Tolerance Documented',
        titleAr: 'توثيق لياقة بدنية ممتازة (>4 METs)',
        type: 'diagnosis',
        sector: 'MOH',
        sectorAr: 'وزارة الصحة',
        description: 'Patient regularly climbing 4 flights of stairs with no dyspnea.',
        descriptionAr: 'المريضة كانت تصعد 4 طوابق دون انقطاع نفس.',
        clinicalValue: '>4 METs Exercise Tolerance',
        clinicalValueAr: 'تحمل بدني طبيعي ممتاز'
      }
    ],
    initialDialogue: [
      {
        id: 'utt-s1',
        speaker: 'doctor',
        speakerName: 'Dr. Sarah Al-Otaibi',
        speakerNameAr: 'د. سارة العتيبي (استشاري التخدير)',
        text: 'How would you describe your general health and stamina?',
        textAr: 'الطبيب: كيف تصفين صحتك العامة ولياقتك اليومية؟',
        timestamp: '10:31 AM'
      },
      {
        id: 'utt-s2',
        speaker: 'patient',
        speakerName: 'Sarah Al-Zahrani',
        speakerNameAr: 'سارة الزهراني (المريضة)',
        text: 'Pretty good, but recently I get a little winded when climbing stairs. I used to climb 4 flights easily, but now I stop after two.',
        textAr: 'المريض: الحمدلله كويسة، لكن مؤخراً أحس بضيق نفس بسيط إذا صعدت الدرج.. كنت أصعد 4 طوابق بدون توقف، الحين أوقف عند الطابق الثاني.',
        timestamp: '10:32 AM'
      },
      {
        id: 'utt-s3',
        speaker: 'doctor',
        speakerName: 'Dr. Sarah Al-Otaibi',
        speakerNameAr: 'د. سارة العتيبي (استشاري التخدير)',
        text: 'Any chest pain or palpitations?',
        textAr: 'الطبيب: هل تشعرين بألم بالصدر أو خفقان بالقلب؟',
        timestamp: '10:33 AM'
      },
      {
        id: 'utt-s4',
        speaker: 'patient',
        speakerName: 'Sarah Al-Zahrani',
        speakerNameAr: 'سارة الزهراني (المريضة)',
        text: 'No chest pain, but occasional palpitations at night which I thought were from stress.',
        textAr: 'المريض: ما في ألم بالصدر، بس يجيني خفقان أحياناً بالليل وكنت أظنه بسبب التوتر وضغوط العمل.',
        timestamp: '10:33 AM'
      }
    ],
    defaultTranscript: `الطبيب: كيف تصفين صحتك العامة ولياقتك اليومية؟
المريض: الحمدلله كويسة، لكن مؤخراً أحس بضيق نفس بسيط إذا صعدت الدرج.. كنت أصعد 4 طوابق بسهولة، الحين أوقف عند الطابق الثاني.
الطبيب: متى لاحظتِ هذا التغيير؟
المريض: قبل حوالي شهرين.
الطبيب: هل تشعرين بألم في الصدر أو خفقان؟
المريض: ما في ألم بالصدر، بس يجيني خفقان أحياناً بالليل وكنت أظنه بسبب التوتر وضغوط العمل.`,
    defaultTranscriptAr: `الطبيب: كيف تصفين صحتك العامة ولياقتك اليومية؟
المريض: الحمدلله كويسة، لكن مؤخراً أحس بضيق نفس بسيط إذا صعدت الدرج.. كنت أصعد 4 طوابق بسهولة، الحين أوقف عند الطابق الثاني.
الطبيب: متى لاحظتِ هذا التغيير؟
المريض: قبل حوالي شهرين.
الطبيب: هل تشعرين بألم في الصدر أو خفقان؟
المريض: ما في ألم بالصدر، بس يجيني خفقان أحياناً بالليل وكنت أظنه بسبب التوتر وضغوط العمل.`,
    liveQuestions: [
      {
        id: 'lq-s1',
        clinicalImportance: 'إجراء تخطيط قلب 12-Lead ECG لاستبعاد اضطرابات النظم قبل التخدير',
        clinicalImportanceAr: 'إجراء تخطيط قلب 12-Lead ECG لاستبعاد اضطرابات النظم قبل التخدير',
        question: 'هل الخفقان الذي تشعرين به منتظم أم ضربات متخبطة وسريعة فجأة؟',
        questionAr: 'هل الخفقان الذي تشعرين به منتظم أم ضربات متخبطة وسريعة فجأة؟',
        isAsked: false
      }
    ],
    discriminatingQuestion: {
      id: 'dq-sarah',
      title: 'السؤال الحاسم لتقييم كفاءة عضلة القلب والتنفس',
      titleAr: 'السؤال الحاسم لتقييم كفاءة عضلة القلب والتنفس (METs Score)',
      clinicalRationale: 'تراجع اللياقة البدنية من 4 إلى 2 طوابق يستدعي فحص تخطيط القلب ومستوى الهيموجلوبين لضمان كفاية الأكسجة قبل التخدير العام.',
      clinicalRationaleAr: 'تراجع اللياقة البدنية من 4 إلى 2 طوابق يستدعي فحص تخطيط القلب ومستوى الهيموجلوبين لضمان كفاية الأكسجة قبل التخدير العام.',
      question: 'هل الخفقان وضيق النفس مرتبط بتحسن فقر الدم أم مستمر رغم تناول الحديد؟',
      questionAr: 'هل الخفقان وضيق النفس مرتبط بتحسن فقر الدم أم مستمر رغم تناول الحديد؟',
      autoInferredChoiceIndex: 0,
      autoInferredBadge: 'Mild Functional Decline',
      autoInferredBadgeAr: 'تراجع وظيفي طفيف',
      options: [
        {
          id: 'opt-1',
          text: 'Occasional mild palpitations with stress, ECG scheduled before surgery (Safe with ECG check)',
          textAr: 'خفقان عارض مع التوتر، وتقرر عمل تخطيط قلب احترازي قبل الجراحة (آمن بعد التخطيط)',
          isAutoInferred: true,
          pointsToDiagnosisId: 'pos-s1'
        },
        {
          id: 'opt-2',
          text: 'Severe constant palpitations with dizziness',
          textAr: 'خفقان شديد ومستمر مع دوخة وهبوط',
          isAutoInferred: false,
          pointsToDiagnosisId: 'pos-s2'
        }
      ]
    },
    preOpSummary: {
      asaClass: 'ASA I (Young healthy female, mild microcytic anemia under therapy)',
      airwayRisk: 'Mallampati Class I - Low Risk',
      airwayRiskAr: 'مالامباتي الدرجة الأولى - خطورة منخفضة',
      cardiacRisk: 'RCRI Score 0 - Minimal Risk',
      cardiacRiskAr: 'مؤشر خطورة قلبية 0',
      metabolicStatus: 'Hemoglobin 11.2 g/dL (Adequate for laparoscopic surgery)',
      metabolicStatusAr: 'هيموجلوبين 11.2 (كافٍ وآمن لجراحة المنظار)',
      surgicalProcedure: 'Laparoscopic Myomectomy',
      surgicalProcedureAr: 'استئصال ورم ليفي بالمنظار',
      plannedDate: '2026-09-20',
      medicationPlan: [
        {
          medication: 'Pre-Op 12-Lead ECG Screening',
          dose: 'Single baseline test',
          sector: 'MOH',
          action: 'continue',
          actionAr: 'إجراء تخطيط قلب بالعيادة للتأكد من النظم الجيبي',
          rationale: 'Verify absence of supraventricular arrhythmias.',
          rationaleAr: 'التأكد من سلامة النظم القلبي قبل التخدير.'
        }
      ],
      verifiedByClinician: false
    }
  },

  // =========================================================================
  // PATIENT 5: عبدالله يوسف (ABDULLAH YOUSEF) - MRN-536814
  // Scenario: Test 26 / Blood Pressure Dose Change + Near-Syncope Episode
  // =========================================================================
  {
    id: 'pat-005',
    photoUrl: '/abdullah.jpg',
    nationalId: '10567891234',
    mrn: 'MRN-536814',
    name: 'Abdullah Hassan',
    nameAr: 'عبدالله حسن',
    age: 68,
    gender: 'male',
    genderAr: 'ذكر',
    bloodGroup: 'O-',
    visitStatus: 'Completed',
    visitStatusAr: 'مكتمل',
    allergies: [],
    chronicConditions: [
      { name: 'Essential Hypertension', nameAr: 'ارتفاع ضغط الدم المزمن' },
      { name: 'Right Inguinal Hernia', nameAr: 'فتق إربي أيمن' }
    ],
    visitReason: 'Pre-operative assessment for inguinal hernia repair',
    visitReasonAr: 'تقييم ما قبل التخدير لجراحة إصلاح فتق إربي',
    clinicName: 'General Surgery Pre-Op Assessment Clinic',
    clinicNameAr: 'عيادة التقييم التخديري والجراحة العامة',
    doctorName: 'Dr. Sarah Al-Otaibi',
    doctorNameAr: 'د. سارة العتيبي',
    scheduledProcedure: 'Elective Inguinal Hernia Mesh Repair',
    scheduledProcedureAr: 'إصلاح فتق إربي مع تركيب شبكة (مجدولة)',
    procedureDate: '2026-09-22',
    appointmentTime: '11:00 AM',
    appointmentTimeAr: '11:00 ص',
    triageLevel: 'medium', // Over-medication hypotension risk (Last BP 92/58)
    hospital: 'King Fahad Hospital - Jeddah (MOH)',
    hospitalAr: 'مستشفى الملك فهد - جدة (وزارة الصحة)',
    primaryDiagnosis: 'Inguinal Hernia with Orthostatic Hypotension secondary to BP Dose Escalation',
    primaryDiagnosisAr: 'فتق إربي مع هبوط ضغط انتصابي ناجم عن زيادة جرعة دواء الضغط مؤخراً',
    sectors: ['MOH'],
    vitals: {
      measuredTimeAgo: '10 mins ago',
      measuredTimeAgoAr: 'قبل 10 دقائق',
      bp: '96/60 mmHg',
      bpStatus: 'attention',
      heartRate: 70,
      hrStatus: 'normal',
      temp: '36.8 °C',
      tempStatus: 'normal',
      spo2: '98%',
      spo2Status: 'normal'
    },
    medications: [
      {
        id: 'med-501',
        name: 'Amlodipine',
        genericName: 'Amlodipine Besylate',
        dose: '10 mg',
        frequency: 'Twice Daily (Escalated in error by patient)',
        route: 'Oral',
        sector: 'MOH',
        sectorAr: 'وزارة الصحة (وصفتي)',
        sectorHospital: 'Primary Health Center',
        sectorHospitalAr: 'مركز الرعاية الأولية',
        status: 'active',
        prescribedDate: '2026-07-10',
        prescriberName: 'Dr. Mansour Al-Zahrani',
        notes: 'Dose increased 2 months ago. Patient experiencing near-syncope.',
        notesAr: 'تمت زيادة الجرعة قبل شهرين، وسجل المريض نوبات دوخة وهبوط ضغط 92/58.',
        conflictFlag: true,
        conflictDescription: 'Patient taking double dose leading to borderline hypotension (92/58 mmHg).',
        conflictDescriptionAr: 'تناول المريض جرعتين صباحاً ومساءً سبب هبوطاً انتصابياً حرجاً.',
        mentionStatus: 'conflict'
      }
    ],
    pastProcedures: [],
    pastLabs: [
      {
        id: 'lab-501',
        testName: 'Electrolytes & Renal Panel',
        testNameAr: 'الأملاح ووظائف الكلى',
        result: 'Normal Na/K, Cr 0.9 mg/dL',
        resultAr: 'أملاح وكرياتينين طبيعية',
        date: '2026-09-01',
        status: 'normal',
        mentionStatus: 'historical'
      }
    ],
    timeline: [
      {
        id: 'tl-501',
        year: 2026,
        date: '2026-07-10',
        title: 'Blood Pressure Dose Escalation',
        titleAr: 'زيادة جرعة علاج الضغط إلى 10 ملجم',
        type: 'medication',
        sector: 'MOH',
        sectorAr: 'وزارة الصحة',
        description: 'Dose increased 2 months ago. Last recorded BP 92/58 mmHg.',
        descriptionAr: 'زيادة الجرعة قبل شهرين، وتوثيق قراءة ضغط منخفضة 92/58 ملم زئبق.',
        clinicalValue: 'BP: 92/58 mmHg',
        clinicalValueAr: 'الضغط: 92/58 ملم زئبق',
        highlight: true
      }
    ],
    initialDialogue: [
      {
        id: 'utt-a1',
        speaker: 'doctor',
        speakerName: 'Dr. Sarah Al-Otaibi',
        speakerNameAr: 'د. سارة العتيبي (استشاري التخدير)',
        text: 'Do you have any chronic conditions or take medications?',
        textAr: 'الطبيب: هل لديك أمراض مزمنة أو تستخدم أدوية؟',
        timestamp: '11:01 AM'
      },
      {
        id: 'utt-a2',
        speaker: 'patient',
        speakerName: 'Abdullah Yousef',
        speakerNameAr: 'عبدالله يوسف (المريض)',
        text: 'I have hypertension, but it is well controlled. I take a pill in the morning and a pill at night.',
        textAr: 'المريض: عندي ضغط، لكنه متحكم فيه الحمدلله. آخذ حبة الصباح وحبة بالليل.',
        timestamp: '11:02 AM'
      },
      {
        id: 'utt-a3',
        speaker: 'doctor',
        speakerName: 'Dr. Sarah Al-Otaibi',
        speakerNameAr: 'د. سارة العتيبي (استشاري التخدير)',
        text: 'Have you had any dizziness or fainting recently?',
        textAr: 'الطبيب: هل واجهت أي دوخة أو إغماء مؤخراً؟',
        timestamp: '11:03 AM'
      },
      {
        id: 'utt-a4',
        speaker: 'patient',
        speakerName: 'Abdullah Yousef',
        speakerNameAr: 'عبدالله يوسف (المريض)',
        text: 'Sometimes I feel dizzy when standing quickly in the morning, and once I almost fell.',
        textAr: 'المريض: أحياناً أحس بدوخة إذا وقفت بسرعة، خصوصاً في الصباح.. ومرة حسيت أني بقرب أطيح واضطريت أجلس.',
        timestamp: '11:03 AM'
      }
    ],
    defaultTranscript: `الطبيب: هل لديك أمراض مزمنة؟
المريض: عندي ضغط، لكنه متحكم فيه الحمدلله.
الطبيب: هل تستخدم علاجاً للضغط؟
المريض: نعم، آخذ حبة الصباح وحبة بالليل.
الطبيب: هل تتذكر أسماء الأدوية؟
المريض: واحد اسمه تقريباً يبدأ بـ A، والثاني ما أتذكره.
الطبيب: هل واجهت أي أعراض مؤخراً؟
المريض: أحياناً أحس بدوخة إذا وقفت بسرعة، خصوصاً في الصباح.
الطبيب: هل حصل إغماء؟
المريض: لا، لكن مرة حسيت أني بقرب أطيح واضطريت أجلس.
الطبيب: هل غيرت جرعات أدويتك مؤخراً؟
المريض: لا، نفس الجرعات من زمان.`,
    defaultTranscriptAr: `الطبيب: هل لديك أمراض مزمنة؟
المريض: عندي ضغط، لكنه متحكم فيه الحمدلله.
الطبيب: هل تستخدم علاجاً للضغط؟
المريض: نعم، آخذ حبة الصباح وحبة بالليل.
الطبيب: هل تتذكر أسماء الأدوية؟
المريض: واحد اسمه تقريباً يبدأ بـ A، والثاني ما أتذكره.
الطبيب: هل واجهت أي أعراض مؤخراً؟
المريض: أحياناً أحس بدوخة إذا وقفت بسرعة، خصوصاً في الصباح.
الطبيب: هل حصل إغماء؟
المريض: لا، لكن مرة حسيت أني بقرب أطيح واضطريت أجلس.
الطبيب: هل غيرت جرعات أدويتك مؤخراً؟
المريض: لا، نفس الجرعات من زمان.`,
    liveQuestions: [
      {
        id: 'lq-a1',
        clinicalImportance: 'إعادة ضبط جرعة الأملوديبين إلى 5 ملجم مرة واحدة لتجنب هبوط الضغط الحاد أثناء التخدير',
        clinicalImportanceAr: 'إعادة ضبط جرعة الأملوديبين إلى 5 ملجم مرة واحدة لتجنب هبوط الضغط الحاد أثناء التخدير',
        question: 'هل وصف لك الطبيب حبة واحدة يومياً أم حبتين؟ وما هو تركيز الحبة المسجل على العلبة؟',
        questionAr: 'هل وصف لك الطبيب حبة واحدة يومياً أم حبتين؟ وما هو تركيز الحبة المسجل على العلبة؟',
        isAsked: false
      }
    ],
    discriminatingQuestion: {
      id: 'dq-abdullah',
      title: 'السؤال الحاسم لضبط جرعة دواء الضغط وتفادي هبوط الضغط',
      titleAr: 'السؤال الحاسم لضبط جرعة دواء الضغط وتفادي هبوط الضغط التخديري',
      clinicalRationale: 'المريض يتناول جرعة مضاعفة (10 ملجم مرتين) مما سبب ضغطاً منخفضاً 92/58 وهبوطاً انتصابياً قبل الجراحة.',
      clinicalRationaleAr: 'المريض يتناول جرعة مضاعفة (10 ملجم مرتين) مما سبب ضغطاً منخفضاً 92/58 وهبوطاً انتصابياً قبل الجراحة.',
      question: 'هل توافق على تعديل الجرعة إلى 5 ملجم مرة واحدة يومياً صباحاً تحت إشراف طبي؟',
      questionAr: 'هل توافق على تعديل الجرعة إلى 5 ملجم مرة واحدة يومياً صباحاً تحت إشراف طبي؟',
      autoInferredChoiceIndex: 0,
      autoInferredBadge: 'Medication Over-Dose Detected',
      autoInferredBadgeAr: 'رصد إفراط دوائي غير مقصود',
      options: [
        {
          id: 'opt-1',
          text: 'Agree to adjust Amlodipine dose to 5mg once daily (Stabilizes BP for surgery)',
          textAr: 'أوافق على تعديل الجرعة إلى 5 ملجم مرة واحدة يومياً (يعيد استقرار الضغط للجراحة)',
          isAutoInferred: true,
          pointsToDiagnosisId: 'pos-a1'
        },
        {
          id: 'opt-2',
          text: 'Continue current double dosing',
          textAr: 'الاستمرار بالجرعة المضاعفة',
          isAutoInferred: false,
          pointsToDiagnosisId: 'pos-a2'
        }
      ]
    },
    preOpSummary: {
      asaClass: 'ASA II (Hypertension with iatrogenic orthostatic hypotension)',
      airwayRisk: 'Mallampati Class I - Low Risk',
      airwayRiskAr: 'مالامباتي الدرجة الأولى - خطورة منخفضة',
      cardiacRisk: 'RCRI Score 0 - Minimal Risk',
      cardiacRiskAr: 'مؤشر خطورة قلبية 0',
      metabolicStatus: 'Normal Renal Function & Electrolytes',
      metabolicStatusAr: 'وظائف كلى وأملاح طبيعية',
      surgicalProcedure: 'Inguinal Hernia Mesh Repair',
      surgicalProcedureAr: 'إصلاح فتق إربي بالشبكة',
      plannedDate: '2026-09-22',
      medicationPlan: [
        {
          medication: 'Amlodipine Besylate',
          dose: 'Reduce to 5mg Once Daily',
          sector: 'MOH',
          action: 'reconcile',
          actionAr: 'تخفيض الجرعة إلى 5 ملجم مرة واحدة يومياً صباحاً',
          rationale: 'Prevent severe intraoperative hypotension under spinal/general anesthesia.',
          rationaleAr: 'منع هبوط الضغط الحاد أثناء التخدير النصفي أو العام.'
        }
      ],
      verifiedByClinician: false
    }
  },

  // =========================================================================
  // PATIENT 6: نور سعد (NOUR SAAD) - MRN-10298
  // =========================================================================
  {
    id: 'pat-006',
    photoUrl: '/sarah.jpg',
    nationalId: '10678912345',
    mrn: 'MRN-10298',
    name: 'Nour Saad',
    nameAr: 'نور سعد',
    age: 34,
    gender: 'female',
    genderAr: 'أنثى',
    bloodGroup: 'A-',
    visitStatus: 'Completed',
    visitStatusAr: 'مكتمل',
    allergies: [],
    chronicConditions: [],
    visitReason: 'Routine Pre-Op Gynecological Clearance',
    visitReasonAr: 'فحص روتيني لما قبل جراحة النساء',
    clinicName: 'Women Health Clinic',
    clinicNameAr: 'عيادة صحة المرأة',
    doctorName: 'Dr. Sarah Mohammed',
    doctorNameAr: 'د. سارة محمد (استشاري)',
    scheduledProcedure: 'Hysteroscopy & Polypectomy',
    scheduledProcedureAr: 'منظار رحمي واستئصال لحمية',
    procedureDate: '2026-09-24',
    appointmentTime: '11:00 AM',
    appointmentTimeAr: '11:00 ص',
    triageLevel: 'low',
    hospital: 'King Fahad Medical City',
    hospitalAr: 'مدينة الملك فهد الطبية',
    primaryDiagnosis: 'Benign Endometrial Polyp',
    primaryDiagnosisAr: 'لحمية رحمية حميدة',
    sectors: ['MOH'],
    vitals: {
      measuredTimeAgo: '45 mins ago',
      measuredTimeAgoAr: 'قبل 45 دقيقة',
      bp: '118/76 mmHg',
      bpStatus: 'normal',
      heartRate: 74,
      hrStatus: 'normal',
      temp: '36.8 °C',
      tempStatus: 'normal',
      spo2: '99%',
      spo2Status: 'normal'
    },
    medications: [],
    pastProcedures: [],
    pastLabs: [],
    timeline: [
      {
        id: 'tl-601',
        year: 2024,
        date: '2024-05-10',
        title: 'Polyp Identified on Ultrasound',
        titleAr: 'اكتشاف اللحمية بالأشعة الصوتية',
        type: 'diagnosis',
        sector: 'MOH',
        sectorAr: 'وزارة الصحة',
        description: 'Routine follow-up ultrasound.',
        descriptionAr: 'موجات فوق صوتية روتينية أظهرت لحمية صغيرة.'
      }
    ],
    initialDialogue: [],
    defaultTranscript: 'Doctor: Pre-op clearance complete, vitals stable.\nPatient: Thank you Doctor.',
    defaultTranscriptAr: 'الطبيب: تم الفحص السريري الروتيني والعلامات الحيوية طبيعية تماماً.\nالمريضة: شكراً جزيلاً دكتورة.',
    liveQuestions: [],
    discriminatingQuestion: {
      id: 'dq-6',
      title: 'Bleeding Assessment',
      titleAr: 'تقييم النزيف',
      clinicalRationale: 'Verify absence of abnormal bleeding',
      clinicalRationaleAr: 'التأكد من عدم وجود نزيف غير طبيعي',
      question: 'Are there any recent abnormal bleeding episodes?',
      questionAr: 'هل توجد أي نوبات نزيف غير طبيعية حديثاً؟',
      autoInferredChoiceIndex: 1,
      autoInferredBadge: 'Stable',
      autoInferredBadgeAr: 'مستقرة',
      options: [
        { id: 'opt-61', text: 'Yes', textAr: 'نعم', pointsToDiagnosisId: 'pos-61' },
        { id: 'opt-62', text: 'No', textAr: 'لا', isAutoInferred: true, pointsToDiagnosisId: 'pos-62' }
      ]
    },
    preOpSummary: {
      asaClass: 'ASA I',
      airwayRisk: 'Mallampati I - Low',
      airwayRiskAr: 'مالامباتي 1 - منخفض',
      cardiacRisk: 'Low Risk',
      cardiacRiskAr: 'منخفض الخطورة',
      metabolicStatus: 'Normal',
      metabolicStatusAr: 'طبيعي',
      surgicalProcedure: 'Hysteroscopy',
      surgicalProcedureAr: 'منظار رحمي',
      plannedDate: '2026-09-24',
      medicationPlan: [],
      verifiedByClinician: true
    }
  },

  // =========================================================================
  // PATIENT 7: ريان خالد (RAYAN KHALID) - MRN-10299
  // =========================================================================
  {
    id: 'pat-007',
    photoUrl: '/saud.jpg',
    nationalId: '10789123456',
    mrn: 'MRN-10299',
    name: 'Rayan Khalid',
    nameAr: 'ريان خالد',
    age: 29,
    gender: 'male',
    genderAr: 'ذكر',
    bloodGroup: 'B-',
    visitStatus: 'Waiting',
    visitStatusAr: 'بالانتظار',
    allergies: [],
    chronicConditions: [
      { name: 'Sports Injury - ACL Tear', nameAr: 'تمزق الرباط الصليبي الأمامي' }
    ],
    visitReason: 'Pre-operative assessment for ACL reconstruction',
    visitReasonAr: 'تقييم ما قبل التخدير لترميم الرباط الصليبي',
    clinicName: 'Sports Medicine & Orthopedics',
    clinicNameAr: 'عيادة الطب الرياضي وجراحة المفاصل',
    doctorName: 'Dr. Sarah Mohammed',
    doctorNameAr: 'د. سارة محمد (استشاري)',
    scheduledProcedure: 'Arthroscopic ACL Reconstruction',
    scheduledProcedureAr: 'ترميم الرباط الصليبي بالمنظار',
    procedureDate: '2026-09-26',
    appointmentTime: '11:30 AM',
    appointmentTimeAr: '11:30 ص',
    triageLevel: 'low',
    hospital: 'King Abdulaziz Medical City (NGHA)',
    hospitalAr: 'مدينة الملك عبدالعزيز الطبية (الحرس الوطني)',
    primaryDiagnosis: 'Right Knee Anterior Cruciate Ligament Rupture',
    primaryDiagnosisAr: 'تمزق كامل بالرباط الصليبي الأمامي للركبة اليمنى',
    sectors: ['NGHA'],
    vitals: {
      measuredTimeAgo: '15 mins ago',
      measuredTimeAgoAr: 'قبل 15 دقيقة',
      bp: '122/80 mmHg',
      bpStatus: 'normal',
      heartRate: 68,
      hrStatus: 'normal',
      temp: '37.0 °C',
      tempStatus: 'normal',
      spo2: '99%',
      spo2Status: 'normal'
    },
    medications: [],
    pastProcedures: [],
    pastLabs: [],
    timeline: [
      {
        id: 'tl-701',
        year: 2026,
        date: '2026-07-15',
        title: 'Football Knee Trauma',
        titleAr: 'إصابة رياضية بمفصل الركبة',
        type: 'er_visit',
        sector: 'NGHA',
        sectorAr: 'الحرس الوطني',
        description: 'Twisting injury while playing football, MRI confirmed ACL tear.',
        descriptionAr: 'التواء مفصلي حاد أثناء لعب كرة القدم، الرنين المغناطيسي أكد التمزق.'
      }
    ],
    initialDialogue: [],
    defaultTranscript: 'Doctor: Any past medical issues?\nPatient: No, I am generally very active and fit.',
    defaultTranscriptAr: 'الطبيب: هل تعاني من أي أمراض مزمنة أو مشاكل صحية سابقة؟\nالمريض: لا الحمدلله، صحتي ممتازة وأمارس الرياضة بانتظام.',
    liveQuestions: [],
    discriminatingQuestion: {
      id: 'dq-7',
      title: 'Fitness Assessment',
      titleAr: 'اللياقة البدنية والتخدير',
      clinicalRationale: 'Cardiovascular tolerance for athletic young adult',
      clinicalRationaleAr: 'تحمل الجهاز القلبي الوعائي لشاب رياضي',
      question: 'Do you tolerate vigorous exercise without chest tightness?',
      questionAr: 'هل تمارس التمارين الشاقة دون أي ضيق بالصدر؟',
      autoInferredChoiceIndex: 0,
      autoInferredBadge: 'High METS',
      autoInferredBadgeAr: 'لياقة عالية',
      options: [
        { id: 'opt-71', text: 'Yes', textAr: 'نعم', isAutoInferred: true, pointsToDiagnosisId: 'pos-71' },
        { id: 'opt-72', text: 'No', textAr: 'لا', pointsToDiagnosisId: 'pos-72' }
      ]
    },
    preOpSummary: {
      asaClass: 'ASA I',
      airwayRisk: 'Mallampati I - Easy',
      airwayRiskAr: 'مالامباتي 1 - سهل',
      cardiacRisk: 'Very Low',
      cardiacRiskAr: 'منخفض جداً',
      metabolicStatus: 'Excellent',
      metabolicStatusAr: 'ممتاز',
      surgicalProcedure: 'ACL Reconstruction',
      surgicalProcedureAr: 'ترميم الرباط الصليبي',
      plannedDate: '2026-09-26',
      medicationPlan: [],
      verifiedByClinician: false
    }
  },

  // =========================================================================
  // PATIENT 8: لمى فيصل (LAMA FAISAL) - MRN-10300
  // =========================================================================
  {
    id: 'pat-008',
    photoUrl: '/noura.jpg',
    nationalId: '10891234567',
    mrn: 'MRN-10300',
    name: 'Lama Faisal',
    nameAr: 'لمى فيصل',
    age: 41,
    gender: 'female',
    genderAr: 'أنثى',
    bloodGroup: 'O+',
    visitStatus: 'Completed',
    visitStatusAr: 'مكتمل',
    allergies: [],
    chronicConditions: [
      { name: 'Hypothyroidism', nameAr: 'قصور الغدة الدرقية' }
    ],
    visitReason: 'Pre-operative clearance for thyroid nodule resection',
    visitReasonAr: 'تقييم ما قبل التخدير لاستئصال عقدة درقية',
    clinicName: 'Endocrine & Head/Neck Surgery',
    clinicNameAr: 'عيادة الغدد الصماء وجراحة الرأس والعنق',
    doctorName: 'Dr. Sarah Mohammed',
    doctorNameAr: 'د. سارة محمد (استشاري)',
    scheduledProcedure: 'Hemithyroidectomy (Right)',
    scheduledProcedureAr: 'استئصال نصف الغدة الدرقية الأيمن',
    procedureDate: '2026-09-28',
    appointmentTime: '12:00 PM',
    appointmentTimeAr: '12:00 م',
    triageLevel: 'low',
    hospital: 'King Fahad Medical City',
    hospitalAr: 'مدينة الملك فهد الطبية',
    primaryDiagnosis: 'Euthyroid Solitary Right Thyroid Nodule',
    primaryDiagnosisAr: 'عقدة درقية يمنى منعزلة مع وظائف درقية متزنة',
    sectors: ['MOH'],
    vitals: {
      measuredTimeAgo: '1 hour ago',
      measuredTimeAgoAr: 'قبل ساعة',
      bp: '124/82 mmHg',
      bpStatus: 'normal',
      heartRate: 72,
      hrStatus: 'normal',
      temp: '36.9 °C',
      tempStatus: 'normal',
      spo2: '98%',
      spo2Status: 'normal'
    },
    medications: [
      {
        id: 'med-801',
        name: 'Levothyroxine',
        genericName: 'Levothyroxine Sodium',
        dose: '75 mcg',
        frequency: 'Once Daily (Fasting)',
        route: 'Oral',
        sector: 'MOH',
        sectorAr: 'وزارة الصحة',
        sectorHospital: 'KFMC Endocrine Clinic',
        sectorHospitalAr: 'عيادة الغدد الصماء - مدينة الملك فهد',
        status: 'active',
        prescribedDate: '2022-01-15',
        prescriberName: 'Dr. Mona Al-Shehri',
        mentionStatus: 'historical'
      }
    ],
    pastProcedures: [],
    pastLabs: [
      {
        id: 'lab-801',
        testName: 'TSH & Free T4',
        testNameAr: 'تحليل هرمون الغدة الدرقية (TSH)',
        result: 'TSH 1.8 mIU/L (Euthyroid State)',
        resultAr: 'TSH 1.8 (متزن وطبيعي)',
        date: '2026-08-20',
        status: 'normal',
        mentionStatus: 'historical'
      }
    ],
    timeline: [
      {
        id: 'tl-801',
        year: 2022,
        date: '2022-01-10',
        title: 'Hypothyroidism Diagnosed',
        titleAr: 'تشخيص خمول الغدة الدرقية وبدء الثايروكسين',
        type: 'diagnosis',
        sector: 'MOH',
        sectorAr: 'وزارة الصحة',
        description: 'Initiated on Levothyroxine with well-controlled levels.',
        descriptionAr: 'بدء ليفوثايروكسين مع استقرار تام للمستويات الهرمونية.'
      }
    ],
    initialDialogue: [],
    defaultTranscript: 'Doctor: Thyroid levels are well controlled. Take morning dose with small sip of water.\nPatient: Understood Doctor, thank you.',
    defaultTranscriptAr: 'الطبيب: وظائف الغدة متزنة وممتازة. تناولي حبة الثايروكسين في صباح يوم العملية مع رشفة ماء صغيرة.\nالمريضة: تمام يا دكتورة، شكراً لك.',
    liveQuestions: [],
    discriminatingQuestion: {
      id: 'dq-8',
      title: 'Vocal Cord Function',
      titleAr: 'سلامة الأحبال الصوتية',
      clinicalRationale: 'Preoperative baseline voice assessment',
      clinicalRationaleAr: 'تقييم خط الأساس للصوت قبل جراحة الغدة',
      question: 'Have you experienced any voice hoarseness or changes?',
      questionAr: 'هل واجهتِ أي بحة أو تغير في الصوت مؤخراً؟',
      autoInferredChoiceIndex: 1,
      autoInferredBadge: 'Normal Voice',
      autoInferredBadgeAr: 'صوت طبيعي',
      options: [
        { id: 'opt-81', text: 'Yes', textAr: 'نعم', pointsToDiagnosisId: 'pos-81' },
        { id: 'opt-82', text: 'No', textAr: 'لا', isAutoInferred: true, pointsToDiagnosisId: 'pos-82' }
      ]
    },
    preOpSummary: {
      asaClass: 'ASA II (Euthyroid controlled)',
      airwayRisk: 'Mallampati II - Pre-op vocal cord check normal',
      airwayRiskAr: 'مالامباتي 2 - الأحبال الصوتية سليمة',
      cardiacRisk: 'Minimal',
      cardiacRiskAr: 'أدنى خطورة',
      metabolicStatus: 'Euthyroid',
      metabolicStatusAr: 'وظائف درقية متزنة',
      surgicalProcedure: 'Hemithyroidectomy',
      surgicalProcedureAr: 'استئصال نصف الغدة الدرقية',
      plannedDate: '2026-09-28',
      medicationPlan: [
        {
          medication: 'Levothyroxine',
          dose: '75 mcg',
          sector: 'MOH',
          action: 'continue',
          actionAr: 'الاستمرار صباح العملية مع رشفة ماء',
          rationale: 'Maintain euthyroid metabolic state.',
          rationaleAr: 'الحفاظ على توازن هرمون الغدة.'
        }
      ],
      verifiedByClinician: true
    }
  }
];
