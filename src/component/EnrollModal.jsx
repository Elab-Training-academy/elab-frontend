"use client";

import { useAuthStore } from "../store/authStore";

export default function EnrollModal({ isOpen, onClose, course }) {
  const createOrder = useAuthStore((state) => state.createOrder);

  if (!isOpen || !course) return null;

  const handleEnroll = async () => {
    try {
      const order = await createOrder(course.id); // expects { checkout_url: "..." }
      if (order && order.checkout_url) {
        window.location.href = order.checkout_url;
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
        <h2 className="text-xl font-bold mb-2">{course.title}</h2>
        <p className="text-gray-600 mb-4">{course.description}</p>

        <div className="mb-4">
          <p><span className="font-semibold">Duration:</span> {course.duration}</p>
          <p><span className="font-semibold">Price:</span> ${course.price}</p>
        </div>

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
