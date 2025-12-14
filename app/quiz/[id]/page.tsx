'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  topic: string
  explanation?: string
}

interface Quiz {
  id: string
  title: string
  description: string
  topic: string
  difficulty: string
  duration: number
  questions: Question[]
}

export default function QuizAttemptPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const quizId = params.id as string

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [timeSpent, setTimeSpent] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [aiFeedback, setAiFeedback] = useState<string>('')
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(Date.now())

  // Check user role - only students can take quiz
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (session && session.user.role !== 'STUDENT') {
      alert('Only students can take quizzes')
      router.push('/dashboard')
    }
  }, [status, session, router])

  useEffect(() => {
    if (session && session.user.role === 'STUDENT' && quizId) {
      fetchQuiz()
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [session, quizId])

  useEffect(() => {
    if (quiz && !submitted && timeLeft === 0) {
      const durationInSeconds = quiz.duration * 60
      setTimeLeft(durationInSeconds)
      startTimeRef.current = Date.now()
      
      // Start timer
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
        const remaining = durationInSeconds - elapsed
        
        if (remaining <= 0) {
          if (timerRef.current) clearInterval(timerRef.current)
          handleSubmit()
        } else {
          setTimeLeft(remaining)
          setTimeSpent(elapsed)
        }
      }, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [quiz, submitted])

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/quiz?id=${quizId}`)
      if (response.ok) {
        const data = await response.json()
        setQuiz(data)
      } else {
        router.push('/quiz')
      }
    } catch (error) {
      console.error('Error fetching quiz:', error)
      router.push('/quiz')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }))
  }

  const generateAIFeedback = (score: number, weakAreas: string[]) => {
    if (score >= 90) {
      return `🌟 Excellent work! You scored ${score.toFixed(1)}%! You have a strong understanding of ${quiz?.topic}. Keep up the outstanding performance! Consider challenging yourself with harder topics to continue your growth.`
    } else if (score >= 70) {
      return `✅ Good job! You scored ${score.toFixed(1)}%. You have a solid grasp of the concepts. ${weakAreas.length > 0 ? `Focus on improving: ${weakAreas.join(', ')}. Review these topics and practice more questions to achieve mastery.` : 'Keep practicing to reach excellence!'}`
    } else if (score >= 50) {
      return `📚 You scored ${score.toFixed(1)}%. You're on the right track but need more practice. Areas needing attention: ${weakAreas.join(', ')}. I recommend:\n• Review the fundamental concepts in these areas\n• Practice similar questions\n• Use the recommended resources in the Resources section\n• Don't hesitate to ask for help!`
    } else {
      return `💪 You scored ${score.toFixed(1)}%. Don't be discouraged - learning takes time! Focus on: ${weakAreas.join(', ')}. Suggested approach:\n• Start with basics in each weak area\n• Watch tutorial videos for visual learning\n• Practice with easier questions first\n• Study in short, focused sessions\n• Take the quiz again after studying\nYou can improve significantly with dedicated effort!`
    }
  }

  const handleSubmit = async () => {
    if (!quiz || submitting) return

    setSubmitting(true)
    if (timerRef.current) clearInterval(timerRef.current)

    try {
      const response = await fetch('/api/attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: quiz.id,
          answers,
          timeSpent
        })
      })

      const data = await response.json()
      setResults(data.results)
      setSubmitted(true)
      
      // Generate AI feedback
      const feedback = generateAIFeedback(data.results.score, data.results.weakAreas)
      setAiFeedback(feedback)
    } catch (error) {
      console.error('Error submitting quiz:', error)
      alert('Failed to submit quiz. Please try again.')
      setSubmitting(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'STUDENT' || !quiz) return null

  if (submitted && results) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <div className="text-5xl sm:text-6xl mb-4">
                {results.passed ? '🎉' : '📚'}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {results.passed ? 'Congratulations!' : 'Keep Learning!'}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                {results.passed
                  ? 'You passed the quiz!'
                  : 'Review the topics and try again'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-blue-50 p-4 sm:p-6 rounded-lg text-center">
                <p className="text-xs sm:text-sm text-blue-600 font-medium mb-1">Your Score</p>
                <p className="text-3xl sm:text-4xl font-bold text-blue-700">{Math.round(results.score)}%</p>
              </div>
              <div className="bg-green-50 p-4 sm:p-6 rounded-lg text-center">
                <p className="text-xs sm:text-sm text-green-600 font-medium mb-1">Correct Answers</p>
                <p className="text-3xl sm:text-4xl font-bold text-green-700">
                  {results.correctAnswers}/{results.totalQuestions}
                </p>
              </div>
              <div className="bg-orange-50 p-4 sm:p-6 rounded-lg text-center">
                <p className="text-xs sm:text-sm text-orange-600 font-medium mb-1">Time Spent</p>
                <p className="text-3xl sm:text-4xl font-bold text-orange-700">
                  {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
                </p>
              </div>
            </div>

            {/* AI Feedback */}
            {aiFeedback && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl sm:text-3xl">🤖</div>
                  <div className="flex-1">
                    <h2 className="text-base sm:text-lg font-semibold text-purple-900 mb-2">AI-Powered Feedback & Suggestions</h2>
                    <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-line leading-relaxed">{aiFeedback}</p>
                  </div>
                </div>
              </div>
            )}

            {results.weakAreas && results.weakAreas.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
                <h2 className="text-base sm:text-lg font-semibold text-yellow-900 mb-3">
                  Areas to Improve
                </h2>
                <div className="flex flex-wrap gap-2">
                  {results.weakAreas.map((area: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs sm:text-sm font-medium"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition text-sm sm:text-base"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => router.push('/quiz')}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-white text-blue-600 font-medium rounded-md border-2 border-blue-600 hover:bg-blue-50 transition text-sm sm:text-base"
              >
                Browse More Quizzes
              </button>
              <button
                onClick={() => router.push('/resources')}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition text-sm sm:text-base"
              >
                View Resources
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const question = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{quiz.title}</h1>
              <div className={`text-base sm:text-lg font-semibold px-3 py-1 rounded ${
                timeLeft < 60 ? 'bg-red-100 text-red-700' : 
                timeLeft < 300 ? 'bg-orange-100 text-orange-700' : 
                'bg-green-100 text-green-700'
              }`}>
                ⏱️ {minutes}:{seconds.toString().padStart(2, '0')}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </p>
          </div>

          <div className="mb-6 sm:mb-8">
            <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
              {question.question}
            </h2>

            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(question.id, index)}
                  className={`w-full text-left p-3 sm:p-4 rounded-lg border-2 transition ${
                    answers[question.id] === index
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-300 bg-white'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0 ${
                      answers[question.id] === index
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-300'
                    }`}>
                      {answers[question.id] === index && (
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-sm sm:text-base text-gray-900">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm sm:text-base"
            >
              ← Previous
            </button>

            {currentQuestion === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < quiz.questions.length || submitting}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm sm:text-base"
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition text-sm sm:text-base"
              >
                Next →
              </button>
            )}
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              {Object.keys(answers).length} of {quiz.questions.length} questions answered
            </p>
            {Object.keys(answers).length === quiz.questions.length && (
              <p className="text-xs sm:text-sm text-green-600 mt-1 font-medium">
                All questions answered! You can submit now.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
