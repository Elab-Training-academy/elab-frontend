"use client";
import React, { useState } from "react";
import { Search, Bell } from "lucide-react";

const SmartPractice = () => {
  const [questionType, setQuestionType] = useState("Mixed Practice");
  const [courseCategories, setCourseCategories] = useState([
    "All",
    "Medicine and Surgery",
  ]);
  const [difficulty, setDifficulty] = useState("Medium");
  const [searchQuery, setSearchQuery] = useState("");

  const questionTypes = ["Mixed Practice", "Fill in the gap", "Multiple choice"];
  const categories = [
    "All",
    "Medicine and Surgery",
    "Basic Sciences",
    "Clinical Skills",
    "Pharmacology",
  ];
  const difficulties = ["Easy", "Medium", "Hard"];

  const toggleCategory = (category) => {
    if (category === "All") {
      setCourseCategories(["All"]);
    } else {
      const filtered = courseCategories.filter((c) => c !== "All");
      if (courseCategories.includes(category)) {
        const newCategories = filtered.filter((c) => c !== category);
        setCourseCategories(newCategories.length === 0 ? ["All"] : newCategories);
      } else {
        setCourseCategories([...filtered, category]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center flex-1">
              <div className="relative flex-1 max-w-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Type a command or search..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center ml-4">
              <button className="p-2 text-gray-400 hover:text-gray-500 relative">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <p className="text-gray-600 mb-2">Hi Ibrahim,</p>
          <h1 className="text-4xl font-bold text-gray-900">Smart Practice</h1>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search question by keyword"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl text-lg leading-6 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Instructions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-8 h-fit">
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Search and Select the question type that interests you most.
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  This choice helps us customize your practice session so it
                  matches your pace, skills, and learning objectives.
                </p>
              </div>

              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-4 px-6 rounded-xl transition-colors duration-200">
                Start Practice
              </button>
            </div>
          </div>

          {/* Right Column - Selection Options */}
          <div className="lg:col-span-2 space-y-8">
            {/* Question Type Selection */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Select Question Type
              </h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {questionTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setQuestionType(type)}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                      questionType === type
                        ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Course Categories Selection */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Select Course Categories
              </h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                      courseCategories.includes(category)
                        ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Level Selection */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Select Difficulty Level
              </h3>
              <div className="flex gap-3 justify-center">
                {difficulties.map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`px-8 py-3 rounded-full font-medium transition-all duration-200 ${
                      difficulty === level
                        ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Options Summary */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Current Selection:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Question Type:</span>
              <span className="ml-2 text-gray-900">{questionType}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Categories:</span>
              <span className="ml-2 text-gray-900">
                {courseCategories.join(", ")}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Difficulty:</span>
              <span className="ml-2 text-gray-900">{difficulty}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartPractice;
