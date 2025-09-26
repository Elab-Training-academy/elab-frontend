

"use client";
import { useEffect, useState } from "react";
import { Plus, Filter, Trash2, Pencil } from "lucide-react";
import CreateCategoryModal from "../../../component/CreateCategoryModal";
import EditCategoryModal from "../../../component/EditCategoryModal";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

export default function CategoriesPage() {
  const [showModal, setShowModal] = useState(false);
  const fetchAllCategories = useAuthStore((state) => state.fetchAllCategories);
  const newToken = useAuthStore((state) => state.token);
  const setToken = useAuthStore((state) => state.setToken);
  const categories = useAuthStore((state) => state.categories);
  const setCategories = useAuthStore((state) => state.setCategories);
  const loading = useAuthStore((state) => state.loading);
  const url = useAuthStore((state) => state.url);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
  });

  // ✅ Only access localStorage in browser
  useEffect(() => {
    if (typeof window !== "undefined") {

      // check if token is expired
    const token = localStorage.getItem("token");
    if (!token){
      window.location.href = "/login"
      return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp < currentTime) {
      alert("Session Expired, pls login to continue.");
      return window.location.href = "/login"
    }
      if (!newToken && token) {
        setToken(token);
      }
    }
  }, [newToken, setToken]);

  // Fetch categories after token is set
  useEffect(() => {
    if (newToken) {
      fetchAllCategories();
    }
  }, [newToken, fetchAllCategories]);

  const handleSubmit = (categoryData) => {
    setCategories([...categories, categoryData]);
    setShowModal(false);
    setCategoryData({ name: "", description: "" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`${url}/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${newToken}`,
        },
      });

      if (res.ok) {
        setCategories(categories.filter((cat) => cat.id !== id));
      } else {
        const errorText = await res.text();
        console.error("Failed to delete category:", res.status, errorText);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleEdit = async (id, newDescription) => {
    try {
      const res = await fetch(`${url}/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newToken}`,
        },
        body: JSON.stringify({ description: newDescription }),
      });

      if (res.ok) {
        const updatedCategory = await res.json();
        setCategories(
          categories.map((cat) =>
            cat.id === id ? { ...cat, description: updatedCategory.description } : cat
          )
        );
      } else {
        const errorText = await res.text();
        console.error("Failed to edit category:", res.status, errorText);
      }
    } catch (error) {
      console.error("Error editing category:", error);
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
        <p className="text-sm text-gray-500">
          Manage categories, create new categories and edit existing ones
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
        <input
          type="text"
          placeholder="Search by name and description"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100 w-full sm:w-auto justify-center">
          <Filter size={16} />
          Filters
        </button>
      </div>

      {/* Loading State */}
      {loading && <p className="text-gray-500">Loading categories...</p>}

      {/* Category List or Empty State */}
      {!loading && categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-gray-700 mb-2">
            Looks like you haven't added any categories yet
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow"
          >
            <Plus size={18} /> Add New Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div key={index} className="border rounded-lg p-4 shadow">
              <Link href={`/elab-admin/category/${category.id}`}>
                <h3 className="font-semibold text-lg text-blue-600 hover:underline cursor-pointer">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">{category.description}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Created: {new Date(category.created_at).toLocaleDateString()}
                  </span>
                  <span className="text-xs text-gray-500">
                    Updated: {new Date(category.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </Link>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setEditCategory(category);
                    setEditModalOpen(true);
                  }}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                >
                  <Pencil size={14} /> Edit
                </button>

                <button
                  onClick={() => handleDelete(category.id)}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}

          {/* Add New Category Card */}
          <div
            className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
            onClick={() => setShowModal(true)}
          >
            <Plus size={24} className="text-gray-400 mb-2" />
            <p className="text-gray-600">Add New Category</p>
          </div>
        </div>
      )}

      {/* Modal Component */}
      <CreateCategoryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        categoryData={categoryData}
        setCategoryData={setCategoryData}
      />

      <EditCategoryModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        category={editCategory}
        onSave={handleEdit}
      />
    </div>
  );
}
