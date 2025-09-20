"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  BookOpen,
  BarChart3,
  CheckCircle,
  Trash2,
  Pencil,
} from "lucide-react";
import AddCaseStudyModal from "../../../component/AddCaseStudyModal";
import UpdateCaseStudyModal from "../../../component/admin-modal/UpdateCaseStudyModal";
import DeleteConfirmModal from "../../../component/admin-modal/DeleteConfirmModal";
import Link from "next/link";
import { toast } from "react-toastify";

export default function CaseStudies() {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All Difficulty");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState(null);

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

    // ✅ Add callback
    
    fetchCaseStudies();
  }, []);
  
  const handleCreated = (newCaseStudy) => {
    setCaseStudies((prev) => [newCaseStudy, ...prev]); // update instantly
  };



  // Delete case study
 const handleDelete = async () => {
    if (!caseToDelete) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(`https://elab-server-xg5r.onrender.com/case-studies/${caseToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setCaseStudies((prev) => prev.filter((cs) => cs.id !== caseToDelete.id));
      setIsDeleteModalOpen(false);
      setCaseToDelete(null);
      toast.success("Case study deleted successfully");
    } catch (err) {
      console.error("Error deleting case study:", err);
      toast.error("Failed to delete case study");
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
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Case Studies</h1>
            <p className="text-gray-600 text-sm">Manage and add new Case Studies</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            <Plus size={16} /> Add New
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard icon={<BookOpen />} label="Total Cases" value={stats.totalCases} />
          <StatCard icon={<BarChart3 />} label="Categories" value={stats.categories} />
          <StatCard icon={<CheckCircle />} label="Completion Rate" value={stats.completionRate} />
        </div>

        {/* Search + Filters */}
        <div className="bg-white shadow rounded-lg p-4 mb-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex items-center w-full sm:w-auto bg-gray-100 px-3 py-2 rounded-lg">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search case studies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none px-2 text-sm w-full"
            />
          </div>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option>All Difficulty</option>
            <option>Easy</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        {/* Case Studies List */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading case studies...</div>
          ) : filteredCaseStudies.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No case studies found</div>
          ) : (
            <ul className="divide-y">
              {filteredCaseStudies.map((cs) => (
                <li
                  key={cs.id}
                  className="p-4 sm:p-5 hover:bg-gray-50 transition flex flex-col gap-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{cs.title}</h3>
                      <p className="text-gray-600 text-sm">{cs.description}</p>
                    </div>
                    <span className="self-start sm:self-auto text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
                      {cs.difficulty}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-sm text-gray-500">
                    <span>Patient: {cs.patient_name}</span>
                    <div className="flex gap-3 mt-2 sm:mt-0">
                      <Link
                        href={`/elab-admin/case-studies/${cs.id}`}
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        View →
                      </Link>
                      <button
                        onClick={() => {
                          setSelectedCaseStudy(cs);
                          setIsUpdateModalOpen(true);
                        }}
                        className="text-green-600 hover:underline flex items-center gap-1"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        onClick={() => {
                          setCaseToDelete(cs);
                          setIsDeleteModalOpen(true);
                        }}
                        className="text-red-600 hover:underline flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Add Modal */}
        <AddCaseStudyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreated={handleCreated}
        />

        {/* Update Modal */}
        <UpdateCaseStudyModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          caseStudy={selectedCaseStudy}
          onUpdated={handleUpdated}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          caseStudy={caseToDelete}
        />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white shadow rounded-lg p-4 flex items-center gap-3">
      <div className="text-blue-600">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}
