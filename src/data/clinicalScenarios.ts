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
          { text: 'Orthostatic dizziness upon standing', textAr: 'دوخة وضعية عند الوقوف المفاجئ من الفراش' },
          { text: 'Transient blurred vision lasting seconds', textAr: 'غشاوة بصرية عابرة لعدة ثوانٍ تزول فور الجلوس' }
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
        question: 'Has the patient checked blood pressure lying down versus after standing for 3 minutes, and have these dizzy spells ever resulted in loss of consciousness, falls, or chest pain?',
        questionAr: 'المريض ذكر الدوخة عند الوقوف دون إغماء كامل. هل تم قياس ضغط الدم مستلقياً ثم بعد الوقوف لـ 3 دقائق، وهل تسببت الدوخة في أي سقوط أو فقدان للوعي؟',
        options: ['نعم', 'لا', 'غير متأكد']
      },
      clinicalPossibilities: [
        {
          id: 'pos-101',
          name: 'Drug-Induced Orthostatic Hypotension (Secondary to Calcium Channel Blocker / Amlodipine)',
          nameAr: 'هبوط ضغط انتصابي دوائي (ناجم عن موسعات الأوعية وأملوديبين 5 ملجم)',
          likelihood: 'Higher likelihood',
          probability: 84,
          evidenceFromConversation: [
            'Dizziness specifically triggered upon standing quickly from bed',
            'Transient blurred vision lasting seconds, resolving promptly upon sitting',
            'Daily morning blood pressure pill reported for 3 weeks'
          ],
          evidenceFromConversationAr: [
            'تحفز الدوخة حصراً وبشكل متكرر عند النهوض السريع من الفراش',
            'غشاوة بصرية عابرة لثوانٍ تزول فور الجلوس أو الاستلقاء',
            'تناول حبة ضغط بيضاء صباحية يومياً مستمر عليها من 3 أسابيع'
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
              question: 'Does the dizziness and blurred vision resolve completely within 1 to 2 minutes after sitting or lying down?',
              questionAr: 'هل تزول الدوخة وتتحسن الرؤية تماماً خلال دقيقة إلى دقيقتين بمجرد الجلوس أو الاستلقاء؟'
            }
          ]
        },
        {
          id: 'pos-102',
          name: 'Diabetic Autonomic Neuropathy with Impaired Vasomotor Reflexes',
          nameAr: 'اعتلال عصبي لاإرادي سكري مع ضعف الاستجابة المنعكسة لضغط الدم',
          likelihood: 'Moderate likelihood',
          probability: 64,
          evidenceFromConversation: [
            'Persistent postural dizziness for 3 weeks without spontaneous recovery',
            'Absence of compensatory reflex tachycardia reported upon standing'
          ],
          evidenceFromConversationAr: [
            'أعراض دوخة وضعية مستمرة منذ 3 أسابيع دون تحسن تلقائي',
            'غياب الخفقان التعويضي السريع الملحوظ عند النهوض'
          ],
          evidenceFromRecord: [
            'Type 2 Diabetes Mellitus documented for over 5 years on Metformin',
            'Resting baseline heart rate 82 bpm'
          ],
          evidenceFromRecordAr: [
            'داء السكري النوع الثاني لأكثر من 5 سنوات ومستمر على ميتفورمين',
            'النبض المكتبي 82 د/د دون استجابة تسارعية كافية'
          ],
          discriminatingQuestions: [
            {
              question: 'Does the patient experience peripheral numbness/tingling in the feet, abnormal sweating, or early gastrointestinal fullness?',
              questionAr: 'هل يشكو المريض من خدر وتنميل بأطراف القدمين، أو بطء هضم واضطراب تعرق (علامات اعتلال عصبي سكري)؟'
            }
          ]
        },
        {
          id: 'pos-103',
          name: 'Preoperative Volume Depletion / Subclinical Dehydration',
          nameAr: 'نقص نسبي في حجم السوائل والجفاف في مرحلة التحضير للجراحة',
          likelihood: 'Lower likelihood',
          probability: 38,
          evidenceFromConversation: [
            'Dizziness predominantly pronounced in early morning fasting hours'
          ],
          evidenceFromConversationAr: [
            'تفاقم أعراض الدوخة في ساعات الصباح الباكر قبل شرب السوائل'
          ],
          evidenceFromRecord: [
            'No documented IV hydration orders in pre-admission chart'
          ],
          evidenceFromRecordAr: [
            'عدم وجود خطة ترطيب وريدي استباقية مسجلة'
          ],
          discriminatingQuestions: [
            {
              question: 'Has the patient had noticeably decreased daily fluid intake or experienced frequent dry mouth?',
              questionAr: 'هل يعاني المريض من جفاف ملحوظ بالحلق أو قلة شرب الماء والسوائل اليومية؟'
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
        question: 'Since the verified KFMC ECG demonstrates normal sinus rhythm from 6 months ago, can the patient climb two flights of stairs or walk briskly (≥ 4 METs) without chest discomfort or shortness of breath?',
        questionAr: 'بما أن السجل الموحد أثبت سلامة تخطيط القلب بمدينة الملك فهد الطبية قبل 6 أشهر، هل يستطيع المريض صعود طابقين من الدرج أو المشي السريع (≥ 4 METs) دون ثقل بالصدر أو ضيق تنفس؟',
        options: ['نعم', 'لا', 'غير متأكد']
      },
      clinicalPossibilities: [
        {
          id: 'pos-201',
          name: 'Stable Normal Sinus Rhythm with Adequate Functional Capacity (Low Preoperative Cardiac Risk - NICE NG45 Compliant)',
          nameAr: 'استقرار قلبي وعائي سليم (ريثم جيبي طبيعي مع خطورة جراحية منخفضة وفق معايير NICE NG45)',
          likelihood: 'Higher likelihood',
          probability: 86,
          evidenceFromConversation: [
            'Physician confirmed retrieved ECG shows normal sinus rhythm without ischemic ST changes',
            'Patient was informed at KFMC that test was normal apart from mild baseline pulse elevation',
            'No active chest discomfort or exertion limitation reported'
          ],
          evidenceFromConversationAr: [
            'السجل المسترجع من مدينة الملك فهد الطبية يثبت ريثم جيبي سليم بدون علامات نقص تروية أو جلطة',
            'إبلاغ المريض بسلامة فحص القلب في مراجعته السابقة بمدينة الملك فهد الطبية',
            'عدم وجود أي شكوى من ألم صدري أو تراجع القدرة على المشي'
          ],
          evidenceFromRecord: [
            'KFMC 12-lead ECG: Normal Sinus Rhythm at 82 bpm, normal axis, normal intervals',
            'HbA1c 7.1% (acceptable pre-op glycemic control)'
          ],
          evidenceFromRecordAr: [
            'تخطيط 12-قناة بمدينة الملك فهد الطبية: ريثم جيبي 82 د/د وفترات تخطيط طبيعية',
            'تراكمي السكر 7.1% يعكس تحكماً مقبولاً بالسكري قبل التخدير'
          ],
          discriminatingQuestions: [
            {
              question: 'Can the patient climb two flights of stairs or walk up a hill briskly without chest pain or shortness of breath (Functional Capacity ≥ 4 METs)?',
              questionAr: 'هل يستطيع المريض صعود طابقين من الدرج أو المشي السريع دون ألم في الصدر أو ضيق تنفس (قدرة وظيفية ≥ 4 METs تؤكد أمان التخدير)؟'
            }
          ]
        },
        {
          id: 'pos-202',
          name: 'Physiologic / White-Coat Sinus Tachycardia (Stress-Induced vs Subclinical Metabolic Strain)',
          nameAr: 'تسارع نبض جيبي فسيولوجي تفاعلي (مرتبط برهبة العيادات أو إجهاد أيضي خفيف مع استبعاد اعتلال الشرايين)',
          likelihood: 'Moderate likelihood',
          probability: 62,
          evidenceFromConversation: [
            'Mild pulse elevation noted during hospital visit at KFMC',
            'Current resting heart rate 82 bpm during clinical encounter'
          ],
          evidenceFromConversationAr: [
            'ملاحظة تسارع بسيط في النبض وقت التقييم داخل المستشفى',
            'النبض المكتبي الحالي 82 د/د في بيئة العيادة'
          ],
          evidenceFromRecord: [
            'No structural heart disease on prior KFMC evaluations',
            'History of Type 2 Diabetes and Hypertension under treatment'
          ],
          evidenceFromRecordAr: [
            'عدم وجود اعتلال بنيوي بعضلة القلب في فحوصات مدينة الملك فهد السابقة',
            'تاريخ إصابة بالسكري والضغط تحت العلاج'
          ],
          discriminatingQuestions: [
            {
              question: 'Does the heart rate normalize below 75 bpm during relaxation at home, and does the patient consume high caffeine prior to clinic visits?',
              questionAr: 'هل ينخفض النبض لمعدله الطبيعي الهادئ في المنزل، وهل يتناول المريض منبهات كالقهوة والشاي بكثرة قبل مراجعة العيادة؟'
            }
          ]
        },
        {
          id: 'pos-203',
          name: 'Silent Diabetic Myocardial Ischemia (Risk Factor Clearance Consideration)',
          nameAr: 'اشتباه إقفار قلبي صامت لدى مريض السكري (يستوجب التحقق من غياب الأعراض غير النمطية)',
          likelihood: 'Lower likelihood',
          probability: 35,
          evidenceFromConversation: [
            'Patient has long-standing diabetes and hypertensive profile'
          ],
          evidenceFromConversationAr: [
            'إصابة مزمنة بالسكري والضغط تستدعي التيقن من غياب الإقفار الصامت'
          ],
          evidenceFromRecord: [
            'Documented Diabetes for >5 years (Metformin 500mg BID)'
          ],
          evidenceFromRecordAr: [
            'سكري لأكثر من 5 سنوات ومستمر على ميتفورمين'
          ],
          discriminatingQuestions: [
            {
              question: 'Has the patient experienced unexplained fatigue, unusual sweating, or indigestion-like pressure during physical exertion?',
              questionAr: 'هل شعر المريض بإرهاق غير مبرر أو تعرق بارد أو ثقل بالصدر يشبه عسر الهضم عند بذل جهد بدني؟'
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
        question: 'To resolve this critical discrepancy safely: did your 2021 hospital admission involve tongue/facial swelling or throat tightness after an antibiotic injection, and have you taken any penicillin derivatives since?',
        questionAr: 'لحسم هذا التعارض الحرج لسلامتك: هل شملت مراجعة الطوارئ عام 2021 تورماً بالوجه والشفاه أو صعوبة بالتنفس بعد إبرة مضاد حيوي، وهل تناولت أي بنسلين بعدها؟',
        options: ['نعم', 'لا', 'غير متأكد']
      },
      clinicalPossibilities: [
        {
          id: 'pos-301',
          name: 'True IgE-Mediated Penicillin Anaphylaxis with Patient Recall Deficit (High Risk of Intraoperative Bronchospasm)',
          nameAr: 'حساسية مفرطة حقيقية للبنسلين (وساطة IgE مناعية مع صدمة تأقية سابقة نسيها المريض)',
          likelihood: 'Higher likelihood',
          probability: 88,
          evidenceFromConversation: [
            'Patient demonstrates complete lack of awareness regarding his severe allergy history',
            'Direct verbal denial contradicted by authoritative hospital record'
          ],
          evidenceFromConversationAr: [
            'نفي المريض الشفهي التام لوجود أي حساسية ناتج عن نسيان تفاصيل التنويم القديم',
            'التعارض الصريح بين كلام المريض وسجل الطوارئ بالحرس الوطني'
          ],
          evidenceFromRecord: [
            'Documented NGHA emergency admission (2021) with bronchospasm, facial urticaria, and oxygen desaturation post-penicillin',
            'Strict red-flag allergy tag in unified system'
          ],
          evidenceFromRecordAr: [
            'توثيق تنويم طارئ بالحرس الوطني (2021) بضيق تنفس وشرى جلدي وهبوط أكسجين بعد البنسلين',
            'وسم تحذيري أحمر دائم بالحساسية المفرطة في النظام الإلكتروني'
          ],
          discriminatingQuestions: [
            {
              question: 'Did the 2021 emergency event require intramuscular epinephrine (adrenaline), IV hydrocortisone, and an overnight observation stay?',
              questionAr: 'هل استدعت نوبة 2021 إعطاء حقنة إبينفرين (أدرينالين) أو كورتيزون وريدي وتنويم إسعافي لمراقبة مجرى التنفس؟'
            }
          ]
        },
        {
          id: 'pos-302',
          name: 'Non-Anaphylactic Cutaneous Reaction / Viral Exanthem Misclassified as Severe Allergy',
          nameAr: 'تفاعل جلدي غير تأقي أو طفح عابر تم تصنيفه خطأ كصدمة تأقية مهددة للحياة',
          likelihood: 'Moderate likelihood',
          probability: 58,
          evidenceFromConversation: [
            'Patient firmly asserts taking all medications normally without any adverse reaction in daily life',
            'Possible misinterpretation by patient or over-labeling by primary emergency recorder'
          ],
          evidenceFromConversationAr: [
            'تأكيد المريض أنه يأخذ الأدوية والمسكنات بشكل روتيني دون حدوث أي تفاعل ضار',
            'احتمالية الخلط بين الطفح الدوائي البسيط والصدمة التأقية الشديدة وقت التوثيق'
          ],
          evidenceFromRecord: [
            'Lack of formal skin prick testing or follow-up allergy clinic confirmation note in chart',
            'No repeated exposures documented since 2021'
          ],
          evidenceFromRecordAr: [
            'غياب تقرير اختبار وخز الجلد التخصصي لتأكيد وجود الأجسام المضادة IgE',
            'عدم تكرار صرف أي مضاد بيتا لاكتام منذ تلك الحادثة'
          ],
          discriminatingQuestions: [
            {
              question: 'Has the patient safely taken any cephalosporin (e.g. Cefuroxime/Zinnat, Cephalexin/Keflex) or Augmentin recently without any allergic reaction?',
              questionAr: 'هل تناول المريض أي مضاد حيوي من عائلة السيفالوسبورين (مثل زينات أو كيفلكس) مؤخراً دون أي حكة أو تورم بالشفاه؟'
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
        question: 'Has the patient had a recent serum creatinine/eGFR check, and can Ibuprofen be immediately switched to Paracetamol with a proton-pump inhibitor (PPI) prior to surgery?',
        questionAr: 'هل فحص المريض وظائف الكلى (الكرياتينين ومعدل الترشيح eGFR) مؤخراً، وهل يمكن إيقاف البروفين فوراً واستبداله بالباراسيتامول مع دواء حامٍ للمعدة (PPI) قبل العملية؟',
        options: ['نعم', 'لا', 'غير متأكد']
      },
      clinicalPossibilities: [
        {
          id: 'pos-401',
          name: 'NSAID-Induced Acute Gastritis & Peptic Mucosal Ulceration Risk',
          nameAr: 'التهاب المعدة الحاد وتضرر الغشاء المخاطي المعدي الناتج عن مضادات الالتهاب (NSAIDs)',
          likelihood: 'Higher likelihood',
          probability: 86,
          evidenceFromConversation: [
            'Self-administration of OTC Ibuprofen 400mg twice daily for 2 continuous weeks',
            'Onset of sharp epigastric burning pain and nausea aggravated when fasting',
            'Absence of frank hematemesis or melena (suggesting pre-ulcerative mucosal injury)'
          ],
          evidenceFromConversationAr: [
            'تناول مسكن إيبوبروفين 400 ملجم مرتين يومياً لأسبوعين متتاليين بدون وصفة',
            'بدء حرقة وألم فم المعدة والغثيان بعد الأكل وتفاقمه أثناء الصيام',
            'غياب القيء المدمم أو البراز الأسود (يشير لمرحلة التهاب مخاطي حاد يسبق القرحة النازفة)'
          ],
          evidenceFromRecord: [
            'No prior PPI or gastric protection prescribed in unified record',
            'Active anti-hypertensive regimen requiring perioperative stabilization'
          ],
          evidenceFromRecordAr: [
            'عدم وجود وصفة حماية للمعدة (مثل أوميبرازول) في السجل الموحد',
            'خضوع المريض لخطة خافضات ضغط تتطلب استقرار التروية قبل الجراحة'
          ],
          discriminatingQuestions: [
            {
              question: 'Does the epigastric burning awaken the patient from sleep at night, and does it temporarily ease with milk or antacid syrup?',
              questionAr: 'هل يوقظ ألم وحرقة المعدة المريض من النوم ليلاً، وهل يخف مؤقتاً عند شرب الحليب أو تناول شراب مضاد للحموضة؟'
            }
          ]
        },
        {
          id: 'pos-402',
          name: 'Subclinical Hemodynamic Renal Impairment (NSAID-Amlodipine Nephrotoxicity Interaction)',
          nameAr: 'قصور كلوي ديناميكي وتراجع التروية الكلوية (تداخل الإيبوبروفين مع أملوديبين وأدوية الضغط)',
          likelihood: 'Moderate likelihood',
          probability: 68,
          evidenceFromConversation: [
            'High-dose NSAID exposure in a patient with chronic hypertension',
            'Perioperative risk of acute tubular injury during surgical anesthesia and fluid shifts'
          ],
          evidenceFromConversationAr: [
            'تناول جرعات عالية من البروفين بالتزامن مع علاج الضغط الشرياني',
            'خطر هبوط التروية الكلوية الحاد أثناء التخدير الجراحي وتغيرات السوائل'
          ],
          evidenceFromRecord: [
            'Documented Type 2 Diabetes for 5 years and Essential Hypertension (heightened baseline nephropathy risk)',
            'Baseline serum creatinine and eGFR need urgent re-check'
          ],
          evidenceFromRecordAr: [
            'إصابة بالسكري والضغط لأكثر من 5 سنوات ترفع القابلية لاعتلال الكلى',
            'ضرورة مراجعة وظائف الكلى ومعدل الترشيح eGFR قبل العملية'
          ],
          discriminatingQuestions: [
            {
              question: 'Has the patient noticed any decrease in daily urine volume or new swelling around the ankles since starting Ibuprofen?',
              questionAr: 'هل لاحظ المريض نقصاً في كمية البول اليومية أو انتفاخاً وتورماً جديداً في الكاحلين منذ بدء تناول البروفين؟'
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
        question: 'Given that Apixaban was taken at 07:00 AM today, what is the patient’s exact Creatinine Clearance (CrCl), and has the surgery been postponed by at least 48 to 72 hours per Saudi Anesthesia Society protocols?',
        questionAr: 'نظراً لتناول حبة أبيكسابان الساعة 07:00 صباح اليوم، ما هو معدل تصفية الكرياتينين (CrCl) بدقة، وهل تم تأجيل العملية لـ 48 إلى 72 ساعة وفق أدلة الجمعية السعودية للتخدير؟',
        options: ['نعم', 'لا', 'غير متأكد']
      },
      clinicalPossibilities: [
        {
          id: 'pos-501',
          name: 'Active Direct Oral Anticoagulant (DOAC) State with Critical Hemorrhagic & Neuraxial Hematoma Risk',
          nameAr: 'حالة تميع دم نشطة بمضادات التخثر الفموية المباشرة (خطر نزيف جراحي وتجمع دموي نخاعي حاد)',
          likelihood: 'Higher likelihood',
          probability: 92,
          evidenceFromConversation: [
            'Patient confirmed taking Apixaban 5mg at 07:00 AM today with breakfast',
            'Full systemic anticoagulation active for the next 24 to 48 hours',
            'Strict contraindication to neuraxial block (spinal/epidural) and major incision'
          ],
          evidenceFromConversationAr: [
            'المريض أكد بلع حبة أبيكسابان 5 ملجم الساعة 07:00 صباح اليوم مع الفطور',
            'استمرار الفاعلية التخثرية الكاملة بالدورة الدموية خلال 24 إلى 48 ساعة القادمة',
            'موانع مطلقة لإبرة الظهر النصفية (Spinal/Epidural) والشقوق الجراحية النازفة'
          ],
          evidenceFromRecord: [
            'Active Apixaban 5mg prescription in NGHA record since 2024',
            'Absence of documented reversal agent (Andexanet Alfa) order'
          ],
          evidenceFromRecordAr: [
            'وصفة أبيكسابان 5 ملجم مسجلة بنظام الحرس الوطني منذ 2024',
            'عدم وجود طلب لمضاد الإبطال النوعي (Andexanet alfa) لحالات الطوارئ'
          ],
          discriminatingQuestions: [
            {
              question: 'Is the scheduled surgery elective (permitting a 48-hour deferral) and does it involve spinal/epidural anesthesia or high bleeding risk?',
              questionAr: 'هل الجراحة المجدولة اختيارية تسمح بالتأجيل الآمن لمدة 48 ساعة، وهل تتضمن تخديراً نخاعياً (إبرة ظهر) أو خطورة نزيف عالية؟'
            }
          ]
        },
        {
          id: 'pos-502',
          name: 'Thromboembolic vs Bleeding Risk Imbalance (Indication for Structured Cessation Window & Bridging Assessment)',
          nameAr: 'اضطراب توازن التخثر والنزيف (الحاجة لجدولة إيقاف زمنية دقيقة وتقييم الحاجة لجسور الهيبارين)',
          likelihood: 'Moderate likelihood',
          probability: 65,
          evidenceFromConversation: [
            'Patient raises concern regarding surgery postponement and temporary bridging alternatives',
            'Need to weigh stroke risk vs intraoperative catastrophic hemorrhage'
          ],
          evidenceFromConversationAr: [
            'استفسار المريض عن إمكانية تأجيل العملية وتوافر بدائل مؤقتة لمنع التجلط',
            'ضرورة موازنة خطورة الجلطة القلبية والدماغية مقابل خطر النزيف الجراحي'
          ],
          evidenceFromRecord: [
            'Cardiology indication for anticoagulation on file (CHA2DS2-VASc score evaluation)',
            'Renal function dictates exact elimination clearance rate (CrCl)'
          ],
          evidenceFromRecordAr: [
            'استطباب قلبي موثق لصرف السيولة (يتطلب حساب مؤشر الخطورة CHA2DS2-VASc)',
            'وظائف الكلى تحدد سرعة تصريف وتصفية الدواء من الجسم (CrCl)'
          ],
          discriminatingQuestions: [
            {
              question: 'What is the patient’s calculated Creatinine Clearance (CrCl), and is the patient at high thrombotic risk requiring low-molecular-weight heparin (LMWH) bridge therapy?',
              questionAr: 'ما هو معدل تصفية الكرياتينين (CrCl) لدى المريض، وهل تستدعي خطورة التجلط استخدام إبر سيولة مؤقتة كجسر علاجي؟'
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
        question: 'With an Apfel Score of 3/4 (high PONV risk >60%), has multimodal antiemetic prophylaxis (Dexamethasone + 5-HT3 antagonist) and Total Intravenous Anesthesia (TIVA Propofol) been incorporated into the anesthesia plan?',
        questionAr: 'نظراً لبلوغ مؤشر أبفل 3/4 (خطورة قيء تفوق 60%)، هل تم تضمين الوقاية متعددة الوسائط (ديكساميثازون + أوندانسيترون) واعتماد التخدير الوريدي الكلي (TIVA بالبروبوفول) ضمن خطة التخدير؟',
        options: ['نعم', 'لا', 'غير متأكد']
      },
      clinicalPossibilities: [
        {
          id: 'pos-601',
          name: 'High-Risk Post-Operative Nausea & Vomiting (Apfel Score 3/4 - High Vulnerability to Volatile Anesthetics)',
          nameAr: 'خطورة عالية جداً للقيء والغثيان التالي للتخدير الجراحي (مؤشر أبفل = 3/4 وحساسية شديدة لغازات التخدير)',
          likelihood: 'Higher likelihood',
          probability: 88,
          evidenceFromConversation: [
            'Prior severe intractable PONV lasting 48 hours requiring extended hospital admission and IV fluids',
            'Confirmed lifelong susceptibility to motion sickness in vehicles',
            'Confirmed strict non-smoker status (three major Apfel risk factors present > 60% probability)'
          ],
          evidenceFromConversationAr: [
            'سوابق قيء مستعصٍ استمر 48 ساعة بعد الجراحة السابقة واستدعى تمديد التنويم وسوائل وريدية',
            'تأكيد القابلية المزمنة لدوار الحركة والغثيان في المركبات',
            'تأكيد كونه غير مدخن إطلاقاً (اكتمال 3 معايير رئيسية في مقياس أبفل ترتفع معها الخطورة لما يفوق 60%)'
          ],
          evidenceFromRecord: [
            '2023 Appendectomy discharge summary noting severe dehydration secondary to post-op emesis',
            'No documentation of prior prophylactic antiemetics in previous anesthesia record'
          ],
          evidenceFromRecordAr: [
            'تقرير خروج جراحة الزائدة 2023 يوثق جفافاً حاداً نتيجة القيء بعد التخدير',
            'عدم استخدام بروتوكول وقائي متعدد الوسائط في الجراحة السابقة'
          ],
          discriminatingQuestions: [
            {
              question: 'Does the current anesthesia plan mandate Total Intravenous Anesthesia (TIVA with Propofol) and complete avoidance of inhaled nitrous oxide/volatile agents?',
              questionAr: 'هل تتضمن خطة التخدير الحالية اعتماد التخدير الوريدي الكلي (TIVA بالبروبوفول) والاستغناء التام عن غازات التخدير الاستنشاقية وأكسيد النيتروز؟'
            }
          ]
        },
        {
          id: 'pos-602',
          name: 'Severe Post-Operative Dehydration & Electrolyte Derangement Risk (Hypokalemia & Prerenal Azotemia Secondary to Intractable Emesis)',
          nameAr: 'خطر الجفاف الشديد واضطراب الشوارد الكهربائية (نقص البوتاسيوم وقصور كلوي ما قبل كلوي ناجم عن تكرار القيء)',
          likelihood: 'Moderate likelihood',
          probability: 68,
          evidenceFromConversation: [
            'Inability to maintain oral fluid intake for 2 full days in prior surgical admission',
            'Heightened psychological anxiety regarding anesthesia repeating the metabolic exhaustion'
          ],
          evidenceFromConversationAr: [
            'عجز المريض التام عن شرب السوائل لمدة يومين كاملين في عمليته السابقة',
            'قلق وتوتر نفسي شديد من تكرار الإجهاد الاستقلابي والجفاف في الجراحة القادمة'
          ],
          evidenceFromRecord: [
            'Patient is a diabetic on Metformin (dehydration substantially elevates metabolic and renal risk)',
            'Prior need for supplementary IV crystalloids documented'
          ],
          evidenceFromRecordAr: [
            'إصابة المريض بالسكري وعلاجه بالميتفورمين (الجفاف يرفع بشدة مخاطر الحماض والقصور الكلوي)',
            'توثيق الحاجة لمحاليل وريدية تعويضية مكثفة في السجل السابق'
          ],
          discriminatingQuestions: [
            {
              question: 'Is a combination multimodal prophylaxis scheduled (Dexamethasone 4-8mg IV at induction + Ondansetron 4mg IV at emergence, plus IV hydration)?',
              questionAr: 'هل تم إقرار خطة وقائية مركبة متعددة الوسائط (ديكساميثازون 4-8 ملجم بالوريد عند بدء التخدير + أوندانسيترون 4 ملجم قبل الإفاقة وترطيب وريدي كافٍ)؟'
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
