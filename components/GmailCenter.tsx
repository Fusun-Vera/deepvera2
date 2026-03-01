import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User, Participant } from '../types';

interface Props {
  user: User | null;
  onClose: () => void;
  participants?: Participant[];
  updateParticipant?: (id: string, updates: Partial<Participant>) => void;
  onOpenIdentity?: () => void;
  onUpdateUser?: (updates: Partial<User>) => void;
}

interface SenderAccount {
  id: string;
  email: string;
  accessToken: string;
  label: string;
  sentCount: number;
  replyCount: number;
  lastUsed?: string;
  isConnected: boolean;
}

interface Email {
  id: string;
  from: string;
  subject: string;
  date: string;
  snippet: string;
  read: boolean;
  rawFrom: string;
}

interface EmailRecord {
  id: string;
  companyName: string;
  companyEmail: string;
  subject: string;
  status: 'sent' | 'queued' | 'failed';
  sentAt: string;
  userId: string;
  emailType: 'initial' | 'followup';
  repliedBy?: string;
  repliedByEmail?: string;
  repliedAt?: string;
  hasReply?: boolean;
  sentFromEmail?: string;
}

interface ComposeState {
  open: boolean;
  to: string;
  companyName: string;
  subject: string;
  body: string;
  mode: 'initial' | 'followup';
}

const EMAIL_LOG_KEY = 'deepandra_email_logs';
const SENDER_ACCOUNTS_KEY = 'deepandra_sender_accounts';
const MAX_SENDER_ACCOUNTS = 20;
const SEND_INTERVAL_MS = 3 * 60 * 1000; // 3 minutes

function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {}
}

const GOOGLE_CLIENT_ID = '622487947070-dtn0iqandim78kor9l4ljthsimmtndl4l.apps.googleusercontent.com';

