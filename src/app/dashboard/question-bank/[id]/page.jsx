"use client"
import React, { useEffect, useRef, useState } from "react"
import { useAuthStore } from "@/store/authStore"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { toast } from "react-toastify"
import ToastWrapper from "@/component/ToastWrapper"

const QuestionPage = ({ params }) => {
  const { id } = React.use(params)
  const url = useAuthStore((state) => state.url)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [timeLeft, setTimeLeft] = useState(20 * 60)
  const [timeUp, setTimeUp] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return setError("No token found")

        const res = await fetch(`${url}/modules/questions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) throw new Error("Failed to fetch questions")
        const data = await res.json()
        setQuestions(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchQuestions()
  }, [id, url])

  // Timer
  useEffect(() => {
    if (loading || timeUp) return
    if (timeLeft <= 0) {
      setTimeUp(true)
      handleSubmit()
      return
    }

    timerRef.current = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
    return () => clearInterval(timerRef.current)
  }, [timeLeft, loading, timeUp])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  // Handle answers for each type
  const handleAnswerChange = (question, value, type) => {
    setAnswers((prev) => {
      const qid = question.id
      if (type === "multiple_choice" || type === "true_false") {
        return { ...prev, [qid]: value }
      }
      if (type === "multiple_select") {
        const current = prev[qid] || []
        return {
          ...prev,
          [qid]: current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value],
        }
      }
      if (type === "fill_in_the_blank") {
        return { ...prev, [qid]: value }
      }
      if (type === "arrange_order") {
        return { ...prev, [qid]: value }
      }
      return prev
    })
  }

  // Handle reorder (for arrange_order)
  const handleDragEnd = (result, question) => {
    if (!result.destination) return
    const items = Array.from(answers[question.id] || question.answer_options)
    const [moved] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, moved)
    handleAnswerChange(question, items, "arrange_order")
  }

  const handleSubmit = async () => {
    clearInterval(timerRef.current)
    setTimeUp(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) return setError("No token found")

      for (const q of questions) {
        const ans = answers[q.id]
        let payload = {
          question_id: q.id,
          selected_answer_ids: [],
          text_answer: null,
          arranged_order: null,
        }

        if (q.answer_type === "multiple_choice" || q.answer_type === "true_false") {
          payload.selected_answer_ids = [ans]
        }

        if (q.answer_type === "multiple_select") {
          payload.selected_answer_ids = ans || []
        }

        if (q.answer_type === "fill_in_the_blank") {
          payload.text_answer = ans || ""
        }

        if (q.answer_type === "arrange_order") {
          payload.arranged_order = ans?.map((item) => item.id) || []
        }

        await fetch(`${url}/answer-options/user/option`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        })
      }

      toast.success("Answers submitted successfully")
    } catch (err) {
      console.error("Error submitting answers", err)
      toast.error("Failed to submit answers")
    }
  }

  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastWrapper />
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Quiz</h1>
          <div className={`font-semibold ${timeLeft < 120 ? "text-red-600" : ""}`}>
            Time Left: {formatTime(timeLeft)}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(i)}
              className={`w-10 h-10 rounded-full flex items-center justify-center border 
              ${currentIndex === i ? "bg-blue-600 text-white" : answers[q.id] ? "bg-green-500 text-white" : "bg-gray-200"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Question */}
        {!loading && currentQuestion && (
          <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <div
                className="font-medium text-gray-800"
                dangerouslySetInnerHTML={{ __html: currentQuestion.question_text }}
              />
              <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                {currentQuestion.answer_type}
              </span>
            </div>

            {/* Render based on type */}
            <div className="space-y-3">
              {/* Single choice */}
              {currentQuestion.answer_type === "multiple_choice" &&
                currentQuestion.answer_options.map((opt) => (
                  <label
                    key={opt.id}
                    className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      checked={answers[currentQuestion.id] === opt.id}
                      onChange={() => handleAnswerChange(currentQuestion, opt.id, "multiple_choice")}
                      disabled={timeUp}
                      className="mr-2"
                    />
                    {opt.option_text}
                  </label>
                ))}

              {/* Multiple select */}
              {currentQuestion.answer_type === "multiple_select" &&
                currentQuestion.answer_options.map((opt) => (
                  <label
                    key={opt.id}
                    className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={answers[currentQuestion.id]?.includes(opt.id)}
                      onChange={() => handleAnswerChange(currentQuestion, opt.id, "multiple_select")}
                      disabled={timeUp}
                      className="mr-2"
                    />
                    {opt.option_text}
                  </label>
                ))}

              {/* True/False */}
              {currentQuestion.answer_type === "true_false" &&
                ["True", "False"].map((val) => (
                  <label
                    key={val}
                    className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      checked={answers[currentQuestion.id] === val}
                      onChange={() => handleAnswerChange(currentQuestion, val, "true_false")}
                      disabled={timeUp}
                      className="mr-2"
                    />
                    {val}
                  </label>
                ))}

              {/* Fill in the blank */}
              {currentQuestion.answer_type === "fill_in_the_blank" && (
                <input
                  type="text"
                  placeholder="Type your answer..."
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) =>
                    handleAnswerChange(currentQuestion, e.target.value, "fill_in_the_blank")
                  }
                  disabled={timeUp}
                  className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              )}

              {/* Arrange order (drag and drop) */}
              {currentQuestion.answer_type === "arrange_order" && (
                <DragDropContext
                  onDragEnd={(result) => handleDragEnd(result, currentQuestion)}
                >
                  <Droppable droppableId="options">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {(answers[currentQuestion.id] || currentQuestion.answer_options).map(
                          (opt, index) => (
                            <Draggable key={opt.id} draggableId={opt.id.toString()} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="p-3 border rounded-lg bg-gray-50 cursor-move"
                                >
                                  {opt.option_text}
                                </div>
                              )}
                            </Draggable>
                          )
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </div>

            {/* Navigation and Submit buttons */}
            <div className="mt-6 flex justify-between items-center">
              <div className="flex gap-2">
                {currentIndex > 0 && (
                  <button
                    onClick={() => setCurrentIndex(currentIndex - 1)}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded hover:bg-gray-300"
                  >
                    Previous
                  </button>
                )}
                {!isLastQuestion && (
                  <button
                    onClick={() => setCurrentIndex(currentIndex + 1)}
                    className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
                  >
                    Next
                  </button>
                )}
              </div>

              {/* Submit button - only on last question */}
              {isLastQuestion && (
                <button
                  onClick={handleSubmit}
                  disabled={timeUp}
                  className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 disabled:bg-gray-400"
                >
                  Submit Answers
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuestionPage