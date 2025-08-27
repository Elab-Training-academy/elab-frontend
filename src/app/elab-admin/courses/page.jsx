"use client";
import { useEffect, useState } from "react";
import { Plus, Filter } from "lucide-react";
import CreateCourseModal from "../../../component/CreateCourseModal";
import { useAuthStore } from "@/store/authStore";

export default function CoursesPage() {
  const [showModal, setShowModal] = useState(false);
  const fetchAllCourses = useAuthStore((state) => state.fetchAllCourses);
  const newToken = useAuthStore((state) => state.token);
  const setToken = useAuthStore((state) => state.setToken);
  const courses = useAuthStore((state) => state.courses);
  const setCourses = useAuthStore((state) => state.setCourses);
  const loading = useAuthStore((state) => state.loading);

  
  


  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "",
    duration: null,
    price: 100,
    status: "Draft",
  });
  

  // Ensure token from localStorage
  useEffect(() => {
    if (!newToken && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }

    // console.log(newToken);
    
    
  }, [newToken, setToken]);

  // Fetch courses
  useEffect(() => {
    fetchAllCourses();
  }, [fetchAllCourses]);

  const handleSubmit = (courseData) => {
    console.log("Course data:", courseData);

    // Add new course locally (optimistic update)
    setCourses([...courses, courseData]);

    setShowModal(false);

    setCourseData({
      title: "",
      description: "",
      category: "",
      duration: null,
      price: 100,
      status: "Draft",
    });
  };

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
        <p className="text-sm text-gray-500">
          Manage courses, upload new content and edit existing courses
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
        <input
          type="text"
          placeholder="Search by title, description and category"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100 w-full sm:w-auto justify-center">
          <Filter size={16} />
          Filters
        </button>
      </div>

      {/* Loading State */}
      {loading && <p className="text-gray-500">Loading courses...</p>}

      {/* Course List or Empty State */}
      {!loading && courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-gray-700 mb-2">
            Looks like you haven't added any courses yet
          </p>
          <a href="#" className="text-blue-600 hover:underline mb-4">
            Need a place to start?
          </a>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow"
          >
            <Plus size={18} /> Add New Course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 shadow hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg">{course.title}</h3>
              <p className="text-sm text-gray-500">{course.description}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {course.category}
                </span>
                <span className="font-medium">${course.price}</span>
              </div>
            </div>
          ))}

          {/* Add New Course Card */}
          <div
            className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
            onClick={() => setShowModal(true)}
          >
            <Plus size={24} className="text-gray-400 mb-2" />
            <p className="text-gray-600">Add New Course</p>
          </div>
        </div>
      )}

      {/* Modal Component */}
      <CreateCourseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        courseData={courseData}
        setCourseData={setCourseData}
      />
    </div>
  );
}
