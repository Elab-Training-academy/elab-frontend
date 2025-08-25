// app/elab-admin/courses/page.jsx
"use client";
import { useState } from "react";
import { Plus, Filter } from "lucide-react";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);

  return (
    <div className="flex-1 p-6">
    
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
        <p className="text-sm text-gray-500">
          Manage courses, upload new content and edit existing courses
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-3 mb-8">
        <input
          type="text"
          placeholder="Search by title, description and category"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100">
          <Filter size={16} />
          Filters
        </button>
      </div>

      {/* Course List or Empty State */}
      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-gray-700 mb-2">
            Looks like you havent added any courses yet
          </p>
          <a href="#" className="text-blue-600 hover:underline mb-4">
            Need a place to start?
          </a>
          <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
