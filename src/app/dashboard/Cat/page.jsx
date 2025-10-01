"use client"
import React, { useEffect, useState } from "react"
import StepNextQuestion from "../../../component/StepNextQuestion"

const Page = () => {
  const [sessionId, setSessionId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // check if user has active session
  const fetchUserSession = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      const response = await fetch(
        "https://elab-server-xg5r.onrender.com/cat-questions/users/sessions/",
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      if (!response.ok) throw new Error(`Error: ${response.status}`)

      const data = await response.json()

      if (data.length > 0 && data[0].status === "active") {
        setSessionId(data[0].id) // continue session
      } else {
        setSessionId(null) // no active session
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // start new session
  const startSession = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      const response = await fetch(
        "https://elab-server-xg5r.onrender.com/cat-questions/sessions/start/?course_id=f3976244-fa4a-48ae-abb9-69e46252f32b&time_limit=20",
        {
          method: "GET", // backend expects GET, not POST
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      if (!response.ok) throw new Error(`Error: ${response.status}`)

      const data = await response.json()
      setSessionId(data.session_id)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserSession()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading session...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        <p>{error}</p>
      </div>
    )
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Computer Adaptive Test (CAT)
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-4 bg-blue-50 rounded-lg text-center shadow">
              <h2 className="text-lg font-semibold text-gray-700">CAT Ready Questions</h2>
              <p className="text-2xl font-bold text-blue-600 mt-2">1</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center shadow">
              <h2 className="text-lg font-semibold text-gray-700">Test Completed</h2>
              <p className="text-2xl font-bold text-green-600 mt-2">03</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg text-center shadow">
              <h2 className="text-lg font-semibold text-gray-700">Average Accuracy</h2>
              <p className="text-2xl font-bold text-purple-600 mt-2">0%</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 shadow mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">How it works:</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Real-time ability tracking</li>
              <li>Immediate performance feedback</li>
              <li>Personalized learning experience</li>
            </ul>
          </div>

          <div className="text-center">
            <button
              onClick={startSession}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium"
            >
              Start New CAT Session
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <StepNextQuestion
      sessionId={sessionId}
      totalQuestions={10}
      timeLimit={30}
      onEndSession={() => setSessionId(null)}
    />
  )
}

export default Page
