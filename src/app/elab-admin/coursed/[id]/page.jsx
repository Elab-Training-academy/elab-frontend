"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Loader2, Clock, DollarSign, CheckCircle, BookOpen } from "lucide-react";

export default function SingleCoursePage() {
  const { id } = useParams();
  const url = useAuthStore((state) => state.url);

  const [course, setCourse] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const newToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        // fetch single course
        const courseRes = await fetch(`${url}/courses/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newToken}`,
          },
        });

        if (!courseRes.ok) throw new Error("Failed to fetch course");
        const courseData = await courseRes.json();
        setCourse(courseData);

        // fetch all categories
        const catRes = await fetch(`${url}/categories`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newToken}`,
          },
        });
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, url, newToken]);

  // resolve category name
  const getCategoryName = (categoryId) => {
    const found = categories.find((c) => c.id === categoryId);
    return found ? found.name : "Unknown Category";
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-gray-500" size={32} />
        <span className="ml-2 text-gray-600">Loading course...</span>
      </div>
    );

  if (!course)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">🚫 Course not found</p>
      </div>
    );

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 px-6 shadow-md">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold">{course.title}</h1>
          <p className="mt-3 text-lg text-gray-100">{course.description}</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto p-6 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-8">
          {/* Meta Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl shadow-sm">
              <BookOpen className="text-blue-600 mb-2" size={28} />
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-semibold">
                {getCategoryName(course.category_id)}
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl shadow-sm">
              <DollarSign className="text-green-600 mb-2" size={28} />
              <p className="text-sm text-gray-500">Price</p>
              <p className="font-semibold">${course.price}</p>
            </div>

            <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl shadow-sm">
              <CheckCircle className="text-purple-600 mb-2" size={28} />
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-semibold">{course.status}</p>
            </div>

            <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl shadow-sm">
              <Clock className="text-orange-600 mb-2" size={28} />
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-semibold">{course.duration} hrs</p>
            </div>
          </div>

          {/* Extra Section */}
          <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              📌 Additional Information
            </h3>
            <p className="text-sm text-gray-600">
              You can add related resources, materials, or announcements for
              this course here to give learners more context.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
