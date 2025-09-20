
"use client";

import { useState, useEffect } from "react";
import { Search, Plus, ChevronDown, Filter, Trash2 } from "lucide-react";
import AddQuestionModal from "../../../component/AddQuestionModal";
import EditQuestionModal from "../../../component/admin-modal/EditQuestionModal";
import { useAuthStore } from "@/store/authStore";
import { toast } from "react-toastify";

export default function QuestionBank() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("All roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const { url } = useAuthStore();
  const [editingQuestion, setEditingQuestion] = useState(null);


  const handleUpdated = (updated) => {
  setQuestions((prev) =>
    prev.map((q) => (q.id === updated.id ? updated : q))
  );
};

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 4; // show 5 per page

  useEffect(() => {
    const fetchQuestions = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("https://elab-server-xg5r.onrender.com/questions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);




  // ✅ Search filter
  const filteredQuestions = questions.filter((q) =>
    q.question_text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Pagination logic
  const indexOfLast = currentPage * questionsPerPage;
  const indexOfFirst = indexOfLast - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);


  // Delete Question Bank //
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!confirm("Are you sure you want to delete this question?")) return;

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
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Search Bar */}
      <div className="w-full border-b p-4 bg-white shadow-sm">
        <div className="relative max-w-2xl mx-auto">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Type a command or search..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>


        {/* Search & Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-2">
          <div className="flex items-center mb-3">
            <Filter size={18} className="text-gray-500 mr-2" />
            <span className="text-gray-700 text-sm">Search by title, description and category</span>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search questions..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <select 
                className="w-full md:w-48 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option>All Categories</option>
                <option>Mathematics</option>
                <option>Science</option>
                <option>History</option>
                <option>English</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
            
            <div className="relative">
              <select 
                className="w-full md:w-40 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option>All roles</option>
                <option>Admin</option>
                <option>Editor</option>
                <option>Viewer</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
            
            <div className="relative">
              <select 
                className="w-full md:w-40 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Draft</option>
                <option>Archived</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>
        </div>



      {/* Main Content */}
      <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Question Bank</h1>
            <p className="text-gray-600 mt-1">Manage and set questions</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} /> Add Question
          </button>
        </div>

        {/* Question Bank Management Section */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              Question Bank Management
            </h2>
          </div>

          {/* ✅ Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <p className="text-gray-500">Loading questions...</p>
            </div>
          )}

          {/* ✅ Show Questions */}
          {!loading && currentQuestions.length > 0 && (
            <div className="divide-y">
              {currentQuestions.map((q) => (
                <div key={q.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{q.question_text}</h3>
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
                            - {opt.option_text}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {q.image_url && (
                      <img
                        src={q.image_url}
                        alt="question"
                        className="w-20 h-20 object-cover rounded border"
                      />
                    )}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setEditingQuestion(q)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(q.id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ✅ Pagination Controls */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-between items-center p-4 border-t bg-gray-50">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Modal */}
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
      </div>
    </div>
  );
}