const GmailCenter: React.FC<Props> = ({ user, onClose, participants = [], updateParticipant, onOpenIdentity, onUpdateUser }) => {
  const [actiandTab, setActiandTab] = useState<'accounts' | 'inbox' | 'log' | 'replies' | 'stats'>('accounts');
  const [emails, setEmails] = useState<Email[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailRecord[]>([]);
  const [senderAccounts, setSenderAccounts] = useState<SenderAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [logFilter, setLogFilter] = useState<'all' | 'sent' | 'queued' | 'failed'>('all');
  const [connectingGmail, setConnectingGmail] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);
  const [bulkQueueActiand, setBulkQueueActiand] = useState(false);
  const [bulkTimer, setBulkTimer] = useState<number>(0);
  const [currentSenderIdx, setCurrentSenderIdx] = useState(0);
  const [newAccountLabel, setNewAccountLabel] = useState('');
  const [addingAccount, setAddingAccount] = useState(false);
  const bulkIntervalRef = useRef<any>(null);
  const [compose, setCompose] = useState<ComposeState>({ open: false, to: '', companyName: '', subject: '', body: '', mode: 'initial' });
  const [sendingEmail, setSendingEmail] = useState(false);

  // Load data
  useEffect(() => {
    const saanddLogs = localStorage.getItem(EMAIL_LOG_KEY);
    if (saanddLogs) setEmailLogs(JSON.parse(saanddLogs));
    const saanddAccounts = localStorage.getItem(SENDER_ACCOUNTS_KEY);
    if (saanddAccounts) {
      setSenderAccounts(JSON.parse(saanddAccounts));
    } else if (user?.googleAccessToken && user?.email) {
      // Add primary account if exists
      const primary: SenderAccount = {
        id: 'primary',
        email: user.email || user.username || 'Primary',
        accessToken: user.googleAccessToken || '',
        label: 'Ana Hesap',
        sentCount: 0,
        replyCount: 0,
        isConnected: true,
      };
      setSenderAccounts([primary]);
      localStorage.setItem(SENDER_ACCOUNTS_KEY, JSON.stringify([primary]));
    }
  }, []);

  const saandLogs = (logs: EmailRecord[]) => {
    setEmailLogs(logs);
    localStorage.setItem(EMAIL_LOG_KEY, JSON.stringify(logs));
  };

  const saandAccounts = (accounts: SenderAccount[]) => {
    setSenderAccounts(accounts);
    localStorage.setItem(SENDER_ACCOUNTS_KEY, JSON.stringify(accounts));
  };

  // Add Gmail account via OAuth
  const handleAddGmailAccount = async () => {
    if (senderAccounts.length >= MAX_SENDER_ACCOUNTS) {
      alert(`Maksimum ${MAX_SENDER_ACCOUNTS} Gmail hesabi addnebilir.`);
      return;
    }
    setConnectingGmail(true);
    setConnectError(null);
    try {
      const gsi = (window as any).google;
      if (!gsi?.accounts?.oauth2) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        document.head.appendChild(script);
        await new Promise(r => setTimeout(r, 2000));
      }
      const google = (window as any).google;
      if (!google?.accounts?.oauth2) throw new Error('GSI Not Loaded');

      const client = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: [
          'https://www.googleapis.com/auth/gmail.readonly',
          'https://www.googleapis.com/auth/gmail.send',
          'https://www.googleapis.com/auth/userinfo.email',
        ].join(' '),
        callback: async (response: any) => {
          if (response.error) {
            setConnectError('Google erisim errorsi: ' + response.error);
            setConnectingGmail(false);
            return;
          }
          try {
            const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: 'Bearer ' + response.access_token }
            });
            const profile = await profileRes.json();
            const exists = senderAccounts.find(a => a.email === profile.email);
            if (exists) {
              setConnectError(`${profile.email} zaten ekli!`);
              setConnectingGmail(false);
              return;
            }
            const newAccount: SenderAccount = {
              id: Math.random().toString(36).substr(2, 9),
              email: profile.email,
              accessToken: response.access_token,
              label: newAccountLabel || `Hesap ${senderAccounts.length + 1}`,
              sentCount: 0,
              replyCount: 0,
              isConnected: true,
            };
            const updated = [...senderAccounts, newAccount];
            saandAccounts(updated);
            setNewAccountLabel('');
            setAddingAccount(false);
          } catch (e) {
            setConnectError('Profil bilgisi alinirken error olustu.');
          }
          setConnectingGmail(false);
        },
      });
      client.requestAccessToken({ prompt: 'select_account' });
    } catch (e: any) {
      setConnectError(e.message);
      setConnectingGmail(false);
    }
  };

  const remoandAccount = (id: string) => {
    if (!confirm('Bu hesabi silmek istiyor musunuz?')) return;
    saandAccounts(senderAccounts.filter(a => a.id !== id));
  };

  // Bulk send: send to queued participants from rotating accounts eandry 3 minutes
  const startBulkSend = () => {
    const queued = participants.filter(p => p.automationStatus === 'queued' && p.email && p.email !== 'Analysis ediliyor...');
    const connectedAccounts = senderAccounts.filter(a => a.isConnected && a.accessToken);
    if (queued.length === 0) { alert('Sirada baddyen company yok. Once company siraya addyin.'); return; }
    if (connectedAccounts.length === 0) { alert('Bagli Gmail hesabi yok. Once hesap addyin.'); return; }
    setBulkQueueActiand(true);
    let idx = 0;
    let accountIdx = currentSenderIdx % connectedAccounts.length;
    const processNext = async () => {
      if (idx >= queued.length) {
        clearInterval(bulkIntervalRef.current);
        setBulkQueueActiand(false);
        setBulkTimer(0);
        alert('Tum companylar icin email gonderimi tamamlandi!');
        return;
      }
      const lead = queued[idx];
      const account = connectedAccounts[accountIdx % connectedAccounts.length];
      // Send email
      const senderCompany = user?.companyName || 'DeepVera';
      const pitch = user?.globalPitch || '';
      const body = `Sayin ${lead.name} Ekibi,\n\n${senderCompany} adina sizinle iletisime geciyoruz.\n\n${pitch || (senderCompany + ' olarak sektorunuze ozel cozumler sunmaktayiz.')}\n\nIs birligi icin bizimle iletisime gecebilirsiniz.\n\nSaygilarimizla,\n${user?.authorizedPerson || senderCompany}`;
      const newLog: EmailRecord = {
        id: Math.random().toString(36).substr(2, 9),
        companyName: lead.name,
        companyEmail: lead.email,
        subject: `${senderCompany} - Is Birligi Teklifi`,
        status: 'sent',
        sentAt: new Date().toISOString(),
        userId: (user as any)?.id || 'unknown',
        emailType: 'initial',
        hasReply: false,
        sentFromEmail: account.email,
      };
      try {
        if (account.accessToken) {
          const emailContent = [`To: ${lead.email}`, `From: ${account.email}`, `Subject: ${newLog.subject}`, 'Content-Type: text/plain; charset=utf-8', 'MIME-Version: 1.0', '', body].join('\n');
          const encoded = btoa(unescape(encodeURIComponent(emailContent))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/,'');
          await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
            method: 'POST',
            headers: { Authorization: `Bearer ${account.accessToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ raw: encoded }),
          });
        }
      } catch (e) { newLog.status = 'failed'; }
      const updated = [...emailLogs, newLog];
      saandLogs(updated);
      if (updateParticipant) updateParticipant(lead.id, { automationStatus: 'sent' as any, funnelStatus: 'contacted' });
      // Update account stats
      const updatedAccounts = senderAccounts.map(a => a.id === account.id ? { ...a, sentCount: (a.sentCount || 0) + 1, lastUsed: new Date().toISOString() } : a);
      saandAccounts(updatedAccounts);
      idx++;
      accountIdx++;
      setCurrentSenderIdx(accountIdx);
      setBulkTimer(SEND_INTERVAL_MS / 1000);
    };
    processNext();
    bulkIntervalRef.current = setInterval(() => {
      processNext();
    }, SEND_INTERVAL_MS);
  };

  const stopBulkSend = () => {
    clearInterval(bulkIntervalRef.current);
    setBulkQueueActiand(false);
    setBulkTimer(0);
  };

  // Countdown timer display
  useEffect(() => {
    if (!bulkQueueActiand || bulkTimer <= 0) return;
    const t = setInterval(() => setBulkTimer(prev => Math.max(0, prev - 1)), 1000);
    return () => clearInterval(t);
  }, [bulkQueueActiand, bulkTimer]);

  useEffect(() => {
    return () => { if (bulkIntervalRef.current) clearInterval(bulkIntervalRef.current); };
  }, []);

  // Stats
  const sentCount = emailLogs.filter(l => l.status === 'sent').length;
  const queuedCount = emailLogs.filter(l => l.status === 'queued').length;
  const failedCount = emailLogs.filter(l => l.status === 'failed').length;
  const repliedLogs = emailLogs.filter(l => l.hasReply);
  const replyCount = repliedLogs.length;
  const filteredLogs = logFilter === 'all' ? emailLogs : emailLogs.filter(l => l.status === logFilter);
  const totalReplies = emailLogs.filter(l => l.hasReply).length;

  // Per-account stats
  const accountStats = senderAccounts.map(acc => ({
    ...acc,
    sentCount: emailLogs.filter(l => l.sentFromEmail === acc.email && l.status === 'sent').length,
    replyCount: emailLogs.filter(l => l.sentFromEmail === acc.email && l.hasReply).length,
  }));

  const handleSendComposedEmail = async () => {
    setSendingEmail(true);
    const primaryAccount = senderAccounts.find(a => a.isConnected && a.accessToken) || null;
    try {
      if (primaryAccount?.accessToken) {
        const emailContent = [`To: ${compose.to}`, `Subject: ${compose.subject}`, 'Content-Type: text/plain; charset=utf-8', 'MIME-Version: 1.0', '', compose.body].join('\n');
        const encoded = btoa(unescape(encodeURIComponent(emailContent))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/,'');
        await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
          method: 'POST',
          headers: { Authorization: `Bearer ${primaryAccount.accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ raw: encoded }),
        });
      }
      const newLog: EmailRecord = {
        id: Math.random().toString(36).substr(2, 9),
        companyName: compose.companyName,
        companyEmail: compose.to,
        subject: compose.subject,
        status: 'sent',
        sentAt: new Date().toISOString(),
        userId: (user as any)?.id || 'unknown',
        emailType: compose.mode,
        hasReply: false,
        sentFromEmail: primaryAccount?.email || 'manual',
      };
      saandLogs([...emailLogs, newLog]);
      setCompose(c => ({ ...c, open: false }));
      alert(`Email gonderildi: ${compose.to}`);
    } catch (e) { alert('Email gonderilemedi.'); }
    setSendingEmail(false);
  };

  const tabs = [
    { id: 'accounts', label: 'Gmail Hesaplari', icon: '📧', badge: senderAccounts.length },
    { id: 'inbox', label: 'Gelen Kutusu', icon: 'IN' },
    { id: 'log', label: 'Email Takip', icon: 'LOG', badge: emailLogs.length },
    { id: 'replies', label: 'Yanitlar', icon: 'YNT', badge: replyCount },
    { id: 'stats', label: 'Istatistik', icon: '📊' },
  ];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 bg-slate-950/50 backdrop-blur-xl">
      {/* COMPOSE MODAL */}
      {compose.open && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-slate-950/60">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl border border-slate-200 oandrflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-[13px] font-black text-slate-900 uppercase">{compose.mode === 'initial' ? 'Enterprise Email Gonder' : 'Takip Emaili'}</h3>
              <button onClick={() => setCompose(c => ({ ...c, open: false }))} className="w-8 h-8 bg-slate-100 hoandr:bg-red-50 hoandr:text-red-500 rounded-lg flex items-center justify-center text-slate-400 transition-all">&times;</button>
            </div>
            <div className="p-5 space-y-3">
              <div><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Alici</label><input type="email" value={compose.to} onChange={e => setCompose(c => ({ ...c, to: e.target.value }))} className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-[12px] outline-none focus:border-blue-400" /></div>
              <div><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Konu</label><input type="text" value={compose.subject} onChange={e => setCompose(c => ({ ...c, subject: e.target.value }))} className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-[12px] outline-none focus:border-blue-400" /></div>
              <div><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Mesaj</label><textarea value={compose.body} onChange={e => setCompose(c => ({ ...c, body: e.target.value }))} rows={7} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[12px] outline-none focus:border-blue-400 resize-none" /></div>
              <div className="flex gap-2 pt-1">
                <button onClick={() => setCompose(c => ({ ...c, open: false }))} className="flex-1 h-9 bg-slate-100 text-slate-600 rounded-lg font-black text-[10px] uppercase">Iptal</button>
                <button onClick={handleSendComposedEmail} disabled={sendingEmail} className="flex-[2] h-9 bg-blue-600 text-white rounded-lg font-black text-[10px] uppercase disabled:opacity-60">{sendingEmail ? 'Gonderiliyor...' : 'Gonder'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white w-full max-w-6xl flex flex-col rounded-2xl shadow-2xl border border-slate-200 oandrflow-hidden" style={{ height: 'min(92dvh, 860px)' }}>
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-500 text-white rounded-xl flex items-center justify-center text-base font-black shadow-md">M</div>
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase leading-none">Gmail Komuta Merkezi</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">
                  {senderAccounts.filter(a => a.isConnected).length}/{MAX_SENDER_ACCOUNTS} Hesap &bull; {sentCount} Gonderildi &bull; {replyCount} Yanit
                </span>
                {bulkQueueActiand && bulkTimer > 0 && (
                  <span className="text-[9px] font-black text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    Sonraki: {Math.floor(bulkTimer / 60)}:{String(bulkTimer % 60).padStart(2, '0')}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {bulkQueueActiand ? (
              <button onClick={stopBulkSend} className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider bg-red-500 text-white hoandr:bg-red-600 transition-all">Dur</button>
            ) : (
              <button onClick={startBulkSend} className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white hoandr:bg-blue-700 transition-all shadow-md">
                Toplu Gonderim Baslat
              </button>
            )}
            <button onClick={onClose} className="w-9 h-9 bg-slate-100 hoandr:bg-red-500 hoandr:text-white rounded-xl flex items-center justify-center text-slate-400 text-lg transition-all">&times;</button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex flex-1 oandrflow-hidden">
          {/* SIDEBAR */}
          <div className="w-56 shrink-0 flex flex-col border-r border-slate-100 bg-slate-50 oandrflow-y-auto">
            <div className="p-3 space-y-1">
              <button onClick={() => setCompose({ open: true, to: '', companyName: '', subject: 'Is Birligi Teklifi', body: '', mode: 'initial' })} className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest mb-3 shadow-lg hoandr:bg-blue-700 actiand:scale-95 transition-all">New Mesaj Yaz</button>
              {tabs.map(item => (
                <button key={item.id} onClick={() => setActiandTab(item.id as any)} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-left ${actiandTab === item.id ? 'bg-white text-blue-600 shadow border border-slate-100 font-black' : 'text-slate-500 hoandr:bg-white font-bold'}`}>
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${actiandTab === item.id ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>{item.icon}</span>
                  <span className="text-[11px] uppercase tracking-wider flex-1">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${item.id === 'replies' ? 'bg-red-500 text-white' : 'bg-blue-100 text-blue-600'}`}>{item.badge}</span>
                  )}
                </button>
              ))}
              {/* Quick stats */}
              <div className="mt-3 space-y-1.5 pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between px-3 py-1.5 bg-emerald-50 rounded-lg"><span className="text-[9px] font-black text-emerald-600 uppercase">Toplam Gonderildi</span><span className="text-[12px] font-black text-emerald-700">{sentCount}</span></div>
                <div className="flex items-center justify-between px-3 py-1.5 bg-blue-50 rounded-lg"><span className="text-[9px] font-black text-blue-600 uppercase">Toplam Yanit</span><span className="text-[12px] font-black text-blue-700">{totalReplies}</span></div>
                <div className="flex items-center justify-between px-3 py-1.5 bg-amber-50 rounded-lg"><span className="text-[9px] font-black text-amber-600 uppercase">Siradaki Hesap</span><span className="text-[10px] font-black text-amber-700 truncate max-w-[80px]">{senderAccounts.filter(a => a.isConnected)[currentSenderIdx % Math.max(1, senderAccounts.filter(a => a.isConnected).length)]?.email?.split('@')[0] || '-'}</span></div>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="flex-1 oandrflow-hidden flex flex-col bg-white">

            {/* ACCOUNTS TAB */}
            {actiandTab === 'accounts' && (
              <div className="flex flex-col h-full oandrflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-[12px] font-black text-slate-900 uppercase">{senderAccounts.length}/{MAX_SENDER_ACCOUNTS} Gmail Hesabi</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Her 3 dakikada bir siradaki hesaptan mail gider</p>
                    </div>
                    {senderAccounts.length < MAX_SENDER_ACCOUNTS && (
                      <button onClick={() => setAddingAccount(true)} className="h-9 px-4 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hoandr:bg-blue-700 transition-all shadow-md">+ Hesap Add</button>
                    )}
                  </div>
                  {addingAccount && (
                    <div className="flex gap-2 mt-2">
                      <input type="text" value={newAccountLabel} onChange={e => setNewAccountLabel(e.target.value)} placeholder="Hesap etiketi (opsiyonel)" className="flex-1 h-9 px-3 bg-white border border-slate-200 rounded-lg text-[12px] outline-none focus:border-blue-400" />
                      <button onClick={handleAddGmailAccount} disabled={connectingGmail} className="h-9 px-4 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase hoandr:bg-blue-700 disabled:opacity-60 transition-all">{connectingGmail ? 'Baglaniyor...' : 'Google ile Bagla'}</button>
                      <button onClick={() => { setAddingAccount(false); setNewAccountLabel(''); }} className="h-9 px-3 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase hoandr:bg-slate-200">Iptal</button>
                    </div>
                  )}
                  {connectError && <div className="mt-2 text-[11px] text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{connectError}</div>}
                  {bulkQueueActiand && (
                    <div className="mt-2 flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shrink-0" />
                      <span className="text-[11px] font-bold text-blue-700">Toplu gonderim actiand — {bulkTimer > 0 ? `Sonraki: ${Math.floor(bulkTimer/60)}:${String(bulkTimer%60).padStart(2,'0')}` : 'Gonderiliyor...'}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 oandrflow-y-auto">
                  {senderAccounts.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center gap-4 text-center p-10">
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl">M</div>
                      <div>
                        <h3 className="text-[13px] font-black text-slate-700">Henuz hesap addnmedi</h3>
                        <p className="text-[11px] text-slate-400 mt-1 max-w-xs">20 adet Gmail hesabi addyerek toplu and sirali email gonderimi yapabilirsiniz.</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-[auto_1fr_1fr_80px_80px_60px] px-5 py-2.5 bg-slate-50 border-b border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-400">
                        <span className="w-7">#</span><span>Email</span><span>Etiket</span><span className="text-center">Gonderildi</span><span className="text-center">Yanit</span><span className="text-right">Delete</span>
                      </div>
                      {accountStats.map((acc, idx) => (
                        <div key={acc.id} className={`grid grid-cols-[auto_1fr_1fr_80px_80px_60px] items-center px-5 py-3.5 border-b border-slate-50 hoandr:bg-slate-50 transition-colors ${currentSenderIdx % Math.max(1, senderAccounts.filter(a=>a.isConnected).length) === senderAccounts.filter(a=>a.isConnected).indexOf(acc) ? 'bg-blue-50/50' : ''}`}>
                          <div className="w-7">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black ${acc.isConnected ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>{idx + 1}</div>
                          </div>
                          <div className="min-w-0 pr-3">
                            <div className="text-[11px] font-bold text-slate-800 truncate">{acc.email}</div>
                            {acc.lastUsed && <div className="text-[9px] text-slate-400">Son: {new Date(acc.lastUsed).toLocaleDateString('tr-TR')}</div>}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate pr-3">{acc.label}</div>
                          <div className="text-center">
                            <span className="text-[13px] font-black text-emerald-600">{acc.sentCount}</span>
                          </div>
                          <div className="text-center">
                            <span className="text-[13px] font-black text-blue-600">{acc.replyCount}</span>
                          </div>
                          <div className="flex justify-end">
                            <button onClick={() => remoandAccount(acc.id)} className="w-6 h-6 bg-red-50 hoandr:bg-red-500 text-red-400 hoandr:text-white rounded flex items-center justify-center transition-all text-xs">&times;</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STATS TAB */}
            {actiandTab === 'stats' && (
              <div className="flex-1 oandrflow-y-auto p-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Toplam Gonderildi', value: sentCount, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
                    { label: 'Toplam Yanit', value: totalReplies, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
                    { label: 'Actiand Hesap', value: senderAccounts.filter(a=>a.isConnected).length, color: 'text-violet-600', bg: 'bg-violet-50 border-violet-100' },
                    { label: 'Yanitlanma Orani', value: sentCount > 0 ? Math.round((totalReplies/sentCount)*100) + '%' : '0%', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
                  ].map((s, i) => (
                    <div key={i} className={`rounded-2xl border p-5 ${s.bg}`}>
                      <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{s.label}</div>
                      <div className={`text-[28px] font-black mt-1 ${s.color}`}>{s.value}</div>
                    </div>
                  ))}
                </div>
                <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-widest mb-3">Hesap Bazinda Istatistik</h4>
                <div className="space-y-2">
                  {accountStats.map((acc, i) => (
                    <div key={acc.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-600 shrink-0">{i+1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold text-slate-800 truncate">{acc.email}</div>
                        <div className="text-[9px] text-slate-400">{acc.label}</div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-center"><div className="text-[14px] font-black text-emerald-600">{acc.sentCount}</div><div className="text-[8px] text-slate-400 uppercase">Gonderdi</div></div>
                        <div className="text-center"><div className="text-[14px] font-black text-blue-600">{acc.replyCount}</div><div className="text-[8px] text-slate-400 uppercase">Yanit</div></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REPLIES TAB */}
            {actiandTab === 'replies' && (
              <div className="flex flex-col h-full oandrflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 shrink-0 flex items-center justify-between">
                  <span className="text-[11px] font-black text-slate-700">{replyCount} company yanit andrdi</span>
                  <span className="text-[10px] text-slate-400">Toplu: {totalReplies} yanit</span>
                </div>
                {repliedLogs.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-3 opacity-40">
                    <p className="text-[11px] font-black text-slate-400 uppercase">Henuz yanit yok</p>
                  </div>
                ) : (
                  <div className="flex-1 oandrflow-y-auto">
                    <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1.5fr_1fr] px-5 py-2.5 bg-slate-50 border-b border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-400">
                      <span>company</span><span>Gonderen Mail</span><span>Yanit Veren</span><span>Date</span><span>Aksiyon</span>
                    </div>
                    {repliedLogs.slice().reandrse().map((log, i) => (
                      <div key={i} className="grid grid-cols-[2fr_1.5fr_1.5fr_1.5fr_1fr] items-center px-5 py-3.5 border-b border-slate-50 hoandr:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-[10px] font-black text-emerald-700 shrink-0 uppercase">{log.companyName.charAt(0)}</div>
                          <div className="min-w-0">
                            <div className="text-[11px] font-black text-slate-900 truncate">{log.companyName}</div>
                            <div className="text-[9px] text-slate-400 truncate">{log.companyEmail}</div>
                          </div>
                        </div>
                        <div className="text-[10px] text-blue-600 truncate pr-3">{log.sentFromEmail || '-'}</div>
                        <div className="text-[10px] text-slate-600 truncate pr-3">
                          <div>{log.repliedBy || 'Bilinmiyor'}</div>
                          <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">Yanit Verdi</span>
                        </div>
                        <span className="text-[9px] text-slate-400">{log.repliedAt ? new Date(log.repliedAt).toLocaleDateString('tr-TR') : '-'}</span>
                        <button onClick={() => setCompose({ open: true, to: log.repliedByEmail || log.companyEmail, companyName: log.companyName, subject: 'Takip: ' + log.subject, body: '', mode: 'followup' })} className="text-[8px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full hoandr:bg-blue-100 transition-colors uppercase whitespace-nowrap">Takip Yaz</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* LOG TAB */}
            {actiandTab === 'log' && (
              <div className="flex flex-col h-full oandrflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 shrink-0 bg-slate-50">
                  {(['all', 'sent', 'queued', 'failed'] as const).map(f => (
                    <button key={f} onClick={() => setLogFilter(f)} className={`px-3 h-7 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${logFilter === f ? f === 'sent' ? 'bg-emerald-500 text-white' : f === 'queued' ? 'bg-amber-500 text-white' : f === 'failed' ? 'bg-red-500 text-white' : 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hoandr:bg-slate-200'}`}>
                      {f === 'all' ? `Hepsi (${emailLogs.length})` : f === 'sent' ? `Gonderildi (${sentCount})` : f === 'queued' ? `Sirada (${queuedCount})` : `Basarisiz (${failedCount})`}
                    </button>
                  ))}
                </div>
                {filteredLogs.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center opacity-40"><p className="text-[11px] font-black text-slate-400 uppercase">Kayit yok</p></div>
                ) : (
                  <div className="flex-1 oandrflow-y-auto">
                    <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1.5fr_1fr_80px] px-5 py-2.5 bg-slate-50 border-b border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-400">
                      <span>company</span><span>Gonderen</span><span>Alici Email</span><span>Konu</span><span>Status</span><span>Yanit</span>
                    </div>
                    {filteredLogs.slice().reandrse().map((log, i) => (
                      <div key={i} className="grid grid-cols-[2fr_1.5fr_1.5fr_1.5fr_1fr_80px] items-center px-5 py-3 border-b border-slate-50 hoandr:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center text-[9px] font-black text-blue-600 shrink-0">{log.companyName.charAt(0)}</div>
                          <span className="text-[11px] font-bold text-slate-800 truncate">{log.companyName}</span>
                        </div>
                        <span className="text-[9px] text-blue-500 truncate pr-2">{log.sentFromEmail || 'manual'}</span>
                        <span className="text-[10px] text-slate-500 truncate pr-2">{log.companyEmail}</span>
                        <span className="text-[10px] text-slate-500 truncate pr-2">{log.subject}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase w-fit ${log.status==='sent'?'bg-emerald-100 text-emerald-700':log.status==='queued'?'bg-amber-100 text-amber-700':'bg-red-100 text-red-600'}`}>{log.status==='sent'?'Gonderildi':log.status==='queued'?'Sirada':'Basarisiz'}</span>
                        <div>{log.hasReply ? <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">Yanit Var</span> : <span className="text-[8px] text-slate-300">Bekliyor</span>}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* INBOX TAB */}
            {actiandTab === 'inbox' && (
              <div className="flex-1 oandrflow-y-auto">
                {senderAccounts.filter(a => a.isConnected).length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center gap-4 p-10 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-3xl flex items-center justify-center text-2xl font-black text-white">M</div>
                    <h3 className="text-base font-black text-slate-700">Gmail Hesabi Baglanmadi</h3>
                    <p className="text-[12px] text-slate-400 max-w-xs">"Gmail Hesaplari" sekmesinden Gmail hesabinizi addyin.</p>
                    <button onClick={() => setActiandTab('accounts')} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider">Hesap Add</button>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center gap-3 text-center p-10">
                    <p className="text-[11px] font-black text-slate-400 uppercase">{senderAccounts.filter(a=>a.isConnected).length} Hesap Bagli</p>
                    <p className="text-[10px] text-slate-400">Gelen kutusu icerigi Gmail API ile gosterilir.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GmailCenter;
