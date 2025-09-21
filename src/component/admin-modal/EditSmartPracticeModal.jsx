"use client";

import { useState, useEffect } from "react";

export default function EditSmartPracticeModal({ isOpen, onClose, practice, onSave }) {
  const [question, setQuestion] = useState("");
  const [questionType, setQuestionType] = useState("single_choice");
  const [points, setPoints] = useState(1);
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("draft");
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (practice) {
      setQuestion(practice.question || "");
      setQuestionType(practice.question_type || "single_choice");
      setPoints(practice.points || 1);
      setReason(practice.reason || "");
      setStatus(practice.status || "draft");
      setAnswers(practice.answers || []);
    }
  }, [practice]);

  if (!isOpen) return null;

  // ✅ Handle answer change
  const handleAnswerChange = (index, field, value) => {
    const updated = [...answers];
    updated[index][field] = value;
    setAnswers(updated);
  };

  // ✅ Add new answer option
  const addAnswer = () => {
    setAnswers([...answers, { answer: "", is_correct: false }]);
  };

  // ✅ Remove answer option
  const removeAnswer = (index) => {
    setAnswers(answers.filter((_, i) => i !== index));
  };

  // ✅ Save updates
  const handleSave = async () => {
    const updates = {
      question,
      question_type: questionType,
      points,
      reason,
      status,
      answers,
    };

    await onSave(practice.id, updates);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">Edit Smart Practice</h2>

            {/* Question */}
            <label className="block mb-2 text-sm font-medium">Question</label>
            <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full border rounded-lg p-2 mb-4"
            />

            {/* Question Type */}
            <label className="block mb-2 text-sm font-medium">Question Type</label>
            <select
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
            className="w-full border rounded-lg p-2 mb-4"
            >
            <option value="single_choice">Single Choice</option>
            <option value="multiple_choice">Multiple Choice</option>
            <option value="fill_gap">Fill Gap</option>
            </select>

            {/* Points */}
            <label className="block mb-2 text-sm font-medium">Points</label>
            <input
            type="number"
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            className="w-full border rounded-lg p-2 mb-4"
            />

            {/* Reason */}
            <label className="block mb-2 text-sm font-medium">Reason</label>
            <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border rounded-lg p-2 mb-4"
            />

            {/* Status */}
            <label className="block mb-2 text-sm font-medium">Status</label>
            <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded-lg p-2 mb-4"
            >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            </select>

            {/* Answers */}
            <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Answers</label>
            {answers.map((ans, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                <input
                    type="text"
                    value={ans.answer}
                    onChange={(e) => handleAnswerChange(index, "answer", e.target.value)}
                    placeholder={`Answer ${index + 1}`}
                    className="flex-1 border rounded-lg p-2"
                />
                <input
                    type="checkbox"
                    checked={ans.is_correct}
                    onChange={(e) => handleAnswerChange(index, "is_correct", e.target.checked)}
                />
                <button
                    onClick={() => removeAnswer(index)}
                    className="px-2 py-1 bg-red-500 text-white rounded-lg"
                >
                    ✕
                </button>
                </div>
            ))}
            <button
                onClick={addAnswer}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg"
            >
                + Add Answer
            </button>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 sticky bottom-0 bg-white py-3">
            <button
                onClick={onClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
                Cancel
            </button>
            <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                Save Changes
            </button>
            </div>
        </div>
    </div>

  );
}
