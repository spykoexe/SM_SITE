import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useEffect, useState } from "react";
import { LayoutDashboard, User, Settings, LogOut, Shield, Menu, X, ChevronLeft, Bell } from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { path: "/profile",   label: "Profil",           icon: User            },
  { path: "/settings",  label: "Paramètres",        icon: Settings        },
];

export default function DashboardLayout() {
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate("/login");
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white/40" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const currentLabel = navItems.find(n => n.path === location.pathname)?.label || "Dashboard";

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] text-white">

      {/* ── Desktop sidebar ── */}
      <aside className={`hidden lg:flex flex-col transition-all duration-300 ${sidebarOpen ? "w-60" : "w-14"}`}
        style={{ borderRight: "1px solid rgba(255,255,255,0.06)", background: "#0a0a0a" }}>

        <div className="h-14 flex items-center justify-between px-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {sidebarOpen && (
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#fff" }}>
                <span className="text-[9px] font-black text-black">SM</span>
              </div>
              <span className="text-sm font-semibold text-white font-display">Dashboard</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(v => !v)}
            className="p-1 rounded-md transition-colors ml-auto"
            style={{ color: "#555" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={e => (e.currentTarget.style.color = "#555")}>
            <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${sidebarOpen ? "" : "rotate-180"}`} />
          </button>
        </div>

        <nav className="flex-1 py-3 px-2 space-y-0.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all duration-150"
                style={{
                  background: active ? "rgba(255,255,255,0.06)" : "transparent",
                  color: active ? "#fff" : "#555",
                  border: active ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
                }}
                onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.color = "#e0e0e0"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; } }}
                onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.color = "#555"; (e.currentTarget as HTMLElement).style.background = "transparent"; } }}>
                <Icon className="w-4 h-4 shrink-0" />
                {sidebarOpen && <span className="text-[13px] font-medium">{item.label}</span>}
              </Link>
            );
          })}
          {isAdmin && (
            <Link to="/admin"
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all duration-150"
              style={{ color: "#555", border: "1px solid transparent" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#e0e0e0"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#555"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              <Shield className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span className="text-[13px] font-medium">Administration</span>}
            </Link>
          )}
        </nav>

        <div className="p-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={logout}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all duration-150"
            style={{ color: "#555", border: "1px solid transparent" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#555"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            <LogOut className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span className="text-[13px] font-medium">Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* ── Mobile overlay ── */}
      {mobileOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={`fixed lg:hidden inset-y-0 left-0 z-50 w-60 flex flex-col transform transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: "#0a0a0a", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="h-14 flex items-center justify-between px-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#fff" }}>
              <span className="text-[9px] font-black text-black">SM</span>
            </div>
            <span className="text-sm font-semibold font-display">Dashboard</span>
          </div>
          <button onClick={() => setMobileOpen(false)} style={{ color: "#555" }}><X className="w-4 h-4" /></button>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors"
                style={{ background: active ? "rgba(255,255,255,0.06)" : "transparent", color: active ? "#fff" : "#555" }}>
                <Icon className="w-4 h-4" />
                <span className="text-[13px] font-medium">{item.label}</span>
              </Link>
            );
          })}
          {isAdmin && (
            <Link to="/admin" onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors"
              style={{ color: "#555" }}>
              <Shield className="w-4 h-4" />
              <span className="text-[13px] font-medium">Administration</span>
            </Link>
          )}
        </nav>
        <div className="p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={() => { logout(); setMobileOpen(false); }}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors"
            style={{ color: "#555" }}>
            <LogOut className="w-4 h-4" />
            <span className="text-[13px] font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center justify-between px-4 lg:px-6"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-1.5 rounded-xl"
              style={{ color: "#555" }}>
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-[15px] font-semibold text-white font-display">{currentLabel}</h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button className="relative p-2 rounded-xl transition-colors"
              style={{ color: "#555", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "#555")}>
              <Bell className="w-4 h-4" />
            </button>
            <Link to="/profile" className="flex items-center gap-2 pl-2.5" style={{ borderLeft: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-black"
                style={{ background: "#fff" }}>
                {(user?.displayName || user?.username || "U").charAt(0).toUpperCase()}
              </div>
              <span className="text-[12px] font-medium hidden sm:block" style={{ color: "#555" }}>
                {user?.displayName || user?.username}
              </span>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}