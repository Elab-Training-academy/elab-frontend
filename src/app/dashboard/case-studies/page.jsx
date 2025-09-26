
"use client";

import React, { useEffect, useState } from "react";
import {
  HeartPulse,
  Activity,
  Thermometer,
  Droplet,
  Stethoscope,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function CaseStudiesPage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [caseStudy, setCaseStudy] = useState(null);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingCaseStudy, setLoadingCaseStudy] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, fetchUser } = useAuthStore();

  const url = useAuthStore((state) => state.url);
  const router = useRouter();

  // ✅ Fetch user courses first
  useEffect(() => {
    const fetchCourses = async () => {
      try {

        fetchUser();

        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${url}/orders/ordered-courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Failed to fetch courses:", res.status);
          setCourses([]);
          return;
        }

        const data = await res.json();
        setCourses(Array.isArray(data) ? data : data.courses || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [url, fetchUser, user]);

  // ✅ Fetch case study when a course is selected
  useEffect(() => {
    if (!selectedCourse) return;

    const fetchCaseStudy = async () => {
      setLoadingCaseStudy(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(
          `${url}/case-studies/details/${selectedCourse}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch case study");

        const data = await res.json();
        setCaseStudy(data[0] || null);
      } catch (err) {
        console.error("Error fetching case study:", err);
        setCaseStudy(null);
      } finally {
        setLoadingCaseStudy(false);
      }
    };

    fetchCaseStudy();
  }, [selectedCourse, url]);

  function handleGotoCaseStudy() {
    if (selectedCourse) {
      setLoading(true);
      router.push(`/dashboard/case-studies/${selectedCourse}/questions`);
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col w-full min-h-screen p-6 bg-gray-100 gap-10">
      {/* Header */}
      <div>
        <p className="text-[30px] font-semibold text-blue-600">Case Studies</p>
        <p className="text-gray-500 text-[14px]">
          Advanced clinical reasoning and critical thinking practice
        </p>
      </div>

      {/* Select Course */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">Select a Course</h2>
        {loadingCourses ? (
          <p className="text-gray-500">Loading courses...</p>
        ) : courses.length === 0 ? (
          <p className="text-gray-500">No courses available.</p>
        ) : (
          <select
            className="border p-2 rounded-lg"
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">-- Select a course --</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Case Study */}
      {selectedCourse && (
        <div className="bg-white p-6 rounded-xl shadow-md w-full">
          {loadingCaseStudy ? (
            <p className="text-gray-500">Loading case study...</p>
          ) : !caseStudy ? (
            <p className="text-red-500">No case study found.</p>
          ) : (
            <>
              {/* Patient Image / Initial */}
              {caseStudy.patient_image ? (
                <img
                  src={caseStudy.patient_image}
                  alt={caseStudy.patient_name}
                  className="w-24 h-24 rounded-full mx-auto object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center bg-blue-600 text-white text-3xl font-bold">
                  {caseStudy.patient_name?.charAt(0).toUpperCase()}
                </div>
              )}

              <p className="text-center font-semibold mt-3">
                {caseStudy.patient_name}
              </p>
              <p className="text-center text-gray-500">
                {caseStudy.patient_age} year old patient
              </p>
              <p className="text-center text-sm mt-2">
                Description: {caseStudy.description}
              </p>
              <p className="text-center text-sm mt-2">
                Chief Complaint: {caseStudy.chief_complaint}
              </p>
              <p className="text-center text-sm mt-2">Title: {caseStudy.title}</p>

              {/* Vitals */}
              <div className="flex justify-around items-center p-5 gap-6 ">
                <div className="flex gap-3 flex-col ">
                  <p className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" /> BP:{" "}
                    {caseStudy.blood_pressure}
                  </p>
                  <p className="flex items-center gap-2">
                    <HeartPulse className="w-5 h-5 text-blue-600" /> HR:{" "}
                    {caseStudy.heart_rate}
                  </p>
                  <p className="flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-blue-600" /> RR:{" "}
                    {caseStudy.respiratory_rate}
                  </p>
                </div>

                <div className="flex gap-3 flex-col ">
                  <p className="flex items-center gap-2">
                    <Thermometer className="w-5 h-5 text-blue-600" /> Temp:{" "}
                    {caseStudy.temperature}
                  </p>
                  <p className="flex items-center gap-2">
                    <Droplet className="w-5 h-5 text-blue-600" /> O₂:{" "}
                    {caseStudy.oxygen_rate}
                  </p>
                  <p className="flex items-center gap-2">
                    <HeartPulse className="w-5 h-5 text-blue-600" /> Difficulty:{" "}
                    {caseStudy.difficulty}
                  </p>
                </div>
              </div>

              {/* Start Button */}
              <div className="text-center">
                <button
                  onClick={handleGotoCaseStudy}
                  className="mt-4 border-2 border-[#7e7d7d] text-black p-2 w-[200px] rounded-[13px] hover:bg-blue-600 hover:text-white transition"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Start Case Study →"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

