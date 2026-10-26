/**
 * Project: ليرن ويب | Lern Web
 * File: src/services/storageService.ts
 * Centralized persistent state manager connected to backend API and Firestore real-time listeners.
 */

import { subscribeToCollection, saveDocument, deleteDocument } from './firebaseService';

export interface ProjectItem {
  id: string;
  category: 'lms' | 'stem' | 'ai' | 'operations';
  titleAr: string;
  titleEn: string;
  badgeAr: string;
  badgeEn: string;
  taglineAr: string;
  taglineEn: string;
  descriptionAr: string;
  descriptionEn: string;
  version: string;
  developer: string;
  rating: number;
  reviewsCount: number;
  accentColor: string;
  isPublished: boolean;
  featuresAr: string[];
  featuresEn: string[];
  techStack: string[];
  priceMonthly: string;
  priceAnnual: string;
  priceFull: string;
  sourceCode: string;
  fileData: {
    id: string;
    name: string;
    base64: string;
    type: string;
    fileCategory?: string;
    featureMetadata?: string;
    size: number;
    updatedAt: string;
  }[];
  secretFiles: {
    name: string;
    type: 'github' | 'zip' | 'doc' | 'config';
    urlOrNotes: string;
    updatedAt: string;
  }[];
  screenshots: {
    titleAr: string;
    titleEn: string;
    bgGradient: string;
    mockupType: 'dashboard' | 'code' | 'quiz' | 'qr' | 'analytics';
  }[];
  sandboxConfig: {
    centerName: string;
    theme: 'ocean' | 'midnight' | 'emerald' | 'amber';
    activeCourse: string;
    hasQuiz: boolean;
    bannerText: string;
    tutorName: string;
  };
}

export interface AdminSettings {
  adminPasscode: string;
  targetWhatsAppNumber: string;
  centerName: string;
  contactEmail: string;
  socialLinks: {
    whatsapp: string;
    facebook: string;
    youtube: string;
    tiktok: string;
  };
  socialAppNames: Record<string, string>;
  paymentMethodLabels: {
    ar: string;
    en: string;
  };
  primaryColor: string;
  accentColor: string;
  themeMode?: 'dark' | 'light' | 'user';
  globalPrices: {
    monthlyAr: string;
    monthlyEn: string;
    annualAr: string;
    annualEn: string;
    fullAr: string;
    fullEn: string;
  };
  seoSettings: SeoSettings;
}

export interface SeoSettings {
  title: string;
  description: string;
  ogImage: string;
  twitterImage: string;
}

export interface WalletConfig {
  id: string;
  nameAr: string;
  nameEn: string;
  number: string;
  badge: string;
  instructionsAr: string;
  instructionsEn: string;
  color: string;
  isActive: boolean;
}

export interface SubscriptionPlan {
  id: string;
  nameAr: string;
  nameEn: string;
  priceAr: string;
  priceEn: string;
  periodAr: string;
  periodEn: string;
  badgeAr: string;
  badgeEn: string;
  descriptionAr: string;
  descriptionEn: string;
  isPopular?: boolean;
  accentColor?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  phone: string;
  password?: string;
  email?: string;
  createdAt: string;
  purchasedPlanId?: string;
}

export interface AiCustomizationDraft {
  id: string;
  projectId: string;
  projectTitle: string;
  visitorId: string;
  visitorName: string;
  visitorPhone: string;
  userPrompt: string;
  forkedAt: string;
  status: 'pending_review' | 'in_progress' | 'completed' | 'approved_published' | 'rejected';
  modifiedCode: string;
  modifiedConfig: {
    centerName: string;
    theme: 'ocean' | 'midnight' | 'emerald' | 'amber';
    activeCourse: string;
    hasQuiz: boolean;
    bannerText: string;
  };
  modifiedFiles?: {
    id: string;
    name: string;
    type: string;
    fileCategory?: string;
    featureMetadata?: string;
    content: string;
    updatedAt: string;
  }[];
  notes?: string;
}

export interface UserOrder {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  planType: 'monthly' | 'annual' | 'full';
  amount: string;
  paymentMethod: string;
  referenceId: string;
  createdAt: string;
  status: 'pending' | 'active';
}

export interface MediaResourceItem {
  id: string;
  type: 'video' | 'doc' | 'image';
  mediaSourceType?: 'youtube_url' | 'youtube_embed' | 'local_video' | 'image_url' | 'local_image';
  titleAr: string;
  titleEn: string;
  durationOrReadTimeAr: string;
  durationOrReadTimeEn: string;
  categoryAr: string;
  categoryEn: string;
  summaryAr: string;
  summaryEn: string;
  contentAr: string;
  contentEn: string;
  videoUrl?: string;
  imageUrl?: string;
  embedCode?: string;
  thumbnailBg: string;
  isPublished: boolean;
}

export interface CmsArticle {
  id: string;
  titleAr: string;
  titleEn: string;
  categoryAr: string;
  categoryEn: string;
  author: string;
  readTime: string;
  excerptAr: string;
  excerptEn: string;
  contentAr: string;
  contentEn: string;
  imageUrl?: string;
  tags: string[];
  isPublished: boolean;
  createdAt: string;
  viewsCount?: number;
}

export interface FaqItem {
  id: string;
  categoryAr: string;
  categoryEn: string;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  order: number;
  isPublished: boolean;
}

