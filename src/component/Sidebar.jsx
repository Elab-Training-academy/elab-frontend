"use client";
import Image from "next/image";
import max from "../../src/image/logo.png";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  Bot,
  ClipboardCheck,
  HelpCircle,
  Lightbulb,
  FileText,
  Layers,
  BarChart3,
  Trophy,
  User,
  LogOut,
  X,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "My Courses", path: "/dashboard/my-courses", icon: BookOpen },
  { name: "AI Study Companion", path: "/dashboard/ai-study-companion", icon: Bot },
  { name: "Exam Readiness", path: "/dashboard/exam-readines", icon: ClipboardCheck },
  { name: "Question Bank", path: "/dashboard/question-bank", icon: HelpCircle },
  { name: "Smart Practice", path: "/dashboard/smart-practice", icon: Lightbulb },
  { name: "Case Studies", path: "/dashboard/case-studies", icon: FileText },
  { name: "Flashcards", path: "/dashboard/flashcard", icon: Layers },
  { name: "My Performance Analytics", path: "/dashboard/my-performance-analytics", icon: BarChart3 },
  { name: "Leader Board", path: "/dashboard/leaderboard", icon: Trophy },
  { name: "Profile", path: "/dashboard/profile", icon: User },
];

export default function Sidebar({ onClose }) {
  const pathname = usePathname();
  
  const handleClose = () => {
    if (typeof onClose === "function") onClose();
  };

  const handleNavigation = () => {
    // Close mobile sidebar on navigation
    if (window.innerWidth < 1024) {
      handleClose();
    }
  };

  return (
    <aside className="h-screen w-64 bg-white shadow-lg flex flex-col">
      {/* Header with Logo and Close Button */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center">
          <Image 
            src={max} 
            alt="ELAB Logo" 
            className="w-[120px] h-auto" 
            priority
          />
        </div>
        {/* Close button for mobile */}
        <button
          onClick={handleClose}
          className="lg:hidden p-1 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Close navigation menu"
        >
          <X size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-2">
        <div className="space-y-1">
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <Link 
                key={i} 
                href={item.path} 
                onClick={handleNavigation}
                className="block"
              >
                <div
                  className={`mx-2 flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    isActive
                      ? "bg-blue-100 text-blue-600 shadow-sm border-l-4 border-blue-500"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-blue-600" : "text-gray-500"} />
                  <span className={`font-medium text-sm ${isActive ? "font-semibold" : ""}`}>
                    {item.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-gray-200 mt-auto">
        <button 
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-medium hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
          onClick={() => {
            // Add your logout logic here
            console.log("Logout clicked");
          }}
        >
          <LogOut size={18} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}