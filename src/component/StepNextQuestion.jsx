"use client"
import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import SessionReport from "../component/SessionReport"

export default function StepNextQuestion({ sessionId, timeLimit = 300, onEndSession }) {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [sessionCompleted, setSessionCompleted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [fetching, setFetching] = useState(false)
  const [draggedItem, setDraggedItem] = useState(null)
  const [showEndModal, setShowEndModal] = useState(false)

  const router = useRouter()
  const timerRef = useRef(null)
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const extractQuestion = (data) => {
    if (!data) return null
    if (data.next_question) return data.next_question
    if (data.question) return data.question
    return null
  }

  const fetchNextQuestion = async () => {
    if (!sessionId || fetching || sessionCompleted) return
    try {
      setFetching(true)
      setError(null)
      const res = await fetch(
        `https://elab-server-xg5r.onrender.com/cat-questions/sessions/${sessionId}/next`,
        {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        }
      )
      const data = await res.json()
      console.log("fetchNextQuestion:", data)
      if (!res.ok) throw new Error(data.detail || `Error ${res.status}`)

      if (data.completed === true) {
        setSessionCompleted(true)
        setLoading(false)
        return
      }

      const nextQ = extractQuestion(data)
      if (!nextQ) {
        setLoading(false)
        return
      }

      setQuestions(prev => (prev.some(q => q.id === nextQ.id) ? prev : [...prev, nextQ]))

      setSelectedAnswers(prev => {
        if (prev[nextQ.id] !== undefined) return prev
        
        let initial
        switch (nextQ.question_type) {
          case "multiple_choice":
          case "true_false":
            initial = []
            break
          case "multi_select":
          case "multiple_select":
            initial = []
            break
          case "fill_in_the_blank":
            initial = ""
            break
          case "arrange_order":
            initial = { available: Array.isArray(nextQ.options) ? nextQ.options.slice() : [], selected: [] }
            break
          default:
            initial = ""
        }
        return { ...prev, [nextQ.id]: initial }
      })

      setLoading(false)
    } catch (err) {
      console.error(err)
      setError(String(err.message || err))
      setLoading(false)
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    if (sessionId) fetchNextQuestion()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  useEffect(() => {
    if (!sessionId || questions.length === 0 || sessionCompleted) return
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, questions.length, sessionCompleted])

  const handleAnswerSelect = (value, questionId) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: value }))
    setError(null)
  }

  const handleDragStart = (e, item, source) => {
    setDraggedItem({ item, source })
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, target, targetIndex, questionId) => {
    e.preventDefault()
    if (!draggedItem) return
    
    const currentAnswer = selectedAnswers[questionId]
    if (!currentAnswer || !currentAnswer.available || !currentAnswer.selected) return
    
    const newAvailable = [...currentAnswer.available]
    const newSelected = [...currentAnswer.selected]
    
    if (draggedItem.source === 'available' && target === 'selected') {
      const index = newAvailable.findIndex(i => 
        (typeof i === 'object' ? i.id : i) === (typeof draggedItem.item === 'object' ? draggedItem.item.id : draggedItem.item)
      )
      if (index > -1) {
        const [moved] = newAvailable.splice(index, 1)
        newSelected.splice(targetIndex !== undefined ? targetIndex : newSelected.length, 0, moved)
      }
    }
    else if (draggedItem.source === 'selected' && target === 'available') {
      const index = newSelected.findIndex(i => 
        (typeof i === 'object' ? i.id : i) === (typeof draggedItem.item === 'object' ? draggedItem.item.id : draggedItem.item)
      )
      if (index > -1) {
        const [moved] = newSelected.splice(index, 1)
        newAvailable.push(moved)
      }
    }
    else if (draggedItem.source === 'selected' && target === 'selected') {
      const sourceIndex = newSelected.findIndex(i => 
        (typeof i === 'object' ? i.id : i) === (typeof draggedItem.item === 'object' ? draggedItem.item.id : draggedItem.item)
      )
      if (sourceIndex > -1 && targetIndex !== undefined && sourceIndex !== targetIndex) {
        const [moved] = newSelected.splice(sourceIndex, 1)
        newSelected.splice(targetIndex, 0, moved)
      }
    }
    
    handleAnswerSelect({ available: newAvailable, selected: newSelected }, questionId)
    setDraggedItem(null)
  }

  const hasValidAnswer = () => {
    const q = questions[currentIndex]
    if (!q) return false
    const ans = selectedAnswers[q.id]
    
    if (ans === undefined || ans === null) return false
    
    switch (q.question_type) {
      case "multiple_choice":
      case "true_false":
        return Array.isArray(ans) && ans.length === 1
      case "multi_select":
      case "multiple_select":
        return Array.isArray(ans) && ans.length > 0
      case "fill_in_the_blank":
        return typeof ans === "string" && ans.trim().length > 0
      case "arrange_order":
        return ans && Array.isArray(ans.selected) && ans.selected.length > 0
      default:
        return false
    }
  }

  const handleSubmitAnswer = async () => {
    const q = questions[currentIndex]
    if (!q) {
      setError("No question available")
      return
    }
    
    const ans = selectedAnswers[q.id]
    
    if (q.question_type === "fill_in_the_blank" && (ans === undefined || ans === null)) {
      setError("Please provide an answer for the fill in the blank question")
      return
    }
    
    if (!hasValidAnswer()) {
      setError("Provide a valid answer")
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      let payload = { question_id: q.id }

      if (q.question_type === "multiple_choice" || q.question_type === "true_false") {
        payload.selected_option_ids = Array.isArray(ans) ? ans : [ans]
      } else if (q.question_type === "multi_select" || q.question_type === "multiple_select") {
        payload.selected_option_ids = Array.isArray(ans) ? ans : []
        payload.text_response = null
      } else if (q.question_type === "fill_in_the_blank") {
        payload = {
          question_id: q.id,
          text_response: typeof ans === "string" ? ans.trim() : String(ans || ""),
          selected_option_ids: [],
        }
      } else if (q.question_type === "arrange_order") {
        payload.selected_option_ids = ans && Array.isArray(ans.selected)
          ? ans.selected.map(i => {
              if (i && typeof i === "object") return i.id
              return i
            }).filter(id => id != null)
          : []
      }

      console.log("submit payload:", payload, "for question type:", q.question_type)

      const res = await fetch(
        `https://elab-server-xg5r.onrender.com/cat-questions/sessions/${sessionId}/responses`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        }
      )

      const data = await res.json()
      console.log("submit response:", data)

      if (!res.ok) {
        throw new Error(data.detail || `Submit failed ${res.status}`)
      }

      const nextQ = extractQuestion(data)
      if (nextQ) {
        setQuestions(prev => (prev.some(p => p.id === nextQ.id) ? prev : [...prev, nextQ]))
        setSelectedAnswers(prev => {
          if (prev[nextQ.id] !== undefined) return prev
          let initial
          switch (nextQ.question_type) {
            case "multiple_choice":
            case "true_false":
              initial = []
              break
            case "multi_select":
            case "multiple_select":
              initial = []
              break
            case "fill_in_the_blank":
              initial = ""
              break
            case "arrange_order":
              initial = { available: Array.isArray(nextQ.options) ? nextQ.options.slice() : [], selected: [] }
              break
            default:
              initial = ""
          }
          return { ...prev, [nextQ.id]: initial }
        })
        setCurrentIndex(prev => Math.min(prev + 1, questions.length))
      } else if (data.completed === true) {
        setSessionCompleted(true)
      } else {
        await fetchNextQuestion()
        setCurrentIndex(prev => Math.min(prev + 1, questions.length))
      }
    } catch (err) {
      console.error(err)
      setError(String(err.message || err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitAll = async () => {
    try {
      setSubmitting(true)
      if (timerRef.current) clearInterval(timerRef.current)
      const res = await fetch(
        `https://elab-server-xg5r.onrender.com/cat-questions/sessions/${sessionId}/end`,
        { method: "GET", headers: { Authorization: `Bearer ${token}` } }
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.detail || `End session failed ${res.status}`)
      }
      setShowEndModal(false)
      setSessionCompleted(true)
    } catch (err) {
      setError(String(err.message || err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleFinishAndExit = () => {
    if (onEndSession) {
      onEndSession(selectedAnswers)
    } else {
      router.push("/Cat")
    }
  }

  const handleEndSession = () => {
    setShowEndModal(true)
  }

  const renderQuestion = (q) => {
    if (!q) return <p>No question data</p>
    
    const ans = selectedAnswers[q.id] !== undefined 
      ? selectedAnswers[q.id] 
      : (q.question_type === "fill_in_the_blank" ? "" : [])
    
    const safeOptions = Array.isArray(q.options) ? q.options : []

    if (q.question_type === "multiple_choice" || q.question_type === "true_false") {
      return safeOptions.map(opt => (
        <label key={opt.id} className={`flex items-center p-3 border rounded cursor-pointer ${Array.isArray(ans) && ans.includes(opt.id) ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}>
          <input 
            type="radio" 
            checked={Array.isArray(ans) && ans.includes(opt.id)} 
            onChange={() => handleAnswerSelect([opt.id], q.id)} 
            className="mr-3" 
          />
          <span>{opt.option_text || "No option text"}</span>
        </label>
      ))
    }
    
    if (q.question_type === "multi_select" || q.question_type === "multiple_select") {
      return safeOptions.map(opt => {
        const checked = Array.isArray(ans) && ans.includes(opt.id)
        return (
          <label key={opt.id} className={`flex items-center p-3 border rounded cursor-pointer ${checked ? "border-green-500 bg-green-50" : "border-gray-200"}`}>
            <input 
              type="checkbox" 
              checked={checked} 
              onChange={e => {
                const prev = Array.isArray(ans) ? [...ans] : []
                if (e.target.checked) {
                  prev.push(opt.id)
                } else {
                  const idx = prev.indexOf(opt.id)
                  if (idx > -1) prev.splice(idx, 1)
                }
                handleAnswerSelect(prev, q.id)
              }} 
              className="mr-3" 
            />
            <span>{opt.option_text || "No option text"}</span>
          </label>
        )
      })
    }
    
    if (q.question_type === "fill_in_the_blank") {
      return (
        <textarea 
          value={typeof ans === "string" ? ans : String(ans || "")} 
          onChange={e => handleAnswerSelect(e.target.value, q.id)} 
          className="w-full p-3 border rounded" 
          placeholder="Type your answer" 
          rows={4}
        />
      )
    }
    
    if (q.question_type === "arrange_order") {
      const dragData = ans && ans.available && ans.selected 
        ? ans 
        : { available: Array.isArray(q.options) ? q.options : [], selected: [] }
      
      if (dragData.available.length === 0 && dragData.selected.length === 0) {
        return <p>No items to arrange</p>
      }

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold mb-3 text-gray-700">Available Options</h3>
            <div 
              className="min-h-[200px] space-y-2 p-2 rounded"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'available', null, q.id)}
            >
              {dragData.available.map((item, i) => {
                if (!item) return null
                const id = typeof item === "object" ? item.id : item
                const text = (item && (item.option_text || item.optionText)) || String(item || "Unknown item")
                return (
                  <div 
                    key={`avail-${id}-${i}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item, 'available')}
                    className="flex items-center p-3 bg-white border-2 border-gray-300 rounded shadow-sm cursor-move hover:border-blue-400 transition-all"
                  >
                    <div className="flex items-center justify-center w-6 h-6 mr-3 text-gray-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </div>
                    <span className="flex-1">{text}</span>
                  </div>
                )
              })}
              {dragData.available.length === 0 && (
                <div className="text-center text-gray-400 py-8 border-2 border-dashed border-gray-300 rounded">
                  Drag items here to remove them from answer
                </div>
              )}
            </div>
          </div>

          <div className="border-2 border-blue-400 rounded-lg p-4 bg-blue-50">
            <h3 className="font-semibold mb-3 text-blue-700">Your Answer (Drag items here)</h3>
            <div 
              className="min-h-[200px] space-y-2 p-2 rounded"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'selected', dragData.selected.length, q.id)}
            >
              {dragData.selected.map((item, i) => {
                if (!item) return null
                const id = typeof item === "object" ? item.id : item
                const text = (item && (item.option_text || item.optionText)) || String(item || "Unknown item")
                return (
                  <div 
                    key={`sel-${id}-${i}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item, 'selected')}
                    onDragOver={handleDragOver}
                    onDrop={(e) => {
                      e.stopPropagation()
                      handleDrop(e, 'selected', i, q.id)
                    }}
                    className="flex items-center p-3 bg-white border-2 border-blue-400 rounded shadow cursor-move hover:border-blue-600 transition-all"
                  >
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 font-semibold">
                      {i + 1}
                    </div>
                    <span className="flex-1">{text}</span>
                    <div className="flex items-center justify-center w-6 h-6 ml-3 text-gray-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </div>
                  </div>
                )
              })}
              {dragData.selected.length === 0 && (
                <div className="text-center text-blue-400 py-8 border-2 border-dashed border-blue-300 rounded">
                  <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  Drop items here in the correct order
                </div>
              )}
            </div>
          </div>
        </div>
      )
    }
    
    return <p>Unsupported question type: {q.question_type}</p>
  }

  if (loading && questions.length === 0) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>
  if (error) return <div className="min-h-screen flex items-center justify-center"><p className="text-red-600">{error}</p></div>
  
  // Show SessionReport component when session is completed
  if (sessionCompleted) {
    return <SessionReport sessionId={sessionId} onReturnToDashboard={handleFinishAndExit} />
  }

  const currentQuestion = questions[currentIndex]

  if (!currentQuestion) {
    return <div className="min-h-screen flex items-center justify-center"><p>No question available</p></div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <button onClick={handleEndSession} className="px-3 py-1 bg-red-500 text-white border rounded hover:bg-red-600">End Session</button>
          <div>Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}</div>
          <div>Progress: {questions.length === 0 ? 0 : currentIndex + 1}/{questions.length}</div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Question {currentIndex + 1}</h2>
          <div className="mb-4" dangerouslySetInnerHTML={{ __html: currentQuestion.question_text || "No question text" }} />
          <div className="space-y-3">
            {renderQuestion(currentQuestion)}
          </div>

          <div className="flex justify-between mt-6">
            <button onClick={() => setCurrentIndex(p => Math.max(p - 1, 0))} disabled={currentIndex === 0} className="px-3 py-1 border rounded disabled:opacity-50">Previous</button>
            <button onClick={handleSubmitAnswer} disabled={!hasValidAnswer() || submitting} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
              {submitting ? "Saving..." : "Save Answer"}
            </button>
            <button disabled={true} className="px-3 py-1 border rounded opacity-50 cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>

      {/* End Session Modal */}
      {showEndModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">End Session</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to end this session? All your progress will be saved and you'll be able to view your results.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowEndModal(false)}
                disabled={submitting}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitAll}
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Ending...
                  </>
                ) : (
                  'Yes, End Session'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}