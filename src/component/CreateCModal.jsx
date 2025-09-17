"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function CreateCategoryModal({ isOpen, onClose, onSubmit }) {
  const fetchAllCourses = useAuthStore((state) => state.fetchAllCourses);
  const courses = useAuthStore((state) => state.courses || []);
  const token = useAuthStore((state) => state.token);


  const [formData, setFormData] = useState({
    course_id: "",
    name: "",
    description: "",
  });

  useEffect(() => {
    if (courses.length === 0) {
      fetchAllCourses();
    }
  }, [courses, fetchAllCourses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!formData.name || !formData.course_id || !formData.description) {
      alert("Course and Category name are required!");
      return;
    }

  try {
    const res = await fetch(`${url}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload), // includes course_id, name, description
    });

    if (res.ok) {
      const newCategory = await res.json();
      setCategories((prev) => [...prev, newCategory]);
      alert("Category created successfully!");
    } else {
      console.error("Failed to create category:", await res.text());
      alert("Failed to create category.");
    }
  } catch (err) {
    console.error("Error creating category:", err);
  }


    onSubmit(formData);

    // Reset
    setFormData({ course_id: "", name: "", description: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Create New Category
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Course Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Course <span className="text-red-500">*</span>
            </label>
          <select
            name="course_id"
            value={formData.course_id}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
            <option value="">-- Select a course --</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
          </div>

          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter category name"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter category description"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows="3"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow"
            >
              Save Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
