// app/components/AddFlashcardModal.jsx
"use client";

import { useState, useEffect } from "react";
import { X, ChevronDown, BookOpen, FileText, Loader } from "lucide-react";

export default function AddFlashcardModal({ isOpen, onClose, onFlashcardAdded }) {
  const [formData, setFormData] = useState({
    category_id: "",
    course_category_id: "",
    course_id: "",
    question: "",
    answer: "",
    note: ""
  });

  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]); 
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");

  // Reset form and fetch when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCategoriesAndCourses();
      setFormData({
        category_id: "",
        course_category_id: "",
        course_id: "",
        question: "",
        answer: "",
        note: ""
      });
      setError("");
    }
  }, [isOpen]);

  const fetchCategoriesAndCourses = async () => {
    setFetching(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      // Fetch categories
      const categoriesResponse = await fetch(
        "https://elab-server-xg5r.onrender.com/course-categories",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!categoriesResponse.ok) {
        throw new Error(`Failed to fetch categories: ${categoriesResponse.status}`);
      }
      const categoriesData = await categoriesResponse.json();
      setAllCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setCategories([]);

      // Fetch courses
      const coursesResponse = await fetch(
        "https://elab-server-xg5r.onrender.com/courses",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!coursesResponse.ok) {
        throw new Error(`Failed to fetch courses: ${coursesResponse.status}`);
      }
      const coursesData = await coursesResponse.json();
      setCourses(Array.isArray(coursesData) ? coursesData : []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to load categories and courses");
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // When course changes, filter categories
    if (name === "course_id") {
      const filtered = allCategories.filter(cat => String(cat.course_id) === String(value));
      setCategories(filtered);
      setFormData(prev => ({
        ...prev,
        course_id: value,
        category_id: "",
        course_category_id: filtered.length > 0 ? filtered[0].id : ""
      }));
    }

    // When category changes, set course_category_id
    if (name === "category_id") {
      const selectedCategory = allCategories.find(cat => String(cat.id) === String(value));
      setFormData(prev => ({
        ...prev,
        category_id: value,
        course_category_id: selectedCategory ? selectedCategory.id : ""
      }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      if (!formData.category_id || !formData.course_id || !formData.question || !formData.answer) {
        throw new Error("Please fill in all required fields");
      }

      const apiData = {
        category_id: formData.category_id,
        course_id: formData.course_id,
        course_category_id: formData.course_category_id,
        question: formData.question,
        answer: formData.answer,
        note: formData.note || ""
      };

      const response = await fetch("https://elab-server-xg5r.onrender.com/flash-cards", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || errorData.detail || `HTTP error! status: ${response.status}`
        );
      }

      if (onFlashcardAdded) onFlashcardAdded();
      onClose();
    } catch (err) {
      console.error("Error creating flashcard:", err);
      setError(err.message || "Failed to create flashcard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getDisplayName = item => item.title || item.name || `ID: ${item.id}`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Add New Flashcard</h2>
          <button
            onClick={onClose}
            disabled={loading || fetching}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {fetching && (
            <div className="mb-6 p-4 text-center bg-blue-50 rounded-lg">
              <Loader className="w-6 h-6 animate-spin mx-auto text-blue-600" />
              <p className="text-gray-600 mt-2">Loading categories and courses...</p>
            </div>
          )}

          {/* Course & Category Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Course Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course *</label>
              <div className="relative">
                <select
                  name="course_id"
                  value={formData.course_id}
                  onChange={handleInputChange}
                  required
                  disabled={fetching || loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none pr-8 disabled:opacity-50"
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {getDisplayName(course)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <div className="relative">
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  required
                  disabled={fetching || loading || !formData.course_id}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none pr-8 disabled:opacity-50"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {getDisplayName(category)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Question *</label>
            <textarea
              name="question"
              value={formData.question}
              onChange={handleInputChange}
              rows={3}
              required
              disabled={loading}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 resize-none"
              placeholder="Enter question"
            />
          </div>

          {/* Answer */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Answer *</label>
            <textarea
              name="answer"
              value={formData.answer}
              onChange={handleInputChange}
              rows={3}
              required
              disabled={loading}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 resize-none"
              placeholder="Enter answer"
            />
          </div>

          {/* Note */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Note (Optional)</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              rows={2}
              disabled={loading}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 resize-none"
              placeholder="Add note"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border rounded-lg text-gray-700 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || fetching}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : "Create Flashcard"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
