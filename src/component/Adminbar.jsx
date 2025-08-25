// components/Sidebar.jsx
"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  HelpCircle,
  PlayCircle,
  CreditCard,
  FileText,
  Shield,
  Layers,
  BarChart,
  Settings,
  LogOut,
  Sliders
} from "lucide-react";

const menuItems = [
  { name: "Overview", href: "/elab-admin", icon: LayoutDashboard },
  { name: "Course Management", href: "/courses", icon: BookOpen },
  { name: "User Management", href: "/users", icon: Users },
  { name: "Question Bank", href: "/questions", icon: HelpCircle },
  { name: "Smart Practice", href: "/practice", icon: PlayCircle },
  { name: "Subscription management", href: "/subscription", icon: CreditCard },
  { name: "CAT Testing", href: "/cat-testing", icon: PlayCircle },
  { name: "Case Studies", href: "/case-studies", icon: FileText },
  { name: "Account Security Monitor", href: "/security", icon: Shield },
  { name: "Flashcards", href: "/flashcards", icon: Layers },
  { name: "Analytics", href: "/analytics", icon: BarChart },
  { name: "Platform Configuration", href: "/config", icon: Sliders },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-white border-r p-4 flex flex-col justify-between">
      <div>
        {/* Logo */}
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-lg font-bold">
            E
          </div>
          <span className="ml-2 font-semibold text-lg">ELAB ADMIN</span>
        </div>

        {/* Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon size={18} />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="border-t pt-4 space-y-2">
        <Link
          href="/settings"
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100`}
        >
          <Settings size={18} />
          <span className="text-sm font-medium">Settings</span>
        </Link>
        <button className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 w-full">
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>

        {/* User Info */}
        <div className="flex items-center gap-2 mt-4">
          <img
            src="/profile.jpg"
            alt="user"
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="text-sm font-medium">{}</p>
            <p className="text-xs text-gray-500">{}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
