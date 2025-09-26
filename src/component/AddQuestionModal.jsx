"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { X, Plus, Minus, Check } from "lucide-react";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/authStore";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function AddQuestionModal({ isOpen, onClose, moduleId }) {
  const { url } = useAuthStore();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState([]);
  const [moduleLoading, setModuleLoading] = useState(false);

  const [formData, setFormData] = useState({
    module_id: moduleId || "",
    questionText: "",
    points: 10,
    questionType: "multiple_choice",
    options: [
      { id: 1, text: "", isCorrect: false },
      { id: 2, text: "", isCorrect: false },
    ],
    fillGapAnswers: [{ id: 1, text: "" }],
    image: null,
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // React Quill handler
  const handleQuillChange = (value) => {
    setFormData((prev) => ({ ...prev, questionText: value }));
  };

  // Options handling
  const handleOptionChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((o) =>
        o.id === id ? { ...o, [field]: value } : o
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
        options: prev.options.filter((o) => o.id !== id),
      }));
    }
  };

  const fetchModules = async (courseId) => {
    try {
      setModuleLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Session expired, please login");

      const res = await fetch(`${url}/modules/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch modules");

      const data = await res.json();
      setModules(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setModuleLoading(false);
    }
  };

  // Fetch courses when modal opens
  useEffect(() => {
    if (!isOpen) return;
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Session expired, please login");
      return;
    }

    const fetchCourses = async () => {
      try {
        const res = await fetch(`${url}/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchCourses();
  }, [isOpen, url]);

  // Handle course change
  const handleCoursesChange = (e) => {
    const selectedId = e.target.value;
    setCourseId(selectedId);
    setFormData((prev) => ({ ...prev, module_id: "" })); // reset module
    if (selectedId) fetchModules(selectedId);
  };

  // Toggle correct option
  const toggleCorrectOption = (id) => {
    if (formData.questionType === "multiple_choice") {
      setFormData((prev) => ({
        ...prev,
        options: prev.options.map((o) =>
          o.id === id ? { ...o, isCorrect: !o.isCorrect } : o
        ),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        options: prev.options.map((o) =>
          o.id === id ? { ...o, isCorrect: true } : { ...o, isCorrect: false }
        ),
      }));
    }
  };

  // Fill gap handling
  const handleFillGapChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      fillGapAnswers: prev.fillGapAnswers.map((a) =>
        a.id === id ? { ...a, text: value } : a
      ),
    }));
  };

  const addFillGapAnswer = () => {
    setFormData((prev) => ({
      ...prev,
      fillGapAnswers: [...prev.fillGapAnswers, { id: Date.now(), text: "" }],
    }));
  };

  const removeFillGapAnswer = (id) => {
    if (formData.fillGapAnswers.length > 1) {
      setFormData((prev) => ({
        ...prev,
        fillGapAnswers: prev.fillGapAnswers.filter((a) => a.id !== id),
      }));
    }
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Session expired, please login");

      const payload = new FormData();
      payload.append("module_id", formData.module_id);
      payload.append("question_text", formData.questionText);
      payload.append("points", formData.points);
      payload.append("answer_type", formData.questionType);

      if (formData.image) payload.append("image", formData.image);

      const answerOptions =
        formData.questionType === "fill_gap"
          ? formData.fillGapAnswers.map((a) => ({
              option_text: a.text,
              is_correct: true,
            }))
          : formData.options.map((o) => ({
              option_text: o.text,
              is_correct: o.isCorrect,
            }));

      payload.append("answer_options", JSON.stringify(answerOptions));

      const res = await fetch(`${url}/questions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });

      if (!res.ok) throw new Error("Failed to create question");

      toast.success("Question created successfully");
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Add Question
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
          {/* Course selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
            <select
              value={courseId}
              onChange={handleCoursesChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Select a course --</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          {/* Module selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Module</label>
            <select
              name="module_id"
              value={formData.module_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              disabled={moduleLoading}
            >
              <option value="">
                {moduleLoading ? "Loading modules..." : "-- Select a module --"}
              </option>
              {modules.map((m) => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
          </div>

          {/* Question text with React Quill */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
            <ReactQuill
              value={formData.questionText}
              onChange={handleQuillChange}
              className="bg-white rounded-lg border border-gray-300 w-full text-base"
              theme="snow"
            />
          </div>

          {/* Question type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
            <select
              name="questionType"
              value={formData.questionType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="multiple_choice">Multiple Choice</option>
              <option value="single_choice">Single Choice</option>
              <option value="fill_gap">Fill in the Gap</option>
            </select>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer"
            />
          </div>

          {/* Points */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
            <input
              type="number"
              name="points"
              value={formData.points}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Options */}
          {formData.questionType !== "fill_gap" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
              <div className="space-y-3">
                {formData.options.map((o, index) => (
                  <div key={o.id} className="flex items-start gap-3">
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => toggleCorrectOption(o.id)}
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                          o.isCorrect ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300 text-transparent"
                        }`}
                      >
                        <Check size={14} />
                      </button>
                      <span className="text-sm text-gray-600">Correct</span>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm text-gray-600 mb-1">Option {index + 1}</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={o.text}
                          onChange={(e) => handleOptionChange(o.id, "text", e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter option text"
                          required
                        />
                        {formData.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(o.id)}
                            className="px-2 text-red-600 hover:text-red-800"
                          >
                            <Minus size={20} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addOption}
                className="mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                <Plus size={16} /> Add more options
              </button>
            </div>
          )}

          {/* Fill gap answers */}
          {formData.questionType === "fill_gap" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correct Answers (students must type these)
              </label>
              <div className="space-y-3">
                {formData.fillGapAnswers.map((a, index) => (
                  <div key={a.id} className="flex gap-2">
                    <input
                      type="text"
                      value={a.text}
                      onChange={(e) => handleFillGapChange(a.id, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder={`Answer ${index + 1}`}
                      required
                    />
                    {formData.fillGapAnswers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFillGapAnswer(a.id)}
                        className="px-2 text-red-600 hover:text-red-800"
                      >
                        <Minus size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addFillGapAnswer}
                className="mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                <Plus size={16} /> Add another answer
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg mr-3 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 text-white rounded-lg ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Creating..." : "Create Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
