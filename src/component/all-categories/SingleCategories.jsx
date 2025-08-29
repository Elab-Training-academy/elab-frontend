"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Loader2, CalendarDays, RefreshCw } from "lucide-react";

export default function SingleCategoryPage() {
  const { id } = useParams(); // ✅ get category id from URL
  const url = useAuthStore((state) => state.url);

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const newToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!id) return;

    const fetchCategory = async () => {
      try {
        const response = await fetch(`${url}/categories/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCategory(data);
        } else {
          console.error("Failed to fetch category");
        }
      } catch (error) {
        console.error("Error fetching category:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id, url]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-gray-500" size={32} />
        <span className="ml-2 text-gray-600">Loading category...</span>
      </div>
    );

  if (!category)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">🚫 Category not found</p>
      </div>
    );

  return (
    <div className="flex-1 p-8">
      {/* Card Wrapper */}
      <div className="max-w-3xl mx-auto rounded-2xl shadow-md border border-gray-200 bg-white p-6 space-y-6">
        {/* Category Title */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
          <p className="text-gray-600 mt-2">{category.description}</p>
        </div>

        {/* Meta Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <CalendarDays className="w-4 h-4 text-gray-400" />
            <span>
              <strong>Created:</strong>{" "}
              {new Date(category.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4 text-gray-400" />
            <span>
              <strong>Updated:</strong>{" "}
              {new Date(category.updated_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Extra Section */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-sm text-gray-600">
            📌 You can add related posts, items, or actions for this category
            here.
          </p>
        </div>
      </div>
    </div>
  );
}
