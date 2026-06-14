import { Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import PublicLayout from "@/components/layouts/PublicLayout";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import AdminLayout from "@/components/layouts/AdminLayout";
import AnnouncementToast from "@/components/AnnouncementToast";
import { useAnnouncementStore } from "@/stores/announcementStore";
import HomePage from "@/pages/public/HomePage";
import LoginPage from "@/pages/public/LoginPage";
import RegisterPage from "@/pages/public/RegisterPage";
import UserDashboard from "@/pages/user/DashboardPage";
import ProfilePage from "@/pages/user/ProfilePage";
import SettingsPage from "@/pages/user/SettingsPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import UsersPage from "@/pages/admin/UsersPage";
import ActivityPage from "@/pages/admin/ActivityPage";
import AnnouncementsPage from "@/pages/admin/AnnouncementsPage";

function App() {
  useAuth();
  const announcements = useAnnouncementStore((state) => state.announcements);
  const removeAnnouncement = useAnnouncementStore((state) => state.removeAnnouncement);
  
  return (
    <>
      {announcements.map((announcement) => (
        <AnnouncementToast
          key={announcement.id}
          message={announcement.message}
          duration={announcement.duration}
          onClose={() => removeAnnouncement(announcement.id)}
        />
      ))}
      {/* <PWAInstallModal /> */}
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/activity" element={<ActivityPage />} />
          <Route path="/admin/announcements" element={<AnnouncementsPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;