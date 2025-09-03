

// "use client";
// import React, { useEffect, useState } from "react";
// import { Search, Bell, ChevronRight } from "lucide-react";
// import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

// const NCLEXCourseDashboard = () => {
//   const [coursesOrders, setCoursesOrders] = useState([]);
//   const [loadingCourses, setLoadingCourses] = useState(true);

//   const [orders, setOrders] = useState([]);
//   const [loadingOrders, setLoadingOrders] = useState(true);

//   // ✅ Fetch Ordered Courses
//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await fetch(
//           "https://elab-server-xg5r.onrender.com/orders/ordered-courses",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         if (!res.ok) {
//           console.error("Failed to fetch ordered courses:", res.status);
//           setCoursesOrders([]);
//           return;
//         }

//         const data = await res.json();
//         setCoursesOrders(data);
//       } catch (error) {
//         console.error("Error fetching ordered courses:", error);
//         setCoursesOrders([]);
//       } finally {
//         setLoadingCourses(false);
//       }
//     };

//     fetchCourses();
//   }, []);

//   // ✅ Fetch Orders Info
//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await fetch("https://elab-server-xg5r.onrender.com/orders", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!res.ok) {
//           console.error("Failed to fetch orders:", res.status);
//           setOrders([]);
//           return;
//         }

//         const data = await res.json();
//         setOrders(data);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//         setOrders([]);
//       } finally {
//         setLoadingOrders(false);
//       }
//     };

//     fetchOrders();
//   }, []);

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
//                 placeholder="Search your courses..."
//                 className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
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
//           <span className="text-gray-900 font-medium">Dashboard</span>
//         </nav>

//         {/* Title */}
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">
//             NCLEX Dashboard
//           </h1>
//           <p className="text-gray-600">
//             Track your progress and manage all your enrolled courses & orders.
//           </p>
//         </div>

//         {/* ===================== Ordered Courses ===================== */}
//         <div className="mb-12">
//           <h2 className="text-2xl font-semibold text-gray-900 mb-4">
//             🎓 My Ordered Courses
//           </h2>
//           {loadingCourses ? (
//             <p className="text-gray-500">Loading your courses...</p>
//           ) : coursesOrders.length === 0 ? (
//             <p className="text-gray-500">You haven’t ordered any courses yet.</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {coursesOrders.map((course) => {
//                 const progress =
//                   course.progress || Math.floor(Math.random() * 100);

//                 const chartData = [
//                   { name: "Progress", value: progress, fill: "#2563EB" },
//                 ];

//                 return (
//                   <div
//                     key={course.id}
//                     className="p-6 bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition flex flex-col justify-between"
//                   >
//                     <div>
//                       <h3 className="text-lg font-semibold text-blue-600 mb-2">
//                         {course.title || "Unnamed Course"}
//                       </h3>
//                       <p className="text-gray-600 text-sm mb-4">
//                         {course.description?.slice(0, 100) || "No description"}
//                         ...
//                       </p>
//                       {course.total_modules && (
//                         <p className="text-gray-600 text-sm mb-4">
//                           📘 {course.total_modules} Modules
//                         </p>
//                       )}
//                     </div>

//                     <div className="mb-4">
//                       <p className="text-sm text-gray-500">
//                         <span className="font-medium">Order Date:</span>{" "}
//                         {new Date(course.updated_at).toLocaleDateString()}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         <span className="font-medium">Status:</span>{" "}
//                         <span
//                           className={`${
//                             course.status === "completed"
//                               ? "text-green-600"
//                               : "text-yellow-600"
//                           } font-semibold`}
//                         >
//                           {course.status}
//                         </span>
//                       </p>
//                     </div>

