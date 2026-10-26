/**
 * Project Identity: ليرن ويب | Lern Web
 * Architecture Framework: Next.js (App Router Layout Structure) + React Vite Runtime
 * Purpose: Full interactive dashboard, PWA engine, AppStore marketplace, SandboxPreview simulator,
 *          Conversational AI customizer, bilingual RTL/LTR engine, dynamic theme, and VS Code file exporter.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Layers, Play, Video, ShieldCheck, Sun, Moon, 
  Globe, Download, Smartphone, Code2, ArrowUpRight,
  CheckCircle2, Menu, X, Share2, Terminal, Copy, Check, Lock, User, Sparkles, Printer, BarChart3, Rocket, Clock, Bot, LogOut, LayoutDashboard, FileText, HelpCircle
} from 'lucide-react';

import AppStore from '../components/AppStore';
import SandboxPreview from '../components/SandboxPreview';
import FaqSection from '../components/FaqSection';
import PwaDiagnostics from '../components/PwaDiagnostics';
import UserProfileSection from '../components/UserProfileSection';
import ProductTour from '../components/ProductTour';
import AboutUsSection from '../components/AboutUsSection';
import AdminDashboard from '../components/AdminDashboard';
import SecretLoginModal from '../components/SecretLoginModal';
import NotificationCenterRaw from '../components/NotificationCenter';
const NotificationCenter = NotificationCenterRaw as any;
import AiSupportChat from './components/AiSupportChat';
import ClientSpendingChart from './components/ClientSpendingChart';
import { toast } from 'sonner';
import { translations } from './data/translations';
import { APPS_DATA, WALLET_OPTIONS, MEDIA_RESOURCES, AppItem } from './data/storeData';
import { 
  storageService, buildWhatsAppUrl, ProjectItem, AdminSettings, WalletConfig, MediaResourceItem, AiCustomizationDraft, UserOrder,
  getProjects, getSettings, getWallets, getMediaResources, getPlans, getNotifications, UserNotification
} from './services/storageService';
import { subscribeToAuthChanges, signOutUser } from './services/firebaseService';

const VSCODE_CODE_CATALOG: Record<string, { lang: string; title: string; code: string }> = {
  'app/page.jsx': {
    lang: 'javascript',
    title: 'app/page.jsx (Root layout routing and state coordinator)',
    code: `/**
 * Next.js Project Structure Identifier:
 * app/page.jsx
 * 
 * Project Identity: ليرن ويب | Lern Web
 * Architecture Framework: Next.js (App Router Layout Structure)
 * Purpose: Root layout routing and state coordinator, bilingual engine, dynamic shade swapping,
 *          PWA installation tracker, and marketplace/sandbox conductor.
 */

'use client';

import React, { useState } from 'react';
import AppStore from '@/components/AppStore';
import SandboxPreview from '@/components/SandboxPreview';

