'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
}

interface Stats {
  totalUsers: number
  totalQuizzes: number
  totalAttempts: number
  activeStudents: number
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalQuizzes: 0,
    totalAttempts: 0,
    activeStudents: 0
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'users'>('overview')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (session && session.user.role !== 'ADMIN') {
      router.push('/dashboard')
    }
  }, [status, session, router])

  useEffect(() => {
    if (session && session.user.role === 'ADMIN') {
      fetchAdminData()
    }
  }, [session])

  const fetchAdminData = async () => {
    try {
      // Fetch stats (mock data for now)
      setStats({
        totalUsers: 25,
        totalQuizzes: 10,
        totalAttempts: 150,
        activeStudents: 20
      })

      // Fetch users (mock data for now)
      setUsers([
        {
          id: '1',
          name: 'John Doe',
          email: 'student@demo.com',
          role: 'STUDENT',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Dr. Sarah Johnson',
          email: 'instructor@demo.com',
          role: 'INSTRUCTOR',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Admin User',
          email: 'admin@demo.com',
          role: 'ADMIN',
          isActive: true,
          createdAt: new Date().toISOString()
        }
      ])
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-800'
      case 'INSTRUCTOR': return 'bg-blue-100 text-blue-800'
      case 'STUDENT': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') return null

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage users and monitor system</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-3 px-1 text-sm sm:text-base font-medium whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`pb-3 px-1 text-sm sm:text-base font-medium whitespace-nowrap ${
                  activeTab === 'users'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                User Management
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' ? (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                  </div>
                  <div className="text-3xl sm:text-4xl">👥</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{stats.totalQuizzes}</p>
                  </div>
                  <div className="text-3xl sm:text-4xl">📝</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Quiz Attempts</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{stats.totalAttempts}</p>
                  </div>
                  <div className="text-3xl sm:text-4xl">📊</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Students</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{stats.activeStudents}</p>
                  </div>
                  <div className="text-3xl sm:text-4xl">✅</div>
                </div>
              </div>
            </div>

            {/* System Info */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">System Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-l-4 border-blue-600 pl-4">
                  <p className="text-sm text-gray-600">Platform Version</p>
                  <p className="text-lg font-semibold text-gray-900">NeuraLearn v3.0</p>
                </div>
                <div className="border-l-4 border-green-600 pl-4">
                  <p className="text-sm text-gray-600">Database Status</p>
                  <p className="text-lg font-semibold text-green-600">Connected</p>
                </div>
                <div className="border-l-4 border-purple-600 pl-4">
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="text-lg font-semibold text-gray-900">December 2024</p>
                </div>
                <div className="border-l-4 border-orange-600 pl-4">
                  <p className="text-sm text-gray-600">Server Status</p>
                  <p className="text-lg font-semibold text-green-600">Online</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <button className="px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm sm:text-base">
                  View All Users
                </button>
                <button className="px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm sm:text-base">
                  Approve Quizzes
                </button>
                <button className="px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition text-sm sm:text-base">
                  Generate Reports
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">User Management</h2>
              
              {/* Mobile View */}
              <div className="block sm:hidden space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className={`text-sm ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {user.isActive ? '● Active' : '● Inactive'}
                      </span>
                      <button className="text-sm text-blue-600 hover:text-blue-700">
                        Manage
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{user.email}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getRoleBadgeColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`text-sm ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                            {user.isActive ? '● Active' : '● Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <button className="text-blue-600 hover:text-blue-700 mr-3">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-700">
                            Disable
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
