"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";

export default function CourseCategoryDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
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

        const res = await fetch(
          `https://elab-server-xg5r.onrender.com/course-categories/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch course details");

        const data = await res.json();
        setCourse(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
        <span className="ml-2 text-gray-700 font-medium">
          Loading course details...
        </span>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center mt-6">Error: {error}</p>;
  }

  if (!course) {
    return <p className="text-gray-500 text-center mt-6">Course not found</p>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Course Info */}
      <div className="bg-white shadow-md rounded-2xl border border-gray-200 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
          <h1 className="text-3xl font-bold text-white">{course.name}</h1>
          <p className="mt-2 text-blue-100 max-w-2xl">{course.description}</p>
        </div>

        {/* Details Section */}
        <div className="p-6 grid gap-6 sm:grid-cols-2">
          <div className="p-4 bg-gray-50 rounded-lg border hover:shadow transition">
            <span className="block text-sm font-semibold text-gray-700">
              Created At
            </span>
            <p className="text-sm text-gray-600 mt-1">
              {new Date(course.created_at).toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border hover:shadow transition">
            <span className="block text-sm font-semibold text-gray-700">
              Updated At
            </span>
            <p className="text-sm text-gray-600 mt-1">
              {new Date(course.updated_at).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
