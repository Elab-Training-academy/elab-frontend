
'use client';
import React, { useState, useEffect } from 'react';
import { Search, Bell } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

// ✅ Circular Progress Component
const CircularProgress = ({ percentage }) => {
  const safePercent = Math.min(100, Math.max(0, Number(percentage) || 0));
  const radius = 20;
  const strokeWidth = 4;
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (safePercent / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        stroke="#E5E7EB"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#3B82F6"
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.35s' }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="10"
        fontWeight="bold"
        fill="#374151"
      >
        {safePercent}%
      </text>
    </svg>
  );
};

const ExamReadinessDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [readinessData, setReadinessData] = useState({});
  const [loading, setLoading] = useState(true);
  const { url, user, fetchUser } = useAuthStore();

  // ✅ Fetch ordered courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        fetchUser();
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch(`${url}/orders/ordered-courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch courses');
        const data = await res.json();
        const courseList = Array.isArray(data) ? data : data.courses || [];
        setCourses(courseList);
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };
    fetchCourses();
  }, [url, fetchUser, user ]);

  // ✅ Fetch readiness data
  useEffect(() => {
    const fetchAllReadiness = async () => {
      if (courses.length === 0) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const readinessResults = {};
        for (const course of courses) {
          const courseId = course.course_id || course.id;
          try {
            const res = await fetch(
              `${url}/progress/readiness?course_id=${courseId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.ok) {
              const data = await res.json();
              readinessResults[courseId] = data;
            } else {
              readinessResults[courseId] = null;
            }
          } catch {
            readinessResults[courseId] = null;
          }
        }
        setReadinessData(readinessResults);
      } catch (err) {
        console.error('Error fetching readiness:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllReadiness();
  }, [courses, url]);

  const ProgressBar = ({ percentage, className = '' }) => {
    const safePercent = Math.min(100, Math.max(0, Number(percentage) || 0));
    return (
      <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${safePercent}%` }}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading Exam Readiness...</p>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No courses found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* ✅ Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search courses..."
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" />
        </div>

        {/* ✅ One Card for All Courses */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Exam Readiness Overview
          </h2>

          <div className="space-y-6">
            {courses.map((course) => {
              const courseId = course.course_id || course.id;
              const readiness = readinessData[courseId];
              const overall = Math.round(Number(readiness?.overall_score) || 0);

              return (
                <div key={courseId} className="p-4 border rounded-lg bg-gray-50">
                  {/* ✅ Title + Circular Progress */}
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {course.title || course.name || `Course ${courseId}`}
                    </h3>
                    <div className="flex items-center gap-3">
                      <CircularProgress percentage={overall} />
                      <span className="text-sm font-bold text-gray-700">
                        {overall}% Ready
                      </span>
                    </div>
                  </div>

                  {readiness ? (
                    <>
                      <ProgressBar percentage={overall} className="mb-4" />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {readiness.category_breakdown.map((cat) => {
                          const correctAnswers = parseInt(cat.correct_answers ?? 0, 10);
                          const totalQuestions = parseInt(cat.total_questions ?? 0, 10);
                          const accuracy = Math.min(
                            100,
                            Math.max(0, parseFloat(cat.accuracy ?? 0))
                          );

                          return (
                            <div
                              key={cat.category}
                              className="p-3 border rounded-lg bg-white shadow-sm"
                            >
                              <h4 className="font-semibold text-blue-600 capitalize">
                                {cat.category.replace('_', ' ')}
                              </h4>
                              <p className="text-gray-600 text-sm">
                                Total Questions: {totalQuestions}
                              </p>
                              <p className="text-gray-600 text-sm">
                                Correct: {correctAnswers}
                              </p>
                              <p className="text-gray-600 text-sm">
                                Accuracy: {accuracy}%
                              </p>
                              <ProgressBar percentage={accuracy} className="mt-2" />
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500">No readiness data available.</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamReadinessDashboard;
