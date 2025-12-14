'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatbotPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your CSE learning assistant. Ask me anything about Data Structures, Algorithms, Programming, Databases, or any Computer Science topic. How can I help you today?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (session && session.user.role !== 'STUDENT') {
      router.push('/dashboard')
    }
  }, [status, session, router])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const getAIResponse = (question: string): string => {
    const q = question.toLowerCase()

    // Data Structures
    if (q.includes('array') || q.includes('arrays')) {
      return "**Arrays** are fundamental data structures that store elements in contiguous memory locations.\n\n**Key Points:**\n• Fixed size (in most languages)\n• O(1) access time by index\n• O(n) insertion/deletion (except at end)\n• Good cache locality\n\n**Common Operations:**\n• Access: arr[i] - O(1)\n• Search: Linear search O(n), Binary search O(log n) if sorted\n• Insert: O(n) due to shifting\n• Delete: O(n) due to shifting\n\n**Use Cases:** When you need random access, fixed-size collections, or implementing other data structures like stacks and queues.\n\nWould you like to know about specific array algorithms?"
    }

    if (q.includes('linked list')) {
      return "**Linked Lists** consist of nodes where each node contains data and a reference to the next node.\n\n**Types:**\n• Singly Linked List: One direction\n• Doubly Linked List: Two directions\n• Circular Linked List: Last node points to first\n\n**Advantages:**\n• Dynamic size\n• Easy insertion/deletion O(1) if you have the reference\n• No memory waste\n\n**Disadvantages:**\n• No random access\n• Extra memory for pointers\n• Poor cache locality\n\n**When to use:** When you need frequent insertions/deletions, don't know the size in advance, or don't need random access.\n\nWant to see implementation examples?"
    }

    if (q.includes('stack')) {
      return "**Stack** follows LIFO (Last In, First Out) principle.\n\n**Core Operations:**\n• push(item) - Add to top - O(1)\n• pop() - Remove from top - O(1)\n• peek() - View top - O(1)\n• isEmpty() - Check if empty - O(1)\n\n**Applications:**\n• Function call management (call stack)\n• Undo mechanism in editors\n• Expression evaluation\n• Backtracking algorithms\n• Browser history\n\n**Implementation:** Can use arrays or linked lists.\n\n**Example Use Case:** Checking balanced parentheses - use stack to match opening and closing brackets.\n\nNeed help with stack problems?"
    }

    if (q.includes('queue')) {
      return "**Queue** follows FIFO (First In, First Out) principle.\n\n**Core Operations:**\n• enqueue(item) - Add to rear - O(1)\n• dequeue() - Remove from front - O(1)\n• peek() - View front - O(1)\n• isEmpty() - Check if empty - O(1)\n\n**Types:**\n• Simple Queue\n• Circular Queue\n• Priority Queue\n• Deque (Double-ended queue)\n\n**Applications:**\n• Process scheduling\n• BFS traversal\n• Printer spooling\n• Asynchronous data transfer\n\n**Real Example:** Print queue - documents are printed in order they're added.\n\nInterested in priority queues or BFS?"
    }

    if (q.includes('tree') || q.includes('binary tree')) {
      return "**Binary Trees** are hierarchical data structures where each node has at most 2 children.\n\n**Types:**\n• Full Binary Tree: Each node has 0 or 2 children\n• Complete Binary Tree: All levels filled except possibly last\n• Perfect Binary Tree: All leaves at same level\n• Binary Search Tree: Left < Parent < Right\n\n**Traversals:**\n• Inorder (Left, Root, Right) - gives sorted order in BST\n• Preorder (Root, Left, Right) - used for copying tree\n• Postorder (Left, Right, Root) - used for deletion\n• Level Order (BFS) - level by level\n\n**BST Operations:**\n• Search: O(log n) average, O(n) worst\n• Insert: O(log n) average\n• Delete: O(log n) average\n\nWant to learn about balanced trees like AVL or Red-Black?"
    }

    // Algorithms
    if (q.includes('sorting')) {
      return "**Sorting Algorithms Comparison:**\n\n**Simple Sorts (O(n²)):**\n• Bubble Sort - Swap adjacent if wrong order\n• Selection Sort - Find min and place it\n• Insertion Sort - Build sorted array one item at a time\n\n**Efficient Sorts:**\n• Merge Sort - O(n log n), Stable, Extra space\n• Quick Sort - O(n log n) average, In-place\n• Heap Sort - O(n log n), In-place\n\n**Special Purpose:**\n• Counting Sort - O(n+k), for integers in range\n• Radix Sort - O(d*n), for numbers\n\n**When to use:**\n• Small data: Insertion sort\n• General purpose: Quick sort\n• Guaranteed O(n log n): Merge/Heap sort\n• Stable sort needed: Merge sort\n\nNeed code examples?"
    }

    if (q.includes('search') || q.includes('binary search')) {
      return "**Searching Algorithms:**\n\n**Linear Search:**\n• Check each element - O(n)\n• Works on unsorted arrays\n• Simple implementation\n\n**Binary Search:**\n• Only works on SORTED arrays\n• O(log n) time complexity\n• Divide and conquer approach\n\n**Algorithm:**\n```\n1. Set left = 0, right = n-1\n2. While left <= right:\n   - mid = (left + right) / 2\n   - If arr[mid] == target: return mid\n   - If arr[mid] < target: left = mid + 1\n   - Else: right = mid - 1\n3. Return -1 (not found)\n```\n\n**Key Point:** Each step eliminates half the remaining elements!\n\nWant to see variations like finding first/last occurrence?"
    }

    if (q.includes('complexity') || q.includes('big o')) {
      return "**Time Complexity (Big O Notation):**\n\n**Common Complexities (Best to Worst):**\n• O(1) - Constant: Array access, Hash lookup\n• O(log n) - Logarithmic: Binary search, Balanced BST\n• O(n) - Linear: Linear search, Array traversal\n• O(n log n) - Linearithmic: Merge sort, Quick sort\n• O(n²) - Quadratic: Bubble sort, nested loops\n• O(2ⁿ) - Exponential: Recursive Fibonacci\n• O(n!) - Factorial: Permutations\n\n**Rules:**\n• Drop constants: O(2n) → O(n)\n• Drop lower terms: O(n² + n) → O(n²)\n• Different inputs use different variables: O(a + b)\n\n**Space Complexity:** Memory used by algorithm\n\n**Quick Check:** Count nested loops - usually indicates the complexity!\n\nNeed help analyzing a specific algorithm?"
    }

    // Programming Concepts
    if (q.includes('recursion')) {
      return "**Recursion** is when a function calls itself.\n\n**Key Components:**\n1. **Base Case:** Stopping condition\n2. **Recursive Case:** Function calls itself with modified parameters\n\n**Classic Examples:**\n• Factorial: n! = n * (n-1)!\n• Fibonacci: fib(n) = fib(n-1) + fib(n-2)\n• Tree traversal\n• Backtracking problems\n\n**When to Use:**\n• Problem can be broken into similar subproblems\n• Tree/graph traversal\n• Divide and conquer algorithms\n\n**Pitfall:** Stack overflow if no proper base case!\n\n**Optimization:** Use memoization to avoid recalculating same values.\n\n**Recursion vs Iteration:** Recursion is elegant but uses more memory. Convert to iteration if stack overflow occurs.\n\nWant examples of recursion problems?"
    }

    if (q.includes('dynamic programming') || q.includes('dp')) {
      return "**Dynamic Programming (DP)** solves problems by breaking them into overlapping subproblems.\n\n**Two Approaches:**\n1. **Top-Down (Memoization):**\n   - Start with original problem\n   - Recursively solve subproblems\n   - Cache results\n\n2. **Bottom-Up (Tabulation):**\n   - Start with smallest subproblems\n   - Build up to original problem\n   - Use array/table to store results\n\n**Classic Problems:**\n• Fibonacci numbers\n• Climbing stairs\n• Coin change\n• Longest common subsequence\n• 0/1 Knapsack\n\n**Steps to Solve:**\n1. Identify if problem has overlapping subproblems\n2. Define state (what changes between subproblems)\n3. Write recurrence relation\n4. Implement with memoization or tabulation\n\n**Example:** Fibonacci with DP is O(n) vs O(2ⁿ) without!\n\nWant to see a DP problem walkthrough?"
    }

    // Databases
    if (q.includes('database') || q.includes('sql')) {
      return "**Database Basics:**\n\n**SQL vs NoSQL:**\n• SQL: Structured, ACID, Relational (MySQL, PostgreSQL)\n• NoSQL: Flexible, Scalable, Document/Key-Value (MongoDB, Redis)\n\n**Key Concepts:**\n• **Primary Key:** Unique identifier\n• **Foreign Key:** Links tables\n• **Index:** Speeds up queries\n• **Normalization:** Organizing data efficiently\n\n**Common Operations:**\n```sql\nSELECT * FROM users WHERE age > 18;\nINSERT INTO users VALUES (1, 'John', 25);\nUPDATE users SET age = 26 WHERE id = 1;\nDELETE FROM users WHERE id = 1;\n```\n\n**Joins:**\n• INNER JOIN: Matching rows from both tables\n• LEFT JOIN: All from left + matching from right\n• RIGHT JOIN: All from right + matching from left\n\nNeed help with specific SQL queries?"
    }

    // OOP
    if (q.includes('oop') || q.includes('object oriented')) {
      return "**Object-Oriented Programming (OOP):**\n\n**Four Pillars:**\n\n1. **Encapsulation:**\n   - Bundle data and methods together\n   - Hide internal details\n   - Use private/public access modifiers\n\n2. **Inheritance:**\n   - Create new classes from existing ones\n   - Code reuse\n   - IS-A relationship\n\n3. **Polymorphism:**\n   - Same interface, different implementations\n   - Method overriding (runtime)\n   - Method overloading (compile-time)\n\n4. **Abstraction:**\n   - Hide complex implementation\n   - Show only essential features\n   - Abstract classes and interfaces\n\n**Benefits:**\n• Code reusability\n• Easy maintenance\n• Modularity\n• Flexibility\n\n**Real Example:** Vehicle → Car, Bike (inheritance)\n\nWant to see code examples?"
    }

    // Graph
    if (q.includes('graph')) {
      return "**Graphs** consist of vertices (nodes) and edges connecting them.\n\n**Types:**\n• Directed vs Undirected\n• Weighted vs Unweighted\n• Cyclic vs Acyclic\n\n**Representations:**\n1. **Adjacency Matrix:** 2D array - O(V²) space\n2. **Adjacency List:** Array of lists - O(V+E) space\n\n**Traversals:**\n• **BFS (Breadth-First):** Level by level, uses queue\n  - Shortest path in unweighted graph\n  - O(V+E) time\n\n• **DFS (Depth-First):** Go deep, uses stack/recursion\n  - Cycle detection\n  - Topological sort\n  - O(V+E) time\n\n**Applications:**\n• Social networks\n• Maps and navigation\n• Web crawling\n• Recommendation systems\n\nInterested in shortest path algorithms (Dijkstra, Bellman-Ford)?"
    }

    // Default response with suggestions
    return `I'd be happy to help! I can answer questions about:\n\n**Data Structures:**\n• Arrays, Linked Lists, Stacks, Queues\n• Trees, Graphs, Hash Tables\n• Heaps, Tries\n\n**Algorithms:**\n• Sorting (Bubble, Merge, Quick, etc.)\n• Searching (Linear, Binary)\n• Graph algorithms (BFS, DFS, Dijkstra)\n• Dynamic Programming\n\n**Programming Concepts:**\n• OOP (Object-Oriented Programming)\n• Recursion\n• Time & Space Complexity\n\n**Other Topics:**\n• Databases and SQL\n• System Design basics\n• Problem-solving strategies\n\nTry asking: "What is a linked list?" or "Explain binary search" or "What is time complexity?"`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    // Simulate AI response (in production, this would call an AI API)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(input),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setLoading(false)
    }, 1000)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading chatbot...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'STUDENT') return null

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 h-[calc(100vh-200px)] flex flex-col">
        {/* Header */}
        <div className="bg-white rounded-t-lg shadow-md p-4 sm:p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl sm:text-2xl">🤖</span>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">CSE Learning Assistant</h1>
              <p className="text-xs sm:text-sm text-gray-600">Ask me anything about Computer Science!</p>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 bg-white overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-lg p-3 sm:p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm sm:text-base whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </p>
                <p className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-b-lg shadow-md p-3 sm:p-4 border-t">
          <div className="flex space-x-2 sm:space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about Data Structures, Algorithms, etc..."
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm sm:text-base font-medium"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Try: "What is a binary tree?" or "Explain quick sort" or "What is Big O?"
          </p>
        </form>
      </div>
    </div>
  )
}
