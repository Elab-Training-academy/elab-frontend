"use client";
import { useAuthStore } from "@/store/authStore";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";


const CreateCategoryModal = ({ isOpen, onClose, onSubmit }) => {
  const url = useAuthStore((state) => state.url);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("You must be logged in to create a category.");
        return;
      }

      const response = await fetch(`${url}/categories/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Category created:", data);
        toast.success("✅ Category created successfully!");
        if (onSubmit) onSubmit(data); // pass data back if needed
        onClose(); // close modal after success
      } else {
        const err = await response.json();
        console.error(
          "Failed to create category:",
          JSON.stringify(err, null, 2)
        );
        toast.error(
          `Error: ${err.detail ? JSON.stringify(err.detail) : response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Something went wrong while creating category.");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">
              Create New Category
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          {/* Modal Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Category Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter category name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Category Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Description
              </label>
              <div className="border border-gray-300 rounded-md p-2 mb-1">
                <textarea
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter category description"
                  className="w-full h-32 px-2 py-1 focus:outline-none resize-none"
                  required
                ></textarea>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow"
              >
                Create Category
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateCategoryModal;
