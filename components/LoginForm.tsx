import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Language, translations } from '../translations';
import LegalPages from './LegalPages';

const USERS_DB_KEY = 'deepvera_users_database';
const GOOGLE_CLIENT_ID = '622487947070-dtn0iqveim78kor9l4ljthsimmtndl4l.apps.googleusercontent.com';

interface LoginFormProps {
  onLogin: (user: User, remember: boolean) => void;
  onCancel: () => void;
  language: Language;
}

// GSI script'ini dinamik olarak yukle
const loadGoogleGSI = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Zaten yukluyse direkt resolve
    if ((window as any).google?.accounts?.oauth2) {
      resolve();
      return;
    }
    // Mevcut script tag varsa bekle
    const existing = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
    if (existing) {
      const checkReady = setInterval(() => {
        if ((window as any).google?.accounts?.oauth2) {
          clearInterval(checkReady);
          resolve();
        }
      }, 100);
      setTimeout(() => { clearInterval(checkReady); reject(new Error('GSI timeout')); }, 10000);
      return;
    }
    // Yoksa yeni script olustur
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = () => {
      const checkReady = setInterval(() => {
        if ((window as any).google?.accounts?.oauth2) {
          clearInterval(checkReady);
          resolve();
        }
      }, 100);
      setTimeout(() => { clearInterval(checkReady); reject(new Error('GSI not initialized')); }, 5000);
    };
    script.onerror = () => reject(new Error('GSI script failed to load'));
    document.head.appendChild(script);
  });
};

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onCancel, language }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'error' | 'success' | 'warning' | 'info' } | null>(null);
  const [gsiReady, setGsiReady] = useState(false);
  const [legalPage, setLegalPage] = useState<'kvk' | 'terms' | 'membership' | 'company' | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const t = translations[language].login;
  const isTr = language === 'tr';

  const [formData, setFormData] = useState({ username: '', password: '', email: '', name: '' });

  // GSI hazirligini kontrol et
  useEffect(() => {
    loadGoogleGSI()
      .then(() => setGsiReady(true))
      .catch(() => setGsiReady(false));
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setStatusMsg(null);
    try {
      // GSI hazir degilse yukle
      if (!gsiReady) {
        setStatusMsg({ text: isTr ? 'Google API yukleniyor, lutfen bekleyin...' : 'Loading Google API...', type: 'info' });
        await loadGoogleGSI().catch(() => { throw new Error('GSI Not Loaded'); });
        setGsiReady(true);
        setStatusMsg(null);
      }

      const google = (window as any).google;
      if (!google?.accounts?.oauth2) throw new Error('GSI Not Loaded - OAuth2 missing');

      const client = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: [
          'https://www.googleapis.com/auth/gmail.readonly',
          'https://www.googleapis.com/auth/gmail.send',
          'https://www.googleapis.com/auth/gmail.modify',
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email'
        ].join(' '),
        callback: (response: any) => {
          if (response.error) {
            setLoading(false);
            if (response.error === 'access_denied') {
              setStatusMsg({ text: isTr ? 'Google erisim izni reddedildi. Lutfen "Izin Ver" butonuna basin.' : 'Google access denied. Please click Allow.', type: 'error' });
            } else if (response.error === 'popup_closed_by_user') {
              setStatusMsg({ text: isTr ? 'Giris penceresi kapatildi. Tekrar deneyin.' : 'Login window was closed. Please try again.', type: 'warning' });
            } else {
              setStatusMsg({ text: isTr ? 'Google giris hatasi: ' + response.error : 'Google login error: ' + response.error, type: 'error' });
            }
            return;
          }

          fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: 'Bearer ' + response.access_token },
          })
            .then((res) => res.json())
            .then((profile) => {
              // Kullanici veritabanina kaydet/guncelle
              const saved = localStorage.getItem(USERS_DB_KEY);
              const db: any[] = saved ? JSON.parse(saved) : [];
              const existingIdx = db.findIndex(u => u.email === profile.email);
              const googleUser: User = {
                id: existingIdx >= 0 ? db[existingIdx].id : Math.random().toString(36).substr(2, 9),
                username: profile.email.split('@')[0],
                name: profile.name,
                email: profile.email,
                avatar: profile.picture,
                isPro: true,
                role: 'user',
                provider: 'google',
                tokenBalance: existingIdx >= 0 ? (db[existingIdx].tokenBalance || 100) : 100,
                isGmailConnected: true,
                googleAccessToken: response.access_token,
                senderAccounts: [],
                currentSenderIndex: 0,
              };
              if (existingIdx >= 0) {
                db[existingIdx] = { ...db[existingIdx], ...googleUser };
              } else {
                db.push(googleUser);
              }
              localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
              setLoading(false);
              onLogin(googleUser, true);
            })
            .catch(() => {
              setStatusMsg({ text: isTr ? 'Google profil bilgileri alinamadi. Lutfen tekrar deneyin.' : 'Could not fetch Google profile. Please try again.', type: 'error' });
              setLoading(false);
            });
        },
      });

      client.requestAccessToken({ prompt: 'select_account' });
    } catch (err: any) {
      setLoading(false);
      setStatusMsg({
        text: isTr
          ? 'Google API yuklenemedi. Demo girisi ile devam edebilirsiniz.'
          : 'Google API failed. You can use demo login.',
        type: 'info'
      });
    }
  };

  const handleSimulateGoogle = () => {
    setLoading(true);
    setTimeout(() => {
      const mockUser: User = {
        id: 'demo_' + Date.now(),
        username: 'demo_google_user',
        name: 'Demo Google Kullanicisi',
        email: 'demo@gmail.com',
        avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=4285F4&color=fff',
        isPro: true,
        role: 'user',
        provider: 'google',
        tokenBalance: 100,
        isGmailConnected: false,
        googleAccessToken: '',
        senderAccounts: [],
        currentSenderIndex: 0,
      };
      setLoading(false);
      onLogin(mockUser, true);
    }, 1000);
  };

  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'signup' && !agreedToTerms) {
      setStatusMsg({ text: isTr ? 'Devam etmek icin kullanim kosullarini kabul etmelisiniz.' : 'You must accept the terms to continue.', type: 'error' });
      return;
    }
    setLoading(true);
    const normalizedUser = formData.username.trim().toLowerCase();
    const normalizedPass = formData.password.trim();

    if (normalizedUser === 'beyaz' && normalizedPass === '8subat') {
      onLogin({
        id: 'admin',
        username: 'admin',
        name: 'DeepVera Admin',
        email: 'ai@deepvera.com.tr',
        isPro: true,
        role: 'admin',
        provider: 'local',
        tokenBalance: 999999,
        senderAccounts: [],
        currentSenderIndex: 0
      }, rememberMe);
      return;
    }

    const saved = localStorage.getItem(USERS_DB_KEY);
    const db: any[] = saved ? JSON.parse(saved) : [];

    if (activeTab === 'signup') {
      const exists = db.find((u) => u.username === normalizedUser || u.email === formData.email);
      if (exists) {
        setStatusMsg({ text: isTr ? 'Bu kullanici adi veya email zaten kullaniliyor.' : 'Username or email already in use.', type: 'error' });
        setLoading(false);
        return;
      }
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        username: normalizedUser,
        password: normalizedPass,
        email: formData.email,
        name: formData.name || normalizedUser,
        tokenBalance: 100,
        isPro: false,
        role: 'user' as const,
        provider: 'local' as const,
        senderAccounts: [],
        currentSenderIndex: 0
      };
      db.push(newUser);
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
      onLogin(newUser as any, rememberMe);
    } else {
      const found = db.find((u) => u.username.trim().toLowerCase() === normalizedUser && u.password === normalizedPass);
      if (found) {
        setLoading(false);
        onLogin({ ...found, provider: 'local' }, rememberMe);
      } else {
        setStatusMsg({ text: isTr ? 'Gecersiz kullanici adi veya sifre.' : 'Invalid username or password.', type: 'error' });
        setLoading(false);
      }
    }
  };

  const features = [
    { text: isTr ? 'AI ile firma tsearch' : 'AI company scanning' },
    { text: isTr ? 'Derin firma analizi' : 'Deep company analysis' },
    { text: isTr ? 'Otonom email gonderimi' : 'Autonomous email sending' },
    { text: isTr ? 'Canli istihbarat paneli' : 'Live intelligence panel' },
  ];

  return (
    <>
      {legalPage && <LegalPages page={legalPage} onClose={() => setLegalPage(null)} />}
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex my-auto" style={{ maxHeight: 'min(92dvh, 680px)' }}>

          {/* LEFT PANEL */}
          <div className="hidden lg:flex flex-col justify-between w-[42%] bg-slate-900 p-10 relative overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-violet-600/10" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <button onClick={onCancel} className="relative z-10 flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-fit">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
              <span className="text-[10px] font-black uppercase tracking-widest">{isTr ? 'Ana Sayfa' : 'Home'}</span>
            </button>
            <div className="relative z-10 space-y-8">
              <div>
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-lg mb-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent" />DV
                </div>
                <h1 className="text-3xl font-black text-white tracking-tighter leading-tight">AI <span className="text-blue-400">DeepVera</span></h1>
                <p className="text-slate-400 text-sm font-medium mt-2 leading-relaxed">
                  {isTr ? 'Kurumsal istihbarat ve otonom satis platformu.' : 'Corporate intelligence & autonomous sales platform.'}
                </p>
              </div>
              <div className="space-y-3">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full shrink-0"></div>
                    <span className="text-[12px] font-medium text-slate-300">{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-xl">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shrink-0" />
                <span className="text-[10px] font-bold text-slate-400">{isTr ? 'Sistem aktif ve hazir' : 'System active & ready'}</span>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3 lg:hidden">
                <button onClick={onCancel} className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
                  <span className="text-[10px] font-black uppercase tracking-widest">{isTr ? 'Geri' : 'Back'}</span>
                </button>
              </div>
              <div className="hidden lg:block">
                <h2 className="text-[15px] font-black text-slate-900 tracking-tight">
                  {activeTab === 'login' ? (isTr ? 'Sisteme Giris' : 'Sign In') : (isTr ? 'Hesap Olustur' : 'Create Account')}
                </h2>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  {activeTab === 'login' ? (isTr ? 'Hesabinizla devam edin' : 'Continue with your account') : (isTr ? 'Yeni hesap olusturun' : 'Create a new account')}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-8 space-y-5">
                {/* Tab */}
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button onClick={() => { setActiveTab('login'); setStatusMsg(null); }} className={`flex-1 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'login' ? 'bg-white shadow text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>{t.loginTab}</button>
                  <button onClick={() => { setActiveTab('signup'); setStatusMsg(null); }} className={`flex-1 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'signup' ? 'bg-white shadow text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>{t.signupTab}</button>
                </div>

                {/* Google Login Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full h-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center gap-3 hover:border-blue-400 hover:shadow-md hover:shadow-blue-500/10 transition-all active:scale-95 disabled:opacity-60 relative"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-[11px] font-bold text-slate-700">{t.googleLogin}</span>
                  {!gsiReady && <span className="absolute right-3 text-[8px] font-bold text-amber-500 uppercase">Yukleniyor...</span>}
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{t.orEmail}</span>
                  <div className="flex-1 h-px bg-slate-100" />
                </div>

                {/* Status message */}
                {statusMsg && (
                  <div className={`p-3.5 rounded-xl text-[11px] font-medium border ${statusMsg.type === 'error' ? 'bg-red-50 border-red-100 text-red-600' : statusMsg.type === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-600' : statusMsg.type === 'info' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                    <p>{statusMsg.text}</p>
                    {statusMsg.type === 'info' && (
                      <button onClick={handleSimulateGoogle} className="mt-2.5 w-full h-9 bg-blue-600 text-white rounded-lg font-black text-[10px] uppercase tracking-wider hover:bg-slate-900 transition-colors">
                        {t.demoBtn}
                      </button>
                    )}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleLocalSubmit} className="space-y-3.5">
                  {activeTab === 'signup' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">{t.nameLabel}</label>
                        <input type="text" placeholder={isTr ? 'Adiniz' : 'Your name'} value={formData.name} required onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[12px] font-medium outline-none focus:border-blue-500 focus:bg-white transition-all" />
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">{t.emailLabel}</label>
                        <input type="email" placeholder="you@firma.com" value={formData.email} required onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[12px] font-medium outline-none focus:border-blue-500 focus:bg-white transition-all" />
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">{t.userLabel}</label>
                    <input type="text" required placeholder={isTr ? 'Kullanici adiniz' : 'Your username'} value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[12px] font-medium outline-none focus:border-blue-500 focus:bg-white transition-all" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.passLabel}</label>
                      {activeTab === 'login' && <button type="button" className="text-[9px] font-bold text-blue-500 hover:text-blue-700 transition-colors">{t.forgotPass}</button>}
                    </div>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} required placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full h-10 pl-3.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-[12px] font-medium outline-none focus:border-blue-500 focus:bg-white transition-all" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors">
                        {showPassword ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        )}
                      </button>
                    </div>
                  </div>
                  {activeTab === 'signup' && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <button type="button" onClick={() => setAgreedToTerms(!agreedToTerms)} className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all shrink-0 mt-0.5 ${agreedToTerms ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300 hover:border-blue-400'}`}>
                          {agreedToTerms && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7"/></svg>}
                        </button>
                        <span className="text-[10px] font-medium text-slate-600 leading-relaxed">
                          <button type="button" onClick={() => setLegalPage('membership')} className="text-blue-600 hover:underline font-bold">{isTr ? 'Uyelik Sozlesmesini' : 'Membership Agreement'}</button>{isTr ? ', ' : ', '}
                          <button type="button" onClick={() => setLegalPage('terms')} className="text-blue-600 hover:underline font-bold">{isTr ? 'Kullanim Kosullarini' : 'Terms of Service'}</button>{isTr ? ' ve ' : ' and '}
                          <button type="button" onClick={() => setLegalPage('kvk')} className="text-blue-600 hover:underline font-bold">{isTr ? 'KVKK Aydinlatma Metnini' : 'Privacy Policy'}</button>
                          {isTr ? ' okudum, kabul ediyorum.' : ' — I have read and accept all.'}
                        </span>
                      </label>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <button type="button" onClick={() => setRememberMe(!rememberMe)} className={`w-4 h-4 rounded flex items-center justify-center border-2 transition-all shrink-0 ${rememberMe ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300 hover:border-blue-400'}`}>
                        {rememberMe && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7"/></svg>}
                      </button>
                      <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-700 transition-colors">{t.rememberMe}</span>
                    </label>
                  </div>
                  <button type="submit" disabled={loading} className="w-full h-11 bg-blue-600 text-white rounded-xl font-black text-[12px] uppercase tracking-wider hover:bg-slate-900 transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    ) : (
                      activeTab === 'login' ? t.loginBtn : t.signupBtn
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
