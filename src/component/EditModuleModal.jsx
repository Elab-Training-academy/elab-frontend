"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function EditModuleModal({ isOpen, onClose, moduleData, onSave, token, url }) {
  const [title, setTitle] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    if (moduleData) {
      setTitle(moduleData.title || "");
      setOrderNumber(moduleData.order_number || "");
    }
  }, [moduleData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${url}/modules/${moduleData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          order_number: Number(orderNumber),
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        onSave(updated);
        onClose();
      } else {
        console.error("Failed to update module");
      }
    } catch (err) {
      console.error("Error updating module:", err);
    }
  };
  


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Edit Module</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Title</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 mt-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Order Number</label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2 mt-1"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
