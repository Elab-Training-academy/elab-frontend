"use client";

import { useState, useEffect } from "react";
import { X, ChevronDown, Plus, Minus, Check, Clock, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../src/store/authStore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddSmartPracticeModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    category: "",
    course: "",
    difficulty: "Easy",
    questionType: "Multiple Choice",
    timeLimit: "60",
    points: "10",
    questionText: "",
    options: [
      { id: 1, text: "", isCorrect: true },
      { id: 2, text: "", isCorrect: false },
    ],
    explanation: "",
    hint: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const url = useAuthStore((state) => state.url);
  const token = localStorage.getItem("token");
  const router = useRouter();

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${url}/categories/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        } else {
          console.error("Failed to fetch categories", res.status);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    if (isOpen) fetchCategories();
  }, [isOpen, url, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((option) =>
        option.id === id ? { ...option, [field]: value } : option
      ),
    }));
  };

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, { id: Date.now(), text: "", isCorrect: false }],
    }));
  };

  const removeOption = (id) => {
    if (formData.options.length > 2) {
      setFormData((prev) => ({
        ...prev,
        options: prev.options.filter((option) => option.id !== id),
      }));
    }
  };

  const toggleCorrectOption = (id) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((option) =>
        option.id === id ? { ...option, isCorrect: !option.isCorrect } : option
      ),
    }));
  };

  const resetForm = () => {
    setFormData({
      category: "",
      course: "",
      difficulty: "Easy",
      questionType: "Multiple Choice",
      timeLimit: "60",
      points: "10",
      questionText: "",
      options: [
        { id: 1, text: "", isCorrect: true },
        { id: 2, text: "", isCorrect: false },
      ],
      explanation: "",
      hint: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      question: formData.questionText,
      difficulty: formData.difficulty.toLowerCase(),
      category_id: formData.category, // real ID from API
      time: parseInt(formData.timeLimit, 10),
      points: parseInt(formData.points, 10),
      mode: "smart practice",
      level: formData.course || "general",
      reason: formData.explanation,
      answers: formData.options.map((opt) => ({
        answer: opt.text,
        is_correct: opt.isCorrect,
      })),
      hint: formData.hint || null,
      question_type: formData.questionType.toLowerCase(),
    };

    try {
      const res = await fetch(`${url}/sp-questions/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error("❌ Failed: " + (errorData.message || "Unknown error"));
        setLoading(false);
        return;
      }

      await res.json();
      toast.success("✅ Question saved!");
      resetForm();
      onClose();
      router.refresh();
    } catch (err) {
      console.error("API Error:", err);
      toast.error("❌ Check your internet.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Add Smart Practice Question
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>


          <form onSubmit={handleSubmit} className="p-4 md:p-6">
            {/* Category and Course */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course (Optional)
                </label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  placeholder="Enter course or level"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Question Type, Time, Points */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Type
                </label>
                <select
                  name="questionType"
                  value={formData.questionType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Multiple Choice">Multiple Choice</option>
                  <option value="True/False">True/False</option>
                  <option value="Short Answer">Short Answer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Clock size={16} className="mr-2" /> Time (sec)
                </label>
                <input
                  type="number"
                  name="timeLimit"
                  value={formData.timeLimit}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Star size={16} className="mr-2" /> Points
                </label>
                <input
                  type="number"
                  name="points"
                  value={formData.points}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>

            {/* Difficulty */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Question Text */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question
              </label>
              <textarea
                name="questionText"
                value={formData.questionText}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {/* Options */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options
              </label>
              {formData.options.map((option, index) => (
                <div key={option.id} className="border rounded-lg p-3 mb-2">
                  <div className="flex justify-between items-center mb-2">
                    <span>Option {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => toggleCorrectOption(option.id)}
                      className={`px-2 py-1 rounded text-sm ${
                        option.isCorrect
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {option.isCorrect ? "Correct" : "Mark Correct"}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) =>
                      handleOptionChange(option.id, "text", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Option text"
                    required
                  />
                  {formData.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(option.id)}
                      className="mt-2 text-red-500 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addOption}
                className="mt-2 text-blue-600 text-sm"
              >
                + Add Option
              </button>
            </div>

            {/* Explanation */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Explanation
              </label>
              <textarea
                name="explanation"
                value={formData.explanation}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {/* Hint */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hint (Optional)
              </label>
              <textarea
                name="hint"
                value={formData.hint}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg mr-3"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Question"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
