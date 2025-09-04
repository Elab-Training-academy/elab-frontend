"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { ChevronRight, FileText, Video, Book } from "lucide-react";

const SchedulePage = () => {
  const { courseId, moduleId } = useParams();
  const url = useAuthStore((state) => state.url);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${url}/schedule-classes/${moduleId}/content`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          console.error("Failed to fetch schedule:", res.status);
          setSchedule(null);
          return;
        }

        const data = await res.json();
        setSchedule(data);
      } catch (error) {
        console.error("Error fetching schedule:", error);
        setSchedule(null);
      } finally {
        setLoading(false);
      }
    };

    if (moduleId) fetchSchedule();
  }, [moduleId]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Scheduled Class</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/dashboard/my-courses" className="hover:text-blue-600">
            My Courses
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            href={`/dashboard/my-courses/${courseId}`}
            className="hover:text-blue-600"
          >
            Modules
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Schedule</span>
        </nav>

        {/* Content */}
        {loading ? (
          <p className="text-gray-500">Loading scheduled class...</p>
        ) : !schedule ? (
          <p className="text-gray-500">
            No scheduled class found for this module.
          </p>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {schedule.title || "Untitled Class"}
            </h2>
            <p className="text-gray-600 mb-6">{schedule.description}</p>

            {/* Render based on content type */}
            {schedule.content_type === "video" && (
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={schedule.content_url}
                  title="Class Video"
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            )}

            {schedule.content_type === "pdf" && (
              <div className="border rounded-lg overflow-hidden h-[600px]">
                <iframe
                  src={schedule.content_url}
                  title="PDF Viewer"
                  className="w-full h-full"
                />
              </div>
            )}

            {schedule.content_type === "text" && (
              <div className="prose max-w-none text-gray-700">
                <Book className="inline w-5 h-5 text-blue-600 mr-2" />
                <p>{schedule.content || "No text content available."}</p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 flex items-center text-sm text-gray-500">
              {schedule.content_type === "video" && (
                <Video className="w-4 h-4 mr-2 text-blue-500" />
              )}
              {schedule.content_type === "pdf" && (
                <FileText className="w-4 h-4 mr-2 text-red-500" />
              )}
              {schedule.content_type === "text" && (
                <Book className="w-4 h-4 mr-2 text-green-500" />
              )}
              <span>Type: {schedule.content_type}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePage;
