"use client"
import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"

const StepSessionReport = () => {
  const { sessionId } = useParams()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(
          `https://elab-server-xg5r.onrender.com/cat-questions/sessions/${sessionId}/report`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (!res.ok) throw new Error(`Failed to fetch report: ${res.status}`)
        const data = await res.json()
        setReport(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (sessionId) fetchReport()
  }, [sessionId])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading report...</div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>
  if (!report) return null

  return (
    <div className="min-h-screen p-6 max-w-xl mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Session Report</h2>
      <p>Total Questions: {report.total_questions}</p>
      <p>Answered: {report.answered}</p>
      <p>Correct: {report.correct}</p>
      <p>Score Percentage: {report.score_percentage}%</p>
      <p>Current Ability Estimate: {report.current_ability_estimate.toFixed(2)}</p>
      <p>Standard Error: {report.standard_error.toFixed(2)}</p>
      <p>Started At: {new Date(report.started_at).toLocaleString()}</p>
      <p>Completed At: {new Date(report.completed_at).toLocaleString()}</p>
      <p>Status: {report.completed ? "Completed" : "In Progress"}</p>
    </div>
  )
}

export default StepSessionReport
