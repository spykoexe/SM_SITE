import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useEffect, useState } from "react";
import { LayoutDashboard, Users, Activity, Shield, LogOut, Menu, X, ChevronLeft, Megaphone } from "lucide-react";

const adminNav = [
  { path: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { path: "/admin/users", label: "Utilisateurs", icon: Users },
  { path: "/admin/activity", label: "Activite", icon: Activity },
  { path: "/admin/announcements", label: "Annonces", icon: Megaphone },
];

export default function AdminLayout() {
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate("/login");
    if (!isLoading && isAuthenticated && user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN") navigate("/dashboard");
  }, [isLoading, isAuthenticated, user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c]">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#e8e8e8]" />
      </div>
    );
  }

  if (!isAuthenticated || (user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN")) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#e8e8e8] flex">
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col border-r border-white/[0.06] bg-[#0a0a0c] transition-all duration-300 ${sidebarOpen ? "w-60" : "w-14"}`}>
        <div className="h-14 flex items-center justify-between px-3 border-b border-white/[0.06]">
          {sidebarOpen && <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-[#e8e8e8]" /><span className="text-sm font-semibold">Admin</span></div>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded text-[#737373] hover:text-[#e8e8e8]">
            <ChevronLeft className={`w-4 h-4 transition-transform ${sidebarOpen ? "" : "rotate-180"}`} />
          </button>
        </div>
        <nav className="flex-1 py-3 px-2 space-y-0.5">
          {adminNav.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-colors text-[13px] ${active ? "bg-white/[0.06] text-white" : "text-[#737373] hover:text-[#e8e8e8] hover:bg-white/[0.03]"}`}>
                <Icon className="w-4 h-4 shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="p-2 border-t border-white/[0.06] space-y-0.5">
          <Link to="/dashboard" className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] text-[#737373] hover:text-[#e8e8e8] hover:bg-white/[0.03] transition-colors">
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span className="font-medium">Dashboard</span>}
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span className="font-medium">Deconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={`fixed lg:hidden inset-y-0 left-0 z-50 w-60 bg-[#0a0a0c] border-r border-white/[0.06] transform transition-transform ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-14 flex items-center justify-between px-4 border-b border-white/[0.06]">
          <span className="text-sm font-semibold flex items-center gap-2"><Shield className="w-4 h-4 text-[#e8e8e8]" /> Admin</span>
          <button onClick={() => setMobileOpen(false)} className="text-[#737373]"><X className="w-4 h-4" /></button>
        </div>
        <nav className="p-3 space-y-0.5">
          {adminNav.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)} className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] ${active ? "bg-white/[0.06] text-white" : "text-[#737373] hover:bg-white/[0.03]"}`}>
                <Icon className="w-4 h-4" /> <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
          <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] text-[#737373] hover:bg-white/[0.03]">
            <LayoutDashboard className="w-4 h-4" /> <span className="font-medium">Dashboard</span>
          </Link>
          <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] text-red-400 hover:bg-red-500/10">
            <LogOut className="w-4 h-4" /> <span className="font-medium">Deconnexion</span>
          </button>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-white/[0.06] flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-1.5 -ml-1.5 rounded text-[#737373] hover:text-[#e8e8e8]">
              <Menu className="w-4 h-4" />
            </button>
            <h1 className="text-[15px] font-semibold">
              {adminNav.find((n) => n.path === location.pathname)?.label || "Administration"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-[#525252] hidden sm:block">{user?.email}</span>
            <div className="w-7 h-7 rounded-full bg-[#1a1a1e] border border-white/[0.06] flex items-center justify-center text-[10px] font-bold text-[#e8e8e8]">
              {user?.displayName?.charAt(0) || user?.username?.charAt(0) || "A"}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}