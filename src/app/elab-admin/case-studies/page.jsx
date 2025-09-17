"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  BookOpen,
  BarChart3,
  CheckCircle,
  Trash2,
  Pencil,
} from "lucide-react";
import AddCaseStudyModal from "../../../component/AddCaseStudyModal";
import UpdateCaseStudyModal from "../../../component/admin-modal/UpdateCaseStudyModal";
import Link from "next/link";

export default function CaseStudies() {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All Difficulty");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stats
  const [stats, setStats] = useState({
    totalCases: 0,
    categories: 0,
    completionRate: "0%",
  });

  // Fetch Case Studies
  useEffect(() => {
    const fetchCaseStudies = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("https://elab-server-xg5r.onrender.com/case-studies", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCaseStudies(data);

        setStats({
          totalCases: data.length,
          categories: new Set(data.map((cs) => cs.course_category_id)).size,
          completionRate: "0%",
        });
      } catch (err) {
        console.error("Error fetching case studies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudies();
  }, []);

  // Delete case study
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!confirm("Are you sure you want to delete this case study?")) return;

    try {
      await fetch(`https://elab-server-xg5r.onrender.com/case-studies/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setCaseStudies(caseStudies.filter((cs) => cs.id !== id));
    } catch (err) {
      console.error("Error deleting case study:", err);
      alert("Failed to delete case study");
    }
  };

  // Update handler after modal
  const handleUpdated = (updated) => {
    setCaseStudies(
      caseStudies.map((cs) => (cs.id === updated.id ? updated : cs))
    );
  };

  // Filter case studies
  const filteredCaseStudies = caseStudies.filter((cs) => {
    const matchesSearch =
      cs.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cs.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDifficulty =
      difficultyFilter === "All Difficulty" ||
      cs.difficulty.toLowerCase() === difficultyFilter.toLowerCase();

    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Case Studies</h1>
          <p className="text-gray-600 text-sm md:text-base mt-1">
            Manage and add new Case Studies
          </p>
        </div>

        {/* Stats Cards */}
        {/* ... keep same stats code ... */}

        {/* Case Studies List */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Case Studies</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
            >
              <Plus size={16} /> Add New
            </button>
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading case studies...</div>
          ) : filteredCaseStudies.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No case studies found</div>
          ) : (
            <ul className="divide-y">
              {filteredCaseStudies.map((cs) => (
                <li key={cs.id} className="p-4 hover:bg-gray-50 transition">
                  <h3 className="font-semibold text-gray-900">{cs.title}</h3>
                  <p className="text-gray-600 text-sm">{cs.description}</p>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
                      {cs.difficulty}
                    </span>
                    <span className="text-xs text-gray-400">Patient: {cs.patient_name}</span>
                  </div>

                  <div className="mt-3 flex gap-3">
                    <Link
                      href={`/elab-admin/case-studies/${cs.id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View →
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedCaseStudy(cs);
                        setIsUpdateModalOpen(true);
                      }}
                      className="text-green-600 hover:underline text-sm flex items-center gap-1"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cs.id)}
                      className="text-red-600 hover:underline text-sm flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Add Modal */}
        <AddCaseStudyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

        {/* Update Modal */}
        <UpdateCaseStudyModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          caseStudy={selectedCaseStudy}
          onUpdated={handleUpdated}
        />
      </div>
    </div>
  );
}
