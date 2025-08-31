
"use client";
import { useAuthStore } from "@/store/authStore";
import { body } from "framer-motion/client";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const CreateCourseModal = ({ isOpen, onClose, onSubmit }) => {
  const url = useAuthStore((state) => state.url);
  const newToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ✅ form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [status, setStatus] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(""); // 👈 selected category ID
  // ✅ categories list
  const [categories, setCategories] = useState([]);
  
  // ✅ Fetch categories
  useEffect(() => {
    const Token = localStorage.getItem("token")
    if (!Token) return;

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${url}/categories`, {
          headers: { Authorization: `Bearer ${Token}` },
        });
        if (res.ok) {
          setCategories(await res.json());
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };

    fetchCategories();
  }, [url, newToken]);

  if (!isOpen) return null;

  // ✅ Submit handler
const handleSubmit = async (e) => {
  e.preventDefault();

  const Token = localStorage.getItem("token");

  // Build FormData (not JSON)
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("duration", duration);   // keep as string, backend parses it
  formData.append("status", status);
  formData.append("price", price);
  formData.append("category_id", category);

  console.log("Submitting payload (FormData):", Object.fromEntries(formData));

  try {
    const response = await fetch(`${url}/courses`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Token}`, 
        // ❌ DON'T set Content-Type here, browser will set correct boundary automatically
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error response:", data);
      toast.error(
        data.detail
          ? data.detail.map((err) => `${err.loc?.join(".")}: ${err.msg}`).join("\n")
          : "Failed to create course"
      );
      return;
    }

    console.log("Course created successfully:", data);
    toast.success("Course created successfully!");
    onClose();
  } catch (err) {
    console.error("Unexpected error:", err);
    toast.error("Something went wrong!");
  }
};





  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Create New Course</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium">Course Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium">Short Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full h-20 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

         

          {/* Category + Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Duration (hours)</label>
              <input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
                type="number"
                min="1"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Price + Status + Level */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium">Price (USD)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Status</option>
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow"
            >
              Create Course →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourseModal;
