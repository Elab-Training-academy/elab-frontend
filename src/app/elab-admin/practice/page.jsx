// app/page.jsx
"use client";

import { useState } from "react";
import { Search, Plus, ChevronDown, Filter, BarChart3 } from "lucide-react";
import AddSmartPracticeModal from '../../../component/AddPracticeModal'

export default function SmartPractice() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [roleFilter, setRoleFilter] = useState("All roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Mock data - initially empty to match the screenshot
  const [questions, setQuestions] = useState([]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Search Bar - Hidden on mobile based on screenshot */}
      <div className="hidden md:block w-full border-b p-4 bg-white shadow-sm">
        <div className="relative max-w-2xl mx-auto">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Type a command or search..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Smart Practice</h1>
          <p className="text-gray-600 text-sm md:text-base mt-1">Manage and set Smart Practice questions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="bg-white p-3 md:p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-600 text-xs md:text-sm">Total Questions</h3>
              <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500 text-xs md:text-sm">0</span>
              </div>
            </div>
            <div className="mt-2 h-1 md:h-2 bg-gray-200 rounded-full"></div>
          </div>
          
          <div className="bg-white p-3 md:p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-600 text-xs md:text-sm">Average Correct Rate</h3>
              <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500 text-xs md:text-sm">0%</span>
              </div>
            </div>
            <div className="mt-2 h-1 md:h-2 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-3 md:p-4 rounded-lg shadow mb-4 md:mb-6">
          <div className="flex items-center mb-2 md:mb-3">
            <Filter size={16} className="text-gray-500 mr-2" />
            <span className="text-gray-700 text-xs md:text-sm">Search by title, description and category</span>
          </div>
          
          <div className="flex flex-col gap-2 md:flex-row md:gap-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search questions..."
                className="w-full pl-9 pr-3 md:pl-10 md:pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 md:flex md:gap-3">
              <div className="relative">
                <select 
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-7"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option>All Categories</option>
                  <option>Mathematics</option>
                  <option>Science</option>
                  <option>History</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
              </div>
              
              <div className="relative">
                <select 
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-7"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option>All roles</option>
                  <option>Admin</option>
                  <option>Editor</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
              </div>
              
              <div className="relative col-span-2">
                <select 
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-7"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Draft</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
              </div>
            </div>
          </div>
        </div>

       
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-4 md:p-8">
          <div className="flex flex-col items-center justify-center py-6 md:py-8 text-center">
            <div className="mb-3 md:mb-4">
              <BarChart3 className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto" />
            </div>
            <p className="text-gray-600 mb-2 text-base md:text-lg">
              Looks like you haven't added any questions yet
            </p>
            <p className="text-gray-500 mb-4 md:mb-6 text-sm md:text-base">
              Need a place to start?
            </p>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-blue-600 text-white text-sm md:text-base rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} /> Add First Smart Practice Question
            </button>
          </div>
        </div>

        
        <AddSmartPracticeModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </div>
    </div>
  );
}