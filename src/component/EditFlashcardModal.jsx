// component/EditFlashcardModal.jsx
"use client";

import { useState, useEffect } from "react";
import { X, FileText, Loader } from 'lucide-react';
import dynamic from "next/dynamic";


// ✅ Load react-quill-new dynamically (avoids SSR issues in Next.js)
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function EditFlashcardModal({ 
  isOpen, 
  onClose, 
  onUpdate, 
  isLoading, 
  flashcard 
}) {
  const [formData, setFormData] = useState({
    question: "",
    answer: ""
  });
  const [error, setError] = useState("");

  // Initialize form data when flashcard changes
  useEffect(() => {
    if (flashcard) {
      setFormData({
        question: flashcard.question || "",
        answer: flashcard.answer || ""
      });
    }
  }, [flashcard]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.question.trim() || !formData.answer.trim()) {
      setError("Both question and answer are required");
      return;
    }

    setError("");
    await onUpdate(formData);
  };

  if (!isOpen || !flashcard) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Edit Flashcard</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question
            </label>

            <ReactQuill
              theme="snow"
              value={formData.question}
              onChange={(value) => setFormData(prev => ({ ...prev, question: value }))}
              className="mb-3"
            />
            {/* <textarea
              name="question"
              value={formData.question}
              onChange={handleInputChange}
              rows={3}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Enter the question"
            /> */}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Answer
            </label>
            <textarea
              name="answer"
              value={formData.answer}
              onChange={handleInputChange}
              rows={3}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Enter the answer"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <span>Category: {flashcard.category}</span>
            <span>ID: {flashcard.id}</span>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Flashcard"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}