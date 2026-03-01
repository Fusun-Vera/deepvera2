
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';

interface LoginFormProps {
  onLogin: (user: User) => void;
  onCancel: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onCancel }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const DB_KEY = 'deepvera_local_db';

  // Veritabanını güvenli oku
  const syncLocalUsers = () => {
    try {
      const saved = localStorage.getItem(DB_KEY);
      if (saved) {
        const users = JSON.parse(saved);
        setRegisteredUsers(users);
        return users;
      }
    } catch (e) {
      console.error("DB Okuma Hatası", e);
    }
    return [];
  };

  useEffect(() => {
    syncLocalUsers();
  }, [mode, showDebug]);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    companyName: '',
    companyDescription: '',
    companyFixedPhone: '',
    companyMobilePhone: '',
    companyAddress: '',
    authorizedPerson: '',
    companyLogo: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, companyLogo: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const inputUser = formData.username.trim().toLowerCase();
    const inputPass = formData.password.trim();

    setTimeout(() => {
      // 1. ÖNCE ADMIN KONTROLÜ (Veritabanından bağımsız)
      if (inputUser === 'admin' && inputPass === 'admin') {
        const adminUser: User = {
          username: 'admin',
          name: 'Sistem Yöneticisi',
          email: 'admin@deepvera.ai',
          isPro: true,
          role: 'admin',
          provider: 'local',
          tokenBalance: 999999,
          companyName: 'DeepVera AI Headquarters'
        };
        onLogin(adminUser);
        setLoading(false);
        return;
      }

      // 2. DEMO KONTROLÜ
      if (inputUser === 'demo' && inputPass === 'demo') {
        onLogin({
          username: 'demo',
          name: 'Demo Kullanıcı',
          email: 'demo@deepvera.ai',
          isPro: true,
          role: 'user',
          provider: 'demo',
          tokenBalance: 5000,
          companyName: 'DeepVera AI Solutions'
        });
        setLoading(false);
        return;
      }

      const currentDB = syncLocalUsers();

      if (mode === 'signup') {
        if (currentDB.some((u: User) => u.username.toLowerCase() === inputUser)) {
          setErrorMessage("Bu kullanıcı adı zaten sistemde kayıtlı!");
          setLoading(false);
          return;
        }

        const newUser: User = {
          ...formData,
          username: inputUser,
          password: inputPass,
          name: formData.authorizedPerson || formData.username,
          isPro: false,
          role: 'user',
          provider: 'local',
          tokenBalance: 1500
        };
        
        const updatedDB = [...currentDB, newUser];
        localStorage.setItem(DB_KEY, JSON.stringify(updatedDB));
        onLogin(newUser);
      } else {
        const user = currentDB.find((u: User) => u.username.toLowerCase() === inputUser);
        
        if (!user) {
          setErrorMessage(`"${inputUser}" adında bir kayıt bulunamadı!`);
          setShowDebug(true);
        } else if (user.password !== inputPass) {
          setErrorMessage("Kullanıcı doğru ancak şifre hatalı!");
          setShowDebug(true);
        } else {
          onLogin(user);
        }
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-slate-100 flex items-center justify-center p-4 overflow-hidden">
      <div className={`bg-white w-full ${mode === 'signup' ? 'max-w-4xl' : 'max-w-md'} max-h-[90vh] rounded-[3rem] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.2)] border border-white overflow-hidden flex flex-col transition-all duration-500`}>
        {errorMessage && (
          <div className="bg-red-600 text-white p-3.5 text-center text-[11px] font-black uppercase tracking-widest z-[100] animate-pulse">
             ⚠️ {errorMessage}
          </div>
        )}

        <div className="p-8 pb-4 text-center">
           <div className="w-14 h-14 bg-slate-900 rounded-2xl mx-auto flex items-center justify-center text-white text-xl font-black mb-4 shadow-xl">DV</div>
           <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-6">AI DeepVera Intelligence</h2>
           
           <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl w-full max-w-[240px] mx-auto">
              <button onClick={() => setMode('login')} className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'login' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}>Giriş</button>
              <button onClick={() => setMode('signup')} className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'signup' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}>Kayıt Ol</button>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'login' ? (
              <div className="space-y-4">
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Kullanıcı Adı</label>
                    <input type="text" name="username" required value={formData.username} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all" placeholder="Örn: aimusic" />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Şifre</label>
                    <input type="password" name="password" required value={formData.password} onChange={handleInputChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all" placeholder="••••••••" />
                 </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-3xl border border-slate-100">
                       <div onClick={() => fileInputRef.current?.click()} className="w-16 h-16 bg-white border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 cursor-pointer overflow-hidden flex-shrink-0">
                          {formData.companyLogo ? <img src={formData.companyLogo} className="w-full h-full object-cover" alt="Logo" /> : <span className="text-[10px] font-black uppercase">LOGO</span>}
                          <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleLogoUpload} />
                       </div>
                       <div><h4 className="text-[10px] font-black text-slate-900 uppercase">Firma Logosu</h4><p className="text-[8px] text-slate-400 font-bold uppercase mt-1">İmza alanında görünür.</p></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       <input type="text" name="username" placeholder="Giriş Adı" required value={formData.username} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none" />
                       <input type="password" name="password" placeholder="Şifre" required value={formData.password} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none" />
                    </div>
                    <input type="text" name="companyName" placeholder="Şirket Tam Adı" required value={formData.companyName} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none" />
                    <div className="grid grid-cols-2 gap-3">
                       <input type="text" name="authorizedPerson" placeholder="Yetkili İsim" required value={formData.authorizedPerson} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none" />
                       <input type="email" name="email" placeholder="Kurumsal E-Posta" required value={formData.email} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none" />
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                       <input type="text" name="companyFixedPhone" placeholder="Sabit Tel" value={formData.companyFixedPhone} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none" />
                       <input type="text" name="companyMobilePhone" placeholder="GSM" value={formData.companyMobilePhone} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none" />
                    </div>
                    <input type="text" name="companyAddress" placeholder="Şirket Adresi" value={formData.companyAddress} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none" />
                    <textarea name="companyDescription" required placeholder="Hangi sektörde, ne üretiyorsunuz? AI bu bilgilere göre teklif kurgular." value={formData.companyDescription} onChange={handleInputChange} className="w-full h-32 p-4 bg-blue-50/20 border border-blue-100 rounded-2xl text-[11px] font-medium outline-none resize-none focus:border-blue-400" />
                 </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-95">
              {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : mode === 'login' ? 'Sisteme Güvenli Giriş' : 'Kaydı Tamamla ve Başlat'}
            </button>

            <div className="flex justify-between items-center px-4">
               <button type="button" onClick={onCancel} className="text-[9px] font-black text-slate-300 uppercase tracking-widest hover:text-red-500 transition-colors">← Geri Dön</button>
               <button type="button" onClick={() => { setShowDebug(!showDebug); syncLocalUsers(); }} className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:text-slate-900 transition-all underline underline-offset-4">Giriş Yardımı? (Şifre Hatırlatıcı)</button>
            </div>
          </form>

          {showDebug && (
            <div className="mt-8 bg-slate-900 p-6 rounded-[2.5rem] border border-slate-800 shadow-3xl fade-in">
               <div className="flex justify-between items-center mb-6">
                  <h5 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Cihazdaki Kayıtlı Hesaplar</h5>
                  <button onClick={() => setShowDebug(false)} className="text-white/20 hover:text-white text-xl">&times;</button>
               </div>
               {registeredUsers.length === 0 ? (
                 <p className="text-[9px] text-slate-500 font-bold uppercase text-center py-4">Sistemde henüz bir yerel kayıt bulunamadı.</p>
               ) : (
                 <div className="space-y-4 max-h-[250px] overflow-y-auto no-scrollbar">
                    {registeredUsers.map((u, i) => (
                      <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center group hover:border-blue-500/50 transition-all">
                         <div className="flex flex-col gap-1">
                            <p className="text-xs font-black text-white">{u.username}</p>
                            <p className="text-[8px] text-slate-500 font-black uppercase">{u.companyName}</p>
                         </div>
                         <div className="text-right flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                               <span className="text-[8px] font-black text-slate-500 uppercase">Şifre:</span>
                               <span className="text-[9px] font-black text-white bg-blue-600 px-2 py-0.5 rounded-lg">{u.password}</span>
                            </div>
                            <span className="text-[7px] text-emerald-500 font-black uppercase">Bakiye: {u.tokenBalance}</span>
                         </div>
                      </div>
                    ))}
                    <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10 mt-6">
                       <p className="text-[8px] text-blue-300 font-black uppercase text-center leading-relaxed">Admin girişi için: admin / admin</p>
                    </div>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
