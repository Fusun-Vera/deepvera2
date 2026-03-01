
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState("");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-white text-slate-900 min-h-screen font-sans selection:bg-blue-100 selection:text-blue-700 overflow-x-hidden relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: `radial-gradient(#2563eb 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-3xl h-20 border-b border-slate-100 shadow-sm' : 'h-24 bg-transparent'}`}>
        <div className="container mx-auto px-6 lg:px-12 h-full flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-lg">
                <span className="relative z-10">DV</span>
             </div>
             <div className="flex flex-col leading-none text-left">
                <span className="text-xl font-black tracking-tighter uppercase text-slate-900">AI <span className="text-blue-600">DeepVera</span></span>
                <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1">Global Intelligence</span>
             </div>
          </div>
          <div className="flex items-center gap-10">
             <div className="hidden lg:flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <a href="#how-it-works" className="hover:text-blue-600 transition-colors">Süreç</a>
                <a href="#features" className="hover:text-blue-600 transition-colors">Yetenekler</a>
                <a href="#sectors" className="hover:text-blue-600 transition-colors">Sektörler</a>
             </div>
             <button onClick={onGetStarted} className="px-8 py-3 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl">Giriş Yap</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-48 pb-32 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-blue-50 border border-blue-100 rounded-full mb-10">
               <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
               <span className="text-[9px] font-black text-blue-600 uppercase tracking-[0.3em]">Yeni Nesil B2B Satış Otomasyonu</span>
            </div>
            
            <h1 className="text-6xl lg:text-[110px] font-black uppercase leading-[0.9] tracking-tighter mb-10 text-slate-900">
              Manuel Lead Aramayı <br/>
              <span className="text-blue-600 italic">Emekli Edin.</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-slate-500 font-medium leading-relaxed max-w-3xl mx-auto mb-16">
              DeepVera, hedefinizi tek bir URL veya sektör ile belirlediğinizde; otonom ajanlarıyla web'i tarar, karar vericileri bulur ve onlara özel reddedilemez teklifler hazırlar.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 w-full max-w-md mx-auto">
               <button onClick={onGetStarted} className="flex-1 px-12 py-6 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-900 transition-all shadow-2xl shadow-blue-200">
                  Sistemi Başlat
               </button>
               <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({behavior: 'smooth'})} className="flex-1 px-12 py-6 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-50 transition-all">
                  Nasıl Çalışır?
               </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Ribbon */}
      <div className="bg-slate-900 py-10 overflow-hidden relative border-y border-white/5">
         <div className="flex animate-marquee whitespace-nowrap gap-20 items-center">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex items-center gap-10">
                <span className="text-white/20 font-black text-3xl uppercase tracking-tighter">250M+ Kurumsal Veri</span>
                <span className="text-blue-500 font-black text-3xl uppercase tracking-tighter">Real-Time Search</span>
                <span className="text-white/20 font-black text-3xl uppercase tracking-tighter">AI Cold Outreach</span>
                <span className="text-emerald-500 font-black text-3xl uppercase tracking-tighter">98% Email Doğrulama</span>
              </div>
            ))}
         </div>
      </div>

      {/* How it Works - The Neural Journey */}
      <section id="how-it-works" className="py-32 bg-slate-50/50 relative">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-24">
             <span className="text-[11px] font-black text-blue-600 uppercase tracking-[0.4em] mb-4 block">Zeka Akış Şeması</span>
             <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter">DeepVera Nasıl <span className="text-blue-600">Düşünür?</span></h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
             <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-slate-200 -z-0"></div>
             
             {[
               { step: "01", title: "Hedef Tanımı", desc: "Bir fuar sitesi linki yapıştırın veya 'Antalya'daki Oteller' gibi bir komut verin.", icon: "🎯" },
               { step: "02", title: "Derin Tarama", desc: "AI ajanlarımız web sitelerini, sosyal ağları ve dijital ayak izlerini anında tarar.", icon: "🔍" },
               { step: "03", title: "İstihbarat", desc: "Karar vericinin ismi, e-postası ve firmanın rakiplerine kadar her şey listelenir.", icon: "🧠" },
               { step: "04", title: "Özel Teklif", desc: "AI, sizin firmanızla hedef firma arasında bağ kuran 1:1 özel teklif yazar.", icon: "✉️" }
             ].map((item, i) => (
               <div key={i} className="relative z-10 p-10 bg-white border border-slate-100 rounded-[3rem] shadow-xl hover:border-blue-500 transition-all group">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">{item.icon}</div>
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 block">{item.step} / ADIM</span>
                  <h3 className="text-xl font-black uppercase tracking-tight mb-4">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Features - Enriched Visual Showcase */}
      <section id="features" className="py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-10">
                 <div className="space-y-4">
                    <span className="text-[11px] font-black text-blue-600 uppercase tracking-[0.4em]">Derin Yetenekler</span>
                    <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-none">Sadece Bir Liste Değil, <br/><span className="text-blue-600">Satış Silahı.</span></h2>
                 </div>
                 
                 <div className="space-y-8">
                    <div className="flex gap-6 group cursor-default">
                       <div className="w-12 h-12 bg-slate-900 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-xl group-hover:bg-blue-600 transition-colors">🔥</div>
                       <div>
                          <h4 className="text-lg font-black uppercase tracking-tight mb-2 group-hover:text-blue-600 transition-colors">Buzkıran (Icebreaker) Motoru</h4>
                          <p className="text-slate-500 text-sm font-medium">Her aday için web sitesindeki verilere dayanarak kişiselleştirilmiş giriş cümleleri üretir.</p>
                       </div>
                    </div>
                    <div className="flex gap-6 group cursor-default">
                       <div className="w-12 h-12 bg-slate-900 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-xl group-hover:bg-blue-600 transition-colors">⚔️</div>
                       <div>
                          <h4 className="text-lg font-black uppercase tracking-tight mb-2 group-hover:text-blue-600 transition-colors">Rakip İstihbaratı</h4>
                          <p className="text-slate-500 text-sm font-medium">Hedef firmanın rakiplerini analiz ederek teklif stratejinizi otomatik olarak optimize eder.</p>
                       </div>
                    </div>
                    <div className="flex gap-6 group cursor-default">
                       <div className="w-12 h-12 bg-slate-900 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-xl group-hover:bg-blue-600 transition-colors">🚀</div>
                       <div>
                          <h4 className="text-lg font-black uppercase tracking-tight mb-2 group-hover:text-blue-600 transition-colors">Otonom Pilot Entegrasyonu</h4>
                          <p className="text-slate-500 text-sm font-medium">n8n ve Webhook desteği ile bulunan verileri otomatik olarak CRM veya mail sisteminize aktarır.</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* RICH ENHANCED VISUAL MOCKUP AREA */}
              <div className="relative group">
                 <div className="absolute -inset-20 bg-blue-600/10 blur-[120px] rounded-full group-hover:bg-blue-600/20 transition-all duration-1000"></div>
                 
                 <div className="relative bg-[#0a0c10] rounded-[4rem] p-8 lg:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden min-h-[620px] flex flex-col">
                    {/* Background Tech Grid */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none" 
                         style={{ backgroundImage: `linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)`, backgroundSize: '30px 30px' }}></div>
                    
                    {/* Top Status Bar */}
                    <div className="relative z-10 flex justify-between items-center mb-10">
                       <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                          <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                          <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                       </div>
                       <div className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                          <span className="text-[8px] font-black text-blue-400 uppercase tracking-[0.3em] animate-pulse">Neural System Active</span>
                       </div>
                    </div>

                    {/* Floating Lead Card (Glassmorphism) */}
                    <div className="relative z-20 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl transform hover:-translate-y-2 transition-transform duration-500 group-hover:border-blue-500/30">
                       <div className="absolute inset-0 scan-line opacity-20 rounded-[2.5rem]"></div>
                       
                       <div className="flex items-center gap-6 mb-8">
                          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(37,99,235,0.4)]">🏢</div>
                          <div className="space-y-2">
                             <div className="h-4 w-48 bg-white/20 rounded-full overflow-hidden relative">
                                <div className="absolute inset-0 bg-blue-400/40 w-1/2 animate-[shimmer_2s_infinite]"></div>
                             </div>
                             <div className="h-2 w-32 bg-white/10 rounded-full"></div>
                          </div>
                          <div className="ml-auto w-10 h-10 border border-emerald-500/30 rounded-full flex items-center justify-center">
                             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                          </div>
                       </div>

                       <div className="space-y-6">
                          <div className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl">
                             <label className="text-[7px] font-black text-blue-400 uppercase tracking-widest block mb-2">Generated Icebreaker</label>
                             <p className="text-[11px] text-white/70 italic leading-relaxed">
                                "Geçen ay yayınladığınız sürdürülebilirlik raporundaki vizyonunuz, bizim enerji optimizasyon çözümlerimizle tam olarak örtüşüyor..."
                             </p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                             <div className="h-14 bg-white/[0.03] border border-white/5 rounded-2xl flex flex-col justify-center px-4">
                                <span className="text-[6px] text-white/30 font-black uppercase">Decision Maker</span>
                                <span className="text-[10px] text-white font-bold mt-1">CEO / Founder</span>
                             </div>
                             <div className="h-14 bg-blue-600 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
                                <span className="text-lg">✉️</span>
                                <span className="text-[8px] font-black text-white uppercase tracking-widest">Send Pitch</span>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Terminal Flow - Bottom Section */}
                    <div className="mt-auto relative z-10 pt-10">
                       <div className="bg-black/40 border border-white/5 rounded-3xl p-6 font-mono text-[9px] space-y-2 overflow-hidden h-[180px]">
                          <div className="text-blue-400/80">$ deepvera intelligence --start-scan</div>
                          <div className="text-white/40">{">"} Target: [Global Logistics Forum 2025]</div>
                          <div className="text-white/40">{">"} Neural Agent [Alpha] deployed...</div>
                          <div className="text-emerald-400/80">{">"} Found 142 valid corporate entities.</div>
                          <div className="text-white/40">{">"} Scraping decision maker metadata...</div>
                          <div className="text-amber-400/80 animate-pulse">{">"} High Probability Match: CEO identified.</div>
                          <div className="text-blue-400/80">{">"} Drafting personalized value proposition...</div>
                          <div className="text-white/20">{">"} Bypassing generic filters [SUCCESS]</div>
                          <div className="text-emerald-400/80">{">"} Operation COMPLETED. Credits: -1</div>
                       </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full"></div>
                    <div className="absolute top-1/2 left-0 w-px h-64 bg-gradient-to-b from-transparent via-blue-500/50 to-transparent"></div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Industry Solutions */}
      <section id="sectors" className="py-32 bg-slate-50/50">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <span className="text-[11px] font-black text-blue-600 uppercase tracking-[0.4em] mb-4 block">Sektörel Uygulamalar</span>
          <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter mb-24">Kimler İçin <span className="text-blue-600">İdeal?</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { title: "B2B Hizmet & Yazılım", desc: "Potansiyel kurumsal müşterileri bulup yazılım veya danışmanlık hizmetlerinizi pazarlayın.", icon: "💎" },
               { title: "İhracatçılar", desc: "Hedef ülkedeki ithalatçıları, distribütörleri ve perakende zincirlerini saniyeler içinde haritalayın.", icon: "🌍" },
               { title: "Fuar Katılımcıları", desc: "Fuara katılan firmaları listeleyin ve fuar öncesi/sonrası özel randevu e-postaları kurgulayın.", icon: "🎪" }
             ].map((item, i) => (
               <div key={i} className="p-12 bg-white rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2">
                  <div className="text-5xl mb-10">{item.icon}</div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-6">{item.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-40 relative overflow-hidden">
         <div className="absolute inset-0 bg-blue-600 z-0"></div>
         <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
            <h2 className="text-5xl lg:text-[100px] font-black text-white uppercase tracking-tighter leading-[0.9] mb-16">
               Veriyi Güce, <br/> Gücü Satışa Dönüştürün.
            </h2>
            <button onClick={onGetStarted} className="px-20 py-8 bg-white text-blue-600 rounded-[2.5rem] font-black text-xl uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-900 hover:text-white transition-all">
               Hemen Ücretsiz Dene
            </button>
            <p className="text-white/60 font-bold uppercase tracking-widest mt-12">Kredi kartı gerekmez • 1500 Ücretsiz Token Hediye</p>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-100 bg-white">
         <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black">DV</div>
               <span className="text-lg font-black uppercase tracking-tighter">AI DeepVera</span>
            </div>
            <div className="flex gap-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">
               <a href="#" className="hover:text-blue-600">Kullanım Şartları</a>
               <a href="#" className="hover:text-blue-600">Gizlilik Politikası</a>
               <a href="#" className="hover:text-blue-600">İletişim</a>
            </div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">© 2025 DEEPVERA INTEL SYSTEM</p>
         </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: 200%;
          animation: marquee 30s linear infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
};

export default LandingPage;
