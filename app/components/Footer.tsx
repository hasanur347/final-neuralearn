'use client'

import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">NeuraLearn</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              AI-powered adaptive learning platform for CSE students. Master data structures, algorithms, and more with personalized learning paths.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/quiz" className="hover:text-white transition">
                  Quizzes
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-white transition">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Adaptive Quizzes
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                AI Feedback
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Weak Area Analysis
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Personalized Learning
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:support@neuralearn.com" className="hover:text-white transition">
                  support@neuralearn.com
                </a>
              </li>
              <li className="text-gray-400">
                Available 24/7
              </li>
              <li className="pt-4">
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white transition" aria-label="Facebook">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition" aria-label="Twitter">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition" aria-label="LinkedIn">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-center sm:text-left">
              <p>© {currentYear} NeuraLearn. All rights reserved.</p>
            </div>

            {/* Developer Credit */}
            <div className="text-sm text-center sm:text-right">
              <p className="text-gray-400">
                Prepared by{' '}
                <span className="text-blue-400 font-semibold">
                  Md Bipul Hasan
                </span>
              </p>
            </div>
          </div>

          {/* Additional Links */}
          <div className="mt-4 text-center">
            <div className="flex flex-wrap justify-center space-x-4 text-xs sm:text-sm">
              <Link href="#" className="text-gray-400 hover:text-white transition">
                Privacy Policy
              </Link>
              <span className="text-gray-600">•</span>
              <Link href="#" className="text-gray-400 hover:text-white transition">
                Terms of Service
              </Link>
              <span className="text-gray-600">•</span>
              <Link href="#" className="text-gray-400 hover:text-white transition">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