export interface AnnouncementBanner {
  id: string;
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  badgeAr: string;
  badgeEn: string;
  type: 'info' | 'success' | 'warning' | 'urgent';
  isActive: boolean;
  targetUrl?: string;
}

export interface ProjectReview {
  id: string;
  projectId: string;
  projectTitle: string;
  userId: string;
  userName: string;
  userPhone: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ActivityLogItem {
  id: string;
  actionType: 'project_created' | 'project_updated' | 'project_deleted' | 'project_published' | 'settings_updated' | 'draft_approved' | 'draft_updated' | 'media_created' | 'media_deleted' | 'review_deleted' | 'wallets_updated' | 'db_import' | 'db_export';
  titleAr: string;
  titleEn: string;
  detailsAr?: string;
  detailsEn?: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderPhone?: string;
  message: string;
  timestamp: string;
  isAdminReply?: boolean;
}

export interface SupportTicketMessage {
  id: string;
  sender: 'user' | 'ai' | 'admin';
  senderName?: string;
  text: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userPhone?: string;
  userEmail?: string;
  status: 'open' | 'in_progress' | 'closed';
  systemOverride?: string;
  createdAt: string;
  updatedAt: string;
  unreadByAdmin?: boolean;
  unreadByUser?: boolean;
  messages: SupportTicketMessage[];
}

export interface UserNotification {
  id: string;
  userId: string;
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  type: 'status_change' | 'system' | 'admin_note';
  read: boolean;
  createdAt: string;
}

const DEFAULT_INITIAL_PROJECTS: ProjectItem[] = [
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
    isPublished: false,
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
    sourceCode: '// LMS Core Knowledge Base',
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
      { titleAr: 'لوحة إدارة الفروع والطلاب', titleEn: 'Branch & Student Ledger', bgGradient: 'from-blue-900 to-indigo-950', mockupType: 'dashboard' }
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
    isPublished: false,
    featuresAr: ['تأمين كامل للمتصفح'],
    featuresEn: ['Lockdown browser'],
    techStack: ['WebAssembly', 'Next.js'],
    priceMonthly: '1,200 ج.م / $39',
    priceAnnual: '10,500 ج.م / $299',
    priceFull: '32,000 ج.م / $950',
    sourceCode: '// Proctor AI Exam Logic',
    fileData: [],
    secretFiles: [],
    screenshots: [],
    sandboxConfig: {
      centerName: 'مركز التقييم والقياس الذكي',
      theme: 'midnight',
      activeCourse: 'اختبار تجريبي',
      hasQuiz: true,
      bannerText: 'الاختبار التجريبي مفتوح الآن',
      tutorName: 'أ. د. سمير عبد الرحمن'
    }
  }
];

const DEFAULT_INITIAL_ARTICLES: CmsArticle[] = [
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
];

const DEFAULT_INITIAL_FAQS: FaqItem[] = [
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
];

const DEFAULT_INITIAL_ANNOUNCEMENTS: AnnouncementBanner[] = [
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
];

let cachedProjects: ProjectItem[] = [...DEFAULT_INITIAL_PROJECTS];
let cachedSettings: AdminSettings | null = null;
let cachedWallets: WalletConfig[] = [];
let cachedPlans: SubscriptionPlan[] = [];
let cachedDrafts: AiCustomizationDraft[] = [];
let cachedUsers: UserAccount[] = [];
let cachedMedia: MediaResourceItem[] = [];
let cachedOrders: UserOrder[] = [];
let cachedReviews: ProjectReview[] = [];
let cachedLogs: ActivityLogItem[] = [];
let cachedChats: ChatMessage[] = [];
let cachedTickets: SupportTicket[] = [];
let cachedNotifications: UserNotification[] = [];
let cachedArticles: CmsArticle[] = [...DEFAULT_INITIAL_ARTICLES];
let cachedFaqs: FaqItem[] = [...DEFAULT_INITIAL_FAQS];
let cachedAnnouncements: AnnouncementBanner[] = [...DEFAULT_INITIAL_ANNOUNCEMENTS];

let nodeAdminAuth = false;
let nodeUserAuth: UserAccount | null = null;

function safeFetch(url: string, options?: RequestInit) {
  if (typeof window !== 'undefined') {
    return fetch(url, options).catch(err => {
      console.warn('Network call error:', err);
    });
  }
  return Promise.resolve();
}

type StorageListener = () => void;
const storageListeners = new Set<StorageListener>();

export function subscribeToStorage(listener: StorageListener): () => void {
  storageListeners.add(listener);
  return () => {
    storageListeners.delete(listener);
  };
}

export function notifyStorageChange() {
  storageListeners.forEach(listener => {
    try {
      listener();
    } catch (err) {
      console.error('Storage listener error:', err);
    }
  });
}

let lastSyncVersion = 0;
let isSyncing = false;

