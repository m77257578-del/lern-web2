import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import dotenv from 'dotenv';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Load environment variables from .env
dotenv.config();

const aiApiKey = process.env.GEMINI_API_KEY || '';
if (!aiApiKey) {
  console.warn('⚠️ WARNING: GEMINI_API_KEY is not set in process.env. AI features will likely fail.');
}

const ai = new GoogleGenAI({
  apiKey: aiApiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const firebaseConfig = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'firebase-applet-config.json'), 'utf-8'));

// Initialize Firebase Admin
// In AI Studio Build, we can often initialize without explicit credentials if the environment provides them,
// but for robustness we'll use a placeholder or check for ADC.
try {
  initializeApp({
    projectId: firebaseConfig.projectId
  });
} catch (e) {
  console.warn('Firebase Admin already initialized or failed:', e);
}

const fdb = getFirestore(firebaseConfig.firestoreDatabaseId);

const dbFile = path.resolve(process.cwd(), 'lernweb_db.json');

interface DatabaseSchema {
  version: number;
  lastModified: number;
  projects: any[];
  settings: any;
  wallets: any[];
  plans: any[];
  ai_drafts: any[];
  users: any[];
  media_resources: any[];
  user_orders: any[];
  reviews: any[];
  activity_logs: any[];
  chat_messages: any[];
  support_tickets: any[];
  notifications: any[];
  articles: any[];
  faqs: any[];
  announcements: any[];
}


