import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { Bell, BellDot, Check, LogOut, LayoutDashboard, Shield, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

function NotificationDropdown() {
  const { notifications, unreadCount, isOpen, isLoading, fetchUnreadCount, markRead, markAllRead, toggleOpen, close } = useNotificationStore();

  useEffect(() => {
    if (!!localStorage.getItem("accessToken")) {
      fetchUnreadCount();
      const id = setInterval(fetchUnreadCount, 10000);
      return () => clearInterval(id);
    }
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (!(e.target as HTMLElement).closest(".notif-dd")) close(); };
    if (isOpen) document.addEventListener("click", fn);
    return () => document.removeEventListener("click", fn);
  }, [isOpen]);

  const BellIcon = unreadCount > 0 ? BellDot : Bell;

  return (
    <div className="relative notif-dd">
      <button onClick={toggleOpen}
        className="relative p-2 rounded-xl transition-all duration-200"
        style={{ color: "#666", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#666"; }}>
        <BellIcon className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-white text-[8px] font-bold text-black flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 z-50 overflow-hidden animate-fade-in"
          style={{ background: "#111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, boxShadow: "0 24px 48px rgba(0,0,0,0.6)" }}>
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span className="text-[13px] font-semibold text-white">Notifications</span>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-[11px] flex items-center gap-1 transition-colors"
                style={{ color: "#555" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "#555")}>
                <Check className="w-3 h-3" /> Tout lire
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="py-8 text-center text-xs" style={{ color: "#444" }}>Chargement...</div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center text-xs" style={{ color: "#444" }}>Aucune notification</div>
            ) : notifications.map(n => (
              <div key={n.id} onClick={() => markRead(n.id)}
                className="px-4 py-3 cursor-pointer transition-colors"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: !n.read ? "rgba(255,255,255,0.03)" : "transparent" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                onMouseLeave={e => (e.currentTarget.style.background = !n.read ? "rgba(255,255,255,0.03)" : "transparent")}>
                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                    style={{ background: !n.read ? "#fff" : "#333" }} />
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-white truncate">{n.title}</p>
                    <p className="text-[12px] truncate mt-0.5" style={{ color: "#555" }}>{n.message}</p>
                    <p className="text-[10px] mt-1" style={{ color: "#333" }}>
                      {new Date(n.createdAt).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PublicLayout() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN" || user?.role === "CREATOR";
  const isHome = location.pathname === "/";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(10,10,10,0.95)" : "rgba(10,10,10,0.6)",
          backdropFilter: "blur(20px)",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
          boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.4)" : "none",
        }}>
        <div className="max-w-6xl mx-auto px-5 h-[62px] flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-105"
              style={{ background: "#fff" }}>
              <span className="text-[10px] font-black text-black">SM</span>
            </div>
            <span className="font-bold text-[15px] font-display tracking-tight text-white">Réseau SM</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {isHome && (
              <>
                <a href="#discord" className="nav-link">Serveurs</a>
                <a href="#reviews" className="nav-link">Avis</a>
                <a href="#contact" className="nav-link">Contact</a>
              </>
            )}
            {isAuthenticated && (
              <Link to="/dashboard" className="nav-link flex items-center gap-1.5">
                <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="nav-link flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Admin
              </Link>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2.5">
            {isAuthenticated ? (
              <>
                <NotificationDropdown />
                <div className="hidden sm:flex items-center gap-2 pl-2.5" style={{ borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-black"
                    style={{ background: "#fff" }}>
                    {(user?.displayName || user?.username || "U").charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[12px] font-medium" style={{ color: "#555" }}>{user?.displayName || user?.username}</span>
                </div>
                <button onClick={logout}
                  className="p-2 rounded-xl transition-all duration-200"
                  style={{ color: "#555", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#555"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}>
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="hidden md:block text-[13px] font-medium px-4 py-2 rounded-xl transition-colors"
                  style={{ color: "#666" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#666")}>
                  Connexion
                </Link>
                <Link to="/register" className="btn-primary hidden md:inline-flex px-4 py-2 text-[13px]">
                  Inscription
                </Link>
              </>
            )}
            <button className="md:hidden p-2 rounded-xl transition-colors"
              style={{ color: "#555", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
              onClick={() => setMobileOpen(v => !v)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden px-5 py-4 animate-fade-in"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(10,10,10,0.98)" }}>
            <div className="flex flex-col gap-1">
              {isHome && (
                <>
                  <a href="#discord" onClick={() => setMobileOpen(false)} className="px-4 py-2.5 rounded-xl text-[13px] font-medium transition-colors" style={{ color: "#666" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "#666")}>Serveurs</a>
                  <a href="#reviews" onClick={() => setMobileOpen(false)} className="px-4 py-2.5 rounded-xl text-[13px] font-medium transition-colors" style={{ color: "#666" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "#666")}>Avis</a>
                  <a href="#contact" onClick={() => setMobileOpen(false)} className="px-4 py-2.5 rounded-xl text-[13px] font-medium transition-colors" style={{ color: "#666" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "#666")}>Contact</a>
                  <div className="my-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />
                </>
              )}
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="px-4 py-2.5 rounded-xl text-[13px] font-medium" style={{ color: "#666" }}>Dashboard</Link>
                  {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} className="px-4 py-2.5 rounded-xl text-[13px] font-medium" style={{ color: "#666" }}>Admin</Link>}
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="text-left px-4 py-2.5 rounded-xl text-[13px] font-medium" style={{ color: "#888" }}>Déconnexion</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="px-4 py-2.5 rounded-xl text-[13px] font-medium" style={{ color: "#666" }}>Connexion</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary mt-1 py-2.5 text-[13px]">Inscription</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="pt-[62px]">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="py-12 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#fff" }}>
              <span className="text-[9px] font-black text-black">SM</span>
            </div>
            <span className="font-bold text-[14px] font-display text-white">Réseau SM</span>
          </Link>
          <p className="text-[12px]" style={{ color: "#333" }}>© 2026 Réseau SM — Tous droits réservés</p>
          <div className="flex items-center gap-6">
            {[["#discord","Serveurs"],["#reviews","Avis"],["#contact","Contact"]].map(([href, label]) => (
              <a key={href} href={href} className="text-[12px] transition-colors" style={{ color: "#333" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#888")}
                onMouseLeave={e => (e.currentTarget.style.color = "#333")}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}