'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function InstructorDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalResources: 0,
    totalAttempts: 0,
    activeStudents: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (session && session.user.role !== 'INSTRUCTOR') {
      router.push('/dashboard')
    }
  }, [status, session, router])

  useEffect(() => {
    if (session && session.user.role === 'INSTRUCTOR') {
      fetchStats()
    }
  }, [session])

  const fetchStats = async () => {
    try {
      // TODO: Replace with actual API calls
      setStats({
        totalQuizzes: 5,
        totalResources: 8,
        totalAttempts: 42,
        activeStudents: 15
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'INSTRUCTOR') return null

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome, {session.user.name}!
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Instructor Dashboard - Manage your content and track student progress
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Quizzes Created</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{stats.totalQuizzes}</p>
              </div>
              <div className="text-3xl sm:text-4xl">📝</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Resources Shared</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{stats.totalResources}</p>
              </div>
              <div className="text-3xl sm:text-4xl">📚</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Quiz Attempts</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{stats.totalAttempts}</p>
              </div>
              <div className="text-3xl sm:text-4xl">📊</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Active Students</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{stats.activeStudents}</p>
              </div>
              <div className="text-3xl sm:text-4xl">👥</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Link
              href="/instructor?tab=quizzes&view=create"
              className="flex items-center p-4 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition group"
            >
              <div className="text-3xl mr-4">➕</div>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-blue-600">Create Quiz</p>
                <p className="text-xs sm:text-sm text-gray-600">Add a new quiz</p>
              </div>
            </Link>

            <Link
              href="/instructor?tab=resources"
              className="flex items-center p-4 border-2 border-green-600 rounded-lg hover:bg-green-50 transition group"
            >
              <div className="text-3xl mr-4">📤</div>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-green-600">Add Resource</p>
                <p className="text-xs sm:text-sm text-gray-600">Share learning materials</p>
              </div>
            </Link>

            <Link
              href="/instructor"
              className="flex items-center p-4 border-2 border-purple-600 rounded-lg hover:bg-purple-50 transition group"
            >
              <div className="text-3xl mr-4">📋</div>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-purple-600">View My Content</p>
                <p className="text-xs sm:text-sm text-gray-600">Manage quizzes & resources</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Recent Student Activity</h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-2 sm:gap-0">
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold text-sm sm:text-base">JS</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm sm:text-base">John Smith</p>
                  <p className="text-xs sm:text-sm text-gray-600">Completed "Data Structures Quiz"</p>
                </div>
              </div>
              <span className="text-xs sm:text-sm text-gray-500 sm:text-right">2 hours ago</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-2 sm:gap-0">
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-semibold text-sm sm:text-base">MJ</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm sm:text-base">Mary Johnson</p>
                  <p className="text-xs sm:text-sm text-gray-600">Started "Algorithms Quiz"</p>
                </div>
              </div>
              <span className="text-xs sm:text-sm text-gray-500 sm:text-right">5 hours ago</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-2 sm:gap-0">
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-purple-600 font-semibold text-sm sm:text-base">RW</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm sm:text-base">Robert Williams</p>
                  <p className="text-xs sm:text-sm text-gray-600">Accessed resource: "Binary Trees Guide"</p>
                </div>
              </div>
              <span className="text-xs sm:text-sm text-gray-500 sm:text-right">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
