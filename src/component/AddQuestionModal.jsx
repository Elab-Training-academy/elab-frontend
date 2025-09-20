// app/components/AddQuestionModal.jsx
"use client";

import { useState, useEffect } from "react";
import { X, Plus, Minus, Check } from "lucide-react";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/authStore";

export default function AddQuestionModal({ isOpen, onClose, moduleId }) {
  const { url } = useAuthStore();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    module_id: moduleId || "",
    questionText: "",
    points: 10,
    questionType: "multiple_choice", // multiple_choice | single_choice | fill_gap
    options: [
      { id: 1, text: "", isCorrect: false },
      { id: 2, text: "", isCorrect: false },
    ],
    fillGapAnswers: [{ id: 1, text: "" }], // ✅ multiple fill-gap answers
    image: null,
  });

  // 🔹 Handle text/number input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 Options handling
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

  // 🔹 Fetch modules when modal opens
  useEffect(() => {
    if (!isOpen) return;
    const fetchModules = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${url}/modules`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch modules");
        const data = await res.json();
        setModules(data); // assume backend returns array of {id, name}
      } catch (err) {
        console.error("❌ Error fetching modules:", err);
      }
    };
    fetchModules();
  }, [isOpen]);

  // 🔹 Correct option toggle
  const toggleCorrectOption = (id) => {
    if (formData.questionType === "multiple_choice") {
      setFormData((prev) => ({
        ...prev,
        options: prev.options.map((option) =>
          option.id === id ? { ...option, isCorrect: !option.isCorrect } : option
        ),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        options: prev.options.map((option) =>
          option.id === id
            ? { ...option, isCorrect: true }
            : { ...option, isCorrect: false }
        ),
      }));
    }
  };

  // 🔹 Fill Gap Handlers
  const handleFillGapChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      fillGapAnswers: prev.fillGapAnswers.map((ans) =>
        ans.id === id ? { ...ans, text: value } : ans
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
        fillGapAnswers: prev.fillGapAnswers.filter((ans) => ans.id !== id),
      }));
    }
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  // 🔹 Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = new FormData();
      payload.append("module_id", formData.module_id);
      payload.append("question_text", formData.questionText);
      payload.append("points", formData.points);
      payload.append("answer_type", formData.questionType);

      if (formData.image) {
        payload.append("image", formData.image);
      }

      if (formData.questionType === "fill_gap") {
        const answerOptions = formData.fillGapAnswers.map((ans) => ({
          option_text: ans.text,
          is_correct: true,
        }));
        payload.append("answer_options", JSON.stringify(answerOptions));
      } else {
        const answerOptions = formData.options.map((opt) => ({
          option_text: opt.text,
          is_correct: opt.isCorrect,
        }));
        payload.append("answer_options", JSON.stringify(answerOptions));
      }

      const res = await fetch(`${url}/questions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });

      if (!res.ok) throw new Error("Failed to save question");

      const data = await res.json();
      console.log("✅ Question created:", data);
      toast.success("Question Create Successfully");

      onClose();
    } catch (err) {
      console.error("❌ Error creating question:", err);
      toast.error("Error creating question");
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
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
          {/* Module Selection */}
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Module</label>
            <select
              name="module_id"
              value={formData.module_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Select a module --</option>
              {modules.map(module => (
                <option key={module.id} value={module.id}>
                  {module.title}
                </option>
              ))}
            </select>
          </div>

          {/* Question Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Text
            </label>
            <textarea
              name="questionText"
              value={formData.questionText}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your question here"
              required
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Type
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer"
            />
          </div>

          {/* Points */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Points
            </label>
            <input
              type="number"
              name="points"
              value={formData.points}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Options (for MCQ/SCQ) */}
          {formData.questionType !== "fill_gap" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options
              </label>
              <div className="space-y-3">
                {formData.options.map((option, index) => (
                  <div key={option.id} className="flex items-start gap-3">
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => toggleCorrectOption(option.id)}
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                          option.isCorrect
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "border-gray-300 text-transparent"
                        }`}
                      >
                        <Check size={14} />
                      </button>
                      <span className="text-sm text-gray-600">Correct</span>
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm text-gray-600 mb-1">
                        Option {index + 1}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) =>
                            handleOptionChange(option.id, "text", e.target.value)
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter option text"
                          required
                        />
                        {formData.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(option.id)}
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

          {/* Fill Gap */}
          {formData.questionType === "fill_gap" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correct Answers (students must type these)
              </label>
              <div className="space-y-3">
                {formData.fillGapAnswers.map((ans, index) => (
                  <div key={ans.id} className="flex gap-2">
                    <input
                      type="text"
                      value={ans.text}
                      onChange={(e) =>
                        handleFillGapChange(ans.id, e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder={`Answer ${index + 1}`}
                      required
                    />
                    {formData.fillGapAnswers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFillGapAnswer(ans.id)}
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
            className={`px-6 py-2 bg-green-600 text-white rounded-lg ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
             {loading ? "Creating...." : "Question Created"} 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