export default function Page() {
  const [theme, setTheme] = useState('dark');
  return (
    <div className={theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}>
      <AppStore />
    </div>
  );
}`
  },
  'app/layout.jsx': {
    lang: 'javascript',
    title: 'app/layout.jsx (Bilingual context wrappers, metadata providers, and global font injections)',
    code: `export const metadata = {
  title: 'ليرن ويب | Lern Web - المنظومة التعليمية السحابية المتكاملة',
  description: 'سوق أدوات ومحاكي مراكز تعليمية متطورة مع محرك PWA وترخيص مرن وتملك كامل للكود المصدري.',
  manifest: '/manifest.json',
  icons: { icon: '/icon.svg', apple: '/icon-192.png' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}`
  }
};

export default function App() {
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') toast.success(message);
    else toast.error(message);
  }, []);

  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const t = translations[lang] || translations.ar;
  const isRtl = lang === 'ar';

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<'store' | 'sandbox' | 'media' | 'billing' | 'vscode' | 'client-dashboard' | 'about'>('store');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sandboxConfig, setSandboxConfig] = useState<any>(null);

  // Admin Master State
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSecretLoginOpen, setIsSecretLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [logoClickTimes, setLogoClickTimes] = useState<number[]>([]);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  // Client Authentication State
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isClientLoginOpen, setIsClientLoginOpen] = useState(false);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    if (activeTab === 'client-dashboard' && isUserLoggedIn && !localStorage.getItem('hasSeenTour')) {
      setShowTour(true);
    }
  }, [activeTab, isUserLoggedIn]);

  const [userDrafts, setUserDrafts] = useState<AiCustomizationDraft[]>(() => storageService.getAiDrafts());
  const prevDraftStatuses = useRef<Record<string, string>>({});

  useEffect(() => {
    if (isUserLoggedIn && userDrafts.length > 0) {
      userDrafts.forEach((draft) => {
        const prevStatus = prevDraftStatuses.current[draft.id];
        if (prevStatus && prevStatus !== draft.status) {
          const statusMapAr: Record<string, string> = {
            'pending_review': 'قيد المراجعة الفنية',
            'in_progress': 'قيد التنفيذ والبرمجة',
            'completed': 'تم التنفيذ / جاهز',
            'approved_published': 'تم الاعتماد والنشر بالمتجر',
            'rejected': 'تم الرفض / يحتاج مراجعة'
          };
          const statusMapEn: Record<string, string> = {
            'pending_review': 'Pending Review',
            'in_progress': 'In Progress',
            'completed': 'Completed / Ready',
            'approved_published': 'Approved & Published',
            'rejected': 'Rejected / Needs Review'
          };
          const statusLabel = isRtl ? statusMapAr[draft.status] : statusMapEn[draft.status];
          let details = isRtl 
            ? `🔔 تحديث حالة: طلبك "${draft.modifiedConfig.centerName}" أصبح الآن [${statusLabel}]`
            : `🔔 Status Update: Your request "${draft.modifiedConfig.centerName}" is now [${statusLabel}]`;
          if (draft.notes) {
            details += isRtl ? `\n\nملاحظة الإدارة: ${draft.notes}` : `\n\nAdmin Note: ${draft.notes}`;
          }
          showToast(details, 'success');
        }
        prevDraftStatuses.current[draft.id] = draft.status;
      });
    } else if (!isUserLoggedIn) {
      prevDraftStatuses.current = {};
    }
  }, [userDrafts, isUserLoggedIn, isRtl, showToast]);

  const [projects, setProjects] = useState<ProjectItem[]>(() => getProjects(false));
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => getSettings());
  const [wallets, setWallets] = useState<WalletConfig[]>(() => getWallets());
  const [mediaItems, setMediaItems] = useState<MediaResourceItem[]>(() => {
    const stored = getMediaResources();
    return stored.length > 0 ? stored : (MEDIA_RESOURCES as any[]);
  });
  const [plans, setPlans] = useState<any[]>(() => getPlans());
  const [notifications, setNotifications] = useState<UserNotification[]>(() => getNotifications());
  const [userOrders, setUserOrders] = useState<UserOrder[]>(() => storageService.getUserOrders());

  const refreshStorageData = () => {
    const isAdminActive = storageService.isAdminLoggedIn();
    setIsAdmin(isAdminActive);
    setIsUserLoggedIn(storageService.isUserLoggedIn());
    setCurrentUser(storageService.getCurrentUser());
    setProjects(storageService.getProjects(isAdminActive));
    setAdminSettings(storageService.getSettings());
    setWallets(storageService.getWallets());
    const storedMedia = storageService.getMediaResources();
    setMediaItems(storedMedia.length > 0 ? storedMedia : (MEDIA_RESOURCES as any[]));
    setPlans(storageService.getPlans());
    setUserDrafts(storageService.getAiDrafts());
    setNotifications(storageService.getNotifications());
    setUserOrders(storageService.getUserOrders());
  };

  useEffect(() => {
    refreshStorageData();
    storageService.syncNow();

    const unsubscribeStorage = storageService.subscribe(() => {
      refreshStorageData();
    });

    const unsubscribeAuth = subscribeToAuthChanges((user) => {
      if (user) {
        setIsUserLoggedIn(true);
        setCurrentUser({
          id: user.uid,
          name: user.displayName || user.email?.split('@')[0] || 'User',
          phone: '',
          email: user.email,
          createdAt: user.metadata.creationTime
        });
      } else {
        const localUser = storageService.getCurrentUser();
        setIsUserLoggedIn(!!localUser);
        setCurrentUser(localUser);
      }
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsSecretLoginOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const handleContextMenu = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('input, textarea, pre, code')) {
        e.preventDefault();
      }
    };
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
      unsubscribeAuth();
      unsubscribeStorage();
    };
  }, []);

  const handleLogoSecretClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const now = Date.now();
    const recent = [...logoClickTimes.filter((tVal) => now - tVal < 2500), now];
    setLogoClickTimes(recent);
    if (recent.length >= 3) {
      setIsSecretLoginOpen(true);
      setLogoClickTimes([]);
      showToast(isRtl ? '🔐 تم تفعيل بوابة المشرف العام السرية' : '🔐 Secret Admin Gate Unlocked', 'success');
    }
  };

  const handleClientLogout = async () => {
    try {
      await signOutUser();
    } catch (e) {
      console.warn('Firebase signout skipped', e);
    }
    storageService.logoutUser();
    setIsUserLoggedIn(false);
    setCurrentUser(null);
    setActiveTab('store');
    showToast(isRtl ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully', 'success');
  };

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [activeVsCodeFile, setActiveVsCodeFile] = useState('app/page.jsx');
  const [hasCopiedFile, setHasCopiedFile] = useState(false);

  const effectiveTheme = adminSettings?.themeMode === 'dark' 
    ? 'dark' 
    : adminSettings?.themeMode === 'light' 
      ? 'light' 
      : theme;

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';

    if (effectiveTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [lang, isRtl, effectiveTheme]);

  useEffect(() => {
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      alert(isRtl 
        ? 'يمكنك تثبيت التطبيق مباشرة من قائمة إعدادات المتصفح (Install App أو Add to Home Screen).' 
        : 'You can install the app directly via your browser menu (Install App / Add to Home Screen).');
    }
  };

  const handleLaunchAppInSandbox = (itemOrConfig: any) => {
    if (!itemOrConfig) return;

    if (itemOrConfig.category && itemOrConfig.centerName) {
      setSandboxConfig(itemOrConfig);
    } else if (itemOrConfig.defaultSandboxConfig) {
      setSandboxConfig({
        category: itemOrConfig.category || 'lms',
        centerName: isRtl ? itemOrConfig.titleAr : itemOrConfig.titleEn,
        theme: itemOrConfig.defaultSandboxConfig.theme,
        activeCourse: isRtl ? itemOrConfig.defaultSandboxConfig.activeCourse : itemOrConfig.titleEn,
        bannerText: isRtl ? itemOrConfig.defaultSandboxConfig.bannerText : 'Active runtime deployment configured',
        activeTab: 'courses',
        studentCount: 850,
        tutorName: 'فريق ليرن ويب التقني',
        hasQuiz: itemOrConfig.defaultSandboxConfig.hasQuiz
      });
    } else {
      setSandboxConfig(itemOrConfig);
    }

    setActiveTab('sandbox');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyCode = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setHasCopiedFile(true);
    setTimeout(() => setHasCopiedFile(false), 2500);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      effectiveTheme === 'dark' 
        ? 'bg-slate-950 text-slate-100' 
        : 'bg-slate-50 text-slate-900'
    }`}>
      
      {isAdmin && (
        <div className="no-print bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 border-b border-blue-400/40 px-4 py-2.5 text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs md:text-sm shadow-xl z-50 sticky top-0">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-emerald-400 ring-4 ring-emerald-500/30 animate-pulse" />
            <span className="font-bold">👑 {isRtl ? 'وضع تحكم المشرف العام نشط (Master Mode)' : 'Master Admin Mode Active'}:</span>
            <span className="text-slate-200 hidden md:inline">{isRtl ? 'إدارة المشاريع، استعراض مسودات الذكاء الاصطناعي وتنزيل الملفات المنسوخة' : 'Full master access active'}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdminDashboardOpen(true)}
              className="rounded-xl bg-blue-500 hover:bg-blue-400 px-3.5 py-1.5 font-bold text-white shadow transition"
            >
              {isRtl ? 'فتح لوحة تحكم الإدارة' : 'Open Admin Panel'}
            </button>
            <button
              onClick={() => {
                storageService.logoutAdmin();
                refreshStorageData();
                showToast(isRtl ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully', 'success');
              }}
              className="rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 px-3 py-1.5 text-white transition"
            >
              {isRtl ? 'خروج من الإدارة' : 'Logout Admin'}
            </button>
          </div>
        </div>
      )}

      {!isInstalled && (
        <aside aria-label="PWA install banner" className="no-print relative z-40 border-b border-blue-500/20 bg-gradient-to-r from-blue-950 via-indigo-950 to-blue-900 px-4 py-2.5 text-white shadow-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs md:text-sm">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <Smartphone className="w-4 h-4 text-blue-300" />
              <span className="font-semibold">{t.pwaInstallTitle}:</span>
              <span className="text-slate-300 hidden md:inline">{t.pwaInstallDesc}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 rounded-xl bg-blue-500 hover:bg-blue-400 px-3.5 py-1.5 font-bold text-white shadow transition active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.installNow}</span>
              </button>

              {isIOS && (
                <button
                  onClick={() => setShowIOSModal(true)}
                  className="rounded-xl border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs text-white hover:bg-white/20"
                >
                  iPhone Guide
                </button>
              )}
            </div>
          </div>
        </aside>
      )}

      <header className={`no-print sticky ${isAdmin ? 'top-10' : 'top-0'} z-30 border-b backdrop-blur-xl transition-colors ${
        theme === 'dark' 
          ? 'border-slate-800/80 bg-slate-950/85' 
          : 'border-slate-200/80 bg-white/85'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 group">
              <button 
                type="button"
                onClick={handleLogoSecretClick}
                title={isRtl ? 'أيقونة المنصة (اضغط 3 مرات متتالية لدخول بوابة الأدمن السرية)' : 'Platform Icon (Click 3 consecutive times for Secret Admin Gate)'}
                className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 active:scale-95 transition-transform overflow-hidden cursor-pointer select-none border-0 text-left shrink-0"
              >
                <img 
                  src="/assets/aistudio/image_69117c9b__1__7fdc7aea.jpg" 
                  alt="Lern Web Logo" 
                  className="w-full h-full object-cover rounded-[14px] pointer-events-none"
                />
              </button>

              <div 
                onClick={() => setActiveTab('store')}
                className="space-y-0.5 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg md:text-xl tracking-tight text-white group-hover:text-blue-400 transition-colors">
                    ليرن ويب
                  </span>
                  <span className="text-xs font-bold text-blue-400 font-mono">
                    LERN WEB
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  {isRtl ? 'محرر ومحاكي الذكاء الاصطناعي البرمجي' : 'AI Code Editor & Sandbox Suite'}
                </p>
              </div>
            </div>

            <div className="hidden xl:flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span>{isRtl ? 'محرر ومحاكي AI متطور' : 'AI Editor Engine'}</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1.5 rounded-2xl border border-slate-800 bg-slate-900/60 p-1.5">
            {[
              { id: 'store', label: t.navStore, icon: Layers },
              { id: 'sandbox', label: t.navSandbox, icon: Play },
              { id: 'about', label: isRtl ? 'من نحن' : 'About Us', icon: Sparkles },
              { id: 'media', label: t.navMediaDocs, icon: Video },
              { id: 'billing', label: t.navBilling, icon: ShieldCheck },
              { id: 'vscode', label: t.navCodeViewer, icon: Code2 },
              ...(isUserLoggedIn ? [{ id: 'client-dashboard', label: isRtl ? 'لوحة العميل' : 'My Dashboard', icon: User }] : [])
            ].map((nav) => {
              const Icon = nav.icon;
              const isActive = activeTab === nav.id;
              return (
                <button
                  key={nav.id}
                  onClick={() => setActiveTab(nav.id as any)}
                  style={isActive ? { backgroundColor: adminSettings.primaryColor || '#2563eb' } : {}}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs md:text-sm font-semibold transition-all ${
                    isActive 
                      ? 'text-white shadow-md' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{nav.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            {adminSettings.targetWhatsAppNumber && (
              <a
                href={buildWhatsAppUrl(adminSettings.targetWhatsAppNumber, isRtl ? 'مرحباً، أود الاستفسار عن منصات ليرن ويب التعليمية' : 'Hello, I have an inquiry about Lern Web platforms')}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition shadow-sm"
              >
                <span>💬 {isRtl ? 'واتساب' : 'WhatsApp'}</span>
              </a>
            )}

            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-bold text-slate-200 hover:border-slate-700 transition"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            <button
              onClick={() => setTheme(effectiveTheme === 'dark' ? 'light' : 'dark')}
              className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-300 hover:text-white hover:border-slate-700 transition"
            >
              {effectiveTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {isUserLoggedIn ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('client-dashboard')}
                  className="flex items-center gap-2 rounded-xl border border-blue-500/50 bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-2 text-xs md:text-sm font-bold text-white hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/30 transition active:scale-95 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="max-w-[110px] truncate">{currentUser?.name || (isRtl ? 'لوحة العميل' : 'My Account')}</span>
                </button>
                <button
                  type="button"
                  onClick={handleClientLogout}
                  title={isRtl ? 'تسجيل الخروج من الحساب' : 'Logout of Account'}
                  className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-2 text-rose-300 hover:bg-rose-500/20 hover:border-rose-500/50 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsClientLoginOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-blue-500/50 bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-2 text-xs md:text-sm font-bold text-white hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/30 transition active:scale-95 cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>{isRtl ? 'تسجيل دخول العميل' : 'Client Login'}</span>
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-3 animate-fadeIn">
            {isUserLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setActiveTab('client-dashboard');
                  }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span className="truncate">{currentUser?.name || (isRtl ? 'لوحة العميل' : 'Client Portal')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleClientLogout();
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-bold text-rose-300 hover:bg-rose-500/20 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{isRtl ? 'خروج' : 'Logout'}</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsClientLoginOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl py-3 text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>{isRtl ? 'تسجيل دخول العميل' : 'Client Sign In'}</span>
              </button>
            )}

            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              {[
                { id: 'store', label: t.navStore, icon: Layers },
                { id: 'sandbox', label: t.navSandbox, icon: Play },
                { id: 'about', label: isRtl ? 'من نحن' : 'About Us', icon: Sparkles },
                { id: 'media', label: t.navMediaDocs, icon: Video },
                { id: 'billing', label: t.navBilling, icon: ShieldCheck },
                { id: 'vscode', label: t.navCodeViewer, icon: Code2 },
                ...(isUserLoggedIn ? [{ id: 'client-dashboard', label: isRtl ? 'لوحة العميل' : 'My Dashboard', icon: User }] : [])
              ].map((nav) => {
                const Icon = nav.icon;
                return (
                  <button
                    key={nav.id}
                    onClick={() => {
                      setActiveTab(nav.id as any);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      activeTab === nav.id 
                        ? 'bg-blue-600 text-white' 
                        : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{nav.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        
        {activeTab === 'store' && (
          <AppStore
            apps={projects as any}
            lang={lang}
            t={t}
            onLaunchSandbox={handleLaunchAppInSandbox}
            onSelectAppForDeploy={handleLaunchAppInSandbox}
            isAdmin={isAdmin}
            isUserLoggedIn={isUserLoggedIn}
            adminSettings={adminSettings}
            onOpenLogin={() => setIsClientLoginOpen(true)}
            onOpenAdminPortal={() => setIsAdminDashboardOpen(true)}
            showToast={showToast}
          />
        )}

        {activeTab === 'about' && (
          <AboutUsSection lang={lang} onClose={() => setActiveTab('store')} />
        )}

        {activeTab === 'sandbox' && (
          <SandboxPreview
            lang={lang}
            t={t}
            initialConfig={sandboxConfig}
            wallets={wallets.filter((w) => w.isActive)}
            mediaResources={mediaItems}
            onOpenBillingModal={() => setActiveTab('billing')}
            targetWhatsAppNumber={adminSettings.targetWhatsAppNumber}
            isAdmin={isAdmin}
            isUserLoggedIn={isUserLoggedIn}
            onOpenLogin={() => setIsClientLoginOpen(true)}
            adminSettings={adminSettings}
            plans={plans}
          />
        )}

        {activeTab === 'media' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-xl space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white">{t.mediaTitle}</h2>
              <p className="text-slate-300 text-sm md:text-base max-w-3xl leading-relaxed">{t.mediaSubtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mediaItems.filter(m => isAdmin || m.isPublished !== false).map((res) => (
                <div key={res.id} className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-lg flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-400">
                        {isRtl ? res.categoryAr : res.categoryEn}
                      </span>
                      <span className="font-mono text-slate-400">
                        {isRtl ? res.durationOrReadTimeAr : res.durationOrReadTimeEn}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white">{isRtl ? res.titleAr : res.titleEn}</h3>
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{isRtl ? res.summaryAr : res.summaryEn}</p>
                  </div>

                  {res.type === 'video' ? (
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                      <iframe 
                        src={res.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'} 
                        title={res.titleAr} 
                        className="w-full h-full border-0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen 
                      />
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {isRtl ? res.contentAr : res.contentEn}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="animate-fadeIn">
            <SandboxPreview
              lang={lang}
              t={t}
              initialConfig={sandboxConfig}
              wallets={wallets.filter((w) => w.isActive)}
              mediaResources={mediaItems}
              onOpenBillingModal={() => {}}
              targetWhatsAppNumber={adminSettings.targetWhatsAppNumber}
              isAdmin={isAdmin}
              isUserLoggedIn={isUserLoggedIn}
              onOpenLogin={() => setIsClientLoginOpen(true)}
              adminSettings={adminSettings}
              plans={plans}
            />
          </div>
        )}

        {activeTab === 'vscode' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-md bg-emerald-500/20 px-3 py-1 text-xs font-mono font-bold text-emerald-400">
                <Terminal className="w-4 h-4" />
                <span>VS Code Environment & Vercel Edge Pipeline</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">{t.vsCodeExplorerTitle}</h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-3xl">{t.vsCodeExplorerSubtitle}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-2">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Next.js App Router Structure:</h4>
                {Object.keys(VSCODE_CODE_CATALOG).map((fileName) => (
                  <button
                    key={fileName}
                    onClick={() => setActiveVsCodeFile(fileName)}
                    className={`w-full text-left font-mono text-xs px-3 py-2.5 rounded-xl transition flex items-center justify-between ${
                      activeVsCodeFile === fileName ? 'bg-blue-600 text-white font-bold shadow' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{fileName}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                ))}
              </div>

              <div className="lg:col-span-3 rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="space-y-0.5">
                    <span className="text-xs font-mono text-blue-400">{VSCODE_CODE_CATALOG[activeVsCodeFile]?.title}</span>
                    <h4 className="text-base font-mono font-bold text-white">{activeVsCodeFile}</h4>
                  </div>

                  <button
                    onClick={() => handleCopyCode(VSCODE_CODE_CATALOG[activeVsCodeFile]?.code || '')}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition shadow"
                  >
                    {hasCopiedFile ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{hasCopiedFile ? t.fileCopied : t.copyFileCode}</span>
                  </button>
                </div>

                <div className="rounded-xl bg-slate-900 p-4 border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto max-h-[500px]" dir="ltr">
                  <pre className="text-left font-mono whitespace-pre">{VSCODE_CODE_CATALOG[activeVsCodeFile]?.code}</pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'client-dashboard' && (
          <div className="space-y-8 animate-fadeIn min-h-[500px]">
            {isUserLoggedIn ? (
              <div className="space-y-8">
                <div className="rounded-3xl border border-blue-500/40 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 p-6 md:p-10 shadow-2xl space-y-4">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase">
                        <User className="w-4 h-4" />
                        <span>{isRtl ? 'لوحة العميل الخاصة' : 'Client Account Portal'}</span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black text-white">
                        {isRtl ? `مرحباً بك، ${currentUser?.name || 'عميلنا العزيز'}` : `Welcome back, ${currentUser?.name || 'Valued Client'}`}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => window.print()}
                        className="no-print flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/10 transition"
                      >
                        <Printer className="w-4 h-4" />
                        <span>{isRtl ? 'طباعة تقرير الحالة' : 'Print Status Report'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleClientLogout}
                        className="no-print flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-xs font-bold text-rose-300 hover:bg-rose-500/20 hover:border-rose-500/60 transition cursor-pointer"
                        title={isRtl ? 'تسجيل الخروج من الحساب' : 'Logout of Account'}
                      >
                        <LogOut className="w-4 h-4 text-rose-400" />
                        <span>{isRtl ? 'تسجيل الخروج' : 'Log Out'}</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm md:text-base text-slate-300 max-w-2xl leading-relaxed">
                    {isRtl 
                      ? 'من خلال هذه اللوحة يمكنك متابعة حالة طلبات التعديل المرسلة للأدمن، إدارة بياناتك، والوصول السريع للدعم الفني.'
                      : 'Track your AI customization requests, manage your contact details, and access priority technical support.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <NotificationCenter 
                      notifications={notifications.filter(n => n.userId === currentUser?.id)} 
                      lang={lang} 
                      onRefresh={refreshStorageData} 
                    />

                    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 shadow-xl space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-indigo-400" />
                          {isRtl ? 'تحليل المصروفات التعليمية' : 'Educational Spending Analytics'}
                        </h3>
                        <div className="text-[10px] font-bold px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {isRtl ? 'بيانات لحظية' : 'Live Data'}
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {isRtl 
                          ? 'يوضح المخطط البياني التالي توزيع مصروفاتك على الأدوات البرمجية التعليمية مقابل اشتراكات الدعم والتحديثات.'
                          : 'The following chart shows your spending distribution across educational software tools vs. support subscriptions.'}
                      </p>
                      <ClientSpendingChart 
                        orders={userOrders.filter(o => o.userId === currentUser?.id)} 
                        lang={lang} 
                      />
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 shadow-xl space-y-6">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Rocket className="w-5 h-5 text-blue-400" />
                        {isRtl ? 'سجل طلبات التعديل (AI Drafts)' : 'AI Customization History'}
                      </h3>

                      {userDrafts.length === 0 ? (
                        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-12 text-center text-slate-500 space-y-4">
                          <Sparkles className="w-12 h-12 text-slate-700 mx-auto opacity-50" />
                          <div className="space-y-1">
                            <p className="font-bold">{isRtl ? 'لا توجد طلبات مسجلة' : 'No requests yet'}</p>
                            <p className="text-xs">{isRtl ? 'استخدم المحاكي لتخصيص منصتك وإرسالها للمراجعة.' : 'Use the Sandbox to customize and submit your first request.'}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {userDrafts.map((draft) => (
                            <div key={draft.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 transition-all hover:border-slate-700">
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    draft.status === 'completed' || draft.status === 'approved_published' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                    draft.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  }`}>
                                    {draft.status === 'completed' || draft.status === 'approved_published' ? (isRtl ? 'تم التنفيذ' : 'Completed') :
                                     draft.status === 'in_progress' ? (isRtl ? 'قيد التنفيذ' : 'In Progress') : (isRtl ? 'قيد المراجعة' : 'Pending')}
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-500">{draft.forkedAt}</span>
                                </div>
                                <button
                                  onClick={() => {
                                    setSandboxConfig({
                                      centerName: draft.modifiedConfig.centerName,
                                      theme: draft.modifiedConfig.theme,
                                      activeCourse: draft.modifiedConfig.activeCourse,
                                      hasQuiz: draft.modifiedConfig.hasQuiz,
                                      bannerText: draft.modifiedConfig.bannerText,
                                      tutorName: currentUser?.name || 'العميل'
                                    });
                                    setActiveTab('sandbox');
                                  }}
                                  className="text-[10px] font-bold text-blue-400 hover:underline"
                                >
                                  {isRtl ? 'فتح في المحاكي ↗' : 'Open in Sandbox ↗'}
                                </button>
                              </div>

                              <div>
                                <h4 className="font-bold text-slate-200">{draft.modifiedConfig.centerName}</h4>
                                <p className="text-xs text-slate-400 mt-1 line-clamp-2 italic">"{draft.userPrompt}"</p>
                              </div>

                              {draft.notes && (
                                <div className="bg-blue-500/5 border border-blue-500/20 p-3 rounded-xl">
                                  <p className="text-[11px] text-blue-300">
                                    <strong className="block mb-1 opacity-70">{isRtl ? 'ملاحظة الإدارة:' : 'Admin Note:'}</strong>
                                    {draft.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <UserProfileSection
                      currentUser={currentUser}
                      userDraftsCount={userDrafts.length}
                      lang={lang}
                      onUserUpdated={(updated) => setCurrentUser(updated)}
                      onLogout={handleClientLogout}
                    />
                    
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
                       <PwaDiagnostics lang={lang} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 text-center space-y-4">
                <User className="w-12 h-12 text-blue-400 mx-auto opacity-80" />
                <h3 className="text-xl font-bold text-white">
                  {isRtl ? 'تسجيل الدخول إلى حساب العميل' : 'Client Account Access'}
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  {isRtl 
                    ? 'سجل دخولك لمتابعة حالة طلبات التعديل والملاحظات المرسلة إلى إدارة المنظومة.' 
                    : 'Sign in to access your personal modification requests and admin feedback.'}
                </p>
                <button
                  onClick={() => setIsClientLoginOpen(true)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/30 transition active:scale-95"
                >
                  <User className="w-4 h-4" />
                  <span>{isRtl ? 'تسجيل الدخول الآن' : 'Sign In Now'}</span>
                </button>
              </div>
            )}
          </div>
        )}

      </main>

      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl border border-slate-700 bg-slate-900 p-6 text-white space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold">{t.iosInstallGuide}</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">1</span>
                <p>{t.iosStep1}</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">2</span>
                <p>{t.iosStep2}</p>
              </div>
            </div>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full rounded-2xl bg-slate-800 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}

      <footer className="no-print mt-16 border-t border-slate-800/80 bg-slate-950 py-10 px-4 text-center text-xs text-slate-400 space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {(adminSettings.socialLinks.whatsapp || adminSettings.targetWhatsAppNumber) && (
            <a 
              href={buildWhatsAppUrl(adminSettings.targetWhatsAppNumber || adminSettings.socialLinks.whatsapp)} 
              target="_blank" 
              rel="noreferrer" 
              className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition"
            >
              💬 {adminSettings.socialAppNames?.whatsapp || 'WhatsApp'}
            </a>
          )}
          {adminSettings.socialLinks.facebook && (
            <a href={adminSettings.socialLinks.facebook} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 hover:text-blue-400 hover:border-blue-500/40 transition">
              {adminSettings.socialAppNames?.facebook || 'Facebook'}
            </a>
          )}
          {adminSettings.socialLinks.youtube && (
            <a href={adminSettings.socialLinks.youtube} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 hover:text-red-400 hover:border-red-500/40 transition">
              {adminSettings.socialAppNames?.youtube || 'YouTube'}
            </a>
          )}
          {adminSettings.socialLinks.tiktok && (
            <a href={adminSettings.socialLinks.tiktok} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 hover:text-pink-400 hover:border-pink-500/40 transition">
              {adminSettings.socialAppNames?.tiktok || 'TikTok'}
            </a>
          )}
        </div>

        <p>
          {isRtl 
            ? 'منظومة ليرن ويب | Lern Web التعليمية المتكاملة • محرر ومحاكي الذكاء الاصطناعي البرمجي' 
            : 'Lern Web Cloud Educational Ecosystem • AI Code Editor & Sandbox Suite'}
        </p>

        <div className="flex items-center justify-center gap-2 text-slate-500 text-[11px]">
          <span>Next.js App Router • Tailwind CSS • Vercel Edge Architecture</span>
        </div>
      </footer>

      <SecretLoginModal
        isOpen={isClientLoginOpen}
        mode="client"
        initialTab="visitor"
        onClose={() => setIsClientLoginOpen(false)}
        onUserSuccess={(user: any) => {
          refreshStorageData();
          setIsUserLoggedIn(true);
          setCurrentUser(user);
          setActiveTab('client-dashboard');
          showToast(isRtl ? `مرحباً بك يا ${user?.name || 'عميلنا العزيز'}! تم تسجيل الدخول بنجاح.` : `Welcome ${user?.name || 'Client'}! Signed in successfully.`, 'success');
        }}
        lang={lang}
      />

      <SecretLoginModal
        isOpen={isSecretLoginOpen}
        mode="admin"
        initialTab="admin"
        onClose={() => setIsSecretLoginOpen(false)}
        onAdminSuccess={() => {
          refreshStorageData();
          setIsAdmin(true);
          setIsAdminDashboardOpen(true);
          showToast(isRtl ? 'تم فتح لوحة تحكم المشرف العام بنجاح.' : 'Admin Dashboard unlocked.', 'success');
        }}
        lang={lang}
      />

      {isAdminDashboardOpen && (
        <AdminDashboard
          lang={lang}
          onClose={() => setIsAdminDashboardOpen(false)}
          onRefreshData={refreshStorageData}
          onOpenSandboxWithConfig={(cfg: any) => {
            setSandboxConfig(cfg);
            setActiveTab('sandbox');
          }}
        />
      )}

      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsAiChatOpen(!isAiChatOpen)}
          className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white shadow-2xl hover:scale-105 transition"
        >
          {isAiChatOpen ? <X className="w-8 h-8" /> : <Bot className="w-8 h-8" />}
        </button>
      </div>

      {isAiChatOpen && (
        <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-8 z-[9999] w-auto md:w-96 max-w-[calc(100vw-2rem)] shadow-2xl">
          <AiSupportChat lang={lang} currentUser={currentUser} />
        </div>
      )}
    </div>
  );
}
