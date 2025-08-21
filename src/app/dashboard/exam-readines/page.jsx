'use client';
import React, { useState, useEffect } from 'react';
import { Search, Clock, Hand, TrendingUp, Bell } from 'lucide-react';

const ExamReadinessDashboard = () => {
  const [readinessScore, setReadinessScore] = useState(50);
  const [confidenceLevel, setConfidenceLevel] = useState(50);
  const [currentProgress, setCurrentProgress] = useState(82);

  // Simulate progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProgress(prev => {
        const variation = Math.random() * 2 - 1; // -1 to 1
        return Math.max(80, Math.min(85, prev + variation));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const CircularProgress = ({ percentage, size = 120, strokeWidth = 8 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#3b82f6"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-bold text-gray-800">{percentage}%</span>
          <span className="text-sm text-gray-500">Ready</span>
        </div>
      </div>
    );
  };

  const ProgressBar = ({ percentage, className = "" }) => (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div
        className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Type a command or search..."
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" />
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{}</h1>
            <h2 className="text-4xl font-bold text-gray-900">Exam Readiness</h2>
          </div>

          {/* Top Row - Study Time and Confidence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Study Time Card */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">2-3 Weeks</h3>
                  <p className="text-gray-600">Study Time Needed</p>
                </div>
              </div>
            </div>

            {/* Confidence Level Card */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Hand className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-gray-600">Confidence Level</p>
                </div>
                <span className="text-xl font-bold text-gray-800">{confidenceLevel}%</span>
              </div>
              <ProgressBar percentage={confidenceLevel} />
            </div>
          </div>

          {/* Middle Row - Exam Readiness and Recent Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Exam Readiness Card */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Exam Readiness</h3>
              <div className="flex flex-col items-center space-y-4">
                <CircularProgress percentage={readinessScore} />
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-800">Pass Probability: High</p>
                </div>
              </div>
            </div>

            {/* Recent Progress Card */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Progress</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Now</span>
                  <span className="font-semibold text-gray-800">{Math.round(currentProgress)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">In 1 week</span>
                  <span className="font-semibold text-gray-800">82%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">In 2 weeks</span>
                  <span className="font-semibold text-gray-800">82%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row - Readiness Projection */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Readiness Projection</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <div>
                  <p className="text-2xl font-bold text-gray-800">82%</p>
                  <p className="text-sm text-gray-500">Last week</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">87%</p>
                  <p className="text-sm text-gray-500">This week</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <TrendingUp className="w-5 h-5" />
                <span className="text-xl font-bold">+5%</span>
                <span className="text-sm">Improvement</span>
              </div>
            </div>

            {/* Progress visualization */}
            <div className="mt-6 relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Progress Timeline</span>
                <span className="text-sm font-medium text-gray-700">Week-over-week improvement</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-1000 ease-out relative"
                  style={{ width: '87%' }}
                >
                  <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-r from-transparent to-green-400 rounded-r-full animate-pulse"></div>
                </div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Elements */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => setReadinessScore(Math.min(100, readinessScore + 10))}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Study Session +
          </button>
          <button
            onClick={() => setConfidenceLevel(Math.min(100, confidenceLevel + 5))}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Practice Test +
          </button>
          <button
            onClick={() => {
              setReadinessScore(50);
              setConfidenceLevel(50);
            }}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamReadinessDashboard;