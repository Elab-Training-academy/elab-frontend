'use client';
import React, { useState } from 'react';
import { Search, FileText, RotateCcw, Target, ArrowRight, Bell, ChevronRight } from 'lucide-react';

const NCLEXCourseDashboard = () => {
  const [stats, setStats] = useState({
    catReadyQuestions: 1,
    testsCompleted: 3,
    averageAccuracy: 0
  });

  const [isStartingTest, setIsStartingTest] = useState(false);

  const handleStartTest = () => {
    setIsStartingTest(true);
    setTimeout(() => {
      setStats(prev => ({
        ...prev,
        testsCompleted: prev.testsCompleted + 1,
        averageAccuracy: Math.round(Math.random() * 30 + 70) // 70-100%
      }));
      setIsStartingTest(false);
    }, 2000);
  };

  const StatCard = ({ icon: Icon, value, label, className = "" }) => (
    <div className={`bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
          <p className="text-gray-600 text-sm">{label}</p>
        </div>
      </div>
    </div>
  );

  const FeatureCard = ({ title, features, className = "" }) => (
    <div className={`bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-gray-700">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Type a command or search..."
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              />
            </div>
          </div>
          <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <span className="hover:text-blue-600 cursor-pointer">My Courses</span>
          <ChevronRight className="w-4 h-4" />
          <span className="hover:text-blue-600 cursor-pointer">NCLEx</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">NCLEX CAT</span>
        </nav>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">NCLEX Computer Adaptive Testing (CAT)</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            icon={FileText} 
            value={stats.catReadyQuestions} 
            label="CAT Ready Questions" 
          />
          <StatCard 
            icon={RotateCcw} 
            value={`0${stats.testsCompleted}`} 
            label="Test Completed" 
          />
          <StatCard 
            icon={Target} 
            value={`${stats.averageAccuracy}%`} 
            label="Average Accuracy" 
          />
        </div>

        {/* Main Content Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">NCLEX Adaptive Test</h2>
          <p className="text-gray-600 mb-8">Experience realistic National Council Licensure Examination adaptive testing</p>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* How it works */}
            <FeatureCard
              title="How it works:"
              features={[
                "Real-time ability tracking",
                "Adaptive question difficulty adjustment",
                "Personalized learning pathways",
                "Comprehensive performance analytics"
              ]}
            />

            {/* Questions Range */}
            <FeatureCard
              title="75-265 Questions"
              features={[
                "Real-time ability tracking",
                "Adaptive question selection",
                "Performance-based question flow",
                "Immediate feedback and explanations"
              ]}
            />
          </div>

          {/* Start Test Button */}
          <div className="flex justify-start mb-8">
            <button
              onClick={handleStartTest}
              disabled={isStartingTest}
              className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {isStartingTest ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Starting...</span>
                </>
              ) : (
                <>
                  <span>Start Adaptive Testing</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Adaptive Algorithm */}
            <FeatureCard
              title="Adaptive Algorithm"
              features={[
                "Real-time ability tracking",
                "Dynamic difficulty adjustment",
                "Competency-based progression",
                "Statistical analysis integration"
              ]}
            />

            {/* NCLEX Categories */}
            <FeatureCard
              title="NCLEX Categories"
              features={[
                "Safe and Effective Care Environment",
                "Health Promotion and Maintenance", 
                "Psychosocial Integrity",
                "Physiological Integrity"
              ]}
            />
          </div>
        </div>

        {/* Progress Indicator */}
        {isStartingTest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 shadow-2xl max-w-md mx-4">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Initializing CAT Engine</h3>
                <p className="text-gray-600">Preparing your adaptive test experience...</p>
              </div>
            </div>
          </div>
        )}

        {/* Additional Info Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Target className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">About NCLEX-RN CAT</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                The NCLEX-RN uses Computer Adaptive Testing (CAT) to efficiently and accurately assess your nursing knowledge. 
                Our simulation provides the same adaptive experience, adjusting question difficulty based on your responses 
                to determine your competency level across all nursing domains.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
            View Study Plan
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
            Practice Questions
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
            Performance Analytics
          </button>
          <button 
            onClick={() => setStats({catReadyQuestions: 1, testsCompleted: 3, averageAccuracy: 0})}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            Reset Progress
          </button>
        </div>
      </div>
    </div>
  );
};

export default NCLEXCourseDashboard;