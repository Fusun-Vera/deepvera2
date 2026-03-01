
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { extractLeadList, findCompanyIntel } from './services/geminiService';
import { Participant, ViewState, User, AppStatus } from './types';
import { translations, Language } from './translations';
import Header from './components/Header';
import DataTable from './components/DataTable';
import LandingPage from './components/LandingPage';
import LoginForm from './components/LoginForm';
import PaymentModal from './components/PaymentModal';
import CompanyDetail from './components/CompanyDetail';
import IdentityModal from './components/IdentityModal';
import DeepVeraAssistant from './components/DeepVeraAssistant';
import AdminPanel from './components/AdminPanel';
import GmailCenter from './components/GmailCenter';
import AutonomousWorker from './components/AutonomousWorker';

const globalLocations: Record<string, string[]> = {
  "TÜRKİYE": [
    "İSTANBUL", "ANKARA", "İZMİR", 
    "ADANA", "ADIYAMAN", "AFYONKARAHİSAR", "AĞRI", "AKSARAY", "AMASYA", "ANTALYA", "ARDAHAN", "ARTVİN", "AYDIN", 
    "BALIKESİR", "BARTIN", "BATMAN", "BAYBURT", "BİLECİK", "BİNGÖL", "BİTLİS", "BOLU", "BURDUR", "BURSA", "ÇANAKKALE", 
    "ÇANKIRI", "ÇORUM", "DENİZLİ", "DİYARBAKIR", "DÜZCE", "EDİRNE", "ELAZIĞ", "ERZİNCAN", "ERZURUM", "ESKİŞEHİR", 
    "GAZİANTEP", "GİRESUN", "GÜMÜŞHANE", "HAKKARİ", "HATAY", "IĞDIR", "ISPARTA", "KAHRAMANMARAŞ", "KARABÜK", "KARAMAN", 
    "KARS", "KASTAMONU", "KAYSERİ", "KIRIKKALE", "KIRKLARELİ", "KIRŞEHİR", "KİLİS", "KOCAELİ", "KONYA", "KÜTAHYA", 
    "MALATYA", "MANİSA", "MARDİN", "MERSİN", "MUĞLA", "MUŞ", "NEVŞEHİR", "NİĞDE", "ORDU", "OSMANİYE", "RİZE", "SAKARYA", 
    "SAMSUN", "SİİRT", "SİNOP", "SİVAS", "ŞIRNAK", "TEKİRDAĞ", "TOKAT", "TRABZON", "TUNCELİ", "ŞANLIURFA", "UŞAK", "VAN", 
    "YALOVA", "YOZGAT", "ZONGULDAK"
  ],
  "AVUSTRALYA": [
    "SYDNEY (NSW)", "MELBOURNE (VIC)", "BRISBANE (QLD)", "PERTH (WA)", "ADELAIDE (SA)", "CANBERRA (ACT)", "HOBART (TAS)", "DARWIN (NT)",
    "GOLD COAST (QLD)", "NEWCASTLE (NSW)", "WOLLONGONG (NSW)", "GEELONG (VIC)", "TOWNSVILLE (QLD)", "CAIRNS (QLD)", "TOOWOOMBA (QLD)", "BALLARAT (VIC)", "BENDIGO (VIC)", "ALBURY (NSW/VIC)", "LAUNCESTON (TAS)", "MACKAY (QLD)", "ROCKHAMPTON (QLD)", "BUNBURY (WA)", "COFFS HARBOUR (NSW)", "BUNDABERG (QLD)", "WAGGA WAGGA (NSW)", "HERVEY BAY (QLD)", "MILDURA (VIC)", "SHEPPARTON (VIC)", "GLADSTONE (QLD)", "PORT MACQUARIE (NSW)", "TAMWORTH (NSW)", "TRARALGON (VIC)", "ORANGE (NSW)", "BOWRAL (NSW)", "DUBBO (NSW)", "BATHURST (NSW)", "NOWRA (NSW)", "GERALDTON (WA)", "WARRNAMBOOL (VIC)", "KALGOORLIE (WA)", "ALBANY (WA)", "MOUNT GAMBIER (SA)", "LISMORE (NSW)"
  ],
  "ALMANYA": ["BERLIN", "MUNICH", "HAMBURG", "FRANKFURT", "STUTTGART", "COLOGNE", "DUSSELDORF", "DORTMUND"],
  "ABD": ["NEW YORK", "LOS ANGELES", "CHICAGO", "HOUSTON", "PHOENIX", "PHILADELPHIA", "SAN ANTONIO", "SAN DIEGO"],
  "İNGİLTERE": ["LONDON", "MANCHESTER", "BIRMINGHAM", "LEEDS", "LIVERPOOL", "GLASGOW", "SHEFFIELD", "BRISTOL"],
  "FRANSA": ["PARIS", "MARSEILLE", "LYON", "TOULOUSE", "NICE", "NANTES", "STRASBOURG", "MONTPELLIER"],
  "KANADA": ["TORONTO", "VANCOUVER", "MONTREAL", "OTTAWA", "CALGARY", "EDMONTON", "QUEBEC CITY"],
  "AFRİKA BİRLİĞİ": ["LAGOS", "ABUJA", "CAIRO", "JOHANNESBURG", "CAPE TOWN", "NAIROBI", "CASABLANCA", "ADDIS ABABA"]
};

