import React, { useState } from 'react';

const PAYMENTS_KEY = 'deepvera_payment_history';

interface Props {
  isOpen: boolean;
  isPro?: boolean;
  currentUser?: any;
  onClose: () => void;
  onSuccess: (tokens: number) => void;
  onUpgrade: () => void;
}

const tokenPackages = [
  { id: '1', name: 'Başlangıç', tokens: 100, price: 299, priceLabel: '299 TL', perToken: '2.99 TL / kredi', color: 'slate', badge: null, desc: 'Küçük çaplı analizler için ideal başlangıç noktası', features: ['100 Derin Firma Analizi', 'Firma Profili & Contact', 'Email & Phone Number Bilgisi', 'Excel Dışa Aktarım'] },
  { id: '2', name: 'Profesyonel', tokens: 500, price: 1299, priceLabel: '1.299 TL', perToken: '2.60 TL / kredi', color: 'blue', badge: 'En Popüler', desc: 'Active satış ekipleri için en çok tercih edilen paket', features: ['500 Derin Firma Analizi', 'Gelişmiş Firma Profili', 'Sosyal Medya Analizi', 'Rakip & Pazar Analizi', 'Otonom Email Sendimi', 'Excel Dışa Aktarım'] },
  { id: '3', name: 'Kurumsal', tokens: 1000, price: 1999, priceLabel: '1.999 TL', perToken: '2.00 TL / kredi', color: 'violet', badge: 'En Avantajlı', desc: 'Büyük operasyonlar için maksimum kapasite ve tasarruf', features: ['1000 Derin Firma Analizi', 'Tam Zeka Profili', 'Sosyal & Dijital Analiz', 'Rakip Haritası', 'Otonom Email + Otomatik Takip', 'Öncelikli Destek', 'Excel Dışa Aktarım'] },
];

const colorMap: Record<string, { ring: string; bg: string; btn: string; text: string; badge: string; check: string; accent: string }> = {
  slate: { ring: 'ring-slate-400', bg: 'bg-slate-50', btn: 'bg-slate-800 hover:bg-slate-700 text-white', text: 'text-slate-700', badge: 'bg-slate-700 text-white', check: 'text-slate-500', accent: 'border-slate-400' },
  blue:  { ring: 'ring-blue-500',  bg: 'bg-blue-50',  btn: 'bg-blue-600 hover:bg-blue-700 text-white',   text: 'text-blue-700',  badge: 'bg-blue-600 text-white',  check: 'text-blue-500',  accent: 'border-blue-500' },
  violet:{ ring: 'ring-violet-500',bg: 'bg-violet-50',btn: 'bg-violet-600 hover:bg-violet-700 text-white',text: 'text-violet-700',badge: 'bg-violet-600 text-white',check: 'text-violet-500',accent: 'border-violet-500' },
};

type Step = 'select' | 'paying';

