
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const DB_KEY = 'deepvera_local_db';

  const loadUsers = () => {
    const saved = localStorage.getItem(DB_KEY);
    if (saved) {
      try {
        setUsers(JSON.parse(saved));
      } catch (e) {
        console.error("Yönetici verisi okunamadı", e);
      }
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const saveUsersToDB = (updatedUsers: User[]) => {
    localStorage.setItem(DB_KEY, JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const addTokens = (username: string, amount: number) => {
    const updated = users.map(u => 
      u.username === username ? { ...u, tokenBalance: (u.tokenBalance || 0) + amount } : u
    );
    saveUsersToDB(updated);
  };

  const deleteUser = (username: string) => {
    if (window.confirm(`${username} kullanıcısını silmek istediğinize emin misiniz?`)) {
      const updated = users.filter(u => u.username !== username);
      saveUsersToDB(updated);
    }
  };

  const makePro = (username: string) => {
    const updated = users.map(u => 
      u.username === username ? { ...u, isPro: true } : u
    );
    saveUsersToDB(updated);
  };

  const exportUsersToCSV = () => {
    if (users.length === 0) return;
    const headers = ["Kullanici Adi", "Isim", "E-Posta", "Firma Adi", "Bakiye", "Uyelik Tipi", "Sabit Tel", "Mobil Tel"];
    const rows = users.map(u => [
      u.username,
      u.name,
      u.email,
      u.companyName || '',
      u.tokenBalance || 0,
      u.isPro ? 'PRO' : 'Standart',
      u.companyFixedPhone || '',
      u.companyMobilePhone || ''
    ]);

    const csvContent = [
      "sep=;",
      headers.join(";"),
      ...rows.map(row => row.map(cell => `"${(cell || "").toString().replace(/"/g, '""')}"`).join(";"))
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `DeepVera_Uye_Raporu_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalTokens = users.reduce((acc, u) => acc + (u.tokenBalance || 0), 0);
  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[500] bg-slate-900 flex flex-col animate-fade-in text-white">
      {/* Admin Header */}
      <div className="h-24 border-b border-white/10 flex items-center justify-between px-12 bg-slate-900/50 backdrop-blur-2xl shrink-0">
         <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black shadow-2xl shadow-blue-500/30">A</div>
            <div>
               <h2 className="text-white font-black text-2xl uppercase tracking-tighter">DeepVera HQ Central</h2>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Süper Yönetici Kontrol İstasyonu</p>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <button onClick={exportUsersToCSV} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center gap-2">
               📊 Liste Çıktısı Al
            </button>
            <button onClick={loadUsers} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all">🔄</button>
            <button onClick={onClose} className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl">Konsolu Kapat</button>
         </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col p-12 gap-10">
         {/* Stats Cards */}
         <div className="grid grid-cols-4 gap-8 shrink-0">
            <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] space-y-3 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl group-hover:scale-125 transition-transform">👥</div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Toplam Üye</p>
               <h3 className="text-5xl font-black text-white">{users.length}</h3>
            </div>
            <div className="p-10 bg-blue-600/10 border border-blue-500/20 rounded-[3rem] space-y-3 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl group-hover:scale-125 transition-transform">💎</div>
               <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Aktif Token Hacmi</p>
               <h3 className="text-5xl font-black text-blue-500">{totalTokens.toLocaleString()}</h3>
            </div>
            <div className="p-10 bg-amber-500/10 border border-amber-500/20 rounded-[3rem] space-y-3 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl group-hover:scale-125 transition-transform">👑</div>
               <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">Pro Lisanslar</p>
               <h3 className="text-5xl font-black text-amber-500">{users.filter(u => u.isPro).length}</h3>
            </div>
            <div className="p-10 bg-emerald-500/10 border border-emerald-500/20 rounded-[3rem] space-y-3 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl group-hover:scale-125 transition-transform">🛡️</div>
               <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Sistem Statüsü</p>
               <h3 className="text-5xl font-black text-emerald-500">ÇEVRİMİÇİ</h3>
            </div>
         </div>

         {/* User List Table */}
         <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-[4rem] overflow-hidden flex flex-col shadow-3xl">
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
               <div className="flex items-center gap-6">
                  <h4 className="text-[12px] font-black text-white uppercase tracking-[0.3em]">Üye Yönetim Paneli</h4>
                  <span className="px-4 py-1.5 bg-white/5 rounded-full text-[10px] font-bold text-slate-400">Filtrele: "{searchTerm || 'Hepsi'}"</span>
               </div>
               <input 
                 type="text" 
                 placeholder="Kullanıcı adı, şirket veya e-posta ara..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="bg-slate-800 border border-white/10 rounded-2xl px-8 py-4 text-xs text-white outline-none focus:border-blue-500 w-[400px] shadow-inner"
               />
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar px-4">
               <table className="w-full text-left border-separate border-spacing-y-4">
                  <thead>
                     <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                        <th className="px-8 py-4">Kullanıcı Bilgisi</th>
                        <th className="px-8 py-4">İletişim & Şirket</th>
                        <th className="px-8 py-4">Şifre & Durum</th>
                        <th className="px-8 py-4">Token Bakiyesi</th>
                        <th className="px-8 py-4 text-right">Yönetimsel İşlemler</th>
                     </tr>
                  </thead>
                  <tbody>
                     {filteredUsers.map((u, i) => (
                        <tr key={i} className="bg-white/[0.02] hover:bg-white/[0.05] transition-all rounded-3xl overflow-hidden group">
                           <td className="px-8 py-6 first:rounded-l-[2rem]">
                              <div className="flex items-center gap-5">
                                 <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-lg font-black shadow-lg">
                                    {u.username.charAt(0).toUpperCase()}
                                 </div>
                                 <div>
                                    <p className="text-sm font-black text-white group-hover:text-blue-400 transition-colors">{u.username}</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">{u.name}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <p className="text-[11px] font-bold text-slate-300">{u.email}</p>
                              <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter mt-1">{u.companyName}</p>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex flex-col gap-2">
                                 <div className="flex items-center gap-2">
                                    <span className="text-[8px] font-black text-slate-500 uppercase">ŞİFRE:</span>
                                    <span className="text-[10px] font-black text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-md">{u.password}</span>
                                 </div>
                                 <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md w-fit ${u.isPro ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-700 text-slate-400'}`}>
                                    {u.isPro ? '💎 PRO ÜYE' : 'STANDART'}
                                 </span>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                 <span className="text-lg font-black text-blue-500">{u.tokenBalance?.toLocaleString() || 0}</span>
                                 <button onClick={() => addTokens(u.username, 1000)} className="w-6 h-6 bg-emerald-500/20 text-emerald-500 rounded-lg flex items-center justify-center text-xs hover:bg-emerald-500 hover:text-white transition-all">+</button>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-right last:rounded-r-[2rem]">
                              <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                 {!u.isPro && (
                                    <button onClick={() => makePro(u.username)} className="px-4 py-2 bg-amber-600/20 text-amber-500 border border-amber-600/30 rounded-xl text-[9px] font-black uppercase hover:bg-amber-600 hover:text-white transition-all">PRO YAP</button>
                                 )}
                                 <button onClick={() => deleteUser(u.username)} className="px-4 py-2 bg-red-600/20 text-red-500 border border-red-600/30 rounded-xl text-[9px] font-black uppercase hover:bg-red-600 hover:text-white transition-all">SİL</button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminPanel;
