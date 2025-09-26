"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/authStore";

// Dynamic import of ReactQuill for SSR
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

export default function EditQuestionModal({ isOpen, onClose, question, onUpdated }) {
  const { url } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    module_id: "",
    question_text: "",
    answer_type: "multiple_choice",
    points: 0,
    answer_options: [],
    image: null,
  });
  const [preview, setPreview] = useState(null);

  // Pre-fill when editing
  useEffect(() => {
    if (question) {
      setFormData({
        module_id: question.module_id,
        question_text: question.question_text,
        answer_type: question.answer_type,
        points: question.points,
        answer_options: question.answer_options,
        image: null,
      });
      setPreview(question.image_url || null);
    }
  }, [question]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...formData.answer_options];
    updatedOptions[index][field] = value;
    setFormData((prev) => ({ ...prev, answer_options: updatedOptions }));
  };

  const handleAddOption = () => {
    setFormData((prev) => ({
      ...prev,
      answer_options: [...prev.answer_options, { option_text: "", is_correct: false }],
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    try {
      const body = new FormData();

      if (formData.module_id && formData.module_id.length > 10) {
        body.append("module_id", formData.module_id);
      }

      body.append("question_text", formData.question_text);
      body.append("answer_type", formData.answer_type);
      body.append("points", formData.points);
      body.append("answer_options", JSON.stringify(formData.answer_options));
      if (formData.image) body.append("image", formData.image);

      const res = await fetch(`${url}/questions/${question.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      if (!res.ok) throw new Error("Failed to update question");

      const updated = await res.json();
      toast.success("Question updated successfully");
      onUpdated(updated);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error updating question");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] p-5 flex flex-col">
        <h2 className="text-lg font-bold mb-4">Edit Question</h2>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Question Text */}
          <label className="block mb-1 font-medium">Question</label>
          <ReactQuill
            value={formData.question_text}
            onChange={(value) => handleChange("question_text", value)}
            theme="snow"
            className="mb-4"
          />

          {/* Points */}
          <input
            type="number"
            name="points"
            value={formData.points}
            onChange={(e) => handleChange("points", Number(e.target.value))}
            placeholder="Points"
            className="w-full border rounded p-2"
          />

          {/* Answer Options */}
          <div>
            <label className="block mb-1 font-medium">Answer Options</label>
            {formData.answer_options.map((opt, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={opt.option_text}
                  onChange={(e) => handleOptionChange(idx, "option_text", e.target.value)}
                  placeholder="Option text"
                  className="flex-1 border rounded p-2"
                />
                <input
                  type="checkbox"
                  checked={opt.is_correct}
                  onChange={(e) => handleOptionChange(idx, "is_correct", e.target.checked)}
                />
                <span className="text-sm">Correct</span>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddOption}
              className="mt-2 px-3 py-1 bg-gray-200 rounded"
            >
              + Add Option
            </button>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block mb-1 font-medium">Question Image</label>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover mb-2 rounded border"
              />
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full" />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 text-white rounded ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
