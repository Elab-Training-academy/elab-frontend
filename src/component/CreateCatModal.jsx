"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";

// Dynamic import for ReactQuill
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// Wrapper to prevent findDOMNode errors
function QuillWrapper({ value, onChange }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <ReactQuill value={value} onChange={onChange} theme="snow" />;
}

export default function CreateCatModal({ onClose }) {
  const [formData, setFormData] = useState({
    question_text: "",
    question_type: "fill_in_the_blank",
    difficulty_level: "",
    discrimination: "",
    guessing_param: "",
    points: "",
    tags: "NCLEX",
    explanation: "",
    options: [{ option_text: "", is_correct: false }],
    course_id: "",
    image: null,
    audio: null,
  });

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false); // loading state

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://elab-server-xg5r.onrender.com/courses", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCourses(data || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
        toast.error("Failed to fetch courses");
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...formData.options];
    newOptions[index][field] = field === "is_correct" ? value === "true" : value;
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, { option_text: "", is_correct: false }],
    }));
  };

  const removeOption = (index) => {
    const newOptions = [...formData.options];
    newOptions.splice(index, 1);
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.course_id) {
      toast.error("Please select a course");
      return;
    }

    setLoading(true); // start loading
    try {
      const token = localStorage.getItem("token");
      const body = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "options") {
            body.append(key, JSON.stringify(value));
          } else {
            body.append(key, value);
          }
        }
      });

      const res = await fetch("https://elab-server-xg5r.onrender.com/cat-questions", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body,
      });

      if (!res.ok) throw new Error("Failed to create CAT question");
      toast.success("CAT Question created successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Error creating CAT question");
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-2 sm:p-0">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] p-6 relative overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-bold mb-4 text-center sm:text-left">Create CAT Question</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Question with QuillWrapper */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Question</label>
              <QuillWrapper
                value={formData.question_text}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, question_text: value }))
                }
              />
            </div>

            {/* Question Type */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Question Type</label>
              <select
                name="question_type"
                value={formData.question_type}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 text-sm"
              >
                <option value="multiple_choice">Multiple Choice</option>
                <option value="multiple_select">Multiple Select</option>
                <option value="true_false">True / False</option>
                <option value="fill_in_the_blank">Fill in the Blank</option>
                <option value="arrange_order">Arrange Order</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Tags</label>
              <select
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 text-sm"
              >
                <option value="NCLEX">NCLEX</option>
                <option value="nursing">Nursing</option>
                <option value="cardiac">Cardiac</option>
              </select>
            </div>

            {/* Difficulty, Discrimination, Guessing, Points */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Difficulty (-3.0 to 3.0)</label>
              <input
                type="number"
                step="0.1"
                min="-3.0"
                max="3.0"
                name="difficulty_level"
                value={formData.difficulty_level}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Discrimination (0.0 to 2.0)</label>
              <input
                type="number"
                step="0.1"
                min="0.0"
                max="2.0"
                name="discrimination"
                value={formData.discrimination}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Guessing Param (0.0 to 1.0)</label>
              <input
                type="number"
                step="0.01"
                min="0.0"
                max="1.0"
                name="guessing_param"
                value={formData.guessing_param}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Points</label>
              <input
                type="number"
                name="points"
                value={formData.points}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 text-sm"
              />
            </div>

            {/* Explanation */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Explanation</label>
              <textarea
                name="explanation"
                value={formData.explanation}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 text-sm"
              />
            </div>

            {/* Options */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Options</label>
              {formData.options.map((option, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Option text"
                    value={option.option_text}
                    onChange={(e) => handleOptionChange(index, "option_text", e.target.value)}
                    className="border rounded p-2 text-sm flex-1"
                    required
                  />
                  <select
                    value={option.is_correct}
                    onChange={(e) => handleOptionChange(index, "is_correct", e.target.value)}
                    className="border rounded p-2 text-sm"
                  >
                    <option value={true}>Correct</option>
                    <option value={false}>Incorrect</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addOption}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded"
              >
                + Add Option
              </button>
            </div>

            {/* Course ID Select */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Course</label>
              <select
                name="course_id"
                value={formData.course_id}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 text-sm"
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Image</label>
              <input
                type="file"
                name="image"
                onChange={handleChange}
                accept="image/*"
                className="w-full border rounded-lg p-2 text-sm"
              />
            </div>

            {/* Audio */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Audio</label>
              <input
                type="file"
                name="audio"
                onChange={handleChange}
                accept="audio/*"
                className="w-full border rounded-lg p-2 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {loading ? "Saving..." : "Save Question"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
