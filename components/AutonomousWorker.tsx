import React, { useState, useEffect, useRef } from 'react';
import { Participant, User } from '../types';
import { sendGmail } from '../services/gmailService';

interface Props {
  user: User | null;
  participants: Participant[];
  updateParticipant: (id: string, updates: Partial<Participant>) => void;
  updateUser?: (updates: Partial<User>) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenIdentity?: () => void;
}

const INTERVAL_SEC = 180;

function buildEmailBody(target: Participant, user: User): { subject: string; body: string } {
  const sc = user.companyName || 'DeepVera';
  const sp = user.authorizedPerson || 'Yetkili';
  const pitch = user.globalPitch || '';
  const web = user.companyWebsite || '';
  const subject = sc + " - Is Birligi Teklifi";
  const l1 = "Sayin " + target.name + " Ekibi,";
  const l2 = sc + " adina sizinle iletisime geciyoruz.";
  const l3 = pitch.length > 10 ? pitch : (sc + " olarak sektorunuze ozel cozumler sunmaktayiz.");
  const l4 = "Detayli bilgi ve gorusme icin bize ulasabilirsiniz.";
  const l5 = web ? ("Web: " + web) : "";
  const cls = "Saygilarimizla,\n" + sp + "\n" + sc;
  const parts = [l1, "", l2, "", l3, "", l4];
  if (l5) parts.push(l5);
  parts.push("", cls);
  return { subject, body: parts.join("\n") };
}

