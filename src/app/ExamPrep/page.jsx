"use client";
import React, { useState } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import Image from "next/image";
import max from "../../image/SVG.png";
import Navbar from '@/component/Navbar';
import  Faq from '@/component/Faq';
import Footer from '@/component/Footer';
import Trial from '@/component/Trial';

const plansData = {
  "NCLEX Packages": [
    {
      title: "NCLEX Standard",
      description: "Complete NCLEX preparation with essential practice materials.",
      price: "$89 /course",
      features: ["2500+ Questions", "Case Studies", "Live Sessions", "Pass Guarantee"],
    },
    {
      title: "NCLEX Advanced",
      description: "Advanced NCLEX prep with mock exams and expert guidance.",
      price: "$129 /course",
      features: ["3500+ Questions", "Mock Exams", "Expert Tutors", "Study Materials"],
    },
    {
      title: "NCLEX Pro",
      description: "Comprehensive NCLEX coverage with premium resources.",
      price: "$159 /course",
      features: ["5000+ Questions", "Full-Length Exams", "Expert Tutors", "Pass Guarantee"],
    },
  ],
  "Middle East Plans": [
    {
      title: "DHA License Preparation",
      description: "Complete DHA exam preparation with comprehensive study materials and practice tests.",
      price: "$89 /course",
      features: ["2500+ Questions", "Case Studies", "Live Sessions", "Pass Guarantee"],
    },
    {
      title: "OMSB Exam Mastery",
      description: "Master the OMSB examination with region-specific content and expert guidance.",
      price: "$99 /course",
      features: ["3000+ Questions", "Mock Exams", "Arabic Support", "Expert Tutors"],
    },
    {
      title: "Saudi Board Excellence",
      description: "Specialized prep for Saudi Board exams with local expert instructors.",
      price: "$119 /course",
      features: ["4000+ Questions", "Clinical Scenarios", "Arabic Content", "1-on-1 Support"],
    },
  ],
  English: [
    {
      title: "IELTS Academic Prep",
      description: "Boost your IELTS score with targeted practice sessions.",
      price: "$79 /course",
      features: ["Practice Tests", "Speaking Sessions", "Writing Feedback", "Pass Guarantee"],
    },
    {
      title: "OET Mastery",
      description: "OET-focused training for healthcare professionals.",
      price: "$99 /course",
      features: ["Role Play Practice", "Listening Materials", "Live Speaking Support", "Expert Feedback"],
    },
    {
      title: "OET Premium",
      description: "Premium OET package with expert feedback and guidance.",
      price: "$129 /course",
      features: ["Extended Role Plays", "Mock Exams", "One-on-One Feedback", "Expert Tutors"],
    },
  ],
};

const ExamPlans = () => {
  const [activeTab, setActiveTab] = useState("Middle East Plans");

  return (
    <>
    <Navbar />
    <div className="w-full py-12 px-6 bg-gray-50 text-center">
      {/* Heading */}
      <h2 className="text-2xl md:text-3xl font-bold mb-2">
        Choose Your Path to <span className="text-blue-600">Success</span>
      </h2>
      <p className="text-gray-600 mb-6">
        Flexible pricing plans designed for every stage of your journey
      </p>

      {/* Tabs */}
      <div className="flex justify-center items-center  gap-3  mb-10 flex-wrap">
        {Object.keys(plansData).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-[5px] border text-sm md:text-base transition ${
              activeTab === tab
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
   
      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plansData[activeTab].map((plan, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition flex flex-col justify-between h-[420px]"
          >
            <div>
              <h3 className="text-lg font-bold mb-2">{plan.title}</h3>
              <p className="text-gray-600 mb-4 text-sm">{plan.description}</p>
              <ul className="text-left mb-6 space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center font-medium gap-3 text-gray-700">
                    <Image
                      src={max}
                      alt="check"
                      width={18}
                      height={18}
                      className="inline-block"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <p className="font-bold text-[17px]">{plan.price}</p>
            
            <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition">
              Enroll Now <FaLongArrowAltRight className="text-sm" />
            </button>
          </div>

          </div>
        ))}
      </div>
    </div>
    <Faq />
    <Trial />
    <Footer />
    </>
  );
};

export default ExamPlans;
