// 'use client';
// import React, { useState } from 'react';
// import { Search, FileText, RotateCcw, Target, ArrowRight, Bell, ChevronRight } from 'lucide-react';

// const NCLEXCourseDashboard = () => {



//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200 px-6 py-4">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="Type a command or search..."
//                 className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
//               />
//             </div>
//           </div>
//           <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" />
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto p-6">
//         {/* Breadcrumb */}
//         <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
//           <span className="hover:text-blue-600 cursor-pointer">My Courses</span>
//           <ChevronRight className="w-4 h-4" />
//           <span className="hover:text-blue-600 cursor-pointer">NCLEx</span>
//           <ChevronRight className="w-4 h-4" />
//           <span className="text-gray-900 font-medium">NCLEX CAT</span>
//         </nav>

//         {/* Title */}
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">NCLEX Computer Adaptive Testing (CAT)</h1>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <StatCard 
//             icon={FileText} 
//             value={stats.catReadyQuestions} 
//             label="CAT Ready Questions" 
//           />
//           <StatCard 
//             icon={RotateCcw} 
//             value={`0${stats.testsCompleted}`} 
//             label="Test Completed" 
//           />
//           <StatCard 
//             icon={Target} 
//             value={`${stats.averageAccuracy}%`} 
//             label="Average Accuracy" 
//           />
//         </div>

//         {/* Main Content Section */}
//         <div className="mb-8">
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">NCLEX Adaptive Test</h2>
//           <p className="text-gray-600 mb-8">Experience realistic National Council Licensure Examination adaptive testing</p>

//           {/* Content Grid */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//             {/* How it works */}
//             <FeatureCard
//               title="How it works:"
//               features={[
//                 "Real-time ability tracking",
//                 "Adaptive question difficulty adjustment",
//                 "Personalized learning pathways",
//                 "Comprehensive performance analytics"
//               ]}
//             />

//             {/* Questions Range */}
//             <FeatureCard
//               title="75-265 Questions"
//               features={[
//                 "Real-time ability tracking",
//                 "Adaptive question selection",
//                 "Performance-based question flow",
//                 "Immediate feedback and explanations"
//               ]}
//             />
//           </div>

//           {/* Start Test Button */}
//           <div className="flex justify-start mb-8">
//             <button
//               onClick={handleStartTest}
//               disabled={isStartingTest}
//               className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-105"
//             >
//               {isStartingTest ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   <span>Starting...</span>
//                 </>
//               ) : (
//                 <>
//                   <span>Start Adaptive Testing</span>
//                   <ArrowRight className="w-5 h-5" />
//                 </>
//               )}
//             </button>
//           </div>

//           {/* Bottom Grid */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Adaptive Algorithm */}
//             <FeatureCard
//               title="Adaptive Algorithm"
//               features={[
//                 "Real-time ability tracking",
//                 "Dynamic difficulty adjustment",
//                 "Competency-based progression",
//                 "Statistical analysis integration"
//               ]}
//             />

//             {/* NCLEX Categories */}
//             <FeatureCard
//               title="NCLEX Categories"
//               features={[
//                 "Safe and Effective Care Environment",
//                 "Health Promotion and Maintenance", 
//                 "Psychosocial Integrity",
//                 "Physiological Integrity"
//               ]}
//             />
//           </div>
//         </div>

//         {/* Progress Indicator */}
//         {isStartingTest && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-xl p-8 shadow-2xl max-w-md mx-4">
//               <div className="text-center">
//                 <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2">Initializing CAT Engine</h3>
//                 <p className="text-gray-600">Preparing your adaptive test experience...</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Additional Info Section */}
//         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
//           <div className="flex items-start space-x-4">
//             <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
//               <Target className="w-4 h-4 text-white" />
//             </div>
//             <div>
//               <h4 className="font-semibold text-gray-800 mb-2">About NCLEX-RN CAT</h4>
//               <p className="text-gray-700 text-sm leading-relaxed">
//                 The NCLEX-RN uses Computer Adaptive Testing (CAT) to efficiently and accurately assess your nursing knowledge. 
//                 Our simulation provides the same adaptive experience, adjusting question difficulty based on your responses 
//                 to determine your competency level across all nursing domains.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="mt-8 flex flex-wrap gap-4">
//           <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
//             View Study Plan
//           </button>
//           <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
//             Practice Questions
//           </button>
//           <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
//             Performance Analytics
//           </button>
//           <button 
//             onClick={() => setStats({catReadyQuestions: 1, testsCompleted: 3, averageAccuracy: 0})}
//             className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
//           >
//             Reset Progress
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NCLEXCourseDashboard;




// "use client";
// import React, { useEffect, useState } from "react";
// import {
//   Search,
//   Bell,
//   ChevronRight,
// } from "lucide-react";

// const NCLEXCourseDashboard = () => {
 


// };

// export default NCLEXCourseDashboard;


"use client";
import React, { useEffect, useState } from "react";
import { Search, Bell, ChevronRight } from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

const NCLEXCourseDashboard = () => {
  const [coursesOrders, setCoursesOrders] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // ✅ Fetch Ordered Courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "https://elab-server-xg5r.onrender.com/orders/ordered-courses",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          console.error("Failed to fetch ordered courses:", res.status);
          setCoursesOrders([]);
          return;
        }

        const data = await res.json();
        setCoursesOrders(data);
      } catch (error) {
        console.error("Error fetching ordered courses:", error);
        setCoursesOrders([]);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  // ✅ Fetch Orders Info
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://elab-server-xg5r.onrender.com/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Failed to fetch orders:", res.status);
          setOrders([]);
          return;
        }

        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search your courses..."
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>
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

        {/* ===================== Ordered Courses ===================== */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            🎓 My Ordered Courses
          </h2>
          {loadingCourses ? (
            <p className="text-gray-500">Loading your courses...</p>
          ) : coursesOrders.length === 0 ? (
            <p className="text-gray-500">You haven’t ordered any courses yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesOrders.map((course) => {
                const progress =
                  course.progress || Math.floor(Math.random() * 100);

                const chartData = [
                  { name: "Progress", value: progress, fill: "#2563EB" },
                ];

                return (
                  <div
                    key={course.id}
                    className="p-6 bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-blue-600 mb-2">
                        {course.title || "Unnamed Course"}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {course.description?.slice(0, 100) || "No description"}
                        ...
                      </p>
                      {course.total_modules && (
                        <p className="text-gray-600 text-sm mb-4">
                          📘 {course.total_modules} Modules
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Order Date:</span>{" "}
                        {new Date(course.updated_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Status:</span>{" "}
                        <span
                          className={`${
                            course.status === "completed"
                              ? "text-green-600"
                              : "text-yellow-600"
                          } font-semibold`}
                        >
                          {course.status}
                        </span>
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
                            <RadialBar
                              minAngle={15}
                              dataKey="value"
                              background
                              cornerRadius={8}
                            />
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

        {/* ===================== Orders Info ===================== */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            📑 Orders Information
          </h2>
          {loadingOrders ? (
            <p className="text-gray-500">Loading your orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-500">No order records found.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-6 bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition"
                >
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">
                    {/* ✅ Show course title if available, fallback to Order ID */}
                    {order.course?.title
                      ? order.course.title
                      : `Order #${order.id}`}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Amount:</span> $
                    {order.amount || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Payment Status:</span>{" "}
                    <span
                      className={`${
                        order.status === "paid"
                          ? "text-green-600"
                          : "text-red-600"
                      } font-semibold`}
                    >
                      {order.status}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NCLEXCourseDashboard;
