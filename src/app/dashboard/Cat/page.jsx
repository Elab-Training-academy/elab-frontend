"use client";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import StepNextQuestion from "../../../component/StepNextQuestion";

const CATPage = () => {
  const url = useAuthStore((state) => state.url);
  const [token, setToken] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dailyLimitReached, setDailyLimitReached] = useState(false);

  useEffect(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(t);
  }, []);

  useEffect(() => {
    if (!token) return;
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${url}/orders/ordered-courses`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(`Failed to fetch courses: ${res.status}`);
        const data = await res.json();
        setCourses(Array.isArray(data) ? data : data.courses || []);
      } catch (err) {
        console.error(err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [url, token]);

  useEffect(() => {
    if (!token) return;
    const fetchSessions = async () => {
      try {
        const res = await fetch(
          "https://elab-server-xg5r.onrender.com/cat-questions/users/sessions/",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error(`Failed to fetch sessions: ${res.status}`);
        const data = await res.json();
        setSessions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setSessions([]);
      }
    };
    fetchSessions();
  }, [token]);

  const getCourseTitle = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : "Unknown Course";
  };

  const startSession = async () => {
    if (!selectedCourse) return;
    setLoading(true);
    setError(null);
    setDailyLimitReached(false);
    try {
      const res = await fetch(
        `https://elab-server-xg5r.onrender.com/cat-questions/sessions/start/?course_id=${selectedCourse}&time_limit=20`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 400 && data.detail && data.detail.includes("already completed a session today")) {
          setDailyLimitReached(true);
          setError(null);
        } else {
          throw new Error(data.detail || `Error starting session: ${res.status}`);
        }
      } else {
        setSessionId(data.session_id);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white shadow-lg rounded-xl p-6 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setSelectedCourse(null);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!selectedCourse) {
    const catCourses = courses.filter(course => course.has_cat === true);
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Computer Adaptive Test</h1>
            <p className="text-gray-600">Select a course to begin your assessment</p>
          </div>
          {catCourses.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p>No CAT-enabled courses available.</p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Choose Your Course</label>
              <select
                className="w-full border-2 border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={e => setSelectedCourse(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>-- Select a course --</option>
                {catCourses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
              {selectedCourse && (
                <button
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                >
                  Continue
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          {dailyLimitReached && (
            <div className="mb-6 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-6 shadow-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Daily Session Limit Reached</h3>
                  <p className="text-gray-700 mb-3">You have completed a session today. Return tomorrow.</p>
                </div>
              </div>
            </div>
          )}
          <div className="bg-white shadow-lg rounded-xl p-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Computer Adaptive Test</h1>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Sessions</h2>
              {sessions.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p>No sessions yet. Start below.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.map(s => (
                    <div key={s.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{getCourseTitle(s.course_id)}</h3>
                        </div>
                        {!s.completed && (
                          <button
                            className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                            onClick={() => setSessionId(s.id)}
                          >
                            Continue
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="text-center pt-6 border-t border-gray-200">
              <button
                onClick={startSession}
                disabled={dailyLimitReached}
                className={`px-10 py-4 rounded-xl font-semibold ${dailyLimitReached ? "bg-gray-300" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
              >
                {dailyLimitReached ? "Session Limit Reached" : "Start New CAT Session"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <StepNextQuestion sessionId={sessionId} onEndSession={() => setSessionId(null)} />;
};

export default CATPage;
