"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, History, BarChart3, CheckSquare } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Today's Tasks", icon: LayoutDashboard },
    { href: "/history", label: "Archived Section", icon: History },
    { href: "/summary", label: "Daily Summary", icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-[#702963] text-white flex flex-col fixed inset-y-0 left-0 z-50">
      <div className="p-8 mb-4">
        <Link href="/" className="flex items-center gap-3">
          <CheckSquare className="w-8 h-8 text-white" />
          <span className="text-2xl font-bold tracking-tight">DayTrack</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group ${
              pathname === item.href
                ? "bg-white/20 text-white"
                : "hover:bg-white/10 text-white/70 hover:text-white"
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="px-6 py-4 mb-4">
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white shadow-inner">
            JD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-none">John Doe</span>
            <span className="text-[10px] text-white/50 mt-1 uppercase tracking-widest font-black">Logged In</span>
          </div>
        </div>
      </div>

      <div className="p-8 text-xs text-white/40 border-t border-white/10 uppercase tracking-[0.25em] font-bold">
        © 2026 DayTrack
      </div>
    </aside>
  );
}
