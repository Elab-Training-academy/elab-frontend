// app/page.jsx
"use client";

import { useState } from "react";
import { Search, Plus, Download, ChevronDown, Filter, BarChart3, PieChart } from "lucide-react";
import AddSubscriptionModal from "../../../component/AddSubscriptionModal";

export default function SubscriptionManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Mock data - initially empty to match the screenshot
  const [subscriptions, setSubscriptions] = useState([]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Subscription management</h1>
          <p className="text-gray-600 text-sm md:text-base mt-1">Manage and add new subscription</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="bg-white p-3 md:p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-600 text-xs md:text-sm">Total Revenue</h3>
              <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded flex items-center justify-center">
                <span className="text-blue-600 font-medium text-xs md:text-sm">$0</span>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">Active: 0</div>
          </div>
          
          <div className="bg-white p-3 md:p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-600 text-xs md:text-sm">Active subscriptions</h3>
              <div className="w-6 h-6 md:w-8 md:h-8 bg-green-100 rounded flex items-center justify-center">
                <span className="text-green-600 font-medium text-xs md:text-sm">03</span>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">Total: 03</div>
          </div>
          
          <div className="bg-white p-3 md:p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-600 text-xs md:text-sm">Average Revenue</h3>
              <div className="w-6 h-6 md:w-8 md:h-8 bg-purple-100 rounded flex items-center justify-center">
                <span className="text-purple-600 font-medium text-xs md:text-sm">$0</span>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">Per user</div>
          </div>
          
          <div className="bg-white p-3 md:p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-600 text-xs md:text-sm">Churn rate</h3>
              <div className="w-6 h-6 md:w-8 md:h-8 bg-red-100 rounded flex items-center justify-center">
                <span className="text-red-600 font-medium text-xs md:text-sm">73%</span>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">This month</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-3 mb-4 md:mb-6">
          <div className="flex-1 flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
              <Download size={16} /> Export Data
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} /> Create Manual Subscription
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-3 md:p-4 rounded-lg shadow mb-4 md:mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <Filter size={16} className="text-gray-500 mr-2" />
                <span className="text-gray-700 text-xs md:text-sm">Search by title, description and category</span>
              </div>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search subscriptions..."
                  className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="md:w-48">
              <div className="text-gray-700 text-xs md:text-sm mb-2">Status</div>
              <div className="relative">
                <select 
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-7"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Canceled</option>
                  <option>Pending</option>
                  <option>Expired</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
              </div>
            </div>
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-4 md:mb-6">
          <div className="p-3 md:p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Subscriptions</h2>
          </div>
          
          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3">
              <svg className="w-12 h-12 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-2 text-base">
              No subscriptions found
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Monthly Revenue Trends */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-3 md:p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <BarChart3 size={18} className="mr-2" /> Monthly Revenue Trends
              </h2>
            </div>
            <div className="p-6 flex flex-col items-center justify-center text-center h-64">
              <BarChart3 className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500">No data found</p>
            </div>
          </div>

          {/* Plan Distribution */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-3 md:p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <PieChart size={18} className="mr-2" /> Plan Distribution
              </h2>
            </div>
            <div className="p-6 flex flex-col items-center justify-center text-center h-64">
              <PieChart className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500">No data found</p>
            </div>
          </div>
        </div>

        {/* Modal */}
        <AddSubscriptionModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </div>
    </div>
  );
}