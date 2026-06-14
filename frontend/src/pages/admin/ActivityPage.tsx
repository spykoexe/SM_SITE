import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { formatDate } from "@/lib/utils";
import { Activity, ChevronLeft, ChevronRight } from "lucide-react";

export default function ActivityPage() {
  const [logs, setLogs]   = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage]   = useState(1);
  const [limit]           = useState(20);

  useEffect(() => {
    api.get(`/admin/activity-logs?page=${page}&limit=${limit}`).then(res => {
      if (res?.success) { setLogs(res.data.logs); setTotal(res.data.total); }
    });
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold font-display text-white">Journal d'activité</h2>
        <p className="text-sm mt-1" style={{ color: "#555" }}>Historique des actions sur la plateforme.</p>
      </div>

      <div className="card-premium overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Action","Entité","Utilisateur","IP","Date"].map((h, i) => (
                <th key={h} className={`px-4 py-3 font-medium text-left ${i === 4 ? "text-right" : ""} ${i === 2 ? "hidden md:table-cell" : ""} ${i === 3 ? "hidden sm:table-cell" : ""}`}
                  style={{ color: "#444", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-10 text-sm" style={{ color: "#444" }}>Aucune activité enregistrée.</td></tr>
            ) : logs.map(log => (
              <tr key={log.id} className="transition-colors" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 shrink-0" style={{ color: "#555" }} />
                    <span className="font-medium text-white text-[13px]">{log.action}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[13px]" style={{ color: "#555" }}>{log.entity} {log.entityId?.slice(0, 8)}</td>
                <td className="px-4 py-3 text-[13px] hidden md:table-cell" style={{ color: "#555" }}>{log.user?.email || "Système"}</td>
                <td className="px-4 py-3 text-[13px] hidden sm:table-cell" style={{ color: "#555" }}>{log.ipAddress || "—"}</td>
                <td className="px-4 py-3 text-right text-[13px]" style={{ color: "#555" }}>{formatDate(log.createdAt)}</td>
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