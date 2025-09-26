"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function AddSmartPracticeModal({ isOpen, onClose }) {
  const url = useAuthStore((state) => state.url);
  const token = useAuthStore((state) => state.token);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    questionText: "",
    difficulty: "easy",
    category: "",
    course: "",
    questionType: "single_choice",
    explanation: "",
    points: 1,
    timeLimit: 30,
    hint: "",
    options: [{ text: "", isCorrect: false }],
  });

  // ✅ Reset form
  const resetForm = () => {
    setFormData({
      questionText: "",
      difficulty: "easy",
      category: "",
      course: "",
      questionType: "single_choice",
      explanation: "",
      points: 1,
      timeLimit: 30,
      hint: "",
      options: [{ text: "", isCorrect: false }],
    });
  };

  // ✅ Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${url}/courses/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setCourses(await res.json());
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    if (isOpen) fetchCourses();
  }, [isOpen, url, token]);

  // ✅ Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${url}/course-categories/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const filtered = data.filter((cat) => cat.course_id === formData.course);
          setCategories(filtered);
        } else {
          const err = await res.json();
          console.log("error fetching", err);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    if (isOpen) fetchCategories();
  }, [isOpen, url, token, formData.course]);

  // ✅ Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      question: formData.questionText,
      difficulty: formData.difficulty.toLowerCase(),
      course_category_id: formData.category,
      course_id: formData.course,
      reason: formData.explanation,
      status: "published",
      question_type: formData.questionType,
      points: parseInt(formData.points, 10),
      time: parseInt(formData.timeLimit, 10),
      answers: formData.options.map((opt) => ({
        answer: opt.text,
        is_correct: opt.isCorrect,
      })),
      hint: formData.hint || null,
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
        toast.error("❌ Failed: " + (errorData.detail || "Unknown error"));
        setLoading(false);
        return;
      }

      const data = await res.json();
      toast.success("✅ Question saved!");
      console.log("Saved question:", data);

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

  // ✅ Handle option changes
  const handleOptionChange = (index, field, value) => {
    setFormData((prev) => {
      const newOptions = [...prev.options];
      newOptions[index][field] = value;
      return { ...prev, options: newOptions };
    });
  };

  // ✅ Add option
  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, { text: "", isCorrect: false }],
    }));
  };

  // ✅ Remove option
  const removeOption = (index) => {
    setFormData((prev) => {
      const newOptions = prev.options.filter((_, i) => i !== index);
      return { ...prev, options: newOptions };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Add Smart Practice Question</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Question */}
          <div>
            <label className="block text-sm font-medium">Question</label>
            <ReactQuill
              theme="snow"
              value={formData.questionText}
              onChange={(value) =>
                setFormData({ ...formData, questionText: value })
              }
              className="bg-white   rounded-lg shadow-md border border-gray-200
                   min-h-[300px] sm:min-h-[350px] md:min-h-[400px] 
                   w-full text-lg"  
            />
          </div>

          {/* Course & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Course</label>
              <select
                className="w-full border rounded p-2"
                value={formData.course}
                onChange={(e) =>
                  setFormData({ ...formData, course: e.target.value })
                }
                required
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name || course.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Course Category</label>
              <select
                className="w-full border rounded p-2"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
              >
                <option value="">Select Course Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Question Type */}
          <div>
            <label className="block text-sm font-medium">Question Type</label>
            <select
              className="w-full border rounded p-2"
              value={formData.questionType}
              onChange={(e) =>
                setFormData({ ...formData, questionType: e.target.value })
              }
            >
              <option value="single_choice">Single Choice</option>
              <option value="multiple_choice">Multiple Choice</option>
              <option value="fill_gap">Fill Gap</option>
            </select>
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium">Options</label>
            {formData.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder={`Option ${i + 1}`}
                  className="flex-1 border rounded p-2"
                  value={opt.text}
                  onChange={(e) =>
                    handleOptionChange(i, "text", e.target.value)
                  }
                  required
                />
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={opt.isCorrect}
                    onChange={(e) =>
                      handleOptionChange(i, "isCorrect", e.target.checked)
                    }
                  />
                  Correct
                </label>
                <button
                  type="button"
                  onClick={() => removeOption(i)}
                  className="px-2 py-1 text-sm bg-red-500 text-white rounded"
                  disabled={formData.options.length === 1}
                >
                  X
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

          {/* Points & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Points</label>
              <input
                type="number"
                className="w-full border rounded p-2"
                value={formData.points}
                onChange={(e) =>
                  setFormData({ ...formData, points: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Time Limit (s)</label>
              <input
                type="number"
                className="w-full border rounded p-2"
                value={formData.timeLimit}
                onChange={(e) =>
                  setFormData({ ...formData, timeLimit: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Explanation */}
          <div> 
            <label className="block text-sm font-medium">Explanation</label>
           <textarea className="w-full border rounded p-2" value={formData.explanation} 
           onChange={(e) => setFormData({ ...formData, explanation: e.target.value }) } /> 
           </div>

          {/* Hint */}
          <div>
            <label className="block text-sm font-medium">Hint</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={formData.hint}
              onChange={(e) =>
                setFormData({ ...formData, hint: e.target.value })
              }
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
