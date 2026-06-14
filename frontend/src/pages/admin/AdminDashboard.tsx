import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Users, UserCheck, UserPlus, Activity, HeartHandshake, MessageSquare, Server, Cpu, Database, Clock } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchAll = async () => {
    const [dash, hea] = await Promise.all([
      api.get("/admin/dashboard"),
      api.get("/admin/health"),
    ]);
    if (dash?.success) setStats(dash.data);
    if (hea?.success) setHealth(hea.data);
    setLastUpdate(new Date());
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 5000);
    return () => clearInterval(interval);
  }, []);

  const statCards = stats ? [
    { label: "Utilisateurs", value: stats.users.total, icon: Users },
    { label: "Actifs", value: stats.users.active, icon: UserCheck },
    { label: "Nouveaux (7j)", value: stats.users.newWeek, icon: UserPlus },
    { label: "Sessions", value: stats.sessions, icon: Activity },
    { label: "Avis", value: stats.reviews, icon: HeartHandshake },
    { label: "Tickets", value: stats.tickets, icon: MessageSquare },
  ] : [];

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Centre de contrôle</h2>
          <p className="text-[13px] text-[#737373] mt-0.5">Vue d'ensemble en temps réel.</p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-[#525252]">
          <Clock className="w-3 h-3" />
          Mis à jour : {lastUpdate.toLocaleTimeString("fr-FR")}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-lg border border-white/[0.06] bg-[#131316] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-md bg-[#1a1a1e] border border-white/[0.06] flex items-center justify-center text-[#a1a1aa]">
                <s.icon className="w-4 h-4" />
              </div>
              <span className="text-[13px] text-[#737373]">{s.label}</span>
            </div>
            <p className="text-2xl font-semibold text-white">{s.value.toLocaleString("fr-FR")}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-lg border border-white/[0.06] bg-[#131316] p-5">
          <h3 className="text-[15px] font-medium text-[#e8e8e8] flex items-center gap-2 mb-4"><Activity className="w-4 h-4 text-[#a1a1aa]" /> Activité récente</h3>
          {stats?.activity?.length > 0 ? (
            <div className="space-y-2">
              {stats.activity.slice(0, 8).map((a: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0 text-sm">
                  <span className="text-[#a1a1aa] text-[13px]">{a.action}</span>
                  <span className="text-[#525252] text-[13px]">{a._count.action}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-[13px] text-[#525252]">Aucune donnée disponible.</p>}
        </div>

        <div className="rounded-lg border border-white/[0.06] bg-[#131316] p-5">
          <h3 className="text-[15px] font-medium text-[#e8e8e8] flex items-center gap-2 mb-4"><Server className="w-4 h-4 text-[#a1a1aa]" /> Santé système</h3>
          {health ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#a1a1aa]">Statut</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-md border ${health.status === "healthy" ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/10" : "border-amber-500/20 text-amber-400 bg-amber-500/10"}`}>{health.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#a1a1aa] flex items-center gap-2"><Database className="w-3.5 h-3.5 text-[#525252]" /> Base de données</span>
                <span className="text-[12px] text-[#525252]">{health.database?.latencyMs ?? "—"}ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#a1a1aa] flex items-center gap-2"><Cpu className="w-3.5 h-3.5 text-[#525252]" /> Uptime</span>
                <span className="text-[12px] text-[#525252]">{formatUptime(health.uptime ?? 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#a1a1aa] flex items-center gap-2"><Server className="w-3.5 h-3.5 text-[#525252]" /> Mémoire</span>
                <span className="text-[12px] text-[#525252]">{Math.round((health.memory?.heapUsed ?? 0) / 1024 / 1024)} MB</span>
              </div>
            </div>
          ) : <p className="text-[13px] text-[#525252]">Chargement...</p>}
        </div>
      </div>
    </div>
  );
}
