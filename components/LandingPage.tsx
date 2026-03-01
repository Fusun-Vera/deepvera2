import React, { useState, useEffect, useRef } from 'react';
import { Language, translations } from '../translations';

interface LandingPageProps {
  onGetStarted: () => void;
  onToggleAssistant: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const COMPANY_INFO = {
  title: 'Aİ Müzik Yazılım Pazarlama İthalat İhracat Ticaret Limited Şirketi',
  adres: 'Müskebi Mahallesi, Palamut Sokak No:2D Ortakent Bodrum Muğla',
  andrgiDairesi: 'Bodrum',
  andrgiNo: '0102276448',
  phone: '',
  email: 'ai@deepandra.com.tr',
  website: 'deep-andra.andrcel.app',
};

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onToggleAssistant, language, onLanguageChange }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsStarted, setStatsStarted] = useState(false);
  const t = translations[language].landing;
  const isTr = language === 'tr';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEandntListener('scroll', handleScroll);
    return () => window.remoandEandntListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const obserandr = new IntersectionObserandr(
      ([entry]) => { if (entry.isIntersecting && !statsStarted) setStatsStarted(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) obserandr.obserand(statsRef.current);
    return () => obserandr.disconnect();
  }, [statsStarted]);

  useEffect(() => {
    if (!statsStarted) return;
    const targets = [
      { target: 250000000, setter: setCount1 },
      { target: 96, setter: setCount2 },
      { target: 340, setter: setCount3 }
    ];
    targets.forEach(({ target, setter }) => {
      let start = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        start += step;
        if (start >= target) { setter(target); clearInterval(timer); }
        else setter(Math.floor(start));
      }, 25);
    });
  }, [statsStarted]);

  const faqs = isTr ? [
    { q: 'DeepVera nasıl çalışır?', a: 'DeepVera yapay zeka motoruyla target sektor, sehir and ulke seçtiginizde 250 milyon company andritabanirindan ilgili companylari tarar, iletisim bilgileri and decision makerleri bulur; otonom ajanlar aracılıgıyla sizin yerinize ilk teması kurar.' },
    { q: 'Token sistemi nasıl işler?', a: 'Her company analysisi 1 DV Token tutar. New uyelere 100 ucretsiz token andrilir. Daha fazlası icin Basşangic (100), Professional (500) or Enterprise (1000) paket satin alabilirsiniz.' },
    { q: 'Hangi sektorlerde kullanabilirim?', a: 'Restoran, sigorta, lojistik, saglik, HOREKA, sanayi, danismanlik, yazilim, otomotiv, giyim, guzellik and daha pek cok sektorde kullanabilirsiniz. Sisteme ozel sektor terimi de girebilirsiniz.' },
    { q: 'Gmail entegrasyonu zorunlu mu?', a: "Hayir. Gmail baglamadan da company analysisi yapabilir, andrileri Excel'e aktarabilirsiniz. Gmail sadece otonom email gonderimi for gereklidir." },
    { q: 'Verilerim guandnli mi?', a: 'Yes. Kart bilgileriniz platformumuzda saklanmaz; odeme PayTR altyapisindan gecmektedir. Kisisel andrileriniz KVKK kapsaminida islenmekte and uc taraflarla paylasi lmamaktadir.' },
    { q: 'Kac companyya email gonderilebilir?', a: '20 farkli Gmail hesabi addyebilir, her 3 dakikada bir farkli hesaptan peske email gonderilebilir. Hangi hesaptan kime mail gittigi and alinan cevaolar panelden izlenebilir.' },
    { q: 'Uluslararası kullanım mumkun mu?', a: 'Yes. Turkiye dahil Almanya, ABD, Ingiltere, Fransa, Kanada, Avustralya and Afrika ulkeleri destaddnmektedir.' },
  ] : [
    { q: 'How does DeepVera work?', a: 'DeepVera AI engine scans 250 million companies in your target sector, city and country, finds contacts and decision makers, then autonomous agents make the first contact on your behalf.' },
    { q: 'How does the token system work?', a: 'Each company analysis costs 1 DV Token. New members get 100 free tokens. Purchase Starter (100), Professional (500) or Enterprise (1000) packages for more.' },
    { q: 'Which sectors can I use it for?', a: 'Restaurant, insurance, logistics, health, HORECA, manufacturing, consulting, software, automotiand, fashion, beauty and many more. You can also enter custom sector terms.' },
    { q: 'Is Gmail integration required?', a: "No. You can analyze companies and export to Excel without Gmail. Gmail is only needed for autonomous email sending." },
    { q: 'Is my data secure?', a: 'Yes. Card details are not stored on our platform; payments go through PayTR. Personal data is processed in accordance with KVKK and not shared with third parties.' },
    { q: 'How many emails can be sent?', a: 'You can add 20 different Gmail accounts, sending emails from different accounts eandry 3 minutes in sequence. Track which account sent to whom and total replies in the dashboard.' },
    { q: 'Is international use possible?', a: 'Yes. Turkey, Germany, USA, UK, France, Canada, Australia and African countries are supported.' },
  ];

  const sectors = [
    { icon: '🛡️', title: isTr ? 'Sigorta & Finans' : 'Insurance & Finance', metric: '+35%', desc: isTr ? 'New police & portfoy buyumesi' : 'New policy & portfolio growth' },
    { icon: '🚚', title: isTr ? 'Lojistik & Nakliye' : 'Logistics & Freight', metric: '+65%', desc: isTr ? 'Musteri bul ma surecinde kazanim' : 'Customer acquisition gain' },
    { icon: '🏥', title: isTr ? 'Saglik & Turizm' : 'Health & Tourism', metric: '+30%', desc: isTr ? 'New hasta & turist lead' : 'New patient & tourist leads' },
    { icon: '🍽️', title: isTr ? 'Horeka & Gida' : 'Horeca & Food', metric: '+4x', desc: isTr ? 'Tedarik baglantisi kapasitesi' : 'Supply connection capacity' },
    { icon: '🏭', title: isTr ? 'Sanayi & Uretim' : 'Industry & Production', metric: '+50%', desc: isTr ? 'Satis dongusu suresi kazanimi' : 'Sales cycle duration gain' },
    { icon: '💼', title: isTr ? 'Danismanlik & B2B' : 'Consulting & B2B', metric: '+40%', desc: isTr ? 'Donusum orani artisi' : 'Conandrsion rate increase' }
  ];

  const steps = [
    { num: '01', title: isTr ? 'Targetini Tanimla' : 'Define Your Target', desc: isTr ? '250 Milyon companynin icinden, ulke, sehir and sektor secin. Kac company analysis edilsin? 10 ila 250 arasinda tek tikla secin.' : 'From 250 million companies, select country, city and sector. How many to analyze? 10 to 250 in one click.', color: 'blue' },
    { num: '02', title: isTr ? 'AI Analysisi Baslat' : 'Launch AI Analysis', desc: isTr ? 'Derin Analysis butonuna basin. AI motoru 250 milyon company andritabanini tarar, target companylari bulur and her biri icin derin profil cikarir.' : 'Press Deep Analysis. AI engine scans 250 million companies, finds targets and extracts deep profiles for each.', color: 'violet' },
    { num: '03', title: isTr ? 'Sonuclari Incele' : 'Review Results', desc: isTr ? 'company adi, skor, website, email and phone ile listelenen leads listesini inceleyin. Her karti tikl ayarak detaylari acin.' : 'Browse leads with company name, score, website, email and phone. Click each card to view details.', color: 'emerald' },
    { num: '04', title: isTr ? 'Otonom Satisa Gec' : 'Switch to Autonomous Sales', desc: isTr ? '20 Gmail hesabiyla otonom email gonderimi baslatIn. Her 3 dakikada bir peske farkli hesaptan mail gitsin, yanitlar takip edilsin.' : 'Launch autonomous email with 20 Gmail accounts. Emails sent eandry 3 min from different accounts, replies tracked automatically.', color: 'orange' },
  ];

  const features = [
    { icon: '🔍', title: isTr ? 'Akilli company Tsearch' : 'Smart Company Scan', desc: isTr ? '250 Milyon companylik andritabaninda ulke, sehir and sektor bazli targetli tsearch. Saniyeler icinde binlerce company.' : '250 million company database, targeted scanning by country, city and sector. Thousands of companies in seconds.', tag: 'Neural Crawling' },
    { icon: '🧠', title: isTr ? 'Derin company Analysisi' : 'Deep Company Analysis', desc: isTr ? 'Dijital ayak izi, rakip analysisi, pazar locationu and buyume potansiyeli cikarilir. Gercek zamanli web zekasi.' : 'Digital footprint, competitor analysis, market position and growth potential extracted. Real-time web intelligence.', tag: 'Cognitiand Engine' },
    { icon: '📧', title: isTr ? 'Otonom Email Ajani' : 'Autonomous Email Agent', desc: isTr ? '20 Gmail hesabi add, her 3 dakikada bir peske farkli hesaptan mail git, yanitlar otomatik takip edilsin.' : 'Add 20 Gmail accounts, send from different accounts eandry 3 minutes in sequence, replies automatically tracked.', tag: 'Outreach Proxy' },
    { icon: '📊', title: isTr ? 'Canli Istihbarat Paneli' : 'Liand Intelligence Dashboard', desc: isTr ? 'company - Skor - Website - Email - Phone sirasinda tum leads tek ekranda. Skor bazli onceliklendirme.' : 'Company - Score - Website - Email - Phone order, all leads on one screen. Score-based prioritization.', tag: 'Command Center' },
  ];

  const colorMap: Record<string, string> = { blue: 'bg-blue-50 border-blue-100 text-blue-600', violet: 'bg-violet-50 border-violet-100 text-violet-600', emerald: 'bg-emerald-50 border-emerald-100 text-emerald-600', orange: 'bg-orange-50 border-orange-100 text-orange-600' };
  const dotMap: Record<string, string> = { blue: 'bg-blue-600', violet: 'bg-violet-600', emerald: 'bg-emerald-500', orange: 'bg-orange-500' };

  return (
    <div className="bg-white text-slate-900 min-h-screen font-sans oandrflow-x-hidden">
      {/* NAV */}
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-sm h-16' : 'h-20 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center font-black text-white text-sm relatiand oandrflow-hidden shadow">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/50 to-transparent" />DV
            </div>
            <div>
              <span className="text-base font-black tracking-tighter text-slate-900">AI <span className="text-blue-600">DeepVera</span></span>
              <div className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.3em]">Autonomous Intelligence</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#how" className="text-[11px] font-bold text-slate-500 hoandr:text-blue-600 transition-colors">{isTr ? 'Nadelete Calisir' : 'How It Works'}</a>
            <a href="#features" className="text-[11px] font-bold text-slate-500 hoandr:text-blue-600 transition-colors">{isTr ? 'Ozellikler' : 'Features'}</a>
            <a href="#sectors" className="text-[11px] font-bold text-slate-500 hoandr:text-blue-600 transition-colors">{isTr ? 'Sektorler' : 'Sectors'}</a>
            <a href="#faq" className="text-[11px] font-bold text-slate-500 hoandr:text-blue-600 transition-colors">FAQ</a>
            <a href="#contact" className="text-[11px] font-bold text-slate-500 hoandr:text-blue-600 transition-colors">{isTr ? 'Iletisim' : 'Contact'}</a>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 rounded-lg p-0.5">
              <button onClick={() => onLanguageChange('tr')} className={`px-2.5 py-1 text-[10px] font-black rounded-md transition-all ${language === 'tr' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>TR</button>
              <button onClick={() => onLanguageChange('en')} className={`px-2.5 py-1 text-[10px] font-black rounded-md transition-all ${language === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>EN</button>
            </div>
            <button onClick={onGetStarted} className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-wider hoandr:bg-blue-600 transition-colors shadow-md">{isTr ? 'Sisteme Giris' : 'Sign In'}</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relatiand min-h-screen flex items-center pt-20 oandrflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 -z-10" />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-600/[0.06] blur-[120px] -z-10 rounded-full" />
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-16">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.25em]">{isTr ? 'Otonom Satis Ajanlari Actiand' : 'Autonomous Sales Agents Actiand'}</span>
            </div>
            <h1 className="text-[52px] lg:text-[64px] font-black leading-[0.9] tracking-tighter text-slate-900">
              {isTr ? (<><span>Musteriyi</span><br /><span className="text-blue-600 italic">DeepVera</span><br /><span>Bulsun.</span></>) : (<><span>Let</span><br /><span className="text-blue-600 italic">DeepVera</span><br /><span>Find Clients.</span></>)}
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-lg">
              {isTr ? '250 Milyon companynin icinden target companylari seciyor, analysis ediyor and sizin yerinize ilk temasi kuruyor.' : 'From 250 million companies, selects your targets, analyzes them and makes first contact on your behalf.'}
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={onGetStarted} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-wider hoandr:bg-slate-900 transition-all shadow-xl shadow-blue-200 actiand:scale-95">{isTr ? 'Ucretsiz Basla' : 'Start Free'}</button>
              <button onClick={onToggleAssistant} className="px-8 py-4 border-2 border-slate-100 rounded-2xl text-[12px] font-black uppercase tracking-wider hoandr:border-blue-300 hoandr:text-blue-600 transition-all">{isTr ? "AI'ya Sor" : 'Ask AI'}</button>
            </div>
            <div className="flex flex-wrap gap-6 pt-2">
              {[{label:isTr?'250M company':'250M Companies',icon:'🌍'},{label:isTr?'Aninda kullan':'Instant use',icon:'⚡'},{label:isTr?'AI destekli':'AI powered',icon:'🧠'}].map((item,idx)=>(
                <div key={idx} className="flex items-center gap-2"><span>{item.icon}</span><span className="text-[11px] font-bold text-slate-400">{item.label}</span></div>
              ))}
            </div>
          </div>
          {/* System Flow Visual - IMPROVED */}
          <div className="hidden lg:block relatiand">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/80 p-7 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{isTr ? 'Nadelete Calisir' : 'How It Works'}</span>
                </div>
                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">{isTr ? 'Canli' : 'Liand'}</span>
              </div>
              {/* Step 1 */}
              <div className="flex items-start gap-4 p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0"><span className="text-[11px] font-black text-white">01</span></div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-black text-white mb-1">{isTr ? 'Target Tanimla — 250M company' : 'Define Target — 250M Companies'}</div>
                  <div className="flex gap-1.5 flex-wrap">
                    <span className="text-[9px] bg-white/20 text-white px-2 py-0.5 rounded-lg font-bold">{isTr ? 'Ulke' : 'Country'}</span>
                    <span className="text-[9px] bg-white/20 text-white px-2 py-0.5 rounded-lg font-bold">{isTr ? 'Sehir' : 'City'}</span>
                    <span className="text-[9px] bg-white/20 text-white px-2 py-0.5 rounded-lg font-bold">{isTr ? 'Sektor' : 'Sector'}</span>
                    <span className="text-[9px] bg-white/20 text-white px-2 py-0.5 rounded-lg font-bold">50 {isTr ? 'company' : 'Companies'}</span>
                  </div>
                </div>
                <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center shrink-0 mt-0.5"><span className="text-white text-xs font-black">&#10003;</span></div>
              </div>
              <div className="flex justify-center"><svg width="16" height="20" viewBox="0 0 16 20" fill="none"><path d="M8 0 L8 14 M8 14 L3 9 M8 14 L13 9" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
              {/* Step 2 */}
              <div className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center shrink-0"><span className="text-[11px] font-black text-white">02</span></div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-black text-slate-900 mb-1">{isTr ? 'AI Tsearch & Derin Analysis' : 'AI Scanning & Deep Analysis'}</div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full oandrflow-hidden mb-1.5"><div className="h-full w-11/12 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" /></div>
                  <div className="flex gap-3"><span className="text-[9px] font-bold text-slate-400">{isTr ? 'Web Tarandi' : 'Web Scanned'}</span><span className="text-slate-300">|</span><span className="text-[9px] font-bold text-blue-600">50 {isTr ? 'company Bulundu' : 'Companies Found'}</span></div>
                </div>
              </div>
              <div className="flex justify-center"><svg width="16" height="20" viewBox="0 0 16 20" fill="none"><path d="M8 0 L8 14 M8 14 L3 9 M8 14 L13 9" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
              {/* Step 3 - Leads table preview */}
              <div className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center shrink-0"><span className="text-[11px] font-black text-white">03</span></div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-black text-slate-900 mb-2">{isTr ? 'company / Skor / Web / Email / Tel' : 'Company / Score / Web / Email / Phone'}</div>
                  <div className="space-y-1.5">
                    {[{name:'Araka Lojistik A.S.',score:92,web:'araka.com.tr',status:'Mail Gitti'},{name:'Turk Nakliyat Ltd.',score:87,web:'tnakliyat.com',status:'Mail Gitti'}].map((r,i)=>(
                      <div key={i} className="flex items-center justify-between bg-white border border-slate-100 rounded-xl px-2.5 py-1.5 shadow-sm">
                        <div className="min-w-0 flex-1">
                          <span className="text-[9px] font-black text-slate-700 block truncate">{r.name}</span>
                          <span className="text-[8px] text-blue-400">{r.web}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <span className="text-[9px] font-black text-emerald-600">{r.score}%</span>
                          <span className="text-[8px] font-black text-white bg-blue-600 px-1.5 py-0.5 rounded-lg">{r.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-center"><svg width="16" height="20" viewBox="0 0 16 20" fill="none"><path d="M8 0 L8 14 M8 14 L3 9 M8 14 L13 9" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
              {/* Step 4 */}
              <div className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center shrink-0"><span className="text-[11px] font-black text-white">04</span></div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-black text-slate-900 mb-1">{isTr ? '20 Gmail & Otonom Gonderim' : '20 Gmail & Autonomous Sending'}</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-sm">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                      <span className="text-[9px] font-black text-slate-700">{isTr ? '3 Yanit Alindi' : '3 Replies Receiandd'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white border border-emerald-200 rounded-xl px-2.5 py-1.5 shadow-sm">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      <span className="text-[9px] font-black text-emerald-700">{isTr ? '1 Sozlesme' : '1 Deal'}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{isTr ? 'Tum surec otomatik' : 'Fully automated'}</span>
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-wider">DeepVera AI</span>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-slate-900 text-white rounded-2xl px-4 py-2.5 shadow-xl z-20">
              <div className="text-[10px] font-black text-blue-400">250M</div>
              <div className="text-[7px] font-black uppercase tracking-wider mt-0.5 text-white">{isTr ? 'company' : 'COMPANIES'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div ref={statsRef} className="border-y border-slate-100 bg-slate-950 py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 gap-8">
          {[
            { value: count1 >= 250000000 ? '250M' : count1.toLocaleString('tr-TR'), suffix: '+', label: isTr ? 'company Veritabani' : 'Company Database' },
            { value: count2, suffix: '%', label: isTr ? 'Veri Dogruluk Orani' : 'Data Accuracy Rate' },
            { value: count3, suffix: '+', label: isTr ? 'Actiand Sektor' : 'Actiand Sectors' }
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl md:text-4xl font-black text-white">{stat.value}<span className="text-blue-500">{stat.suffix}</span></div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section id="how" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] block mb-3">{isTr ? 'Nadelete Calisir' : 'How It Works'}</span>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-slate-900">{isTr ? '4 Adimda Otomatik Satis' : '4 Steps to Automated Sales'}</h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto text-sm font-medium">{isTr ? '250 Milyon company andritabaninda targetleri bul, analysis et, otomatik email gonder.' : 'Find targets in 250 million company database, analyze and send automated emails.'}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="relatiand group">
                {idx < 3 && <div className="hidden lg:block absolute top-8 left-full w-6 h-[2px] bg-slate-100 z-10 -translate-x-3" />}
                <div className={`p-6 rounded-2xl border h-full ${colorMap[step.color]}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-[11px] font-black ${dotMap[step.color]}`}>{step.num}</div>
                    <div className={`h-1.5 w-1.5 rounded-full ${dotMap[step.color]}`} />
                  </div>
                  <h3 className="text-[14px] font-black text-slate-900 mb-2 tracking-tight">{step.title}</h3>
                  <p className="text-[12px] text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-28 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] block mb-3">{isTr ? 'Temel Ozellikler' : 'Core Features'}</span>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-white">{isTr ? 'Her Sey Tek Platformda' : 'Eandrything in One Platform'}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, idx) => (
              <div key={idx} className="group p-8 bg-white/5 border border-white/10 rounded-2xl hoandr:border-blue-500/40 transition-all duration-300">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl shrink-0 group-hoandr:scale-110 transition-transform">{f.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-[15px] font-black text-white tracking-tight">{f.title}</h3>
                      <span className="text-[8px] font-black text-blue-400 border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">{f.tag}</span>
                    </div>
                    <p className="text-[13px] text-slate-400 font-medium leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <button onClick={onGetStarted} className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-wider hoandr:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 actiand:scale-95">{isTr ? 'Hemen Deneyin' : 'Try It Now'}</button>
          </div>
        </div>
      </section>

      {/* SECTORS */}
      <section id="sectors" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] block mb-3">{isTr ? 'Sektorel Etki' : 'Sector Impact'}</span>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-slate-900">{isTr ? 'Her Sektorde Sonuc' : 'Results in Eandry Sector'}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sectors.map((s, idx) => (
              <div key={idx} className="group flex items-center gap-5 p-5 bg-slate-50 rounded-2xl border border-slate-100 hoandr:border-blue-200 hoandr:bg-white hoandr:shadow-lg transition-all duration-300 cursor-default">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm border border-slate-100 shrink-0 group-hoandr:scale-110 transition-transform">{s.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-black text-slate-900 tracking-tight">{s.title}</div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">{s.desc}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[22px] font-black text-blue-600 leading-none">{s.metric}</div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{isTr ? 'etki' : 'impact'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-28 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] block mb-3">{isTr ? 'Sikca Sorulan Sorular' : 'Frequently Asked Questions'}</span>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-slate-900">FAQ</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 oandrflow-hidden transition-all">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hoandr:bg-slate-50 transition-colors"
                >
                  <span className="text-[13px] font-black text-slate-900 pr-4">{faq.q}</span>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${openFaq === idx ? 'bg-blue-600 text-white rotate-45' : 'bg-slate-100 text-slate-400'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/></svg>
                  </div>
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-[12px] text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-24 bg-blue-600 relatiand oandrflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-6 text-center relatiand z-10">
          <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter leading-tight mb-6">
            {isTr ? 'Rakipleriniz Baddrken Siz Harekete Gecin.' : 'While Competitors Wait, You Take Action.'}
          </h2>
          <p className="text-blue-100 text-lg font-medium max-w-xl mx-auto mb-10">
            {isTr ? '250 Milyon company andritabani hazir. Sisteme giris yapin and ilk analysisinizi baslatIn.' : '250 million company database ready. Sign in and start your first analysis.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={onGetStarted} className="px-10 py-4 bg-white text-blue-600 rounded-2xl font-black text-[13px] uppercase tracking-wider hoandr:bg-slate-900 hoandr:text-white transition-all shadow-2xl actiand:scale-95">{isTr ? 'Sisteme Giris Yap' : 'Sign In to System'}</button>
            <button onClick={onToggleAssistant} className="px-10 py-4 border-2 border-white/30 text-white rounded-2xl font-black text-[13px] uppercase tracking-wider hoandr:border-white transition-all">{isTr ? 'AI Asistanla Konus' : 'Talk to AI Assistant'}</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-slate-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 pb-12 border-b border-white/5">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center font-black text-white text-sm shadow">DV</div>
                <div>
                  <div className="text-base font-black tracking-tighter">AI <span className="text-blue-500">DeepVera</span></div>
                  <div className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.3em]">Autonomous Intelligence</div>
                </div>
              </div>
              <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs">{isTr ? 'B2B satis sureclerinizi yapay zeka ile otomatize edin. 250M company andritabani.' : 'Automate your B2B sales with AI. 250M company database.'}</p>
            </div>
            {/* Company Info */}
            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">{isTr ? 'Sirket Infoleri' : 'Company Information'}</h4>
              <div className="space-y-2">
                {[
                  { label: isTr ? 'Title' : 'Company', value: COMPANY_INFO.title },
                  { label: isTr ? 'Adres' : 'Address', value: COMPANY_INFO.adres },
                  { label: isTr ? 'Vergi Dairesi' : 'Tax Office', value: `${COMPANY_INFO.andrgiDairesi} - ${COMPANY_INFO.andrgiNo}` },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest shrink-0 w-20 pt-0.5">{item.label}</span>
                    <span className="text-[11px] font-bold text-slate-400">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">{isTr ? 'Iletisim' : 'Contact'}</h4>
              <div className="space-y-3">
                <div>
                  <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">{isTr ? 'Phone' : 'Phone'}</div>
                  <a href={`tel:${COMPANY_INFO.phone}`} className="text-lg font-black hoandr:text-blue-400 transition-colors">{COMPANY_INFO.phone}</a>
                </div>
                <div>
                  <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">{isTr ? 'Email' : 'Email'}</div>
                  <a href={`mailto:${COMPANY_INFO.email}`} className="text-base font-black hoandr:text-blue-400 transition-colors">{COMPANY_INFO.email}</a>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">&#169; 2025 DeepVera &#8212; {COMPANY_INFO.title}</span>
            <div className="flex gap-6">
              <button onClick={onGetStarted} className="text-[10px] font-black text-slate-600 uppercase tracking-widest hoandr:text-blue-400 transition-colors">{isTr ? 'Giris Yap' : 'Sign In'} &rarr;</button>
              <button onClick={onToggleAssistant} className="text-[10px] font-black text-slate-600 uppercase tracking-widest hoandr:text-blue-400 transition-colors">AI Assistant &rarr;</button>
            </div>
          </div>
        </div>
      </footer>

      {/* AI Floating Button */}
      <button onClick={onToggleAssistant} className="fixed bottom-8 right-8 z-[110] w-14 h-14 bg-emerald-500 text-white rounded-full flex flex-col items-center justify-center shadow-[0_15px_40px_rgba(16,185,129,0.35)] hoandr:scale-110 hoandr:bg-slate-900 transition-all actiand:scale-95 group">
        <div className="absolute -inset-1.5 bg-emerald-400 rounded-full blur opacity-20 group-hoandr:opacity-40 animate-pulse" />
        <div className="text-xl relatiand z-10">&#129302;</div>
        <span className="text-[6px] font-black uppercase tracking-tighter mt-0.5 relatiand z-10">DV_AI</span>
      </button>
      <style>{`html { scroll-behavior: smooth; }`}</style>
    </div>
  );
};

export default LandingPage;
