"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { ChevronRight, Video, Calendar, Clock, KeyRound } from "lucide-react";

const SchedulePage = () => {
  const { id, course } = useParams();
  const url = useAuthStore((state) => state.url);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${url}/schedule-classes/${course}/content`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setSchedule(data);
      } catch (error) {
        console.error("Error fetching schedule:", error);
        setSchedule(null);
      } finally {
        setLoading(false);
      }
    };

    if (course) fetchSchedule();
  }, [course, url]);

  // Format helpers
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const d = new Date();
    d.setHours(hours);
    d.setMinutes(minutes);
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  // Countdown timer
  useEffect(() => {
    if (!schedule?.lesson_date || !schedule?.start_time || !schedule?.end_time) return;

    const interval = setInterval(() => {
      const startDateTime = new Date(
        `${schedule.lesson_date.split("T")[0]}T${schedule.start_time}`
      );
      const endDateTime = new Date(
        `${schedule.lesson_date.split("T")[0]}T${schedule.end_time}`
      );
      const now = new Date();

      if (now < startDateTime) {
        const diff = startDateTime - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      } else if (now >= startDateTime && now <= endDateTime) {
        setCountdown("Class has started 🎉");
      } else {
        setCountdown("Class has ended ✅");
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [schedule]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Scheduled Class</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/dashboard/my-courses" className="hover:text-blue-600">
            My Courses
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            href={`/dashboard/my-courses/${id}`}
            className="hover:text-blue-600"
          >
            Modules
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Schedule</span>
        </nav>

        {/* Zoom Session Card */}
        {loading ? (
          <p className="text-gray-500">Loading scheduled class...</p>
        ) : schedule ? (
          <>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Class Session
                </h2>
                <span className="text-sm px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium mt-3 md:mt-0">
                  {countdown || "Loading..."}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Lesson Date</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {formatDate(schedule.lesson_date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {formatTime(schedule.start_time)} – {formatTime(schedule.end_time)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Video className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Meeting ID</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {schedule.meeting_id}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <KeyRound className="w-5 h-5 text-red-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Password</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {schedule.password}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <a
                  href={schedule.zoom_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all text-lg font-semibold"
                >
                  <Video className="w-5 h-5" />
                  Join Class Now
                </a>
              </div>
            </div>

            {/* Module Description Card */}
            {schedule.module && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {schedule.module.title}
                </h2>
                <p className="text-gray-600 mb-4">{schedule.module.description}</p>
                {schedule.module.material_link && (
                  <a
                    href={schedule.module.material_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg shadow-lg transition-all font-medium"
                  >
                    Module Study Material
                  </a>
                )}
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500">No scheduled class found.</p>
        )}
      </div>
    </div>
  );
};

export default SchedulePage;
