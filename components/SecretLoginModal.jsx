/**
 * Next.js Project Structure Identifier:
 * components/SecretLoginModal.jsx
 * 
 * Project Identity: ليرن ويب | Lern Web
 * Purpose: Discrete separation between Client Account Sign-In and Master Admin Secret Gate.
 */

import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, ShieldAlert, CheckCircle2, User, X, Eye, EyeOff, Sparkles, Phone, Mail } from 'lucide-react';
import { storageService } from '../src/services/storageService';

export default function SecretLoginModal({ 
  isOpen = false, 
  onClose = () => {}, 
  onLoginSuccess = () => {}, 
  onAdminSuccess = () => {}, 
  onUserSuccess = (_user) => {}, 
  mode = 'both', // 'admin' | 'client' | 'both'
  initialTab = 'admin', 
  lang = 'ar' 
}) {
  const isRtl = lang === 'ar';
  
  // Determine effective active tab based on mode or initialTab
  const getInitialActiveTab = () => {
    if (mode === 'admin') return 'admin';
    if (mode === 'client') return 'visitor';
    return initialTab;
  };

  const [activeTab, setActiveTab] = useState(getInitialActiveTab()); // 'admin' | 'visitor'
  const [visitorSubTab, setVisitorSubTab] = useState('login'); // 'login' | 'register'
  const [passcode, setPasscode] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorPassword, setVisitorPassword] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitorSuccess, setVisitorSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(getInitialActiveTab());
      setVisitorSubTab('login');
      setErrorMsg('');
      setPasscode('');
      setVisitorSuccess(false);
      setVisitorPassword('');
    }
  }, [isOpen, mode, initialTab]);

  if (!isOpen) return null;

  const isClientOnly = mode === 'client';
  const isAdminOnly = mode === 'admin';

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const success = storageService.loginAdmin(passcode);
    if (success) {
      setPasscode('');
      if (onAdminSuccess) onAdminSuccess();
      else if (onLoginSuccess) onLoginSuccess();
      onClose();
    } else {
      setErrorMsg(isRtl ? 'رمز المرور غير صحيح! هذه البوابة مخصصة للإدارة فقط.' : 'Invalid administrative passcode.');
    }
  };

  const handleVisitorSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (visitorSubTab === 'register' && !visitorName.trim()) {
      setErrorMsg(isRtl ? 'يرجى إدخال اسمك الكريم للمتابعة' : 'Please provide your full name');
      return;
    }
    if (!visitorPhone.trim()) {
      setErrorMsg(isRtl ? 'يرجى إدخال رقم الهاتف أو الواتساب للتواصل' : 'Please provide your phone or WhatsApp number');
      return;
    }
    if (!visitorPassword.trim()) {
      setErrorMsg(isRtl ? 'يرجى إدخال كلمة المرور' : 'Please provide a password');
      return;
    }

    let user = null;
    if (visitorSubTab === 'register') {
      user = storageService.registerUser(visitorPhone.trim(), visitorName.trim(), visitorPassword.trim(), visitorEmail.trim());
    } else {
      user = storageService.authenticateUser(visitorPhone.trim(), visitorPassword.trim());
      if (!user) {
        setErrorMsg(isRtl ? 'بيانات الدخول غير صحيحة (رقم الهاتف أو كلمة السر)' : 'Invalid login credentials.');
        return;
      }
    }

    if (user) {
      setVisitorSuccess(true);
      if (onUserSuccess) {
        onUserSuccess(user);
      }
      
      setTimeout(() => {
        setVisitorSuccess(false);
        onClose();
      }, 900);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 p-6 md:p-8 text-white shadow-2xl space-y-6">
        
        {/* Modal Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 left-5 rounded-full p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-600/30">
            {activeTab === 'admin' ? (
              <Lock className="w-6 h-6 text-white" />
            ) : (
              <User className="w-6 h-6 text-white" />
            )}
          </div>

          <h3 className="text-xl md:text-2xl font-black">
            {activeTab === 'admin' 
              ? (isRtl ? 'بوابة الإدارة السرية (Master Admin)' : 'Master Admin Portal')
              : (isRtl ? (visitorSubTab === 'login' ? 'تسجيل دخول العميل' : 'إنشاء حساب جديد') : (visitorSubTab === 'login' ? 'Client Sign In' : 'Create Account'))}
          </h3>

          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {activeTab === 'admin' 
              ? (isRtl ? 'بوابة محمية برمز مرور سري للتحكم بالمنصات، الأسعار وطرق الدفع' : 'Secure gate for platform orchestration, payments and assets')
              : (isRtl ? 'سجل بياناتك للوصول إلى لوحة العميل وحفظ وتتبع مسودات التخصيص' : 'Enter your details to access your dashboard and track AI drafts')}
          </p>
        </div>

        {/* Tab Switcher - ONLY shown if mode is 'both' */}
        {mode === 'both' && (
          <div className="flex rounded-2xl border border-slate-800 bg-slate-950 p-1">
            <button
              type="button"
              onClick={() => { setActiveTab('admin'); setErrorMsg(''); }}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition ${
                activeTab === 'admin' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{isRtl ? 'بوابة الأدمن السرية' : 'Admin Gate'}</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('visitor'); setErrorMsg(''); }}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition ${
                activeTab === 'visitor' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{isRtl ? 'دخول العميل' : 'Client Login'}</span>
            </button>
          </div>
        )}

        {/* ADMIN LOGIN FORM */}
        {activeTab === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                {isRtl ? 'رمز مرور الأدمن السري (Passcode):' : 'Secret Admin Passcode:'}
              </label>
              
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder={isRtl ? 'أدخل الرمز السري...' : 'Enter passcode...'}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 placeholder:font-sans focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono tracking-widest text-center"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-2.5 text-xs text-rose-300 flex items-center gap-2 animate-fadeIn">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 transition active:scale-98 cursor-pointer"
            >
              {isRtl ? 'فتح لوحة تحكم الأدمن' : 'Unlock Admin Dashboard'}
            </button>
          </form>
        )}

        {/* CLIENT SIGN IN / REGISTER FORM */}
        {activeTab === 'visitor' && (
          <div className="space-y-4">
            <div className="flex border-b border-slate-800">
               <button 
                 onClick={() => { setVisitorSubTab('login'); setErrorMsg(''); }}
                 className={`flex-1 py-2 text-xs font-bold transition-all ${visitorSubTab === 'login' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
               >
                 {isRtl ? 'لدى حساب بالفعل' : 'I have an account'}
               </button>
               <button 
                 onClick={() => { setVisitorSubTab('register'); setErrorMsg(''); }}
                 className={`flex-1 py-2 text-xs font-bold transition-all ${visitorSubTab === 'register' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
               >
                 {isRtl ? 'إنشاء حساب جديد' : 'Register'}
               </button>
            </div>

            <form onSubmit={handleVisitorSubmit} className="space-y-4">
              {visitorSubTab === 'register' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>{isRtl ? 'اسم صاحب المركز / المدرس:' : 'Full Name:'}</span>
                  </label>
                  <input
                    type="text"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    placeholder={isRtl ? 'أدخل اسمك الكريم أو اسم المركز...' : 'Enter your name or center name...'}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                    required={visitorSubTab === 'register'}
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isRtl ? 'رقم الهاتف / الموبايل:' : 'Phone Number:'}</span>
                </label>
                <input
                  type="text"
                  value={visitorPhone}
                  onChange={(e) => setVisitorPhone(e.target.value)}
                  placeholder={isRtl ? 'مثال: 01012345678' : 'e.g. 01012345678'}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-purple-400" />
                  <span>{isRtl ? 'كلمة السر:' : 'Password:'}</span>
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={visitorPassword}
                    onChange={(e) => setVisitorPassword(e.target.value)}
                    placeholder={isRtl ? 'أدخل كلمة السر...' : 'Enter password...'}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {visitorSubTab === 'register' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isRtl ? 'البريد الإلكتروني (اختياري):' : 'Email Address (Optional):'}</span>
                  </label>
                  <input
                    type="email"
                    value={visitorEmail}
                    onChange={(e) => setVisitorEmail(e.target.value)}
                    placeholder={isRtl ? 'name@example.com' : 'name@example.com'}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
              )}

              {errorMsg && (
                <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-2.5 text-xs text-rose-300 flex items-center gap-2 animate-fadeIn">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {visitorSuccess && (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-2.5 text-xs text-emerald-300 flex items-center justify-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{isRtl ? 'تمت العملية بنجاح! جاري تحويلك...' : 'Success! Redirecting...'}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 transition active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isRtl ? (visitorSubTab === 'login' ? 'دخول لوحة العميل' : 'إنشاء الحساب والدخول') : (visitorSubTab === 'login' ? 'Sign In' : 'Register & Enter')}</span>
              </button>
            </form>
          </div>
        )}

        <div className="border-t border-slate-800 pt-3 text-center">
          <p className="text-[11px] text-slate-500">
            {activeTab === 'admin' 
              ? (isRtl ? 'محمي برمز تشفير الإدارة الخاص' : 'Protected by Admin Security Passcode')
              : (isRtl ? 'نظام ليرن ويب الآمن لتشفير وإدارة بيانات العملاء' : 'Lern Web Secure Client Session')}
          </p>
        </div>
      </div>
    </div>
  );
}

