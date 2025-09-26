"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";


// ✅ Load react-quill-new dynamically (avoids SSR issues in Next.js)
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function CreateModuleModal({ isOpen, onClose, courseId, onModuleCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    order_number: "",
    duration: "",
    pass_mark: "",
    material: null,
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
  setFormData({ ...formData, material: e.target.files[0] });
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const token = localStorage.getItem("token");
    const data = new FormData();
    data.append("course_id", courseId);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("order_number", Number(formData.order_number));
    data.append("duration", Number(formData.duration));
    data.append("pass_mark", Number(formData.pass_mark));
    if (formData.material) {
      data.append("material", formData.material);
    }

    const res = await fetch("https://elab-server-xg5r.onrender.com/modules/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    if (res.ok) {
      const newModule = await res.json();
      onModuleCreated(newModule);
      setFormData({ title: "", order_number: "", duration: "", pass_mark: "", description: "", material: null });
      toast.success("Module Create Successfully");
      onClose();
    } else {
      console.error("Failed to create module:", res.status);
    }
  } catch (err) {
    console.error("Error creating module:", err);
    toast.error("Failed to create module")
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
          {/* <input
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Module Description"
            className="w-full border px-3 py-2 rounded"
            required
          /> */}
          <div className="mb-2">
          <label htmlFor="">Module Study Material</label>
           <ReactQuill
            theme="snow"
            value={formData.description}
            placeholder="Module Study Material"
            onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
            className="mb-3"
          />
          </div>

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
          <input 
            type="file" 
            name="material" 
            onChange={handleFileChange}
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
