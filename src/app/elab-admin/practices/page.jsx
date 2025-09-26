"use client";

import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";
import AddSmartPracticeModal from "../../../component/AddPracticeModal";
import EditSmartPracticeModal from "../../../component/admin-modal/EditSmartPracticeModal";
import DeleteConfirmModal from "../../../component/admin-modal/DeleteSPModal";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import Link from "next/link";
import { toast } from "react-toastify";


export default function SmartPracticePage() {
  const url = useAuthStore((state) => state.url);
  const token = useAuthStore((state) => state.token);

  const [smartPractices, setSmartPractices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPractice, setSelectedPractice] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      const res = await fetch(`${url}/courses/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setCourses(await res.json());
      }
    };
    if (mounted) fetchCourses();
  }, [mounted, url, token]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch(`${url}/course-categories/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setCategories(await res.json());
      }
    };
    if (mounted) fetchCategories();
  }, [mounted, url, token]);

  // Helpers
  const getCourseName = (id) =>
    courses.find((c) => c.id === id)?.title || "—";
  const getCategoryName = (id) =>
    categories.find((cat) => cat.id === id)?.name || "—";

  useEffect(() => {
    setMounted(true);
    useAuthStore.getState().loadToken();
  }, []);

  // ✅ Fetch all smart practice questions
  useEffect(() => {
    const fetchAllSmartPractice = async () => {
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
      try {
        setLoading(true);
        const res = await fetch(`${url}/sp-questions/`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setSmartPractices(data);
        } else {
          console.error("Failed to fetch:", res.status);
        }
      } catch (err) {
        console.error("Error fetching:", err);
      } finally {
        setLoading(false);
      }
    };

    if (mounted) fetchAllSmartPractice();
  }, [mounted, url]);

  // ✅ Update Smart Practice
  const updateSmartPractice = async (id, updates) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${url}/sp-questions/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        const updated = await res.json();
        toast.success("Smart Practice updated successfully")
        setSmartPractices((prev) =>
          prev.map((q) => (q.id === id ? updated : q))
        );
      }
    } catch (err) {
      console.error("Error updating:", err);
      toast.error("Error updating")
    }
  };

  // ✅ Delete Smart Practice
  const deleteSmartPractice = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${url}/sp-questions/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setSmartPractices((prev) => prev.filter((q) => q.id !== id));
        setIsDeleteModalOpen(false);
        setDeleteTarget(null);
      }
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  // ✅ Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = smartPractices.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(smartPractices.length / itemsPerPage);

  return (
    <div className="p-6">
      {!mounted ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <>
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Smart Practice</h1>
              <p className="text-gray-600">Manage and set Smart Practice questions</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + Add Smart Practice
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white shadow rounded-xl p-4 text-center">
              <h2 className="text-2xl font-bold">{smartPractices.length}</h2>
              <p className="text-gray-500 text-sm">Total Questions</p>
            </div>
            <div className="bg-white shadow rounded-xl p-4 text-center">
              <h2 className="text-2xl font-bold">03</h2>
              <p className="text-gray-500 text-sm">Average Correct Rate</p>
            </div>
          </div>

          {/* Card View */}
          {loading ? (
            <p className="p-4 text-gray-500">Loading...</p>
          ) : currentItems.length === 0 ? (
            <p className="p-4 text-gray-500">No smart practice questions found.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((q) => (
                <div
                  key={q.id}
                  className="bg-white shadow rounded-lg p-4 flex flex-col justify-between"
                >
                  <div>
                    {/* ✅ Only the title is clickable */}
                    <Link href={`/elab-admin/practices/${q.id}`}>
                      <h3 className="font-bold text-gray-800 mb-2 hover:underline cursor-pointer">
                        {q.question}
                      </h3>
                    </Link>

                    <p className="text-sm text-gray-500 mb-2">
                      Course: <span className="font-medium">{getCourseName(q.course_id)}</span>
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      Category: <span className="font-medium">{getCategoryName(q.course_category_id)}</span>
                    </p>
                    <p className="text-sm mb-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          q.status === "published"
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {q.status}
                      </span>{" "}
                      • <span className="font-medium">{q.question_type}</span>
                    </p>
                    <ul className="list-disc ml-5 text-sm text-gray-600">
                      {q.answers.map((a) => (
                        <li
                          key={a.id}
                          className={`${a.is_correct ? "text-green-600 font-semibold" : ""}`}
                        >
                          {a.answer}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* ✅ Actions are separate and won’t trigger the link */}
                  <div className="flex items-center gap-2 mt-4">
                    <select
                      onChange={(e) => updateSmartPractice(q.id, { status: e.target.value })}
                      className="text-sm border rounded px-2 py-1"
                      defaultValue=""
                    >
                      <option value="">Change status</option>
                      <option value="published">Publish</option>
                      <option value="draft">Draft</option>
                    </select>
                    <button
                      onClick={() => {
                        setSelectedPractice(q);
                        setIsEditModalOpen(true);
                      }}
                      className="p-2 text-blue-500 hover:bg-blue-100 rounded"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteTarget(q);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-2 text-red-500 hover:bg-red-100 rounded"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>

               
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-3 py-1">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}

          {/* Add Modal */}
          <AddSmartPracticeModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
          />

          {/* Delete Modal */}
          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={() => deleteSmartPractice(deleteTarget?.id)}
            itemName={deleteTarget?.question}
          />

          {/* Edit Modal */}
          {selectedPractice && (
            <EditSmartPracticeModal
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              practice={selectedPractice}
              onSave={updateSmartPractice}
            />

          )}
        </>
      )}
    </div>
  );
}
