// "use client";

// import React, { useEffect, useState } from "react";
// import { Loader2 } from "lucide-react";
// import { useRouter } from "next/navigation";

// export default function CourseCategories() {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) return;

//         const res = await fetch(
//           "https://elab-server-xg5r.onrender.com/course-categories",
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         if (!res.ok) throw new Error("Failed to fetch categories");
//         const data = await res.json();
//         setCategories(data);
//       } catch (err) {
//         setError(err.message || "Something went wrong");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCategories();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
//         <span className="ml-2 text-gray-700 font-medium">
//           Loading categories...
//         </span>
//       </div>
//     );
//   }

//   if (error) {
//     return <p className="text-red-500 text-center mt-6">Error: {error}</p>;
//   }

//   return (
//     <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Title */}
//       <h1 className="text-3xl font-bold text-center text-gray-900 mb-10">
//         📚 Course Categories
//       </h1>

//       {categories.length === 0 ? (
//         <p className="text-gray-500 text-center">No categories available</p>
//       ) : (
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           {categories.map((cat) => (
//             <div
//               key={cat.id}
//               className="bg-white shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl border border-gray-200 p-6 flex flex-col justify-between"
//             >
//               {/* Category Title */}
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-800 mb-2">
//                   {cat.name}
//                 </h2>
//                 <p className="text-gray-600 text-sm line-clamp-3 mb-6">
//                   {cat.description || "No description provided."}
//                 </p>
//               </div>

//               {/* Action Button */}
//               <button
//                 onClick={() =>
//                   router.push(`/elab-admin/course-category/${cat.id}`)
//                 }
//                 className="w-full mt-auto px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition-colors"
//               >
//                 View Courses →
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { Plus, Filter, Trash2, FolderOpen } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import CreateCModal from "../../../component/CreateCModal";
import UpdateCModal from "../../../component/UpdateCModal";
import { useParams } from "next/navigation";

export default function CourseCategoriesPage() {
  const [showModal, setShowModal] = useState(false);
  const { id: courseId } = useParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const url = useAuthStore((state) => state.url);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);


   const handleUpdate = async (id, payload) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${url}/course-categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const updated = await res.json();
        setCategories((prev) =>
          prev.map((cat) => (cat.id === id ? updated : cat))
        );
        alert("Category updated successfully!");
      } else {
        console.error("Failed to update category:", await res.text());
        alert("Failed to update category.");
      }
    } catch (err) {
      console.error("Error updating category:", err);
    }
  };


  const handleCreate = async (payload) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${url}/course-categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload), // includes course_id, name, description
    });

    if (res.ok) {
      const newCategory = await res.json();
      setCategories((prev) => [...prev, newCategory]);
      alert("Category created successfully!");
    } else {
      console.error("Failed to create category:", await res.text());
      alert("Failed to create category.");
    }
  } catch (err) {
    console.error("Error creating category:", err);
  }
};



  // ✅ Fetch categories
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${url}/course-categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch categories");
        setCategories(await res.json());
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [url]);

  // ✅ Delete category
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`${url}/course-categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setCategories(categories.filter((cat) => cat.id !== id));
      } else {
        console.error("Failed to delete category:", res.status);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
        <p className="text-sm text-gray-500">
          Manage course categories, add new ones and view details
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
        <input
          type="text"
          placeholder="Search by category name or description"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100 w-full sm:w-auto justify-center">
          <Filter size={16} /> Filters
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading categories...</p>}

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
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="border rounded-lg p-4 shadow hover:shadow-md transition bg-white"
            >
              <Link href={`/elab-admin/course-category/${cat.id}`}>
                <h3 className="font-semibold text-lg">{cat.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {cat.description || "No description provided"}
                </p>

                <div className="mt-3 flex flex-wrap gap-2 items-center text-xs text-gray-600">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {new Date(cat.created_at).toLocaleDateString()}
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {new Date(cat.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </Link>

              {/* Action Buttons */}
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setSelectedCategory(cat);
                    setShowUpdateModal(true);
                  }}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
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
        <CreateCModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleCreate}
          courseId={courseId} // ✅ pass dynamically
        />

        <UpdateCModal
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={handleUpdate}
          category={selectedCategory}
        />

    </div> 
  );
}
