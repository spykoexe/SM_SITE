import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Search, ChevronLeft, ChevronRight, UserPlus, Trash2, RotateCcw } from "lucide-react";

const roles = [
  { value: "USER",        label: "Utilisateur"   },
  { value: "PREMIUM",     label: "Premium"       },
  { value: "MODERATOR",   label: "Modérateur"    },
  { value: "ADMIN",       label: "Administrateur"},
  { value: "SUPER_ADMIN", label: "Super Admin"   },
];

const selectStyle = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#e0e0e0", borderRadius: 10, padding: "8px 12px", fontSize: 13, outline: "none" };
const inputStyle  = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#e0e0e0", borderRadius: 10, padding: "8px 12px", fontSize: 13, outline: "none", width: "100%" };

export default function UsersPage() {
  const [users, setUsers]         = useState<any[]>([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [limit]                   = useState(10);
  const [search, setSearch]       = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading]     = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newUser, setNewUser]     = useState({ email: "", username: "", password: "", role: "USER", isActive: true });
  const [message, setMessage]     = useState("");

  async function fetchUsers() {
    setLoading(true);
    const res = await api.get(`/admin/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&role=${roleFilter}`);
    if (res?.success) { setUsers(res.data.users); setTotal(res.data.total); }
    setLoading(false);
  }

  useEffect(() => { fetchUsers(); }, [page, search, roleFilter]);

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    const res = await api.post("/admin/users", newUser);
    if (res?.success) { setMessage("Utilisateur créé"); setShowCreate(false); setNewUser({ email: "", username: "", password: "", role: "USER", isActive: true }); fetchUsers(); }
  }

  async function deleteUser(id: string) {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    const res = await api.delete(`/admin/users/${id}`);
    if (res?.success) { setMessage("Utilisateur supprimé"); fetchUsers(); }
  }

  async function resetPassword(id: string) {
    const pw = prompt("Nouveau mot de passe (min 8 caractères) :");
    if (!pw || pw.length < 8) return;
    const res = await api.post(`/admin/users/${id}/reset-password`, { newPassword: pw });
    if (res?.success) setMessage("Mot de passe réinitialisé");
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-5">
      {message && (
        <div className="p-3 rounded-xl text-sm text-white" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}>
          {message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 flex-1 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#444" }} />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Rechercher..." style={{ ...inputStyle, paddingLeft: 36 }} />
          </div>
          <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }} style={selectStyle}>
            <option value="">Tous les rôles</option>
            {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        <button onClick={() => setShowCreate(v => !v)} className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm">
          <UserPlus className="w-4 h-4" /> Créer
        </button>
      </div>

      {showCreate && (
        <form onSubmit={createUser} className="card-premium p-5 space-y-4">
          <h3 className="font-semibold text-white text-sm">Nouvel utilisateur</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input required type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} style={inputStyle} />
            <input required placeholder="Nom d'utilisateur" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} style={inputStyle} />
            <input required type="password" placeholder="Mot de passe" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} style={inputStyle} />
          </div>
          <div className="flex items-center gap-3">
            <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} style={selectStyle}>
              {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
            <label className="flex items-center gap-2 text-sm" style={{ color: "#666" }}>
              <input type="checkbox" checked={newUser.isActive} onChange={e => setNewUser({ ...newUser, isActive: e.target.checked })} /> Actif
            </label>
            <button type="submit" className="btn-primary ml-auto px-4 py-2 text-sm">Créer</button>
          </div>
        </form>
      )}

      <div className="card-premium overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Utilisateur","Rôle","Dernière connexion","Statut","Actions"].map((h, i) => (
                <th key={h} className={`px-4 py-3 font-medium text-left ${i === 4 ? "text-right" : ""} ${i === 2 ? "hidden md:table-cell" : ""}`}
                  style={{ color: "#444", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-10 text-sm" style={{ color: "#444" }}>Chargement...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-10 text-sm" style={{ color: "#444" }}>Aucun utilisateur trouvé.</td></tr>
            ) : users.map(u => (
              <tr key={u.id} className="transition-colors" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-black shrink-0" style={{ background: "#fff" }}>
                      {(u.displayName || u.username || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-white text-[13px]">{u.displayName || u.username}</p>
                      <p className="text-[11px]" style={{ color: "#555" }}>{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[11px] px-2 py-0.5 rounded-lg uppercase font-medium"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#888" }}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-[13px]" style={{ color: "#555" }}>
                  {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString("fr-FR") : "Jamais"}
                </td>
                <td className="px-4 py-3">
                  <span className="text-[11px] px-2 py-0.5 rounded-lg font-medium"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: u.isActive ? "#e0e0e0" : "#555" }}>
                    {u.isActive ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button onClick={() => resetPassword(u.id)} className="p-1.5 rounded-lg transition-colors" style={{ color: "#555" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "#555")}
                      title="Réinitialiser le mot de passe"><RotateCcw className="w-4 h-4" /></button>
                    <button onClick={() => deleteUser(u.id)} className="p-1.5 rounded-lg transition-colors" style={{ color: "#555" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "#555")}
                      title="Supprimer"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="p-2 rounded-xl transition-colors disabled:opacity-30" style={{ color: "#555", border: "1px solid rgba(255,255,255,0.08)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "#555")}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm px-3" style={{ color: "#555" }}>Page {page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="p-2 rounded-xl transition-colors disabled:opacity-30" style={{ color: "#555", border: "1px solid rgba(255,255,255,0.08)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "#555")}>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}