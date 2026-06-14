import { useState } from "react";
import { api } from "@/services/api";
import { useAuthStore } from "@/stores/authStore";
import { Eye, EyeOff, Shield, Sun, Bell, Globe, Lock, QrCode, CheckCircle, XCircle } from "lucide-react";

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [notifEmail, setNotifEmail] = useState(!!user?.notificationEmail);

  // 2FA state
  const [twoFAStep, setTwoFAStep] = useState<"idle" | "setup" | "confirm" | "disable">("idle");
  const [qrCode, setQrCode] = useState("");
  const [twoFACode, setTwoFACode] = useState("");
  const [disablePassword, setDisablePassword] = useState("");
  const [twoFALoading, setTwoFALoading] = useState(false);
  const [twoFAError, setTwoFAError] = useState("");
  const [twoFASuccess, setTwoFASuccess] = useState("");

  async function handleSetup2FA() {
    setTwoFALoading(true); setTwoFAError("");
    try {
      const res = await api.post("/auth/2fa/setup", {});
      if (res?.success) { setQrCode(res.data.qrCodeUrl); setTwoFAStep("setup"); }
      else setTwoFAError(res?.message || "Erreur lors de la configuration");
    } finally { setTwoFALoading(false); }
  }

  async function handleConfirm2FA(e: React.FormEvent) {
    e.preventDefault(); setTwoFALoading(true); setTwoFAError("");
    try {
      const res = await api.post("/auth/2fa/confirm", { code: twoFACode });
      if (res?.success) {
        setTwoFASuccess("Double authentification activée avec succès !");
        setTwoFAStep("idle"); setTwoFACode("");
        useAuthStore.setState(s => s.user ? { user: { ...s.user, twoFactorEnabled: true } } : {});
      } else setTwoFAError(res?.message || "Code invalide");
    } finally { setTwoFALoading(false); }
  }

  async function handleDisable2FA(e: React.FormEvent) {
    e.preventDefault(); setTwoFALoading(true); setTwoFAError("");
    try {
      const res = await api.post("/auth/2fa/disable", { password: disablePassword });
      if (res?.success) {
        setTwoFASuccess("Double authentification désactivée.");
        setTwoFAStep("idle"); setDisablePassword("");
        useAuthStore.setState(s => s.user ? { user: { ...s.user, twoFactorEnabled: false } } : {});
      } else setTwoFAError(res?.message || "Mot de passe incorrect");
    } finally { setTwoFALoading(false); }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setMessage("");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { setError("Les mots de passe ne correspondent pas"); return; }
    const res = await api.post("/users/change-password", { currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
    if (res?.success) {
      setMessage("Mot de passe modifié avec succès");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } else { setError(res?.message || "Erreur"); }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {message && <div className="p-3 rounded-lg text-sm" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e8e8e8" }}>{message}</div>}
      {error && <div className="p-3 rounded-lg text-sm" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#f0f0f0" }}>{error}</div>}

      <div className="card-premium p-6">
        <h3 className="font-semibold flex items-center gap-2 mb-5 text-white"><Globe className="w-4 h-4" style={{ color: "#666" }} /> Préférences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-3">
              <Sun className="w-4 h-4" style={{ color: "#555" }} />
              <div>
                <p className="text-sm font-medium text-white">Thème</p>
                <p className="text-xs" style={{ color: "#555" }}>Apparence de l'interface</p>
              </div>
            </div>
            <select className="rounded-lg px-3 py-1.5 text-sm font-medium text-white outline-none transition-colors" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} defaultValue={user?.theme || "SYSTEM"}>
              <option value="LIGHT">Clair</option>
              <option value="DARK">Sombre</option>
              <option value="SYSTEM">Système</option>
            </select>
          </div>
          <div className="flex items-center justify-between py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4" style={{ color: "#555" }} />
              <div>
                <p className="text-sm font-medium text-white">Notifications email</p>
                <p className="text-xs" style={{ color: "#555" }}>Recevoir les notifications par email</p>
              </div>
            </div>
            <button onClick={() => setNotifEmail(v => !v)}
              className="w-11 h-6 rounded-full transition-all duration-200 relative"
              style={{ background: notifEmail ? "#fff" : "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform duration-200"
                style={{ background: notifEmail ? "#0a0a0a" : "rgba(255,255,255,0.5)", transform: notifEmail ? "translateX(20px)" : "translateX(0)" }} />
            </button>
          </div>
          <div className="flex items-center justify-between py-3.5">
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4" style={{ color: "#555" }} />
              <div>
                <p className="text-sm font-medium text-white">Langue</p>
                <p className="text-xs" style={{ color: "#555" }}>Langue de l'interface</p>
              </div>
            </div>
            <select className="rounded-lg px-3 py-1.5 text-sm font-medium text-white outline-none transition-colors" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} defaultValue={user?.language || "fr"}>
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card-premium p-6">
        <h3 className="font-semibold flex items-center gap-2 mb-5 text-white"><Lock className="w-4 h-4" style={{ color: "#666" }} /> Sécurité</h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="text-[12px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "#555" }}>Mot de passe actuel</label>
            <div className="relative">
              <input type={showCurrent ? "text" : "password"} value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required className="input-premium pr-10" />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors" style={{ color: "#555" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "#555")}>
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-[12px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "#555" }}>Nouveau mot de passe</label>
            <div className="relative">
              <input type={showNew ? "text" : "password"} value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required minLength={8} className="input-premium pr-10" />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors" style={{ color: "#555" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "#555")}>
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-[12px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "#555" }}>Confirmer le nouveau mot de passe</label>
            <input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} required className="input-premium" />
          </div>
          <button type="submit" className="btn-primary px-5 py-2.5">Changer le mot de passe</button>
        </form>
      </div>

      {/* 2FA */}
      <div className="card-premium p-6">
        <h3 className="font-semibold flex items-center gap-2 mb-5 text-white"><QrCode className="w-4 h-4" style={{ color: "#666" }} /> Double authentification</h3>

        {twoFAError && <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#f0f0f0" }}>{twoFAError}</div>}
        {twoFASuccess && <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e8e8e8" }}>{twoFASuccess}</div>}

        {twoFAStep === "idle" && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Statut</p>
              <p className="text-xs mt-0.5" style={{ color: "#555" }}>Sécurisez votre compte avec une application d'authentification.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg"
                style={user?.twoFactorEnabled
                  ? { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#e8e8e8" }
                  : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "#555" }}>
                {user?.twoFactorEnabled ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                {user?.twoFactorEnabled ? "Activée" : "Désactivée"}
              </span>
              {user?.twoFactorEnabled ? (
                <button onClick={() => { setTwoFAStep("disable"); setTwoFAError(""); setTwoFASuccess(""); }}
                  className="px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-200"
                  style={{ border: "1px solid rgba(255,255,255,0.12)", color: "#888", background: "transparent" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#888"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"; }}>
                  Désactiver
                </button>
              ) : (
                <button onClick={handleSetup2FA} disabled={twoFALoading}
                  className="btn-primary px-4 py-1.5 text-sm disabled:opacity-50">
                  {twoFALoading ? "Chargement..." : "Activer"}
                </button>
              )}
            </div>
          </div>
        )}

        {twoFAStep === "setup" && (
          <div className="space-y-5">
            <div>
              <p className="text-sm font-medium text-white mb-1">Scannez ce QR code</p>
              <p className="text-xs mb-4" style={{ color: "#555" }}>Utilisez Google Authenticator, Authy ou une application similaire.</p>
              <div className="flex justify-center">
                <div className="p-3 rounded-xl" style={{ background: "#fff", display: "inline-block" }}>
                  <img src={qrCode} alt="QR Code 2FA" className="w-40 h-40" />
                </div>
              </div>
            </div>
            <form onSubmit={handleConfirm2FA} className="space-y-3">
              <div>
                <label className="text-[12px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "#555" }}>Code de vérification</label>
                <input value={twoFACode} onChange={e => setTwoFACode(e.target.value)} required maxLength={6} placeholder="000000"
                  className="input-premium text-center text-xl tracking-[0.4em] font-mono" />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={twoFALoading || twoFACode.length < 6}
                  className="btn-primary flex-1 disabled:opacity-50">
                  {twoFALoading ? "Vérification..." : "Confirmer"}
                </button>
                <button type="button" onClick={() => { setTwoFAStep("idle"); setTwoFACode(""); setTwoFAError(""); }}
                  className="btn-ghost flex-1">Annuler</button>
              </div>
            </form>
          </div>
        )}

        {twoFAStep === "disable" && (
          <form onSubmit={handleDisable2FA} className="space-y-4">
            <div>
              <p className="text-sm font-medium text-white mb-1">Désactiver la double authentification</p>
              <p className="text-xs mb-4" style={{ color: "#555" }}>Confirmez votre mot de passe pour désactiver la 2FA.</p>
              <label className="text-[12px] font-semibold uppercase tracking-widest mb-2 block" style={{ color: "#555" }}>Mot de passe</label>
              <input type="password" value={disablePassword} onChange={e => setDisablePassword(e.target.value)} required
                placeholder="••••••••" className="input-premium" />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={twoFALoading || !disablePassword}
                className="btn-primary flex-1 disabled:opacity-50">
                {twoFALoading ? "Désactivation..." : "Désactiver"}
              </button>
              <button type="button" onClick={() => { setTwoFAStep("idle"); setDisablePassword(""); setTwoFAError(""); }}
                className="btn-ghost flex-1">Annuler</button>
            </div>
          </form>
        )}
      </div>

      <div className="card-premium p-6" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <h3 className="font-semibold flex items-center gap-2 mb-5" style={{ color: "#888" }}><Shield className="w-4 h-4" /> Zone dangereuse</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Déconnexion</p>
            <p className="text-xs mt-0.5" style={{ color: "#555" }}>Vous serez déconnecté de toutes les sessions.</p>
          </div>
          <button onClick={logout} className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#888", background: "transparent" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.3)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#888"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)"; }}>
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}
