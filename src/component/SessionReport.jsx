import React, { useState, useEffect } from "react"
import SessionReview from "../component/SessionReview";


export default function SessionReport({ sessionId }) {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showReview, setShowReview] = useState(false);


  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  const router = useRouter()

  const handleReturnToDashboard = () => {
    router.push('/dashboard') // your dashboard route
  }


  useEffect(() => {
    if (!sessionId) {
      setError("No session ID provided")
      setLoading(false)
      return
    }

    fetchSessionReport()
  }, [sessionId])

  

  const fetchSessionReport = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(
        `https://elab-server-xg5r.onrender.com/cat-questions/sessions/${sessionId}/report`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await res.json()
      console.log("Session Report:", data)

      if (!res.ok) {
        throw new Error(data.detail || `Failed to fetch report (${res.status})`)
      }

      setReport(data)
    } catch (err) {
      console.error("Report fetch error:", err)
      setError(String(err.message || err))
    } finally {
      setLoading(false)
    }
  }

  if (showReview) {
  return <SessionReview sessionId={sessionId} />;
}

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "N/A"
    const start = new Date(startDate)
    const end = new Date(endDate)
    const durationMs = end - start
    const minutes = Math.floor(durationMs / 1000 / 60)
    const seconds = Math.floor((durationMs / 1000) % 60)
    return `${minutes}m ${seconds}s`
  }

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-blue-600"
    if (percentage >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBgColor = (percentage) => {
    if (percentage >= 80) return "bg-green-50"
    if (percentage >= 60) return "bg-blue-50"
    if (percentage >= 40) return "bg-yellow-50"
    return "bg-red-50"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Report</h2>
          <p className="text-gray-600">Please wait while we fetch your results...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Report</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={fetchSessionReport}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            {onReturnToDashboard && (
              <button
                onClick={onReturnToDashboard}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Return to Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <p className="text-gray-600">No report data available</p>
        </div>
      </div>
    )
  }

  const duration = calculateDuration(report.started_at, report.completed_at)
  const scoreColor = getScoreColor(report.score_percentage)
  const scoreBgColor = getScoreBgColor(report.score_percentage)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center">
          <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Assessment Completed!</h1>
          <p className="text-blue-100">Congratulations on finishing your test</p>
        </div>

        {/* Score Overview */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className={`${scoreBgColor} p-6 rounded-xl text-center transform transition-transform hover:scale-105`}>
              <p className="text-sm text-gray-600 mb-2 font-medium">Your Score</p>
              <p className={`text-5xl font-bold ${scoreColor}`}>{report.score_percentage}%</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl text-center transform transition-transform hover:scale-105">
              <p className="text-sm text-gray-600 mb-2 font-medium">Correct Answers</p>
              <p className="text-5xl font-bold text-green-600">{report.correct}</p>
              <p className="text-sm text-gray-500 mt-1">out of {report.total_questions}</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl text-center transform transition-transform hover:scale-105">
              <p className="text-sm text-gray-600 mb-2 font-medium">Completion Rate</p>
              <p className="text-5xl font-bold text-purple-600">
                {Math.round((report.answered / report.total_questions) * 100)}%
              </p>
            </div>
          </div>

          {/* Detailed Statistics */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Detailed Statistics
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">Total Questions</span>
                <span className="text-gray-900 font-bold text-lg">{report.total_questions}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">Questions Answered</span>
                <span className="text-gray-900 font-bold text-lg">{report.answered}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">Incorrect Answers</span>
                <span className="text-gray-900 font-bold text-lg">{report.answered - report.correct}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">Duration</span>
                <span className="text-gray-900 font-bold text-lg">{duration}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">Ability Estimate</span>
                <span className="text-gray-900 font-bold text-lg">{report.current_ability_estimate.toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">Standard Error</span>
                <span className="text-gray-900 font-bold text-lg">{report.standard_error.toFixed(3)}</span>
              </div>
            </div>
          </div>

          {/* Session Information */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Session Information
            </h2>
            <div className="space-y-3">
             
              <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">Started At</span>
                <span className="text-gray-900 font-medium">{formatDate(report.started_at)}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">Completed At</span>
                <span className="text-gray-900 font-medium">{formatDate(report.completed_at)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {handleReturnToDashboard && (
              <button
                onClick={handleReturnToDashboard}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 font-semibold shadow-lg"
              >
                Return to Dashboard
              </button>
            )}
            <button     className="px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 font-semibold shadow-lg"
          onClick={() => setShowReview(true)}>
              View Detailed Review
            </button>
            <button
              onClick={() => window.print()}
              className="px-6 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
            >
              Print Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}