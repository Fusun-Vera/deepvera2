import React, { useState, useMemo } from 'react';
import { Participant, AppStatus } from '../types';
import * as XLSX from 'xlsx';
import { Language, translations } from '../translations';

interface Props {
  participants: Participant[];
  status: AppStatus;
  tokenBalance: number;
  language: Language;
  onSelectParticipant: (p: Participant) => void;
  onExport: () => void;
  onClear: () => void;
  updateParticipant: (id: string, updates: Partial<Participant>) => void;
  onSaveToLibrary?: (name: string) => void;
  onStartAutomation?: () => void;
}

const getScore = (name: string): number => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff;
  return 72 + (Math.abs(h) % 27);
};

const scoreStyle = (s: number) => s >= 90
  ? { bar: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800' }
  : s >= 80
  ? { bar: 'bg-blue-500', text: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' }
  : { bar: 'bg-amber-400', text: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800' };

const funnelInfo = (s?: string) =>
  s === 'replied' ? { label: 'Yanitladi', dot: 'bg-emerald-500' }
  : s === 'contacted' ? { label: 'Iletisimde', dot: 'bg-blue-500' }
  : s === 'meeting_scheduled' ? { label: 'Toplanti', dot: 'bg-purple-500' }
  : { label: 'Bekliyor', dot: 'bg-slate-300' };

const DataTable: React.FC<Props> = ({
  participants, onSelectParticipant, onClear, updateParticipant, onStartAutomation, language = 'tr'
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'name' | 'location' | 'funnelStatus'>('name');
  const t = translations[language];

  const rows = useMemo(() => {
    return participants
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        const va = a[sortOrder] || '', vb = b[sortOrder] || '';
        return va < vb ? -1 : va > vb ? 1 : 0;
      });
  }, [participants, searchTerm, sortOrder]);

  const handleRowClick = (p: Participant) => {
    setActiveId(p.id);
    onSelectParticipant(p);
  };

  const handleQueue = (e: React.MouseEvent, p: Participant) => {
    e.stopPropagation();
    if (p.automationStatus === 'sent' || p.automationStatus === 'sending') return;
    updateParticipant(p.id, { automationStatus: p.automationStatus === 'queued' ? 'idle' : 'queued' });
  };

  const handleExport = () => {
    const data = rows.map(p => ({
      'Firma Adi': p.name,
      'Skor': getScore(p.name) + '%',
      'Web Sitesi': p.website,
      'E-posta': p.email,
      'Telefon': p.phone,
      'Sektor': p.industry,
      'Lokasyon': p.location,
      'Durum': p.funnelStatus,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Leads');
    XLSX.writeFile(wb, `deepvera_leads_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const queuedCount = participants.filter(p => p.automationStatus === 'queued').length;

  // Column grid: avatar | firma | skor | website | email | telefon | durum | kuyruk
  const gridCols = '2rem 1fr 7rem 10rem 12rem 9rem 5.5rem 2.5rem';

  return (
    <div className="flex flex-col h-full">
      {/* TOOLBAR */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-100 dark:border-slate-800 shrink-0 flex-wrap">
        <span className="text-[11px] font-black text-slate-700 dark:text-white uppercase tracking-tight whitespace-nowrap mr-1">
          {t.intelPool} <span className="text-blue-500">({rows.length})</span>
        </span>
        <div className="w-px h-5 bg-slate-200 dark:bg-slate-700" />
        <div className="relative flex items-center">
          <svg className="absolute left-2.5 w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" placeholder={t.searchByFirm} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="h-8 pl-7 pr-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-[11px] font-medium text-slate-700 dark:text-white placeholder-slate-300 outline-none focus:ring-1 focus:ring-blue-400 w-40" />
        </div>
        <select value={sortOrder} onChange={e => setSortOrder(e.target.value as any)} className="h-8 px-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-[11px] font-bold text-slate-600 dark:text-slate-300 outline-none cursor-pointer">
          <option value="name">{t.sortByAlpha}</option>
          <option value="location">{t.sortByLocation}</option>
          <option value="funnelStatus">{t.sortByStatus}</option>
        </select>
        <div className="flex-1" />
        {queuedCount > 0 && (
          <button onClick={onStartAutomation} className="h-8 px-4 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest animate-pulse shadow shadow-blue-200 whitespace-nowrap">
            {t.startAutomation} ({queuedCount})
          </button>
        )}
        <button onClick={handleExport} className="h-8 px-3 flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-300 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all whitespace-nowrap">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          {t.exportData}
        </button>
        <button onClick={onClear} className="h-8 px-3 flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-300 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all whitespace-nowrap">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          {t.clearAll}
        </button>
      </div>

      {/* COLUMN HEADERS — Firma | Skor | Web Sitesi | E-posta | Telefon | Durum | Q */}
      <div className="grid items-center gap-2 px-4 py-1.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50 shrink-0" style={{ gridTemplateColumns: gridCols }}>
        <div />
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">FIRMA</span>
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] text-center">SKOR</span>
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">WEB SITESI</span>
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">E-POSTA</span>
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">TELEFON</span>
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">DURUM</span>
        <div />
      </div>

      {/* ROWS */}
      <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-50 dark:divide-slate-800">
        {rows.map((p) => {
          const score = getScore(p.name);
          const ss = scoreStyle(score);
          const fi = funnelInfo(p.funnelStatus);
          const active = activeId === p.id;
          const loading = p.status === 'pending' || p.status === 'processing';

          return (
            <div
              key={p.id}
              onClick={() => handleRowClick(p)}
              className={`group grid items-center gap-2 px-4 py-3 cursor-pointer transition-all select-none ${active ? 'bg-blue-50 dark:bg-blue-900/10 border-l-2 border-l-blue-500' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-l-2 border-l-transparent'}`}
              style={{ gridTemplateColumns: gridCols }}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black text-white shrink-0 shadow-sm transition-all ${loading ? 'bg-slate-300 dark:bg-slate-600 animate-pulse' : 'bg-slate-900 dark:bg-slate-600 group-hover:bg-blue-600'}`}>
                {loading ? '...' : p.name.charAt(0)}
              </div>

              {/* Firma Adi + Konum */}
              <div className="min-w-0">
                <div className={`text-[12px] font-black uppercase truncate leading-tight transition-colors ${active ? 'text-blue-600' : 'text-slate-800 dark:text-white group-hover:text-blue-600'}`}>
                  {loading ? <span className="inline-block h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" /> : p.name}
                </div>
                {p.location && <div className="text-[10px] text-slate-400 truncate mt-0.5">📍 {p.location}</div>}
                {!loading && p.industry && <span className="inline-block text-[8px] font-black text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded-md uppercase tracking-wide mt-0.5">{p.industry.length > 18 ? p.industry.substring(0,18)+'...' : p.industry}</span>}
              </div>

              {/* Skor */}
              <div className="flex flex-col items-center gap-1">
                {loading ? <span className="inline-block h-5 w-10 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" /> : (
                  <>
                    <span className={`text-[11px] font-black px-2 py-0.5 rounded-md border ${ss.text} ${ss.bg} ${ss.border}`}>{score}%</span>
                    <div className="w-full h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${ss.bar}`} style={{ width: `${score}%` }} />
                    </div>
                  </>
                )}
              </div>

              {/* Web Sitesi */}
              <div className="min-w-0">
                {loading ? <span className="inline-block h-2.5 w-16 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" />
                : p.website ? (
                  <a href={p.website.startsWith('http') ? p.website : 'https://' + p.website} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="flex items-center gap-1 text-[10px] font-medium text-blue-500 hover:text-blue-700 transition-colors truncate" title={p.website}>
                    <span className="w-4 h-4 bg-blue-50 text-blue-500 rounded flex items-center justify-center text-[8px] shrink-0">🌐</span>
                    <span className="truncate text-[10px]">{p.website.replace(/^https?:\/\//,'').substring(0,18)}</span>
                  </a>
                ) : <span className="text-[9px] text-slate-300 dark:text-slate-600 italic">—</span>}
              </div>

              {/* E-posta */}
              <div className="min-w-0">
                {loading ? <span className="inline-block h-2.5 w-16 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" />
                : p.email && p.email !== 'Analiz ediliyor...' ? (
                  <a href={`mailto:${p.email}`} onClick={e => e.stopPropagation()} className="flex items-center gap-1.5 text-[10px] font-medium text-slate-600 dark:text-slate-300 hover:text-violet-600 transition-colors truncate" title={p.email}>
                    <span className="w-5 h-5 bg-violet-50 dark:bg-violet-900/20 text-violet-500 rounded flex items-center justify-center text-[10px] shrink-0">&#9993;</span>
                    <span className="truncate text-[10px]">{p.email.length > 22 ? p.email.substring(0,20)+'...' : p.email}</span>
                  </a>
                ) : p.email === 'Analiz ediliyor...' ? <span className="text-[9px] text-slate-300 italic">Analiz ediliyor...</span>
                : <span className="text-[9px] text-slate-300 dark:text-slate-600 italic">—</span>}
              </div>

              {/* Telefon */}
              <div className="min-w-0">
                {loading ? <span className="inline-block h-2.5 w-16 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" />
                : p.phone && p.phone !== '...' ? (
                  <a href={`tel:${p.phone}`} onClick={e => e.stopPropagation()} className="flex items-center gap-1.5 text-[10px] font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors truncate" title={p.phone}>
                    <span className="w-5 h-5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded flex items-center justify-center text-[10px] shrink-0">📞</span>
                    <span className="truncate text-[10px]">{p.phone.replace(/\s/g,'').substring(0,14)}</span>
                  </a>
                ) : <span className="text-[9px] text-slate-300 dark:text-slate-600 italic">—</span>}
              </div>

              {/* Durum */}
              <div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${fi.dot}`} />
                  <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">{fi.label}</span>
                </div>
              </div>

              {/* Kuyruk Butonu */}
              <div className="flex justify-end">
                <button onClick={(e) => handleQueue(e, p)} title={p.automationStatus === 'queued' ? 'Kuyruktan cikart' : 'Otomasyona ekle'}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] transition-all border ${p.automationStatus === 'sent' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 border-emerald-200 dark:border-emerald-800 cursor-default' : p.automationStatus === 'queued' ? 'bg-blue-600 text-white border-blue-600 shadow shadow-blue-200' : 'bg-white dark:bg-slate-800 text-slate-200 border-slate-100 dark:border-slate-700 hover:border-blue-300 hover:text-blue-400'}`}>
                  {p.automationStatus === 'sent' ? '&#10003;' : '&#9993;'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DataTable;
