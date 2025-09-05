"use client";

import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";
import AddSmartPracticeModal from "../../../component/AddPracticeModal";
import { FaRegTrashCan } from "react-icons/fa6";

export default function SmartPracticePage() {
  const url = useAuthStore((state) => state.url);
  const token = useAuthStore((state) => state.token);

  const [smartPractices, setSmartPractices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    useAuthStore.getState().loadToken();
  }, []);

  if (!mounted) return null;

 
useEffect(() => {
  useAuthStore.getState().loadToken(); // load from localStorage on client only
}, []);

  // Fetch all smart practice questions
  const fetchAllSmartPractice = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch(`${url}/sp-questions/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  // Refetch when token is ready
  useEffect(() => {
    if (token) fetchAllSmartPractice();
  }, [token]);

  // Update Smart Practice
  const updateSmartPractice = async (id, updates) => {
    if (!token) return;
    try {
      const res = await fetch(`${url}/sp-questions/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        const updated = await res.json();
        setSmartPractices((prev) =>
          prev.map((q) => (q.id === id ? updated : q))
        );
      }
    } catch (err) {
      console.error("Error updating:", err);
    }
  };

  // Delete Smart Practice
  const deleteSmartPractice = async (id) => {
    if (!token) return;
    try {
      const res = await fetch(`${url}/sp-questions/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setSmartPractices((prev) => prev.filter((q) => q.id !== id));
      }
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Smart Practice</h1>
          <p className="text-gray-600">Manage and set Smart Practice questions</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
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

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <h2 className="text-lg font-semibold p-4 border-b">
          All Smart Practice Questions
        </h2>

        {loading ? (
          <p className="p-4 text-gray-500">Loading...</p>
        ) : smartPractices.length === 0 ? (
          <p className="p-4 text-gray-500">No smart practice questions found.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-sm font-medium text-gray-600">Questions</th>
                <th className="p-3 text-sm font-medium text-gray-600">Course</th>
                <th className="p-3 text-sm font-medium text-gray-600">Category</th>
                <th className="p-3 text-sm font-medium text-gray-600">Status</th>
                <th className="p-3 text-sm font-medium text-gray-600">Question Type</th>
                <th className="p-3 text-sm font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {smartPractices.map((q) => (
                <tr key={q.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-sm font-bold text-gray-800 max-w-xs truncate">
                    {q.question}
                  </td>
                  <td className="p-3 text-sm font-bold text-gray-600">
                    {q.course || "—"}
                  </td>
                  <td className="p-3 font-bold text-sm text-gray-600">
                    {q.category || "—"}
                  </td>
                  <td className="p-3 text-sm">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        q.status === "published"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {q.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm font-bold text-gray-600">
                    {q.type || "Multiple Choice"}
                  </td>
                  <td className="p-3 text-sm flex items-center gap-2">
                    <select
                      onChange={(e) =>
                        updateSmartPractice(q.id, { status: e.target.value })
                      }
                      className="text-sm border rounded px-2 py-1"
                      defaultValue=""
                    >
                      <option value="">Actions</option>
                      <option value="published">Publish</option>
                      <option value="draft">Move to draft</option>
                    </select>
                    <button
                      onClick={() => deleteSmartPractice(q.id)}
                      className="p-2 text-red-500 hover:bg-red-100 rounded"
                    >
                      <FaRegTrashCan />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      <AddSmartPracticeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
