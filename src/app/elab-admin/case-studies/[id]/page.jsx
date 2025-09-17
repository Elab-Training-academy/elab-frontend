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
        if(!token) return;
        
      try {
        const res = await fetch(`https://elab-server-xg5r.onrender.com/case-studies`, {
            headers: { Authorization: `Bearer ${token}` }
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
        <Loader2 className="animate-spin text-gray-500" size={32} />
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
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Back Button */}
      <Link
        href="/elab-admin/case-studies"
        className="flex items-center gap-2 text-blue-600 mb-6"
      >
        <ArrowLeft size={18} /> Back to Case Studies
      </Link>

      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {caseStudy.title}
        </h1>
        <p className="text-gray-600 mb-4">{caseStudy.description}</p>

        {/* Patient Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="font-medium">Patient Name:</p>
            <p className="text-gray-700">{caseStudy.patient_name}</p>
          </div>
          <div>
            <p className="font-medium">Age:</p>
            <p className="text-gray-700">{caseStudy.patient_age}</p>
          </div>
          <div>
            <p className="font-medium">Chief Complaint:</p>
            <p className="text-gray-700">{caseStudy.chief_complaint}</p>
          </div>
          <div>
            <p className="font-medium">Difficulty:</p>
            <p className="text-gray-700">{caseStudy.difficulty}</p>
          </div>
        </div>

        {/* Vitals */}
        <h2 className="text-lg font-semibold mb-2">Patient Vitals</h2>
        <ul className="grid grid-cols-2 gap-3 mb-6">
          <li>Blood Pressure: {caseStudy.blood_pressure}</li>
          <li>Heart Rate: {caseStudy.heart_rate}</li>
          <li>Respiratory Rate: {caseStudy.respiratory_rate}</li>
          <li>Oxygen Rate: {caseStudy.oxygen_rate}</li>
          <li>Temperature: {caseStudy.temperature}</li>
        </ul>

        {/* Question & Options */}
        <h2 className="text-lg font-semibold mb-2">Question</h2>
        <p className="mb-4">{caseStudy.questions}</p>
        <ul className="space-y-2">
          {caseStudy.cs_answer_options.map((opt, idx) => (
            <li
              key={idx}
              className={`p-2 rounded border ${
                opt.is_correct
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200"
              }`}
            >
              {opt.options}
            </li>
          ))}
        </ul>

        {/* Reason */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Reason</h2>
          <p className="text-gray-700">{caseStudy.reason}</p>
        </div>

        {/* Points */}
        <div className="mt-4">
          <span className="font-medium">Points:</span>{" "}
          <span className="text-blue-600 font-bold">{caseStudy.points}</span>
        </div>
      </div>
    </div>
  );
}