export async function syncStorageWithServer(): Promise<boolean> {
  if (typeof window === 'undefined' || isSyncing) return false;
  isSyncing = true;
  try {
    const res = await fetch('/api/sync');
    if (!res.ok) throw new Error('Sync failed with status ' + res.status);
    const data = await res.json();

    if (Array.isArray(data.projects)) cachedProjects = data.projects;
    if (data.settings && typeof data.settings === 'object') cachedSettings = data.settings;
    if (Array.isArray(data.wallets)) cachedWallets = data.wallets;
    if (Array.isArray(data.plans)) cachedPlans = data.plans;
    if (Array.isArray(data.drafts)) cachedDrafts = data.drafts;
    if (Array.isArray(data.users)) cachedUsers = data.users;
    if (Array.isArray(data.media)) cachedMedia = data.media;
    if (Array.isArray(data.orders)) cachedOrders = data.orders;
    if (Array.isArray(data.reviews)) cachedReviews = data.reviews;
    if (Array.isArray(data.logs)) cachedLogs = data.logs;
    if (Array.isArray(data.chats)) cachedChats = data.chats;
    if (Array.isArray(data.tickets)) cachedTickets = data.tickets;
    if (Array.isArray(data.notifications)) cachedNotifications = data.notifications;
    if (Array.isArray(data.articles) && data.articles.length > 0) cachedArticles = data.articles;
    if (Array.isArray(data.faqs) && data.faqs.length > 0) cachedFaqs = data.faqs;
    if (Array.isArray(data.announcements) && data.announcements.length > 0) cachedAnnouncements = data.announcements;

    if (data.version) lastSyncVersion = data.version;

    notifyStorageChange();
    return true;
  } catch (err) {
    console.warn('Storage sync error:', err);
    return false;
  } finally {
    isSyncing = false;
  }
}

export async function initializeStorageBackend() {
  return await syncStorageWithServer();
}

// Automatically sync on load and attach real-time Firestore onSnapshot listeners for cross-device synchronization
if (typeof window !== 'undefined') {
  try {
    console.log('Initializing Firebase real-time listeners...');
    subscribeToCollection('projects', (data) => { console.log('Projects update:', data); cachedProjects = data as ProjectItem[]; notifyStorageChange(); });
    subscribeToCollection('settings', (data) => { 
      console.log('Settings update:', data); 
      if (data && data.length > 0) {
        // Find the 'global' settings doc
        const globalSettings = data.find(d => d.id === 'global');
        if (globalSettings) cachedSettings = globalSettings as AdminSettings;
      }
      notifyStorageChange(); 
    });
    subscribeToCollection('wallets', (data) => { console.log('Wallets update:', data); cachedWallets = data as WalletConfig[]; notifyStorageChange(); });
    subscribeToCollection('plans', (data) => { console.log('Plans update:', data); cachedPlans = data as SubscriptionPlan[]; notifyStorageChange(); });
    subscribeToCollection('drafts', (data) => { console.log('Drafts update:', data); cachedDrafts = data as AiCustomizationDraft[]; notifyStorageChange(); });
    subscribeToCollection('support_tickets', (data) => { console.log('Tickets update:', data); cachedTickets = data as SupportTicket[]; notifyStorageChange(); });
    subscribeToCollection('users', (data) => { console.log('Users update:', data); cachedUsers = data as UserAccount[]; notifyStorageChange(); });
    subscribeToCollection('media_resources', (data) => { console.log('Media update:', data); cachedMedia = data as MediaResourceItem[]; notifyStorageChange(); });
    subscribeToCollection('user_orders', (data) => { console.log('Orders update:', data); cachedOrders = data as UserOrder[]; notifyStorageChange(); });
    subscribeToCollection('reviews', (data) => { console.log('Reviews update:', data); cachedReviews = data as ProjectReview[]; notifyStorageChange(); });
    subscribeToCollection('activity_logs', (data) => { console.log('Logs update:', data); cachedLogs = data as ActivityLogItem[]; notifyStorageChange(); });
    subscribeToCollection('notifications', (data) => { console.log('Notifications update:', data); cachedNotifications = data as UserNotification[]; notifyStorageChange(); });
    subscribeToCollection('articles', (data) => { console.log('Articles update:', data); if (data && data.length > 0) cachedArticles = data as CmsArticle[]; notifyStorageChange(); });
    subscribeToCollection('faqs', (data) => { console.log('FAQs update:', data); if (data && data.length > 0) cachedFaqs = data as FaqItem[]; notifyStorageChange(); });
    subscribeToCollection('announcements', (data) => { console.log('Announcements update:', data); if (data && data.length > 0) cachedAnnouncements = data as AnnouncementBanner[]; notifyStorageChange(); });
    console.log('Firebase real-time listeners initialized successfully.');
  } catch (err) {
    console.error('Firebase real-time listener initialization FAILED:', err);
  }
}

