import type { ClinicalAnalysisResponse } from '../services/clinicalAnalysisService';

export interface PresetClinicalScenario {
  id: string;
  badgeAr: string;
  badgeEn: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  category: 'cardio' | 'allergy' | 'medication' | 'anesthesia' | 'investigation';
  transcriptAr: string;
  transcriptEn: string;
  analysis: ClinicalAnalysisResponse;
}

export const PRESET_CLINICAL_SCENARIOS: PresetClinicalScenario[] = [
  // --------------------------------------------------------------------------
  // SCENARIO 1: دوخة وضعية عند الوقوف + نسيان علاج الضغط
  // --------------------------------------------------------------------------
  {
    id: 'scen-orthostatic-htn',
    category: 'cardio',
    badgeAr: 'ضغط الدم والدوخة',
    badgeEn: 'Cardio / HTN',
    titleAr: 'دوخة عند الوقوف ونسيان علاج الضغط (أملوديبين)',
    titleEn: 'Postural Dizziness & Forgotten BP Med (Amlodipine)',
    descriptionAr: 'المريض يشكو من دوخة وضعية مستمرة منذ 3 أسابيع، ويتناول دواء ضغط نسي اسمه تم استرجاعه من السجل.',
    descriptionEn: 'Patient reports 3-week orthostatic dizziness and takes an unnamed BP medication identified via EHR as Amlodipine.',
    transcriptAr: `المريض: يا دكتورة أحس بدوخة مستمرة خصوصاً لما أوقف بسرعة من السرير، بدأت معي من 3 أسابيع تقريباً. وآخذ علاج للضغط بس ناسي اسمه والله، حبة بيضاء صغيرة كل صباح.
الطبيب: هل الدوخة تصاحبها غشاوة في الرؤية أو خفقان؟ وهل قست ضغطك وأنت واقف؟
المريض: نعم تجيني غشاوة خفيفة لعدة ثوانٍ وتخف إذا جلست، وضغطي ما قسته وأنا واقف أبداً.`,
    transcriptEn: `Patient: Doctor, I've been feeling dizzy, especially when I stand up quickly from bed. It started about 3 weeks ago. I also take medicine for my blood pressure, but I forgot its name—a small white pill every morning.
Doctor: Does the dizziness come with blurred vision or palpitations? Have you checked your blood pressure while standing?
Patient: Yes, my vision blurs slightly for a few seconds and improves when I sit down. I haven't measured my blood pressure standing.`,
    analysis: {
      extractedInformation: {
        symptoms: [
          { text: 'Orthostatic dizziness', textAr: 'دوخة وضعية عند الوقوف المفاجئ' },
          { text: 'Transient blurred vision', textAr: 'غشاوة بصرية عابرة عند النهوض' }
        ],
        duration: '3 weeks',
        trigger: 'Standing up quickly from bed',
        medications: [
          { name: 'Amlodipine 5mg (Wasfaty / MOH)', status: 'unconfirmed_by_patient_confirmed_in_EHR' }
        ],
        allergies: ['Penicillin (Severe)'],
        relevantHistory: ['Essential Hypertension', 'Type 2 Diabetes']
      },
      patientMemoryMatches: [
        {
          category: 'medication',
          matchedEntity: 'Amlodipine Besylate 5 mg (Once Daily)',
          matchedEntityAr: 'أملوديبين 5 ملجم (حبة صباحاً من وصفتي - وزارة الصحة)',
          source: 'MOH',
          statement: 'Possible match from patient record - clinician verification required',
          statementAr: 'تطابق محتمل من السجل الطبي (وصفتي/وزارة الصحة) - يلزم التحقق السريري'
        }
      ],
      whatNeedsAttention: [
        {
          id: 'att-101',
          category: 'مؤشر سريري محتمل',
          categoryAr: 'مؤشر سريري محتمل',
          title: 'ارتباط الدوخة بالوقوف يرجح هبوط الضغط الانتصابي الناتج عن موسعات الأوعية (Amlodipine).',
          titleAr: 'ارتباط الدوخة بالوقوف يرجح هبوط الضغط الانتصابي الناتج عن موسعات الأوعية (Amlodipine).',
          severity: 'medium'
        },
        {
          id: 'att-102',
          category: 'تعارض دوائي',
          categoryAr: 'تعارض دوائي',
          title: 'المريض ذكر علاج الضغط شفهياً دون تحديد الاسم، والربط يوضح استمراره على أملوديبين 5 ملجم.',
          titleAr: 'المريض ذكر علاج الضغط شفهياً دون تحديد الاسم، والربط يوضح استمراره على أملوديبين 5 ملجم.',
          severity: 'high'
        },
        {
          id: 'att-103',
          category: 'معلومات ناقصة',
          categoryAr: 'معلومات ناقصة',
          title: 'يلزم قياس ضغط الدم في وضعيتي الاستلقاء والوقوف (Lying & Standing BP) لتوثيق الهبوط الانتصابي.',
          titleAr: 'يلزم قياس ضغط الدم في وضعيتي الاستلقاء والوقوف (Lying & Standing BP) لتوثيق الهبوط الانتصابي.',
          severity: 'medium'
        }
      ],
      smartQuestion: {
        id: 'sq-101',
        question: 'Has the patient experienced any syncope (loss of consciousness), falls, or chest tightness during these dizziness episodes?',
        questionAr: 'المريض ذكر الدوخة عند الوقوف دون إغماء كامل. هل عانى من أي نوبات سقوط مفاجئ أو فقدان للوعي أو ضيق بالصدر؟',
        options: ['نعم', 'لا', 'غير متأكد']
      },
      clinicalPossibilities: [
        {
          id: 'pos-101',
          name: 'Orthostatic Hypotension (Drug-Induced)',
          nameAr: 'هبوط الضغط الانتصابي الدوائي (ناتج عن حاصرات قنوات الكالسيوم)',
          likelihood: 'Higher likelihood',
          evidenceFromConversation: [
            'Dizziness specifically triggered upon standing quickly',
            'Symptoms started 3 weeks ago',
            'Daily morning blood pressure pill reported'
          ],
          evidenceFromConversationAr: [
            'تحفز الدوخة حصراً عند النهوض السريع من الفراش',
            'بدء الأعراض منذ 3 أسابيع',
            'تناول حبة ضغط يومية صباحاً'
          ],
          evidenceFromRecord: [
            'Amlodipine 5mg active prescription from Al-Malaz PHC (MOH)',
            'History of Essential Hypertension'
          ],
          evidenceFromRecordAr: [
            'وصفة أملوديبين 5 ملجم نشطة بمركز صحي الملز (وزارة الصحة)',
            'تشخيص موثق بارتفاع ضغط الدم المزمن'
          ],
          discriminatingQuestions: [
            {
              question: 'Does the dizziness resolve within 1-2 minutes after sitting down?',
              questionAr: 'هل تزول الدوخة وتتحسن الرؤية خلال دقيقة إلى دقيقتين بمجرد الجلوس أو الاستلقاء؟'
            }
          ]
        },
        {
          id: 'pos-102',
          name: 'Autonomic Neuropathy or Volume Depletion',
          nameAr: 'اعتلال عصبي لاإرادي سكري أو نقص نسبي في سوائل الجسم',
          likelihood: 'Moderate likelihood',
          evidenceFromConversation: ['Mild blurred vision with posture changes'],
          evidenceFromConversationAr: ['غشاوة بصرية خفيفة مع التغيرات الوضعية'],
          evidenceFromRecord: ['Type 2 Diabetes for over 5 years (Metformin 500mg BID)'],
          evidenceFromRecordAr: ['داء السكري لأكثر من 5 سنوات ومستمر على ميتفورمين'],
          discriminatingQuestions: [
            {
              question: 'Has the patient noticed dry mouth or decreased fluid intake recently?',
              questionAr: 'هل يعاني المريض من جفاف بالفم أو قلة شرب السوائل خاصة في أوقات الصيف؟'
            }
          ]
        }
      ],
      clinicalSummary: {
        en: 'Pre-operative evaluation reveals postural dizziness strongly suggestive of orthostatic hypotension secondary to Amlodipine 5mg. Cross-checked with Saudi MOH Hypertension Protocols and NICE NG45 pre-op clearance.',
        ar: 'التقييم السريري يظهر دوخة وضعية ترجح هبوط الضغط الانتصابي الناجم عن علاج أملوديبين 5 ملجم. تمت المطابقة مع الدليل الوطني لوزارة الصحة وبروتوكولات التقييم الجراحي لـ NICE.'
      },
      clinicalReferences: [
        {
          tag: 'MOH-SA-PROTOCOLS',
          titleAr: 'الأدلة السريرية الوطنية — وزارة الصحة السعودية',
          titleEn: 'Saudi MOH National Clinical Practice Protocols',
          rationaleAr: 'مطابقة بروتوكول علاج ارتفاع ضغط الدم والتقييم قبل الجراحي المعتمد بمستشفيات وزارة الصحة.',
          url: 'https://www.moh.gov.sa/en/ministry/mediacenter/publications/pages/protocols.aspx'
        },
        {
          tag: 'PHA-WEQAYA-2024',
          titleAr: 'دليل عوامل الخطورة والأمراض المزمنة — هيئة الصحة العامة (وقاية)',
          titleEn: 'Public Health Authority (Weqaya / PHA) Risk Factors',
          rationaleAr: 'تقييم مخاطر هبوط الضغط والتحكم بالسكري قبل التخدير لتفادي تذبذب التروية الدموية.',
          url: 'https://www.pha.gov.sa/ar-sa/Healthportal/Pages/RiskFactor.aspx'
        },
        {
          tag: 'US-FDA-DRUGS',
          titleAr: 'قاعدة بيانات سلامة الأدوية — هيئة الغذاء والدواء (FDA)',
          titleEn: 'FDA Drugs Database & Clinical Safety Information',
          rationaleAr: 'التحقق من الآثار الجانبية لحاصرات قنوات الكالسيوم (Amlodipine) وضوابط الجرعات الجراحية.',
          url: 'https://www.fda.gov/drugs'
        }
      ]
    }
  },

  // --------------------------------------------------------------------------
  // SCENARIO 2: استرجاع تخطيط القلب والفحوصات من مدينة الملك فهد الطبية
  // --------------------------------------------------------------------------
  {
    id: 'scen-ecg-retrieval',
    category: 'investigation',
    badgeAr: 'تخطيط وفحوصات القلب',
    badgeEn: 'ECG & Investigations',
    titleAr: 'استرجاع تخطيط القلب وفحوصات سابقة (مدينة الملك فهد الطبية)',
    titleEn: 'ECG History & Investigations Retrieval (KFMC)',
    descriptionAr: 'استرجاع فوري لنتائج تخطيط القلب والتحاليل المخبرية من مستشفى حكومي موحد وتفادي إعادة الفحوصات غير الضرورية.',
    descriptionEn: 'Instant retrieval of previous ECG and lab tests from King Fahad Medical City, preventing redundant testing.',
    transcriptAr: `الطبيب: متى آخر مرة عملت تخطيط قلب وفحوصات دورية سابقة للقلب والسكري؟
المريض: عملت تخطيط قلب وفحوصات في مدينة الملك فهد الطبية قبل حوالي 6 أشهر، وقالوا لي وقتها التخطيط سليم بس فيه نبض متسارع بسيط، وما جبت الأوراق معي.
الطبيب: ممتاز، السجل الموحد أظهر تخطيط القلب بتاريخ مارس 2025: ريثم جيبي طبيعي مع سرعة 82، وفحص التراكمي السكر 7.1%.`,
    transcriptEn: `Doctor: When was your last ECG test and routine check-up for heart and diabetes?
Patient: I did an ECG and lab tests at King Fahad Medical City about 6 months ago. The doctor said the ECG was normal with mild sinus tachycardia, but I didn't bring the printout with me.
Doctor: Excellent, the unified EHR shows your ECG from March 2025: Normal Sinus Rhythm at 82 bpm, and HbA1c is 7.1%.`,
    analysis: {
      extractedInformation: {
        symptoms: [{ text: 'Mild baseline sinus tachycardia', textAr: 'تسارع نبض بسيط سابق دون أعراض حادة' }],
        duration: '6 months ago',
        trigger: 'Routine cardiology follow-up',
        medications: [{ name: 'Metformin 500mg', status: 'confirmed' }],
        allergies: ['Penicillin (Severe)'],
        relevantHistory: ['Normal Sinus Rhythm ECG (KFMC)', 'HbA1c 7.1%']
      },
      patientMemoryMatches: [
        {
          category: 'investigation',
          matchedEntity: '12-Lead Electrocardiogram (ECG) — Normal Sinus Rhythm',
          matchedEntityAr: 'تخطيط قلب كهربائي 12-قناة — ريثم جيبي سليم (مدينة الملك فهد الطبية)',
          source: 'MOH',
          statement: 'Verified record match from King Fahad Medical City — no repeat testing needed',
          statementAr: 'سجل موثق من مدينة الملك فهد الطبية — لا داعي لإعادة الفحص وفق إرشادات NICE'
        }
      ],
      whatNeedsAttention: [
        {
          id: 'att-201',
          category: 'مؤشر سريري محتمل',
          categoryAr: 'مؤشر سريري محتمل',
          title: 'تخطيط القلب خلال 6 أشهر سليم ومستقر، ولا توجد دلالات نقص تروية أو اضطراب نظم.',
          titleAr: 'تخطيط القلب خلال 6 أشهر سليم ومستقر، ولا توجد دلالات نقص تروية أو اضطراب نظم.',
          severity: 'low'
        },
        {
          id: 'att-202',
          category: 'معلومات ناقصة',
          categoryAr: 'معلومات ناقصة',
          title: 'التحقق من القدرة الوظيفية الحركية (Functional Capacity ≥ 4 METs) مثل صعود طابقين دون ضيق نفس.',
          titleAr: 'التحقق من القدرة الوظيفية الحركية (Functional Capacity ≥ 4 METs) مثل صعود طابقين دون ضيق نفس.',
          severity: 'medium'
        }
      ],
      smartQuestion: {
        id: 'sq-201',
        question: 'Can the patient climb two flights of stairs or walk briskly without chest discomfort or significant shortness of breath?',
        questionAr: 'هل يستطيع المريض صعود طابقين من الدرج أو المشي السريع دون ألم في الصدر أو ضيق شديد في التنفس (قدرة وظيفية ≥ 4 METs)؟',
        options: ['نعم', 'لا', 'غير متأكد']
      },
      clinicalPossibilities: [
        {
          id: 'pos-201',
          name: 'Stable Cardiac Status (Low Pre-Operative Risk)',
          nameAr: 'استقرار قلبي وعائي منخفض المخاطر الجراحية',
          likelihood: 'Higher likelihood',
          evidenceFromConversation: ['Recent ECG documented as normal with mild tachycardia 6 months ago'],
          evidenceFromConversationAr: ['تخطيط قلب موثق قبل 6 أشهر سليم مع نبض متسارع بسيط'],
          evidenceFromRecord: ['Resting HR 82 bpm, Blood Pressure 138/88 mmHg, SpO2 97%'],
          evidenceFromRecordAr: ['النبض المكتبي 82 د/د، الضغط 138/88 ملم زئبق، الأكسجين 97%'],
          discriminatingQuestions: [
            {
              question: 'Has the patient felt any new palpitations or irregular heartbeats recently?',
              questionAr: 'هل شعر المريض بأي خفقان غير منتظم أو رفرفة مفاجئة في الصدر مؤخراً؟'
            }
          ]
        }
      ],
      clinicalSummary: {
        en: 'Previous 12-lead ECG from KFMC retrieved successfully. Findings confirm normal sinus rhythm and adequate glycemic control (HbA1c 7.1%). In line with NICE NG45 guidelines, repeat pre-op ECG is unnecessary in absence of new cardiac symptoms.',
        ar: 'تم بنجاح استرجاع تخطيط القلب السابق من مدينة الملك فهد الطبية؛ النتائج تؤكد ريثماً جيبياً طبيعياً وتحكماً مقبولاً بالسكري (7.1%). وفق توصيات NICE NG45، لا يلزم إعادة تخطيط القلب لعدم وجود أعراض مستجدة.'
      },
      clinicalReferences: [
        {
          tag: 'NICE-GUIDELINES',
          titleAr: 'إرشادات الفحوصات الروتينية قبل الجراحة — NICE NG45',
          titleEn: 'Routine Preoperative Tests for Elective Surgery (NICE NG45)',
          rationaleAr: 'عدم الحاجة لإعادة تخطيط القلب الروتيني للجراحات منخفضة إلى متوسطة الخطورة عند ثبوت استقرار التخطيط خلال 12 شهراً.',
          url: 'https://www.nice.org.uk/guidance/ng45'
        },
        {
          tag: 'MOH-SA-PROTOCOLS',
          titleAr: 'بروتوكولات مدينة الملك فهد الطبية ووزارة الصحة',
          titleEn: 'MOH & KFMC Clinical Protocols',
          rationaleAr: 'الاعتماد على الربط الرقمي الموحد للسجلات وتفادي الإجراءات المتكررة لتعزيز سلامة المرضى وكفاءة الموارد.',
          url: 'https://www.moh.gov.sa'
        }
      ]
    }
  },

  // --------------------------------------------------------------------------
  // SCENARIO 3: تعارض حرج: نفي الحساسية مقابل حساسية بنسلين موثقة بالسجل
  // --------------------------------------------------------------------------
  {
    id: 'scen-allergy-conflict',
    category: 'allergy',
    badgeAr: 'تنبيه أحمر: تعارض حساسية',
    badgeEn: 'Critical Allergy Conflict',
    titleAr: 'تعارض حرج: نفي الحساسية مقابل حساسية بنسلين موثقة بالسجل',
    titleEn: 'Penicillin Allergy Denial vs Documented Severe Anaphylaxis',
    descriptionAr: 'المريض ينفي شفهياً وجود أي حساسية، لكن السجل الطبي الموحد يحتوي على تسجيل صريح لحساسية مفرطة من البنسلين عام 2021 بالحرس الوطني.',
    descriptionEn: 'Patient verbally denies any drug allergy, but the unified EHR contains a documented severe penicillin anaphylaxis.',
    transcriptAr: `الطبيب: هل عندك أي حساسية من أدوية معينة أو حقن بنسلين سابقة؟
المريض: لا يا دكتورة، الحمد لله ما عندي أي حساسية من الأدوية نهائياً وكل شيء آخذه عادي.
الطبيب: لكن السجل الإلكتروني مسجل فيه تفاعل تحسسي شديد (طفح جلدي وضيق تنفس) مع البنسلين عام 2021 في مستشفى الحرس الوطني!`,
    transcriptEn: `Doctor: Do you have any allergies to specific medications or penicillin injections?
Patient: No Doctor, thank God, I have no allergies to medications at all. I take everything normally.
Doctor: But the unified medical record documents a severe allergic reaction (rash and bronchospasm) to Penicillin in 2021 at NGHA!`,
    analysis: {
      extractedInformation: {
        symptoms: [{ text: 'Verbal denial of drug allergies', textAr: 'نفي شفهي تام لوجود أي حساسية دوائية' }],
        duration: 'Lifelong assertion',
        trigger: 'Direct physician questioning',
        medications: [],
        allergies: ['Patient denies all allergies (Conflict with EHR Penicillin Anaphylaxis)'],
        relevantHistory: ['Penicillin Anaphylaxis documented at NGHA in 2021']
      },
      patientMemoryMatches: [
        {
          category: 'allergy',
          matchedEntity: 'Severe Penicillin Allergy (Anaphylaxis & Urticaria 2021)',
          matchedEntityAr: 'حساسية مفرطة للبنسلين (صدمة تأقية وشرى جلدي 2021 - الشؤون الصحية للحرس الوطني)',
          source: 'NGHA',
          statement: 'CRITICAL CONFLICT: Patient verbally denies allergy, but NGHA EHR documents severe life-threatening reaction',
          statementAr: 'تعارض حرج: المريض ينفي الحساسية شفهياً بينما سجل الحرس الوطني يوثق صدمة تأقية مهددة للحياة'
        }
      ],
      whatNeedsAttention: [
        {
          id: 'att-301',
          category: 'تعارض دوائي',
          categoryAr: 'تعارض دوائي',
          title: 'تعارض حرج: المريض ينفي الحساسية، والسجل يوثق حساسية بنسلين مفرطة تهدد الحياة.',
          titleAr: 'تعارض حرج: المريض ينفي الحساسية، والسجل يوثق حساسية بنسلين مفرطة تهدد الحياة.',
          severity: 'high'
        },
        {
          id: 'att-302',
          category: 'مؤشر سريري محتمل',
          categoryAr: 'مؤشر سريري محتمل',
          title: 'حظر مطلق لجميع مشتقات البنسلين والمضادات الحيوية من فئة بيتا لاكتام في المضاد الوقائي الجراحي.',
          titleAr: 'حظر مطلق لجميع مشتقات البنسلين والمضادات الحيوية من فئة بيتا لاكتام في المضاد الوقائي الجراحي.',
          severity: 'high'
        },
        {
          id: 'att-303',
          category: 'معلومات ناقصة',
          categoryAr: 'معلومات ناقصة',
          title: 'سؤال المريض عن تفاصيل التنويم بالطوارئ عام 2021 لتنشيط ذاكرته بشأن الحادثة.',
          titleAr: 'سؤال المريض عن تفاصيل التنويم بالطوارئ عام 2021 لتنشيط ذاكرته بشأن الحادثة.',
          severity: 'medium'
        }
      ],
      smartQuestion: {
        id: 'sq-301',
        question: 'Did the patient ever experience facial swelling, severe itching, or difficulty breathing after receiving an antibiotic injection or pills in 2021?',
        questionAr: 'هل تتذكر حدوث حكة شديدة أو تورم بالوجه والشفاه أو صعوبة في التنفس استدعت مراجعة الطوارئ بعد أخذ حقنة مضاد حيوي عام 2021؟',
        options: ['نعم', 'لا', 'غير متأكد']
      },
      clinicalPossibilities: [
        {
          id: 'pos-301',
          name: 'Confirmed Penicillin Hypersensitivity with Patient Misremembering',
          nameAr: 'حساسية بنسلين مثبتة مع نسيان المريض لتفاصيل الحادثة السابقة',
          likelihood: 'Higher likelihood',
          evidenceFromConversation: ['Patient states he takes everything normally and unaware of allergy record'],
          evidenceFromConversationAr: ['المريض يعتقد أنه يأخذ كل الأدوية بصورة طبيعية وغير مدرك للسجل'],
          evidenceFromRecord: [
            'Allergy Tag: Penicillin (Severe Anaphylaxis & Urticaria) at NGHA Hospital',
            'Cross-reactive cephalosporin precaution required'
          ],
          evidenceFromRecordAr: [
            'وسم الحساسية: بنسلين (صدمة تأقية وشرى) بمستشفى الحرس الوطني',
            'وجوب الحذر من التفاعلات المتصالبة مع السيفالوسبورينات'
          ],
          discriminatingQuestions: [
            {
              question: 'Has the patient taken Amoxicillin or Augmentin recently without any reaction?',
              questionAr: 'هل تناول المريض أي دواء أوجمنتين أو أموكسيسيلين مؤخراً دون مشاكل؟'
            }
          ]
        }
      ],
      clinicalSummary: {
        en: 'CRITICAL SAFETY ALERT: Discrepancy detected between patient verbal denial and documented severe Penicillin anaphylaxis in NGHA records. Beta-lactam surgical prophylaxis is strictly contraindicated. Alternative non-beta-lactam agent (e.g., Vancomycin or Clindamycin) mandated per Saudi MOH surgical prophylaxis guidelines.',
        ar: 'تنبيه أمان حرج: تم رصد تعارض صريح بين نفي المريض الشفهي وبين سجل الشؤون الصحية للحرس الوطني الذي يوثق صدمة تأقية مفرطة للبنسلين. يحظر تماماً إعطاء مضادات البيتا لاكتام كوقاية جراحية، ويجب اختيار بديل آمن (فانكومايسين/كليندامايسين) وفق الدليل الوطني لوزارة الصحة.'
      },
      clinicalReferences: [
        {
          tag: 'MOH-SA-PROTOCOLS',
          titleAr: 'دليل الوقاية بالمضادات الحيوية الجراحية — وزارة الصحة',
          titleEn: 'MOH Surgical Antibiotic Prophylaxis Guidelines',
          rationaleAr: 'إلزامية التحقق المزدوج من سجل الحساسية واختيار بدائل غير بنسلينية لمنع الصدمة التأقية أثناء التخدير.',
          url: 'https://www.moh.gov.sa'
        },
        {
          tag: 'US-FDA-DRUGS',
          titleAr: 'تحذيرات الحساسية الدوائية المفرطة — هيئة الغذاء والدواء (FDA)',
          titleEn: 'FDA Penicillin Hypersensitivity & Anaphylaxis Warnings',
          rationaleAr: 'توصيات الأمان الدولية لتجنب مشتقات البنسلين في المرضى ذوي السوابق التحسسية الحادة.',
          url: 'https://www.fda.gov/drugs'
        }
      ]
    }
  },

  // --------------------------------------------------------------------------
  // SCENARIO 4: استخدام مسكنات بروفين ومضادات الالتهاب مع ضغط الدم وألم المعدة
  // --------------------------------------------------------------------------
  {
    id: 'scen-nsaid-renal-gi',
    category: 'medication',
    badgeAr: 'مسكنات NSAIDs والكلى',
    badgeEn: 'NSAIDs & Renal Risk',
    titleAr: 'استخدام مسكنات بروفين (NSAIDs) مع الضغط وألم المعدة',
    titleEn: 'Over-the-Counter Ibuprofen with HTN & Gastric Pain',
    descriptionAr: 'المريض يتناول بروفين 400 ملجم مرتين باليوم لآلام المفاصل دون وصفة طبية مما يرفع خطر القصور الكلوي وقرحة المعدة والنزيف.',
    descriptionEn: 'Patient uses OTC Ibuprofen 400mg BID for joint pain, increasing risks of acute kidney injury, peptic ulcer, and bleeding.',
    transcriptAr: `المريض: عندي ألم بالركبة وآخذ بروفين 400 ملجم مرتين باليوم من أسبوعين بدون وصفة، وبدأت أحس بحرقة وألم بفم المعدة وغثيان بعد الأكل.
الطبيب: هل لاحظت أي قيء داكن أو براز أسود؟ والبروفين يتعارض مع أدوية الضغط وقد يجهد الكلى.
المريض: لا ما فيه براز أسود الحمد لله، بس الحرقة مزعجة خصوصاً لما أكون صائم.`,
    transcriptEn: `Patient: I have knee pain and have been taking Ibuprofen 400mg twice daily for 2 weeks over the counter. I started feeling stomach burning, epigastric pain, and mild nausea after meals.
Doctor: Have you noticed any dark vomit or black tarry stools? Ibuprofen interacts with blood pressure medications and stresses kidneys.
Patient: No black stools, thank God, but the heartburn is bothersome, especially when fasting.`,
    analysis: {
      extractedInformation: {
        symptoms: [
          { text: 'Epigastric burning pain', textAr: 'ألم وحرقة بفم المعدة' },
          { text: 'Mild postprandial nausea', textAr: 'غثيان خفيف بعد الوجبات' },
          { text: 'Bilateral knee pain', textAr: 'ألم مفصل الركبة' }
        ],
        duration: '2 weeks',
        trigger: 'OTC Ibuprofen 400mg BID',
        medications: [{ name: 'Ibuprofen 400mg (Self-prescribed)', status: 'active_unreported' }],
        allergies: ['Penicillin (Severe)'],
        relevantHistory: ['Essential Hypertension', 'Type 2 Diabetes']
      },
      patientMemoryMatches: [
        {
          category: 'medication',
          matchedEntity: 'Ibuprofen (Non-Steroidal Anti-Inflammatory Drug - NSAID)',
          matchedEntityAr: 'إيبوبروفين (مضاد التهاب غير ستيرويدي بدون وصفة طبية)',
          source: 'PRIVATE',
          statement: 'Active NSAID intake detected — interferes with renal autoregulation and blood pressure control',
          statementAr: 'تناول مسكن NSAIDs نشط — يعيق التروية الكلوية ويتداخل مع أدوية الضغط'
        }
      ],
      whatNeedsAttention: [
        {
          id: 'att-401',
          category: 'تعارض دوائي',
          categoryAr: 'تعارض دوائي',
          title: 'البروفين يقلل فاعلية خافضات الضغط ويزيد خطر القصور الكلوي الحاد بالتزامن مع الجراحة والتخدير.',
          titleAr: 'البروفين يقلل فاعلية خافضات الضغط ويزيد خطر القصور الكلوي الحاد بالتزامن مع الجراحة والتخدير.',
          severity: 'high'
        },
        {
          id: 'att-402',
          category: 'مؤشر سريري محتمل',
          categoryAr: 'مؤشر سريري محتمل',
          title: 'أعراض عسر الهضم وألم المعدة تشير لاحتمال التهاب المعدة الحاد (NSAID-Induced Gastritis).',
          titleAr: 'أعراض عسر الهضم وألم المعدة تشير لاحتمال التهاب المعدة الحاد (NSAID-Induced Gastritis).',
          severity: 'medium'
        }
      ],
      smartQuestion: {
        id: 'sq-401',
        question: 'Has the patient checked baseline serum creatinine and eGFR recently, or experienced changes in urine output?',
        questionAr: 'هل فحص المريض وظائف الكلى (الكرياتينين ومعدل الترشيح eGFR) مؤخراً، أو لاحظ أي تغير في كمية أو لون البول؟',
        options: ['نعم', 'لا', 'غير متأكد']
      },
      clinicalPossibilities: [
        {
          id: 'pos-401',
          name: 'NSAID-Induced Gastropathy & Impaired Renal Perfusion Risk',
          nameAr: 'اعتلال هضمي ناتج عن مضادات الالتهاب مع خطر تراجع التروية الكلوية',
          likelihood: 'Higher likelihood',
          evidenceFromConversation: ['Ibuprofen 400mg taken twice daily for 2 weeks', 'Epigastric pain and heartburn'],
          evidenceFromConversationAr: ['تناول إيبوبروفين 400 ملجم مرتين يومياً لأسبوعين', 'ألم وحرقة بفم المعدة وغثيان'],
          evidenceFromRecord: ['Active Amlodipine prescription', 'Type 2 Diabetes Mellitus'],
          evidenceFromRecordAr: ['علاج أملوديبين لضغط الدم', 'إصابة بالسكري النوع الثاني'],
          discriminatingQuestions: [
            {
              question: 'Does the epigastric burning improve after taking an antacid or food?',
              questionAr: 'هل تخف حرقة فم المعدة عند تناول مضادات الحموضة أو الحليب؟'
            }
          ]
        }
      ],
      clinicalSummary: {
        en: 'Patient has been self-administering high-dose Ibuprofen for 2 weeks resulting in epigastric irritation. NSAIDs must be discontinued immediately prior to surgery to preserve renal function and mitigate intraoperative platelet dysfunction. Paracetamol recommended as safer analgesic bridge.',
        ar: 'المريض يتناول جرعات متكررة من الإيبوبروفين دون وصفة مما سبب تهيجاً معدياً. يجب إيقاف مضادات الالتهاب (NSAIDs) فوراً قبل الجراحة لحماية وظائف الكلى وتجنب تثبيط الصفائح الدموية أثناء التخدير، مع استخدام الباراسيتامول كبديل آمن.'
      },
      clinicalReferences: [
        {
          tag: 'US-FDA-DRUGS',
          titleAr: 'تحذيرات مسكنات NSAIDs للكلى والمعدة — هيئة الغذاء والدواء (FDA)',
          titleEn: 'FDA NSAIDs Safety Warnings (GI Bleeding & Renal Toxicity)',
          rationaleAr: 'توصيات FDA بشأن إيقاف مضادات الالتهاب قبل العمليات الجراحية لتقليل مخاطر النزيف والقصور الكلوي.',
          url: 'https://www.fda.gov/drugs'
        },
        {
          tag: 'PHA-WEQAYA-2024',
          titleAr: 'إرشادات وقاية لصحة الكلى والسكري',
          titleEn: 'PHA Chronic Kidney Disease & Diabetes Risk Guidelines',
          rationaleAr: 'حماية الكلى لدى مرضى السكري وتجنب الأدوية السامة للكلى في مرحلة ما قبل الجراحة.',
          url: 'https://www.pha.gov.sa'
        }
      ]
    }
  },

  // --------------------------------------------------------------------------
  // SCENARIO 5: مميع الدم (Apixaban / Eliquis) وتوقيت الإيقاف الإلزامي
  // --------------------------------------------------------------------------
  {
    id: 'scen-anticoagulant-timing',
    category: 'medication',
    badgeAr: 'تنبيه نزيف: مميعات الدم',
    badgeEn: 'Anticoagulant Timing',
    titleAr: 'مميع الدم (Apixaban / Eliquis) وجدول الإيقاف قبل الجراحة',
    titleEn: 'Apixaban (DOAC) Timing & Perioperative Bleeding Risk',
    descriptionAr: 'المريض يتناول مميع دم فموي مباشر (Apixaban 5mg) وأخذ جرعة صباح اليوم، مما يتطلب تحديد نافذة إيقاف إلزامية قبل التخدير لتفادي النزيف.',
    descriptionEn: 'Patient is on Apixaban 5mg BID and took a morning dose today; requires strict 48-hour cessation window before surgery.',
    transcriptAr: `المريض: يا دكتورة أنا مستمر على حبوب السيولة Apixaban خمسة ملجم مرتين باليوم، وأخذت حبة الصباح الساعة 7 اليوم مع الفطور، ومحد نبهني أوقفها.
الطبيب: جراحتك مجدولة قريباً، وحبوب السيولة تزيد خطر النزيف الجراحي والتخدير النصفي ولا بد من إيقافها قبل العملية بـ 48 ساعة على الأقل.
المريض: يعني كذا راح تتأجل العملية؟ وهل فيه بدائل مؤقتة؟`,
    transcriptEn: `Patient: Doctor, I'm taking blood thinner pills, Apixaban 5mg twice daily. I took my morning dose at 7 AM today with breakfast—no one told me to stop it.
Doctor: Your surgery is scheduled soon, and blood thinners increase the risk of surgical bleeding and neuraxial hematoma; it must be held for at least 48 hours prior.
Patient: Does this mean surgery will be rescheduled? Are there temporary bridge alternatives?`,
    analysis: {
      extractedInformation: {
        symptoms: [{ text: 'No active bleeding reported', textAr: 'لا يوجد نزيف نشط حالياً' }],
        duration: 'Ongoing therapy for 1 year',
        trigger: 'Elective pre-op clearance',
        medications: [{ name: 'Apixaban (Eliquis) 5mg BID', status: 'taken_this_morning' }],
        allergies: ['Penicillin (Severe)'],
        relevantHistory: ['Atrial Fibrillation / DVT prophylaxis', 'NGHA prescription']
      },
      patientMemoryMatches: [
        {
          category: 'medication',
          matchedEntity: 'Apixaban 5 mg Oral Tablet (Twice Daily)',
          matchedEntityAr: 'أبيكسابان 5 ملجم فموي (مرتين يومياً - الشؤون الصحية للحرس الوطني)',
          source: 'NGHA',
          statement: 'Active DOAC confirmed in EHR — last dose taken today at 07:00 AM',
          statementAr: 'مميع دم مباشر نشط بالسجل — تم تناول آخر جرعة اليوم الساعة 07:00 صباحاً'
        }
      ],
      whatNeedsAttention: [
        {
          id: 'att-501',
          category: 'تعارض دوائي',
          categoryAr: 'تعارض دوائي',
          title: 'تناول Apixaban صباح اليوم يتعارض مع إجراء الجراحة الفورية أو التخدير النصفي (Neuraxial Anesthesia).',
          titleAr: 'تناول Apixaban صباح اليوم يتعارض مع إجراء الجراحة الفورية أو التخدير النصفي (Neuraxial Anesthesia).',
          severity: 'high'
        },
        {
          id: 'att-502',
          category: 'مؤشر سريري محتمل',
          categoryAr: 'مؤشر سريري محتمل',
          title: 'يلزم تأجيل العملية لـ 48 ساعة على الأقل من وقت آخر جرعة وفق معدل ترشيح الكلى ونوع الجراحة.',
          titleAr: 'يلزم تأجيل العملية لـ 48 ساعة على الأقل من وقت آخر جرعة وفق معدل ترشيح الكلى ونوع الجراحة.',
          severity: 'high'
        }
      ],
      smartQuestion: {
        id: 'sq-501',
        question: 'Does the planned procedure have high bleeding risk, or will spinal/epidural anesthesia be utilized?',
        questionAr: 'هل الجراحة المجدولة تعتبر عالية خطورة النزيف، وهل تتضمن الخطة التخديرية وخزاً نصفي الشوكي (Spinal/Epidural)؟',
        options: ['نعم', 'لا', 'غير متأكد']
      },
      clinicalPossibilities: [
        {
          id: 'pos-501',
          name: 'Active Anticoagulation State (High Perioperative Bleeding Risk)',
          nameAr: 'حالة تميع دم نشطة مع خطر نزيف جراحي مرتفع',
          likelihood: 'Higher likelihood',
          evidenceFromConversation: ['Patient confirmed taking Apixaban 5mg at 07:00 AM today'],
          evidenceFromConversationAr: ['المريض أكد بلع حبة أبيكسابان 5 ملجم الساعة 07:00 صباحاً اليوم'],
          evidenceFromRecord: ['Active Apixaban 5mg prescription in NGHA record since 2024'],
          evidenceFromRecordAr: ['وصفة أبيكسابان 5 ملجم مسجلة بنظام الحرس الوطني منذ 2024'],
          discriminatingQuestions: [
            {
              question: 'Is the patient’s renal function normal (Creatinine Clearance > 50 mL/min)?',
              questionAr: 'هل وظائف الكلى سليمة (تصفية الكرياتينين أكثر من 50 مل/دقيقة) لضمان سرعة تصريف الدواء؟'
            }
          ]
        }
      ],
      clinicalSummary: {
        en: 'Patient consumed scheduled Apixaban 5mg dose at 07:00 AM today. Per Saudi Anesthesia Society and FDA guidelines, DOACs must be held for 48-72 hours before elective surgery with moderate-to-high bleeding risk to prevent catastrophic hemorrhage or spinal hematoma.',
        ar: 'تناول المريض جرعته المعتادة من أبيكسابان 5 ملجم صباح اليوم الساعة 07:00. وفق أدلة الجمعية السعودية للتخدير وهيئة الغذاء والدواء، يجب إيقاف مميعات DOACs لمدة 48 إلى 72 ساعة قبل العمليات ذات خطورة النزيف لمنع حدوث نزيف جراحي أو تجمع دموي نخاعي خطير.'
      },
      clinicalReferences: [
        {
          tag: 'US-FDA-DRUGS',
          titleAr: 'تحذيرات النزيف وجراحة التخدير النصفي لمميعات الدم — FDA',
          titleEn: 'FDA Apixaban (Eliquis) Black Box Warnings & Perioperative Guidance',
          rationaleAr: 'التحذير الصندوقي الإلزامي بشأن خطر النزيف والتجمع الدموي النخاعي عند وخز العمود الفقري.',
          url: 'https://www.fda.gov/drugs'
        },
        {
          tag: 'MOH-SA-PROTOCOLS',
          titleAr: 'بروتوكول إدارة مضادات التخثر قبل الجراحة — وزارة الصحة',
          titleEn: 'MOH Preoperative Anticoagulation Management Protocols',
          rationaleAr: 'تحديد فترات التوقف الآمن لمضادات التخثر الفموية المباشرة (DOACs) حسب وظائف الكلى وخطورة التداخل.',
          url: 'https://www.moh.gov.sa'
        }
      ]
    }
  },

  // --------------------------------------------------------------------------
  // SCENARIO 6: سوابق القيء والغثيان الحاد بعد التخدير (PONV Protocol)
  // --------------------------------------------------------------------------
  {
    id: 'scen-ponv-prevention',
    category: 'anesthesia',
    badgeAr: 'التخدير والقيء (PONV)',
    badgeEn: 'Anesthesia / PONV',
    titleAr: 'سوابق القيء والغثيان الحاد بعد التخدير (خطة وقائية PONV)',
    titleEn: 'Severe Post-Operative Nausea & Vomiting (PONV Protocol)',
    descriptionAr: 'المريض عانى من قيء شديد وجفاف استدعى تمديد التنويم في جراحة سابقة، مما يضعه في فئة الخطورة العالية (Apfel Score High).',
    descriptionEn: 'Patient experienced severe post-op vomiting and dehydration requiring extended admission in prior surgery.',
    transcriptAr: `المريض: يا دكتورة أنا خايف جداً من البنج، في عمليتي السابقة قبل سنتين جلست يومين كاملين استفرغ وغثيان شديد وما قدرت أشرب ماء واضطروا ينوموني يوم زيادة بالمستشفى.
الطبيب: هل يصيبك دوار الحركة في السيارة أو الطائرة؟ وهل أنت مدخن؟
المريض: نعم يجيني غثيان ودوار بالسيارة دائماً، وأنا غير مدخن نهائياً.`,
    transcriptEn: `Patient: Doctor, I am very anxious about anesthesia. In my previous surgery two years ago, I spent two full days severely vomiting with intense nausea. I couldn't keep water down, and they had to keep me in the hospital for an extra day with IV fluids.
Doctor: Do you experience motion sickness in cars or planes? Are you a smoker?
Patient: Yes, I always get carsick and nauseated, and I am a strict non-smoker.`,
    analysis: {
      extractedInformation: {
        symptoms: [
          { text: 'Severe Post-Operative Nausea and Vomiting (History)', textAr: 'سوابق قيء وغثيان حاد بعد التخدير استدعى تمديد التنويم' },
          { text: 'Motion sickness susceptibility', textAr: 'قابلية للإصابة بدوار الحركة في المركبات' }
        ],
        duration: 'Occurred 2 years ago, chronic motion sensitivity',
        trigger: 'General Anesthesia (Volatile agents)',
        medications: [],
        allergies: ['Penicillin (Severe)'],
        relevantHistory: ['Prior appendectomy under general anesthesia', 'Non-smoker']
      },
      patientMemoryMatches: [
        {
          category: 'procedure',
          matchedEntity: 'Appendectomy (2023) — Complicated by Severe PONV & Dehydration',
          matchedEntityAr: 'استئصال الزائدة الدودية (2023) — تعقدت بقيء حاد وجفاف تطلب سوائل وريدية',
          source: 'MOH',
          statement: 'High-risk PONV history verified in EHR — Apfel Score = 3/4 (Non-smoker + Motion sickness + Prior PONV)',
          statementAr: 'سوابق خطورة عالية للقيء بعد البنج موثقة بالسجل — مقياس أبفل = 3/4'
        }
      ],
      whatNeedsAttention: [
        {
          id: 'att-601',
          category: 'مؤشر سريري محتمل',
          categoryAr: 'مؤشر سريري محتمل',
          title: 'المريض يمتلك درجة خطورة عالية (High Risk PONV) بنسبة حدوث تفوق 60% بدون خطة وقائية.',
          titleAr: 'المريض يمتلك درجة خطورة عالية (High Risk PONV) بنسبة حدوث تفوق 60% بدون خطة وقائية.',
          severity: 'high'
        },
        {
          id: 'att-602',
          category: 'مؤشر سريري محتمل',
          categoryAr: 'مؤشر سريري محتمل',
          title: 'التوصية باتباع تخدير وريدي كلي (TIVA بالبروبوفول) واستبعاد الغازات الاستنشاقية وأكسيد النيتروز.',
          titleAr: 'التوصية باتباع تخدير وريدي كلي (TIVA بالبروبوفول) واستبعاد الغازات الاستنشاقية وأكسيد النيتروز.',
          severity: 'medium'
        }
      ],
      smartQuestion: {
        id: 'sq-601',
        question: 'Does the patient have any known intolerance to antiemetic agents such as Ondansetron, Dexamethasone, or Metoclopramide?',
        questionAr: 'هل سبق أن حدث للمريض أي تحسس أو اضطراب في نبضات القلب بعد أخذ أدوية مانعة للغثيان مثل أوندانسيترون أو ديكساميثازون؟',
        options: ['نعم', 'لا', 'غير متأكد']
      },
      clinicalPossibilities: [
        {
          id: 'pos-601',
          name: 'High-Risk Post-Operative Nausea and Vomiting (Apfel Score 3)',
          nameAr: 'احتمالية مرتفعة جداً للقيء والغثيان بعد التخدير (مؤشر أبفل = 3)',
          likelihood: 'Higher likelihood',
          evidenceFromConversation: ['Prior severe PONV lasting 2 days', 'Motion sickness confirmed', 'Non-smoker status'],
          evidenceFromConversationAr: ['قيء مستمر ليومين في الجراحة السابقة', 'تأكيد دوار الحركة بالمركبات', 'غير مدخن إطلاقاً'],
          evidenceFromRecord: ['Appendectomy in 2023 with prolonged discharge notes'],
          evidenceFromRecordAr: ['جراحة سابقة عام 2023 مع ملاحظات خروج متأخر بسبب الجفاف'],
          discriminatingQuestions: [
            {
              question: 'Is multimodal antiemetic prophylaxis (dual/triple therapy) included in the surgical anesthesia plan?',
              questionAr: 'هل تم إدراج خطة وقائية متعددة الوسائط (ديكساميثازون + أوندانسيترون) في خطة التخدير الجراحي؟'
            }
          ]
        }
      ],
      clinicalSummary: {
        en: 'Patient is stratified at high risk for Post-Operative Nausea and Vomiting (Apfel Score 3: prior PONV, motion sickness, non-smoker). SAMBA and Saudi MOH Anesthesia guidelines strongly mandate multimodal prophylaxis: combination antiemetics (Dexamethasone + 5-HT3 antagonist) and consideration of Total Intravenous Anesthesia (TIVA) with Propofol.',
        ar: 'تم تصنيف المريض ضمن فئة الخطورة العالية للقيء بعد التخدير (مقياس أبفل 3: سوابق PONV، دوار حركة، غير مدخن). توصي إرشادات SAMBA ووزارة الصحة السعودية بإلزامية الخطة الوقائية متعددة الوسائط: إعطاء مضادات قيء مسبقة (ديكساميثازون + أوندانسيترون) وتفضيل التخدير الوريدي الكلي (TIVA) بالبروبوفول.'
      },
      clinicalReferences: [
        {
          tag: 'MOH-SA-PROTOCOLS',
          titleAr: 'بروتوكولات التخدير وجراحة اليوم الواحد — وزارة الصحة',
          titleEn: 'MOH Ambulatory Anesthesia & Perioperative Guidelines',
          rationaleAr: 'تطبيق الإجراءات الوقائية متعددة الوسائط للحد من مضاعفات الغثيان وتسريع خروج المريض بسلام.',
          url: 'https://www.moh.gov.sa'
        },
        {
          tag: 'NICE-GUIDELINES',
          titleAr: 'إرشادات NICE للرعاية الجراحية والتخدير — NICE CG45',
          titleEn: 'NICE Perioperative Care & Postoperative Nausea Guidelines',
          rationaleAr: 'المعايير الاسترشادية للترطيب الوريدي الكافي والوقاية من جفاف ما بعد الجراحة.',
          url: 'https://www.nice.org.uk'
        }
      ]
    }
  }
];
