"use client";
import { useEffect, useState, useCallback } from "react";
import { Search, Plus, Trash2, Edit, Eye, Filter, Download, Upload } from "lucide-react";
import CreateCatModal from "../../../component/CreateCatModal";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Dynamically import ReactQuillNew for Next.js
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function CatPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");

  // Modals
  const [viewModal, setViewModal] = useState({ open: false, data: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, question: "" });
  const [editModal, setEditModal] = useState({ open: false, data: null });

  const itemsPerPage = 10;

  // Check authentication
  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp < currentTime) {
        alert("Session Expired, please login to continue.");
        window.location.href = "/login";
        return false;
      }
      return true;
    } catch (err) {
      console.error("Token parsing error:", err);
      window.location.href = "/login";
      return false;
    }
  }, []);

  // Fetch questions
  const fetchQuestions = useCallback(async () => {
    if (!checkAuth()) return;

    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      
      const res = await fetch(
        "https://elab-server-xg5r.onrender.com/cat-questions?limit=100&skip=0",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }

      const data = await res.json();
      setQuestions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching CAT questions:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [checkAuth]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Filter questions based on search and filters
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.question_text?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = !filterDifficulty || question.difficulty_level?.toString() === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuestions = filteredQuestions.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDifficulty]);

  // Handlers
  const handleView = async (id) => {
    if (!checkAuth()) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `https://elab-server-xg5r.onrender.com/cat-questions/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!res.ok) throw new Error("Failed to fetch question");
      
      const data = await res.json();
      setViewModal({ open: true, data });
    } catch (err) {
      console.error("Error fetching question:", err);
      alert("Failed to load question details");
    }
  };

  const handleEdit = async (id) => {
    if (!checkAuth()) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `https://elab-server-xg5r.onrender.com/cat-questions/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (res.ok) {
        const data = await res.json();
        setEditModal({ open: true, data });
      } else {
        throw new Error("Failed to fetch question data");
      }
    } catch (err) {
      console.error("Error fetching edit data:", err);
      alert("Failed to load question for editing");
    }
  };

  const handleUpdate = async () => {
    if (!checkAuth()) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();

    // Append all fields
    Object.entries(editModal.data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === "options") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    try {
      const res = await fetch(
        `https://elab-server-xg5r.onrender.com/cat-questions/${editModal.data.id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (res.ok) {
        const updated = await res.json();
        setQuestions((prev) =>
          prev.map((q) => (q.id === updated.id ? updated : q))
        );
        setEditModal({ open: false, data: null });
        alert("Question updated successfully");
      } else {
        throw new Error("Failed to update question");
      }
    } catch (err) {
      console.error("Error updating question:", err);
      alert("Failed to update question");
    }
  };

  const handleDelete = (question) => {
    setDeleteModal({ 
      open: true, 
      id: question.id, 
      question: question.question_text?.substring(0, 50) + "..." 
    });
  };

  const confirmDelete = async () => {
    if (!checkAuth()) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `https://elab-server-xg5r.onrender.com/cat-questions/${deleteModal.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setQuestions((prev) => prev.filter((q) => q.id !== deleteModal.id));
        setDeleteModal({ open: false, id: null, question: "" });
        alert("Question deleted successfully");
      } else {
        throw new Error("Failed to delete question");
      }
    } catch (err) {
      console.error("Error deleting question:", err);
      alert("Failed to delete question");
    }
  };

  const handleQuestionCreated = () => {
    fetchQuestions(); // Refresh the list
    setIsModalOpen(false);
  };

  // Strip HTML tags for display
  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">NCLEX-RN CAT</h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Manage Computer Adaptive Testing Questions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow">
          <div>
            <p className="text-gray-500 text-sm">Total Questions</p>
            <h2 className="text-lg sm:text-xl font-bold">{questions.length}</h2>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow">
          <div>
            <p className="text-gray-500 text-sm">Filtered</p>
            <h2 className="text-lg sm:text-xl font-bold">{filteredQuestions.length}</h2>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow">
          <div>
            <p className="text-gray-500 text-sm">Current Page</p>
            <h2 className="text-lg sm:text-xl font-bold">{currentPage}</h2>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow">
          <div>
            <p className="text-gray-500 text-sm">Total Pages</p>
            <h2 className="text-lg sm:text-xl font-bold">{totalPages}</h2>
          </div>
        </div>
      </div>

      {/* Search + Filters + Create */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Difficulty</option>
              <option value="-3">-3.0</option>
              <option value="-2">-2.0</option>
              <option value="-1">-1.0</option>
              <option value="0">0.0</option>
              <option value="1">1.0</option>
              <option value="2">2.0</option>
              <option value="3">3.0</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow hover:bg-blue-700 flex-1 sm:flex-none justify-center"
          >
            <Plus className="h-4 w-4" /> Create Question
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-700 font-medium">Error loading questions</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <button
              onClick={fetchQuestions}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-500">Loading questions...</p>
          </div>
        ) : paginatedQuestions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">
              {searchTerm || filterDifficulty ? "No questions match your filters." : "No questions found."}
            </p>
            {(searchTerm || filterDifficulty) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterDifficulty("");
                }}
                className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-600">
                    Question
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-600">
                    Type
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-600">
                    Difficulty
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-600">
                    Created At
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedQuestions.map((question, index) => (
                  <tr
                    key={question.id || index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 sm:px-6 py-4 max-w-xs">
                      <div 
                        className="truncate"
                        title={stripHtml(question.question_text)}
                      >
                        {stripHtml(question.question_text)}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {question.question_type}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        question.difficulty_level >= 1 ? 'bg-red-100 text-red-800' :
                        question.difficulty_level >= 0 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {question.difficulty_level}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm">
                      {question.created_at ? new Date(question.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleView(question.id)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(question.id)}
                          className="p-2 text-green-500 hover:bg-green-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(question)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredQuestions.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t text-sm text-gray-600 gap-3">
            <span>
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredQuestions.length)} of {filteredQuestions.length} results
            </span>
            <div className="flex items-center gap-2">
              <button
                className={`px-3 py-1 border rounded-lg transition-colors ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed bg-gray-100"
                    : "text-gray-700 hover:bg-gray-50 border-gray-300"
                }`}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    className={`px-3 py-1 border rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white border-blue-600"
                        : "text-gray-700 hover:bg-gray-50 border-gray-300"
                    }`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                className={`px-3 py-1 border rounded-lg transition-colors ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed bg-gray-100"
                    : "text-gray-700 hover:bg-gray-50 border-gray-300"
                }`}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <CreateCatModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={handleQuestionCreated}
        />
      )}

      {/* View Modal */}
      {viewModal.open && viewModal.data && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Question Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <ReactQuill
                          value={viewModal.data.question_text || ""}
                          onChange={(content) => setViewModal(prev => ({ ...prev, data: { ...prev.data, question_text: content } }))}
                          theme="snow"
                        />   
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <p className="p-2 bg-gray-50 rounded border">{viewModal.data.question_type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                    <p className="p-2 bg-gray-50 rounded border">{viewModal.data.difficulty_level}</p>
                  </div>
                </div>

                {viewModal.data.explanation && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Explanation</label>
                    <p className="p-3 bg-gray-50 rounded-lg border">{viewModal.data.explanation}</p>
                  </div>
                )}

                {viewModal.data.options && viewModal.data.options.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                    <div className="space-y-2">
                      {viewModal.data.options.map((option, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border ${
                            option.is_correct
                              ? "bg-green-50 border-green-200"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{option.option_text}</span>
                            {option.is_correct && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Correct
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                <button
                  onClick={() => setViewModal({ open: false, data: null })}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal.open && editModal.data && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Edit Question</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                  <ReactQuill
                    value={editModal.data.question_text}
                    onChange={(value) =>
                      setEditModal({
                        ...editModal,
                        data: { ...editModal.data, question_text: value },
                      })
                    }
                    theme="snow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Explanation</label>
                  <textarea
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={editModal.data.explanation || ""}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        data: { ...editModal.data, explanation: e.target.value },
                      })
                    }
                    rows={4}
                    placeholder="Add explanation..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                    <input
                      type="number"
                      step="0.1"
                      min="-3"
                      max="3"
                      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editModal.data.difficulty_level}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          data: { ...editModal.data, difficulty_level: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                    <input
                      type="number"
                      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editModal.data.points || ""}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          data: { ...editModal.data, points: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                <button
                  onClick={() => setEditModal({ open: false, data: null })}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">Confirm Delete</h2>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this question?
              </p>
              {deleteModal.question && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                  <p className="text-sm text-red-700 font-medium">Question:</p>
                  <p className="text-sm text-red-600 truncate">{deleteModal.question}</p>
                </div>
              )}
              <p className="text-sm text-red-600 mb-4">
                This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteModal({ open: false, id: null, question: "" })}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}