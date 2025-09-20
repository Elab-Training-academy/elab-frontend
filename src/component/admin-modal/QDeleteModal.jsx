"use client";
import { Trash2 } from "lucide-react";

export default function QDeleteModal({ isOpen, onClose, onConfirm, question }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex items-center gap-2 mb-4">
          <Trash2 className="text-red-600" />
          <h2 className="text-lg font-semibold">Delete Question</h2>
        </div>
        <p className="text-gray-600">
          Are you sure you want to delete{" "}
          <span className="font-medium text-gray-900">
            {question?.question_text}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
