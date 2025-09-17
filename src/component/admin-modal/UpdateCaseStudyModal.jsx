"use client";
import { useState, useEffect } from "react";

export default function UpdateCaseStudyModal({ isOpen, onClose, caseStudy, onUpdated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [cs_answer_options, setCs_answer_options] = useState([]);
  const [loading, setLoading] = useState(false);

  // Prefill when modal opens
  useEffect(() => {
    if (caseStudy) {
      setTitle(caseStudy.title || "");
      setDescription(caseStudy.description || "");
      setDifficulty(caseStudy.difficulty || "");
      setCs_answer_options(caseStudy.cs_answer_options || []);
    }
  }, [caseStudy]);

  if (!isOpen || !caseStudy) return null;

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);

      const payload = {
        title,
        description,
        difficulty,
        cs_answer_options: cs_answer_options, // ✅ required by backend
      };

      const res = await fetch(
        `https://elab-server-xg5r.onrender.com/case-studies/${caseStudy.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to update case study");
      const updated = await res.json();

      onUpdated(updated);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error updating case study");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...cs_answer_options];
    updatedOptions[index] = value;
    setCs_answer_options(updatedOptions);
  };

  const addOption = () => setCs_answer_options([...cs_answer_options, ""]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Update Case Study</h2>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-3"
          placeholder="Enter title"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-3"
          placeholder="Enter description"
        />

        <input
          type="text"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
          placeholder="Enter difficulty"
        />

        <div className="mb-4">
          <label className="font-medium text-sm">Answer Options</label>
          {cs_answer_options.map((opt, idx) => (
            <input
              key={idx}
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              className="w-full border px-3 py-2 rounded mb-2"
              placeholder={`Option ${idx + 1}`}
            />
          ))}
          <button
            onClick={addOption}
            className="text-blue-600 text-sm mt-1"
          >
            + Add Option
          </button>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
