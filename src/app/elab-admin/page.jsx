"use client";
import { useState } from "react";
import { Search, Plus, BarChart2, Settings } from "lucide-react";

export default function Overview() {
  const [activities] = useState([
    { action: "Study Session", user: "User A", time: "5 min. ago" },
    { action: "User Activity Detected", user: "User A", time: "5 min. ago" },
    { action: "Study Session", user: "User A", time: "5 min. ago" },
    { action: "User Activity Detected", user: "User A", time: "5 min. ago" },
  ]);

  const stats = [
    { label: "Total Subscriber", value: 0 },
    { label: "Active Courses", value: 3 },
    { label: "Question Bank", value: 3 },
    { label: "Completion Rate", value: "03" },
  ];

  const quickActions = [
    { label: "Manage Program", icon: <Settings size={16} /> },
    { label: "Create New Course", icon: <Plus size={16} /> },
    { label: "Add Questions", icon: <Plus size={16} /> },
    { label: "Create Case studies", icon: <Plus size={16} /> },
    { label: "View Analytics", icon: <BarChart2 size={16} /> },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto space-y-8">
      {/* Search Bar */}
      <div className="w-full">
        <div className="flex items-center bg-white rounded-xl px-4 py-2 shadow-sm border max-w-lg">
          <Search className="text-gray-500 mr-2" size={18} />
          <input
            type="text"
            placeholder="Type a command or search..."
            className="w-full bg-transparent focus:outline-none text-gray-700"
          />
        </div>
      </div>

      {/* Overview Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
        <p className="text-gray-500">Welcome, Ibrahim</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-sm border p-6 flex flex-col items-center text-center"
          >
            <span className="text-2xl font-bold">{item.value}</span>
            <span className="text-gray-500 text-sm">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="col-span-2 bg-white rounded-xl shadow-sm border p-4">
          <h3 className="text-gray-900 font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {activities.map((act, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-2 text-gray-800"
              >
                <span>{act.action}</span>
                <span className="text-sm text-gray-600">{act.user}</span>
                <span className="text-xs text-gray-500">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <h3 className="text-gray-900 font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                className="w-full flex items-center justify-between px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
              >
                <span className="flex items-center gap-2 text-gray-700">
                  {action.icon}
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

