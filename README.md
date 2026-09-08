# Clinova — PreOp Insight 🏥
### منصة الذكاء السريري والاستدلال التشخيصي قبل العمليات الجراحية
**Cross-Sector Clinical Intelligence & Pre-Operative Diagnostic Decision Support**

Clinova هو نظام سريري ذكي مصمم لمساعدة الأطباء وفرق التخدير والجراحة في مرحلة ما قبل العمليات (Pre-Operative Assessment)، من خلال توحيد السجلات عبر مختلف القطاعات الصحية (NPHIES، وصفتي، والقطاع الخاص/العسكري)، وتحويل حوار الطبيب مع المريض لحظياً إلى نص دقيق (Speech-to-Text)، وتوليد التشخيصات التفريقية والأسئلة الاستكشافية الذكية عبر الذكاء الاصطناعي مع الربط بالأدلة السريرية.

---

## ✨ المميزات الرئيسية (Key Capabilities)

1. **التعرف الصوتي الطبي المباشر (Real-Time Medical STT):**
   - تحويل حوار الطبيب والمريض ثنائي اللغة (عربي / إنجليزي) إلى نص في نفس اللحظة عبر **Speechmatics API** مع تمييز المتحدثين (Speaker Diarization).
   - مؤشر صوتي تفاعلي (Waveform Visualizer) متجاوب مع شدة الصوت وتنبيه بالميكروفون النشط.

2. **محرك الاستدلال السريري التفريقي (AI Differential Diagnostics):**
   - تحليل الأعراض المسجلة فورياً ومقارنتها بالسجل الطبي التاريخي للمريض.
   - استخراج وتوليد قائمة **التشخيصات التفريقية المرشحة (Candidate Differential Diagnoses)** مع نسب الاحتمالية والأدلة السريرية المقتبسة من المحادثة.
   - تنبيه الفارق المتقارب (Narrow Gap Alert) عندما يكون الفارق بين أعلى تشخيصين $\le 15\%$.
   - صياغة **أسئلة مميزة (Discriminating Questions)** توجه الطبيب للفصل بين التشخيصات المشتبه بها، مع خيارات سريعة تفاعلية.

3. **توحيد السجلات الطبية والتعارضات الدوائية (Unified Cross-Sector EHR):**
   - ربط الأدوية الموثقة عبر مستشفيات وزارة الصحة والمستشفيات العسكرية والقطاع الخاص.
   - كشف فوري للتعارضات الدوائية الخطرة (مثل تعارض مضادات التخثر NSAIDs / Blood Thinners مع الجراحة المجدولة).

4. **قاعدة المعرفة السريرية والمراجع المعتمدة (Clinical Knowledge Base):**
   - مدمجة مع إرشادات وزارة الصحة السعودية (MOH)، المعايير الوطنية (CBAHI)، والاعتماد الدولي (JCI)، وإرشادات الجمعية الأمريكية لأطباء التخدير (ASA).
   - إمكانية مراجعة مصادر كل استدلال سريري مدعومة بروابط ومعايير توثيق دقيقة.

5. **نافذة إعدادات مفاتيح الربط (API Keys Management):**
   - نافذة سلسة بالواجهة تتيح للطبيب/المستخدم إدخال مفاتيح **OpenRouter** و**Speechmatics** وحفظها محلياً بأمان، أو الاعتماد على المتغيرات البيئية عند النشر في Vercel.

---

## 🚀 التشغيل محلياً (Local Setup)

```bash
# 1. استنساخ المشروع
git clone https://github.com/ghaidtalsh2-max/clinova-preop-insight.git
cd clinova-preop-insight

# 2. تثبيت الحزم
npm install

# 3. تجهيز ملف البيئة (اختياري)
cp .env.example .env
# قم بوضع مفاتيح API الخاصة بك داخل .env

# 4. تشغيل خادم التطوير
npm run dev
```

---

## 🌐 النشر على Vercel (Vercel Deployment)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fghaidtalsh2-max%2Fclinova-preop-insight&project-name=clinova-preop-insight&repository-name=clinova-preop-insight&env=VITE_OPENROUTER_API_KEY%2CVITE_SPEECHMATICS_API_KEY%2COPENROUTER_API_KEY%2CSPEECHMATICS_API_KEY%2CVITE_OPENROUTER_MODEL&envDefaults=%7B%22VITE_OPENROUTER_API_KEY%22%3A%22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%22%2C%22VITE_SPEECHMATICS_API_KEY%22%3A%22gUlZyTXWQWGVR8Y9CRHADqAnAiHl3Yoj%22%2C%22OPENROUTER_API_KEY%22%3A%22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%22%2C%22SPEECHMATICS_API_KEY%22%3A%22gUlZyTXWQWGVR8Y9CRHADqAnAiHl3Yoj%22%2C%22VITE_OPENROUTER_MODEL%22%3A%22anthropic%2Fclaude-3.5-sonnet%22%7D&envDescription=Pre-configured+OpenRouter+and+Speechmatics+API+keys+for+Clinova+PreOp+Insight)

المشروع مُهيأ بالكامل للنشر الفوري على **Vercel** عبر ملف `vercel.json` لإعادة التوجيه (SPA Routing).

### خطوات النشر:
1. ارفع المشروع إلى مستودع GitHub الخاص بك.
2. توجه إلى [Vercel Dashboard](https://vercel.com/new).
3. اختر المستودع `clinova-preop-insight` واضغط **Import**.
4. في قسم **Environment Variables**، يمكنك إضافة المفاتيح التالية:
   - `VITE_OPENROUTER_API_KEY`: مفتاحك من منصة OpenRouter (يبدأ بـ `sk-or-v1-...`)
   - `VITE_OPENROUTER_MODEL`: النموذج المفضل (الافتراضي: `anthropic/claude-3.5-sonnet`)
   - `VITE_SPEECHMATICS_API_KEY`: مفتاحك من Speechmatics لتحويل الصوت
5. اضغط **Deploy**.

> 💡 **ملاحظة:** يمكنك أيضاً تجربة المنصة وتغيير مفاتيح الـ API في أي وقت بعد النشر مباشرة من خلال زر **"مفاتيح الـ API"** في الشريط العلوي للموقع، وسيتم حفظها بأمان في المتصفح والعمل فوراً دون الحاجة لإعادة النشر!

---

## 🛠 التقنيات المستخدمة (Tech Stack)

- **Frontend:** React 19 + TypeScript + Vite
- **Design System:** Custom Medical Design System (RTL Native, Vanilla CSS Variables, Fluid Typography, Micro-animations)
- **Icons:** Lucide React
- **AI & Speech Services:**
  - Speechmatics Real-Time Web Speech API
  - OpenRouter Clinical Reasoning API (Claude 3.5 Sonnet)
  - High-Fidelity Local Clinical Reasoning Engine (Zero-downtime offline fallback)
- **Deployment:** Vercel SPA Ready

---

## 📄 الترخيص
تم تطوير هذا المشروع كنموذج ريادي لدعم اتخاذ القرار السريري في هاكاثون الابتكار الصحي.
