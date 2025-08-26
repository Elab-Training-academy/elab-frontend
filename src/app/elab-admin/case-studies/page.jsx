// app/page.jsx
"use client";

import { useState } from "react";
import { Search, Plus, ChevronDown, Filter, BookOpen, BarChart3, CheckCircle } from "lucide-react";
import AddCaseStudyModal from "../../../component/AddCaseStudyModal";

export default function CaseStudies() {
  const [searchQuery, setSearchQuery] = useState("");
  const [accountFilter, setAccountFilter] = useState("All Accounts");
  const [difficultyFilter, setDifficultyFilter] = useState("All Difficulty");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Mock data - stats
  const [stats] = useState({
    totalCases: 0,
    categories: 0,
    completionRate: "0%"
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Case Studies</h1>
          <p className="text-gray-600 text-sm md:text-base mt-1">Manage and add new Case Studies</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-600 text-sm md:text-base">Total Case</h3>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpen size={18} className="text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl md:text-3xl font-bold text-gray-800">{stats.totalCases}</span>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-600 text-sm md:text-base">Categories</h3>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-full flex items-center justify-center">
                <BarChart3 size={18} className="text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl md:text-3xl font-bold text-gray-800">{stats.categories}</span>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-600 text-sm md:text-base">Completion Rate</h3>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <CheckCircle size={18} className="text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl md:text-3xl font-bold text-gray-800">{stats.completionRate}</span>
            </div>
          </div>
        </div>

        {/* Search & Filters Section */}
        <div className="bg-white p-4 rounded-lg shadow mb-4 md:mb-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <Search size={18} className="mr-2" /> Search case studies
            </h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search case studies..."
                  className="w-full pl-10 pr-4 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 md:flex md:gap-4">
              <div className="relative">
                <select 
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
                  value={accountFilter}
                  onChange={(e) => setAccountFilter(e.target.value)}
                >
                  <option>All Accounts</option>
                  <option>Enterprise</option>
                  <option>Small Business</option>
                  <option>Startup</option>
                  <option>Individual</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
              
              <div className="relative">
                <select 
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                >
                  <option>All Difficulty</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                  <option>Expert</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Add New Case Study Button */}
        <div className="mb-6 md:mb-8">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} /> Add New Case Studies
          </button>
        </div>

        {/* Case Studies List - Empty State */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Case Studies</h2>
          </div>
          
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto" />
            </div>
            <p className="text-gray-600 mb-2 text-lg">
              No case studies found
            </p>
            <p className="text-gray-500 mb-6 max-w-md">
              Get started by adding your first case study
            </p>
          </div>
        </div>

        {/* Modal */}
        <AddCaseStudyModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </div>
    </div>
  );
}