export const storageService = {
  subscribe(listener: () => void): () => void {
    return subscribeToStorage(listener);
  },

  async syncNow(): Promise<boolean> {
    return await syncStorageWithServer();
  },

  forceSyncFromFirestore(): void {
    this.syncNow();
    notifyStorageChange();
  },

  isAdminLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lernweb_admin_auth_session') === 'true' || sessionStorage.getItem('lernweb_admin_auth_session') === 'true';
    }
    return nodeAdminAuth;
  },

  loginAdmin(passcodeAttempt: string): boolean {
    const settings = this.getSettings();
    if (passcodeAttempt.trim() === (settings?.adminPasscode || '100100').trim()) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('lernweb_admin_auth_session', 'true');
        sessionStorage.setItem('lernweb_admin_auth_session', 'true');
      } else {
        nodeAdminAuth = true;
      }
      notifyStorageChange();
      return true;
    }
    return false;
  },

  logoutAdmin(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lernweb_admin_auth_session');
      sessionStorage.removeItem('lernweb_admin_auth_session');
    } else {
      nodeAdminAuth = false;
    }
    notifyStorageChange();
  },

  getProjects(includeUnpublished: boolean = false): ProjectItem[] {
    if (includeUnpublished) return cachedProjects;
    return cachedProjects.filter(p => p.isPublished);
  },

  saveProjects(projects: ProjectItem[]): void {
    cachedProjects = projects;
    notifyStorageChange();
    projects.forEach(p => saveDocument('projects', p));
  },

  addProject(newProject: ProjectItem): void {
    cachedProjects.unshift(newProject);
    notifyStorageChange();
    saveDocument('projects', newProject);
  },

  updateProject(updated: ProjectItem): void {
    cachedProjects = cachedProjects.map(p => p.id === updated.id ? updated : p);
    notifyStorageChange();
    saveDocument('projects', updated);
  },

  deleteProject(projectId: string): void {
    cachedProjects = cachedProjects.filter(p => p.id !== projectId);
    notifyStorageChange();
    deleteDocument('projects', projectId);
  },

  togglePublishProject(projectId: string): boolean {
    let newStatus = false;
    cachedProjects = cachedProjects.map(p => {
      if (p.id === projectId) {
        newStatus = !p.isPublished;
        return { ...p, isPublished: newStatus };
      }
      return p;
    });
    notifyStorageChange();
    
    const project = cachedProjects.find(p => p.id === projectId);
    if (project) saveDocument('projects', project);
    return newStatus;
  },

  getSettings(): AdminSettings {
    return cachedSettings || {
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
      socialAppNames: { whatsapp: 'واتساب', facebook: 'فيسبوك', youtube: 'يوتيوب', tiktok: 'تيك توك' },
      paymentMethodLabels: { ar: 'طرق الدفع والاشتراك', en: 'Payment Methods' },
      primaryColor: '#2563eb',
      accentColor: '#8b5cf6',
      themeMode: 'user',
      globalPrices: { monthlyAr: '950 ج.م / $29', monthlyEn: '$29 / 950 EGP', annualAr: '8,500 ج.م / $249', annualEn: '$249 / 8,500 EGP', fullAr: '27,000 ج.م / $799', fullEn: '$799 / 27,000 EGP' },
      seoSettings: { title: 'ليرن ويب | Lern Web', description: 'منصة تعليمية', ogImage: '', twitterImage: '' }
    };
  },

  saveSettings(settings: AdminSettings): void {
    cachedSettings = settings;
    notifyStorageChange();
    // Save to Firestore with fixed ID 'global'
    saveDocument('settings', { ...settings, id: 'global' });
    
    safeFetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    }).catch(err => console.error(err));
  },

  getWallets(): WalletConfig[] {
    const defaultWallets: WalletConfig[] = [
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
    ];

    if (!cachedWallets || cachedWallets.length === 0) return defaultWallets;
    
    // Ensure orange-cash is present if it's a default but missing in Firestore
    if (!cachedWallets.find(w => w.id === 'orange-cash')) {
      cachedWallets.splice(1, 0, defaultWallets[1]);
    }
    return cachedWallets;
  },

  saveWallets(wallets: WalletConfig[]): void {
    cachedWallets = wallets;
    notifyStorageChange();
    wallets.forEach(w => saveDocument('wallets', w));
  },

  savePlans(plans: SubscriptionPlan[]): void {
    cachedPlans = plans;
    notifyStorageChange();
    plans.forEach(p => saveDocument('plans', p));
  },

  addPlan(plan: SubscriptionPlan): void {
    cachedPlans.push(plan);
    this.savePlans(cachedPlans);
  },

  updatePlan(updated: SubscriptionPlan): void {
    cachedPlans = cachedPlans.map(p => p.id === updated.id ? updated : p);
    this.savePlans(cachedPlans);
  },

  deletePlan(id: string): void {
    cachedPlans = cachedPlans.filter(p => p.id !== id);
    this.savePlans(cachedPlans);
    deleteDocument('plans', id);
  },

  getAiDrafts(): AiCustomizationDraft[] {
    return cachedDrafts;
  },

  saveAiDraft(draft: AiCustomizationDraft): void {
    cachedDrafts.unshift(draft);
    notifyStorageChange();
    saveDocument('drafts', draft);
  },

  updateAiDraftStatus(draftId: string, newStatus: any, notes?: string): void {
    cachedDrafts = cachedDrafts.map(d => d.id === draftId ? { ...d, status: newStatus, notes: notes !== undefined ? notes : d.notes } : d);
    notifyStorageChange();
    const target = cachedDrafts.find(d => d.id === draftId);
    if (target) {
      saveDocument('drafts', target);
    }
  },

  addMediaResource(item: MediaResourceItem): void {
    cachedMedia.unshift(item);
    notifyStorageChange();
    saveDocument('media_resources', item);
  },

  deleteMediaResource(id: string): void {
    cachedMedia = cachedMedia.filter(m => m.id !== id);
    notifyStorageChange();
    deleteDocument('media_resources', id);
  },

  saveUserOrder(order: UserOrder): void {
    cachedOrders.unshift(order);
    notifyStorageChange();
    saveDocument('user_orders', order);
  },

  addReview(review: ProjectReview): void {
    cachedReviews.unshift(review);
    notifyStorageChange();
    saveDocument('reviews', review);
  },

  deleteReview(reviewId: string): void {
    cachedReviews = cachedReviews.filter(r => r.id !== reviewId);
    notifyStorageChange();
    deleteDocument('reviews', reviewId);
  },

  addUser(user: UserAccount): void {
    if (!cachedUsers.find(u => u.id === user.id)) {
      cachedUsers.push(user);
      notifyStorageChange();
      saveDocument('users', user);
    }
  },

  registerUser(phone: string, name: string, password: string, email?: string): UserAccount {
    let user = {
      id: 'u-' + Math.random().toString(36).substr(2, 9),
      name,
      phone: phone.trim(),
      password,
      email: email || '',
      createdAt: new Date().toISOString()
    };
    this.addUser(user);
    this.saveUserSession(user);
    return user;
  },

  authenticateUser(phone: string, password: string): UserAccount | null {
    const user = cachedUsers.find(u => u.phone.trim() === phone.trim() && u.password === password);
    if (user) {
      this.saveUserSession(user);
      return user;
    }
    return null;
  },

  saveUserSession(user: UserAccount): void {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('lernweb_user_auth_session', JSON.stringify(user));
        localStorage.setItem('lernweb_user_auth_session', JSON.stringify(user));
      } catch (e) {
        console.warn('Storage write failed', e);
      }
    }
    notifyStorageChange();
  },

  loginUser(phone: string, name: string, email?: string): UserAccount {
    let user = cachedUsers.find(u => u.phone === phone);
    if (!user) {
      user = {
        id: 'u-' + Math.random().toString(36).substr(2, 9),
        name,
        phone,
        email: email || '',
        createdAt: new Date().toISOString()
      };
      this.addUser(user);
    } else {
      user.name = name;
      if (email) user.email = email;
      notifyStorageChange();
      saveDocument('users', user);
    }

    this.saveUserSession(user);
    return user;
  },

  getCurrentUser(): UserAccount | null {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('lernweb_user_auth_session') || localStorage.getItem('lernweb_user_auth_session');
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    }
    return null;
  },

  updateUserProfile(userId: string, updatedFields: any): UserAccount | null {
    const index = cachedUsers.findIndex(u => u.id === userId);
    if (index !== -1) {
      cachedUsers[index] = { ...cachedUsers[index], ...updatedFields };
      const updatedUser = cachedUsers[index];
      notifyStorageChange();
      
      // Save to Firestore
      saveDocument('users', updatedUser);

      safeFetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      }).catch(err => console.error(err));

      const current = this.getCurrentUser();
      if (current && current.id === userId && typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('lernweb_user_auth_session', JSON.stringify(updatedUser));
          localStorage.setItem('lernweb_user_auth_session', JSON.stringify(updatedUser));
        } catch (e) {
          console.warn('Storage write failed', e);
        }
      }
      return updatedUser;
    }
    return null;
  },

  logoutUser(): void {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('lernweb_user_auth_session');
        localStorage.removeItem('lernweb_user_auth_session');
      } catch (e) {
        console.warn('Storage remove failed', e);
      }
    }
    notifyStorageChange();
  },

  deleteUserAccount(userId: string): boolean {
    if (!userId) return false;
    cachedUsers = cachedUsers.filter(u => u.id !== userId);
    cachedDrafts = cachedDrafts.filter(d => d.visitorId !== userId);
    cachedOrders = cachedOrders.filter(o => o.userId !== userId);
    this.logoutUser();
    safeFetch('/api/users/' + userId, { method: 'DELETE' }).catch(err => console.error(err));
    return true;
  },

  isUserLoggedIn(): boolean {
    return !!this.getCurrentUser();
  },

  buildWhatsAppUrl(phone: string, message?: string): string {
    return buildWhatsAppUrl(phone, message);
  },

  formatWhatsAppOrderUrl(targetNumber: string, appName: string, appId: string, isRtl: boolean = true): string {
    const message = isRtl
      ? 'مرحباً، أود الاستفسار وطلب شراء المنصة التعليمية: *' + appName + '* (كود: ' + appId + ') من منصة ليرن ويب.'
      : 'Hello, I would like to order the educational platform: *' + appName + '* (ID: ' + appId + ') from Lern Web.';
    return buildWhatsAppUrl(targetNumber, message);
  },

  formatWhatsAppDraftUrl(targetNumber: string, draft: AiCustomizationDraft, isRtl: boolean = true): string {
    const message = isRtl
      ? 'طلب اعتماد ونشر مسودة ذكاء اصطناعي من منصة ليرن ويب:\n\n• اسم العميل: ' + (draft.visitorName || 'زائر') + '\n• هاتف العميل: ' + (draft.visitorPhone || 'غير محدد') + '\n• المنصة الأصلية: ' + draft.projectTitle + '\n• اسم المركز الجديد: ' + draft.modifiedConfig.centerName + '\n• كود المسودة: ' + draft.id + '\n• تفاصيل التخصيص: ' + draft.userPrompt + '\n\nيرجى مراجعة المسودة وتحديد التكلفة والاعتماد.'
      : 'AI Customization Draft Approval Request - Lern Web:\n\n• Client: ' + (draft.visitorName || 'Visitor') + '\n• Phone: ' + (draft.visitorPhone || 'Not provided') + '\n• Base Project: ' + draft.projectTitle + '\n• New Center Name: ' + draft.modifiedConfig.centerName + '\n• Draft ID: ' + draft.id + '\n• Prompt: ' + draft.userPrompt + '\n\nPlease review and quote this staged draft.';
    return buildWhatsAppUrl(targetNumber, message);
  },

  getRecentSearches(): string[] {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('lernweb_recent_searches_v1');
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    }
    return [];
  },

  addRecentSearch(query: string): string[] {
    const trimmed = query.trim();
    if (!trimmed) return this.getRecentSearches();
    const current = this.getRecentSearches();
    const filtered = current.filter(item => item.toLowerCase() !== trimmed.toLowerCase());
    const updated = [trimmed, ...filtered].slice(0, 5);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lernweb_recent_searches_v1', JSON.stringify(updated));
    }
    return updated;
  },

  removeRecentSearch(query: string): string[] {
    const current = this.getRecentSearches();
    const updated = current.filter(item => item.toLowerCase() !== query.trim().toLowerCase());
    if (typeof window !== 'undefined') {
      localStorage.setItem('lernweb_recent_searches_v1', JSON.stringify(updated));
    }
    return updated;
  },

  clearRecentSearches(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lernweb_recent_searches_v1');
    }
  },

  getActivityLogs(): ActivityLogItem[] {
    return cachedLogs;
  },

  addActivityLog(actionType: any, titleAr: string, titleEn: string, detailsAr?: string, detailsEn?: string): ActivityLogItem[] {
    const newLog: ActivityLogItem = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      actionType,
      titleAr,
      titleEn,
      detailsAr,
      detailsEn,
      timestamp: new Date().toISOString()
    };
    cachedLogs.unshift(newLog);
    notifyStorageChange();
    saveDocument('activity_logs', newLog);
    return cachedLogs;
  },

  clearActivityLogs(): void {
    cachedLogs = [];
    notifyStorageChange();
    // This would require a bulk delete, for now, we'll keep it as is
  },

  getChatMessages(): ChatMessage[] {
    return cachedChats;
  },

  saveChatMessage(msg: { senderName: string; senderPhone?: string; message: string; isAdminReply?: boolean }): ChatMessage[] {
    const newChat: ChatMessage = {
      id: 'chat-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      senderName: msg.senderName,
      senderPhone: msg.senderPhone || '',
      message: msg.message,
      timestamp: new Date().toISOString(),
      isAdminReply: msg.isAdminReply || false
    };
    cachedChats.unshift(newChat);
    notifyStorageChange();
    saveDocument('chat_messages', newChat);
    return cachedChats;
  },

  deleteChatMessage(chatId: string): ChatMessage[] {
    cachedChats = cachedChats.filter(c => c.id !== chatId);
    notifyStorageChange();
    deleteDocument('chat_messages', chatId);
    return cachedChats;
  },

  getSupportTickets(): SupportTicket[] {
    return cachedTickets;
  },

  getTicketByUserId(userId: string): SupportTicket | null {
    if (!userId) return null;
    return cachedTickets.find(t => t.userId === userId || t.id === `ticket-${userId}`) || null;
  },

  saveSupportTicket(ticket: SupportTicket): SupportTicket[] {
    const existingIndex = cachedTickets.findIndex(t => t.id === ticket.id);
    if (existingIndex !== -1) {
      cachedTickets[existingIndex] = ticket;
    } else {
      cachedTickets.unshift(ticket);
    }
    notifyStorageChange();
    saveDocument('support_tickets', ticket);
    return cachedTickets;
  },

  addMessageToTicket(
    userId: string,
    userName: string,
    phone: string,
    email: string,
    msg: { sender: 'user' | 'ai' | 'admin'; senderName?: string; text: string }
  ): SupportTicket {
    const ticketId = `ticket-${userId || 'guest'}`;
    let ticket = cachedTickets.find(t => t.id === ticketId);

    const newMsg: SupportTicketMessage = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      sender: msg.sender,
      senderName: msg.senderName || (msg.sender === 'admin' ? 'الإدارة (Admin)' : msg.sender === 'ai' ? 'المساعد الذكي (AI)' : userName),
      text: msg.text,
      timestamp: new Date().toISOString()
    };

    if (!ticket) {
      ticket = {
        id: ticketId,
        userId: userId || 'guest-' + Date.now(),
        userName: userName || 'زائر كريم',
        userPhone: phone || '',
        userEmail: email || '',
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        unreadByAdmin: msg.sender === 'user',
        unreadByUser: msg.sender === 'admin' || msg.sender === 'ai',
        messages: [newMsg]
      };
    } else {
      ticket = {
        ...ticket,
        userName: userName || ticket.userName,
        userPhone: phone || ticket.userPhone,
        userEmail: email || ticket.userEmail,
        updatedAt: new Date().toISOString(),
        unreadByAdmin: msg.sender === 'user' ? true : ticket.unreadByAdmin,
        unreadByUser: (msg.sender === 'admin' || msg.sender === 'ai') ? true : ticket.unreadByUser,
        messages: [...ticket.messages, newMsg]
      };
    }

    this.saveSupportTicket(ticket);
    return ticket;
  },

  updateTicketSystemOverride(ticketId: string, systemOverride: string): SupportTicket | null {
    const ticket = cachedTickets.find(t => t.id === ticketId);
    if (!ticket) return null;
    const updated = {
      ...ticket,
      systemOverride: systemOverride.trim(),
      updatedAt: new Date().toISOString()
    };
    this.saveSupportTicket(updated);
    return updated;
  },

  updateTicketStatus(ticketId: string, status: 'open' | 'in_progress' | 'closed'): SupportTicket | null {
    const ticket = cachedTickets.find(t => t.id === ticketId);
    if (!ticket) return null;
    const updated = {
      ...ticket,
      status,
      updatedAt: new Date().toISOString()
    };
    this.saveSupportTicket(updated);
    return updated;
  },

  deleteSupportTicket(ticketId: string): SupportTicket[] {
    cachedTickets = cachedTickets.filter(t => t.id !== ticketId);
    notifyStorageChange();
    deleteDocument('support_tickets', ticketId);
    return cachedTickets;
  },

  getPlans(): SubscriptionPlan[] {
    return cachedPlans;
  },

  getMediaResources(): MediaResourceItem[] {
    return cachedMedia;
  },

  getReviews(): ProjectReview[] {
    return cachedReviews;
  },

  getProjectReviews(projectId: string): ProjectReview[] {
    return cachedReviews.filter(r => r.projectId === projectId);
  },

  getUsers(): UserAccount[] {
    return cachedUsers;
  },

  getUserOrders(): UserOrder[] {
    return cachedOrders;
  },

  getNotifications(): UserNotification[] {
    return cachedNotifications;
  },

  getUserNotifications(userId: string): UserNotification[] {
    if (!userId) return [];
    return cachedNotifications.filter(n => n.userId === userId);
  },

  addNotification(userId: string, titleAr: string, titleEn: string, messageAr: string, messageEn: string, type: any = 'status_change'): void {
    const newNotif: UserNotification = {
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      userId,
      titleAr,
      titleEn,
      messageAr,
      messageEn,
      type,
      read: false,
      createdAt: new Date().toISOString()
    };
    cachedNotifications.unshift(newNotif);
    notifyStorageChange();
    saveDocument('notifications', newNotif);
  },

  markNotificationAsRead(notifId: string): void {
    const notif = cachedNotifications.find(n => n.id === notifId);
    if (notif) {
      notif.read = true;
      notifyStorageChange();
      saveDocument('notifications', notif);
    }
  },

  clearUserNotifications(userId: string): void {
    const toDelete = cachedNotifications.filter(n => n.userId === userId);
    cachedNotifications = cachedNotifications.filter(n => n.userId !== userId);
    notifyStorageChange();
    toDelete.forEach(n => deleteDocument('notifications', n.id));
  },

  /**
   * Provides a condensed summary of the platform's current state for AI context.
   */
  getPlatformSummary(): string {
    const publishedProjects = this.getProjects(false);
    const settings = this.getSettings();
    const plans = this.getPlans();
    const media = this.getMediaResources();

    return `
PLATFORM CONTEXT (Lern Web):
- Center Name: ${settings.centerName}
- Contact Email: ${settings.contactEmail}
- WhatsApp: ${settings.targetWhatsAppNumber}
- Published Projects: ${publishedProjects.map(p => `${p.titleAr} (${p.category})`).join(', ')}
- Available Plans: ${plans.map(p => `${p.nameAr}: ${p.priceAr}`).join(', ')}
- Educational Media: ${media.map(m => m.titleAr).join(', ')}
- Total Active Users: ${cachedUsers.length}
- Total Modifications Staged: ${cachedDrafts.length}
`;
  },

  getArticles(includeDrafts: boolean = false): CmsArticle[] {
    if (includeDrafts) return cachedArticles;
    return cachedArticles.filter(a => a.isPublished !== false);
  },

  saveArticle(article: CmsArticle): CmsArticle[] {
    const existingIndex = cachedArticles.findIndex(a => a.id === article.id);
    if (existingIndex !== -1) {
      cachedArticles[existingIndex] = { ...article };
    } else {
      cachedArticles.unshift(article);
    }
    notifyStorageChange();
    saveDocument('articles', article);
    safeFetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(article)
    }).catch(err => console.error(err));
    return cachedArticles;
  },

  deleteArticle(id: string): CmsArticle[] {
    cachedArticles = cachedArticles.filter(a => a.id !== id);
    notifyStorageChange();
    deleteDocument('articles', id);
    safeFetch('/api/articles/' + id, { method: 'DELETE' }).catch(err => console.error(err));
    return cachedArticles;
  },

  getFaqs(includeUnpublished: boolean = false): FaqItem[] {
    if (includeUnpublished) return cachedFaqs;
    return cachedFaqs.filter(f => f.isPublished !== false).sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  saveFaq(faq: FaqItem): FaqItem[] {
    const existingIndex = cachedFaqs.findIndex(f => f.id === faq.id);
    if (existingIndex !== -1) {
      cachedFaqs[existingIndex] = { ...faq };
    } else {
      cachedFaqs.push(faq);
    }
    notifyStorageChange();
    saveDocument('faqs', faq);
    safeFetch('/api/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(faq)
    }).catch(err => console.error(err));
    return cachedFaqs;
  },

  deleteFaq(id: string): FaqItem[] {
    cachedFaqs = cachedFaqs.filter(f => f.id !== id);
    notifyStorageChange();
    deleteDocument('faqs', id);
    safeFetch('/api/faqs/' + id, { method: 'DELETE' }).catch(err => console.error(err));
    return cachedFaqs;
  },

  getAnnouncements(): AnnouncementBanner[] {
    return cachedAnnouncements;
  },

  saveAnnouncement(ann: AnnouncementBanner): AnnouncementBanner[] {
    const existingIndex = cachedAnnouncements.findIndex(a => a.id === ann.id);
    if (existingIndex !== -1) {
      cachedAnnouncements[existingIndex] = { ...ann };
    } else {
      cachedAnnouncements.unshift(ann);
    }
    notifyStorageChange();
    saveDocument('announcements', ann);
    safeFetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ann)
    }).catch(err => console.error(err));
    return cachedAnnouncements;
  },

  deleteAnnouncement(id: string): AnnouncementBanner[] {
    cachedAnnouncements = cachedAnnouncements.filter(a => a.id !== id);
    notifyStorageChange();
    deleteDocument('announcements', id);
    return cachedAnnouncements;
  },

  exportFullPlatformBackup(): any {
    return {
      version: '3.8',
      exportedAt: new Date().toISOString(),
      platform: 'ليرن ويب | Lern Web Cloud Systems',
      data: {
        projects: cachedProjects,
        adminSettings: this.getSettings(),
        wallets: cachedWallets,
        plans: cachedPlans,
        aiDrafts: cachedDrafts,
        users: cachedUsers,
        mediaResources: cachedMedia,
        userOrders: cachedOrders,
        reviews: cachedReviews,
        activityLogs: cachedLogs,
        articles: cachedArticles,
        faqs: cachedFaqs,
        announcements: cachedAnnouncements
      }
    };
  },

  importFullPlatformBackup(backupJson: any): any {
    if (backupJson?.data) {
      if (Array.isArray(backupJson.data.articles)) cachedArticles = backupJson.data.articles;
      if (Array.isArray(backupJson.data.faqs)) cachedFaqs = backupJson.data.faqs;
      if (Array.isArray(backupJson.data.announcements)) cachedAnnouncements = backupJson.data.announcements;
      notifyStorageChange();
    }
    return {
      success: true,
      messageAr: 'تمت استعادة البيانات ونظام المحتوى بنجاح!',
      messageEn: 'Data and CMS content successfully restored!'
    };
  }
};