//                     <div className="flex flex-col items-center">
//                       <div className="w-28 h-28">
//                         <ResponsiveContainer width="100%" height="100%">
//                           <RadialBarChart
//                             innerRadius="70%"
//                             outerRadius="100%"
//                             barSize={12}
//                             data={chartData}
//                             startAngle={90}
//                             endAngle={90 + (360 * progress) / 100}
//                           >
//                             <RadialBar
//                               minAngle={15}
//                               dataKey="value"
//                               background
//                               cornerRadius={8}
//                             />
//                           </RadialBarChart>
//                         </ResponsiveContainer>
//                       </div>
//                       <span className="mt-2 text-sm font-medium text-gray-700">
//                         {progress}% Completed
//                       </span>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {/* ===================== Orders Info ===================== */}
//         <div>
//           <h2 className="text-2xl font-semibold text-gray-900 mb-4">
//             📑 Orders Information
//           </h2>
//           {loadingOrders ? (
//             <p className="text-gray-500">Loading your orders...</p>
//           ) : orders.length === 0 ? (
//             <p className="text-gray-500">No order records found.</p>
//           ) : (
//             <div className="space-y-4">
//               {orders.map((order) => (
//                 <div
//                   key={order.id}
//                   className="p-6 bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition"
//                 >
//                   <h3 className="text-lg font-semibold text-blue-600 mb-2">
//                     {/* ✅ Show course title if available, fallback to Order ID */}
//                     {order.course?.title
//                       ? order.course.title
//                       : `Order #${order.id}`}
//                   </h3>
//                   <p className="text-sm text-gray-600 mb-2">
//                     <span className="font-medium">Date:</span>{" "}
//                     {new Date(order.created_at).toLocaleDateString()}
//                   </p>
//                   <p className="text-sm text-gray-600 mb-2">
//                     <span className="font-medium">Amount:</span> $
//                     {order.amount || "N/A"}
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     <span className="font-medium">Payment Status:</span>{" "}
//                     <span
//                       className={`${
//                         order.status === "paid"
//                           ? "text-green-600"
//                           : "text-red-600"
//                       } font-semibold`}
//                     >
//                       {order.status}
//                     </span>
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NCLEXCourseDashboard;



"use client";
import React, { useEffect, useState } from "react";
import { Search, Bell, ChevronRight } from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

const NCLEXCourseDashboard = () => {
  const { id } = useParams();
  const url =useAuthStore((state) => state.url);
  const [coursesOrders, setCoursesOrders] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const [progressData, setProgressData] = useState({});
  const [loadingProgress, setLoadingProgress] = useState(true);

  const [modules, setModules] = useState({});

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

   // ✅ Fetch Course Progress
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "https://elab-server-xg5r.onrender.com/progress/courses",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          console.error("Failed to fetch course progress:", res.status);
          setProgressData({});
          return;
        }

        const data = await res.json();

        // Convert to dictionary {courseId: progressPercent}
        const progressMap = {};
        data.forEach((item) => {
          progressMap[item.course_id] = item.progress_percentage;
        });

        setProgressData(progressMap);
      } catch (error) {
        console.error("Error fetching course progress:", error);
        setProgressData({});
      } finally {
        setLoadingProgress(false);
      }
    };

    fetchProgress();
  }, []);
  
  useEffect(() => {
    const fetchModule = async () => {
      try {
        const token = localStorage.getItem("token");
        const moduleRes = await fetch(`${url}/courses/modules=${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Failed to fetch course progress:", res.status);
          setModules({});
          return;
        }

        // const data = await res.json();

        // Convert to dictionary {courseId: progressPercent}
       if (moduleRes.ok) {
          const moduleData = await moduleRes.json();
          setModules(moduleData);
        }

        // setProgressData(progressMap);
      } catch (error) {
        console.error("Error fetching course progress:", error);
      } finally {
        // setLoadingProgress(false);
      }
    };

    fetchModule();
  }, [id, url]);



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
          {loadingCourses || loadingProgress ? (
            <p className="text-gray-500">Loading your courses...</p>
          ) : coursesOrders.length === 0 ? (
            <p className="text-gray-500">You haven’t ordered any courses yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesOrders.map((course) => {
                // ✅ Replace random progress with real API progress
                const progress = progressData[course.id] || 0;

                const chartData = [
                  { name: "Progress", value: progress, fill: "#2563EB" },
                ];

                return (
                  <Link key={course.id} href={`/dashboard/my-courses/${course.id}`}>
    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition flex flex-col justify-between cursor-pointer">
      <div>
        <h3 className="text-lg font-semibold text-blue-600 mb-2">
          {course.title || "Unnamed Course"}
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          {course.description?.slice(0, 100) || "No description"}...
        </p>
        {course.total_modules && (
          <p className="text-gray-600 text-sm mb-4">
            📘 {course.total_modules} Modules
          </p>
        )}
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
  </Link>
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

