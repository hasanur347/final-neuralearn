'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Blog {
  id: string
  title: string
  content: string
  excerpt: string
  category: string
  isPublished: boolean
  createdAt: string
}

export default function AdminBlogsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeView, setActiveView] = useState<'list' | 'create'>('list')
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)

  const [blogForm, setBlogForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Tutorial',
    isPublished: true
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (session && session.user.role !== 'ADMIN') {
      router.push('/dashboard')
    }
  }, [status, session, router])

  useEffect(() => {
    if (session && session.user.role === 'ADMIN') {
      fetchBlogs()
    }
  }, [session])

  const fetchBlogs = () => {
    // Sample data - replace with API call
    const sampleBlogs: Blog[] = [
      {
        id: '1',
        title: 'Getting Started with Data Structures',
        excerpt: 'Learn the fundamentals...',
        content: 'Full content...',
        category: 'Tutorial',
        isPublished: true,
        createdAt: new Date().toISOString()
      }
    ]
    setBlogs(sampleBlogs)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!blogForm.title || !blogForm.content) {
      alert('Please fill in all required fields')
      return
    }

    setCreating(true)

    try {
      // TODO: API call to create blog
      alert('Blog created successfully!')
      setBlogForm({
        title: '',
        excerpt: '',
        content: '',
        category: 'Tutorial',
        isPublished: true
      })
      setActiveView('list')
      fetchBlogs()
    } catch (error) {
      console.error('Error creating blog:', error)
      alert('Failed to create blog')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = (blogId: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return
    
    // TODO: API call to delete
    alert('Blog deleted!')
    fetchBlogs()
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') return null

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1">Create and manage blog posts</p>
        </div>

        {/* View Toggle */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <button
              onClick={() => setActiveView('list')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition ${
                activeView === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              All Blogs ({blogs.length})
            </button>
            <button
              onClick={() => setActiveView('create')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition ${
                activeView === 'create'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              + Create New Blog
            </button>
          </div>
        </div>

        {/* Content */}
        {activeView === 'list' ? (
          <div className="space-y-3 sm:space-y-4">
            {blogs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 lg:p-12 text-center">
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">📝</div>
                <p className="text-gray-500 text-sm sm:text-base lg:text-lg mb-3 sm:mb-4">No blogs created yet</p>
                <button
                  onClick={() => setActiveView('create')}
                  className="w-full sm:w-auto px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm sm:text-base font-medium"
                >
                  Create Your First Blog
                </button>
              </div>
            ) : (
              <div className="grid gap-3 sm:gap-4 lg:gap-6">
                {blogs.map(blog => (
                  <div key={blog.id} className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6">
                    <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-start sm:justify-between sm:space-x-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">{blog.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            blog.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {blog.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-2 line-clamp-2">{blog.excerpt}</p>
                        <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-500">
                          <span>📂 {blog.category}</span>
                          <span>📅 {new Date(blog.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex sm:flex-col gap-2">
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6">
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4">Blog Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter blog title"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Excerpt (Short Description)
                  </label>
                  <textarea
                    value={blogForm.excerpt}
                    onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="Brief summary..."
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Content *
                  </label>
                  <textarea
                    required
                    value={blogForm.content}
                    onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={10}
                    placeholder="Write your blog content here..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={blogForm.category}
                      onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Tutorial">Tutorial</option>
                      <option value="Career">Career</option>
                      <option value="News">News</option>
                      <option value="Tips">Tips</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={blogForm.isPublished ? 'published' : 'draft'}
                      onChange={(e) => setBlogForm({ ...blogForm, isPublished: e.target.value === 'published' })}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end">
              <button
                type="button"
                onClick={() => setActiveView('list')}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm sm:text-base font-medium"
              >
                {creating ? 'Creating...' : 'Create Blog Post'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
