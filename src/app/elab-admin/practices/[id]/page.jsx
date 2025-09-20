"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function SingleSmartPracticePage() {
  const { id } = useParams();
  const { url } = useAuthStore();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchQuestion = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${url}/sp-questions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setQuestion(data);
        }
      } catch (err) {
        console.error("Error fetching question:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id, url]);

  if (loading) return <p className="p-6">Loading question...</p>;
  if (!question) return <p className="p-6">Question not found</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        {/* ✅ Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
        >
          ← Back
        </button>

        <h1 className="text-xl font-bold mb-2">{question.question}</h1>
        <p className="text-gray-600 mb-4">
          Difficulty: {question.difficulty} • Points: {question.points}
        </p>

        <h2 className="text-lg font-semibold mb-2">Options</h2>
        <ul className="space-y-2">
          {question.answers.map((opt) => (
            <li
              key={opt.id}
              className={`p-2 border rounded ${
                opt.is_correct ? "bg-green-100 text-green-700 font-medium" : ""
              }`}
            >
              {opt.answer}
            </li>
          ))}
        </ul>

        {question.reason && (
          <p className="mt-4 text-sm text-gray-600">
            <span className="font-semibold">Reason:</span> {question.reason}
          </p>
        )}
      </div>
    </div>
  );
}
