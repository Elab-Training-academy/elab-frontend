"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CaseStudyDetail() {
  const { id } = useParams();
  const [caseStudy, setCaseStudy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchCaseStudy = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`https://elab-server-xg5r.onrender.com/case-studies`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const found = data.find((cs) => cs.id === id);
        setCaseStudy(found);
      } catch (err) {
        console.error("Error fetching case study:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudy();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-gray-500" size={36} />
      </div>
    );
  }

  if (!caseStudy) {
    return (
      <div className="p-6 text-center text-gray-500">
        Case study not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      {/* Back Button */}
      <Link
        href="/elab-admin/case-studies"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors mb-6"
      >
        <ArrowLeft size={18} /> <span className="font-medium">Back to Case Studies</span>
      </Link>

      <div className="bg-white shadow-md rounded-xl p-6 sm:p-8">
        {/* Title & Description */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          {caseStudy.title}
        </h1>
        <p className="text-gray-600 mb-6">{caseStudy.description}</p>

        {/* Patient Info */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Patient Info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard label="Patient Name" value={caseStudy.patient_name} />
            <InfoCard label="Age" value={caseStudy.patient_age} />
            <InfoCard label="Chief Complaint" value={caseStudy.chief_complaint} />
            <InfoCard label="Difficulty" value={caseStudy.difficulty} />
          </div>
        </div>

        {/* Vitals */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Patient Vitals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoCard label="Blood Pressure" value={caseStudy.blood_pressure} />
            <InfoCard label="Heart Rate" value={caseStudy.heart_rate} />
            <InfoCard label="Respiratory Rate" value={caseStudy.respiratory_rate} />
            <InfoCard label="Oxygen Rate" value={caseStudy.oxygen_rate} />
            <InfoCard label="Temperature" value={caseStudy.temperature} />
          </div>
        </div>

        {/* Question & Options */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Question</h2>
          <p className="mb-4 text-gray-700">{caseStudy.questions}</p>
          <ul className="space-y-3">
            {caseStudy.cs_answer_options.map((opt, idx) => (
              <li
                key={idx}
                className={`p-3 rounded-lg border transition ${
                  opt.is_correct
                    ? "border-green-500 bg-green-50 text-green-800 font-medium"
                    : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                {opt.options}
              </li>
            ))}
          </ul>
        </div>

        {/* Reason */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Reason</h2>
          <p className="text-gray-700">{caseStudy.reason}</p>
        </div>

        {/* Points */}
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-800">Points:</span>
          <span className="text-blue-600 font-bold text-lg">{caseStudy.points}</span>
        </div>
      </div>
    </div>
  );
}

/* Small reusable component */
function InfoCard({ label, value }) {
  return (
    <div className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value || "N/A"}</p>
    </div>
  );
}