const AutonomousWorker: React.FC<Props> = ({
  user, participants, updateParticipant, updateUser, isOpen, onClose, onOpenIdentity
}) => {
  const [isActive, setIsActive] = useState(false);
  const [currentTask, setCurrentTask] = useState("");
  const [rotationLog, setRotationLog] = useState<{msg: string, type: string}[]>([]);
  const [countdown, setCountdown] = useState(0);
  const [identityWarning, setIdentityWarning] = useState(false);
  const timerRef = useRef<any>(null);
  const countdownRef = useRef<any>(null);
  const isActiveRef = useRef(false);

  const queuedLeads = participants.filter(p => p.automationStatus === 'queued');
  const sentLeads = participants.filter(p => p.automationStatus === 'sent');
  const senderPool = user?.senderAccounts || [];
  const totalInQueue = queuedLeads.length + sentLeads.length;
  const progressPct = totalInQueue > 0 ? (sentLeads.length / totalInQueue) * 100 : 0;
  const successRate = participants.length > 0 ? Math.round((sentLeads.length / participants.length) * 100) : 0;

  const addLog = (msg: string, type: string = 'info') =>
    setRotationLog(prev => [{ msg, type }, ...prev].slice(0, 30));

  const isIdentityComplete = () => {
    if (!user) return false;
    return !!(user.companyName && user.companyName.length > 1 && user.globalPitch && user.globalPitch.length > 5);
  };

  const fmt = (s: number) => Math.floor(s / 60) + ":" + ((s % 60) < 10 ? "0" : "") + (s % 60);

  const runStep = async () => {
    if (!isActiveRef.current || !user) return;
    const target = participants.find(p => p.automationStatus === 'queued' && p.email && p.email.includes('@'));
    if (!target) {
      setCurrentTask("Tum Gorevler Tamamlandi");
      addLog("Kuyrukdaki tum islemler basariyla sonuclandi.", "success");
      isActiveRef.current = false;
      setIsActive(false);
      return;
    }
    const sIdx = user.currentSenderIndex || 0;
    const sender = senderPool.length > 0 ? senderPool[sIdx % senderPool.length] : null;
    if (!sender) {
      setCurrentTask("Gmail Kanal Hatasi");
      addLog("Bagli aktif Gmail kanali yok!", "error");
      isActiveRef.current = false;
      setIsActive(false);
      return;
    }
    try {
      setCurrentTask(target.name + " gonderiliyor...");
      updateParticipant(target.id, { automationStatus: 'sending' });
      const { subject, body } = buildEmailBody(target, user);
      await sendGmail(sender.accessToken, target.email, subject, body);
      addLog(target.name + " -> " + sender.email + " uzerinden gonderildi.", "success");
      updateParticipant(target.id, { automationStatus: 'sent', funnelStatus: 'contacted', sentAt: new Date().toISOString(), sentFromEmail: sender.email });
      try {
        const logs = JSON.parse(localStorage.getItem('deepvera_email_logs') || '[]');
        logs.push({ id: Math.random().toString(36).substr(2,9), companyName: target.name, companyEmail: target.email, subject, status: 'sent', sentAt: new Date().toISOString(), userId: (user as any).id || 'u', emailType: 'initial', hasReply: false });
        localStorage.setItem('deepvera_email_logs', JSON.stringify(logs));
      } catch(_) {}
      if (updateUser && senderPool.length > 0) updateUser({ currentSenderIndex: (sIdx + 1) % senderPool.length });
      setCountdown(INTERVAL_SEC);
      setCurrentTask("Sonraki gonderi bekleniyor (3 dk)...");
      timerRef.current = setTimeout(() => { if (isActiveRef.current) runStep(); }, INTERVAL_SEC * 1000);
    } catch (err: any) {
      updateParticipant(target.id, { automationStatus: 'failed' });
      addLog("Hata: " + target.name + " iletilemedi.", "error");
      setCountdown(INTERVAL_SEC);
      timerRef.current = setTimeout(() => { if (isActiveRef.current) runStep(); }, INTERVAL_SEC * 1000);
    }
  };

  useEffect(() => {
    if (countdown > 0) {
      countdownRef.current = setInterval(() => setCountdown(p => Math.max(0, p - 1)), 1000);
    } else clearInterval(countdownRef.current);
    return () => clearInterval(countdownRef.current);
  }, [countdown]);

  const handleStart = () => {
    if (!isIdentityComplete()) {
      setIdentityWarning(true);
      addLog("Firma Kimligi eksik! Lutfen doldurun.", "warn");
      return;
    }
    if (senderPool.length === 0) {
      addLog("Gmail hesabi bagli degil! Ayarlardan Gmail baglayin.", "error");
      return;
    }
    setIdentityWarning(false);
    isActiveRef.current = true;
    setIsActive(true);
    addLog("Otonom sistem baslatildi. Her 3 dakikada bir gonderi.", "info");
  };

  const handleStop = () => {
    isActiveRef.current = false;
    setIsActive(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setCountdown(0);
    setCurrentTask("Sistem Durduruldu");
    addLog("Otonom sistem durduruldu.", "warn");
  };

  useEffect(() => {
    if (isActive) { isActiveRef.current = true; runStep(); }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isActive]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1100] bg-slate-950/50 backdrop-blur-xl flex items-center justify-center p-3 animate-fade-in">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden" style={{ height: 'min(90dvh, 720px)' }}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center text-base shadow">&#129302;</div>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none">Otonom Sevk Unitesi</h3>
              <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mt-0.5">3 Dakikada Bir Otomatik Gonderi</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-slate-50 text-slate-400 rounded-lg hover:bg-red-500 hover:text-white transition-all text-lg border border-slate-100 flex items-center justify-center">&times;</button>
        </div>

        {identityWarning && (
          <div className="mx-4 mt-3 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center shrink-0 text-amber-600 font-black text-sm">!</div>
            <div className="flex-1">
              <p className="text-[11px] font-black text-amber-800 mb-1">Firma Kimligi &amp; AI Konfigurasyonu Eksik</p>
              <p className="text-[10px] text-amber-700 leading-relaxed">Mail gondermeden once firma adinizi ve AI deger onerinizi doldurmaniz gerekiyor.</p>
              <button onClick={() => { setIdentityWarning(false); onClose(); if (onOpenIdentity) onOpenIdentity(); }}
                className="mt-2 px-4 py-1.5 bg-amber-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all">
                Firma Kimligini Doldur &rarr;
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-slate-50/40">
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-1 bg-slate-900 rounded-xl p-4 flex flex-col justify-between min-h-[120px]">
              <div className="flex items-center gap-2 mb-2">
                <span className={"w-2 h-2 rounded-full shrink-0 " + (isActive ? "bg-emerald-400 animate-pulse" : "bg-slate-600")} />
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Durum</span>
              </div>
              <div>
                {(currentTask && currentTask.length > 0) ? <p className="text-[11px] font-black text-white leading-tight">{currentTask}</p> : null}
                {countdown > 0 && (
                  <div className="mt-2">
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest">Sonraki gonderi</p>
                    <p className="text-[18px] font-black font-mono text-blue-400 leading-tight">{fmt(countdown)}</p>
                  </div>
                )}
              </div>
              <div className="mt-3">
                <div className="flex justify-between mb-1">
                  <span className="text-[8px] text-slate-600 uppercase tracking-wider">Ilerleme</span>
                  <span className="text-[8px] font-black text-blue-400">%{Math.round(progressPct)}</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: progressPct + "%" }} />
                </div>
              </div>
            </div>
            {[
              { label: "Bekleyen", value: String(queuedLeads.length), color: "text-slate-800", bg: "text-2xl" },
              { label: "Gmail Kanal", value: String(senderPool.length), color: "text-blue-600", bg: "text-2xl" },
              { label: "Basari", value: "%" + successRate, color: "text-emerald-600", bg: "text-2xl" },
            ].map(s => (
              <div key={s.label} className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-1 hover:border-blue-200 transition-all">
                <span className={"font-black leading-none " + s.bg + " " + s.color}>{s.value}</span>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">{s.label}</span>
              </div>
            ))}
          </div>

          <div className={"p-3 rounded-xl border flex items-center gap-3 " + (isIdentityComplete() ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200")}>
            <div className={"w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black shrink-0 " + (isIdentityComplete() ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>
              {isIdentityComplete() ? String.fromCharCode(10003) : "!"}
            </div>
            <div className="flex-1 min-w-0">
              <p className={"text-[10px] font-black " + (isIdentityComplete() ? "text-emerald-800" : "text-amber-800")}>
                Firma Kimligi: {isIdentityComplete() ? "Tamamlandi" : "Eksik - Mail gonderilemez"}
              </p>
              {isIdentityComplete() && user?.companyName && (
                <p className="text-[9px] text-emerald-600 truncate">{user.companyName}</p>
              )}
            </div>
            {!isIdentityComplete() && (
              <button onClick={() => { onClose(); if (onOpenIdentity) onOpenIdentity(); }}
                className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all shrink-0">
                Doldur &rarr;
              </button>
            )}
          </div>

          <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-50 bg-slate-50/60">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gercek Zamanli Islem Gunlugu</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-red-300 rounded-full" /><div className="w-2 h-2 bg-amber-300 rounded-full" /><div className="w-2 h-2 bg-emerald-300 rounded-full" />
              </div>
            </div>
            <div className="p-4 h-48 overflow-y-auto custom-scrollbar font-mono text-[10px] space-y-2">
              {rotationLog.length === 0 ? (
                <span className="text-slate-400 italic">Sistem baslatilmaya hazir. Kuyrukta {queuedLeads.length} firma bekliyor.</span>
              ) : rotationLog.map((log, i) => (
                <div key={i} className={"flex gap-3 pb-1.5 border-b border-slate-50 last:border-0 " + (log.type === "success" ? "text-emerald-600" : log.type === "error" ? "text-red-500" : log.type === "warn" ? "text-amber-600" : "text-slate-400")}>
                  <span className="opacity-40 shrink-0">[{new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]</span>
                  <span>{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 py-3 border-t border-slate-100 bg-white shrink-0 flex flex-col gap-2">
          {!isIdentityComplete() && (
            <p className="text-[9px] text-center text-amber-600 font-bold uppercase tracking-widest">
              Mail gondermeden once Firma Kimligini doldurun
            </p>
          )}
          <button
            onClick={isActive ? handleStop : handleStart}
            disabled={queuedLeads.length === 0 && !isActive}
            className={"w-full py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 " + (isActive ? "bg-red-500 text-white hover:bg-red-600" : "bg-slate-900 text-white hover:bg-blue-600") + " disabled:opacity-30 disabled:cursor-not-allowed"}
          >
            {isActive ? "Durdur" : "Basla - Her 3 Dakikada Bir Gonderi"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutonomousWorker;
