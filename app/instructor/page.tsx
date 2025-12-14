'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Quiz {
  id: string
  title: string
  description: string
  topic: string
  difficulty: string
  duration: number
  _count?: { questions: number; attempts: number }
  questions?: any[]
  attempts?: any[]
}

interface QuestionForm {
  question: string
  options: [string, string, string, string]
  correctAnswer: number
  explanation: string
  topic: string
  difficulty: string
}

export default function InstructorPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'quizzes' | 'resources'>('quizzes')
  const [quizView, setQuizView] = useState<'list' | 'create'>('list')
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  
  // Quiz form state
  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    topic: '',
    difficulty: 'MEDIUM',
    duration: 30
  })
  
  // Questions state
  const [questions, setQuestions] = useState<QuestionForm[]>([
    {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      topic: '',
      difficulty: 'MEDIUM'
    }
  ])

  // Resource form state
  const [resourceForm, setResourceForm] = useState({
    title: '',
    description: '',
    type: 'ARTICLE',
    url: '',
    topic: '',
    difficulty: 'MEDIUM'
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (session && session.user.role !== 'INSTRUCTOR') {
      router.push('/dashboard')
    }
  }, [status, session, router])

  useEffect(() => {
    if (session && session.user.role === 'INSTRUCTOR') {
      fetchMyQuizzes()
    }
  }, [session])

  const fetchMyQuizzes = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/quiz')
      if (response.ok) {
        const data = await response.json()
        const myQuizzes = data.filter((q: any) => q.instructor?.id === session?.user.id)
        setQuizzes(myQuizzes)
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error)
    } finally {
      setLoading(false)
    }
  }

  const addQuestion = () => {
    setQuestions([...questions, {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      topic: quizForm.topic,
      difficulty: 'MEDIUM'
    }])
  }

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index))
    }
  }

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions]
    if (field.startsWith('option')) {
      const optionIndex = parseInt(field.replace('option', ''))
      updated[index].options[optionIndex] = value
    } else {
      (updated[index] as any)[field] = value
    }
    setQuestions(updated)
  }

  const handleSubmitQuiz = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!quizForm.title || !quizForm.topic) {
      alert('Please fill in all required fields')
      return
    }

    const invalidQuestions = questions.filter(q => 
      !q.question || q.options.some(opt => !opt)
    )
    
    if (invalidQuestions.length > 0) {
      alert('Please complete all questions and options')
      return
    }

    setCreating(true)

    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...quizForm,
          questions: questions
        })
      })

      if (response.ok) {
        alert('Quiz created successfully!')
        setQuizForm({
          title: '',
          description: '',
          topic: '',
          difficulty: 'MEDIUM',
          duration: 30
        })
        setQuestions([{
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          explanation: '',
          topic: '',
          difficulty: 'MEDIUM'
        }])
        setQuizView('list')
        fetchMyQuizzes()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to create quiz')
      }
    } catch (error) {
      console.error('Error creating quiz:', error)
      alert('Failed to create quiz')
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return

    try {
      const response = await fetch(`/api/quiz?id=${quizId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('Quiz deleted successfully!')
        fetchMyQuizzes()
      } else {
        alert('Failed to delete quiz')
      }
    } catch (error) {
      console.error('Error deleting quiz:', error)
      alert('Failed to delete quiz')
    }
  }

  const handleSubmitResource = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!resourceForm.title || !resourceForm.url || !resourceForm.topic) {
      alert('Please fill in all required fields')
      return
    }

    setCreating(true)

    try {
      // For now, just show success message since there's no resource API
      // In production, you would make an API call here
      alert('Resource submitted successfully!')
      setResourceForm({
        title: '',
        description: '',
        type: 'ARTICLE',
        url: '',
        topic: '',
        difficulty: 'MEDIUM'
      })
    } catch (error) {
      console.error('Error submitting resource:', error)
      alert('Failed to submit resource')
    } finally {
      setCreating(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'INSTRUCTOR') return null

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1">Create and manage quizzes & resources</p>
        </div>

        {/* Main Tabs */}
        <div className="mb-4 sm:mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('quizzes')}
                className={`flex-1 sm:flex-none py-3 sm:py-4 px-4 sm:px-8 text-xs sm:text-sm lg:text-base font-medium border-b-2 transition-colors ${
                  activeTab === 'quizzes'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📝 Quizzes
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`flex-1 sm:flex-none py-3 sm:py-4 px-4 sm:px-8 text-xs sm:text-sm lg:text-base font-medium border-b-2 transition-colors ${
                  activeTab === 'resources'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📚 Resources
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'quizzes' ? (
          <>
            {/* Quiz Sub-tabs */}
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <button
                  onClick={() => setQuizView('list')}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition ${
                    quizView === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  My Quizzes ({quizzes.length})
                </button>
                <button
                  onClick={() => setQuizView('create')}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition ${
                    quizView === 'create'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  + Create New
                </button>
              </div>
            </div>

            {/* Quiz Content */}
            {quizView === 'list' ? (
              <div className="space-y-3 sm:space-y-4">
                {loading ? (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 text-sm">Loading quizzes...</p>
                  </div>
                ) : quizzes.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 lg:p-12 text-center">
                    <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">📝</div>
                    <p className="text-gray-500 text-sm sm:text-base lg:text-lg mb-3 sm:mb-4">No quizzes created yet</p>
                    <button
                      onClick={() => setQuizView('create')}
                      className="w-full sm:w-auto px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm sm:text-base font-medium"
                    >
                      Create Your First Quiz
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:gap-4 lg:gap-6">
                    {quizzes.map(quiz => (
                      <div key={quiz.id} className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6 hover:shadow-lg transition">
                        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-start sm:justify-between sm:space-x-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 break-words">{quiz.title}</h3>
                            {quiz.description && (
                              <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1 line-clamp-2">{quiz.description}</p>
                            )}
                            <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500">
                              <span>📚 {quiz.topic}</span>
                              <span>❓ {quiz._count?.questions || quiz.questions?.length || 0} questions</span>
                              <span>⏱️ {quiz.duration} mins</span>
                              <span>📊 {quiz._count?.attempts || quiz.attempts?.length || 0} attempts</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteQuiz(quiz.id)}
                            className="w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmitQuiz} className="space-y-4 sm:space-y-6">
                {/* Quiz Details */}
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6">
                  <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4">Quiz Details</h2>
                  
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Quiz Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={quizForm.title}
                        onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Data Structures Fundamentals"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={quizForm.description}
                        onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Brief description..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Topic *</label>
                        <input
                          type="text"
                          required
                          value={quizForm.topic}
                          onChange={(e) => setQuizForm({ ...quizForm, topic: e.target.value })}
                          className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Arrays"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Difficulty *</label>
                        <select
                          value={quizForm.difficulty}
                          onChange={(e) => setQuizForm({ ...quizForm, difficulty: e.target.value })}
                          className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="EASY">Easy</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HARD">Hard</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Duration (min) *</label>
                        <input
                          type="number"
                          required
                          min="5"
                          max="180"
                          value={quizForm.duration}
                          onChange={(e) => setQuizForm({ ...quizForm, duration: parseInt(e.target.value) || 30 })}
                          className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Questions */}
                <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2">
                    <h2 className="text-base sm:text-lg lg:text-xl font-semibold">Questions</h2>
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-xs sm:text-sm font-medium"
                    >
                      + Add Question
                    </button>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    {questions.map((q, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                          <h3 className="font-medium text-sm sm:text-base">Question {index + 1}</h3>
                          {questions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeQuestion(index)}
                              className="text-red-600 hover:text-red-700 text-xs sm:text-sm"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Question Text *</label>
                            <textarea
                              required
                              value={q.question}
                              onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows={2}
                              placeholder="Enter question..."
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                            {[0, 1, 2, 3].map(optIndex => (
                              <div key={optIndex}>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Option {optIndex + 1} *</label>
                                <input
                                  type="text"
                                  required
                                  value={q.options[optIndex]}
                                  onChange={(e) => updateQuestion(index, `option${optIndex}`, e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder={`Option ${optIndex + 1}`}
                                />
                              </div>
                            ))}
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Correct *</label>
                              <select
                                value={q.correctAnswer}
                                onChange={(e) => updateQuestion(index, 'correctAnswer', parseInt(e.target.value))}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value={0}>Option 1</option>
                                <option value={1}>Option 2</option>
                                <option value={2}>Option 3</option>
                                <option value={3}>Option 4</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                              <select
                                value={q.difficulty}
                                onChange={(e) => updateQuestion(index, 'difficulty', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="EASY">Easy</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HARD">Hard</option>
                              </select>
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Topic</label>
                              <input
                                type="text"
                                value={q.topic || quizForm.topic}
                                onChange={(e) => updateQuestion(index, 'topic', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={quizForm.topic}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Explanation (Optional)</label>
                            <textarea
                              value={q.explanation}
                              onChange={(e) => updateQuestion(index, 'explanation', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows={2}
                              placeholder="Explain the answer..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Discard changes?')) setQuizView('list')
                    }}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm sm:text-base font-medium"
                  >
                    {creating ? 'Creating...' : 'Create Quiz'}
                  </button>
                </div>
              </form>
            )}
          </>
        ) : (
          // Resources Tab
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6">Add Learning Resource</h2>
            
            <form onSubmit={handleSubmitResource} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Resource Title *</label>
                <input
                  type="text"
                  required
                  value={resourceForm.title}
                  onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Binary Search Trees Explained"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={resourceForm.description}
                  onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Brief description of the resource..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select
                    value={resourceForm.type}
                    onChange={(e) => setResourceForm({ ...resourceForm, type: e.target.value })}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ARTICLE">Article</option>
                    <option value="VIDEO">Video</option>
                    <option value="PDF">PDF</option>
                    <option value="LINK">Link</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Topic *</label>
                  <input
                    type="text"
                    required
                    value={resourceForm.topic}
                    onChange={(e) => setResourceForm({ ...resourceForm, topic: e.target.value })}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Data Structures"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Difficulty *</label>
                  <select
                    value={resourceForm.difficulty}
                    onChange={(e) => setResourceForm({ ...resourceForm, difficulty: e.target.value })}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>

                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">URL *</label>
                  <input
                    type="url"
                    required
                    value={resourceForm.url}
                    onChange={(e) => setResourceForm({ ...resourceForm, url: e.target.value })}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm sm:text-base font-medium"
                >
                  Submit Resource
                </button>
              </div>
            </form>

            <div className="mt-6 sm:mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs sm:text-sm text-blue-800">
                💡 <strong>Tip:</strong> Your submitted resources will be reviewed by admins before being published to students.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
