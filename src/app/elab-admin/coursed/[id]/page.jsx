"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import EditCourseModal from "../../../../component/EditCourseModal";
import CreateModuleModal from "../../../../component/CreateModuleModal";
import EditModuleModal from "../../../../component/EditModuleModal";

import {
  Loader2,
  Clock,
  DollarSign,
  CheckCircle,
  BookOpen,
  Pencil,
  Plus,
} from "lucide-react";

export default function SingleCoursePage() {
  const { id } = useParams();
  const url = useAuthStore((state) => state.url);

  const [course, setCourse] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [modules, setModules] = useState([]);

  const [editModuleOpen, setEditModuleOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  const newToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!id) return;

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

    const fetchData = async () => {
      try {
        // fetch single course
        const courseRes = await fetch(`${url}/courses/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newToken}`,
          },
        });

        if (!courseRes.ok) throw new Error("Failed to fetch course");
        const courseData = await courseRes.json();
        setCourse(courseData);

        // fetch all categories
        const catRes = await fetch(`${url}/categories`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newToken}`,
          },
        });
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData);
        }

        // fetch modules for this course
        const moduleRes = await fetch(`${url}/modules/course/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newToken}`,
          },
        });
        if (moduleRes.ok) {
          const moduleData = await moduleRes.json();
          console.log(moduleData);
          
          setModules(moduleData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, url, newToken]);

  // callback after module created
  const handleModuleCreated = (newModule) => {
    setModules((prev) => [...prev, newModule]);
  };

  // callback after module updated
  const handleModuleUpdated = (updatedModule) => {
    setModules((prev) =>
      prev.map((mod) => (mod.id === updatedModule.id ? updatedModule : mod))
    );
  };

  const handleEdit = async (courseId, newstatus) => {
    try {
      const res = await fetch(`${url}/courses/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newToken}`,
        },
        body: JSON.stringify({ status: newstatus }),
      });

      if (res.ok) {
        const updatedCourse = await res.json();
        setCourse((prev) => ({ ...prev, status: updatedCourse.status }));
      } else {
        console.error("Failed to edit course:", res.status);
      }
    } catch (error) {
      console.error("Error editing course:", error);
    }
  };

  // resolve category name
  const getCategoryName = (categoryId) => {
    const found = categories.find((c) => c.id === categoryId);
    return found ? found.name : "Unknown Category";
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-gray-500" size={32} />
        <span className="ml-2 text-gray-600">Loading course...</span>
      </div>
    );

  if (!course)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">🚫 Course not found</p>
      </div>
    );

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 px-6 shadow-md">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold">{course.title}</h1>
          <p className="mt-3 text-lg text-gray-100">{course.description}</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto p-6 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-8">
      
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl shadow-sm">
              <BookOpen className="text-blue-600 mb-2" size={28} />
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-semibold">
                {getCategoryName(course.category_id)}
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl shadow-sm">
              <DollarSign className="text-green-600 mb-2" size={28} />
              <p className="text-sm text-gray-500">Price</p>
              <p className="font-semibold">${course.price}</p>
            </div>

            <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl shadow-sm">
              <CheckCircle className="text-purple-600 mb-2" size={28} />
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-semibold">{course.status}</p>
            </div>

            <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl shadow-sm">
              <Clock className="text-orange-600 mb-2" size={28} />
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-semibold">{course.duration} hrs</p>
            </div>
          </div>

          {/* Extra Section */}
          <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              📌 Additional Information
            </h3>
            <p className="text-sm text-gray-600">
              You can add related resources, materials, or announcements for
              this course here to give learners more context.
            </p>
          </div>

          {/* Edit Course Button */}
          <div>
            <button
              onClick={() => {
                setEditCourse(course);
                setEditModalOpen(true);
              }}
              className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
            >
              <Pencil size={14} /> Edit
            </button>
          </div>

          {/* Add Module Button */}
          <div
            className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
            onClick={() => setShowModuleModal(true)}
          >
            <Plus size={24} className="text-gray-400 mb-2" />
            <p className="text-gray-600">Add New Module</p>
          </div>

          {/* 📌 Modules List */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Modules</h3>
            {modules.length === 0 ? (
              <p className="text-gray-500 text-sm">No modules yet.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {modules.map((m) => (
                  <div
                    key={m.id}
                    className="bg-white border rounded-xl shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition"
                  >
                    {/* Header */}
                    <div>
                      <a
                        href={`/elab-admin/coursed/modules/${m.id}`}
                        className="block text-lg font-semibold text-blue-600 hover:underline"
                      >
                        {m.order_number}. {m.title}
                      </a>
                      <p className="text-sm text-gray-500 mt-1">
                        📚 {m.questions} Questions
                      </p>
                    </div>

                    {/* Footer (actions) */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600">
                      <div className="flex flex-col">
                        <span>⏳ {m.duration ? `${m.duration} hrs` : "—"}</span>
                        <span>🎯 Pass Mark: {m.pass_mark ?? "N/A"}</span>
                      </div>

                      <div className="flex gap-2">
                        {/* Edit button */}
                        <button
                          onClick={() => {
                            setSelectedModule(m);
                            setEditModuleOpen(true);
                          }}
                          className="px-3 py-1 text-xs border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50"
                        >
                          Edit
                        </button>

                        {/* Delete button */}
                        <button
                          onClick={async () => {
                            if (
                              !confirm(
                                "Are you sure you want to delete this module?"
                              )
                            )
                              return;

                            try {
                              const res = await fetch(`${url}/modules/${m.id}`, {
                                method: "DELETE",
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `Bearer ${newToken}`,
                                },
                              });

                              if (res.ok) {
                                setModules((prev) =>
                                  prev.filter((mod) => mod.id !== m.id)
                                );
                              } else {
                                console.error("Failed to delete module");
                              }
                            } catch (err) {
                              console.error("Error deleting module:", err);
                            }
                          }}
                          className="px-3 py-1 text-xs border border-red-600 text-red-600 rounded-full hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditCourseModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        course={editCourse}
        onSave={handleEdit}
      />

      <CreateModuleModal
        isOpen={showModuleModal}
        onClose={() => setShowModuleModal(false)}
        courseId={course.id}
        onModuleCreated={handleModuleCreated}
      />

      <EditModuleModal
        isOpen={editModuleOpen}
        onClose={() => setEditModuleOpen(false)}
        moduleData={selectedModule}
        onSave={handleModuleUpdated}
        token={newToken}
        url={url}
      />
    </div>
  );
}
