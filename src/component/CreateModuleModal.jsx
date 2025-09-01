"use client";

import { useState } from "react";

export default function CreateModuleModal({ isOpen, onClose, courseId, onModuleCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    order_number: "",
    duration: "",
    pass_mark: "",
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://elab-server-xg5r.onrender.com/modules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          course_id: courseId,
          ...formData,
          order_number: Number(formData.order_number),
          duration: Number(formData.duration),
          pass_mark: Number(formData.pass_mark),
        }),
      });

      if (res.ok) {
        const newModule = await res.json();
        onModuleCreated(newModule);
        setFormData({ title: "", order_number: "", duration: "", pass_mark: "" });
        onClose();
      } else {
        console.error("Failed to create module:", res.status);
      }
    } catch (err) {
      console.error("Error creating module:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create Module</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Module Title"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="order_number"
            type="number"
            value={formData.order_number}
            onChange={handleChange}
            placeholder="Order Number"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="duration"
            type="number"
            value={formData.duration}
            onChange={handleChange}
            placeholder="Duration (hrs)"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="pass_mark"
            type="number"
            value={formData.pass_mark}
            onChange={handleChange}
            placeholder="Pass Mark"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
