"use client";
import React from "react";
import { useRouter } from "next/navigation";

const ExamCategory = () => {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <section className="px-6 md:px-20 lg:px-16 py-12 bg-white text-center">
      {/* Section Title */}
      <h2 className="text-2xl md:text-3xl font-bold mb-3 text-blue-600">
        Exam Category
      </h2>
      <p className="text-gray-500 max-w-2xl mx-auto mb-10">
        Choose from our comprehensive selection of exam preparation courses
        designed to help you succeed in your healthcare career.
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* NCLEX-RN */}
        <div
          onClick={() => handleNavigation("/ExamPrep")}
          className="cursor-pointer bg-gray-50 rounded-2xl shadow-lg p-6 text-left hover:shadow-2xl hover:scale-105 transform transition-all duration-300"
        >
          <h3 className="text-blue-600 font-semibold mb-2">NCLEX-RN</h3>
          <p className="text-gray-600">
            Comprehensive NCLEX-RN preparation with AI-powered study plans,
            unlimited practice questions, and CAT simulations.
          </p>
        </div>

        {/* Middle East */}
        <div
          onClick={() => handleNavigation("/ExamPrep")}
          className="cursor-pointer bg-gray-50 rounded-2xl shadow-lg p-6 text-left hover:shadow-2xl hover:scale-105 transform transition-all duration-300"
        >
          <h3 className="text-blue-600 font-semibold mb-2">Middle East</h3>
          <p className="text-gray-600">
            Master the OMSB, DHA, SBE examination with region-specific content
            and expert guidance.
          </p>
        </div>

        {/* English */}
        <div
          onClick={() => handleNavigation("/ExamPrep")}
          className="cursor-pointer bg-gray-50 rounded-2xl shadow-lg p-6 text-left hover:shadow-2xl hover:scale-105 transform transition-all duration-300"
        >
          <h3 className="text-blue-600 font-semibold mb-2">English</h3>
          <p className="text-gray-600">
            Master healthcare-specific English for OET, IELTS.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ExamCategory;
