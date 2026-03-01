import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface AdminPanelProps {
  onClose: () => void;
  currentUser: User | null;
}

const USERS_DB_KEY = 'deepvera_users_database';
const SEARCHES_KEY = 'deepvera_user_searches';
const PAYMENTS_KEY = 'deepvera_payment_history';
const EMAIL_LOG_KEY = 'deepvera_email_logs';

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, currentUser }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [searches, setSearches] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [emailLogs, setEmailLogs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'searches' | 'payments' | 'emails' | 'system'>('users');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [tokenInput, setTokenInput] = useState('');
  const [emailFilter, setEmailFilter] = useState<'all' | 'sent' | 'queued' | 'failed'>('all');

  const refreshData = () => {
    const savedUsers = localStorage.getItem(USERS_DB_KEY);
    setUsers(savedUsers ? JSON.parse(savedUsers) : []);
    const savedSearches = localStorage.getItem(SEARCHES_KEY);
    setSearches(savedSearches ? JSON.parse(savedSearches) : []);
    const savedPayments = localStorage.getItem(PAYMENTS_KEY);
    setPayments(savedPayments ? JSON.parse(savedPayments) : []);
    const savedEmails = localStorage.getItem(EMAIL_LOG_KEY);
    setEmailLogs(savedEmails ? JSON.parse(savedEmails) : []);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const saveUsers = (updated: any[]) => {
    setUsers(updated);
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(updated));
  };

  const handleUpdateTokens = (userId: string, amount: number) => {
    saveUsers(users.map(u => u.id === userId ? { ...u, tokenBalance: Math.max(0, (u.tokenBalance || 0) + amount) } : u));
  };

  const handleSetTokens = (userId: string, amount: number) => {
    saveUsers(users.map(u => u.id === userId ? { ...u, tokenBalance: Math.max(0, amount) } : u));
    setTokenInput('');
  };

  const deleteUser = (userId: string) => {
    if (confirm('Bu kullaniciyi silmek istediginize emin misiniz?')) {
      saveUsers(users.filter(u => u.id !== userId));
      if (selectedUser?.id === userId) setSelectedUser(null);
    }
  };

  const filteredUsers = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalTokens = users.reduce((a, u) => a + (u.tokenBalance || 0), 0);
  const totalPaid = payments.reduce((a, p) => a + (p.amount || 0), 0);
  const sentEmailCount = emailLogs.filter(l => l.status === 'sent').length;
  const queuedEmailCount = emailLogs.filter(l => l.status === 'queued').length;

  const userSearches = selectedUser ? searches.filter(s => s.userId === selectedUser.id) : [];
  const userPayments = selectedUser ? payments.filter(p => p.userId === selectedUser.id) : [];

  const filteredEmailLogs = emailFilter === 'all' ? emailLogs : emailLogs.filter(l => l.status === emailFilter);

  const tabs = [
    { id: 'users', label: 'Kullanicilar' },
    { id: 'searches', label: 'Searchlar' },
    { id: 'payments', label: 'Odemeler' },
    { id: 'emails', label: 'Emaillar' },
    { id: 'system', label: 'Sistem' },
  ];

  return (
    <div className="fixed inset-0 z-[500] bg-slate-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 h-14 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center font-black text-white text-xs relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/50 to-transparent" />
            DV
          </div>
          <div>
            <span className="text-[13px] font-black text-slate-900 tracking-tight">Admin Panel</span>
            <span className="text-[10px] font-bold text-slate-400 ml-2">DeepVera Command Center</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setSelectedUser(null); }}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab.label}
                {tab.id === 'emails' && emailLogs.length > 0 && (
                  <span className="ml-1.5 text-[8px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full">{emailLogs.length}</span>
                )}
              </button>
            ))}
          </div>
          <button onClick={onClose} className="px-4 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
            Kapat
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-white border-b border-slate-100 px-6 py-3 flex flex-wrap gap-6 shrink-0">
        {[
          { label: 'Toplam Kullanici', value: users.length, color: 'text-slate-900' },
          { label: 'Toplam Token', value: totalTokens.toLocaleString('tr-TR'), color: 'text-blue-600' },
          { label: 'Toplam Search', value: searches.length, color: 'text-violet-600' },
          { label: 'Odeme Islem', value: payments.length, color: 'text-emerald-600' },
          { label: 'Toplam Gelir', value: totalPaid.toLocaleString('tr-TR') + ' TL', color: 'text-emerald-700' },
          { label: 'Email Gonderildi', value: sentEmailCount, color: 'text-blue-600' },
          { label: 'Email Sirada', value: queuedEmailCount, color: 'text-amber-600' },
        ].map((s, i) => (
          <div key={i} className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</span>
            <span className={`text-[15px] font-black ${s.color}`}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <>
            <div className={`flex flex-col ${selectedUser ? 'w-[55%]' : 'w-full'} border-r border-slate-100 overflow-hidden transition-all`}>
              <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-3">
                <div className="relative flex-1">
                  <svg className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  <input type="text" placeholder="Kullanici, email ara..." value={search} onChange={e => setSearch(e.target.value)} className="w-full h-8 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-[12px] font-medium outline-none focus:border-blue-400 transition-colors" />
                </div>
                <span className="text-[10px] font-bold text-slate-400">{filteredUsers.length} kullanici</span>
              </div>
              {filteredUsers.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center opacity-40">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2">Kayitli kullanici yok</p>
                    <p className="text-[10px] text-slate-400 mt-1">Kullanicilar giris yaptikca burada gorunecek</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto">
                  <div className="grid grid-cols-[2fr_2fr_1fr_80px] px-5 py-2 bg-slate-50 border-b border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-400">
                    <span>Kullanici</span><span>Email</span><span>Token</span><span className="text-right">Delete</span>
                  </div>
                  {filteredUsers.map(u => (
                    <div
                      key={u.id}
                      onClick={() => setSelectedUser(selectedUser?.id === u.id ? null : u)}
                      className={`grid grid-cols-[2fr_2fr_1fr_80px] items-center px-5 py-3 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${selectedUser?.id === u.id ? 'bg-blue-50 border-blue-100' : ''}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center font-black text-slate-600 text-xs shrink-0 uppercase">
                          {(u.name || u.username || '?').charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[12px] font-bold text-slate-900 truncate">{u.name || u.username}</div>
                          <div className="text-[10px] text-slate-400 truncate">@{u.username}</div>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate pr-3">{u.email || '-'}</div>
                      <div className="text-[13px] font-black text-blue-600">{(u.tokenBalance || 0).toLocaleString('tr-TR')}</div>
                      <div className="flex items-center justify-end">
                        <button onClick={e => { e.stopPropagation(); deleteUser(u.id); }} className="w-6 h-6 bg-red-50 hover:bg-red-500 text-red-400 hover:text-white rounded flex items-center justify-center transition-all text-xs leading-none">&times;</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User detail panel */}
            {selectedUser && (
              <div className="flex-1 flex flex-col overflow-hidden bg-white">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center font-black text-white uppercase">
                      {(selectedUser.name || selectedUser.username || '?').charAt(0)}
                    </div>
                    <div>
                      <div className="text-[14px] font-black text-slate-900">{selectedUser.name || selectedUser.username}</div>
                      <div className="text-[10px] text-slate-400">{selectedUser.email}</div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedUser(null)} className="w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 transition-colors text-sm leading-none">&times;</button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                  {/* Token management */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Token Yonetimi</h4>
                      <div className="text-[22px] font-black text-blue-600">{(users.find(u => u.id === selectedUser.id)?.tokenBalance || 0).toLocaleString('tr-TR')} <span className="text-[11px] font-bold text-slate-400">DV</span></div>
                    </div>
                    <div className="flex gap-2 mb-3">
                      {[100, 500, 1000, 5000].map(amt => (
                        <button key={amt} onClick={() => handleUpdateTokens(selectedUser.id, amt)} className="flex-1 h-8 bg-emerald-50 hover:bg-emerald-500 border border-emerald-100 hover:border-emerald-500 text-emerald-600 hover:text-white rounded-lg text-[10px] font-black transition-all">+{amt}</button>
                      ))}
                    </div>
                    <div className="flex gap-2 mb-3">
                      {[100, 500, 1000].map(amt => (
                        <button key={amt} onClick={() => handleUpdateTokens(selectedUser.id, -amt)} className="flex-1 h-8 bg-red-50 hover:bg-red-500 border border-red-100 hover:border-red-500 text-red-400 hover:text-white rounded-lg text-[10px] font-black transition-all">-{amt}</button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input type="number" placeholder="Miktar gir" value={tokenInput} onChange={e => setTokenInput(e.target.value)} className="flex-1 h-8 px-3 bg-white border border-slate-200 rounded-lg text-[12px] font-medium outline-none focus:border-blue-400 transition-colors" />
                      <button onClick={() => tokenInput && handleSetTokens(selectedUser.id, parseInt(tokenInput))} className="px-4 h-8 bg-blue-600 text-white rounded-lg text-[10px] font-black hover:bg-blue-700 transition-colors">Ayarla</button>
                    </div>
                  </div>
                  {/* User searches */}
                  <div>
                    <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-widest mb-3">Search Gecmisi ({userSearches.length})</h4>
                    {userSearches.length === 0 ? (
                      <div className="text-[11px] text-slate-400 py-4 text-center bg-slate-50 rounded-xl border border-slate-100">Henuz search yapilmamis</div>
                    ) : (
                      <div className="space-y-2">
                        {userSearches.slice().reverse().map((s, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-xs shrink-0 font-black">{s.firmCount || 0}</div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[11px] font-bold text-slate-800 truncate">{s.sector || 'Genel'} &mdash; {s.location || '-'}</div>
                              <div className="text-[9px] text-slate-400">{new Date(s.date).toLocaleString('tr-TR')}</div>
                            </div>
                            <div className="text-[10px] font-black text-red-400 shrink-0">-{s.tokensUsed || 0} DV</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* User payments */}
                  <div>
                    <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-widest mb-3">Odeme Gecmisi ({userPayments.length})</h4>
                    {userPayments.length === 0 ? (
                      <div className="text-[11px] text-slate-400 py-4 text-center bg-slate-50 rounded-xl border border-slate-100">Odeme islemi bulunamadi</div>
                    ) : (
                      <div className="space-y-2">
                        {userPayments.slice().reverse().map((p, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 shrink-0 font-bold text-sm">$</div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[11px] font-bold text-slate-800">+{(p.tokens || 0).toLocaleString('tr-TR')} DV Token</div>
                              <div className="text-[9px] text-slate-400">{p.packageName} &bull; {new Date(p.date).toLocaleString('tr-TR')}</div>
                            </div>
                            <div className="text-[12px] font-black text-emerald-600 shrink-0">{(p.amount || 0).toLocaleString('tr-TR')} TL</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* SEARCHES TAB */}
        {activeTab === 'searches' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100">
              <span className="text-[11px] font-black text-slate-700">{searches.length} toplam search kaydedildi</span>
            </div>
            {searches.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center opacity-40">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Henuz search verisi yok</p>
                  <p className="text-[10px] text-slate-400 mt-1">Kullanicilar analiz yaptikca burada gorunecek</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr_1fr] px-5 py-2 bg-slate-50 border-b border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-400">
                  <span>Kullanici</span><span>Sektor</span><span>Location</span><span>Firma</span><span>Token</span><span>Date</span>
                </div>
                {searches.slice().reverse().map((s, i) => {
                  const u = users.find(u => u.id === s.userId);
                  return (
                    <div key={i} className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr_1fr] items-center px-5 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-600 shrink-0 uppercase">{(u?.name || u?.username || '?').charAt(0)}</div>
                        <span className="text-[11px] font-bold text-slate-700 truncate">{u?.name || u?.username || s.userId}</span>
                      </div>
                      <span className="text-[11px] text-slate-600 truncate">{s.sector || 'Genel'}</span>
                      <span className="text-[11px] text-slate-600 truncate">{s.location || '-'}</span>
                      <span className="text-[11px] font-bold text-blue-600">{s.firmCount || 0} firma</span>
                      <span className="text-[11px] font-black text-red-400">-{s.tokensUsed || 0}</span>
                      <span className="text-[10px] text-slate-400">{new Date(s.date).toLocaleDateString('tr-TR')}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === 'payments' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-4">
              <span className="text-[11px] font-black text-slate-700">{payments.length} odeme islemi</span>
              <span className="text-[11px] font-black text-emerald-600">Toplam: {totalPaid.toLocaleString('tr-TR')} TL</span>
            </div>
            {payments.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center opacity-40">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Henuz odeme islemi yok</p>
                  <p className="text-[10px] text-slate-400 mt-1">Kullanicilar token satin aldikca burada gorunecek</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-[2fr_2fr_1.5fr_1fr_1fr] px-5 py-2 bg-slate-50 border-b border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-400">
                  <span>Kullanici</span><span>Paket</span><span>Token</span><span>Tutar</span><span>Date</span>
                </div>
                {payments.slice().reverse().map((p, i) => {
                  const u = users.find(u => u.id === p.userId);
                  return (
                    <div key={i} className="grid grid-cols-[2fr_2fr_1.5fr_1fr_1fr] items-center px-5 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded bg-emerald-100 flex items-center justify-center text-[10px] font-black text-emerald-600 shrink-0 uppercase">{(u?.name || u?.username || '?').charAt(0)}</div>
                        <span className="text-[11px] font-bold text-slate-700 truncate">{u?.name || u?.username || p.userId}</span>
                      </div>
                      <span className="text-[11px] text-slate-600">{p.packageName || '-'}</span>
                      <span className="text-[13px] font-black text-blue-600">+{(p.tokens || 0).toLocaleString('tr-TR')} DV</span>
                      <span className="text-[13px] font-black text-emerald-600">{(p.amount || 0).toLocaleString('tr-TR')} TL</span>
                      <span className="text-[10px] text-slate-400">{new Date(p.date).toLocaleDateString('tr-TR')}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* EMAILS TAB */}
        {activeTab === 'emails' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Filter + summary bar */}
            <div className="px-5 py-3 border-b border-slate-100 bg-white flex items-center gap-4 flex-wrap shrink-0">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[11px] font-black text-slate-700">{emailLogs.length} toplam email</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg uppercase tracking-widest">{sentEmailCount} Gonderildi</span>
                  <span className="text-[9px] font-black text-amber-600 bg-amber-50 border border-amber-100 px-2 py-1 rounded-lg uppercase tracking-widest">{queuedEmailCount} Sirada</span>
                </div>
              </div>
              <div className="ml-auto flex gap-1.5">
                {(['all', 'sent', 'queued', 'failed'] as const).map(f => (
                  <button key={f} onClick={() => setEmailFilter(f)}
                    className={`px-3 h-7 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${emailFilter === f
                      ? f === 'sent' ? 'bg-emerald-500 text-white' : f === 'queued' ? 'bg-amber-500 text-white' : f === 'failed' ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                    {f === 'all' ? 'Hepsi' : f === 'sent' ? 'Gonderildi' : f === 'queued' ? 'Sirada' : 'Basarisiz'}
                  </button>
                ))}
              </div>
            </div>
            {filteredEmailLogs.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center opacity-40">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Email kaydı bulunamadi</p>
                  <p className="text-[10px] text-slate-400 mt-1">Gmail Komuta Merkezi'nden email gonderdikce burada gorunecek</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-[2.5fr_2fr_1.5fr_1fr_1fr] px-5 py-2 bg-slate-50 border-b border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-400">
                  <span>Firma</span><span>Email</span><span>Konu</span><span>Durum</span><span>Date</span>
                </div>
                {filteredEmailLogs.slice().reverse().map((log, i) => (
                  <div key={i} className="grid grid-cols-[2.5fr_2fr_1.5fr_1fr_1fr] items-center px-5 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-[10px] font-black text-blue-600 shrink-0 uppercase">
                        {log.companyName?.charAt(0) || '?'}
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 truncate">{log.companyName}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 truncate pr-3">{log.companyEmail}</span>
                    <span className="text-[10px] text-slate-500 truncate pr-3">{log.subject || '-'}</span>
                    <div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        log.status === 'sent' ? 'bg-emerald-100 text-emerald-700' :
                        log.status === 'queued' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {log.status === 'sent' ? 'Gonderildi' : log.status === 'queued' ? 'Sirada' : 'Basarisiz'}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">{new Date(log.sentAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SYSTEM TAB */}
        {activeTab === 'system' && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl space-y-5">
              <div className="bg-white border border-slate-100 rounded-2xl p-5">
                <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-widest mb-4">Sistem Bilgileri</h4>
                <div className="space-y-2.5">
                  {[
                    { label: 'Active Yonetici', value: currentUser?.username || 'admin', color: 'text-blue-600' },
                    { label: 'Yetki Seviyesi', value: 'Root / Full Access', color: 'text-emerald-600' },
                    { label: 'Platform', value: 'DeepVera v3.1', color: 'text-slate-700' },
                    { label: 'Sistem Durumu', value: 'ONLINE', color: 'text-emerald-600' },
                    { label: 'Kayitli Kullanici', value: users.length + ' kisi', color: 'text-slate-700' },
                    { label: 'Toplam Search', value: searches.length + ' islem', color: 'text-violet-600' },
                    { label: 'Toplam Odeme', value: totalPaid.toLocaleString('tr-TR') + ' TL', color: 'text-emerald-700' },
                    { label: 'Email Gonderildi', value: sentEmailCount + ' adet', color: 'text-blue-600' },
                    { label: 'Email Sirada', value: queuedEmailCount + ' adet', color: 'text-amber-600' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                      <span className={`text-[12px] font-black ${item.color}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                <h4 className="text-[11px] font-black text-red-600 uppercase tracking-widest mb-2">Tehlikeli Bolge</h4>
                <p className="text-[11px] text-red-400 mb-4">Bu islemler geri alinamaz. Dikkatli kullanin.</p>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => { if (confirm('Tum kullanici verilerini silmek istiyor musunuz?')) { localStorage.removeItem(USERS_DB_KEY); setUsers([]); }}} className="px-4 h-9 bg-red-100 hover:bg-red-500 text-red-600 hover:text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">Kullanicilari Delete</button>
                  <button onClick={() => { if (confirm('Tum search verilerini silmek istiyor musunuz?')) { localStorage.removeItem(SEARCHES_KEY); setSearches([]); }}} className="px-4 h-9 bg-red-100 hover:bg-red-500 text-red-600 hover:text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">Searchlari Delete</button>
                  <button onClick={() => { if (confirm('Email loglarini silmek istiyor musunuz?')) { localStorage.removeItem(EMAIL_LOG_KEY); setEmailLogs([]); }}} className="px-4 h-9 bg-red-100 hover:bg-red-500 text-red-600 hover:text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">Email Loglarini Delete</button>
                  <button onClick={() => { if (confirm('TUM sistem sifirlanacak! Onayliyor musunuz?')) { localStorage.clear(); window.location.reload(); }}} className="px-4 h-9 bg-red-500 hover:bg-red-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">Sistemi Sifirla</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
