"use client";
import React, { useEffect, useState } from "react";
import { Search, Users, TrendingUp, ChevronRight, Bell } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const Dashboard = () => {
  const { user, fetchUser } = useAuthStore();
 

  useEffect(() => {
    fetchUser?.();
  }, [fetchUser]);

 const [coursesOrders, setCoursesOrders] = useState([]);
  const { url } = useAuthStore();
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [courseIds, setCourseIds] = useState([])
  const [progress, setProgress] = useState([]);

  // Fetch ordered courses
 useEffect(() => {
     const fetchCourses = async () => {
       try {
         const token = localStorage.getItem("token");
         if (!token) {
           console.error("No token found");
           setCoursesOrders([]);
           return;
         }
 
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
         console.log(data);

         let ids = [];

         data.filter((d)=>{
          ids.push(d.id)
          setCourseIds(ids)
         })
  
         setCoursesOrders(data);
       } catch (error) {
         console.error("Error fetching ordered courses:", error);
         setCoursesOrders([]);
       } finally {
        //  setLoadingCourses(false);
       }
     };
 
     fetchCourses();
   }, []);

  useEffect(() => {
  courseIds.map(async(id)=>{
    if (!courseIds || courseIds.length == 0) return; // wait until we have courseId

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${url}/progress/courses/${id}/module-progress`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setProgress(data);
      } else {
        console.error("Failed to fetch progress:", res.status);
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  })

}, [courseIds, url]);

    
  


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Type a command or search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
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
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex-1">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="w-5 h-5 bg-blue-600 rounded-full"></div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">03</p>
                  <p className="text-gray-600 text-sm">Total Point</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 flex-1">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <div className="w-5 h-5 bg-purple-600 rounded"></div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">03</p>
                  <p className="text-gray-600 text-sm">Current Level</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lesson Schedules & Study Groups */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lesson Schedules */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Lesson Schedules</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">With: DR James Oluchi (Tutor)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Date: Mon, Aug 5</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Time: 10:00-11:00 AM</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Meet link</span>
              </div>
            </div>
          </div>

          {/* Study Groups */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Groups</h3>
            <p className="text-sm text-gray-600 mb-4">
              Connect, learn, and succeed - join the group today!
            </p>
            <button className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-200 rounded-lg py-2 px-4 hover:bg-gray-50 transition-colors">
              <span className="text-gray-700">Join Study Groups</span>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Performance Insight & Exam Readiness */}
        <div className="grid grid-cols-1 gap-6 mt-8">
          {/* Performance Insight */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Insight</h2>
            <div className="space-y-4">
              {progress?.module_progress?.map((mod, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{mod.module_name}</h4>
                    <p className="text-sm text-gray-600">{mod.total_questions} questions attempted</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-semibold text-gray-900">{mod.completion_percentage}%</span>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exam Readiness */}
          {/* <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Exam Readiness</h3>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-32 h-32">
                <svg
                  className="w-32 h-32 transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="8"
                    strokeDasharray={`${50 * 2.51} ${100 * 2.51}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">50%</p>
                    <p className="text-xs text-gray-600">Ready</p>
                  </div>
                </div>
              </div>
            </div>
            <button className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-200 rounded-lg py-2 px-4 hover:bg-gray-50 transition-colors">
              <span className="text-gray-700">View more</span>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
