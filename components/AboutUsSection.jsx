/**
 * Project: ليرن ويب | Lern Web
 * File: components/AboutUsSection.jsx
 * About Us section describing Lern Web universal software engineering & SaaS marketplace.
 */

import React from 'react';
import { Sparkles, ShieldCheck, Code2, Rocket, Globe, CheckCircle2, Cpu } from 'lucide-react';

export default function AboutUsSection({ lang = 'ar', onClose = () => {} }) {
  const isRtl = lang === 'ar';

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-6 md:p-10 shadow-2xl space-y-8 animate-fadeIn max-w-5xl mx-auto my-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3.5 py-1 text-xs font-bold text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRtl ? 'عن المنظومة' : 'About Lern Web'}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white">
            {isRtl ? 'ليرن ويب | المنظومة الشاملة لتوليد وتخصيص المشاريع البرمجية' : 'Lern Web | Universal Software & SaaS Factory'}
          </h2>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
            {isRtl 
              ? 'نحن المنصة العربية الرائدة التي تتيح لأصحاب الأعمال والمطورين إطلاق وتخصيص كافة المشاريع البرمجية (متاجر إلكترونية، أنظمة SaaS، أدوات الذكاء الاصطناعي، بوابات الحضور، ومنصات المراكز التعليمية) بتملك كامل وبدون تعقيد.'
              : 'The premier platform empowering businesses and developers to launch and customize all software projects and SaaS applications with full ownership and instant deployment.'}
          </p>
        </div>

        <button
          onClick={onClose}
          className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition"
        >
          {isRtl ? 'إغلاق القسم' : 'Close Section'}
        </button>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Code2 className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white">
            {isRtl ? 'مشاريع برمجية غير محدودة' : 'Universal Software Engineering'}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isRtl 
              ? 'لا تقتصر على التعليم فقط، بل نتيح لك بناء أي نظام برمجي أو متجر أو تطبيق ويب أو لوحة تحكم بزحمة أو أتمتة متكاملة.'
              : 'Not limited to education—build any web application, e-commerce store, CRM pipeline, or AI tool instantly.'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white">
            {isRtl ? 'تخصيص ذكي بالذكاء الاصطناعي' : 'AI-Powered Customization'}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isRtl 
              ? 'مساعد ذكي متطور يترجم طلبك النصي إلى تعديلات فورية في الأكواد والتصميم، مع مراجعة واعتماد مباشر من الإدارة.'
              : 'Advanced AI assistant translating your text prompt into live code modifications and staged previews.'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white">
            {isRtl ? 'تملك كامل وشفرة مصدرية' : 'Full Source Code Ownership'}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isRtl 
              ? 'احصل على كامل السورس كود بصيغة Next.js و Tailwind CSS بدون أي اشتراكات شهرية إجبارية مع دعم النشر على Vercel.'
              : 'Receive complete uncompressed source code with zero recurring fees and instant Vercel cloud deployment.'}
          </p>
        </div>
      </div>

      {/* Achievements Section - Expanded Article Style */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 md:p-8 space-y-8">
        <div className="space-y-3 border-b border-amber-500/10 pb-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-4 py-1 text-xs font-bold text-amber-400 mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{isRtl ? 'سجل الإنجازات والتميز' : 'Milestones & Success Stories'}</span>
          </div>
          <h4 className="text-2xl md:text-3xl font-black text-white">
            {isRtl ? 'إنجازات ليرن ويب: رحلة من الابتكار التقني' : 'Lern Web Achievements: A Journey of Tech Innovation'}
          </h4>
          <p className="text-sm text-slate-400 max-w-3xl mx-auto leading-relaxed">
            {isRtl 
              ? 'منذ انطلاقنا، وضعنا نصب أعيننا هدفاً واحداً: تمكين كل معلم وصاحب مشروع من تملك أدواته البرمجية بالكامل. إليكم أبرز ما حققناه بدعمكم وثقتكم.'
              : 'Since our inception, we have had one goal: empowering every educator and business owner to fully own their software tools. Here are our highlights.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl h-56 bg-slate-900 border border-slate-800 shadow-xl">
               <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop" alt="Team Work" className="w-full h-full object-cover" />
            </div>
            <h5 className="text-lg font-bold text-white">
              {isRtl ? 'ثورة في أنظمة إدارة التعليم (LMS Revolution)' : 'LMS Management Revolution'}
            </h5>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {isRtl 
                ? 'نجحنا في تطوير أول منظومة عربية تدعم العمل بدون إنترنت (PWA) وتوليد بطاقات الهوية الذكية بالباركود، مما قلل وقت تسجيل حضور الطلاب بنسبة 85% في أكثر من 150 سنتر تعليمي بمصر والوطن العربي.'
                : 'We successfully developed the first Arabic system supporting offline work (PWA) and smart QR ID generation, reducing student check-in time by 85% across 150+ centers.'}
            </p>
            <div className="flex gap-4">
              <a href="https://lernweb.com/case-studies/lms" target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-400 hover:text-blue-300 underline underline-offset-4 decoration-blue-500/30">
                {isRtl ? 'اقرأ قصة النجاح الكاملة' : 'Read Full Success Story'}
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl h-56 bg-slate-900 border border-slate-800 shadow-xl">
               <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop" alt="Cyber Security" className="w-full h-full object-cover" />
            </div>
            <h5 className="text-lg font-bold text-white">
              {isRtl ? 'الأمن السيبراني والذكاء الاصطناعي (Proctor AI)' : 'Cybersecurity & AI Proctoring'}
            </h5>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {isRtl 
                ? 'منظومة Proctor AI الخاصة بنا أصبحت المعيار الأول للأمان في الاختبارات الأونلاين، حيث تم تنفيذ أكثر من نصف مليون اختبار آمن بدون أي حالات اختراق أو تسريب بفضل خوارزميات التشفير المتقدمة لدينا.'
                : 'Our Proctor AI system has become the gold standard for online exam security, with over half a million secure exams conducted without a single leak.'}
            </p>
            <div className="flex gap-4">
              <a href="https://lernweb.com/tech/security" target="_blank" rel="noreferrer" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-4 decoration-emerald-500/30">
                {isRtl ? 'اطلع على معايير الأمان' : 'View Security Standards'}
              </a>
            </div>
          </div>
        </div>

        <div className="bg-slate-950/60 rounded-3xl p-6 border border-slate-800 text-center space-y-4">
           <h5 className="text-base font-bold text-amber-400">
             {isRtl ? 'أرقام تتحدث عن إنجازاتنا:' : 'Our Numbers Speak:'}
           </h5>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4">
                <div className="text-2xl font-black text-white">300+</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">{isRtl ? 'عميل نشط' : 'Active Clients'}</div>
              </div>
              <div className="p-4">
                <div className="text-2xl font-black text-white">1M+</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">{isRtl ? 'مستخدم نهائي' : 'End Users'}</div>
              </div>
              <div className="p-4">
                <div className="text-2xl font-black text-white">99.9%</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">{isRtl ? 'وقت التشغيل' : 'Uptime'}</div>
              </div>
              <div className="p-4">
                <div className="text-2xl font-black text-white">24/7</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">{isRtl ? 'دعم فني' : 'Tech Support'}</div>
              </div>
           </div>
        </div>
      </div>


      {/* Mission Footer */}
      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xl">
            LW
          </div>
          <div>
            <h4 className="text-sm md:text-base font-bold text-white">
              {isRtl ? 'هل أنت مستعد لإطلاق مشروعك البرمجي القادم؟' : 'Ready to launch your next software project?'}
            </h4>
            <p className="text-xs text-slate-300">
              {isRtl ? 'تصفح المتجر الآن أو جرب محاكي التخصيص الفوري.' : 'Explore the store or test the live sandbox preview.'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-2.5 text-xs md:text-sm font-bold text-white shadow-md transition"
        >
          {isRtl ? 'ابدأ الآن' : 'Get Started'}
        </button>
      </div>
    </div>
  );
}
