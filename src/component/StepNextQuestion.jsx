"use client"
import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

const StepNextQuestion = ({ sessionId, timeLimit = 300, onEndSession }) => {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [sessionCompleted, setSessionCompleted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(timeLimit)

  const router = useRouter()
  const timerRef = useRef(null)

  // Fetch first question when sessionId is available
  useEffect(() => {
    if (sessionId) fetchNextQuestion()
  }, [sessionId])

  // Timer - runs once and decreases every second
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          handleSubmitAll()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [])

  // Fetch next question
  const fetchNextQuestion = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const response = await fetch(
        `https://elab-server-xg5r.onrender.com/cat-questions/sessions/${sessionId}/next`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()

      if (data.completed) {
        setSessionCompleted(true)
      } else {
        setQuestions(prev => {
          if (!prev.find(q => q.id === data.question.id)) {
            return [...prev, data.question]
          }
          return prev
        })
        setCurrentIndex(prev => questions.length) // move to the new one
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Select answer (store option_id instead of text)
  const handleAnswerSelect = (option) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: { 
        questionId: questions[currentIndex]?.id, 
        optionId: option.id 
      }
    }))
  }

  // Submit current answer
  const handleSubmitAnswer = async () => {
    const currentAnswer = selectedAnswers[currentIndex]
    if (!currentAnswer?.optionId) {
      alert("Please select an answer before submitting.")
      return
    }

    try {
      setSubmitting(true)
      const token = localStorage.getItem("token")
      const res = await fetch(
        `https://elab-server-xg5r.onrender.com/cat-questions/sessions/${sessionId}/responses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            question_id: currentAnswer.questionId,
            selected_option_ids: [currentAnswer.optionId],
          }),
        }
      )
      if (!res.ok) throw new Error(`Submit failed: ${res.status}`)
      const result = await res.json()
      console.log("Submit success:", result)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Next question
  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      await handleSubmitAnswer()
      await fetchNextQuestion()
    }
  }

  // Previous question
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  // Submit all answers
  const handleSubmitAll = () => {
    clearInterval(timerRef.current)
    if (onEndSession) onEndSession(selectedAnswers)
    else router.push("/cat-test")
  }

  // End session manually
  const handleEndSession = () => {
    clearInterval(timerRef.current)
    if (onEndSession) onEndSession(selectedAnswers)
    else router.push("/cat-test")
  }

  // UI states
  if (loading && questions.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading question...</p>
      </div>
    )

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        <p>{error}</p>
      </div>
    )

  if (sessionCompleted)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-6 bg-white shadow rounded text-center">
          <h2>Session Completed</h2>
          <p>You answered {Object.keys(selectedAnswers).length} questions.</p>
          <button
            onClick={handleSubmitAll}
            className="bg-green-600 text-white px-6 py-3 rounded mt-2"
          >
            Submit All Answers
          </button>
        </div>
      </div>
    )

  const currentQuestion = questions[currentIndex]

  return (
    <div className="min-h-screen p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handleEndSession}>← End Session</button>
        <div>Time Left: {timeLeft}s</div>
      </div>

      {currentQuestion && (
        <div className="bg-white shadow rounded p-6 max-w-3xl mx-auto">
          <h2 className="font-semibold text-lg mb-2">
            Question {currentIndex + 1}
          </h2>
          <p className="mb-4">{currentQuestion.question_text}</p>

          {currentQuestion.image_url && (
            <img
              src={currentQuestion.image_url}
              alt="Question"
              className="mb-4 w-full rounded"
            />
          )}

          <div className="space-y-2 mb-4">
            {currentQuestion.options
              ?.sort((a, b) => a.option_order - b.option_order)
              .map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center p-3 border rounded cursor-pointer ${
                    selectedAnswers[currentIndex]?.optionId === opt.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name={`answer-${currentIndex}`}
                    value={opt.id}
                    checked={
                      selectedAnswers[currentIndex]?.optionId === opt.id
                    }
                    onChange={() => handleAnswerSelect(opt)}
                    className="mr-2"
                  />
                  {opt.option_text}
                </label>
              ))}
          </div>

          <div className="flex justify-between mb-4">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="bg-gray-300 text-gray-700 px-6 py-3 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              ← Previous
            </button>
            <button
              onClick={handleNext}
              disabled={sessionCompleted}
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
            >
              Next →
            </button>
          </div>

          <button
            onClick={handleSubmitAnswer}
            disabled={submitting}
            className="w-full bg-green-600 text-white py-3 rounded"
          >
            {submitting ? "Submitting..." : "Submit Answer"}
          </button>

          <div className="mt-4 text-center text-sm text-gray-600">
            Answered {Object.keys(selectedAnswers).length} of {questions.length} questions
          </div>
        </div>
      )}
    </div>
  )
}

export default StepNextQuestion
