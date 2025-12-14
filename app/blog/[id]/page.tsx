'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Blog {
  id: string
  title: string
  content: string
  excerpt: string
  category: string
  createdAt: string
}

export default function BlogDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const blogId = params.id as string
  
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (blogId && session) {
      fetchBlog()
    }
  }, [blogId, session])

  const fetchBlog = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/blog?id=${blogId}`)
      if (response.ok) {
        const data = await response.json()
        setBlog(data)
      } else {
        console.error('Blog not found')
      }
    } catch (error) {
      console.error('Error fetching blog:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading blog...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
            <div className="text-5xl mb-4">😕</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Blog Not Found</h1>
            <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
            <Link
              href="/blog"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              ← Back to Blogs
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 sm:mb-6 text-sm sm:text-base"
        >
          ← Back to all blogs
        </Link>

        {/* Blog Content */}
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-200">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full mb-3 sm:mb-4">
              {blog.category}
            </span>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center">
                <span className="font-medium">By Admin</span>
              </div>
              <span className="text-gray-400">•</span>
              <div className="flex items-center">
                <span>{formatDate(blog.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-sm sm:text-base lg:text-lg leading-relaxed text-gray-700">
                {blog.content}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs sm:text-sm text-gray-600">
                Found this helpful? Check out more articles in our blog.
              </p>
              <Link
                href="/blog"
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm sm:text-base text-center"
              >
                More Articles
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}