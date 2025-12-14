'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Quiz {
  id: string
  title: string
  description: string
  topic: string
  difficulty: string
  duration: number
  instructor: {
    id: string
    name: string
  }
  _count: {
    questions: number
    attempts: number
  }
}

export default function QuizListPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchQuizzes()
    }
  }, [session])

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('/api/quiz')
      const data = await response.json()
      setQuizzes(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching quizzes:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quizzes...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  const filteredQuizzes = filter === 'all'
    ? quizzes
    : quizzes.filter(q => q.topic.toLowerCase().includes(filter.toLowerCase()) || 
                          q.difficulty.toLowerCase() === filter.toLowerCase())

  const topics = Array.from(new Set(quizzes.map(q => q.topic)))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Available Quizzes</h1>
        <p className="text-gray-600 mt-1">Choose a quiz to test your knowledge</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          All Quizzes
        </button>
        {topics.map(topic => (
          <button
            key={topic}
            onClick={() => setFilter(topic)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              filter === topic
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {topic}
          </button>
        ))}
        <button
          onClick={() => setFilter('EASY')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            filter === 'EASY'
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Easy
        </button>
        <button
          onClick={() => setFilter('MEDIUM')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            filter === 'MEDIUM'
              ? 'bg-yellow-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Medium
        </button>
        <button
          onClick={() => setFilter('HARD')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            filter === 'HARD'
              ? 'bg-red-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Hard
        </button>
      </div>

      {filteredQuizzes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">No quizzes found</p>
          {['INSTRUCTOR', 'ADMIN'].includes(session.user.role) && (
            <Link
              href="/instructor"
              className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create a Quiz
            </Link>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold text-gray-900">{quiz.title}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  quiz.difficulty === 'EASY' ? 'bg-green-100 text-green-800' :
                  quiz.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {quiz.difficulty}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {quiz.description || 'Test your knowledge on this topic'}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium mr-2">📚 Topic:</span>
                  <span>{quiz.topic}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium mr-2">❓ Questions:</span>
                  <span>{quiz._count.questions}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium mr-2">⏱️ Duration:</span>
                  <span>{quiz.duration} minutes</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium mr-2">👤 By:</span>
                  <span>{quiz.instructor.name}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium mr-2">📊 Attempts:</span>
                  <span>{quiz._count.attempts}</span>
                </div>
              </div>

              <Link
                href={`/quiz/${quiz.id}`}
                className="block w-full text-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
              >
                Start Quiz
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
