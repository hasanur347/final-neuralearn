'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Blog {
  id: string
  title: string
  content: string
  excerpt: string
  category: string
  isPublished?: boolean
  createdAt: string
}

export default function BlogPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchBlogs()
    }
  }, [session])

  useEffect(() => {
    filterBlogs()
  }, [blogs, selectedCategory, searchQuery])

  const fetchBlogs = () => {
    try {
      // Load blogs from localStorage
      const savedBlogs = localStorage.getItem('neuralearn_blogs')
      if (savedBlogs) {
        const parsedBlogs = JSON.parse(savedBlogs)
        // Only show published blogs
        const publishedBlogs = parsedBlogs.filter((blog: Blog) => blog.isPublished !== false)
        setBlogs(publishedBlogs)
      } else {
        // Initialize with sample blog if none exist
        const sampleBlogs: Blog[] = [
          {
            id: '1',
            title: 'Getting Started with Data Structures',
            excerpt: 'Learn the fundamentals of data structures and why they are important in computer science.',
            content: 'Data structures are fundamental concepts in computer science that allow us to organize and store data efficiently. In this tutorial, we will explore the most common data structures including arrays, linked lists, stacks, queues, trees, and graphs.',
            category: 'Tutorial',
            isPublished: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Top 10 Algorithm Patterns for Coding Interviews',
            excerpt: 'Master these algorithm patterns to ace your coding interviews.',
            content: 'Coding interviews often test your ability to recognize and apply common algorithm patterns. In this article, we cover the top 10 patterns including two pointers, sliding window, dynamic programming, and more.',
            category: 'Career',
            isPublished: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '3',
            title: 'Understanding Time Complexity',
            excerpt: 'A comprehensive guide to Big O notation and time complexity analysis.',
            content: 'Time complexity is a crucial concept in computer science that helps us analyze the efficiency of algorithms. In this guide, we will explore Big O notation and learn how to analyze the time complexity of different algorithms.',
            category: 'Tutorial',
            isPublished: true,
            createdAt: new Date().toISOString()
          }
        ]
        setBlogs(sampleBlogs)
        localStorage.setItem('neuralearn_blogs', JSON.stringify(sampleBlogs))
      }
    } catch (error) {
      console.error('Error loading blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterBlogs = () => {
    let filtered = blogs

    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(b => b.category === selectedCategory)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(b =>
        b.title.toLowerCase().includes(query) ||
        b.excerpt.toLowerCase().includes(query) ||
        b.category.toLowerCase().includes(query)
      )
    }

    setFilteredBlogs(filtered)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const categories = ['ALL', 'Tutorial', 'Career', 'News', 'Tips']

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading blogs...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Blog</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Latest articles, tutorials, and tips for learning
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Articles
              </label>
              <input
                type="text"
                placeholder="Search by title or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredBlogs.length} of {blogs.length} articles
          </div>
        </div>

        {/* Blog Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-gray-500 text-lg mb-2">No articles found</p>
            <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredBlogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
              >
                {/* Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                  <div className="text-6xl">📚</div>
                </div>

                <div className="p-4 sm:p-6">
                  {/* Category Badge */}
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full mb-3">
                    {blog.category}
                  </span>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition">
                    {blog.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                    <span>By Admin</span>
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}