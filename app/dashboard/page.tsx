'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface WeakArea {
  topic: string
  correctRate: number
  totalAttempts: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalQuizzes: 2,
    completed: 1,
    averageScore: 70,
    accuracy: 50
  })
  const [weakAreas, setWeakAreas] = useState<WeakArea[]>([
    { topic: 'Arrays', correctRate: 40, totalAttempts: 5 },
    { topic: 'Linked Lists', correctRate: 60, totalAttempts: 3 },
    { topic: 'Trees', correctRate: 50, totalAttempts: 2 }
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (session && session.user.role !== 'STUDENT') {
      // Redirect instructors and admins to their specific dashboards
      if (session.user.role === 'INSTRUCTOR') {
        router.push('/instructor-dashboard')
      } else if (session.user.role === 'ADMIN') {
        router.push('/admin')
      }
    }
  }, [status, session, router])

  useEffect(() => {
    if (session && session.user.role === 'STUDENT') {
      fetchDashboardData()
    }
  }, [session])

  const fetchDashboardData = async () => {
    try {
      // TODO: Replace with actual API calls
      setLoading(false)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'STUDENT') return null

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome back, {session.user.name}!
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Here's your learning progress
          </p>
        </div>

        {/* Stats Grid - Fully Responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6">
            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">Total Quizzes</p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{stats.totalQuizzes}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6">
            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">Completed</p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600">{stats.completed}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6">
            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">Average Score</p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">{stats.averageScore}%</p>
            <p className="text-xs text-gray-500 mt-1">Great work!</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6">
            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">Accuracy</p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600">{stats.accuracy}%</p>
            <p className="text-xs text-gray-500 mt-1">3/6 correct</p>
          </div>
        </div>

        {/* Performance Chart - Responsive */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Performance Over Time</h2>
          <div className="w-full overflow-x-auto">
            <div className="min-w-full">
              {/* Simple responsive bar chart */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-20 sm:w-24 text-xs sm:text-sm text-gray-600">Week 1</div>
                  <div className="flex-1">
                    <div className="bg-blue-200 rounded-full h-6 sm:h-8" style={{ width: '60%' }}>
                      <div className="flex items-center justify-end h-full pr-2">
                        <span className="text-xs font-semibold text-blue-800">60%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-20 sm:w-24 text-xs sm:text-sm text-gray-600">Week 2</div>
                  <div className="flex-1">
                    <div className="bg-blue-300 rounded-full h-6 sm:h-8" style={{ width: '75%' }}>
                      <div className="flex items-center justify-end h-full pr-2">
                        <span className="text-xs font-semibold text-blue-800">75%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-20 sm:w-24 text-xs sm:text-sm text-gray-600">Week 3</div>
                  <div className="flex-1">
                    <div className="bg-blue-400 rounded-full h-6 sm:h-8" style={{ width: '85%' }}>
                      <div className="flex items-center justify-end h-full pr-2">
                        <span className="text-xs font-semibold text-white">85%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-20 sm:w-24 text-xs sm:text-sm text-gray-600">Current</div>
                  <div className="flex-1">
                    <div className="bg-blue-600 rounded-full h-6 sm:h-8" style={{ width: '70%' }}>
                      <div className="flex items-center justify-end h-full pr-2">
                        <span className="text-xs font-semibold text-white">70%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weak Areas - Responsive */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Areas to Improve</h2>
          <div className="space-y-3 sm:space-y-4">
            {weakAreas.map((area, index) => (
              <div key={index} className="border-l-4 border-orange-500 pl-3 sm:pl-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">{area.topic}</p>
                    <p className="text-xs sm:text-sm text-gray-600">{area.totalAttempts} attempts</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 sm:w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 rounded-full h-2" 
                        style={{ width: `${area.correctRate}%` }}
                      />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-700 w-12 text-right">
                      {area.correctRate}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions - Responsive */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Link
              href="/quiz"
              className="flex items-center p-4 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition"
            >
              <div className="text-3xl mr-3 sm:mr-4">📝</div>
              <div>
                <p className="font-semibold text-gray-900 text-sm sm:text-base">Take a Quiz</p>
                <p className="text-xs sm:text-sm text-gray-600">Start learning</p>
              </div>
            </Link>

            <Link
              href="/resources"
              className="flex items-center p-4 border-2 border-green-600 rounded-lg hover:bg-green-50 transition"
            >
              <div className="text-3xl mr-3 sm:mr-4">📚</div>
              <div>
                <p className="font-semibold text-gray-900 text-sm sm:text-base">Browse Resources</p>
                <p className="text-xs sm:text-sm text-gray-600">Study materials</p>
              </div>
            </Link>

            <Link
              href="/blog"
              className="flex items-center p-4 border-2 border-purple-600 rounded-lg hover:bg-purple-50 transition sm:col-span-2 lg:col-span-1"
            >
              <div className="text-3xl mr-3 sm:mr-4">📖</div>
              <div>
                <p className="font-semibold text-gray-900 text-sm sm:text-base">Read Blog</p>
                <p className="text-xs sm:text-sm text-gray-600">Latest articles</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
