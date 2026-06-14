import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { useAuthStore } from "@/stores/authStore";
import { formatDate } from "@/lib/utils";
import { User, Mail, Phone, Calendar, Shield, Check, X } from "lucide-react";

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing]  = useState(false);
  const [form, setForm]        = useState({ firstName: "", lastName: "", displayName: "", phone: "", bio: "" });
  const [message, setMessage]  = useState("");

  useEffect(() => {
    api.get("/users/profile").then(res => {
      if (res?.success) {
        setProfile(res.data);
        setForm({ firstName: res.data.firstName || "", lastName: res.data.lastName || "", displayName: res.data.displayName || "", phone: res.data.phone || "", bio: res.data.bio || "" });
      }
    });
  }, []);

  async function handleSave() {
    const res = await api.patch("/users/profile", form);
    if (res?.success) {
      setProfile(res.data);
      setUser({ ...user!, displayName: res.data.displayName });
      setEditing(false);
      setMessage("Profil mis à jour");
      setTimeout(() => setMessage(""), 3000);
    }
  }

  if (!profile) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white/30" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {message && (
        <div className="p-3 rounded-xl text-sm text-white"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
          {message}
        </div>
      )}

      {/* Avatar + nom */}
      <div className="card-premium p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-black shrink-0"
          style={{ background: "#fff" }}>
          {(profile.displayName || profile.username || "U").charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">{profile.displayName || profile.username}</h2>
          <p className="text-sm mt-0.5" style={{ color: "#555" }}>@{profile.username}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[11px] px-2 py-0.5 rounded-lg font-medium"
              style={{ background: profile.isActive ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: profile.isActive ? "#e0e0e0" : "#555" }}>
              {profile.isActive ? "Actif" : "Inactif"}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-lg font-medium uppercase"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#888" }}>
              {profile.role}
            </span>
          </div>
        </div>
      </div>

      {/* Informations */}
      <div className="card-premium p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <User className="w-4 h-4" style={{ color: "#666" }} /> Informations personnelles
          </h3>
          {!editing ? (
            <button onClick={() => setEditing(true)}
              className="text-[13px] transition-colors" style={{ color: "#555" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "#555")}>
              Modifier
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button onClick={handleSave} className="text-[13px] flex items-center gap-1 transition-colors" style={{ color: "#e0e0e0" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "#e0e0e0")}>
                <Check className="w-3.5 h-3.5" /> Enregistrer
              </button>
              <button onClick={() => setEditing(false)} className="text-[13px] flex items-center gap-1 transition-colors" style={{ color: "#555" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "#555")}>
                <X className="w-3.5 h-3.5" /> Annuler
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Email",       value: profile.email,             field: null,           icon: Mail     },
            { label: "Prénom",      value: profile.firstName,         field: "firstName",    icon: null     },
            { label: "Nom",         value: profile.lastName,          field: "lastName",     icon: null     },
            { label: "Nom affiché", value: profile.displayName,       field: "displayName",  icon: null     },
            { label: "Téléphone",   value: profile.phone,             field: "phone",        icon: Phone    },
            { label: "Membre depuis", value: formatDate(profile.createdAt), field: null,     icon: Calendar },
          ].map(f => (
            <div key={f.label}>
              <label className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#444" }}>{f.label}</label>
              {editing && f.field ? (
                <input value={(form as any)[f.field]} onChange={e => setForm({ ...form, [f.field!]: e.target.value })}
                  className="input-premium mt-1.5 text-sm" />
              ) : (
                <div className="flex items-center gap-2 mt-1.5 text-sm text-white">
                  {f.icon && <f.icon className="w-3.5 h-3.5 shrink-0" style={{ color: "#555" }} />}
                  {f.value || "—"}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4">
          <label className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#444" }}>Bio</label>
          {editing ? (
            <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3}
              className="input-premium mt-1.5 text-sm resize-none" />
          ) : (
            <p className="mt-1.5 text-sm text-white">{profile.bio || "—"}</p>
          )}
        </div>
      </div>

      {/* Sécurité */}
      <div className="card-premium p-6">
        <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4" style={{ color: "#666" }} /> Sécurité
        </h3>
        <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div>
            <p className="text-sm font-medium text-white">Double authentification</p>
            <p className="text-xs mt-0.5" style={{ color: "#555" }}>{profile.twoFactorEnabled ? "Votre compte est protégé par 2FA." : "Activez la 2FA pour plus de sécurité."}</p>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded-lg font-medium"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: profile.twoFactorEnabled ? "#e0e0e0" : "#555" }}>
            {profile.twoFactorEnabled ? "Activée" : "Désactivée"}
          </span>
        </div>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium text-white">Dernière connexion</p>
            <p className="text-xs mt-0.5" style={{ color: "#555" }}>{profile.lastLoginAt ? formatDate(profile.lastLoginAt) : "Jamais"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}