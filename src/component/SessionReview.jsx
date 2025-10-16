"use client"
import React, { useState, useEffect } from "react"

export default function SessionReview({ sessionId, onReturnToDashboard }) {
  const [review, setReview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedQuestions, setExpandedQuestions] = useState(new Set())

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID provided")
      setLoading(false)
      return
    }

    fetchSessionReview()
  }, [sessionId])

  const fetchSessionReview = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(
        `https://elab-server-xg5r.onrender.com/cat-questions/sessions/${sessionId}/review`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await res.json()
      console.log("Session Review:", data)

      if (!res.ok) {
        throw new Error(data.detail || `Failed to fetch review (${res.status})`)
      }

      setReview(data)
      
      // Expand all questions by default
      if (data.questions) {
        const allQuestionIds = new Set(data.questions.map((q, index) => index))
        setExpandedQuestions(allQuestionIds)
      }
    } catch (err) {
      console.error("Review fetch error:", err)
      setError(String(err.message || err))
    } finally {
      setLoading(false)
    }
  }

  const toggleQuestion = (questionIndex) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(questionIndex)) {
        newSet.delete(questionIndex)
      } else {
        newSet.add(questionIndex)
      }
      return newSet
    })
  }

  const toggleAllQuestions = () => {
    if (expandedQuestions.size === review.questions.length) {
      // Collapse all
      setExpandedQuestions(new Set())
    } else {
      // Expand all
      const allQuestionIds = new Set(review.questions.map((_, index) => index))
      setExpandedQuestions(allQuestionIds)
    }
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

  const getOptionStyle = (option) => {
    if (option.is_correct && option.selected) {
      return "bg-green-100 border-green-500 text-green-800" // Correct and selected
    } else if (option.is_correct) {
      return "bg-green-50 border-green-300 text-green-700" // Correct but not selected
    } else if (option.selected && !option.is_correct) {
      return "bg-red-100 border-red-500 text-red-800" // Incorrect and selected
    } else {
      return "bg-gray-50 border-gray-200 text-gray-700" // Not selected and not correct
    }
  }

  const getQuestionStatus = (question) => {
    return question.is_correct ? "correct" : "incorrect"
  }

  const getQuestionStatusColor = (isCorrect) => {
    return isCorrect ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
  }

  const getQuestionStatusIcon = (isCorrect) => {
    return isCorrect ? (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ) : (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Review</h2>
          <p className="text-gray-600">Please wait while we fetch your detailed review...</p>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Review</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={fetchSessionReview}
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

  if (!review) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <p className="text-gray-600">No review data available</p>
        </div>
      </div>
    )
  }

  const correctCount = review.questions.filter(q => q.is_correct).length
  const totalQuestions = review.questions.length
  const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-2xl shadow-2xl text-white text-center mb-8">
          <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Session Review</h1>
          <p className="text-blue-100">Detailed analysis of your answers</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <p className="text-sm text-gray-600 mb-2 font-medium">Total Questions</p>
            <p className="text-3xl font-bold text-blue-600">{totalQuestions}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <p className="text-sm text-gray-600 mb-2 font-medium">Correct Answers</p>
            <p className="text-3xl font-bold text-green-600">{correctCount}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <p className="text-sm text-gray-600 mb-2 font-medium">Incorrect Answers</p>
            <p className="text-3xl font-bold text-red-600">{totalQuestions - correctCount}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <p className="text-sm text-gray-600 mb-2 font-medium">Score</p>
            <p className="text-3xl font-bold text-purple-600">{scorePercentage}%</p>
          </div>
        </div>

        {/* Session Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Session Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600 font-medium">Status:</span>
              <span className={`font-semibold ${review.completed ? 'text-green-600' : 'text-yellow-600'}`}>
                {review.completed ? 'Completed' : 'In Progress'}
              </span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600 font-medium">Started:</span>
              <span className="text-gray-800">{formatDate(review.started_at)}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600 font-medium">Completed:</span>
              <span className="text-gray-800">{formatDate(review.completed_at)}</span>
            </div>
          </div>
        </div>

        {/* Questions Review */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Questions Review</h2>
            <button
              onClick={toggleAllQuestions}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              {expandedQuestions.size === review.questions.length ? 'Collapse All' : 'Expand All'}
            </button>
          </div>

          <div className="space-y-4">
            {review.questions.map((question, index) => (
              <div key={question.question_id} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Question Header */}
                <div 
                  className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => toggleQuestion(index)}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getQuestionStatusColor(question.is_correct)}`}>
                      {getQuestionStatusIcon(question.is_correct)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Question {index + 1} - {question.question_type}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-1">{question.question_text}</p>
                    </div>
                  </div>
                  <svg 
                    className={`w-5 h-5 text-gray-500 transform transition-transform ${expandedQuestions.has(index) ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Question Content */}
                {expandedQuestions.has(index) && (
                  <div className="p-6 space-y-4">
                    {/* Question Text and Media */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Question:</h4>
                      <p className="text-gray-900 mb-3">{question.question_text}</p>
                      
                      {question.image_url && (
                        <div className="mb-3">
                          <img 
                            src={question.image_url} 
                            alt="Question visual" 
                            className="max-w-full h-auto rounded-lg border border-gray-200"
                          />
                        </div>
                      )}
                      
                      {question.audio_url && (
                        <div className="mb-3">
                          <audio controls className="w-full">
                            <source src={question.audio_url} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      )}
                    </div>

                    {/* Options */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Options:</h4>
                      <div className="space-y-2">
                        {question.options.map((option) => (
                          <div
                            key={option.id}
                            className={`p-3 border-2 rounded-lg transition-colors ${getOptionStyle(option)}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{option.option_text}</span>
                              <div className="flex items-center space-x-2">
                                {option.is_correct && (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Correct</span>
                                )}
                                {option.selected && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Your Choice</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Explanation */}
                    {question.explanation && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-800 mb-2">Explanation:</h4>
                        <p className="text-blue-700">{question.explanation}</p>
                      </div>
                    )}

                    {/* Result Summary */}
                    <div className={`p-3 rounded-lg ${question.is_correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                      <p className={`font-medium ${question.is_correct ? 'text-green-800' : 'text-red-800'}`}>
                        {question.is_correct 
                          ? '✓ You answered this question correctly.' 
                          : '✗ You answered this question incorrectly.'
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          {onReturnToDashboard && (
            <button
              onClick={onReturnToDashboard}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 font-semibold shadow-lg"
            >
              Return to Dashboard
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
          >
            Print Review
          </button>
        </div>
      </div>
    </div>
  )
}