// app/page.jsx
"use client";

import { useState } from "react";
import { Users, Activity, Clock, BarChart3, TrendingUp, Target } from "lucide-react";

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  
  // Mock data
  const userEngagementData = [
    { day: "01-14", value: 23.4 },
    { day: "01-15", value: 24.6 },
    { day: "01-16", value: 23.0 },
    { day: "01-17", value: 25.0 },
    { day: "01-18", value: 30.1 },
    { day: "01-19", value: 24.3 },
    { day: "01-20", value: 25.4 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 text-sm md:text-base mt-1">Manage and add new Case Studies</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-600 text-sm md:text-base">Total Users</h3>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users size={18} className="text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl md:text-3xl font-bold text-gray-800">0</span>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-600 text-sm md:text-base">Active Users</h3>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Activity size={18} className="text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl md:text-3xl font-bold text-gray-800">0</span>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-600 text-sm md:text-base">Total Study Hours</h3>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock size={18} className="text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl md:text-3xl font-bold text-gray-800">03</span>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* User Engagement Section */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <TrendingUp size={18} className="mr-2" /> User Engagement
              </h2>
              <div className="flex items-center space-x-2 mt-2 md:mt-0">
                <select 
                  className="text-sm border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 md:mb-6">Daily Active Users over the last 7 days</p>
            
            {/* Engagement Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 md:mb-6">
              <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                <h3 className="text-gray-600 text-sm mb-1">Average Session Duration</h3>
                <p className="text-xl font-semibold text-gray-800">5.2 min.</p>
              </div>
              <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                <h3 className="text-gray-600 text-sm mb-1">Login frequency</h3>
                <p className="text-xl font-semibold text-gray-800">3.4 times/week</p>
              </div>
            </div>
            
            {/* Data Points */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-gray-600 text-sm mb-3">Daily Active Users</h3>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {userEngagementData.map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-blue-100 text-blue-800 text-xs font-medium py-1 rounded">
                      {item.value}k
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{item.day}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Course Performance Section */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <Target size={18} className="mr-2" /> Course Performance
              </h2>
              <div className="flex items-center space-x-2 mt-2 md:mt-0">
                <select 
                  className="text-sm border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 md:mb-6">Completion rate and Average Score</p>
            
            {/* Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                <h3 className="text-gray-600 text-sm mb-1">Completion Rate</h3>
                <p className="text-xl font-semibold text-gray-800">72%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
              <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                <h3 className="text-gray-600 text-sm mb-1">Average Score</h3>
                <p className="text-xl font-semibold text-gray-800">84%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '84%' }}></div>
                </div>
              </div>
            </div>
            
            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                <h3 className="text-gray-600 text-sm mb-1">Average Session Duration</h3>
                <p className="text-xl font-semibold text-gray-800">5.2 min.</p>
              </div>
              <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                <h3 className="text-gray-600 text-sm mb-1">Login frequency</h3>
                <p className="text-xl font-semibold text-gray-800">3.4 times/week</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Charts/Data can be added here */}
        <div className="mt-4 md:mt-6 bg-white shadow-md rounded-lg overflow-hidden p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Additional Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">12</div>
              <div className="text-sm text-gray-600">Active Courses</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">87%</div>
              <div className="text-sm text-gray-600">Satisfaction Rate</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">4.8/5</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}