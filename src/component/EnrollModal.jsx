"use client";

import { useAuthStore } from "../store/authStore";

export default function EnrollModal({ isOpen, onClose, course }) {
  const createOrder = useAuthStore((state) => state.createOrder);

  if (!isOpen || !course) return null;

  const handleEnroll = async () => {
    try {
      const success = await createOrder(course.id);
      if (success) {
        alert(`Enrolled in ${course.title} successfully!`);
        onClose();
      } else {
        alert("Failed to enroll. Please try again.");
      }
    } catch (err) {
      alert("Error occurred during enrollment.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Enroll in {course.title}</h2>
        <p className="mb-4 text-gray-600">{course.description}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleEnroll}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Confirm Enroll
          </button>
        </div>
      </div>
    </div>
  );
}
