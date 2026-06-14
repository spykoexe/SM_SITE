import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Eye, EyeOff, LogIn, Shield, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [tempToken, setTempToken] = useState("");
  const [code, setCode] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { login, verify2FA } = useAuthStore();
  const navigate = useNavigate();

  // Charger les identifiants sauvegardés au montage
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await login(email, password);
      
      // Sauvegarder les identifiants si "Se souvenir de moi" est coché
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberedPassword", password);
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }
      
      if (result.requires2FA) {
        setRequires2FA(true);
        setTempToken(result.tempToken || "");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }

  async function handle2FA(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await verify2FA(tempToken, code);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Code invalide");
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
          <h1 className="text-2xl font-semibold text-white mb-1">Connexion</h1>
          <p className="text-sm text-[#737373]">Accédez à votre compte SM</p>
        </div>

        {error && <div className="mb-5 p-3 rounded-md bg-red-500/10 text-red-400 text-sm border border-red-500/20">{error}</div>}

        {!requires2FA ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-[#a1a1aa] mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2.5 rounded-md bg-[#131316] border border-white/[0.06] text-[#e8e8e8] text-sm focus:border-white/[0.12] focus:outline-none transition-colors placeholder:text-[#525252]" placeholder="vous@exemple.com" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#a1a1aa] mb-1.5">Mot de passe</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2.5 rounded-md bg-[#131316] border border-white/[0.06] text-[#e8e8e8] text-sm focus:border-white/[0.12] focus:outline-none transition-colors pr-10 placeholder:text-[#525252]" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#525252] hover:text-[#a1a1aa] transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="rememberMe" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-white/[0.2] bg-[#131316] text-white focus:ring-white/[0.2] focus:ring-offset-0"
              />
              <label htmlFor="rememberMe" className="text-[13px] text-[#a1a1aa] cursor-pointer">
                Se souvenir de moi
              </label>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-white text-[#0a0a0c] py-2.5 rounded-md text-sm font-medium hover:bg-[#e8e8e8] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4" /> {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        ) : (
          <form onSubmit={handle2FA} className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-md bg-[#1a1a1e] border border-white/[0.06] text-[#a1a1aa] text-sm">
              <Shield className="w-4 h-4 shrink-0" />
              <span>Code d'authentification requis</span>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#a1a1aa] mb-1.5">Code 2FA</label>
              <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required maxLength={6} className="w-full px-3 py-2.5 rounded-md bg-[#131316] border border-white/[0.06] text-[#e8e8e8] text-sm focus:border-white/[0.12] focus:outline-none transition-colors text-center text-xl tracking-[0.5em] font-mono placeholder:text-[#525252]" placeholder="000000" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-white text-[#0a0a0c] py-2.5 rounded-md text-sm font-medium hover:bg-[#e8e8e8] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" /> {loading ? "Vérification..." : "Vérifier"}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-[#737373] mt-6">
          Pas encore de compte ? <Link to="/register" className="text-[#e8e8e8] hover:text-white font-medium">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}
