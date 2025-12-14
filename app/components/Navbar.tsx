'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export function Navbar() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/', redirect: true })
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl sm:text-2xl font-bold text-blue-600">
              NeuraLearn
            </Link>
            {session && (
              <div className="hidden md:flex ml-6 lg:ml-10 space-x-2 lg:space-x-4">
                <Link
                  href="/dashboard"
                  className={`px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive('/dashboard')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </Link>
                {session.user.role === 'STUDENT' && (
                  <>
                    <Link
                      href="/quiz"
                      className={`px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition ${
                        isActive('/quiz')
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Quizzes
                    </Link>
                    <Link
                      href="/chatbot"
                      className={`px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition ${
                        isActive('/chatbot')
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      AI Chat
                    </Link>
                  </>
                )}
                <Link
                  href="/resources"
                  className={`px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive('/resources')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Resources
                </Link>
                <Link
                  href="/blog"
                  className={`px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive('/blog')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Blog
                </Link>
                {['INSTRUCTOR', 'ADMIN'].includes(session.user.role) && (
                  <Link
                    href="/instructor"
                    className={`px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive('/instructor')
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Manage
                  </Link>
                )}
                {session.user.role === 'ADMIN' && (
                  <>
                    <Link
                      href="/admin"
                      className={`px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition ${
                        isActive('/admin')
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Admin
                    </Link>
                    <Link
                      href="/admin/blogs"
                      className={`px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition ${
                        isActive('/admin/blogs')
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Manage Blogs
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {status === 'loading' ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : session ? (
              <>
                <div className="hidden sm:block text-sm">
                  <p className="font-medium text-gray-700 truncate max-w-[150px]">{session.user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{session.user.role.toLowerCase()}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-3 sm:px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition"
                >
                  Sign Out
                </button>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {mobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-3 sm:px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {session && mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <div className="px-3 py-2 text-sm border-b border-gray-200 mb-2">
              <p className="font-medium text-gray-700">{session.user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{session.user.role.toLowerCase()}</p>
            </div>
            <Link
              href="/dashboard"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/dashboard')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            {session.user.role === 'STUDENT' && (
              <>
                <Link
                  href="/quiz"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/quiz')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Quizzes
                </Link>
                <Link
                  href="/chatbot"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/chatbot')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  AI Chat
                </Link>
              </>
            )}
            <Link
              href="/resources"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/resources')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Resources
            </Link>
            <Link
              href="/blog"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/blog')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            {['INSTRUCTOR', 'ADMIN'].includes(session.user.role) && (
              <Link
                href="/instructor"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/instructor')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Manage
              </Link>
            )}
            {session.user.role === 'ADMIN' && (
              <>
                <Link
                  href="/admin"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/admin')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
                <Link
                  href="/admin/blogs"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/admin/blogs')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Manage Blogs
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
