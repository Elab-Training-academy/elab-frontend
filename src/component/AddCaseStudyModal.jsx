"use client";

import { useState, useEffect } from "react";
import {
  X,
  BookOpen,
  User,
  Activity,
  Plus,
  Trash2,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function AddCaseStudyModal({ isOpen, onClose }) {
  const { url } = useAuthStore();
  const fetchAllCourses = useAuthStore((state) => state.fetchAllCourses);
  const newToken = useAuthStore((state) => state.token);
  const setToken = useAuthStore((state) => state.setToken);
  const courses = useAuthStore((state) => state.courses);

  useEffect(() => {
    if (!newToken && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  }, [newToken, setToken]);

  useEffect(() => {
    if (isOpen) {
      fetchAllCourses();
    }
  }, [isOpen, fetchAllCourses]);

  const [formData, setFormData] = useState({
    caseStudyTitle: "",
    course: "",
    difficulty: "Easy",
    medicalCategory: "",
    caseDescription: "",
    patientName: "",
    patientsAge: "",
    chiefComplaint: "",
    bloodPressure: "",
    heartRate: "",
    respiratoryRate: "",
    oxygenRate: "",
    temperature: "",
    medicalHistory: "",
    question: "",
    cs_answer_options: [
      { options: "", is_correct: false },
      { options: "", is_correct: false },
    ],
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!formData.course) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${url}/course-categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch categories");

        const data = await res.json();
        const filtered = data.filter((cat) => cat.course_id === formData.course);
        setCategories(filtered);
      } catch (err) {
        console.error("Failed to load categories:", err);
        setCategories([]);
      }
    };

    fetchCategories();
  }, [formData.course, url]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Answer options handlers
  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.cs_answer_options];
    newOptions[index].options = value;
    setFormData((prev) => ({ ...prev, cs_answer_options: newOptions }));
  };

  const handleSetCorrect = (index) => {
    const newOptions = formData.cs_answer_options.map((opt, i) => ({
      ...opt,
      is_correct: i === index,
    }));
    setFormData((prev) => ({ ...prev, cs_answer_options: newOptions }));
  };

  const handleAddOption = () => {
    setFormData((prev) => ({
      ...prev,
      cs_answer_options: [
        ...prev.cs_answer_options,
        { options: "", is_correct: false },
      ],
    }));
  };

  const handleRemoveOption = (index) => {
    const newOptions = formData.cs_answer_options.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, cs_answer_options: newOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = {
      title: formData.caseStudyTitle,
      difficulty: formData.difficulty,
      course_id: formData.course,
      course_category_id: formData.medicalCategory,
      description: formData.caseDescription,
      patient_name: formData.patientName,
      patient_age: parseInt(formData.patientsAge, 10) || 0,
      chief_complaint: formData.chiefComplaint,
      blood_pressure: formData.bloodPressure,
      heart_rate: formData.heartRate,
      respiratory_rate: formData.respiratoryRate,
      oxygen_rate: formData.oxygenRate,
      temperature: formData.temperature,
      medical_history: formData.medicalHistory,
      questions: formData.question, // ✅ user-provided question
      points: 10,
      reason: "The reason for the correct answer goes here",
      cs_answer_options: formData.cs_answer_options,
    };

    try {
      const res = await fetch(`${url}/case-studies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("✅ Case Study created:", data);
        onClose();
      } else {
        const err = await res.json();
        console.error("❌ Failed to create case study:", err);
        alert(err.message || "Failed to create case study");
      }
    } catch (error) {
      console.error("🚨 Error creating case study:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Case Study Management
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <BookOpen size={18} className="mr-2" /> Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="caseStudyTitle"
                value={formData.caseStudyTitle}
                onChange={handleInputChange}
                placeholder="Case Study Title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <select
                name="course"
                value={formData.course}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title || c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Difficulty & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
              <option value="Expert">Expert</option>
            </select>
            <select
              name="medicalCategory"
              value={formData.medicalCategory}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name || cat.title}
                </option>
              ))}
            </select>
          </div>

          {/* Case Description */}
          <textarea
            name="caseDescription"
            value={formData.caseDescription}
            onChange={handleInputChange}
            rows={3}
            placeholder="Case Description"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />

          {/* Patient Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <User size={18} className="mr-2" /> Patient Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleInputChange}
                placeholder="Patient Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                name="patientsAge"
                value={formData.patientsAge}
                onChange={handleInputChange}
                placeholder="Age"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <input
              type="text"
              name="chiefComplaint"
              value={formData.chiefComplaint}
              onChange={handleInputChange}
              placeholder="Chief Complaint"
              className="w-full mt-4 px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Vitals */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Activity size={18} className="mr-2" /> Vital Signs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="bloodPressure"
                value={formData.bloodPressure}
                onChange={handleInputChange}
                placeholder="Blood Pressure"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                name="heartRate"
                value={formData.heartRate}
                onChange={handleInputChange}
                placeholder="Heart Rate"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                name="respiratoryRate"
                value={formData.respiratoryRate}
                onChange={handleInputChange}
                placeholder="Respiratory Rate"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                name="oxygenRate"
                value={formData.oxygenRate}
                onChange={handleInputChange}
                placeholder="Oxygen Rate"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                name="temperature"
                value={formData.temperature}
                onChange={handleInputChange}
                placeholder="Temperature"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Medical History */}
          <textarea
            name="medicalHistory"
            value={formData.medicalHistory}
            onChange={handleInputChange}
            rows={3}
            placeholder="Medical History"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />

          {/* ✅ Question */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <HelpCircle size={18} className="mr-2" /> Question
            </h3>
            <textarea
              name="question"
              value={formData.question}
              onChange={handleInputChange}
              rows={3}
              placeholder="Enter the question for students"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* ✅ Answer Options */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Answer Options
            </h3>
            {formData.cs_answer_options.map((opt, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={opt.options}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleSetCorrect(index)}
                  className={`px-3 py-2 rounded-lg flex items-center gap-1 ${
                    opt.is_correct
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  <CheckCircle size={16} />
                  {opt.is_correct ? "Correct" : "Set Correct"}
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  disabled={formData.cs_answer_options.length <= 2}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddOption}
              className="mt-2 flex items-center gap-1 text-blue-600 hover:underline"
            >
              <Plus size={16} /> Add Option
            </button>
          </div>

          {/* Actions */}
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg mr-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Case Study
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