const limits = [10, 25, 50, 100, 250];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('deepvera_active_session') || sessionStorage.getItem('deepvera_active_session');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [view, setView] = useState<ViewState>(user ? 'dashboard' : 'landing');
  const [activeTab, setActiveTab] = useState<'search' | 'library'>('search');
  const [tokenBalance, setTokenBalance] = useState<number>(user?.tokenBalance || 100);
  
  const [participants, setParticipants] = useState<Participant[]>(() => {
    const saved = localStorage.getItem('deepvera_current_participants');
    return saved ? JSON.parse(saved) : [];
  });

  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('deepvera_lang') as Language;
    return saved || 'tr';
  });

  const [queryContext, setQueryContext] = useState('');
  const [searchLimit, setSearchLimit] = useState<number>(10);
  const [selectedCountry, setSelectedCountry] = useState<string>("TÜRKİYE");
  const [selectedCity, setSelectedCity] = useState<string>("İSTANBUL");
  const [selectedSector, setSelectedSector] = useState<string>(translations[language].sectors.choose);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isIdentityModalOpen, setIsIdentityModalOpen] = useState(false);
  const [isWorkerOpen, setIsWorkerOpen] = useState(false);
  const [isGmailOpen, setIsGmailOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [filter, setFilter] = useState<{ type: string, value: string } | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('deepvera_theme');
    return saved === 'dark';
  });

  const t = translations[language];

  const sectors = [
    { id: 'all', label: t.sectors.choose },
    { id: 'avm', label: t.sectors.avm },
    { id: 'restoran', label: t.sectors.restoran },
    { id: 'kafeterya', label: t.sectors.kafeterya },
    { id: 'hastahane', label: t.sectors.hastahane },
    { id: 'sigorta', label: t.sectors.sigorta },
    { id: 'giyim', label: t.sectors.giyim },
    { id: 'cocuk_giyim', label: t.sectors.cocuk_giyim },
    { id: 'market', label: t.sectors.market },
    { id: 'guzellik', label: t.sectors.guzellik },
    { id: 'sac_ekim', label: t.sectors.sac_ekim },
    { id: 'ozel_okul', label: t.sectors.ozel_okul },
    { id: 'otomotiv', label: t.sectors.otomotiv },
    { id: 'yazilim', label: t.sectors.yazilim },
    { id: 'spor', label: t.sectors.spor },
    { id: 'mobilya', label: t.sectors.mobilya },
    { id: 'otel', label: t.sectors.otel },
    { id: 'fabrika', label: t.sectors.fabrika },
  ];

  const isUrlInput = queryContext.startsWith('http') || queryContext.startsWith('www');

  useEffect(() => {
    setSelectedSector(t.sectors.choose);
  }, [language, t.sectors.choose]);

  useEffect(() => {
    localStorage.setItem('deepvera_lang', language);
  }, [language]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('deepvera_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('deepvera_theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (user) {
      const userStr = JSON.stringify(user);
      if (localStorage.getItem('deepvera_active_session')) {
        localStorage.setItem('deepvera_active_session', userStr);
      } else {
        sessionStorage.setItem('deepvera_active_session', userStr);
      }
    }
  }, [user]);

  const handleExport = () => {
    if (participants.length === 0) return;
    
    const data = participants.map(p => ({
      'İsim': p.name,
      'Web Sitesi': p.website,
      'E-posta': p.email,
      'Telefon': p.phone,
      'Konum': p.location || '',
      'Sektör': p.industry || '',
      'Durum': p.funnelStatus || 'waiting'
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    
    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, `deepvera_leads_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleLogin = (loggedUser: User, remember: boolean) => {
    setUser(loggedUser);
    setTokenBalance(loggedUser.tokenBalance);
    setView('dashboard');
    const userStr = JSON.stringify(loggedUser);
    if (remember) localStorage.setItem('deepvera_active_session', userStr);
    else sessionStorage.setItem('deepvera_active_session', userStr);
  };

  const startAnalysis = async () => {
    if (tokenBalance < searchLimit) { 
      setIsPaymentModalOpen(true); 
      return; 
    }
    
    setStatus(AppStatus.LOADING);
    setCurrentStep('Web kaynakları taranıyor...');
    setProgressPercent(5);
    
    const finalSector = selectedSector === "SEKTÖR SEÇİN" ? "" : selectedSector;
    const finalLocation = isUrlInput ? "" : `${selectedCountry} ${selectedCity}`.trim();
    const finalLimit = isUrlInput ? 500 : searchLimit; // URL aramalarında "tümünü" bulmak için limiti artırıyoruz

    try {
      const results = await extractLeadList(
        queryContext || `${finalLocation} ${finalSector}`, 
        finalSector, 
        finalLocation, 
        finalLimit, 
        []
      );

      setCurrentStep('Firma listesi ayrıştırılıyor...');
      setProgressPercent(20);
      
      const newLeads: Participant[] = results.map(r => ({
        id: Math.random().toString(36),
        name: r.name || 'Bilinmeyen',
        website: r.website || '',
        email: 'Analiz ediliyor...',
        phone: r.phone || '...',
        status: 'pending',
        automationStatus: 'idle',
        funnelStatus: 'waiting',
        isSaved: false,
        location: r.location || finalLocation
      }));

      setParticipants(newLeads);
      setStatus(AppStatus.FINDING_DETAILS);

      const concurrencyLimit = 3;
      let processed = 0;
      
      const processLead = async (lead: Participant) => {
        try {
          const intel = await findCompanyIntel(lead.name, lead.website, finalSector, user!);
          setParticipants(prev => prev.map(p => p.id === lead.id ? { ...p, ...intel, status: 'completed' } : p));
          
          processed++;
          const currentProgress = 20 + Math.round((processed / newLeads.length) * 80);
          setProgressPercent(currentProgress);
          setCurrentStep(`[${processed}/${newLeads.length}] ${lead.name} nöral analizi...`);

          setTokenBalance(b => {
            const newBalance = b - 1;
            if (user) {
              const updatedUser = { ...user, tokenBalance: newBalance };
              setUser(updatedUser);
              localStorage.setItem('deepvera_active_session', JSON.stringify(updatedUser));
            }
            return newBalance;
          });
        } catch (err) {
          console.error(`Error analyzing ${lead.name}:`, err);
          setParticipants(prev => prev.map(p => p.id === lead.id ? { ...p, status: 'failed' } : p));
        }
      };

      // Run in batches
      for (let i = 0; i < newLeads.length; i += concurrencyLimit) {
        const batch = newLeads.slice(i, i + concurrencyLimit);
        await Promise.all(batch.map(processLead));
      }
    } catch (e) { 
      console.error(e); 
      setStatus(AppStatus.FAILED);
    }
    setStatus(AppStatus.IDLE);
    setCurrentStep('');
    
  // Save search record for admin tracking
  try {
    const _sr = {
      id: Math.random().toString(36).substr(2, 9),
      userId: (user && (user.id || user.username)) || 'unknown',
      sector: finalSector || 'Genel',
      location: finalLocation || 'Bilinmiyor',
      firmCount: newLeads.length,
      tokensUsed: newLeads.length,
      date: new Date().toISOString(),
    };
    const _esStr = localStorage.getItem('deepvera_user_searches');
    const _es = _esStr ? JSON.parse(_esStr) : [];
    _es.push(_sr);
    localStorage.setItem('deepvera_user_searches', JSON.stringify(_es));
  } catch(_e) {}
  setProgressPercent(0);
  };

  const filteredParticipants = filter 
    ? participants.filter(p => {
        if (filter.type === 'industry') return p.industry === filter.value;
        if (filter.type === 'competitor') return p.competitors?.includes(filter.value);
        if (filter.type === 'painPoint') return p.painPoints?.includes(filter.value);
        return true;
      })
    : participants;

  const renderMainContent = () => {
    if (view === 'landing' && !user) {
      return (
        <LandingPage 
          onGetStarted={() => setView('login')} 
          onToggleAssistant={() => setIsAssistantOpen(true)} 
          language={language}
          onLanguageChange={setLanguage}
        />
      );
    }
    
    if (!user) {
      return (
        <LoginForm 
          onLogin={handleLogin} 
          onCancel={() => setView('landing')} 
          language={language}
        />
      );
    }

    return (
      <div className="h-screen bg-[#f8fafc] dark:bg-slate-950 flex flex-col font-sans relative overflow-hidden">
        <Header 
          userName={user?.name} 
          tokenBalance={tokenBalance} 
          role={user?.role}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          language={language}
          onLanguageChange={setLanguage}
          onLogout={() => {
            setUser(null);
            localStorage.removeItem('deepvera_active_session');
            sessionStorage.removeItem('deepvera_active_session');
            setView('landing');
          }} 
          onBuyTokens={() => setIsPaymentModalOpen(true)}
          onOpenSettings={() => setIsIdentityModalOpen(true)} 
          onOpenAdmin={() => setIsAdminOpen(true)}
          onOpenGmail={() => setIsGmailOpen(true)} 
          onOpenWorker={() => setIsWorkerOpen(true)}
          isGmailConnected={user?.isGmailConnected}
          queuedCount={participants.filter(p => p.automationStatus === 'queued').length}
        />

        <main className="flex-1 flex flex-col px-4 lg:px-8 py-2 gap-3 max-w-7xl mx-auto w-full relative overflow-hidden">
          
          {/* Intelligence Operation Bar (Sticky) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-2 shadow-sm shrink-0 flex flex-col gap-2 z-40 transition-all">
            <div className="flex items-center gap-1.5 w-full">
              <div className="flex-[2] min-w-[180px] relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </div>
                <input 
                  type="text" value={queryContext} onChange={(e) => setQueryContext(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full h-10 pl-10 pr-3 bg-slate-50/50 dark:bg-slate-800/50 border border-transparent rounded-xl text-[12px] font-bold text-slate-900 dark:text-white placeholder-slate-300 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-100 dark:focus:border-blue-900 transition-all"
                />
              </div>

              {!isUrlInput && (
                <>
                  <div className="flex-1 min-w-[140px] relative">
                    <select 
                      value={selectedCountry} onChange={(e) => {
                        setSelectedCountry(e.target.value);
                        setSelectedCity(globalLocations[e.target.value][0]);
                      }}
                      className="w-full h-10 px-3 bg-slate-50/50 dark:bg-slate-800/50 border border-transparent rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white outline-none appearance-none cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-all"
                    >
                      {Object.keys(globalLocations).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="flex-1 min-w-[140px] relative">
                    <select 
                      value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full h-10 px-3 bg-slate-50/50 dark:bg-slate-800/50 border border-transparent rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white outline-none appearance-none cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-all"
                    >
                      {globalLocations[selectedCountry].map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                  </div>

                  <div className="flex-1 min-w-[140px] relative">
                    <select 
                      value={selectedSector} onChange={(e) => setSelectedSector(e.target.value)}
                      className="w-full h-10 px-3 bg-slate-50/50 dark:bg-slate-800/50 border border-transparent rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white outline-none appearance-none cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-all"
                    >
                      {sectors.map(s => <option key={s.id} value={s.label}>{s.label}</option>)}
                    </select>
                  </div>

                  <div className="w-[120px] relative">
                    <select 
                      value={searchLimit} onChange={(e) => setSearchLimit(Number(e.target.value))}
                      className="w-full h-10 px-3 bg-slate-50/50 dark:bg-slate-800/50 border border-transparent rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-600 outline-none appearance-none cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-all"
                    >
                      {limits.map(l => <option key={l} value={l}>{l} FİRMA</option>)}
                    </select>
                  </div>
                </>
              )}

              <button 
                onClick={startAnalysis} 
                disabled={status !== AppStatus.IDLE}
                className="h-10 px-5 bg-[#0f172a] dark:bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.1em] hover:bg-blue-600 dark:hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {t.deepAnalysis}
              </button>
            </div>

            {isUrlInput && (
              <div className="flex items-center gap-2 w-full animate-fade-in px-2 pb-1">
                <div className="text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg border border-blue-100 dark:border-blue-800">
                  {t.allFirmsAnalyzed}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 px-2 shrink-0 items-center">
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab('search')} 
                className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'search' ? 'bg-[#0f172a] text-white shadow-md' : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-300'}`}
              >
                {t.liveIntelligence}
              </button>
              <button 
                onClick={() => setActiveTab('library')} 
                className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'library' ? 'bg-[#0f172a] text-white shadow-md' : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-300'}`}
              >
                {t.dataLibrary}
              </button>
            </div>

            {filter && (
              <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full border border-blue-100 dark:border-blue-800 animate-fade-in">
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{t.filter}</span>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-300 uppercase">{filter.value}</span>
                <button 
                  onClick={() => setFilter(null)}
                  className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 hover:bg-red-500 hover:text-white transition-all text-xs"
                >
                  &times;
                </button>
              </div>
            )}
          </div>

          {/* Results Area */}
          <div className="flex-1 bg-white/50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-50/50 dark:border-slate-800/50 overflow-hidden flex flex-col mb-4">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {activeTab === 'search' ? (
                <>
                  {participants.length === 0 && status === AppStatus.IDLE ? (
                    <div className="h-full py-40 flex flex-col items-center justify-center opacity-30 gap-4">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-3xl grayscale">🔭</div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">{t.waitingData}</span>
                    </div>
                  ) : (
                    <DataTable 
                      participants={filteredParticipants} 
                      status={status} 
                      tokenBalance={tokenBalance} 
                      language={language}
                      onSelectParticipant={(p) => setSelectedParticipant(p)}
                      updateParticipant={(id, updates) => setParticipants(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))}
                      onExport={handleExport} 
                      onClear={() => setParticipants([])}
                      onStartAutomation={() => setIsWorkerOpen(true)}
                    />
                  )}
                </>
              ) : (
                <div className="h-full flex flex-col items-start justify-start p-8 gap-6">
                  <div className="w-full">
                    <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">{t.dashboard}</h2>
                    {participants.length === 0 ? (
                      <div className="h-64 flex flex-col items-center justify-center opacity-30 gap-4">
                        <div className="w-12 h-12 border-2 border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center">
                          <span className="text-slate-300 text-xl">📚</span>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">{t.emptyLibrary}</span>
                        <span className="text-[9px] text-slate-300 tracking-wider">{t.emptyLibraryDesc}</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {participants.map(p => (
                          <div key={p.id} onClick={() => setSelectedParticipant(p)} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-900 hover:shadow-md cursor-pointer transition-all flex items-center justify-between group">
                            <div>
                              <div className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-wider">{p.name}</div>
                              <div className="text-[10px] text-slate-400 mt-1">{p.location || p.industry || 'Firma Detayı'}</div>
                            </div>
                            <div className="text-slate-300 group-hover:text-blue-400 transition-colors">›</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Floating Global Assistant Button */}
          <button 
            onClick={() => setIsAssistantOpen(true)} 
            className="fixed bottom-6 right-6 z-[110] w-16 h-16 md:w-20 md:h-20 bg-emerald-500 text-white rounded-full flex flex-col items-center justify-center shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:scale-110 hover:bg-slate-900 transition-all active:scale-95 group"
          >
            <div className="absolute -inset-2 bg-emerald-400 rounded-full blur opacity-20 group-hover:opacity-40 animate-pulse"></div>
            <div className="text-2xl md:text-3xl relative z-10">🤖</div>
            <span className="text-[7px] font-black uppercase tracking-tighter mt-1 relative z-10">DV_ASSISTANT</span>
          </button>

          {/* User-Friendly Floating Progress Bar (Fixed at bottom) */}
          {status !== AppStatus.IDLE && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-[120] animate-fade-in">
              <div className="bg-[#0f172a]/95 backdrop-blur-2xl border border-blue-500/30 rounded-3xl p-5 flex items-center gap-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-xl shrink-0 animate-pulse shadow-lg shadow-blue-500/20">🧠</div>
                <div className="flex-1">
                   <div className="flex justify-between items-end mb-2.5">
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">{currentStep}</span>
                      <span className="text-[11px] font-black text-white">%{progressPercent}</span>
                   </div>
                   <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5">
                      <div className="h-full bg-blue-500 rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" style={{ width: `${progressPercent}%` }}></div>
                   </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  };

  return (
    <>
      {renderMainContent()}
      <IdentityModal isOpen={isIdentityModalOpen} onClose={() => setIsIdentityModalOpen(false)} user={user} onUpdate={(f) => setUser(prev => prev ? { ...prev, ...f } : null)} language={language} />
      <AutonomousWorker user={user} participants={participants} updateParticipant={(id, u) => setParticipants(prev => prev.map(p => p.id === id ? { ...p, ...u } : p))} updateUser={(u) => setUser(prev => prev ? { ...prev, ...u } : null)} isOpen={isWorkerOpen} onClose={() => setIsWorkerOpen(false)} onOpenIdentity={() => setIsIdentityModalOpen(true)} />
      <CompanyDetail 
        participant={selectedParticipant} 
        onClose={() => setSelectedParticipant(null)} 
        user={user} 
        updateParticipant={(id, u) => setParticipants(prev => prev.map(p => p.id === id ? { ...p, ...u } : p))} 
        onRegenerate={async (p: Participant) => {
          const intel = await findCompanyIntel(p.name, p.website, p.industry || selectedSector, user!);
          setParticipants(prev => prev.map(item => item.id === p.id ? { ...item, ...intel } : item));
          setSelectedParticipant(prev => (prev && prev.id === p.id) ? { ...prev, ...intel } as Participant : prev);
        }}
        onFilter={(type, value) => {
          setFilter({ type, value });
          setSelectedParticipant(null);
        }}
      />
      {isGmailOpen && <GmailCenter user={user} onClose={() => setIsGmailOpen(false)} participants={participants} updateParticipant={(id, u) => setParticipants(prev => prev.map(p => p.id === id ? { ...p, ...u } : p))} onOpenIdentity={() => setIsIdentityModalOpen(true)} onUpdateUser={(u) => setUser(prev => prev ? { ...prev, ...u } : null)} />}
      <DeepVeraAssistant user={user} isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} language={language} />
      <PaymentModal isOpen={isPaymentModalOpen} currentUser={user} onClose={() => setIsPaymentModalOpen(false)} onSuccess={(t) => setTokenBalance(b => b + t)} onUpgrade={() => {}} />
      {isAdminOpen && <AdminPanel currentUser={user} onClose={() => setIsAdminOpen(false)} />}
    </>
  );
};

export default App;
 
