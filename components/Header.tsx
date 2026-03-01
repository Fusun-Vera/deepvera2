import React, { useState } from 'react';
import { Language } from '../translations';

interface HeaderProps {
  onLogout: () => void;
  userName?: string;
  isPro?: boolean;
  role?: string;
  tokenBalance: number;
  onBuyTokens: () => void;
  onOpenAdmin?: () => void;
  onOpenSettings: () => void;
  onOpenGmail: () => void;
  onOpenWorker: () => void;
  userLogo?: string;
  isGmailConnected?: boolean;
  queuedCount?: number;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  workerStatus?: 'Active' | 'Idle' | 'Error';
}

const Header: React.FC<HeaderProps> = ({
  onLogout,
  userName,
  tokenBalance,
  onBuyTokens,
  onOpenSettings,
  onOpenAdmin,
  onOpenGmail,
  onOpenWorker,
  role,
  queuedCount,
  isDarkMode,
  onToggleDarkMode,
  language,
  onLanguageChange,
  workerStatus = 'Idle'
}) => {
  const isTr = language === 'tr';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="shrink-0 bg-[#f8fafc] dark:bg-slate-950 sticky top-0 z-[100] w-full transition-colors border-b border-slate-100 dark:border-slate-800/50">
      {/* Main Header Row */}
      <div className="flex items-center justify-between gap-3 px-4 lg:px-8 h-16 sm:h-20 max-w-7xl mx-auto w-full">

        {/* Sol: Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-slate-950 dark:bg-blue-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-base sm:text-xl shadow-2xl border-2 border-white/10">
            DV
          </div>
          <div className="flex flex-col">
            <span className="font-black text-base sm:text-xl tracking-tighter text-slate-950 dark:text-white uppercase italic leading-none">DEEPVERA</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[8px] sm:text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">CORE_ENGINE</span>
              <span className="text-[8px] sm:text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase">V3.1</span>
            </div>
          </div>
        </div>

        {/* Orta: Kontrol Unitesi - SADECE BUYUK EKRANDA */}
        <div className="hidden xl:flex items-center bg-[#3b82f6] p-1 rounded-[1.5rem] shadow-[0_20px_50px_-10px_rgba(59,130,246,0.4)] border border-white/20">
          {/* Durum & Kuyruk */}
          <div className="px-4 py-1.5 flex items-center gap-6 border-r border-white/15">
            <div className="flex items-center gap-2.5">
              <div className={"w-9 h-4.5 rounded-full relative flex items-center px-1 transition-colors " + (workerStatus === 'Active' ? 'bg-emerald-500/30' : workerStatus === 'Error' ? 'bg-red-500/30' : 'bg-white/20')}>
                <div className={"w-3 h-3 rounded-full shadow-sm transition-all " + (workerStatus === 'Active' ? 'bg-emerald-400 animate-pulse translate-x-4' : workerStatus === 'Error' ? 'bg-red-400' : 'bg-white')}></div>
              </div>
              <div className="flex flex-col">
                <span className="text-[6px] font-black text-white/50 uppercase tracking-widest leading-none mb-0.5">{isTr ? 'DURUM' : 'STATUS'}</span>
                <span className={"text-[9px] font-black uppercase leading-none " + (workerStatus === 'Active' ? 'text-emerald-400' : workerStatus === 'Error' ? 'text-red-400' : 'text-white')}>
                  {isTr ? (workerStatus === 'Active' ? 'AKTİF' : workerStatus === 'Error' ? 'HATA' : 'HAZIR') : workerStatus.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[6px] font-black text-white/50 uppercase tracking-widest leading-none mb-0.5">{isTr ? 'KUYRUK' : 'QUEUE'}</span>
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-black text-white leading-none">{queuedCount || 0}</span>
                <span className="text-[7px] font-bold text-white/40 uppercase leading-none">{isTr ? 'ÜNİTE' : 'UNITS'}</span>
              </div>
            </div>
          </div>
          {/* Butonlar */}
          <div className="flex items-center gap-1 ml-1">
            <button onClick={onOpenWorker} className="h-10 px-4 hover:bg-white/10 text-white rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-2 group">
              OTONOM <span className="text-xs opacity-50 group-hover:rotate-12 transition-transform">&#9881;</span>
            </button>
            <button onClick={onOpenGmail} className="h-10 px-4 hover:bg-white/10 text-white rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-2 group">
              GMAİL <span className="text-xs opacity-50 group-hover:scale-110 transition-transform">&#128231;</span>
            </button>
          </div>
        </div>

        {/* Sag: Profil + Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">

          {/* Dil Switcher - kucuk ekranda gizli */}
          <div className="hidden sm:flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 shadow-sm">
            <button onClick={() => onLanguageChange('tr')} className={"px-2 py-1 text-[10px] font-black rounded-lg transition-all " + (language === 'tr' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600')}>TR</button>
            <button onClick={() => onLanguageChange('en')} className={"px-2 py-1 text-[10px] font-black rounded-lg transition-all " + (language === 'en' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600')}>EN</button>
          </div>

          {/* Dark Mode - kucuk ekranda gizli */}
          <button onClick={onToggleDarkMode} className="hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl items-center justify-center text-base hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm">
            {isDarkMode ? '☀️' : '🌙'}
          </button>

          {/* Bakiye - orta ekrandan itibaren */}
          <div className="hidden md:flex bg-[#eff6ff] dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl px-3 py-1.5 items-center gap-2 shadow-sm">
            <div className="flex flex-col items-start">
              <span className="text-[7px] font-black text-blue-400 dark:text-blue-300 uppercase tracking-widest leading-none mb-1">{isTr ? 'BAKİYE' : 'BALANCE'}</span>
              <div className="flex items-center gap-1">
                <span className="text-base font-black text-blue-600 dark:text-blue-400 tabular-nums leading-none">{tokenBalance.toLocaleString().replace(/,/g, '.')}</span>
                <span className="text-[8px] font-black text-blue-400 dark:text-blue-300 uppercase leading-none">DV</span>
              </div>
            </div>
            <button onClick={onBuyTokens} className="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center text-base font-bold hover:bg-slate-900 dark:hover:bg-white dark:hover:text-blue-600 transition-all shadow-md active:scale-95">+</button>
          </div>

          {/* Profil Avatar */}
          <div onClick={onOpenSettings} className="w-9 h-9 sm:w-11 sm:h-11 bg-slate-900 dark:bg-blue-600 text-white rounded-full flex items-center justify-center text-base font-black cursor-pointer hover:scale-105 transition-all shadow-xl border-2 border-white dark:border-slate-800 ring-2 ring-blue-50 dark:ring-blue-900/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-20 transition-opacity"></div>
            {userName?.charAt(0) || 'D'}
          </div>

          {/* Admin badge - sadece buyuk ekranda */}
          {role === 'admin' && onOpenAdmin && (
            <button onClick={onOpenAdmin} className="hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 bg-slate-950 dark:bg-slate-800 text-white rounded-xl items-center justify-center font-black text-[8px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg">
              ADM
            </button>
          )}

          {/* Kullanici adi + cikis - sadece buyuk ekranda */}
          <div className="hidden lg:flex flex-col items-end border-l border-slate-100 dark:border-slate-800 pl-3">
            <span className="text-[11px] font-black text-slate-950 dark:text-white uppercase tracking-tighter leading-none mb-1 max-w-[90px] truncate">
              {role === 'admin' ? 'ADMIN' : (userName || 'USER')}
            </span>
            <button onClick={onLogout} className="text-[8px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1 hover:text-red-700 dark:hover:text-red-400 transition-colors border-b border-transparent hover:border-red-500 pb-0.5">
              {isTr ? 'ÇIKIŞ' : 'LOGOUT'} &#10148;
            </button>
          </div>

          {/* Hamburger Menu - sadece kucuk ekranda */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden flex flex-col items-center justify-center w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 gap-1.5 transition-all hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <div className={"w-5 h-0.5 bg-slate-700 dark:bg-slate-300 rounded-full transition-all " + (mobileMenuOpen ? 'rotate-45 translate-y-2' : '')}></div>
            <div className={"w-5 h-0.5 bg-slate-700 dark:bg-slate-300 rounded-full transition-all " + (mobileMenuOpen ? 'opacity-0' : '')}></div>
            <div className={"w-5 h-0.5 bg-slate-700 dark:bg-slate-300 rounded-full transition-all " + (mobileMenuOpen ? '-rotate-45 -translate-y-2' : '')}></div>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-100 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-950 px-4 py-4 flex flex-col gap-3 animate-fade-in">

          {/* Durum Bilgisi */}
          <div className="flex items-center justify-between bg-[#3b82f6] rounded-2xl px-4 py-3">
            <div className="flex items-center gap-3">
              <div className={"w-2.5 h-2.5 rounded-full " + (workerStatus === 'Active' ? 'bg-emerald-400 animate-pulse' : workerStatus === 'Error' ? 'bg-red-400' : 'bg-white/60')}></div>
              <div>
                <div className="text-[7px] font-black text-white/50 uppercase tracking-widest">{isTr ? 'SISTEM DURUMU' : 'SYSTEM STATUS'}</div>
                <div className={"text-[10px] font-black uppercase " + (workerStatus === 'Active' ? 'text-emerald-400' : workerStatus === 'Error' ? 'text-red-400' : 'text-white')}>
                  {isTr ? (workerStatus === 'Active' ? 'AKTİF' : workerStatus === 'Error' ? 'HATA' : 'HAZIR') : workerStatus.toUpperCase()}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[7px] font-black text-white/50 uppercase tracking-widest">{isTr ? 'KUYRUK' : 'QUEUE'}</div>
              <div className="text-[13px] font-black text-white">{queuedCount || 0}</div>
            </div>
          </div>

          {/* Ana Aksiyonlar */}
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => { onOpenWorker(); setMobileMenuOpen(false); }} className="flex items-center justify-center gap-2 h-12 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-wider hover:bg-blue-700 transition-all shadow-md">
              &#9881; OTONOM
            </button>
            <button onClick={() => { onOpenGmail(); setMobileMenuOpen(false); }} className="flex items-center justify-center gap-2 h-12 bg-slate-900 dark:bg-slate-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-wider hover:bg-blue-600 transition-all shadow-md">
              &#128231; GMAİL
            </button>
          </div>

          {/* Bakiye + Satin Al */}
          <div className="flex items-center justify-between bg-[#eff6ff] dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl px-4 py-3">
            <div>
              <div className="text-[7px] font-black text-blue-400 uppercase tracking-widest mb-1">{isTr ? 'BAKİYENİZ' : 'YOUR BALANCE'}</div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-black text-blue-600 dark:text-blue-400">{tokenBalance.toLocaleString().replace(/,/g, '.')}</span>
                <span className="text-[8px] font-black text-blue-400 uppercase">DV</span>
              </div>
            </div>
            <button onClick={() => { onBuyTokens(); setMobileMenuOpen(false); }} className="h-10 px-5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-slate-900 transition-all shadow-md">
              + {isTr ? 'YUKLE' : 'TOP UP'}
            </button>
          </div>

          {/* Ayarlar Satiri */}
          <div className="flex items-center gap-2">
            {/* Dil */}
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 shadow-sm">
              <button onClick={() => onLanguageChange('tr')} className={"px-3 py-1.5 text-[10px] font-black rounded-lg transition-all " + (language === 'tr' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-400')}>TR</button>
              <button onClick={() => onLanguageChange('en')} className={"px-3 py-1.5 text-[10px] font-black rounded-lg transition-all " + (language === 'en' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-400')}>EN</button>
            </div>
            {/* Dark Mode */}
            <button onClick={onToggleDarkMode} className="w-10 h-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl flex items-center justify-center text-base hover:bg-slate-200 transition-all">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            {/* Admin */}
            {role === 'admin' && onOpenAdmin && (
              <button onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }} className="h-10 px-3 bg-slate-950 dark:bg-slate-800 text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">
                ADM
              </button>
            )}
            {/* Profil Ayarlari */}
            <button onClick={() => { onOpenSettings(); setMobileMenuOpen(false); }} className="h-10 px-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex-1">
              {isTr ? 'PROFIL' : 'PROFILE'}
            </button>
            {/* Cikis */}
            <button onClick={() => { onLogout(); setMobileMenuOpen(false); }} className="h-10 px-3 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-100 dark:border-red-900">
              {isTr ? 'ÇIKIŞ' : 'EXIT'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