const PaymentModal: React.FC<Props> = ({ isOpen, currentUser, onClose, onSuccess }) => {
  const [selectedPkg, setSelectedPkg] = useState(tokenPackages[1]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>('select');
  const [paytrToken, setPaytrToken] = useState<string>('');
  const [pendingMerchantOid, setPendingMerchantOid] = useState<string>('');
  const [pendingTokens, setPendingTokens] = useState<number>(0);
  const [paytrError, setPaytrError] = useState<string>('');

  if (!isOpen) return null;

  const handleIframeMessage = (event: MessageEvent) => {
    if (event.origin !== 'https://www.paytr.com') return;
    try {
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      if (data.status === 'success') {
        const rec = { id: pendingMerchantOid || Math.random().toString(36).substr(2,9), userId: (currentUser?.id || currentUser?.username) || 'unknown', packageName: selectedPkg.name, tokens: pendingTokens, amount: selectedPkg.price, date: new Date().toISOString() };
        const existing = localStorage.getItem(PAYMENTS_KEY);
        const arr = existing ? JSON.parse(existing) : [];
        arr.push(rec);
        localStorage.setItem(PAYMENTS_KEY, JSON.stringify(arr));
        window.removeEventListener('message', handleIframeMessage);
        setPaytrToken('');
        setStep('select');
        onSuccess(pendingTokens);
        onClose();
      } else if (data.status === 'failed') {
        setPaytrError('Payment başarısız. Lütfen tekrar deneyin.');
        setPaytrToken('');
        setStep('select');
        window.removeEventListener('message', handleIframeMessage);
      }
    } catch (e) {}
  };

  const handlePurchase = async () => {
    setLoading(true);
    setPaytrError('');
    try {
      const response = await fetch('/api/paytr-get-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: selectedPkg.price.toString(), userId: currentUser?.id || currentUser?.username || 'unknown', userEmail: currentUser?.email || 'musteri@deepvera.com.tr', userName: currentUser?.name || currentUser?.username || 'DeepVera Kullanici', packageName: selectedPkg.name, tokens: selectedPkg.tokens }),
      });
      const data = await response.json();
      if (data.status === 'success' && data.token) {
        setPendingMerchantOid(data.merchant_oid || '');
        setPendingTokens(data.tokens || selectedPkg.tokens);
        setPaytrToken(data.token);
        setStep('paying');
        window.addEventListener('message', handleIframeMessage);
      } else {
        setPaytrError(data.reason || 'Payment başlatılırken hata oluştu.');
      }
    } catch (error) {
      setPaytrError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSelect = () => {
    window.removeEventListener('message', handleIframeMessage);
    setPaytrToken('');
    setStep('select');
    setPaytrError('');
  };

  // ---- PAYTR ÖDEME EKRANI ----
  if (step === 'paying') {
    return (
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
        <div className="bg-white w-full rounded-2xl shadow-2xl flex flex-col" style={{ maxWidth: 560, width: '100%', height: 'min(92vh, 780px)', display: 'flex', flexDirection: 'column' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 bg-emerald-600 rounded-t-2xl shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              </div>
              <div>
                <h2 className="text-sm font-black text-white">Güvenli Payment</h2>
                <p className="text-[9px] text-emerald-100 font-bold uppercase tracking-widest">256-bit SSL • PayTR • {selectedPkg.name} • {selectedPkg.priceLabel}</p>
              </div>
            </div>
            <button onClick={handleBackToSelect} className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all">
              ← Geri
            </button>
          </div>

          {/* PayTR iframe - scrollable wrapper with fixed pixel height */}
          <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
            <iframe
              src={`https://www.paytr.com/odeme/guvenli/${paytrToken}`}
              id="paytriframe"
              frameBorder={0}
              scrolling="yes"
              style={{ width: '100%', height: '100%', display: 'block', border: 'none' }}
              title="PayTR Güvenli Payment"
            />
          </div>

          {/* Footer note */}
          <div className="px-4 py-2 bg-slate-50 rounded-b-2xl border-t border-slate-100 shrink-0">
            <p className="text-[9px] text-center text-slate-400">Kart bilgileriniz PayTR güvenli altyapısı ile korunmaktadır. DeepVera kart bilgilerinize erişemez.</p>
          </div>
        </div>
      </div>
    );
  }

  // ---- PAKET SEÇİM EKRANI ----
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ maxWidth: 860, maxHeight: '92vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[18px] font-black text-white tracking-tight">DeepVera Analiz Kredisi</h2>
                <span className="px-2 py-0.5 bg-blue-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full">YENİ</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Anında yükleme • Güvenli ödeme • Invoice kesilir • KDV dahil</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center justify-center transition-all text-xl shrink-0">&times;</button>
        </div>

        {/* Body - flex row */}
        <div className="flex flex-1 overflow-hidden">

          {/* LEFT: packages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Analiz Kredi Paketi Seçin</p>
            {tokenPackages.map(pkg => {
              const c = colorMap[pkg.color];
              const isSel = selectedPkg.id === pkg.id;
              return (
                <button key={pkg.id} onClick={() => setSelectedPkg(pkg)}
                  className={`relative w-full text-left rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
                    isSel ? 'border-transparent ring-2 ' + c.ring + ' ' + c.bg + ' shadow-md' : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
                  }`}>
                  <div className="flex items-center gap-4 p-4">
                    <div className="shrink-0 text-center w-20">
                      <div className={`text-[26px] font-black leading-none ${isSel ? c.text : 'text-slate-900'}`}>{pkg.tokens}</div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Kredi</div>
                    </div>
                    <div className={`w-px h-12 shrink-0 border-l ${isSel ? c.accent : 'border-slate-100'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[13px] font-black ${isSel ? c.text : 'text-slate-800'}`}>{pkg.name}</span>
                        {pkg.badge && <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-full ${c.badge}`}>{pkg.badge}</span>}
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed">{pkg.desc}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className={`text-[20px] font-black leading-none ${isSel ? c.text : 'text-slate-900'}`}>{pkg.priceLabel}</div>
                      <div className="text-[9px] text-slate-400">{pkg.perToken}</div>
                    </div>
                    <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center border-2 transition-all ${isSel ? c.btn.split(' ')[0] + ' border-transparent' : 'border-slate-200 bg-white'}`}>
                      {isSel && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>}
                    </div>
                  </div>
                  {isSel && (
                    <div className="px-4 pb-3 flex flex-wrap gap-1.5">
                      {pkg.features.map((f, i) => (
                        <span key={i} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${c.bg} ${c.text} border ${c.accent}`}>
                          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>{f}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* RIGHT: summary + buy */}
          <div className="w-72 shrink-0 border-l border-slate-100 bg-slate-50 flex flex-col" style={{ padding: '20px', gap: '16px' }}>

            {/* Summary card */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Seçilen Paket</p>
              <div className={`text-[15px] font-black ${colorMap[selectedPkg.color].text} mb-0.5`}>{selectedPkg.name}</div>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[28px] font-black text-slate-900">{selectedPkg.tokens}</span>
                  <span className="text-[11px] font-bold text-slate-400 ml-1">Kredi</span>
                </div>
                <div className="text-right">
                  <div className="text-[20px] font-black text-slate-900">{selectedPkg.priceLabel}</div>
                  <div className="text-[9px] text-slate-400">KDV Dahil</div>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">{selectedPkg.desc}</p>
            </div>

            {/* Security badges */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { d: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', label: 'SSL Güvenli' },
                { d: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', label: 'PayTR' },
                { d: 'M13 10V3L4 14h7v7l9-11h-7z', label: 'Anında Kredi' },
                { d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', label: 'Invoice' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center justify-center gap-1 bg-white rounded-xl p-2.5 border border-slate-100">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.d}/></svg>
                  <span className="text-[8px] font-bold text-slate-500 text-center">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Error message */}
            {paytrError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span className="text-[10px] font-medium text-red-600">{paytrError}</span>
              </div>
            )}

            <div style={{ flex: 1 }} />

            {/* === ODEME BUTONU === */}
            <div>
              <button
                onClick={handlePurchase}
                disabled={loading}
                className={`w-full rounded-2xl font-black text-[15px] tracking-wide transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${colorMap[selectedPkg.color].btn}`}
                style={{ padding: '16px', minHeight: 60 }}
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    <span>Payment Hazırlanıyor...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                    <span>{selectedPkg.priceLabel} Öde &amp; Kredinizi Alın</span>
                  </>
                )}
              </button>
              <p className="text-[9px] text-center text-slate-400 mt-2">Güvenli ödeme • PayTR altyapısı • 256-bit SSL</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
