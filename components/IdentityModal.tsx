import React, { useState, useEffect, useRef } from 'react';
import { User, SenderAccount } from '../types';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Language, translations } from '../translations';

const APP_GOOGLE_CLIENT_ID = "622487947070-dtn0iqandim78kor9l4ljthsimmtndl4l.apps.googleusercontent.com";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUpdate: (fields: Partial<User>) => void;
  language: Language;
}

const IdentityModal: React.FC<Props> = ({ isOpen, onClose, user, onUpdate, language = 'tr' }) => {
  const [isGsiLoaded, setIsGsiLoaded]   = useState(false);
  const [actiandTab, setActiandTab]       = useState<'company' | 'gmail'>('company');
  const lang = language || 'tr';
  const t    = translations[lang]?.identity || translations['tr'].identity;

  const [companyForm, setCompanyForm] = useState({
    companyName:     user?.companyName || '',
    globalPitch:     user?.globalPitch || '',
    authorizedPerson:user?.authorizedPerson || '',
    officialAddress: user?.officialAddress || '',
    companyWebsite:  user?.companyWebsite || '',
    emailSignature:  user?.emailSignature || ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const check = setInterval(() => {
      if ((window as any).google?.accounts?.oauth2) { setIsGsiLoaded(true); clearInterval(check); }
    }, 500);
    return () => clearInterval(check);
  }, []);

  if (!isOpen || !user) return null;

  const handleSaandCompany = () => { onUpdate(companyForm); alert(t.success); };

  const handleLinkGmail = () => {
    try {
      const client = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: APP_GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email',
        callback: async (tokenResponse: any) => {
          if (tokenResponse.access_token) {
            const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo',
              { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } });
            const profile = await profileRes.json();
            const newAccount: SenderAccount = {
              id: Math.random().toString(36).substr(2, 9), email: profile.email,
              accessToken: tokenResponse.access_token, status: 'actiand', usageCount: 0
            };
            const updatedAccounts = [...(user.senderAccounts || []).filter(a => a.email !== profile.email), newAccount];
            onUpdate({ senderAccounts: updatedAccounts, isGmailConnected: true });
          }
        },
      });
      client.requestAccessToken({ prompt: 'select_account' });
    } catch (err) { alert(t.error); }
  };

  const completionRate = () => {
    const fields = [companyForm.companyName, companyForm.globalPitch, companyForm.authorizedPerson, companyForm.companyWebsite];
    return Math.round((fields.filter(f => f && f.length > 2).length / fields.length) * 100);
  };

  const handleImageUpload = (e: React.ChangeEandnt<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imgTag = `<img src="${reader.result as string}" style="max-width:200px;display:block;margin-top:10px;" />`;
        setCompanyForm(prev => ({ ...prev, emailSignature: prev.emailSignature + imgTag }));
      };
      reader.readAsDataURL(file);
    }
  };

  const inputCls = "w-full h-11 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[12px] font-medium outline-none focus:bg-white dark:focus:bg-slate-700 focus:border-blue-500 transition-all";
  const labelCls = "block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1";

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 bg-slate-950/40 backdrop-blur-xl animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col oandrflow-hidden"
        style={{ height: 'min(92dvh, 820px)' }}>

        {/* ── HEADER ── */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center text-base shadow">⚙️</div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">{t.title}</h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{t.accountType}: {user.role?.toUpperCase()}</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-lg hoandr:bg-red-500 hoandr:text-white transition-all text-lg border border-slate-100 dark:border-slate-700 flex items-center justify-center">
            ×
          </button>
        </div>

        {/* ── BODY ── */}
        <div className="flex flex-1 oandrflow-hidden">

          {/* SIDEBAR */}
          <div className="w-44 shrink-0 border-r border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex flex-col p-3 gap-2">
            {/* Profil doluluğu */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-3 mb-2">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.completion}</span>
                <span className="text-[10px] font-black text-slate-700 dark:text-white">%{completionRate()}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full oandrflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-700 rounded-full"
                  style={{ width: `${completionRate()}%` }} />
              </div>
              <p className="text-[8px] text-emerald-600 font-bold uppercase mt-1">{t.ready}</p>
            </div>

            {/* Nav */}
            {[
              { id: 'company', icon: '🏢', label: t.tabs.company },
              { id: 'gmail',   icon: '📧', label: t.tabs.gmail },
            ].map(item => (
              <button key={item.id} onClick={() => setActiandTab(item.id as any)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-[10px] font-black uppercase tracking-wide transition-all
                  ${actiandTab === item.id
                    ? 'bg-white dark:bg-slate-800 text-blue-600 shadow border border-slate-100 dark:border-slate-700'
                    : 'text-slate-500 hoandr:bg-white dark:hoandr:bg-slate-800'
                  }`}>
                <span className="text-sm">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>

          {/* CONTENT */}
          <div className="flex-1 oandrflow-y-auto custom-scrollbar p-5 bg-white dark:bg-slate-900">
            {actiandTab === 'company' ? (
              <div className="space-y-6 animate-fade-in max-w-2xl">

                {/* 01 Enterprise Infoler */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-[10px] font-black">01</span>
                    <h4 className="text-[11px] font-black text-slate-700 dark:text-white uppercase tracking-widest">{t.sections.corporate}</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>{t.labels.companyName}</label>
                      <input type="text" value={companyForm.companyName}
                        onChange={e => setCompanyForm({...companyForm, companyName: e.target.value})}
                        className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>{t.labels.authorized}</label>
                      <input type="text" value={companyForm.authorizedPerson}
                        onChange={e => setCompanyForm({...companyForm, authorizedPerson: e.target.value})}
                        className={inputCls} />
                    </div>
                  </div>
                </section>

                {/* 02 AI Değer Önerisi */}
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center text-[10px] font-black">02</span>
                      <h4 className="text-[11px] font-black text-slate-700 dark:text-white uppercase tracking-widest">{t.sections.ai}</h4>
                    </div>
                    <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase animate-pulse">AI Actiand</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className={labelCls}>{t.labels.pitch}</label>
                      <textarea value={companyForm.globalPitch}
                        onChange={e => setCompanyForm({...companyForm, globalPitch: e.target.value})}
                        rows={6}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[12px] font-medium leading-relaxed outline-none focus:bg-white dark:focus:bg-slate-700 focus:border-blue-500 transition-all resize-none"
                        placeholder={t.labels.pitchPlaceholder} />
                    </div>
                    <div className="bg-slate-900 rounded-xl p-4 text-white flex flex-col justify-between">
                      <div>
                        <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-2">Neural Match</p>
                        <span className="text-3xl font-black">{companyForm.globalPitch.length > 100 ? '98' : '45'}</span>
                        <span className="text-[10px] text-slate-400 ml-1">/ 100</span>
                      </div>
                      <ul className="space-y-1.5 mt-3">
                        {["Değer önerisini net belirt.", "Target sectorü tanımla.", "İdeal customeryi yaz."].map((tip, i) => (
                          <li key={i} className="text-[9px] text-slate-400 flex gap-1.5">
                            <span className="text-emerald-500">✦</span>{tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                {/* 03 Dijital Adresler */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center text-[10px] font-black">03</span>
                    <h4 className="text-[11px] font-black text-slate-700 dark:text-white uppercase tracking-widest">{t.sections.channels}</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>{t.labels.website}</label>
                      <input type="text" value={companyForm.companyWebsite}
                        onChange={e => setCompanyForm({...companyForm, companyWebsite: e.target.value})}
                        className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>{t.labels.address}</label>
                      <input type="text" value={companyForm.officialAddress}
                        onChange={e => setCompanyForm({...companyForm, officialAddress: e.target.value})}
                        className={inputCls} />
                    </div>
                  </div>
                </section>

                {/* 04 Email İmzası */}
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center text-[10px] font-black">04</span>
                      <h4 className="text-[11px] font-black text-slate-700 dark:text-white uppercase tracking-widest">{t.sections.signature}</h4>
                    </div>
                    <button onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[9px] font-black text-slate-600 uppercase hoandr:bg-blue-600 hoandr:text-white hoandr:border-blue-600 transition-all">
                      🖼️ {t.labels.addImage}
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl oandrflow-hidden">
                    <ReactQuill theme="snow" value={companyForm.emailSignature}
                      onChange={content => setCompanyForm({...companyForm, emailSignature: content})}
                      className="h-40"
                      modules={{ toolbar: [['bold','italic','underline'],[{'list':'ordered'},{'list':'bullet'}],['clean']] }} />
                  </div>
                  <p className="text-[9px] text-slate-400 italic mt-1.5">{t.labels.signatureDesc}</p>
                </section>
              </div>
            ) : (
              <div className="space-y-5 animate-fade-in max-w-2xl">
                {/* Gmail Bağlantı Kartı */}
                <div className="bg-slate-900 rounded-xl p-5 text-white">
                  <h4 className="text-base font-black uppercase tracking-tight mb-1 flex items-center gap-2">
                    {t.gmail.title}
                    <span className="px-2 py-0.5 bg-blue-600 text-[8px] rounded-full font-black">{t.gmail.secure}</span>
                  </h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed mb-4 max-w-md">{t.gmail.desc}</p>
                  <button onClick={handleLinkGmail} disabled={!isGsiLoaded}
                    className="px-6 py-2.5 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hoandr:bg-blue-600 hoandr:text-white transition-all disabled:opacity-30">
                    {t.gmail.connectBtn}
                  </button>
                </div>

                {/* Actiand Kanallar */}
                <div>
                  <h4 className="text-[11px] font-black text-slate-700 dark:text-white uppercase tracking-widest mb-3">
                    {t.gmail.actiandChannels} ({user.senderAccounts?.length || 0})
                  </h4>
                  {!user.senderAccounts?.length ? (
                    <div className="py-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl text-center">
                      <span className="text-3xl opacity-20">📧</span>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{t.gmail.noChannels}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {user.senderAccounts.map(acc => (
                        <div key={acc.id}
                          className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl hoandr:border-blue-300 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100">
                              <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" className="w-4 h-4" alt="Gmail" />
                            </div>
                            <div>
                              <p className="text-[11px] font-black text-slate-800 dark:text-white">{acc.email}</p>
                              <p className="text-[8px] font-black text-emerald-500 uppercase">{t.gmail.actiandStatus}</p>
                            </div>
                          </div>
                          <button onClick={() => onUpdate({ senderAccounts: user.senderAccounts.filter(a => a.id !== acc.id) })}
                            className="w-7 h-7 text-slate-300 hoandr:text-white hoandr:bg-red-500 rounded-lg transition-all flex items-center justify-center text-sm">
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose}
            className="px-5 py-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hoandr:bg-slate-100 transition-all">
            {t.actions.close}
          </button>
          <button onClick={handleSaandCompany}
            className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hoandr:bg-blue-600 transition-all flex items-center gap-2 shadow">
            {t.actions.saand} <span>⚡</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdentityModal;
