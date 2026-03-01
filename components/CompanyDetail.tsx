import React, { useState, useEffect, useRef } from 'react';
import { Participant, User } from '../types';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Copy, Trash2, Wand2, Search, Paperclip, X } from 'lucide-react';

interface Props {
  participant: Participant | null;
  onClose: () => void;
  user: User | null;
  updateParticipant?: (id: string, updates: Partial<Participant>) => void;
  onRegenerate?: (participant: Participant) => Promise<void>;
  onFilter?: (type: 'industry' | 'competitor' | 'painPoint', value: string) => void;
}

const CompanyDetail: React.FC<Props> = ({ participant, onClose, user, updateParticipant, onRegenerate, onFilter }) => {
  const [isSending, setIsSending] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [draftContent, setDraftContent] = useState(participant?.emailDraft || '');
  const [subject, setSubject] = useState(participant?.emailSubject || '');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [attachments, setAttachments] = useState<string[]>(participant?.attachments || []);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (participant?.emailDraft) setDraftContent(participant.emailDraft);
    if (participant?.emailSubject) setSubject(participant.emailSubject);
    if (participant?.attachments) setAttachments(participant.attachments);
  }, [participant?.id, participant?.emailDraft, participant?.emailSubject, participant?.attachments]);

  if (!participant || !user) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFileNames = Array.from(files).map(f => f.name);
      const updated = [...attachments, ...newFileNames];
      setAttachments(updated);
      if (updateParticipant) updateParticipant(participant.id, { attachments: updated });
    }
  };

  const removeAttachment = (index: number) => {
    const updated = attachments.filter((_, i) => i !== index);
    setAttachments(updated);
    if (updateParticipant) updateParticipant(participant.id, { attachments: updated });
  };

  const handleDraftChange = (content: string) => {
    setDraftContent(content);
    if (updateParticipant) updateParticipant(participant.id, { emailDraft: content });
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSubject(val);
    if (updateParticipant) updateParticipant(participant.id, { emailSubject: val });
  };

  const handleInternalSend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      if (updateParticipant) {
        updateParticipant(participant.id, {
          automationStatus: 'sent',
          funnelStatus: 'contacted',
          sentAt: new Date().toISOString()
        });
      }
      onClose();
    }, 1800);
  };

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopyStatus(label);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-[800] bg-slate-950/60 backdrop-blur-xl flex items-start justify-center p-2 sm:p-4 md:p-6 animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-2xl md:rounded-3xl shadow-2xl flex flex-col border border-slate-200 dark:border-slate-700 animate-reveal-up my-2 sm:my-4">

        {/* ── HEADER ── */}
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between shrink-0 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-t-2xl md:rounded-t-3xl">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 dark:bg-blue-600 text-white rounded-xl flex items-center justify-center text-lg sm:text-xl font-black shadow-md shrink-0">
              {participant.name.charAt(0)}
            </div>
            {/* Title */}
            <div className="min-w-0">
              <h2 className="text-base sm:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight truncate max-w-[180px] sm:max-w-xs md:max-w-md">
                {participant.name}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-xs ${i < (participant.starRating || 3) ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700'}`}>★</span>
                  ))}
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest truncate max-w-[120px] sm:max-w-none">
                  {participant.industry || 'STRATEJİK ANALİZ'}
                </span>
              </div>
            </div>
          </div>
          {/* Close */}
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-red-500 hover:text-white transition-all text-xl shadow-sm ml-2"
          >
            ×
          </button>
        </div>

        {/* ── SCROLLABLE BODY ── */}
        <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100dvh - 200px)' }}>
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-slate-50/40 dark:bg-slate-950/20">

            {/* ── 2-COLUMN GRID ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start">

              {/* Left: Intel (2/3) */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">

                {/* Strategic Summary */}
                <section className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🧠</span>
                    <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Stratejik İstihbarat</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-[13px] sm:text-[14px]">
                    {participant.description || `${participant.name}, ${participant.industry || 'sektöründe'} faaliyet göstermektedir.`}
                  </p>
                </section>

                {/* Pain Points & Competitors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Pain Points */}
                  <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <span>⚡</span> KRİTİK ACI NOKTALARI
                    </h3>
                    <div className="space-y-2">
                      {(participant.painPoints || ['Operasyonel Verimlilik', 'Dijital Pazarlama', 'Müşteri Deneyimi']).map((point, i) => (
                        <div key={i} className="flex items-center justify-between bg-red-50/60 dark:bg-red-900/10 p-2.5 rounded-xl border border-red-100/50 dark:border-red-900/20 group/item">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0"></div>
                            <span className="text-[12px] font-semibold text-slate-700 dark:text-slate-300 leading-tight">{point}</span>
                          </div>
                          {onFilter && (
                            <button onClick={() => onFilter('painPoint', point)} className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/40 rounded text-red-500 transition-all shrink-0" title="Bu acı noktasına göre filtrele">
                              <Search size={12} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Competitors */}
                  <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <span>🛡️</span> PAZAR RAKİPLERİ
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {(participant.competitors || ['Sektörel Devler', 'Yerel Rakipler', 'Yeni Girişimler']).map((comp, i) => (
                        <div key={i} className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700 group/comp">
                          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{comp}</span>
                          {onFilter && (
                            <button onClick={() => onFilter('competitor', comp)} className="opacity-0 group-hover/comp:opacity-100 p-0.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded text-blue-500 transition-all" title="Bu rakibe göre filtrele">
                              <Search size={10} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Outreach Engine */}
                <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                  {/* Section Header */}
                  <div className="bg-slate-50 dark:bg-slate-900/80 px-4 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                      </div>
                      <div>
                        <h3 className="text-[13px] font-black text-slate-900 dark:text-white uppercase tracking-tight">Otonom E-Posta Taslağı</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">AI_GENERATED</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={async () => { if (!onRegenerate || !participant) return; setIsRegenerating(true); try { await onRegenerate(participant); } finally { setIsRegenerating(false); } }} disabled={isRegenerating} className="h-9 px-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-blue-100 dark:border-blue-800 flex items-center gap-1.5" title="Yeniden Oluştur">
                        <Wand2 size={14} className={isRegenerating ? 'animate-spin' : ''} />
                        <span className="hidden sm:inline">YENİDEN ÜRET</span>
                      </button>
                      <button onClick={() => { setDraftContent(''); setSubject(''); updateParticipant && updateParticipant(participant.id, { emailDraft: '', emailSubject: '' }); }} className="h-9 px-3 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center" title="Taslağı Temizle">
                        <Trash2 size={14} />
                      </button>
                      <button onClick={() => copyToClipboard(draftContent || '', 'Email')} className="h-9 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-slate-900 hover:to-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-blue-200/50 dark:shadow-none">
                        <span>KOPYALA</span>
                        <Copy size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6 space-y-4 bg-white dark:bg-slate-800">
                    {/* Subject */}
                    <div className="relative">
                      <div className="absolute -top-2.5 left-4 px-2 bg-white dark:bg-slate-800 text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] z-10">KONU BAŞLIĞI</div>
                      <div className="bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3 overflow-hidden">
                        <div className="pl-4"><div className="w-2 h-2 rounded-full bg-blue-500"></div></div>
                        <input type="text" value={subject} onChange={handleSubjectChange} placeholder="Email konu başlığı..." className="flex-1 h-11 bg-transparent border-none outline-none text-[14px] font-bold text-slate-900 dark:text-white px-0" />
                      </div>
                    </div>

                    {/* Email Body */}
                    <div className="relative">
                      <div className="absolute -top-2.5 left-4 px-2 bg-white dark:bg-slate-800 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] z-10">MESAJ İÇERİĞİ</div>
                      <div className="bg-white dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-700 min-h-[280px] overflow-hidden">
                        {draftContent ? (
                          <div className="quill-wrapper">
                            <ReactQuill
                              theme="snow"
                              value={draftContent}
                              onChange={handleDraftChange}
                              modules={{ toolbar: [[{ 'header': [1, 2, 3, false] }], ['bold', 'italic', 'underline', 'strike'], [{ 'color': [] }, { 'background': [] }], [{ 'list': 'ordered'}, { 'list': 'bullet' }], [{ 'align': [] }], ['link', 'clean']] }}
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-16 gap-4">
                            <div className="relative">
                              <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                              <div className="absolute inset-0 flex items-center justify-center text-base">🤖</div>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Nöral Analiz Yapılıyor...</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Attachments */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Paperclip size={11} /> DOSYA EKLERİ ({attachments.length})</h4>
                        <button onClick={() => attachmentInputRef.current?.click()} className="text-[9px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest flex items-center gap-1 transition-colors">+ DOSYA EKLE</button>
                        <input type="file" multiple ref={attachmentInputRef} onChange={handleFileUpload} className="hidden" />
                      </div>
                      {attachments.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {attachments.map((name, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 max-w-[120px] truncate">{name}</span>
                              <button onClick={() => removeAttachment(idx)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={10} /></button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Tip */}
                    <div className="flex items-center gap-3 px-3 py-2.5 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/20">
                      <span className="text-emerald-600 text-base">💡</span>
                      <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 leading-tight">
                        Bu taslak, firmanın <span className="underline decoration-emerald-300">acı noktaları</span> ve <span className="underline decoration-emerald-300">pazar locationu</span> temel alınarak otonom üretilmiştir.
                      </p>
                    </div>
                  </div>
                </section>

              </div>{/* /Left */}

              {/* Right: Contact & Social (1/3) */}
              <div className="space-y-4">

                {/* Contact Card */}
                <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Contact Kanalları</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest block mb-0.5">TELEFON</span>
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] font-black text-slate-900 dark:text-white tabular-nums">{participant.phone || '—'}</span>
                        {participant.phone && <button onClick={() => copyToClipboard(participant.phone, 'Phone Number')} className="text-blue-500 text-sm ml-2 shrink-0">📋</button>}
                      </div>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest block mb-0.5">E-POSTA</span>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-bold text-slate-900 dark:text-white lowercase break-all">{participant.email || 'n/a'}</span>
                        {participant.email && <button onClick={() => copyToClipboard(participant.email, 'Email')} className="text-blue-500 text-sm ml-2 shrink-0">📋</button>}
                      </div>
                    </div>
                    <a href={participant.website} target="_blank" rel="noreferrer" className="w-full h-10 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-900 transition-all shadow-md shadow-blue-100 dark:shadow-none">
                      WEB SİTESİNE GİT ➔
                    </a>
                  </div>
                </div>

                {/* Social */}
                <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Dijital Varlık</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'linkedin', label: 'LinkedIn', icon: '🔗' },
                      { id: 'instagram', label: 'Instagram', icon: '📸' },
                      { id: 'facebook', label: 'Facebook', icon: '👥' },
                      { id: 'twitter', label: 'Twitter / X', icon: '🐦' }
                    ].map(social => {
                      const url = (participant as any)[social.id];
                      return (
                        <button key={social.id} onClick={() => url && window.open(url)} disabled={!url}
                          className={`flex items-center justify-between p-3 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all ${url ? 'bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-slate-100 dark:border-slate-700' : 'bg-slate-50/50 dark:bg-slate-900/30 text-slate-300 dark:text-slate-700 cursor-not-allowed'}`}
                        >
                          <div className="flex items-center gap-2"><span>{social.icon}</span>{social.label}</div>
                          {url && <span className="text-blue-500">➔</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Ice Breaker */}
                {participant.prestigeNote && (
                  <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/20">
                    <h3 className="text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><span>💡</span> BUZ KIRICI NOT</h3>
                    <p className="text-amber-900 dark:text-amber-200 font-bold italic text-[12px] leading-relaxed">"{participant.prestigeNote}"</p>
                  </div>
                )}

              </div>{/* /Right */}
            </div>{/* /Grid */}
          </div>
        </div>{/* /Scrollable Body */}

        {/* ── ACTION FOOTER ── */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 flex gap-2 sm:gap-3 items-center bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0 rounded-b-2xl md:rounded-b-3xl">
          <button
            onClick={handleInternalSend}
            disabled={isSending || !participant.email}
            className={`flex-1 h-12 sm:h-14 rounded-xl font-black text-[11px] sm:text-[13px] uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-2 ${!participant.email ? 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-slate-950 shadow-lg shadow-blue-200 dark:shadow-none'}`}
          >
            {isSending ? <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : <>OTONOM MESAJI GÖNDER <span>⚡</span></>}
          </button>
          <button
            onClick={() => copyToClipboard(JSON.stringify(participant), 'Veri')}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-center hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all active:scale-90"
            title="Veriyi Kopyala"
          >
            <span className="text-lg">📥</span>
          </button>
        </div>

      </div>{/* /Modal */}

      {/* Copy Toast */}
      {copyStatus && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest shadow-2xl animate-bounce z-[1100] text-[12px]">
          {copyStatus} KOPYALANDI!
        </div>
      )}

      <style>{`
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-reveal-up { animation: revealUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
        .quill-wrapper .ql-toolbar { border: none !important; background: #f8fafc; border-bottom: 1px solid #f1f5f9 !important; padding: 8px 12px !important; }
        .dark .quill-wrapper .ql-toolbar { background: #0f172a; border-bottom: 1px solid #1e293b !important; }
        .quill-wrapper .ql-container { border: none !important; font-family: 'Inter', sans-serif !important; font-size: 14px !important; }
        .quill-wrapper .ql-editor { padding: 16px 20px !important; min-height: 200px !important; line-height: 1.7 !important; }
        .dark .quill-wrapper .ql-editor { color: #e2e8f0; }
      `}</style>
    </div>
  );
};

export default CompanyDetail;
