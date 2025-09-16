"use client"
import React, { useState, useEffect } from 'react';
import { Search, Bell, Trophy, Clock } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { useAuthStore } from '@/store/authStore';

const Dashboard = () => {
  const [reportType, setReportType] = useState('daily');
  const [performance, setPerformance] = useState(null);
  const { url } = useAuthStore();

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch(
          `${url}/progress/user-performance?time_frame=${reportType.toLowerCase()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error('Failed to fetch performance data');

        const data = await res.json();
        setPerformance(data);
      } catch (err) {
        console.error('Error fetching performance:', err);
      }
    };

    fetchPerformance();
  }, [url, reportType]);

  if (!performance) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading performance data...
      </div>
    );
  }

  const progressData =
    performance.progress_report?.map((item) => ({
      date: item.date,
      avg_score: parseFloat(item.avg_score),
    })) || [];

  const pieData =
    performance.subject_breakdown?.map((subj, idx) => ({
      name: subj.subject,
      value: subj.count,
      color: ['#38bdf8', '#ec4899', '#fb7185', '#f97316', '#a855f7'][idx % 5],
    })) || [];

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex md:flex-row items-center justify-between mb-8 gap-4">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Type a command or search..."
            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Bell className="w-6 h-6 text-gray-400 cursor-pointer" />
      </div>

      {/* Title Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Performance Analytics
        </h1>
        <p className="text-gray-600">
          Track your learning journey and achievements
        </p>
      </div>

      {/* Report Type Selector */}
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="text-gray-700 font-medium mr-2">Report Type:</span>
        {['Daily', 'Weekly', 'Monthly'].map((type) => (
          <button
            key={type}
            onClick={() => setReportType(type.toLowerCase())}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              reportType === type.toLowerCase()
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {/* Current Level */}
        <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 font-medium">Current Level</span>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {performance.current_level}
          </div>
          <div className="text-sm text-gray-500 mb-3">
            {performance.xp_to_next_level - performance.xp_progress} XP to next
            level
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{
                width: `${
                  (performance.xp_progress / performance.xp_to_next_level) * 100
                }%`,
              }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {performance.xp_progress}/{performance.xp_to_next_level} XP
          </div>
        </div>

        {/* Average Score */}
        <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 font-medium">Average Score</span>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {performance.average_score}%
          </div>
        </div>

        {/* Study Streaks */}
        <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 font-medium">Study Streak</span>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {performance.study_streak}
          </div>
          <div className="text-sm text-gray-500">consecutive days</div>
        </div>

        {/* Study Time */}
        <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 font-medium">Study Time</span>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-blue-500 mb-2">
            {performance.study_time} hrs
          </div>
          <div className="text-sm text-gray-500">This {reportType}</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
        {/* Progress Report */}
        <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
            Progress Report
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="avg_score"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Breakdown Pie Chart */}
        <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
            Subjects Breakdown
          </h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs text-gray-600 truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="mb-8">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-6">
          Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {performance.achievements?.map((ach, idx) => (
            <div
              key={idx}
              className="bg-white p-4 md:p-6 rounded-xl border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{ach.title}</div>
                  <div className="text-sm text-gray-600">
                    Earned on {new Date(ach.earned_on).toDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div>
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-6">
          Recent Activities
        </h2>
        <div className="space-y-3">
          {performance.recent_activities?.map((act, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between"
            >
              <div>
                <div className="font-semibold text-gray-900 mb-1">
                  {act.question}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(act.answered_at).toLocaleString()}
                </div>
              </div>
              <span className="text-blue-500 font-semibold">✓</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
