
import React, { useState } from 'react';
import { Participant, AppStatus } from '../types';

interface Props {
  participants: Participant[];
  status: AppStatus;
  tokenBalance: number;
  onSelectParticipant: (p: Participant) => void;
  onExport: () => void;
  onClear: () => void;
}

const DataTable: React.FC<Props> = ({ participants, onSelectParticipant, onClear, onExport }) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleRowClick = (p: Participant) => {
    setActiveId(p.id);
    onSelectParticipant(p);
  };

  if (participants.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-20 opacity-30">
        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-4xl mb-8 shadow-inner border border-slate-100">📡</div>
        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">İstihbarat Bekleniyor</h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] max-w-sm">
          Arama kutusuna bir URL veya sektör yazarak taramayı başlatın.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div className="flex items-center gap-4">
           <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Fırsat Havuzu</h3>
           <div className="px-3 py-1 bg-blue-50 text-[9px] font-black text-blue-600 border border-blue-100 rounded-full uppercase tracking-widest">
             {participants.length} Kayıt Bulundu
           </div>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={onExport} 
            className="text-[9px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-[0.2em] transition-colors flex items-center gap-2"
          >
            📊 EXCEL İNDİR (TR)
          </button>
          <button 
            onClick={onClear} 
            className="text-[9px] font-black text-slate-300 hover:text-red-500 uppercase tracking-[0.2em] transition-colors flex items-center gap-2"
          >
            🗑️ HAVUZU SIFIRLA
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 -mr-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {participants.map((p, index) => (
            <div 
              key={p.id} 
              onClick={() => handleRowClick(p)}
              className={`group relative p-6 bg-white border-2 rounded-[2rem] transition-all cursor-pointer flex items-center gap-6 ${
                activeId === p.id 
                ? 'border-blue-600 bg-blue-50/10 shadow-xl shadow-blue-50' 
                : 'border-slate-50 hover:border-blue-100 hover:bg-slate-50/20'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg font-black shadow-lg shrink-0 group-hover:scale-105 transition-transform">
                {p.name.charAt(0)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                   <h4 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors truncate">{p.name}</h4>
                   {p.status === 'completed' && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-lg shadow-emerald-200"></span>}
                </div>
                <div className="flex items-center gap-3">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[120px]">📍 {p.location}</span>
                   <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest truncate">🏢 {p.industry}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                 {p.automationStatus === 'sent' && (
                    <div className="w-8 h-8 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100" title="n8n Sendildi">
                       🚀
                    </div>
                 )}
                 <div className={`px-5 py-3 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all ${
                   p.status === 'completed' 
                   ? 'bg-slate-900 text-white border-slate-900' 
                   : 'bg-white text-slate-300 border-slate-100 animate-pulse'
                 }`}>
                   {p.status === 'completed' ? 'İNCELE' : '...'}
                 </div>
              </div>

              {activeId === p.id && (
                <div className="absolute inset-y-0 left-0 w-1.5 bg-blue-600 rounded-l-[2rem]"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataTable;
