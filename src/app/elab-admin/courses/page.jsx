
"use client";
import { useEffect, useState } from "react";
import { Plus, Filter, Trash2, Pencil } from "lucide-react";
import CreateCourseModal from "../../../component/CreateCourseModal";
import EditCourseModal from "../../../component/EditCourseModal"; // ✅ import fixed modal
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

export default function CoursesPage() {
  const [showModal, setShowModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCourse, setEditCourse] = useState(null);

  const fetchAllCourses = useAuthStore((state) => state.fetchAllCourses);
  const newToken = useAuthStore((state) => state.token);
  const setToken = useAuthStore((state) => state.setToken);
  const courses = useAuthStore((state) => state.courses);
  const setCourses = useAuthStore((state) => state.setCourses);
  const loading = useAuthStore((state) => state.loading);
  const url = useAuthStore((state) => state.url);

  const [categories, setCategories] = useState([]);
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "",
    duration: "",
    status: "",
    price: "",
  });

  // ✅ Ensure token
  useEffect(() => {
    if (!newToken && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  }, [newToken, setToken]);

  // ✅ Fetch courses
  useEffect(() => {
    fetchAllCourses();
  }, [fetchAllCourses]);

  // ✅ Fetch categories
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${url}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          setCategories(await res.json());
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };

    fetchCategories();
  }, [url]);

  // ✅ Add or update course locally
  const handleSubmit = (newCourse) => {
    if (editCourse) {
      setCourses(
        courses.map((c) => (c.id === editCourse.id ? { ...c, ...newCourse } : c))
      );
      setEditCourse(null);
      setEditModalOpen(false);
    } else {
      setCourses([...courses, newCourse]);
      setShowModal(false);
    }

    setCourseData({
      title: "",
      description: "",
      category: "",
      duration: "",
      status: "",
      price: "",
    });
  };

  // ✅ Get category name
  const getCategoryName = (id) => {
    const found = categories.find((cat) => cat.id === id);
    return found ? found.name : "Unknown Category";
  };

  // ✅ Delete course
  const handleDelete = async (id) => {
    const getToken = localStorage.getItem("token");
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const res = await fetch(`${url}/courses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken}`,
        },
      });

      if (res.ok) {
        setCourses(courses.filter((course) => course.id !== id));
      } else {
        console.error("Failed to delete course:", res.status);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  // ✅ Edit course status
  const handleEdit = async (id, newstatus) => {
    const getToken = localStorage.getItem("token");
    try {
      const res = await fetch(`${url}/courses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken}`,
        },
        body: JSON.stringify({ status: newstatus }),
      });

      if (res.ok) {
        const updatedCourse = await res.json();
        setCourses(
          courses.map((c) =>
            c.id === id ? { ...c, status: updatedCourse.status } : c
          )
        );
      } else {
        console.error("Failed to edit course:", res.status);
      }
    } catch (error) {
      console.error("Error editing course:", error);
    }
  };

  return (
    <div className="flex-1 p-6">
      {/* header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
        <p className="text-sm text-gray-500">
          Manage courses, upload new content and edit existing courses
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
        <input
          type="text"
          placeholder="Search by title, description and category"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100 w-full sm:w-auto justify-center">
          <Filter size={16} /> Filters
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading courses...</p>}

      {!loading && courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-gray-700 mb-2">
            Looks like you haven't added any courses yet
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow"
          >
            <Plus size={18} /> Add New Course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="border rounded-lg p-4 shadow hover:shadow-md transition"
            >
              <Link href={`/elab-admin/coursed/${course.id}`}>
                <h3 className="font-semibold text-lg">{course.title}</h3>
                <p className="text-sm text-gray-500">{course.description}</p>

                <div className="mt-2 flex flex-wrap gap-2 items-center text-sm">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {getCategoryName(course.category_id)}
                  </span>
                  <span className="font-medium">${course.price}</span>
                  <span className="font-medium">{course.status}</span>
                  <span className="font-medium">{course.duration} hrs</span>
                </div>
              </Link>

              {/* Action Buttons */}
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setEditCourse(course);
                    setEditModalOpen(true);
                  }}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}

          {/* Add New Course Card */}
          <div
            className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
            onClick={() => setShowModal(true)}
          >
            <Plus size={24} className="text-gray-400 mb-2" />
            <p className="text-gray-600">Add New Course</p>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <CreateCourseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        courseData={courseData}
        setCourseData={setCourseData}
      />

      {/* ✅ Edit Modal */}
      <EditCourseModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        course={editCourse}
        onSave={handleEdit}
      />
    </div>
  );
}
