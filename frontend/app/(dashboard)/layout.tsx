"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, LogOut, User, Mail, Shield } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const isAgentPage = pathname?.includes("agent-dashboard");
  const isFieldDetail = pathname?.includes("field-detail");
  const avatar='https://picsum.photos/id/1016/800/520';

  const currentUser = user || {
    name: "Guest",
    email: "",
    role: "Unknown",
    avatar: "https://picsum.photos/id/1016/800/520",
  };

  const handleLogout = () => {
    logout();                    
    router.push("/login");      
  };

  const notifications = [
    { id: 1, title: "Frost Warning", message: "Temperature expected to drop below 32°F in Sector A tonight.", time: "2 min ago", type: "alert" },
    { id: 2, title: "Field Update", message: "North Ridge Sector 4 - Growing stage confirmed by Agent Sarah.", time: "45 min ago", type: "info" },
  ];

  return (
    <div className="min-h-screen bg-[#f7f9ff]">
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-[#f1f4fa] px-8 py-4 z-50 flex items-center justify-between">
        <div className="flex items-center gap-x-8">
          {/* Logo */}
          <div className="flex items-center gap-x-2">
            <div className="w-8 h-8 bg-[#204e2b] rounded-xl flex items-center justify-center text-white text-xl font-bold">
              🌾
            </div>
            <span className="text-2xl font-semibold tracking-tight text-[#181c20]" style={{ fontFamily: "var(--font-manrope)" }}>
              FieldScale Pro
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-x-8 text-sm font-medium">
            {!isFieldDetail && (
              <Link
                href={isAgentPage ? "/agent-dashboard" : "/dashboard"}
                className={`pb-1 transition-colors ${pathname?.includes("dashboard") ? "text-[#204e2b] border-b-2 border-[#204e2b]" : "text-[#181c20] hover:text-[#204e2b]"}`}
              >
                Dashboard
              </Link>
            )}

            {!isAgentPage && !isFieldDetail && (
              <Link
                href="/fields"
                className={`pb-1 transition-colors ${pathname?.startsWith("/fields") ? "text-[#204e2b] border-b-2 border-[#204e2b]" : "text-[#181c20] hover:text-[#204e2b]"}`}
              >
                Fields
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-x-4">
          {/* Notifications */}
          <div className="relative group">
            <button
              className="w-10 h-10 flex items-center justify-center text-[#181c20] hover:bg-[#f1f4fa] rounded-2xl transition-colors relative"
              onMouseEnter={() => setShowNotifications(true)}
            >
              <Bell className="w-5 h-5" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
            </button>

            {showNotifications && (
              <div
                className="absolute right-0 top-14 w-96 bg-white rounded-3xl shadow-xl border border-[#f1f4fa] py-2 z-50 overflow-hidden"
                onMouseLeave={() => setShowNotifications(false)}
              >
                <div className="px-6 py-4 border-b border-[#f1f4fa]">
                  <p className="font-semibold text-lg text-[#181c20]">Notifications</p>
                </div>
                <div className="max-h-[420px] overflow-y-auto">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="px-6 py-4 hover:bg-[#f7f9ff] border-b border-[#f1f4fa] last:border-none">
                      <div className="flex justify-between">
                        <p className="font-medium text-sm text-[#181c20]">{notif.title}</p>
                        <p className="text-xs text-[#525a4f]">{notif.time}</p>
                      </div>
                      <p className="text-sm text-[#525a4f] mt-1 leading-snug">{notif.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative group">
            <div
              className="flex items-center gap-x-3 cursor-pointer"
              onMouseEnter={() => setShowProfile(true)}
            >
              <div className="text-right text-sm">
                <p className="font-medium text-[#181c20]">{currentUser.name}</p>
                <p className="text-xs text-[#525a4f]">{currentUser.role}</p>
              </div>
              <div className="w-9 h-9 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                <img src={avatar} alt={currentUser.name} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Profile Popover */}
            {showProfile && (
              <div
                className="absolute right-0 top-14 w-80 bg-white rounded-3xl shadow-xl border border-[#f1f4fa] p-6 z-50"
                onMouseLeave={() => setShowProfile(false)}
              >
                <div className="flex items-center gap-x-4 mb-6">
                  <div className="w-16 h-16 rounded-3xl overflow-hidden border-2 border-white shadow-sm">
                    <img src={avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-xl text-[#181c20]" style={{ fontFamily: "var(--font-manrope)" }}>
                      {currentUser.name}
                    </p>
                    <p className="text-[#525a4f]">{currentUser.email}</p>
                    <div className="flex items-center gap-x-2 mt-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm text-emerald-600 font-medium">Online</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 border-t border-[#f1f4fa] pt-6">
                  <button className="w-full flex items-center gap-x-3 px-4 py-3 hover:bg-[#f7f9ff] rounded-2xl text-left transition-colors">
                    <User className="w-5 h-5 text-[#525a4f]" />
                    <span className="text-sm">View Profile</span>
                  </button>
                  <button className="w-full flex items-center gap-x-3 px-4 py-3 hover:bg-[#f7f9ff] rounded-2xl text-left transition-colors">
                    <Mail className="w-5 h-5 text-[#525a4f]" />
                    <span className="text-sm">Manage Account</span>
                  </button>
                  <button className="w-full flex items-center gap-x-3 px-4 py-3 hover:bg-[#f7f9ff] rounded-2xl text-left transition-colors">
                    <Shield className="w-5 h-5 text-[#525a4f]" />
                    <span className="text-sm">Security Settings</span>
                  </button>
                </div>

                <div className="border-t border-[#f1f4fa] mt-6 pt-6">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-2xl text-left transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="pt-20">{children}</main>
    </div>
  );
}