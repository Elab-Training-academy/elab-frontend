"use client";
import { useEffect, useState } from "react";
import { Search, Plus, BarChart2, Settings } from "lucide-react";

export default function Overview() {
  const [stats, setStats] = useState({
    total_courses: 0,
    total_questions: 0,
    total_users_enrolled: 0,
    total_users: 0,
    total_active_users: 0,
  });

  const [activities, setActivities] = useState([]);

  const quickActions = [
    { label: "Manage Program", icon: <Settings size={16} /> },
    { label: "Create New Course", icon: <Plus size={16} /> },
    { label: "Add Questions", icon: <Plus size={16} /> },
    { label: "Create Case studies", icon: <Plus size={16} /> },
    { label: "View Analytics", icon: <BarChart2 size={16} /> },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchOverview = async () => {
      try {
        const resCourse = await fetch(
          "https://elab-server-xg5r.onrender.com/overviews/course_overview",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const courseData = await resCourse.json();

        const resUser = await fetch(
          "https://elab-server-xg5r.onrender.com/overviews/user_overview",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const userData = await resUser.json();

        setStats({
          total_courses: courseData.total_courses || 0,
          total_questions: courseData.total_questions || 0,
          total_users_enrolled: courseData.total_users_enrolled || 0,
          total_users: userData.total_users || 0,
          total_active_users: userData.total_active_users || 0,
        });
      } catch (err) {
        console.error(err);
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          "https://elab-server-xg5r.onrender.com/super-admin/orders/all",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        const mapped = (data || []).map((order) => ({
          action: `Course: ${order.course?.title || "Unknown"}`,
          amount: order.amount,
          status: order.status,
          time: new Date(order.created_at).toLocaleString(),
        }));
        setActivities(mapped);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOverview();
    fetchOrders();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto space-y-8">
      {/* Search */}
      <div className="w-full max-w-lg">
        <div className="flex items-center bg-white rounded-xl px-4 py-2 shadow border">
          <Search className="text-gray-500 mr-2" size={18} />
          <input
            type="text"
            placeholder="Type a command or search..."
            className="w-full bg-transparent focus:outline-none text-gray-700"
          />
        </div>
      </div>

      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
        <p className="text-gray-600 mb-2">Welcome back,</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Courses", value: stats.total_courses },
          { label: "Total Questions", value: stats.total_questions },
          { label: "Users Enrolled", value: stats.total_users_enrolled },
          { label: "Total Users", value: stats.total_users },
          { label: "Active Users", value: stats.total_active_users },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-sm border p-6 flex flex-col items-center text-center"
          >
            <span className="text-2xl font-bold">{stat.value}</span>
            <span className="text-gray-500 text-sm">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="col-span-2 bg-white rounded-xl shadow border p-6">
          <h3 className="text-gray-900 font-semibold text-lg mb-4">Recent Orders</h3>
          {activities.length === 0 ? (
            <p className="text-sm text-gray-500">No recent orders found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["Course",  "Amount", "Status", "Date"].map((col) => (
                      <th
                        key={col}
                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activities.map((act, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-2 text-gray-800">{act.action}</td>
                      <td className="px-4 py-2 text-gray-800">${act.amount}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            act.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : act.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {act.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-500 text-xs">{act.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
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

