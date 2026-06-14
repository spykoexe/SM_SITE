import { useState } from "react";
import { api } from "@/services/api";
import { Send, CheckCircle } from "lucide-react";

export default function AnnouncementsPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("INFO");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await api.post("/admin/announcements", { title, message, type });
      if (res?.success) {
        setSuccess(`Annonce envoyée à ${res.data.recipients} utilisateurs !`);
        setTitle("");
        setMessage("");
      } else {
        setError(res?.message || "Erreur");
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'envoi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Nouvelle annonce</h2>
        <p className="text-[13px] text-[#737373]">Envoyez une notification à tous les utilisateurs.</p>
      </div>

      {success && (
        <div className="flex items-center gap-2 p-3 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
          <CheckCircle className="w-4 h-4" /> {success}
        </div>
      )}
      {error && (
        <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[13px] font-medium text-[#a1a1aa] mb-1.5">Titre</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-3 py-2.5 rounded-md bg-[#131316] border border-white/[0.06] text-[#e8e8e8] text-sm focus:border-white/[0.12] focus:outline-none transition-colors placeholder:text-[#525252]" placeholder="Titre de l'annonce" />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-[#a1a1aa] mb-1.5">Message</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={4} className="w-full px-3 py-2.5 rounded-md bg-[#131316] border border-white/[0.06] text-[#e8e8e8] text-sm focus:border-white/[0.12] focus:outline-none transition-colors placeholder:text-[#525252] resize-none" placeholder="Contenu du message..." />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-[#a1a1aa] mb-1.5">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-[#131316] border border-white/[0.06] text-[#e8e8e8] text-sm focus:border-white/[0.12] focus:outline-none transition-colors">
            <option value="INFO">Info</option>
            <option value="SUCCESS">Succès</option>
            <option value="WARNING">Avertissement</option>
            <option value="ERROR">Erreur</option>
          </select>
        </div>
        <button type="submit" disabled={loading} className="inline-flex items-center gap-2 bg-white text-[#0a0a0c] px-5 py-2.5 rounded-md text-sm font-medium hover:bg-[#e8e8e8] transition-colors disabled:opacity-50">
          <Send className="w-4 h-4" /> {loading ? "Envoi..." : "Envoyer l'annonce"}
        </button>
      </form>
    </div>
  );
}
