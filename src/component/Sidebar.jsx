"use client";
import Image from 'next/image';
import max from '../../src//image/logo.png';
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
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "My Courses", path: "/dashboard/my-courses", icon: BookOpen },
  { name: "AI Study Companion", path: "/dashboard/AIStudyCompanion", icon: Bot },
  { name: "Exam Readiness", path: "/dashboard/exam-readiness", icon: ClipboardCheck },
  { name: "Question Bank", path: "/dashboard/question-bank", icon: HelpCircle },
  { name: "Smart Practice", path: "/dashboard/smart-practice", icon: Lightbulb },
  { name: "Case Studies", path: "/dashboard/CaseStudies", icon: FileText },
  { name: "Flashcards", path: "/dashboard/Flashcard", icon: Layers },
  { name: "My Performance Analytics", path: "/dashboard/performance", icon: BarChart3 },
  { name: "Leader Board", path: "/dashboard/leaderboard", icon: Trophy },
  { name: "Profile", path: "/dashboard/profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-white shadow-md flex flex-col justify-between">
      {/* Logo / Brand */}
      <div className='p-1'>
            <Image
            src={max}
           
            alt="ELAB Logo"
            className=" w-[13vw] max-w-[10vw] sm:max-w-[70px] md:max-w-[50vw] lg:max-w-[50vw] xl:max-w-[50vw] "
          />
        {/* <h1 className="text-xl font-bold px-6 py-4 border-b">ELAB Academy</h1> */}
        <nav className="mt-4">
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <Link key={i} href={item.path}>
                <div
                  className={`flex items-center gap-3 px-6 py-3 cursor-pointer hover:bg-gray-100 transition ${
                    pathname === item.path ? "bg-blue-100 font-semibold text-blue-600" : "text-gray-700"
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-bold text-[14px] ">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-6 border-t">
        <button className="flex items-center gap-2 text-red-500 font-medium hover:text-red-600 transition">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}
