"use client";

import { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import AddQuestionModal from "../../../component/AddQuestionModal";
import EditQuestionModal from "../../../component/admin-modal/EditQuestionModal";
import QDeleteModal from "../../../component/admin-modal/QDeleteModal"; // ✅ Correct import
import { useAuthStore } from "@/store/authStore";
import { toast } from "react-toastify";
import Link from "next/link";

export default function QuestionBank() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { url } = useAuthStore();
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); 


  // ✅ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;

  const handleUpdated = (updated) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === updated.id ? updated : q))
    );
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login"
        return;
      };
      try {
        const res = await fetch(`${url}/questions`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok){
          const err = await res.json();
          if(err.detail === "Invalid access token or token expired"){
            alert("Session Expired, pls login to continue.");
            return window.location.href = "/login"
          }else{
            alert(err.detail)
          }
        }
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [url]);

  // ✅ Search filter
  const filteredQuestions = questions?.filter((q) =>
    q.question_text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Pagination logic
  const indexOfLast = currentPage * questionsPerPage;
  const indexOfFirst = indexOfLast - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);

  // ✅ Delete Question
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${url}/questions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete");

      setQuestions((prev) => prev.filter((q) => q.id !== id));
      toast.success("Question deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error deleting question");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Search & Actions */}
      <div className="bg-white p-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-3 max-w-5xl mx-auto">
          <div className="relative flex-1 w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search questions..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            <Plus size={18} /> Add Question
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Question Bank</h1>
          <p className="text-gray-600 mt-1">Manage and set questions</p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading && (
            <div className="flex items-center justify-center py-16">
              <p className="text-gray-500">Loading questions...</p>
            </div>
          )}

          {!loading && currentQuestions.length > 0 && (
            <div className="divide-y">
              {currentQuestions.map((q) => (
                <div
                  key={q.id}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition"
                >
                  <div className="flex-1">
                    <Link href={`/elab-admin/questions/${q.id}`}>
                      <h3 className="font-medium text-gray-900 hover:text-blue-600">
                        {q.question_text}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500">
                      Type: {q.answer_type} • Points: {q.points}
                    </p>
                    <ul className="mt-2 space-y-1">
                      {q.answer_options.map((opt) => (
                        <li
                          key={opt.id}
                          className={`text-sm ${
                            opt.is_correct
                              ? "text-green-600 font-medium"
                              : "text-gray-600"
                          }`}
                        >
                          • {opt.option_text}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {q.image_url && (
                    <img
                      src={q.image_url}
                      alt="question"
                      className="w-24 h-24 object-cover rounded border"
                    />
                  )}

                  <div className="flex md:flex-col gap-2">
                    <button
                      onClick={() => setEditingQuestion(q)}
                      className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(q)}
                      className="px-3 py-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && currentQuestions.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No questions found.
            </div>
          )}

          {!loading && totalPages > 1 && (
            <div className="flex justify-between items-center p-4 border-t bg-gray-50 text-sm">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddQuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <EditQuestionModal
        isOpen={!!editingQuestion}
        onClose={() => setEditingQuestion(null)}
        question={editingQuestion}
        onUpdated={handleUpdated}
      />

      <QDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget?.id)}
        question={deleteTarget}
      />
    </div>
  );
}
