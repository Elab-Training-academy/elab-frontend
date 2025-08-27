"use client";
import { useAuthStore } from "@/store/authStore";
import { X } from "lucide-react";

const CreateCourseModal = ({ isOpen, onClose, onSubmit, courseData, setCourseData }) => {
  const url = useAuthStore(state => state.url);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataForm = new FormData();
      Object.entries(courseData).forEach(([key, value]) => {
        dataForm.append(key, value);
      });

      // ✅ get token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found in localStorage");
        alert("You must be logged in to create a course.");
        return;
      }

      const response = await fetch(`${url}/courses`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ use token here
        },
        body: dataForm,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Course created:", data);
        onSubmit(data); // pass back created course
      } else {
        const err = await response.json();
        console.error("Failed to create course:", err);
        alert(`Error: ${err.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error creating course:", error);
    }

    onClose(); // close after submit
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Create New Course</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Course Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Title
            </label>
            <input
              type="text"
              name="title"
              value={courseData.title}
              onChange={handleInputChange}
              placeholder="Enter course title"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Course Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Description
            </label>
            <div className="border border-gray-300 rounded-md p-2 mb-1">
              <textarea
                name="description"
                value={courseData.description}
                onChange={handleInputChange}
                placeholder="Enter course description"
                className="w-full h-32 px-2 py-1 focus:outline-none resize-none"
                required
              ></textarea>
            </div>
          </div>

          {/* Category and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Category
              </label>
              <select
                name="category"
                value={courseData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              >
                <option value="">Select Category</option>
                <option value="programming">Programming</option>
                <option value="design">Design</option>
                <option value="business">Business</option>
                <option value="marketing">Marketing</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration
              </label>
              <select
                name="duration"
                value={courseData.duration}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              >
                <option value="">Select Duration</option>
                <option value="1-3 hours">1-3 hours</option>
                <option value="3-6 hours">3-6 hours</option>
                <option value="6-10 hours">6-10 hours</option>
                <option value="10+ hours">10+ hours</option>
              </select>
            </div>
          </div>

          {/* Price and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Price in USD($)
              </label>
              <input
                type="number"
                name="price"
                value={courseData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={courseData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow"
            >
              Next →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourseModal;
