"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Loader2, ListOrdered, FileQuestion } from "lucide-react";

export default function SingleModulePage() {
  const { id } = useParams(); // module id from URL
  const url = useAuthStore((state) => state.url);
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    lesson_date: "",
    start_time: "",
    end_time: "",
    zoom_link: "",
    meeting_id: "",
    password: "",
    status: true,
  });

  const newToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!id) return;

    const fetchModule = async () => {
      try {
        const res = await fetch(`${url}/modules/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newToken}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch module");
        const data = await res.json();
        setModule(data);
      } catch (err) {
        console.error("Error fetching module:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [id, url, newToken]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${url}/schedule-classes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newToken}`,
        },
        body: JSON.stringify({
          course_id: module.course_id,
          module_id: module.id,
          ...formData,
          status: formData.status === "true" || formData.status === true,
        }),
      });

      if (!res.ok) throw new Error("Failed to schedule class");
      alert("Class scheduled successfully");
      setShowForm(false);
      setFormData({
        lesson_date: "",
        start_time: "",
        end_time: "",
        zoom_link: "",
        meeting_id: "",
        password: "",
        status: true,
      });
    } catch (err) {
      console.error("Error scheduling class:", err);
      alert("Error scheduling class");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-gray-500" size={32} />
        <span className="ml-2 text-gray-600">Loading module...</span>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-600">🚫 {error}</p>
      </div>
    );

  if (!module)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">No module found</p>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-6">
        <div className="flex flex-col-reverse gap-6 justify-between w-full lg:flex-row lg:gap-0">
          <h1 className="text-2xl font-bold text-gray-900">{module.title}</h1>

          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 py-2 px-6 text-white rounded"
          >
            Schedule Class
          </button>
        </div>

        <p className="text-sm">
          Module Description:{" "}
          <span className="font-semibold">{module.description}</span>
        </p>

        <div className="flex items-center gap-2 text-gray-700">
          <ListOrdered className="text-blue-600" size={20} />
          <p className="text-sm">
            Module Order:{" "}
            <span className="font-semibold">{module.order_number}</span>
          </p>
          <p className="text-sm">
            Module Duration:{" "}
            <span className="font-semibold">{module.duration}</span>
          </p>
        </div>

        <div>
          <p className="text-sm">
            Module Material:{" "}
            {module.material_link ? (
              <a
                href={`${module.material_link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Material
              </a>
            ) : (
              <span className="text-gray-500">No material uploaded</span>
            )}
          </p>
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileQuestion className="text-purple-600" size={20} />
            Questions
          </h2>

          {module.questions.length === 0 ? (
            <p className="text-gray-500 text-sm mt-2">
              No questions have been added to this module yet.
            </p>
          ) : (
            <ul className="mt-2 space-y-2">
              {module.questions.map((q, idx) => (
                <li
                  key={idx}
                  className="p-3 border rounded-lg bg-gray-50 text-gray-700"
                >
                  {q.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Schedule Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 overflow-y-scroll">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Schedule Class</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label htmlFor="lesson_date">Lesson Date</label>
              <input
                type="date"
                name="lesson_date"
                value={formData.lesson_date}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <label htmlFor="start_time">Start Time</label>
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />

              <label htmlFor="end_time">End Time</label>
              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />

              <label htmlFor="meeting_id">Meetind Id</label>
              <input
                type="text"
                name="meeting_id"
                value={formData.meeting_id}
                onChange={handleChange}
                placeholder="Zoom link"
                className="w-full border px-3 py-2 rounded"
                required
              />

              <label htmlFor="password">Meeting Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Zoom link"
                className="w-full border px-3 py-2 rounded"
                required
              />

              <label htmlFor="zoom_link">Zoom Link</label>
              <input
                type="url"
                name="zoom_link"
                value={formData.zoom_link}
                onChange={handleChange}
                placeholder="Zoom link"
                className="w-full border px-3 py-2 rounded"
                required
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
