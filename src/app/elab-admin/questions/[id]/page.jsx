"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function SingleQuestion() {
  const { id } = useParams();
  const router = useRouter();
  const { url } = useAuthStore();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestion = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch(`${url}/questions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setQuestion(data);
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
          className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          ← Back
        </button>

        <h1 className="text-xl font-bold mb-2">{question.question_text}</h1>
        <p className="text-gray-600 mb-4">
          Type: {question.answer_type} • Points: {question.points}
        </p>

        {question.image_url && (
          <img
            src={question.image_url}
            alt="question"
            className="w-64 h-64 object-cover rounded border mb-4"
          />
        )}

        <h2 className="text-lg font-semibold mb-2">Options</h2>
        <ul className="space-y-2">
          {question.answer_options.map((opt) => (
            <li
              key={opt.id}
              className={`p-2 border rounded ${
                opt.is_correct ? "bg-green-100 text-green-700 font-medium" : ""
              }`}
            >
              {opt.option_text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
