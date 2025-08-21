"use client"
import React, { useState } from 'react';
import { Search, Bell, Trophy, Clock, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [reportType, setReportType] = useState('Weekly');

  // Sample data for the line chart
  const progressData = [
    { month: 'Jan', score1: 75, score2: -10 },
    { month: 'Feb', score1: 78, score2: -5 },
    { month: 'Mar', score1: 82, score2: 0 },
    { month: 'Apr', score1: 85, score2: 5 },
    { month: 'May', score1: 88, score2: 15 },
    { month: 'Jun', score1: 75, score2: 20 },
    { month: 'Jul', score1: 90, score2: 22 }
  ];

  // Sample data for the pie chart
  const pieData = [
    { name: 'Internal medicine', value: 35, color: '#38bdf8' },
    { name: 'Surgery', value: 25, color: '#ec4899' },
    { name: 'Pediatrics', value: 20, color: '#fb7185' },
    { name: 'Emergency medicine', value: 15, color: '#f97316' },
    { name: 'Others', value: 5, color: '#a855f7' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Type a command or search..."
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <Bell className="w-6 h-6 text-gray-400 cursor-pointer" />
      </div>

      {/* Title Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Performance Analytics</h1>
        <p className="text-gray-600">Track your learning journey and achievements</p>
      </div>

      {/* Report Type Selector */}
      <div className="flex gap-2 mb-8">
        <span className="text-gray-700 font-medium mr-4">Report Type:</span>
        {['Weekly', 'Monthly', 'Yearly'].map((type) => (
          <button
            key={type}
            onClick={() => setReportType(type)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              reportType === type
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Current Level */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 font-medium">Current Level</span>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">1</div>
          <div className="text-sm text-gray-500 mb-3">1000 XP to level 2</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{width: '50%'}}></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">50%</div>
        </div>

        {/* Average Score */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 font-medium">Average Score</span>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">0%</div>
          <div className="text-sm text-gray-500">0/0 correct</div>
        </div>

        {/* Study Streaks */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 font-medium">Study streaks</span>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">0</div>
          <div className="text-sm text-gray-500">consecutive days</div>
        </div>

        {/* Study Time */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 font-medium">Study Time</span>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-blue-500 mb-2">12.5h</div>
          <div className="text-sm text-gray-500">This week</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Progress Report */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Report</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <YAxis 
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score1" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score2" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium text-blue-900">Thursday</div>
            <div className="text-xs text-blue-700">Average Score (%): 75</div>
            <div className="text-xs text-blue-700">Question Answered: 18</div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}   // 🔥 bigger pie
              paddingAngle={2}
              dataKey="value"
              labelLine={false}   // no extra lines
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`} // inside %
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

  </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievement Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Achievement</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Step Achievement */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">First Step</div>
                  <div className="text-sm text-gray-600">Completed Your first practice session</div>
                </div>
              </div>
              <span className="text-blue-500 font-medium">+200XP</span>
            </div>
            <div className="text-right text-sm text-gray-500">
              Earned on Aug. 13, 2025
            </div>
          </div>

          {/* Perfect Score Achievement */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Perfect Score</div>
                  <div className="text-sm text-gray-600">Scored 100% on a Practice test</div>
                </div>
              </div>
              <span className="text-blue-500 font-medium">+200XP</span>
            </div>
            <div className="text-right text-sm text-gray-500">
              Earned on Aug. 13, 2025
            </div>
          </div>

          {/* Study Streak Achievement */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Study Streak</div>
                  <div className="text-sm text-gray-600">Completed Your first practice session</div>
                </div>
              </div>
              <span className="text-gray-400 font-medium">+200XP</span>
            </div>
            <div className="text-sm text-gray-500 mb-2">In progress</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gray-400 h-2 rounded-full" style={{width: '50%'}}></div>
            </div>
            <div className="text-right text-xs text-gray-500 mt-1">5/10</div>
          </div>

          {/* Question Master Achievement */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Question Master</div>
                  <div className="text-sm text-gray-600">Answer 500 questions correctly</div>
                </div>
              </div>
              <span className="text-gray-400 font-medium">+200XP</span>
            </div>
            <div className="text-sm text-gray-500 mb-2">In progress</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gray-400 h-2 rounded-full" style={{width: '50%'}}></div>
            </div>
            <div className="text-right text-xs text-gray-500 mt-1">250/500</div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activities</h2>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-900 mb-1">Completed NCLEX Practice Test</div>
              <div className="text-sm text-gray-500">2 hours ago</div>
            </div>
            <div className="text-blue-500 font-semibold">+ 65%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;