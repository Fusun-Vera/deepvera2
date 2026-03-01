
import React from 'react';
import { Participant } from '../types';

interface Props {
  participant: Participant | null;
  onClose: () => void;
  userLogo?: string;
  onTriggerAutomation?: (lead: Participant) => void;
}

const CompanyDetail: React.FC<Props> = ({ participant, onClose, userLogo, onTriggerAutomation }) => {
  if (!participant) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Veri Kopyalandı.');
  };

  const openGmail = () => {
    if (!participant.email || !participant.email.includes('@')) return;
    const subject = encodeURIComponent(participant.emailSubject || '');
    const body = encodeURIComponent(participant.emailDraft || '');
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${participant.email}&su=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[600px] bg-white shadow-[-40px_0_100px_rgba(0,0,0,0.15)] z-[100] flex flex-col fade-in border-l border-slate-50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-white to-indigo-50/20 -z-10"></div>
      
      <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white/60 backdrop-blur-xl sticky top-0 z-10">
        <div className="flex gap-6 items-center">
          <div className="w-16 h-16 rounded-[1.5rem] bg-slate-900 text-white flex items-center justify-center text-2xl font-black shadow-xl relative group overflow-hidden shrink-0">
             <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-20 transition-opacity"></div>
             {participant.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase truncate pr-4">{participant.name}</h2>
            <div className="flex items-center gap-2 mt-1">
               <span className="px-2 py-0.5 bg-blue-600 text-white text-[7px] font-black uppercase rounded-full tracking-widest">{participant.industry}</span>
               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">📍 {participant.location}</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="w-10 h-10 bg-slate-50 hover:bg-red-50 hover:text-red-500 rounded-xl flex items-center justify-center transition-all text-slate-400 shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar relative">
        {/* ZARİF ENTEGRASYON KARTLARI */}
        <div className="grid grid-cols-2 gap-4">
           <button 
             onClick={openGmail} 
             disabled={!participant.email?.includes('@')} 
             className="flex flex-col items-start gap-4 p-5 bg-white border border-slate-100 rounded-3xl transition-all hover:border-blue-200 hover:bg-blue-50/30 group disabled:opacity-30 shadow-sm"
           >
             <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
               <span className="text-xl">✉️</span>
             </div>
             <div className="text-left overflow-hidden">
               <span className="text-[11px] font-black text-slate-900 uppercase block">Gmail Otopilot</span>
               <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Taslağı Postala</span>
             </div>
           </button>
           
           <button 
             onClick={() => onTriggerAutomation?.(participant)}
             disabled={!participant.email?.includes('@') || participant.automationStatus === 'sent'} 
             className={`flex flex-col items-start gap-4 p-5 border rounded-3xl transition-all group disabled:opacity-30 shadow-sm ${
               participant.automationStatus === 'sent' 
               ? 'bg-emerald-50 border-emerald-100' 
               : 'bg-white border-slate-100 hover:border-slate-900 hover:bg-slate-900/5'
             }`}
           >
             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
               participant.automationStatus === 'sent' 
               ? 'bg-emerald-500 text-white' 
               : 'bg-slate-900 text-white group-hover:bg-blue-600'
             }`}>
               <span className="text-xl">{participant.automationStatus === 'sent' ? '✅' : '🚀'}</span>
             </div>
             <div className="text-left overflow-hidden">
               <span className={`text-[11px] font-black uppercase block truncate ${participant.automationStatus === 'sent' ? 'text-emerald-600' : 'text-slate-900'}`}>
                 {participant.automationStatus === 'sent' ? 'n8n Aktarıldı' : 'n8n İş Akışı'}
               </span>
               <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Otonom Aktarım</span>
             </div>
           </button>
        </div>

        {/* SOSYAL MEDYA İKONLARI */}
        {(participant.linkedin || participant.instagram || participant.twitter) && (
          <div className="space-y-4">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Dijital Ayak İzleri</label>
            <div className="flex gap-3">
              {participant.linkedin && (
                <a href={participant.linkedin} target="_blank" rel="noreferrer" className="flex-1 py-4 bg-white border border-slate-100 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-blue-600 hover:bg-blue-50/20 transition-all shadow-sm group">
                  <span className="text-xl group-hover:scale-110 transition-transform">🔗</span>
                  <span className="text-[8px] font-black text-slate-900 uppercase tracking-widest">LinkedIn</span>
                </a>
              )}
              {participant.instagram && (
                <a href={participant.instagram} target="_blank" rel="noreferrer" className="flex-1 py-4 bg-white border border-slate-100 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-pink-600 hover:bg-pink-50/20 transition-all shadow-sm group">
                  <span className="text-xl group-hover:scale-110 transition-transform">📸</span>
                  <span className="text-[8px] font-black text-slate-900 uppercase tracking-widest">Instagram</span>
                </a>
              )}
              {participant.twitter && (
                <a href={participant.twitter} target="_blank" rel="noreferrer" className="flex-1 py-4 bg-white border border-slate-100 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-sky-500 hover:bg-sky-50/20 transition-all shadow-sm group">
                  <span className="text-xl group-hover:scale-110 transition-transform">🐦</span>
                  <span className="text-[8px] font-black text-slate-900 uppercase tracking-widest">Twitter</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* NEURAL ISTIHBARAT */}
        <div className="relative group">
           <div className="absolute -inset-1 neural-glow opacity-10 blur-xl rounded-[2.5rem] group-hover:opacity-30 transition-opacity"></div>
           <div className="relative bg-slate-900 rounded-[2.5rem] p-8 overflow-hidden shadow-xl">
              <div className="absolute inset-0 scan-line z-0 opacity-20"></div>
              <div className="relative z-10 space-y-5">
                 <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                    <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.3em]">Neural İstihbarat Raporu</span>
                 </div>
                 
                 <div className="space-y-3">
                    <label className="text-[8px] font-black text-blue-500 uppercase tracking-widest block">Kişiye Özel Buzkıran</label>
                    <p className="text-lg font-bold text-white leading-relaxed italic pr-2">
                       "{participant.icebreaker || 'Analiz ediliyor...'}"
                    </p>
                 </div>
              </div>
           </div>
        </div>

        {/* TEKLIF ALANI */}
        <div className="space-y-6">
           <div className="flex justify-between items-end px-2">
              <div className="space-y-1">
                 <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Satış Senaryosu</span>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter italic">Normal Tümce Düzeni Aktif</p>
              </div>
              <button onClick={() => copyToClipboard(participant.emailDraft || '')} className="px-5 py-2 bg-slate-50 text-[9px] font-black uppercase text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all border border-slate-100 shadow-sm">Metni Kopyala</button>
           </div>
           
           <div className="bg-slate-50/50 border border-slate-100 rounded-[2.5rem] p-8 space-y-8 shadow-inner">
              <div className="space-y-2">
                 <label className="text-[8px] font-black text-slate-400 uppercase ml-2 tracking-widest">E-POSTA BAŞLIĞI</label>
                 <div className="p-5 bg-white border border-slate-100 rounded-2xl text-sm font-black text-slate-900 shadow-sm">
                    {participant.emailSubject || 'İş Birliği Teklifi'}
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[8px] font-black text-slate-400 uppercase ml-2 tracking-widest">İÇERİK (PARAGRAFLI YAPI)</label>
                 <div className="p-8 bg-white border border-slate-100 rounded-3xl text-[13px] font-medium leading-relaxed text-slate-700 whitespace-pre-wrap shadow-sm min-h-[300px]">
                    {participant.emailDraft || 'Teklif hazırlanıyor...'}
                 </div>
              </div>
           </div>
        </div>

        {/* FOOTER BİLGİLERİ */}
        <div className="grid grid-cols-2 gap-4 pb-20">
           <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Kurumsal E-Posta</label>
              <p className="text-[11px] font-black text-slate-900 truncate">{participant.email}</p>
           </div>
           <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 block">İrtibat No</label>
              <p className="text-[11px] font-black text-slate-900 truncate">{participant.phone}</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
