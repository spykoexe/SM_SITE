import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { api } from "@/services/api";
import { useAuthStore } from "@/stores/authStore";
import { Star, Users, MessageSquare, Server, ArrowRight, ExternalLink, Zap, Globe, ShoppingBag, Sword, Newspaper } from "lucide-react"; // Users gardé pour STAT_ITEMS

const SERVERS = [
  { name: "SM Développement", description: "Création de bots Discord, développement sur mesure, projets web et solutions innovantes.", link: "https://discord.gg/bjjYxp2he", guildId: "", icon: Zap },
  { name: "SM Community", description: "Une communauté active pour échanger, s'entraider et partager de bons moments.", link: "https://discord.gg/RGJV3n7wjg", guildId: "", icon: Globe },
  { name: "SM INFO", description: "Toute l'actualité, les annonces importantes et les nouveautés du réseau SM.", link: "https://discord.gg/FURnS9HuV6", guildId: "", icon: Newspaper },
  { name: "SM SHOP", description: "Services, ressources et produits exclusifs à découvrir.", link: "https://discord.gg/JpMfSUkB9G", guildId: "", icon: ShoppingBag },
  { name: "Serveur RP", description: "Roleplay immersif : incarnez votre personnage dans l'univers SM.", link: "https://discord.gg/UN3rNye9CC", guildId: "", icon: Sword },
];

