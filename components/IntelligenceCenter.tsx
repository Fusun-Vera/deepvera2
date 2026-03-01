
import React, { useState } from 'react';
import { Sector, SearchMode } from '../types';

interface Props {
  onSearch: (sector: string, location: string, mode: SearchMode) => void;
  isLoading: boolean;
}

const sectors: Sector[] = [
  { id: 'hotel', label: 'Otel', icon: '🏨' },
  { id: 'factory', label: 'Fabrika', icon: '🏭' },
  { id: 'restaurant', label: 'Yeme-İçme', icon: '🍽️' },
  { id: 'logistics', label: 'Lojistik', icon: '🚚' },
  { id: 'textile', label: 'Tekstil', icon: '🧵' },
];

const cities = ["Türkiye Geneli", "İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Kocaeli"];

const IntelligenceCenter: React.FC<Props> = ({ onSearch, isLoading }) => {
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [mode, setMode] = useState<SearchMode>('db');

  return (
    <div className="flex flex-col gap-10">
      {/* Adım 1: Sektör */}
      <div className="fade-in">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 block">01 / Sektör Seçin</label>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {sectors.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSector(s.id)}
              className={`flex-shrink-0 px-8 py-4 rounded-2xl border transition-all flex items-center gap-4 ${
                selectedSector === s.id 
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' 
                : 'bg-white border-slate-200 text-slate-500 hover:border-blue-400'
              }`}
            >
              <span className="text-xl">{s.icon}</span>
              <span className="text-[11px] font-black uppercase tracking-widest">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Adım 2: Lokasyon */}
      {selectedSector && (
        <div className="fade-in">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 block">02 / Bölge Belirleyin</label>
          <div className="flex gap-3 flex-wrap">
            {cities.map(city => (
              <button 
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-6 py-3 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedCity === city ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Adım 3: Aksiyon */}
      {selectedCity && (
        <div className="fade-in flex flex-col md:flex-row items-center justify-between p-8 bg-slate-50 rounded-3xl border border-slate-200">
           <div className="flex gap-12">
              <div className="flex flex-col">
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Arama Tipi</span>
                 <div className="flex gap-6">
                    <button onClick={() => setMode('db')} className={`text-[10px] font-black uppercase tracking-widest ${mode === 'db' ? 'text-blue-600 underline underline-offset-8' : 'text-slate-400'}`}>Hızlı Sorgu</button>
                    <button onClick={() => setMode('live')} className={`text-[10px] font-black uppercase tracking-widest ${mode === 'live' ? 'text-blue-600 underline underline-offset-8' : 'text-slate-400'}`}>Derin Tarama</button>
                 </div>
              </div>
           </div>
           
           <button
             disabled={isLoading}
             onClick={() => onSearch(selectedSector, selectedCity, mode)}
             className={`px-12 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all ${
               isLoading ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-slate-900 shadow-xl shadow-blue-50'
             }`}
           >
             {isLoading ? 'Analiz Yapılıyor...' : 'İstihbaratı Başlat'}
           </button>
        </div>
      )}
    </div>
  );
};

export default IntelligenceCenter;