export const getProjects = (includeUnpublished: boolean = false) => storageService.getProjects(includeUnpublished);
export const getArticles = (includeDrafts?: boolean) => storageService.getArticles(includeDrafts);
export const getFaqs = (includeUnpublished?: boolean) => storageService.getFaqs(includeUnpublished);
export const getAnnouncements = () => storageService.getAnnouncements();

export const getSettings = () => storageService.getSettings();
export const getWallets = () => storageService.getWallets();
export const getMediaResources = () => storageService.getMediaResources();
export const getPlans = () => storageService.getPlans();
export const getAiDrafts = () => storageService.getAiDrafts();
export const getNotifications = () => storageService.getNotifications();
export const getCurrentUser = () => storageService.getCurrentUser();
export const isUserLoggedIn = () => storageService.isUserLoggedIn();
export const isAdminLoggedIn = () => storageService.isAdminLoggedIn();


export function buildWhatsAppUrl(phone: string, message?: string): string {
  if (!phone || typeof phone !== 'string') return 'https://wa.me/';
  const cleanNumber = phone.replace(/[^\d]/g, '');
  if (!message || !message.trim()) {
    return 'https://wa.me/' + cleanNumber;
  }
  return 'https://wa.me/' + cleanNumber + '?text=' + encodeURIComponent(message.trim());
}

