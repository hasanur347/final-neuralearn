'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Resource {
  id: string
  title: string
  description: string
  type: string
  url: string
  topic: string
  difficulty: string
}

export default function ResourcesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [resources, setResources] = useState<Resource[]>([])
  const [filteredResources, setFilteredResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<string>('ALL')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchResources()
    }
  }, [session])

  useEffect(() => {
    filterResources()
  }, [resources, selectedType, selectedDifficulty, searchQuery])

  const fetchResources = async () => {
    try {
      // For now, use sample data since we don't have resources API yet
      const sampleResources: Resource[] = [
        {
          id: '1',
          title: 'Data Structures and Algorithms - Complete Guide',
          description: 'Comprehensive guide covering all fundamental data structures including arrays, linked lists, stacks, queues, trees, and graphs.',
          type: 'ARTICLE',
          url: 'https://www.geeksforgeeks.org/data-structures/',
          topic: 'Data Structures',
          difficulty: 'MEDIUM'
        },
        {
          id: '2',
          title: 'Introduction to Algorithms (MIT OpenCourseWare)',
          description: 'Full course on algorithms from MIT. Covers sorting, searching, dynamic programming, and graph algorithms.',
          type: 'VIDEO',
          url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/',
          topic: 'Algorithms',
          difficulty: 'HARD'
        },
        {
          id: '3',
          title: 'Big O Notation Explained',
          description: 'Easy-to-understand explanation of time and space complexity with examples and visual representations.',
          type: 'ARTICLE',
          url: 'https://www.bigocheatsheet.com/',
          topic: 'Complexity Analysis',
          difficulty: 'EASY'
        },
        {
          id: '4',
          title: 'Sorting Algorithms Visualization',
          description: 'Interactive visualizations of common sorting algorithms including bubble sort, merge sort, and quick sort.',
          type: 'LINK',
          url: 'https://visualgo.net/en/sorting',
          topic: 'Sorting',
          difficulty: 'MEDIUM'
        },
        {
          id: '5',
          title: 'Binary Search Trees Tutorial',
          description: 'Complete tutorial on binary search trees with implementation examples in multiple programming languages.',
          type: 'VIDEO',
          url: 'https://www.youtube.com/watch?v=pYT9F8_LFTM',
          topic: 'Trees',
          difficulty: 'MEDIUM'
        },
        {
          id: '6',
          title: 'Dynamic Programming Patterns',
          description: 'Common dynamic programming patterns with detailed explanations and practice problems.',
          type: 'ARTICLE',
          url: 'https://www.educative.io/courses/grokking-dynamic-programming-patterns-for-coding-interviews',
          topic: 'Dynamic Programming',
          difficulty: 'HARD'
        },
        {
          id: '7',
          title: 'Graph Theory Basics',
          description: 'Introduction to graph theory concepts including BFS, DFS, shortest path, and minimum spanning trees.',
          type: 'VIDEO',
          url: 'https://www.youtube.com/watch?v=tWVWeAqZ0WU',
          topic: 'Graphs',
          difficulty: 'MEDIUM'
        },
        {
          id: '8',
          title: 'Recursion Made Simple',
          description: 'Step-by-step guide to understanding recursion with easy examples and practice problems.',
          type: 'ARTICLE',
          url: 'https://www.khanacademy.org/computing/computer-science/algorithms/recursive-algorithms',
          topic: 'Recursion',
          difficulty: 'EASY'
        }
      ]
      
      setResources(sampleResources)
    } catch (error) {
      console.error('Error fetching resources:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterResources = () => {
    let filtered = resources

    if (selectedType !== 'ALL') {
      filtered = filtered.filter(r => r.type === selectedType)
    }

    if (selectedDifficulty !== 'ALL') {
      filtered = filtered.filter(r => r.difficulty === selectedDifficulty)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.topic.toLowerCase().includes(query)
      )
    }

    setFilteredResources(filtered)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return '🎥'
      case 'ARTICLE': return '📄'
      case 'PDF': return '📕'
      case 'LINK': return '🔗'
      default: return '📚'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'HARD': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading resources...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Learning Resources</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Browse curated learning materials for CSE topics</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Resources
              </label>
              <input
                type="text"
                placeholder="Search by title, topic, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              >
                <option value="ALL">All Types</option>
                <option value="VIDEO">Videos</option>
                <option value="ARTICLE">Articles</option>
                <option value="PDF">PDFs</option>
                <option value="LINK">Links</option>
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              >
                <option value="ALL">All Levels</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredResources.length} of {resources.length} resources
          </div>
        </div>

        {/* Resources Grid */}
        {filteredResources.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
            <div className="text-5xl mb-4">📚</div>
            <p className="text-gray-500 text-lg mb-2">No resources found</p>
            <p className="text-gray-400 text-sm">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredResources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-3xl">{getTypeIcon(resource.type)}</div>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(resource.difficulty)}`}>
                      {resource.difficulty}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {resource.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {resource.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-gray-500">
                      📚 {resource.topic}
                    </span>
                    <span className="text-xs text-gray-500">
                      {resource.type}
                    </span>
                  </div>

                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition text-sm"
                  >
                    Access Resource →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="text-3xl">💡</div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-1">Pro Tip</h3>
              <p className="text-sm text-blue-800">
                Resources are curated based on your weak areas. Take more quizzes to get personalized recommendations!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