function loadDb(): DatabaseSchema {
  try {
    if (fs.existsSync(dbFile)) {
      const content = fs.readFileSync(dbFile, 'utf-8');
      const parsed = JSON.parse(content);
      if (!parsed.version) parsed.version = 1;
      if (!parsed.lastModified) parsed.lastModified = Date.now();
      return parsed;
    }
  } catch (e) {
    console.error('Error loading DB file:', e);
  }

  // Default initial data
  const initialDb: DatabaseSchema = {
    version: 1,
    lastModified: Date.now(),
    projects: [
      {
        id: 'lms-core-hub',
        category: 'lms',
        titleAr: 'منظومة إدارة المراكز والسناتر التعليمية (LMS Core)',
        titleEn: 'LMS Core Educational Center Manager',
        badgeAr: 'النظام الأساسي المعتمد',
        badgeEn: 'Certified Flagship LMS',
        taglineAr: 'بوابة إلكترونية متكاملة لإدارة الحصص، مجموعات الطلاب، الجداول وسجلات الحضور والغياب للسناتر الكبرى والمدرسين.',
        taglineEn: 'Complete cloud platform for orchestrating classroom sessions, student cohorts, schedules, and fee ledgers.',
        descriptionAr: 'منظومة LMS Core صُممت خصيصاً لمواءمة المتطلبات التشغيلية الواقعية للمراكز التعليمية والسناتر.',
        descriptionEn: 'Engineered specifically for tutoring centers and academies.',
        version: 'v3.8.2',
        developer: 'Lern Web Systems & Lab',
        rating: 4.9,
        reviewsCount: 312,
        accentColor: '#3b82f6',
        isPublished: false, // Unpublished by default as requested
        featuresAr: [
          'لوحة قيادة تفاعلية للمعلمين والإداريين تدعم تعدد الفروع والقاعات',
          'توليد بطاقات QR ذكية لكل طالب لسرعة تسجيل الحضور عند بوابات السنتر',
          'بوابة دفع مدمجة تدعم فودافون كاش، انستاباي، والتحويلات المباشرة'
        ],
        featuresEn: [
          'Multi-branch administrative dashboard managing physical classrooms and online hubs',
          'Instant student smart QR badge generation for millisecond gate check-in',
          'Integrated payment gateway supporting mobile wallets'
        ],
        techStack: ['Next.js 14', 'Tailwind CSS', 'Vercel Edge', 'SQLite / Cloud SQL', 'PWA Engine'],
        priceMonthly: '950 ج.م / $29',
        priceAnnual: '8,500 ج.م / $249',
        priceFull: '27,000 ج.م / $799',
        sourceCode: `// LMS Core Knowledge Base\nexport const config = {\n  version: "3.8.2",\n  features: ["QR_GATE", "PAYMENTS", "ROLE_RBAC"],\n  theme: "blue-modern"\n};`,
        fileData: [],
        secretFiles: [
          {
            name: 'كود السورس كود الأصلي (Full Next.js Repo)',
            type: 'github',
            urlOrNotes: 'git@github.com:lernweb-private/lms-core-master.git (مستودع خاص - متاح للأدمن فقط)',
            updatedAt: '2026-10-24'
          }
        ],
        screenshots: [
          { titleAr: 'لوحة إدارة الفروع والطلاب', titleEn: 'Branch & Student Ledger', bgGradient: 'from-blue-900 to-indigo-950', mockupType: 'dashboard' },
          { titleAr: 'بوابة تسجيل الحضور بالباركود', titleEn: 'QR Gate Check-In Terminal', bgGradient: 'from-sky-900 to-slate-900', mockupType: 'qr' }
        ],
        sandboxConfig: {
          centerName: 'أكاديمية ليرن ويب المركزية',
          theme: 'ocean',
          activeCourse: 'كورس الرياضيات للثانوية العامة',
          hasQuiz: true,
          bannerText: 'تنبيه: بدأ التسجيل في المجموعات الجديدة للفصل الدراسي الثاني!',
          tutorName: 'أ. د. كريم المنشاوي'
        }
      },
      {
        id: 'ai-exam-proctor',
        category: 'ai',
        titleAr: 'منصة الاختبارات الذكية والمراقبة الآلية (Proctor AI)',
        titleEn: 'Proctor AI Smart Examination Suite',
        badgeAr: 'ذكاء اصطناعي فوري',
        badgeEn: 'Real-time AI Shield',
        taglineAr: 'محرك تقييم فوري يمنع تسريب الاختبارات ويكشف محاولات الغش مع تصحيح ذكي للأسئلة.',
        taglineEn: 'High-integrity testing engine featuring active anti-cheat safeguards and semantic open-ended grading.',
        descriptionAr: 'منظومة Proctor AI تقدم تجربة اختبارات آمنة تماماً تدعم بنوك الأسئلة المتدرجة الصعوبة.',
        descriptionEn: 'Resilient testing ecosystem equipped with algorithmic question randomization.',
        version: 'v2.4.0',
        developer: 'Cognitive Learner Inc.',
        rating: 4.8,
        reviewsCount: 184,
        accentColor: '#8b5cf6',
        isPublished: false, // Unpublished by default
        featuresAr: [
          'تأمين كامل للمتصفح مع منع النسخ وتصوير الشاشة وتبديل النوافذ',
          'بنوك أسئلة ديناميكية تعيد ترتيب الأسئلة والخيارات لكل طالب',
          'تصحيح فوري مدعوم بالذكاء الاصطناعي مع تقديم تحليل مفصل لكل إجابة'
        ],
        featuresEn: [
          'Lockdown browser environment preventing clipboard copying and tab jumps',
          'Dynamic question pools generating unique permutations per candidate',
          'Instant AI-assisted rubric evaluation with step-by-step diagnostic feedback'
        ],
        techStack: ['WebAssembly', 'Next.js App Router', 'TensorFlow.js', 'Tailwind CSS'],
        priceMonthly: '1,200 ج.م / $39',
        priceAnnual: '10,500 ج.م / $299',
        priceFull: '32,000 ج.م / $950',
        sourceCode: `// Proctor AI Exam Logic\nconst antiCheat = {\n  lockBrowser: true,\n  trackTabSwitch: true,\n  aiScoring: "semantic"\n};`,
        fileData: [],
        secretFiles: [
          {
            name: 'نماذج الكشف الذكي بالـ AI (TensorFlow Weights)',
            type: 'zip',
            urlOrNotes: 'https://storage.lernweb.internal/models/proctor-ai-weights.tar.gz',
            updatedAt: '2026-10-22'
          }
        ],
        screenshots: [
          { titleAr: 'واجهة الامتحان المقفل والمؤقت', titleEn: 'Lockdown Exam Container', bgGradient: 'from-purple-950 to-slate-900', mockupType: 'quiz' }
        ],
        sandboxConfig: {
          centerName: 'مركز التقييم والقياس الذكي',
          theme: 'midnight',
          activeCourse: 'اختبار تجريبي في الفيزياء والكيمياء',
          hasQuiz: true,
          bannerText: 'الاختبار التجريبي مفتوح الآن: ينتهي الوقت المتبقي تلقائياً بعد 15 دقيقة!',
          tutorName: 'أ. د. سمير عبد الرحمن'
        }
      }
    ],
    settings: {
      adminPasscode: '100100',
      targetWhatsAppNumber: '201024889921',
      centerName: 'ليرن ويب | Lern Web',
      contactEmail: 'contact@lernweb.com',
      socialLinks: {
        whatsapp: 'https://wa.me/201024889921',
        facebook: 'https://facebook.com/lernweb.official',
        youtube: 'https://youtube.com/@lernweb',
        tiktok: 'https://tiktok.com/@lernweb'
      },
      socialAppNames: {
        whatsapp: 'واتساب',
        facebook: 'فيسبوك',
        youtube: 'يوتيوب',
        tiktok: 'تيك توك'
      },
      paymentMethodLabels: { ar: 'طرق الدفع والاشتراك', en: 'Payment & Subscription Methods' },
      primaryColor: '#2563eb',
      accentColor: '#8b5cf6',
      themeMode: 'user',
      globalPrices: {
        monthlyAr: '950 ج.م / $29',
        monthlyEn: '$29 / 950 EGP',
        annualAr: '8,500 ج.م / $249',
        annualEn: '$249 / 8,500 EGP',
        fullAr: '27,000 ج.م / $799',
        fullEn: '$799 / 27,000 EGP'
      },
      seoSettings: {
        title: 'ليرن ويب | Lern Web - المنظومة التعليمية السحابية المتكاملة',
        description: 'سوق أدوات ومحاكي مراكز تعليمية متطورة مع محرك PWA وترخيص مرن وتملك كامل للكود المصدري.',
        ogImage: '/og-image.png',
        twitterImage: '/twitter-image.png'
      }
    },
    wallets: [
      {
        id: 'vodafone-cash',
        nameAr: 'فودافون كاش (Vodafone Cash)',
        nameEn: 'Vodafone Cash (Egypt)',
        number: '01024889921',
        badge: 'مصر - فودافون كاش فوري',
        instructionsAr: 'حول المبلغ المطلوب إلى رقم فودافون كاش الموضح، ثم احتفظ بكود العملية أو لقطة الشاشة.',
        instructionsEn: 'Transfer funds to the specified Vodafone Cash number, then submit reference ID.',
        color: '#e11d48',
        isActive: true
      },
      {
        id: 'orange-cash',
        nameAr: 'أورانج كاش (Orange Cash)',
        nameEn: 'Orange Cash (Egypt)',
        number: '01224889921',
        badge: 'محفظة أورانج كاش الفورية',
        instructionsAr: 'قم بإدخال رقم هاتفك المحمول ليصلك كود التحقق OTP لإتمام الدفع المباشر، أو حول إلى رقم المحفظة.',
        instructionsEn: 'Enter your registered mobile phone number to receive a one-time OTP verification code for instant checkout.',
        color: '#f97316',
        isActive: true
      },
      {
        id: 'instapay',
        nameAr: 'انستاباي الفوري (InstaPay)',
        nameEn: 'InstaPay Direct IPN (Egypt)',
        number: 'lernweb@instapay',
        badge: 'تحويل بنكي لحظي 0% عمولة',
        instructionsAr: 'افتح تطبيق انستاباي، اختر تحويل إلى عنوان دفع لحظي (IPA) واكتب lernweb@instapay ثم اضغط تأكيد.',
        instructionsEn: 'Transfer via InstaPay IPA to lernweb@instapay without fees.',
        color: '#6366f1',
        isActive: true
      }
    ],
    plans: [
      {
        id: 'plan-monthly',
        nameAr: 'الاشتراك الشهري المرن',
        nameEn: 'Flexible Monthly Rental',
        priceAr: '950 ج.م / $29',
        priceEn: '$29 / 950 EGP',
        periodAr: 'شهرياً',
        periodEn: 'per month',
        badgeAr: 'للمراكز الناشئة',
        badgeEn: 'Starter Centers',
        descriptionAr: 'مثالي للمدرسين والسناتر الصغيرة التي تبدأ رحلتها الرقمية.',
        descriptionEn: 'Ideal for individual tutors and growing tutoring centers.',
        isPopular: false,
        accentColor: '#3b82f6'
      },
      {
        id: 'plan-annual',
        nameAr: 'الترخيص السنوي المتقدم',
        nameEn: 'Advanced Annual License',
        priceAr: '8,500 ج.م / $249',
        priceEn: '$249 / 8,500 EGP',
        periodAr: 'سنوياً',
        periodEn: 'per year',
        badgeAr: 'الأكثر طلباً',
        badgeEn: 'Most Popular',
        descriptionAr: 'يشمل اسم نطاق خاص بالمركز، دعم فني فوري، وسعة غير محدودة.',
        descriptionEn: 'Includes Custom Domain, VIP priority SLA, and unlimited quotas.',
        isPopular: true,
        accentColor: '#3b82f6'
      },
      {
        id: 'plan-full',
        nameAr: 'التملك الكامل للكود المصدر',
        nameEn: 'Full Outright Source Buyout',
        priceAr: '27,000 ج.م / $799',
        priceEn: '$799 / 27,000 EGP',
        periodAr: 'دفعة واحدة',
        periodEn: 'one-time payment',
        badgeAr: 'ملكية مدى الحياة',
        badgeEn: 'White-Label Ownership',
        descriptionAr: 'احصل على كامل الكود المصدري بدون أي اشتراكات شهرية.',
        descriptionEn: 'Receive complete uncompressed source code. Zero recurring fees.',
        isPopular: false,
        accentColor: '#8b5cf6'
      }
    ],
    ai_drafts: [],
    users: [],
    media_resources: [],
    user_orders: [],
    reviews: [],
    activity_logs: [
      {
        id: 'log-1',
        actionType: 'settings_updated',
        titleAr: 'تحديث تفضيلات مظهر المنصة',
        titleEn: 'Site-wide Theme Preferences Updated',
        detailsAr: 'تم ضبط وضع الثيم الشامل وتأكيد حفظ إعدادات النظام.',
        detailsEn: 'Configured global theme preference and saved settings.',
        timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString()
      }
    ],
    chat_messages: [],
    support_tickets: [],
    notifications: [],
    articles: [
      {
        id: 'article-pwa-revolution',
        titleAr: 'دليل التحول الرقمي للمراكز التعليمية: كيف توفر تقنية PWA بديلاً فائقاً للتطبيقات التقليدية؟',
        titleEn: 'Digital Transformation for Academies: How PWAs Outperform Traditional Apps',
        categoryAr: 'تقنية وتطوير',
        categoryEn: 'Tech & Dev',
        author: 'م. أحمد الشناوي',
        readTime: '4 دقائق',
        excerptAr: 'تعرف على كيفية عمل تطبيقات الويب التقدمية (PWA) دون الحاجة لمتاجر التطبيقات ومع دعم كامل للعمل بدون إنترنت.',
        excerptEn: 'Discover how Progressive Web Apps eliminate app store friction while providing 100% offline functionality.',
        contentAr: 'تُعد تطبيقات الويب التقدمية (Progressive Web Apps) النقلة النوعية الأكبر في بناء المنظومات التعليمية السحابية. من خلال ميزات التخزين المؤقت المتقدمة عبر Service Workers، يستطيع الطلاب وأولياء الأمور تصفح المحاضرات والجداول وتسجيل الحضور بالـ QR code حتى في حال انقطاع اتصال الإنترنت تماماً داخل قاعات السنتر.',
        contentEn: 'Progressive Web Apps represent a major leap forward for cloud educational systems. Utilizing Service Workers for intelligent caching, students can access lecture recordings and attendance passes even when connectivity is offline.',
        imageUrl: '/homepage_view.png',
        tags: ['PWA', 'التعليم الذكي', 'التطوير السحابي'],
        isPublished: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'article-ai-proctoring',
        titleAr: 'مستقبل الاختبارات الإلكترونية: كيف تمنع خوارزميات المراقبة الذكية تسريب الامتحانات؟',
        titleEn: 'The Future of E-Exams: Algorithmic Anti-Cheat Integrity Systems',
        categoryAr: 'ذكاء اصطناعي',
        categoryEn: 'Artificial Intelligence',
        author: 'د. ياسمين فؤاد',
        readTime: '6 دقائق',
        excerptAr: 'استعراض لأحدث تقنيات تأمين بيئة الاختبارات، إغلاق المتصفح الآمن، وتوليد أسئلة فريدة لكل طالب.',
        excerptEn: 'Deep dive into browser lockdown systems, randomized question permutation, and instant AI assessment.',
        contentAr: 'أصبحت نزاهة الامتحانات التحدي الأكبر للمراكز والسناتر التعليمية. توفر منظومة المراقبة الذكية تقنيات متطورة مثل قفل المتصفح التام (Lockdown Browser) وكشف محاولات تبديل النوافذ والتقاط الشاشات، فضلاً عن التصحيح الدلالي للأسئلة المقالية في أجزاء من الثانية.',
        contentEn: 'Assessment integrity is paramount for high-stakes test prep. Modern proctoring suites employ automated lockdown sandboxes preventing screen capture and multi-tab switching, with sub-second semantic answer evaluation.',
        imageUrl: '/public/admin_dashboard_view.png',
        tags: ['AI', 'الاختبارات', 'الحماية'],
        isPublished: true,
        createdAt: new Date().toISOString()
      }
    ],
    faqs: [
      {
        id: 'faq-1',
        categoryAr: 'عن المنصة',
        categoryEn: 'About Platform',
        questionAr: 'ما هي منصة ليرن ويب (Lern Web) وكيف تفيد المركز التعليمي؟',
        questionEn: 'What is Lern Web and how does it empower educational centers?',
        answerAr: 'منظومة ليرن ويب هي بيئة سحابية متكاملة تتيح للمدرسين والمراكز والسناتر التعليمية إطلاق منصاتهم الخاصة بهوية بصرية مستقلة، وتتضمن بوابات إدارة الطلاب، نظام الحضور الذكي بالـ QR، بنوك الأسئلة والاختبارات التفاعلية، وبيئات البرمجة السحابية مع تطبيق PWA يعمل بدون إنترنت.',
        answerEn: 'Lern Web is a unified cloud ecosystem enabling educators and academies to deploy custom branded portals featuring student hubs, sub-200ms QR check-in gates, AI-proctored exam suites, and PWA offline support.',
        order: 1,
        isPublished: true
      },
      {
        id: 'faq-2',
        categoryAr: 'نظام الاشتراكات',
        categoryEn: 'Pricing Models',
        questionAr: 'ما هي باقات الاشتراك والترخيص المتاحة (شهرى، سنوى، تمليك)؟',
        questionEn: 'What pricing and licensing tiers are available?',
        answerAr: 'تقدم المنصة 3 باقات مرنة تناسب جميع الاحتياجات:\n1. الإيجار الشهري (Monthly): اشتراك مرن وتكلفة منخفضة لتجربة التشغيل.\n2. السنوي المعتمد (Annual): الباقة الأكثر شيوعاً وتشمل استضافة Edge فائقة السرعة، الدعم الفني المباشر، والتحديثات الدورية.\n3. التملك الكامل (Full Buyout): التسليم الكامل للكود المصدري الأصلي غير المضغوط مع ترخيص استخدام دائم دون أي اشتراكات مستقبلياً.',
        answerEn: 'We offer 3 flexible tiers:\n1. Monthly Rental: Low commitment operational tier.\n2. Annual Suite: High-performance Vercel Edge hosting with SLA updates.\n3. Full Source Code Buyout: Perpetual license with uncompressed Next.js source repository ownership.',
        order: 2,
        isPublished: true
      },
      {
        id: 'faq-3',
        categoryAr: 'تطبيق PWA',
        categoryEn: 'PWA & Offline',
        questionAr: 'كيف أقوم بتثبيت واستخدام تطبيق الـ PWA على الهاتف والحاسوب؟',
        questionEn: 'How do I install and run the Progressive Web App (PWA)?',
        answerAr: 'يمكنك تثبيت المنصة بنقرة واحدة بالضغط على زر "تثبيت التطبيق الآن" في الشريط العلوي، أو خيار "Add to Home Screen" من قائمة المتصفح. يتميز التطبيق بالعمل كأنه تطبيق محلي سريع جداً، مع التخزين المحلي المؤقت (Service Worker) للعمل حتى عند ضعف أو انقطاع الإنترنت.',
        answerEn: 'Click the "Install App" prompt in the header or "Add to Home Screen" in your browser. The PWA behaves like a native mobile app with Service Worker caching for seamless offline usage.',
        order: 3,
        isPublished: true
      },
      {
        id: 'faq-4',
        categoryAr: 'التخصيص بالذكاء الاصطناعي',
        categoryEn: 'AI Studio',
        questionAr: 'كيف أستخدم استوديو التخصيص بالذكاء الاصطناعي والمحاكي التفاعلي؟',
        questionEn: 'How do I use the AI Customizer Studio & Live Sandbox Simulator?',
        answerAr: 'في تبويب "المحاكي والذكاء الاصطناعي"، يمكنك كتابة أوامرك باللغة الطبيعية وسيقوم المساعد الذكي بتوليد التعديلات فورياً في المحاكي أمامك مع إمكانية إرسال المسودة للأدمن للاعتماد ومتابعة حالتها من لوحة العميل.',
        answerEn: 'In the Sandbox tab, enter natural language prompts to instantaneously re-render the simulator. Submit your staged draft to the Admin and track approval inside your Client Dashboard.',
        order: 4,
        isPublished: true
      }
    ],
    announcements: [
      {
        id: 'ann-1',
        titleAr: 'تحديث النسخة v3.8.5',
        titleEn: 'Release v3.8.5 Live',
        messageAr: '🚀 تم إطلاق محرك CMS المتكامل ولوحة التحكم المخصصة لإدارة المحتوى والمقالات والمشاريع مباشرة!',
        messageEn: '🚀 Full-featured CMS and Dedicated Control Panel now live for seamless dynamic content management!',
        badgeAr: 'جديد المنصة',
        badgeEn: 'New Update',
        type: 'success',
        isActive: true,
        targetUrl: '#dashboard'
      }
    ]
  };

  try {
    fs.writeFileSync(dbFile, JSON.stringify(initialDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to initialize lernweb_db.json on disk:', err);
  }

  return initialDb;
}

function saveDb(data: DatabaseSchema) {
  try {
    data.version = (data.version || 0) + 1;
    data.lastModified = Date.now();
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving DB file:', e);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));

  let db = loadDb();

  // Full cross-device sync endpoint - Refactored to fetch from Firestore
  app.get('/api/sync', async (req, res) => {
    try {
      const collections = [
        'projects', 'settings', 'wallets', 'plans', 'drafts', 
        'users', 'media_resources', 'user_orders', 'reviews', 
        'activity_logs', 'chat_messages', 'support_tickets', 'notifications',
        'articles', 'faqs', 'announcements'
      ];
      
      const results: any = {};
      
      await Promise.all(collections.map(async (col) => {
        try {
          const snap = await fdb.collection(col).get();
          results[col] = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (e) {
          console.warn(`Failed to fetch collection ${col} from Firestore:`, e);
          results[col] = [];
        }
      }));

      res.json({
        version: Date.now(), // Use timestamp as version
        lastModified: Date.now(),
        projects: results.projects || [],
        settings: results.settings?.find((s: any) => s.id === 'global') || db.settings,
        wallets: results.wallets || [],
        plans: results.plans || [],
        drafts: results.drafts || [],
        users: results.users || [],
        media: results.media_resources || [],
        orders: results.user_orders || [],
        reviews: results.reviews || [],
        logs: results.activity_logs || [],
        chats: results.chat_messages || [],
        tickets: results.support_tickets || [],
        notifications: results.notifications || [],
        articles: results.articles && results.articles.length > 0 ? results.articles : db.articles,
        faqs: results.faqs && results.faqs.length > 0 ? results.faqs : db.faqs,
        announcements: results.announcements && results.announcements.length > 0 ? results.announcements : db.announcements
      });
    } catch (err) {
      console.error('Critical sync error:', err);
      res.status(500).json({ error: 'Sync failed' });
    }
  });


  // API Routes - Refactored to Firestore
  app.get('/api/projects', async (req, res) => {
    try {
      const includeUnpublished = req.query.includeUnpublished === 'true';
      const snap = await fdb.collection('projects').get();
      const all = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (includeUnpublished) {
        res.json(all);
      } else {
        res.json(all.filter((p: any) => p.isPublished));
      }
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  });

  app.post('/api/projects', async (req, res) => {
    try {
      const p = req.body;
      await fdb.collection('projects').doc(p.id).set(p, { merge: true });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to save project' });
    }
  });

  app.delete('/api/projects/:id', async (req, res) => {
    try {
      await fdb.collection('projects').doc(req.params.id).delete();
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to delete project' });
    }
  });

  app.patch('/api/projects/:id/publish', async (req, res) => {
    try {
      const docRef = fdb.collection('projects').doc(req.params.id);
      const doc = await docRef.get();
      if (!doc.exists) return res.status(404).json({ error: 'Project not found' });
      const current = doc.data();
      const newState = !current?.isPublished;
      await docRef.update({ isPublished: newState });
      res.json({ success: true, isPublished: newState });
    } catch (e) {
      res.status(500).json({ error: 'Failed to patch project' });
    }
  });

  // Settings
  app.get('/api/settings', async (req, res) => {
    try {
      const doc = await fdb.collection('settings').doc('global').get();
      res.json(doc.exists ? doc.data() : {});
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  });

  app.post('/api/settings', async (req, res) => {
    try {
      await fdb.collection('settings').doc('global').set(req.body, { merge: true });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to save settings' });
    }
  });

  // Wallets
  app.get('/api/wallets', async (req, res) => {
    try {
      const snap = await fdb.collection('wallets').get();
      res.json(snap.docs.map(doc => doc.data()));
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch wallets' });
    }
  });

  app.post('/api/wallets', async (req, res) => {
    try {
      const wallets = req.body; // Array
      if (Array.isArray(wallets)) {
        const batch = fdb.batch();
        wallets.forEach(w => {
          const ref = fdb.collection('wallets').doc(w.id);
          batch.set(ref, w, { merge: true });
        });
        await batch.commit();
      }
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to save wallets' });
    }
  });

  // AI Drafts
  app.get('/api/drafts', async (req, res) => {
    try {
      const snap = await fdb.collection('drafts').get();
      res.json(snap.docs.map(doc => doc.data()));
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch drafts' });
    }
  });

  app.post('/api/drafts', async (req, res) => {
    try {
      const d = req.body;
      await fdb.collection('drafts').doc(d.id).set(d, { merge: true });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to save draft' });
    }
  });

  app.patch('/api/drafts/:id', async (req, res) => {
    try {
      const { status, notes } = req.body;
      await fdb.collection('drafts').doc(req.params.id).update({
        status,
        ...(notes !== undefined ? { notes } : {})
      });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to update draft' });
    }
  });

  // Users
  app.get('/api/users', async (req, res) => {
    try {
      const snap = await fdb.collection('users').get();
      res.json(snap.docs.map(doc => doc.data()));
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  app.post('/api/users', async (req, res) => {
    try {
      const u = req.body;
      await fdb.collection('users').doc(u.id).set(u, { merge: true });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to save user' });
    }
  });

  app.delete('/api/users/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      await fdb.collection('users').doc(userId).delete();
      // Optional: Cleanup associated drafts/orders (expensive in firestore without cloud functions)
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to delete user' });
    }
  });

  // Plans
  app.get('/api/plans', async (req, res) => {
    try {
      const snap = await fdb.collection('plans').get();
      res.json(snap.docs.map(doc => doc.data()));
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch plans' });
    }
  });

  app.post('/api/plans', async (req, res) => {
    try {
      const plans = req.body;
      if (Array.isArray(plans)) {
        const batch = fdb.batch();
        plans.forEach(p => {
          const ref = fdb.collection('plans').doc(p.id);
          batch.set(ref, p, { merge: true });
        });
        await batch.commit();
      }
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to save plans' });
    }
  });

  // Media
  app.get('/api/media', async (req, res) => {
    try {
      const snap = await fdb.collection('media_resources').get();
      res.json(snap.docs.map(doc => doc.data()));
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch media' });
    }
  });

  app.post('/api/media', async (req, res) => {
    try {
      const m = req.body;
      await fdb.collection('media_resources').doc(m.id).set(m, { merge: true });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to save media' });
    }
  });

  app.delete('/api/media/:id', async (req, res) => {
    try {
      await fdb.collection('media_resources').doc(req.params.id).delete();
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to delete media' });
    }
  });

  // Orders
  app.get('/api/orders', async (req, res) => {
    try {
      const snap = await fdb.collection('user_orders').get();
      res.json(snap.docs.map(doc => doc.data()));
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  app.post('/api/orders', async (req, res) => {
    try {
      const o = req.body;
      await fdb.collection('user_orders').doc(o.id).set(o, { merge: true });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to save order' });
    }
  });

  // Reviews
  app.get('/api/reviews', async (req, res) => {
    try {
      const snap = await fdb.collection('reviews').get();
      res.json(snap.docs.map(doc => doc.data()));
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  });

  app.post('/api/reviews', async (req, res) => {
    try {
      const r = req.body;
      await fdb.collection('reviews').doc(r.id).set(r, { merge: true });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to save review' });
    }
  });

  app.delete('/api/reviews/:id', async (req, res) => {
    try {
      await fdb.collection('reviews').doc(req.params.id).delete();
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to delete review' });
    }
  });

  // Activity Logs
  app.get('/api/logs', async (req, res) => {
    try {
      const snap = await fdb.collection('activity_logs').get();
      res.json(snap.docs.map(doc => doc.data()));
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch logs' });
    }
  });

  app.post('/api/logs', async (req, res) => {
    try {
      const log = req.body;
      await fdb.collection('activity_logs').doc(log.id).set(log, { merge: true });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to save log' });
    }
  });

  // Chat Messages
  app.get('/api/chats', async (req, res) => {
    try {
      const snap = await fdb.collection('chat_messages').get();
      res.json(snap.docs.map(doc => doc.data()));
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch chats' });
    }
  });

  app.post('/api/chats', async (req, res) => {
    try {
      const chat = req.body;
      await fdb.collection('chat_messages').doc(chat.id).set(chat, { merge: true });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to save chat' });
    }
  });

  app.delete('/api/chats/:id', async (req, res) => {
    try {
      await fdb.collection('chat_messages').doc(req.params.id).delete();
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to delete chat' });
    }
  });

  // Support Tickets API
  app.get('/api/tickets', async (req, res) => {
    try {
      const snap = await fdb.collection('support_tickets').get();
      res.json(snap.docs.map(doc => doc.data()));
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch tickets' });
    }
  });

  app.post('/api/tickets', async (req, res) => {
    try {
      const ticket = req.body;
      await fdb.collection('support_tickets').doc(ticket.id).set(ticket, { merge: true });
      res.json({ success: true, ticket });
    } catch (e) {
      res.status(500).json({ error: 'Failed to save ticket' });
    }
  });

  app.delete('/api/tickets/:id', async (req, res) => {
    try {
      await fdb.collection('support_tickets').doc(req.params.id).delete();
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to delete ticket' });
    }
  });

  // CMS Articles API
  app.get('/api/articles', async (req, res) => {
    try {
      const includeDrafts = req.query.includeDrafts === 'true';
      const snap = await fdb.collection('articles').get();
      let all = snap.docs.map(doc => doc.data());
      if (all.length === 0) {
        all = db.articles || [];
      }
      if (includeDrafts) {
        res.json(all);
      } else {
        res.json(all.filter((a: any) => a.isPublished !== false));
      }
    } catch (e) {
      res.json(db.articles || []);
    }
  });

  app.post('/api/articles', async (req, res) => {
    try {
      const article = req.body;
      await fdb.collection('articles').doc(article.id).set(article, { merge: true });
      // Update memory db
      db.articles = [article, ...(db.articles || []).filter((a: any) => a.id !== article.id)];
      saveDb(db);
      res.json({ success: true, article });
    } catch (e) {
      res.status(500).json({ error: 'Failed to save article' });
    }
  });

  app.delete('/api/articles/:id', async (req, res) => {
    try {
      await fdb.collection('articles').doc(req.params.id).delete();
      db.articles = (db.articles || []).filter((a: any) => a.id !== req.params.id);
      saveDb(db);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to delete article' });
    }
  });

  // CMS FAQs API
  app.get('/api/faqs', async (req, res) => {
    try {
      const snap = await fdb.collection('faqs').get();
      let all = snap.docs.map(doc => doc.data());
      if (all.length === 0) {
        all = db.faqs || [];
      }
      res.json(all);
    } catch (e) {
      res.json(db.faqs || []);
    }
  });

  app.post('/api/faqs', async (req, res) => {
    try {
      const faq = req.body;
      await fdb.collection('faqs').doc(faq.id).set(faq, { merge: true });
      db.faqs = [faq, ...(db.faqs || []).filter((f: any) => f.id !== faq.id)];
      saveDb(db);
      res.json({ success: true, faq });
    } catch (e) {
      res.status(500).json({ error: 'Failed to save faq' });
    }
  });

  app.delete('/api/faqs/:id', async (req, res) => {
    try {
      await fdb.collection('faqs').doc(req.params.id).delete();
      db.faqs = (db.faqs || []).filter((f: any) => f.id !== req.params.id);
      saveDb(db);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to delete faq' });
    }
  });

  // CMS Announcements API
  app.get('/api/announcements', async (req, res) => {
    try {
      const snap = await fdb.collection('announcements').get();
      let all = snap.docs.map(doc => doc.data());
      if (all.length === 0) {
        all = db.announcements || [];
      }
      res.json(all);
    } catch (e) {
      res.json(db.announcements || []);
    }
  });

  app.post('/api/announcements', async (req, res) => {
    try {
      const ann = req.body;
      await fdb.collection('announcements').doc(ann.id).set(ann, { merge: true });
      db.announcements = [ann, ...(db.announcements || []).filter((a: any) => a.id !== ann.id)];
      saveDb(db);
      res.json({ success: true, announcement: ann });
    } catch (e) {
      res.status(500).json({ error: 'Failed to save announcement' });
    }
  });



  // Robust Multi-Model AI Generator with Exponential Backoff and Attempt Timeout
  async function generateAiContentWithRetry(params: any, retries = 1) {
    const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
    let lastError: any = null;

    const timeoutPromise = (ms: number) => new Promise((_, reject) => setTimeout(() => reject(new Error(`AI generation timed out after ${ms}ms`)), ms));

    for (const model of candidateModels) {
      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          const apiCall = ai.models.generateContent({
            ...params,
            model
          });

          const response: any = await Promise.race([apiCall, timeoutPromise(8000)]);
          if (response && response.text) {
            return response;
          }
        } catch (err: any) {
          lastError = err;
          console.warn(`[AI] Model ${model} attempt ${attempt + 1} encountered:`, err?.message || err);
          if (attempt < retries) {
            const delay = Math.min(500 * Math.pow(2, attempt) + Math.random() * 200, 2000);
            await new Promise(r => setTimeout(r, delay));
          }
        }
      }
    }
    throw lastError || new Error('All AI models failed to respond');
  }

  // AI Chat Route
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, history, systemInstruction } = req.body;
      if (!message) return res.status(400).json({ error: 'Message is required' });

      if (!aiApiKey) {
        throw new Error('GEMINI_API_KEY is missing from environment');
      }

      // Fetch data from Firestore for real-time awareness
      let liveProjects = [];
      let liveSettings: any = db.settings;
      let liveMedia = [];
      let livePlans = [];

      try {
        const projectsSnap = await fdb.collection('projects').where('isPublished', '==', true).get();
        liveProjects = projectsSnap.docs.map(doc => doc.data());
        
        const settingsSnap = await fdb.collection('settings').doc('global').get();
        if (settingsSnap.exists) {
          liveSettings = settingsSnap.data();
        }
        
        const mediaSnap = await fdb.collection('media_resources').where('isPublished', '==', true).get();
        liveMedia = mediaSnap.docs.map(doc => doc.data());

        const plansSnap = await fdb.collection('plans').get();
        livePlans = plansSnap.docs.map(doc => doc.data());
      } catch (err) {
        console.warn('Failed to fetch real-time data from Firestore in AI chat:', err);
        // Fallback to local db if firestore fetch fails
        liveProjects = db.projects.filter(p => p.isPublished);
        liveMedia = db.media_resources;
        livePlans = db.plans;
      }

      const contents = [];
      if (history && Array.isArray(history)) {
        history.forEach((msg: any) => {
          if (msg.text && msg.sender) {
            contents.push({
              role: msg.sender === 'user' ? 'user' : 'model',
              parts: [{ text: msg.text }]
            });
          }
        });
      }
      
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const defaultSystemInstruction = `
أنت "المساعد الذكي الرسمي والمهندس التقني لمنصة ليرن ويب (Lern Web AI Architect)".

مهمتك الأساسية:
1. الرد على استفسارات العملاء حول المنصة، الأسعار، والخدمات.
2. مساعدة العملاء في "تخصيص" منصاتهم برمجياً. لديك القدرة على تعديل الأكواد (JSX, CSS, JSON) وإرسال ملفات جديدة.
3. التفاعل باللهجة العامية المصرية الودودة والراقية، مع القدرة على التحدث بالفصحى والإنجليزية بطلاقة.

قدراتك التقنية المتقدمة:
- يمكنك اقتراح كود برمجي مباشرة في الدردشة.
- يمكنك توجيه العميل لاستخدام "المحاكي (Sandbox)" حيث يمكنك هناك توليد ملفات مشروع كاملة (Drafts) وإرسالها للأدمن.
- يجب أن تكون إجاباتك مبنية على البيانات الحالية للمنصة المذكورة أدناه.

سياق منصة ليرن ويب الحالي (بيانات حية):
1. المشاريع المتاحة: ${JSON.stringify(liveProjects.map(p => ({ id: p.id, titleAr: p.titleAr, category: p.category })))}
2. الإعدادات العامة: ${JSON.stringify({ centerName: liveSettings?.centerName, contactEmail: liveSettings?.contactEmail })}
3. الموارد التعليمية: ${JSON.stringify(liveMedia.map(m => m.titleAr))}
4. باقات الاشتراك:
   ${livePlans.map(p => `- ${p.nameAr}: ${p.priceAr} (${p.periodAr})`).join('\n')}

قواعد العمل:
- لا تذكر أبداً أنك نموذج لغوي أو ذكاء اصطناعي من شركة خارجية. أنت جزء أصيل من ليرن ويب.
- إذا سأل العميل عن "أورانج كاش" أو "فودافون كاش"، أكد له أنها مدعومة بالكامل وتعمل بشكل فوري.
- إذا طلب العميل تعديلاً برمجياً، قل له: "أقدر أعدلك الكود ده فوراً، وممكن تروح للمحاكي Sandbox عشان أبعت الملفات المعدلة للأدمن يعتمدها لك."
`;


      const response = await generateAiContentWithRetry({
        contents: contents,
        config: {
          systemInstruction: systemInstruction || defaultSystemInstruction,
          temperature: 0.7,
        }
      });

      if (!response.text) {
        throw new Error('Model returned an empty response');
      }

      res.json({ text: response.text, _v: '3.8.0' });
    } catch (err: any) {
      console.error('AI Chat Error:', err.message || err);
      const errorMsg = err.message || JSON.stringify(err);
      res.status(500).json({ 
        error: 'AI generation failed', 
        details: errorMsg,
        checkApiKey: !aiApiKey,
        _v: '3.8.0'
      });
    }
  });

  // AI Project Customization Route (For Sandbox)
  app.post('/api/ai/customize', async (req, res) => {
    try {
      const { prompt, baseConfig } = req.body;
      if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

      if (!aiApiKey) throw new Error('GEMINI_API_KEY missing');

      const systemInstruction = `
You are an expert software architect and full-stack developer for "Lern Web". 
Your task is to analyze the user's request and suggest modifications to the educational platform configuration and its source code.

You MUST return strictly valid JSON in this format:
{
  "explanationAr": "شرح التعديلات باللغة العربية...",
  "explanationEn": "Explanation of changes in English...",
  "theme": "ocean" | "midnight" | "emerald" | "amber",
  "centerName": "...",
  "activeCourse": "...",
  "bannerText": "...",
  "tutorName": "...",
  "hasQuiz": true | false,
  "modifiedCode": "The primary modified JSX/React code block if applicable...",
  "modifiedFiles": [
    {
      "name": "filename.extension",
      "content": "Full content of the modified or new file...",
      "type": "text/javascript" | "text/css" | "text/html" | "application/json"
    }
  ]
}

Context:
- The user is working on a sandbox version of a project.
- You should provide high-quality, production-ready code in the 'modifiedCode' or 'modifiedFiles' fields if the user asks for design or logic changes.
- If the user wants to change colors, suggest a matching 'theme'.
- Keep explanations professional and helpful.
`;

      const response = await generateAiContentWithRetry({
        contents: [
          {
            role: 'user',
            parts: [{ text: `Current Config & Source Context: ${JSON.stringify(baseConfig)}\n\nUser Customization Request: "${prompt}"` }]
          }
        ],
        config: {
          systemInstruction,
          responseMimeType: 'application/json'
        }
      });


      const text = response.text || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      res.json({
        success: true,
        explanationAr: parsed.explanationAr || 'تم تحليل طلبك.',
        explanationEn: parsed.explanationEn || 'Analyzed.',
        suggestedConfig: {
          centerName: parsed.centerName || baseConfig.centerName,
          theme: ['ocean', 'midnight', 'emerald', 'amber'].includes(parsed.theme) ? parsed.theme : baseConfig.theme,
          activeCourse: parsed.activeCourse || baseConfig.activeCourse,
          hasQuiz: typeof parsed.hasQuiz === 'boolean' ? parsed.hasQuiz : baseConfig.hasQuiz,
          bannerText: parsed.bannerText || baseConfig.bannerText,
          tutorName: parsed.tutorName || baseConfig.tutorName
        },
        modifiedCode: parsed.modifiedCode || '',
        modifiedFiles: parsed.modifiedFiles || []
      });

    } catch (err: any) {
      console.error('AI Customize Critical Failure:', err);
      res.status(500).json({ error: 'Customization failed', details: err.message });
    }
  });

  // Backup
  app.get('/api/backup', (req, res) => {
    db = loadDb();
    res.json({ version: '3.8', exportedAt: new Date().toISOString(), data: db });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
  }

  const port = 3000;
  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer();
