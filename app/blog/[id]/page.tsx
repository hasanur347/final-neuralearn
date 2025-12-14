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
  author: string
  publishedAt: string
}

export default function BlogDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const blogId = params.id as string
  
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)

  // Sample blogs data (will match the blog list)
  const sampleBlogs: Record<string, Blog> = {
    '1': {
      id: '1',
      title: 'Getting Started with Data Structures',
      excerpt: 'Learn the fundamentals of data structures and why they are important in computer science.',
      content: `
# Introduction to Data Structures

Data structures are fundamental concepts in computer science that allow us to organize and store data efficiently. Understanding data structures is crucial for writing efficient and scalable code.

## Why Data Structures Matter

Data structures help us:
- Store and organize data efficiently
- Access data quickly
- Manage memory effectively
- Solve complex problems systematically

## Common Data Structures

### 1. Arrays
Arrays are the most basic data structure, storing elements in contiguous memory locations. They provide constant-time access to elements by index.

**Pros:**
- Fast access by index O(1)
- Simple to use and understand
- Good cache locality

**Cons:**
- Fixed size (in most languages)
- Expensive insertions and deletions O(n)

### 2. Linked Lists
Linked lists consist of nodes where each node contains data and a reference to the next node.

**Pros:**
- Dynamic size
- Easy insertions and deletions O(1)
- No wasted memory

**Cons:**
- No direct access to elements
- Extra memory for pointers
- Poor cache locality

### 3. Stacks and Queues
These are abstract data types that follow specific ordering principles:
- **Stack**: LIFO (Last In, First Out)
- **Queue**: FIFO (First In, First Out)

### 4. Trees
Trees are hierarchical data structures with a root node and child nodes. Binary trees are most common.

### 5. Hash Tables
Hash tables provide average O(1) time complexity for insertions, deletions, and lookups using key-value pairs.

## Getting Started

Start by implementing basic data structures in your preferred programming language. Practice with simple problems and gradually move to more complex ones.

## Resources for Learning
- LeetCode for practice problems
- GeeksforGeeks for detailed explanations
- Coursera courses on data structures
- YouTube tutorials for visual learning

## Conclusion

Mastering data structures is a journey. Take your time, practice regularly, and don't get discouraged. Each data structure you learn opens up new problem-solving capabilities.

Happy coding! 🚀
      `,
      category: 'Tutorial',
      author: 'Admin',
      publishedAt: new Date().toISOString()
    },
    '2': {
      id: '2',
      title: 'Top 10 Algorithm Patterns for Coding Interviews',
      excerpt: 'Master these algorithm patterns to ace your coding interviews.',
      content: `
# Top 10 Algorithm Patterns for Coding Interviews

Preparing for coding interviews can be overwhelming, but focusing on common patterns can significantly improve your success rate.

## The 10 Essential Patterns

### 1. Two Pointers
Use two pointers to traverse data structures from different ends or at different speeds.

**Example Problems:**
- Remove duplicates from sorted array
- Container with most water
- 3Sum problem

### 2. Sliding Window
Track a window of elements and slide it through the array.

**Example Problems:**
- Maximum sum subarray of size k
- Longest substring without repeating characters
- Minimum window substring

### 3. Fast & Slow Pointers
Use two pointers moving at different speeds to detect cycles or find middle elements.

**Example Problems:**
- Detect cycle in linked list
- Find middle of linked list
- Happy number problem

### 4. Binary Search
Efficiently search sorted data in O(log n) time.

**Example Problems:**
- Search in rotated sorted array
- Find first and last position of element
- Search in 2D matrix

### 5. Depth-First Search (DFS)
Explore as far as possible along each branch before backtracking.

**Example Problems:**
- Path sum in binary tree
- Number of islands
- Word search

### 6. Breadth-First Search (BFS)
Explore neighbors level by level.

**Example Problems:**
- Binary tree level order traversal
- Shortest path in unweighted graph
- Rotten oranges

### 7. Dynamic Programming
Break down problems into smaller subproblems and store results.

**Example Problems:**
- Climbing stairs
- Coin change
- Longest increasing subsequence

### 8. Backtracking
Try all possible solutions and backtrack when a solution doesn't work.

**Example Problems:**
- N-Queens problem
- Generate parentheses
- Permutations and combinations

### 9. Greedy Algorithms
Make locally optimal choices at each step.

**Example Problems:**
- Jump game
- Meeting rooms
- Task scheduler

### 10. Merge Intervals
Merge overlapping intervals or find gaps.

**Example Problems:**
- Merge intervals
- Insert interval
- Meeting rooms II

## Study Strategy

1. **Master one pattern at a time** - Don't try to learn everything at once
2. **Practice 5-10 problems per pattern** - Repetition builds intuition
3. **Time yourself** - Simulate interview conditions
4. **Review solutions** - Even if you solve it, check better approaches
5. **Explain your thinking** - Practice talking through your solution

## Interview Tips

- Always clarify requirements before coding
- Think out loud during the interview
- Start with a brute force solution
- Optimize step by step
- Test with edge cases
- Ask questions if stuck

## Conclusion

These patterns cover 80% of coding interview problems. Master them and you'll be well-prepared for any technical interview!

Good luck! 💪
      `,
      category: 'Career',
      author: 'Admin',
      publishedAt: new Date().toISOString()
    },
    '3': {
      id: '3',
      title: 'Understanding Time Complexity',
      excerpt: 'A comprehensive guide to Big O notation and time complexity analysis.',
      content: `
# Understanding Time Complexity and Big O Notation

Time complexity is a fundamental concept in computer science that describes how the runtime of an algorithm grows as the input size increases.

## What is Big O Notation?

Big O notation describes the upper bound of an algorithm's time complexity. It tells us the worst-case scenario of how long an algorithm will take.

## Common Time Complexities

### O(1) - Constant Time
The algorithm takes the same amount of time regardless of input size.

**Examples:**
- Accessing array element by index
- Hash table lookup
- Push/pop from stack

\`\`\`python
def get_first_element(arr):
    return arr[0]  # Always takes same time
\`\`\`

### O(log n) - Logarithmic Time
The algorithm divides the problem in half each time.

**Examples:**
- Binary search
- Finding element in balanced BST

\`\`\`python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
\`\`\`

### O(n) - Linear Time
The algorithm processes each element once.

**Examples:**
- Finding maximum element
- Linear search
- Traversing array

\`\`\`python
def find_max(arr):
    max_val = arr[0]
    for num in arr:  # Visits each element once
        if num > max_val:
            max_val = num
    return max_val
\`\`\`

### O(n log n) - Linearithmic Time
Combines linear and logarithmic time.

**Examples:**
- Merge sort
- Quick sort (average case)
- Heap sort

### O(n²) - Quadratic Time
Nested loops processing each element.

**Examples:**
- Bubble sort
- Selection sort
- Checking all pairs

\`\`\`python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(n - 1 - i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
\`\`\`

### O(2ⁿ) - Exponential Time
The algorithm doubles with each input increase.

**Examples:**
- Recursive fibonacci
- Subset generation
- Tower of Hanoi

### O(n!) - Factorial Time
Extremely slow, only feasible for small inputs.

**Examples:**
- Traveling salesman (brute force)
- Generating all permutations

## Space Complexity

Besides time, we also consider space complexity - how much memory an algorithm uses.

**Common space complexities:**
- O(1): Constant space (few variables)
- O(n): Linear space (array of size n)
- O(n²): Matrix storage

## How to Analyze Time Complexity

1. **Identify the basic operations** - What operation is repeated?
2. **Count how many times it executes** - Based on input size
3. **Express as a function of n** - Ignore constants
4. **Find the dominant term** - Drop lower order terms

## Tips for Optimization

1. **Avoid nested loops when possible** - Often causes O(n²)
2. **Use appropriate data structures** - Hash tables for O(1) lookup
3. **Consider space-time tradeoffs** - Sometimes using more memory saves time
4. **Use binary search** - When data is sorted
5. **Memoization** - Cache results of expensive operations

## Practice Problems

Start with these classic problems:
- Two Sum (Hash table reduces from O(n²) to O(n))
- Valid Anagram (Sorting vs Hash table)
- Container With Most Water (Two pointers)

## Conclusion

Understanding time complexity helps you write efficient code and make informed decisions about which algorithms to use. Practice analyzing different algorithms to build intuition!

Keep learning! 📚
      `,
      category: 'Tutorial',
      author: 'Admin',
      publishedAt: new Date().toISOString()
    }
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (blogId) {
      // In production, this would be an API call
      const foundBlog = sampleBlogs[blogId]
      if (foundBlog) {
        setBlog(foundBlog)
      }
      setLoading(false)
    }
  }, [blogId])

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
                <span className="font-medium">By {blog.author}</span>
              </div>
              <span className="text-gray-400">•</span>
              <div className="flex items-center">
                <span>{formatDate(blog.publishedAt)}</span>
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
