"use client";
import React, { useEffect, useState } from "react";
import { Search, Bell, ChevronRight } from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

const NCLEXCourseDashboard = () => {
  const { id } = useParams();
  const [coursesOrders, setCoursesOrders] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [progressData, setProgressData] = useState({});
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [modules, setModules] = useState([]);
  const [loadingModules, setLoadingModules] = useState(false);
  const { fetchUser } = useAuthStore();

  // Fetch Ordered Courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        fetchUser();
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch(
          "https://elab-server-xg5r.onrender.com/orders/ordered-courses",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) return;
        const data = await res.json();
        setCoursesOrders(data);
      } catch {
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  // Fetch Course Progress
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch(
          "https://elab-server-xg5r.onrender.com/progress/courses",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) return;
        const data = await res.json();
        const progressMap = {};
        data.forEach((item) => {
          progressMap[item.course_id] = item.progress_percentage;
        });
        setProgressData(progressMap);
      } catch {
      } finally {
        setLoadingProgress(false);
      }
    };
    fetchProgress();
  }, []);

  // Fetch Modules for a specific course
  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoadingModules(true);
        const token = localStorage.getItem("token");
        if (!token || !id) return;
        const moduleRes = await fetch(
          `https://elab-server-xg5r.onrender.com/courses/modules/${id}`,
          {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          }
        );
        if (!moduleRes.ok) return;
        const moduleData = await moduleRes.json();
        setModules(moduleData);
      } catch {
      } finally {
        setLoadingModules(false);
      }
    };
    if (id) fetchModules();
  }, [id]);

  const renderModulesInfo = () => {
    if (!id) return null;
    if (loadingModules) return <p className="text-gray-500">Loading modules...</p>;
    if (modules.length === 0) return <p className="text-gray-500">No modules found for this course.</p>;

    return (
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          📚 Course Modules ({modules.length})
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {modules.map((module, index) => (
            <div key={module.id || index} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-lg text-blue-600 mb-2">
                <Link href={`/dashboard/my-courses/${id}/modules/${module.id}`}>
                  {module.title || `Module ${index + 1}`}
                </Link>
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                {module.description || "No description available"}
              </p>
              {module.duration && (
                <p className="text-gray-500 text-xs">
                  ⏱️ Duration: {module.duration}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search your courses..."
              className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
          <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <span className="hover:text-blue-600 cursor-pointer">My Courses</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Dashboard</span>
        </nav>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            NCLEX Dashboard
          </h1>
          <p className="text-gray-600">
            Track your progress and manage all your enrolled courses & orders.
          </p>
        </div>

        

        {/* Ordered Courses */}
        <div className="mb-12">
          <div className="flex lg:items-center lg:justify-between mb-6 lg:flex-row flex-col">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2 lg:mb-0">
              🎓 My Ordered Courses
            </h2>
            <button
              className="bg-blue-500 px-2 py-2 rounded-md text-white font-bold"
              onClick={() => { window.location.href = "/ExamPrep"; }}
            >
              Enroll for new course
            </button>
          </div>

          {loadingCourses || loadingProgress ? (
            <p className="text-gray-500">Loading your courses...</p>
          ) : coursesOrders.length === 0 ? (
            <p className="text-gray-500">You haven't ordered any courses yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesOrders.map((course) => {
                const progress = progressData[course.id] || 0;
                const chartData = [{ name: "Progress", value: progress, fill: "#2563EB" }];

                return (
                  <div
                    key={course.id}
                    className="p-6 bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition flex justify-between"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-blue-600 mb-2">
                        <Link href={`/dashboard/my-courses/${course.id}`}>
                          {course.title || "Unnamed Course"}
                        </Link>
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {course.description?.slice(0, 100) || "No description"}...
                      </p>
                      {course.total_modules && (
                        <p className="text-gray-600 text-sm mb-2">
                          📘 {course.total_modules} Modules
                        </p>
                      )}
                        <p className="text-gray-600 text-sm mb-2">
                      <Link href="/dashboard/Cat/">
                          📝 {course.has_cat ? "Includes CAT" : "No CAT"}
                      </Link>
                        </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-28 h-28">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadialBarChart
                            innerRadius="70%"
                            outerRadius="100%"
                            barSize={12}
                            data={chartData}
                            startAngle={90}
                            endAngle={90 + (360 * progress) / 100}
                          >
                            <RadialBar minAngle={15} dataKey="value" background cornerRadius={8} />
                          </RadialBarChart>
                        </ResponsiveContainer>
                      </div>
                      <span className="mt-2 text-sm font-medium text-gray-700">
                        {progress}% Completed
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NCLEXCourseDashboard;
