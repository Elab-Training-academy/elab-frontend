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
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900">
          {module.title}
        </h1>
         <p className="text-sm">
            Module Description: <span className="font-semibold">{module.description}</span>
          </p>

        {/* Order Number */}
        <div className="flex items-center gap-2 text-gray-700">
          <ListOrdered className="text-blue-600" size={20} />
          <p className="text-sm">
            Module Order: <span className="font-semibold">{module.order_number}</span>
          </p>
          <p className="text-sm">
            Module Duration: <span className="font-semibold">{module.duration}</span>
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
  
        {/* Questions */}
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
    </div>
  );
}
