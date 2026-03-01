
import React from 'react';
import { User } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUpdate: (fields: Partial<User>) => void;
}

const IdentityModal: React.FC<Props> = ({ isOpen, onClose, user, onUpdate }) => {
  if (!isOpen || !user) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white w-full max-w-2xl rounded-[3.5rem] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.5)] border border-white overflow-hidden flex flex-col fade-in">
        
        <div className="p-10 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Profile Yapılandırma</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Bu veriler yapay zekanın "Senaryo Motoru" tarafından kullanılır.</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center text-2xl font-bold cursor-pointer"
          >
            &times;
          </button>
        </div>

        <div className="p-10 overflow-y-auto max-h-[70vh] custom-scrollbar space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Firma Tam Adı</label>
              <input 
                type="text" 
                value={user.companyName || ''} 
                onChange={(e) => onUpdate({ companyName: e.target.value })}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold outline-none focus:border-blue-500 transition-all"
                placeholder="Örn: DeepVera Teknoloji A.Ş."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Yetkili Adı Soyadı</label>
              <input 
                type="text" 
                value={user.authorizedPerson || ''} 
                onChange={(e) => onUpdate({ authorizedPerson: e.target.value })}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold outline-none focus:border-blue-500 transition-all"
                placeholder="Örn: Ahmet Yılmaz"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-blue-600 uppercase tracking-widest ml-2">AI Referans Metni (Kısa İş Özeti)</label>
            <textarea 
              value={user.companyDescription || ''} 
              onChange={(e) => onUpdate({ companyDescription: e.target.value })}
              className="w-full h-24 p-5 bg-blue-50/30 border border-blue-100 rounded-[2rem] text-[11px] font-medium outline-none focus:border-blue-500 transition-all resize-none leading-relaxed"
              placeholder="Şirketiniz ne yapar? AI bu metne bakarak teklif yazar."
            />
          </div>

          <div className="p-6 bg-slate-900 rounded-[2.5rem] space-y-4 border border-blue-500/30 shadow-xl shadow-blue-500/10">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">⚡</div>
               <label className="text-[10px] font-black text-white uppercase tracking-widest">n8n Otonom Mailing Entegrasyonu</label>
            </div>
            <input 
              type="text" 
              value={user.n8nWebhookUrl || ''} 
              onChange={(e) => onUpdate({ n8nWebhookUrl: e.target.value })}
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-mono text-blue-400 outline-none focus:border-blue-500 transition-all"
              placeholder="https://n8n.sirketiniz.com/webhook/..."
            />
            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest text-center">n8n Webhook URL adresinizi buraya bağlayarak mailleri otomatik gönderin.</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Contact GSM</label>
              <input 
                type="text" 
                value={user.companyMobilePhone || ''} 
                onChange={(e) => onUpdate({ companyMobilePhone: e.target.value })}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold outline-none focus:border-blue-500 transition-all"
                placeholder="+90 5xx..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Kurumsal E-Posta</label>
              <input 
                type="email" 
                value={user.email || ''} 
                onChange={(e) => onUpdate({ email: e.target.value })}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold outline-none focus:border-blue-500 transition-all"
                placeholder="isim@sirket.com"
              />
            </div>
          </div>
        </div>

        <div className="p-10 bg-slate-900 flex flex-col gap-4">
           <button 
             onClick={onClose}
             className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-white hover:text-slate-900 transition-all cursor-pointer"
           >
             Değişiklikleri Confirm ve Save
           </button>
        </div>
      </div>
    </div>
  );
};

export default IdentityModal;
