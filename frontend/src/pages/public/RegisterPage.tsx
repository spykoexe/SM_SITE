import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Eye, EyeOff, UserPlus, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const [form, setForm] = useState({ email: "", username: "", password: "", displayName: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Erreur d'inscription");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#0a0a0c]">
      <div className="w-full max-w-sm">
        <Link to="/" className="inline-flex items-center gap-1.5 text-[#737373] hover:text-[#e8e8e8] text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Retour
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white mb-1">Inscription</h1>
          <p className="text-sm text-[#737373]">Créez votre compte SM</p>
        </div>

        {error && <div className="mb-5 p-3 rounded-md bg-red-500/10 text-red-400 text-sm border border-red-500/20">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-[#a1a1aa] mb-1.5">Nom d'utilisateur</label>
            <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required className="w-full px-3 py-2.5 rounded-md bg-[#131316] border border-white/[0.06] text-[#e8e8e8] text-sm focus:border-white/[0.12] focus:outline-none transition-colors placeholder:text-[#525252]" placeholder="user123" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#a1a1aa] mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full px-3 py-2.5 rounded-md bg-[#131316] border border-white/[0.06] text-[#e8e8e8] text-sm focus:border-white/[0.12] focus:outline-none transition-colors placeholder:text-[#525252]" placeholder="vous@exemple.com" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#a1a1aa] mb-1.5">Nom affiché <span className="text-[#525252] font-normal">(optionnel)</span></label>
            <input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} className="w-full px-3 py-2.5 rounded-md bg-[#131316] border border-white/[0.06] text-[#e8e8e8] text-sm focus:border-white/[0.12] focus:outline-none transition-colors placeholder:text-[#525252]" placeholder="Votre nom" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#a1a1aa] mb-1.5">Mot de passe</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} className="w-full px-3 py-2.5 rounded-md bg-[#131316] border border-white/[0.06] text-[#e8e8e8] text-sm focus:border-white/[0.12] focus:outline-none transition-colors pr-10 placeholder:text-[#525252]" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#525252] hover:text-[#a1a1aa] transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-[#525252] mt-1.5">Minimum 8 caractères.</p>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-white text-[#0a0a0c] py-2.5 rounded-md text-sm font-medium hover:bg-[#e8e8e8] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            <UserPlus className="w-4 h-4" /> {loading ? "Inscription..." : "Créer mon compte"}
          </button>
        </form>

        <p className="text-center text-sm text-[#737373] mt-6">
          Déjà un compte ? <Link to="/login" className="text-[#e8e8e8] hover:text-white font-medium">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