/**
 * Normalizes YouTube video links, shorts, embed codes (<iframe ...>), or local videos
 * into a valid playable embed URL or direct src string.
 */
export function formatVideoEmbedUrl(urlOrEmbed: string): string {
  if (!urlOrEmbed || typeof urlOrEmbed !== 'string') return '';
  const trimmed = urlOrEmbed.trim();

  // Handle iframe embed code snippet: <iframe ... src="https://www.youtube.com/embed/xyz" ...></iframe>
  if (trimmed.includes('<iframe') && trimmed.includes('src=')) {
    const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      return formatVideoEmbedUrl(srcMatch[1]);
    }
  }

  // Handle standard YouTube watch link: https://www.youtube.com/watch?v=VIDEO_ID
  if (trimmed.includes('youtube.com/watch') || trimmed.includes('m.youtube.com/watch')) {
    try {
      const urlObj = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
      const videoId = urlObj.searchParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
      }
    } catch {
      const match = trimmed.match(/[?&]v=([^&]+)/);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0`;
      }
    }
  }

  // Handle short YouTube URL: https://youtu.be/VIDEO_ID
  if (trimmed.includes('youtu.be/')) {
    const match = trimmed.match(/youtu\.be\/([^?&#]+)/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0`;
    }
  }

  // Handle YouTube Shorts URL: https://www.youtube.com/shorts/VIDEO_ID
  if (trimmed.includes('youtube.com/shorts/')) {
    const match = trimmed.match(/youtube\.com\/shorts\/([^?&#]+)/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0`;
    }
  }

  // Already an embed URL: https://www.youtube.com/embed/VIDEO_ID
  if (trimmed.includes('youtube.com/embed/')) {
    return trimmed;
  }

  // Otherwise return as direct video link or file blob/base64
  return trimmed;
}

export function isYouTubeUrlOrEmbed(urlOrEmbed: string): boolean {
  if (!urlOrEmbed || typeof urlOrEmbed !== 'string') return false;
  const lower = urlOrEmbed.toLowerCase();
  return lower.includes('youtube.com') || lower.includes('youtu.be') || lower.includes('<iframe');
}
