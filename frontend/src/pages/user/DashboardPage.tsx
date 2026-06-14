import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/services/api";
import { useAuthStore } from "@/stores/authStore";
import { formatDate } from "@/lib/utils";
import { Activity, Bell, Clock, Shield, Star, MessageSquare, UserCheck, ArrowLeft } from "lucide-react";

export default function UserDashboard() {
  const { user } = useAuthStore();
  const [activity, setActivity]           = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [stats, setStats]                 = useState({ reviews: 0, tickets: 0 });

  useEffect(() => {
    api.get("/users/activity").then(r => { if (r?.success) setActivity(r.data); });
    api.get("/users/notifications").then(r => { if (r?.success) setNotifications(r.data); });
    api.get("/public/stats").then(r => { if (r?.success) setStats(r.data); });
  }, []);

  const statCards = [
    { label: "Avis publiés",    value: stats.reviews,                              icon: Star         },
    { label: "Tickets",         value: stats.tickets,                              icon: MessageSquare },
    { label: "Sessions actives",value: "—",                                        icon: UserCheck    },
    { label: "2FA",             value: user?.twoFactorEnabled ? "Activée" : "Désactivée", icon: Shield },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">Bienvenue, {user?.displayName || user?.username} !</h2>
          <p className="text-sm mt-1" style={{ color: "#555" }}>Voici un aperçu de votre activité récente.</p>
        </div>
        <Link to="/" className="btn-ghost flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => (
          <div key={s.label} className="card-premium p-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <s.icon className="w-4.5 h-4.5 text-white/50" />
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs mt-0.5" style={{ color: "#555" }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card-premium p-6">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-4 h-4" style={{ color: "#666" }} />
            <h3 className="font-semibold text-white text-sm">Activité récente</h3>
          </div>
          <div className="space-y-0">
            {activity.length === 0 ? (
              <p className="text-sm" style={{ color: "#444" }}>Aucune activité récente.</p>
            ) : activity.slice(0, 5).map(a => (
              <div key={a.id} className="flex items-center justify-between py-2.5"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: "#444" }} />
                  <span className="text-[13px] text-white">{a.action}</span>
                </div>
                <span className="text-[11px]" style={{ color: "#444" }}>{formatDate(a.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-premium p-6">
          <div className="flex items-center gap-2 mb-5">
            <Bell className="w-4 h-4" style={{ color: "#666" }} />
            <h3 className="font-semibold text-white text-sm">Notifications</h3>
          </div>
          <div className="space-y-0">
            {notifications.length === 0 ? (
              <p className="text-sm" style={{ color: "#444" }}>Aucune notification.</p>
            ) : notifications.slice(0, 5).map(n => (
              <div key={n.id} className="flex items-start gap-2.5 py-2.5"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", opacity: n.read ? 0.5 : 1 }}>
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                  style={{ background: n.read ? "#333" : "#fff" }} />
                <div>
                  <p className="text-[13px] font-medium text-white">{n.title}</p>
                  <p className="text-[12px] mt-0.5" style={{ color: "#555" }}>{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}