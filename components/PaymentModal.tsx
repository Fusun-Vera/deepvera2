
import React, { useState } from 'react';

interface Props {
  isOpen: boolean;
  isPro?: boolean;
  onClose: () => void;
  onSuccess: (tokens: number) => void;
  onUpgrade: () => void;
}

const packages = [
  { id: '1', tokens: 100, price: '100₺' },
  { id: '2', tokens: 500, price: '500₺', popular: true },
  { id: '3', tokens: 1000, price: '1.000₺' },
];

const PaymentModal: React.FC<Props> = ({ isOpen, isPro, onClose, onSuccess, onUpgrade }) => {
  const [activeTab, setActiveTab] = useState<'tokens' | 'subscription'>('tokens');
  const [selectedPkg, setSelectedPkg] = useState(packages[1]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm fade-in">
      <div className="bg-white max-w-2xl w-full rounded-[3rem] overflow-hidden flex flex-col p-10 lg:p-14 shadow-2xl border border-slate-100">
        <div className="flex justify-between items-start mb-10">
           <div className="flex flex-col">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Kredi Yükleme</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">1 Token = 1₺ Sabit Kur Avantajı</p>
           </div>
           <button onClick={onClose} className="text-slate-300 hover:text-slate-900 transition-colors text-4xl leading-none">&times;</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 bg-slate-50 p-1.5 rounded-2xl">
           <button 
             onClick={() => setActiveTab('tokens')}
             className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'tokens' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
           >
             Token Satın Al
           </button>
           <button 
             onClick={() => setActiveTab('subscription')}
             className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'subscription' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
           >
             PRO Üyelik
           </button>
        </div>

        {activeTab === 'tokens' ? (
          <div className="space-y-6">
            <div className="space-y-3">
              {packages.map((pkg) => (
                <button 
                  key={pkg.id}
                  onClick={() => setSelectedPkg(pkg)}
                  className={`w-full p-6 rounded-2xl border transition-all flex items-center justify-between ${
                    selectedPkg.id === pkg.id 
                    ? 'bg-blue-50 border-blue-600' 
                    : 'bg-white border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col items-start text-left">
                     <span className={`text-[12px] font-black uppercase tracking-widest ${selectedPkg.id === pkg.id ? 'text-blue-600' : 'text-slate-900'}`}>{pkg.tokens.toLocaleString()} Aİ-Token</span>
                     {pkg.popular && <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest mt-1 italic">STRATEJİK PAKET</span>}
                  </div>
                  <span className="text-base font-black text-slate-900">{pkg.price}</span>
                </button>
              ))}
            </div>
            <button 
              onClick={() => onSuccess(selectedPkg.tokens)}
              className="w-full py-6 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-100 hover:bg-slate-900 transition-all"
            >
              Ödeme Yap ve Tokenları Yükle
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className={`p-8 rounded-3xl border-2 relative overflow-hidden transition-all ${isPro ? 'border-amber-500 bg-amber-50/20' : 'border-blue-600 bg-white shadow-xl shadow-blue-50'}`}>
               <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                     <div>
                        <h4 className="text-2xl font-black text-slate-900 uppercase">PRO Üyelik</h4>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Operasyonel Avantajlar</p>
                     </div>
                     <div className="text-right">
                        <span className="text-3xl font-black text-slate-900">990₺</span>
                        <p className="text-[9px] font-black text-slate-400 uppercase">/ AY</p>
                     </div>
                  </div>
                  
                  <ul className="space-y-4 mb-10">
                     {[
                       "Tüm analizlerde %50 Token indirimi (Maliyetleri yarıya düşürün)",
                       "Öncelikli Deep-Web tarama kuyruğu",
                       "Gelişmiş Gmail Otopilot özellikleri",
                       "Sektörel raporları CSV/XLS dışa aktarma",
                       "Kişiselleştirilmiş AI Satış Danışmanı"
                     ].map((feat, i) => (
                       <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                          <span className="text-blue-500">✓</span>
                          {feat}
                       </li>
                     ))}
                  </ul>

                  {isPro ? (
                    <div className="w-full py-5 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center border border-emerald-100">
                      PRO ÜYELİĞİNİZ AKTİF
                    </div>
                  ) : (
                    <button 
                      onClick={onUpgrade}
                      className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-blue-600 transition-all"
                    >
                      PRO'YA YÜKSELT
                    </button>
                  )}
               </div>
            </div>
          </div>
        )}
        
        <p className="text-[8px] font-black text-slate-300 text-center uppercase tracking-widest mt-8 italic">Güvenli Altyapı • 1 Token = 1₺ Net Fiyatlandırma</p>
      </div>
    </div>
  );
};

export default PaymentModal;
