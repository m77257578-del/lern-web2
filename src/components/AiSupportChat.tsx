import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Bot, User, Trash2, ShieldCheck, Crown } from 'lucide-react';
import { storageService, SupportTicket, SupportTicketMessage } from '../services/storageService';

interface AiSupportChatProps {
  lang?: 'ar' | 'en';
  currentUser?: any;
}

export default function AiSupportChat({ lang = 'ar', currentUser }: AiSupportChatProps) {
  const isRtl = lang === 'ar';
  const scrollRef = useRef<HTMLDivElement>(null);

  // Persistent User/Visitor ID
  const [visitorId] = useState<string>(() => {
    if (currentUser?.id) return currentUser.id;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lernweb_chat_visitor_id');
      if (saved) return saved;
      const newId = 'v-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
      localStorage.setItem('lernweb_chat_visitor_id', newId);
      return newId;
    }
    return 'guest-' + Date.now();
  });

  const userId = currentUser?.id || visitorId;
  const userName = currentUser?.name || 'زائر كريم';
  const userPhone = currentUser?.phone || '';
  const userEmail = currentUser?.email || '';

  const [ticket, setTicket] = useState<SupportTicket | null>(() => storageService.getTicketByUserId(userId));
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // Subscribe to storage changes for real-time ticket updates (e.g. when Admin posts a reply or sets AI override)
  useEffect(() => {
    const updateLocalTicket = () => {
      const fresh = storageService.getTicketByUserId(userId);
      setTicket(fresh);
    };

    updateLocalTicket();
    const unsubscribe = storageService.subscribe(() => {
      updateLocalTicket();
    });
    return () => unsubscribe();
  }, [userId]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [ticket?.messages, isThinking]);

  const clearChat = () => {
    if (ticket?.id) {
      storageService.deleteSupportTicket(ticket.id);
      setTicket(null);
    }
  };

  // Fallback local responder
  const getLocalFallbackResponse = (query: string): string => {
    const text = query.trim().toLowerCase();
    
    if (text.includes('اهلا') || text.includes('أهلا') || text.includes('سلام') || text.includes('ازيك') || text.includes('hi') || text.includes('hello')) {
      return isRtl 
        ? `أهلاً بك ${userName} في ليرن ويب! نورتنا. قولي تحب نساعدك في إيه النهاردة؟ بخصوص المنصات، التخصيص أو باقات الاشتراك؟`
        : `Welcome ${userName} to Lern Web! How can I assist you today with our platform engineering or licensing?`;
    }

    if (text.includes('سعر') || text.includes('أسعار') || text.includes('اسعار') || text.includes('بكام') || text.includes('اشتراك') || text.includes('price')) {
      return isRtl 
        ? `باقات ليرن ويب المفصلة:\n1️⃣ الاشتراك الشهري: 950 ج.م / $29 شهرياً\n2️⃣ الترخيص السنوي (الأكثر طلباً ⭐): 8,500 ج.م / $249 سنوياً\n3️⃣ التملك الكامل للكود (White-Label Buyout): 27,000 ج.م / $799 دفعة واحدة مدى الحياة.`
        : `Lern Web Pricing Options:\n• Monthly: $29 (950 EGP)\n• Annual (Best Value): $249 (8,500 EGP)\n• Full Source Buyout: $799 (27,000 EGP one-time).`;
    }

    return isRtl 
      ? `شكراً لتواصلك يا فندم! أنا المساعد الذكي وفريق الإدارة يستقبل استفسارك الآن. سنوافيك بالتفاصيل الدقيقة فوراً.`
      : `Thank you for reaching out! Our AI assistant and engineering administrators are reviewing your query.`;
  };

  // API Call with system instruction override if set by admin
  const callChatWithRetry = async (userText: string, historyToSend: any[], systemOverride?: string): Promise<string> => {
    let lastError: any = null;

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message: userText, 
            history: historyToSend,
            systemInstruction: systemOverride || undefined
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.text && typeof data.text === 'string' && data.text.trim()) {
            return data.text.trim();
          }
        }

        const errData = await response.json().catch(() => ({}));
        lastError = new Error(errData.details || errData.error || `HTTP ${response.status}`);
      } catch (err: any) {
        lastError = err;
      }

      if (attempt < 2) {
        const backoffMs = Math.min(500 * Math.pow(2, attempt) + Math.random() * 200, 2000);
        await new Promise(res => setTimeout(res, backoffMs));
      }
    }

    throw lastError || new Error('Connection failed');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isThinking) return;

    const userText = inputQuery.trim();
    setInputQuery('');
    setIsThinking(true);

    // Add user message to ticket
    const currentTicket = storageService.addMessageToTicket(
      userId,
      userName,
      userPhone,
      userEmail,
      { sender: 'user', senderName: userName, text: userText }
    );
    setTicket(currentTicket);

    try {
      const activeMessages = currentTicket.messages || [];
      const historyToSend = activeMessages.slice(0, -1).slice(-8).map(m => ({
        sender: m.sender === 'user' ? 'user' : 'model',
        text: m.text
      }));

      // Call AI with custom admin system override if active
      const aiReply = await callChatWithRetry(userText, historyToSend, currentTicket.systemOverride);

      // Save AI reply to ticket
      const updatedTicket = storageService.addMessageToTicket(
        userId,
        userName,
        userPhone,
        userEmail,
        { sender: 'ai', senderName: 'المساعد الذكي (AI)', text: aiReply }
      );
      setTicket(updatedTicket);
    } catch (err) {
      console.warn('AI chat remote fallback activated:', err);
      const fallbackReply = getLocalFallbackResponse(userText);
      const updatedTicket = storageService.addMessageToTicket(
        userId,
        userName,
        userPhone,
        userEmail,
        { sender: 'ai', senderName: 'المساعد الذكي (AI)', text: fallbackReply }
      );
      setTicket(updatedTicket);
    } finally {
      setIsThinking(false);
    }
  };

  const activeMessages: SupportTicketMessage[] = ticket?.messages || [
    {
      id: 'welcome-msg',
      sender: 'ai',
      senderName: 'المساعد الذكي (AI)',
      text: isRtl 
        ? `مرحباً بك ${userName}! أنا المهندس الذكي لمنصة ليرن ويب. أنا مطلع حالياً على كافة مشاريعنا وباقاتنا وإعدادات المنصة، وجاهز لمساعدتك في الاستفسارات العامة أو تخصيص الأكواد والمحاكي فوراً. كيف أخدمك اليوم؟`
        : `Welcome ${userName}! I am the Lern Web AI Architect. I am currently reviewing our live projects, plans, and platform settings. I can assist with general inquiries or help you customize codes in the Sandbox instantly. How can I help you today?`,
      timestamp: new Date().toISOString()
    }
  ];

  return (
    <div className="flex flex-col h-[520px] max-h-[75vh] rounded-3xl border border-slate-700/80 bg-slate-900 shadow-2xl overflow-hidden shadow-blue-500/10 animate-fadeIn">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-4 border-b border-slate-700/80 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-md shadow-blue-600/30">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-white">
                {isRtl ? 'المساعد الذكي والدعم المباشر' : 'Lern Web AI & Live Support'}
              </h3>
              {ticket?.systemOverride && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>{isRtl ? 'توجيه مخصص' : 'Custom AI'}</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-slate-300 font-medium">
                {isRtl ? 'مرتبط بـ Admin Control' : 'Linked to Admin Dashboard'}
              </span>
            </div>
          </div>
        </div>

        <button 
          onClick={clearChat}
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition cursor-pointer"
          title={isRtl ? 'إعادة ضبط وسجل المحادثة' : 'Clear Chat'}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Admin Custom Prompt Active Banner Notice */}
      {ticket?.systemOverride && (
        <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/60 px-3.5 py-1.5 border-b border-amber-500/30 text-[10px] font-bold text-amber-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
            <span>{isRtl ? 'تم وضع توجيهات خاصة بالذكاء الاصطناعي لهذا الحساب من قِبَل المشرف العام' : 'Custom AI System Directive active for your account'}</span>
          </span>
        </div>
      )}

      {/* Chat Messages Transcript */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/60 scroll-smooth"
      >
        {activeMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isAdmin = msg.sender === 'admin';

          return (
            <div 
              key={msg.id} 
              className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar Icon */}
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow ${
                isUser 
                  ? 'bg-blue-600 text-white' 
                  : isAdmin 
                    ? 'bg-gradient-to-tr from-amber-500 to-indigo-600 text-white ring-2 ring-amber-400/40' 
                    : 'bg-slate-800 border border-slate-700 text-blue-400'
              }`}>
                {isUser ? (
                  <User className="w-3.5 h-3.5" />
                ) : isAdmin ? (
                  <Crown className="w-3.5 h-3.5 text-amber-200" />
                ) : (
                  <Bot className="w-3.5 h-3.5" />
                )}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-md space-y-1 ${
                isUser 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : isAdmin 
                    ? 'bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-amber-500/50 text-amber-100 rounded-bl-none ring-1 ring-amber-500/20' 
                    : 'bg-slate-800/90 border border-slate-700/80 text-slate-200 rounded-bl-none'
              }`}>
                {/* Admin Reply Label Header */}
                {isAdmin && (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 pb-1 border-b border-amber-500/30">
                    <ShieldCheck className="w-3 h-3 text-amber-400" />
                    <span>{isRtl ? 'رد من إدارة ليرن ويب (Admin Response)' : 'Official Admin Response'}</span>
                  </div>
                )}

                <p className="whitespace-pre-wrap break-words">{msg.text}</p>

                <div className={`text-[9px] font-mono opacity-60 text-right ${isUser ? 'text-blue-100' : 'text-slate-400'}`}>
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString(isRtl ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' }) : ''}
                </div>
              </div>
            </div>
          );
        })}

        {isThinking && (
          <div className="flex items-end gap-2">
            <div className="w-7 h-7 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-blue-400 animate-spin" />
            </div>
            <div className="bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-2xl rounded-bl-none text-xs text-slate-400">
              <span className="animate-pulse">{isRtl ? 'جاري تحليل الإجابة والتواصل مع المحرك...' : 'Generating response...'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-3 bg-slate-900 border-t border-slate-800">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={isRtl ? 'اكتب سؤالك أو طلبك للذكاء الاصطناعي والإدارة...' : 'Type message for AI & Admin...'}
            className="flex-1 min-w-0 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none transition shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isThinking}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-2xl disabled:opacity-50 transition active:scale-95 shrink-0 shadow-lg shadow-blue-600/30 flex items-center justify-center cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[9px] text-slate-500 mt-2 text-center">
          {isRtl ? 'منظومة الدعم الفني الذكية • محادثات حية ومزامنة فورية مع المشرف' : 'AI & Admin Live Chat • Real-time Sync'}
        </p>
      </div>
    </div>
  );
}
