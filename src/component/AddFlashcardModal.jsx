"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { X, ChevronDown, Loader } from "lucide-react";

import "react-quill-new/dist/quill.snow.css";

// ✅ Load react-quill-new without SSR
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

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

      const categoriesResponse = await fetch(
        "https://elab-server-xg5r.onrender.com/course-categories",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const categoriesData = await categoriesResponse.json();
      setAllCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setCategories([]);

      const coursesResponse = await fetch(
        "https://elab-server-xg5r.onrender.com/courses",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const coursesData = await coursesResponse.json();
      setCourses(Array.isArray(coursesData) ? coursesData : []);
    } catch (err) {
      setError(err.message || "Failed to load categories and courses");
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

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
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(apiData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.detail || `Error: ${response.status}`);
      }

      if (onFlashcardAdded) onFlashcardAdded();
      onClose();
    } catch (err) {
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
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Add New Flashcard</h2>
          <button
            onClick={onClose}
            disabled={loading || fetching}
            className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Course & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Course *</label>
              <select
                name="course_id"
                value={formData.course_id}
                onChange={handleInputChange}
                required
                disabled={fetching || loading}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a course</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {getDisplayName(course)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                required
                disabled={fetching || loading || !formData.course_id}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {getDisplayName(category)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Question with ReactQuill */}
          <div>
            <label className="block text-sm font-medium mb-2">Question *</label>
            <div className="w-full bg-white border rounded-lg shadow-sm">
              <ReactQuill
                value={formData.question}
                onChange={value => setFormData(prev => ({ ...prev, question: value }))}
                theme="snow"
                className="min-h-[200px] sm:min-h-[250px] md:min-h-[300px] w-full text-lg"
              />
            </div>
          </div>

          {/* Answer */}
          <div>
            <label className="block text-sm font-medium mb-2">Answer *</label>
            <textarea
              name="answer"
              value={formData.answer}
              onChange={handleInputChange}
              rows={3}
              required
              disabled={loading}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium mb-2">Note (Optional)</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              rows={2}
              disabled={loading}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border rounded-lg"
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
