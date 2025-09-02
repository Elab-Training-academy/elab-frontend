"use client";

export default function EnrollModal({ isOpen, onClose, course, onConfirm }) {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        {/* Modal Header */}
        <h2 className="text-lg font-bold mb-4">Confirm Enrollment</h2>

        {/* Show Course Details */}
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Course:</span> {course.title}
        </p>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Course ID:</span> {course.id}
        </p>
        {course.description && (
          <p className="text-gray-600 mb-6">{course.description}</p>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm(course); // 👈 Send course back (includes ID)
              onClose();
            }}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Confirm Enroll
          </button>
        </div>
      </div>
    </div>
  );
}
