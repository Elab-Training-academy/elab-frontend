
"use client";
import React, { useEffect, useState } from "react";
import { Search, TrendingUp, ChevronRight, Bell } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const Dashboard = () => {
  const { user, fetchUser } = useAuthStore();
  const [ranks, setRanks] = useState(null);
  const [coursesOrders, setCoursesOrders] = useState([]);
  const { url } = useAuthStore();
  const [courseIds, setCourseIds] = useState([]);
  const [progress, setProgress] = useState([]);

  // Fetch logged-in user
  useEffect(() => {
    fetchStats();
  }, [fetchUser]);

  // Fetch ordered courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(
          "https://elab-server-xg5r.onrender.com/orders/ordered-courses",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          console.error("Failed to fetch ordered courses:", res.status);
          return;
        }

        const data = await res.json();
        const ids = data.map((d) => d.id);
        setCourseIds(ids);
        setCoursesOrders(data);
      } catch (error) {
        console.error("Error fetching ordered courses:", error);
      }
    };

    fetchCourses();
  }, []);

  // Fetch progress for each course
  useEffect(() => {
    if (!courseIds || courseIds.length === 0) return;

    courseIds.forEach(async (id) => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${url}/progress/courses/${id}/module-progress`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setProgress(data);
        } else {
          console.error("Failed to fetch progress:", res.status);
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    });
  }, [courseIds, url]);

  // Fetch user rank + points
  useEffect(() => {
    const fetchRank = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${url}/progress/user-rank-and-points`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setRanks(data);
        }
      } catch (error) {
        console.error("Error fetching rank:", error);
      }
    };

    fetchRank();
  }, [url]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Type a command or search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Bell className="w-6 h-6 text-gray-600" />
        </div>

           {/* Welcome Section */}
        <div className="mb-8">
          <p className="text-gray-600 mb-2">Welcome back,</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {user ? user.full_name : "Guest"}
          </h1>

          {/* Stats Cards */}
          <div className="flex space-x-4 mb-8">
            {/* Total Points */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex-1">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="w-5 h-5 bg-blue-600 rounded-full"></div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {ranks?.user_rank?.total_points ?? 0}
                  </p>
                  <p className="text-gray-600 text-sm">Total Points</p>
                </div>
              </div>
            </div>

            {/* Rank */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex-1">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <div className="w-5 h-5 bg-purple-600 rounded"></div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {ranks?.user_rank?.rank ?? "-"}
                  </p>
                  <p className="text-gray-600 text-sm">Rank</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Insight */}
        <div className="grid grid-cols-1 gap-6 mt-8">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Performance Insight
            </h2>
            <div className="space-y-4">
              {progress?.module_progress?.map((mod, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{mod.module_name}</h4>
                    <p className="text-sm text-gray-600">
                      {mod.total_questions} questions attempted
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-semibold text-gray-900">
                      {mod.completion_percentage}%
                    </span>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