interface Review { id: string; rating: number; comment: string; createdAt: string; user: { displayName: string; username: string }; }

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();
  const [stats, setStats]               = useState({ members: 0, reviews: 0, tickets: 0, servers: 6 });
  const [displayed, setDisplayed]       = useState({ members: 0, reviews: 0, tickets: 0, servers: 6 });
  const [statsLoaded, setStatsLoaded]   = useState(true);
  const prevStats                        = useRef({ members: 0, reviews: 0, tickets: 0, servers: 6 });
  const [reviews, setReviews]           = useState<Review[]>([]);
  const [loadingReviews, setLoading]    = useState(false);
  const [contact, setContact]           = useState({ name: "", email: "", message: "" });
  const [contactLoading, setCLoading]   = useState(false);
  const [contactSuccess, setCSuccess]   = useState("");
  
  // Temporarily disabled API calls due to database connection issues
  // const fetchStats = () => {
  //   api.get("/public/stats").then(r => {
  //     if (r?.success) { setStats(r.data); setStatsLoaded(true); }
  //   });
  // };

  // useEffect(() => {
  //   fetchStats();
  //   const interval = setInterval(fetchStats, 30000);
  //   api.get("/public/reviews").then(r => { if (r?.success) setReviews(r.data); setLoading(false); }).catch(() => setLoading(false));
  //   return () => clearInterval(interval);
  // }, []);

  /* Compteur animé : chaque fois que stats change, anime de l'ancienne vers la nouvelle valeur */
  useEffect(() => {
    const duration = 1200;
    const steps = 40;
    const interval = duration / steps;
    const start = { ...prevStats.current };
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplayed({
        members:  Math.round(start.members  + (stats.members  - start.members)  * ease),
        reviews:  Math.round(start.reviews  + (stats.reviews  - start.reviews)  * ease),
        tickets:  Math.round(start.tickets  + (stats.tickets  - start.tickets)  * ease),
        servers:  Math.round(start.servers  + (stats.servers  - start.servers)  * ease),
      });
      if (step >= steps) {
        clearInterval(timer);
        prevStats.current = { ...stats };
      }
    }, interval);
    return () => clearInterval(timer);
  }, [stats]);

  async function handleContact(e: React.FormEvent) {
    e.preventDefault(); setCLoading(true);
    try {
      const r = await api.post("/public/tickets", { name: contact.name, email: contact.email, subject: "Contact site", message: contact.message });
      if (r?.success) { setCSuccess("Message envoye ! Nous vous repondrons rapidement."); setContact({ name: "", email: "", message: "" }); }
    } finally { setCLoading(false); }
  }

  const STAT_ITEMS = [
    { label: "Membres",  value: displayed.members > 0 ? displayed.members.toLocaleString("fr-FR") : "—", icon: Users         },
    { label: "Serveurs", value: displayed.servers > 0 ? displayed.servers.toString()               : "—", icon: Server        },
    { label: "Avis",     value: displayed.reviews > 0 ? displayed.reviews.toLocaleString("fr-FR") : "—", icon: Star          },
    { label: "Tickets",  value: displayed.tickets > 0 ? displayed.tickets.toLocaleString("fr-FR") : "—", icon: MessageSquare },
  ];

  return (
    <div className="bg-mesh">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 py-28 overflow-hidden">
        <div className="relative max-w-3xl mx-auto animate-fade-up">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-semibold tracking-wide"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#888888" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" style={{ animation: "pulse 2s infinite" }} />
            6 serveurs actifs — Communauté en ligne
          </div>

          <h1 className="text-6xl sm:text-8xl font-black mb-6 leading-none font-display text-white">
            Réseau SM
          </h1>

          <p className="text-[#64748b] text-lg sm:text-xl leading-relaxed mb-10 max-w-xl mx-auto">
            Rejoins-nous dès maintenant et participe à l'évolution de la communauté SM. Que tu sois développeur, créateur, entrepreneur ou simplement à la recherche d'une communauté conviviale, tu trouveras ta place parmi nous !<br className="hidden sm:block" /> Ensemble, construisons quelque chose de grand.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="#discord" className="btn-accent text-base px-7 py-3">
              Rejoindre <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#reviews" className="btn-ghost text-base px-7 py-3">
              Voir les avis
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="w-px h-10 bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </section>

      {/* ── STATS ────────────────────────────────── */}
      <section className="py-16 px-6 border-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        {/* Indicateur live */}
        <div className="max-w-5xl mx-auto flex justify-end mb-3">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-medium" style={{ color: "#444444" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-white/40" style={{ animation: "pulse 2s infinite" }} />
            Temps réel · actualisation 30s
          </div>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STAT_ITEMS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="stat-card text-center" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 mx-auto text-white/40"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-3xl font-black font-display text-white mb-1 tabular-nums">
                {statsLoaded ? s.value : <span className="inline-block w-10 h-7 skeleton" />}
              </p>
                <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "#444444" }}>{s.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── SERVERS ──────────────────────────────── */}
      <section id="discord" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="section-label">
              <span className="w-4 h-px bg-white/20 inline-block" />
              Discord
            </p>
            <h2 className="section-title">Nos serveurs Discord</h2>
            <p className="section-sub">Cinq serveurs, une seule communaute.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVERS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.name} className="card-premium p-6 flex flex-col gap-4 group cursor-pointer">
                  <div className="server-icon">
                    <Icon className="w-6 h-6 text-white/70" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#f1f5f9] text-base mb-2 font-display">{s.name}</h3>
                    <p className="text-[13px] leading-relaxed" style={{ color: "#555555" }}>{s.description}</p>
                  </div>
                  <div className="flex items-center justify-end pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <a href={s.link} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold transition-all duration-200 hover:gap-2.5"
                      style={{ color: "#888888" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#f0f0f0")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#888888")}>
                      Rejoindre <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ──────────────────────────────── */}
      <section id="reviews" className="py-24 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between mb-14 flex-wrap gap-6">
            <div>
              <p className="section-label"><span className="w-4 h-px bg-white/20 inline-block" /> Témoignages</p>
              <h2 className="section-title">Avis de la communauté</h2>
              <p className="section-sub">Ce que nos membres pensent du réseau SM.</p>
            </div>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-ghost self-start">Laisser un avis</Link>
            ) : (
              <Link to="/register" className="btn-ghost self-start">Laisser un avis</Link>
            )}
          </div>

          {loadingReviews ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1,2,3].map(i => <div key={i} className="skeleton h-36" />)}
            </div>
          ) : reviews.length === 0 ? (
            <div className="card-premium p-14 text-center">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <Star className="w-7 h-7 text-white/40" />
              </div>
              <p className="font-semibold text-[#e2e8f0] mb-1">Aucun avis pour le moment</p>
              <p className="text-sm" style={{ color: "#444444" }}>Soyez le premier à partager votre expérience !</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {reviews.slice(0, 6).map((r) => (
                <div key={r.id} className="card-premium p-5 flex flex-col gap-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < r.rating ? "star-filled" : "star-empty"}`} />
                    ))}
                  </div>
                  <p className="text-[13px] leading-relaxed flex-1" style={{ color: "#94a3b8" }}>{r.comment}</p>
                  <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <span className="text-[13px] font-semibold text-[#e2e8f0]">{r.user.displayName || r.user.username}</span>
                    <span className="text-[11px]" style={{ color: "#334155" }}>{new Date(r.createdAt).toLocaleDateString("fr-FR")}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────── */}
      <section id="contact" className="py-24 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-xl mx-auto">
          <div className="mb-12">
            <p className="section-label"><span className="w-4 h-px bg-white/20 inline-block" /> Support</p>
            <h2 className="section-title">Nous contacter</h2>
            <p className="section-sub">Une question ? Notre équipe vous répondra rapidement.</p>
          </div>

          {contactSuccess ? (
            <div className="card-premium p-10 text-center">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <Star className="w-7 h-7 text-white/40" />
              </div>
              <p className="font-semibold text-[#e2e8f0]">{contactSuccess}</p>
            </div>
          ) : (
            <form onSubmit={handleContact} className="card-premium p-7 flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-semibold uppercase tracking-widest" style={{ color: "#555555" }}>Nom</label>
                  <input value={contact.name} onChange={e => setContact(f => ({...f, name: e.target.value}))}
                    required placeholder="Votre nom" className="input-premium" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-semibold uppercase tracking-widest" style={{ color: "#555555" }}>Email</label>
                  <input type="email" value={contact.email} onChange={e => setContact(f => ({...f, email: e.target.value}))}
                    required placeholder="vous@exemple.com" className="input-premium" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-semibold uppercase tracking-widest" style={{ color: "#555555" }}>Message</label>
                <textarea value={contact.message} onChange={e => setContact(f => ({...f, message: e.target.value}))}
                  required rows={5} placeholder="Votre message..." className="input-premium resize-none" />
              </div>
              <button type="submit" disabled={contactLoading} className="btn-accent py-3 w-full disabled:opacity-50 disabled:cursor-not-allowed">
                {contactLoading ? "Envoi en cours..." : "Envoyer le message"}
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}