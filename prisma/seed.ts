import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create users
  console.log('Creating users...')
  
  const adminPassword = await bcrypt.hash('password123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN'
    }
  })
  console.log('✓ Admin created:', admin.email)

  const instructorPassword = await bcrypt.hash('password123', 10)
  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@demo.com' },
    update: {},
    create: {
      email: 'instructor@demo.com',
      name: 'Dr. Sarah Johnson',
      password: instructorPassword,
      role: 'INSTRUCTOR'
    }
  })
  console.log('✓ Instructor created:', instructor.email)

  const studentPassword = await bcrypt.hash('password123', 10)
  const student = await prisma.user.upsert({
    where: { email: 'student@demo.com' },
    update: {},
    create: {
      email: 'student@demo.com',
      name: 'John Doe',
      password: studentPassword,
      role: 'STUDENT'
    }
  })
  console.log('✓ Student created:', student.email)

  // Create quizzes
  console.log('Creating quizzes...')

  const dataStructuresQuiz = await prisma.quiz.create({
    data: {
      title: 'Data Structures Fundamentals',
      description: 'Test your knowledge of basic data structures including arrays, linked lists, stacks, and queues.',
      topic: 'Data Structures',
      difficulty: 'MEDIUM',
      duration: 30,
      instructorId: instructor.id,
      isPublished: true,
      questions: {
        create: [
          {
            question: 'What is the time complexity of accessing an element in an array by index?',
            options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
            correctAnswer: 0,
            explanation: 'Array access by index is constant time O(1) because arrays store elements in contiguous memory locations.',
            topic: 'Arrays',
            difficulty: 'EASY'
          },
          {
            question: 'Which data structure uses LIFO (Last In First Out) principle?',
            options: ['Queue', 'Stack', 'Linked List', 'Tree'],
            correctAnswer: 1,
            explanation: 'Stack follows LIFO principle where the last element added is the first one to be removed.',
            topic: 'Stack',
            difficulty: 'EASY'
          },
          {
            question: 'What is the worst-case time complexity of inserting an element at the beginning of a singly linked list?',
            options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
            correctAnswer: 0,
            explanation: 'Inserting at the beginning of a linked list takes constant time O(1) as we only need to adjust the head pointer.',
            topic: 'Linked Lists',
            difficulty: 'MEDIUM'
          },
          {
            question: 'In a circular queue with size 5, if front = 2 and rear = 4, how many elements are in the queue?',
            options: ['2', '3', '4', '5'],
            correctAnswer: 1,
            explanation: 'The number of elements is calculated as (rear - front + 1) = (4 - 2 + 1) = 3 elements.',
            topic: 'Queue',
            difficulty: 'MEDIUM'
          },
          {
            question: 'Which operation is NOT typically supported by a stack?',
            options: ['Push', 'Pop', 'Peek', 'Random Access'],
            correctAnswer: 3,
            explanation: 'Stacks do not support random access. You can only access the top element.',
            topic: 'Stack',
            difficulty: 'EASY'
          }
        ]
      }
    },
    include: { questions: true }
  })
  console.log('✓ Quiz created:', dataStructuresQuiz.title)

  const algorithmsQuiz = await prisma.quiz.create({
    data: {
      title: 'Algorithm Analysis and Complexity',
      description: 'Evaluate your understanding of algorithm complexity, Big O notation, and common algorithms.',
      topic: 'Algorithms',
      difficulty: 'HARD',
      duration: 45,
      instructorId: instructor.id,
      isPublished: true,
      questions: {
        create: [
          {
            question: 'What is the time complexity of Binary Search?',
            options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
            correctAnswer: 1,
            explanation: 'Binary Search divides the search space in half at each step, resulting in O(log n) complexity.',
            topic: 'Searching',
            difficulty: 'MEDIUM'
          },
          {
            question: 'Which sorting algorithm has the best average-case time complexity?',
            options: ['Bubble Sort', 'Insertion Sort', 'Merge Sort', 'Selection Sort'],
            correctAnswer: 2,
            explanation: 'Merge Sort has O(n log n) average-case complexity, which is better than O(n²) for bubble, insertion, and selection sort.',
            topic: 'Sorting',
            difficulty: 'HARD'
          },
          {
            question: 'What does Big O notation represent?',
            options: [
              'Best case time complexity',
              'Average case time complexity',
              'Worst case time complexity',
              'Space complexity only'
            ],
            correctAnswer: 2,
            explanation: 'Big O notation typically represents the upper bound or worst-case time complexity of an algorithm.',
            topic: 'Complexity Analysis',
            difficulty: 'MEDIUM'
          },
          {
            question: 'Which algorithm design paradigm does Quick Sort use?',
            options: ['Greedy', 'Dynamic Programming', 'Divide and Conquer', 'Backtracking'],
            correctAnswer: 2,
            explanation: 'Quick Sort uses Divide and Conquer by partitioning the array and recursively sorting subarrays.',
            topic: 'Sorting',
            difficulty: 'HARD'
          },
          {
            question: 'What is the space complexity of recursive Fibonacci implementation?',
            options: ['O(1)', 'O(log n)', 'O(n)', 'O(2^n)'],
            correctAnswer: 2,
            explanation: 'The recursive call stack can go up to n levels deep, making space complexity O(n).',
            topic: 'Recursion',
            difficulty: 'HARD'
          }
        ]
      }
    },
    include: { questions: true }
  })
  console.log('✓ Quiz created:', algorithmsQuiz.title)

  // Create knowledge base entries
  console.log('Creating knowledge base entries...')

  const knowledgeEntries = [
    {
      topic: 'Data Structures',
      subtopic: 'Arrays',
      content: 'Arrays are fundamental data structures that store elements in contiguous memory locations. They provide O(1) access time but require shifting elements for insertions and deletions in the middle. Understanding array operations is crucial for efficient algorithm design.',
      difficulty: 'EASY',
      resources: [
        'https://www.geeksforgeeks.org/array-data-structure/',
        'https://www.youtube.com/watch?v=gDqQf4Ekr2A'
      ],
      tags: ['arrays', 'data structures', 'fundamentals']
    },
    {
      topic: 'Data Structures',
      subtopic: 'Linked Lists',
      content: 'Linked lists are dynamic data structures where each element (node) contains data and a reference to the next node. They excel at insertions and deletions but have O(n) access time. Master both singly and doubly linked lists for comprehensive understanding.',
      difficulty: 'MEDIUM',
      resources: [
        'https://www.geeksforgeeks.org/data-structures/linked-list/',
        'https://visualgo.net/en/list'
      ],
      tags: ['linked lists', 'data structures', 'pointers']
    },
    {
      topic: 'Data Structures',
      subtopic: 'Stack',
      content: 'Stacks follow LIFO (Last In First Out) principle. Common operations include push, pop, and peek, all with O(1) complexity. Stacks are essential for function call management, expression evaluation, and backtracking algorithms.',
      difficulty: 'EASY',
      resources: [
        'https://www.geeksforgeeks.org/stack-data-structure/',
        'https://www.tutorialspoint.com/data_structures_algorithms/stack_algorithm.htm'
      ],
      tags: ['stack', 'data structures', 'LIFO']
    },
    {
      topic: 'Data Structures',
      subtopic: 'Queue',
      content: 'Queues implement FIFO (First In First Out) principle. They support enqueue, dequeue, and front operations. Variations include circular queues, priority queues, and deques. Understanding queues is vital for BFS, scheduling, and buffering.',
      difficulty: 'MEDIUM',
      resources: [
        'https://www.geeksforgeeks.org/queue-data-structure/',
        'https://www.programiz.com/dsa/queue'
      ],
      tags: ['queue', 'data structures', 'FIFO']
    },
    {
      topic: 'Algorithms',
      subtopic: 'Searching',
      content: 'Searching algorithms locate specific elements in data structures. Linear search has O(n) complexity while binary search achieves O(log n) on sorted arrays. Understanding search algorithms is fundamental to efficient data retrieval.',
      difficulty: 'MEDIUM',
      resources: [
        'https://www.geeksforgeeks.org/searching-algorithms/',
        'https://www.khanacademy.org/computing/computer-science/algorithms'
      ],
      tags: ['searching', 'algorithms', 'binary search']
    },
    {
      topic: 'Algorithms',
      subtopic: 'Sorting',
      content: 'Sorting algorithms arrange data in a specific order. Common algorithms include Bubble Sort (O(n²)), Merge Sort (O(n log n)), and Quick Sort (O(n log n) average). Each has trade-offs between time complexity, space complexity, and stability.',
      difficulty: 'HARD',
      resources: [
        'https://www.geeksforgeeks.org/sorting-algorithms/',
        'https://visualgo.net/en/sorting'
      ],
      tags: ['sorting', 'algorithms', 'complexity']
    },
    {
      topic: 'Algorithms',
      subtopic: 'Complexity Analysis',
      content: 'Big O notation describes algorithm efficiency in terms of input size. Common complexities include O(1), O(log n), O(n), O(n log n), and O(n²). Understanding time and space complexity is essential for writing efficient code.',
      difficulty: 'MEDIUM',
      resources: [
        'https://www.bigocheatsheet.com/',
        'https://www.youtube.com/watch?v=g2o22C3CRfU'
      ],
      tags: ['complexity', 'big-o', 'algorithms']
    },
    {
      topic: 'Algorithms',
      subtopic: 'Recursion',
      content: 'Recursion involves functions calling themselves to solve problems by breaking them into smaller subproblems. Key concepts include base cases, recursive cases, and call stack management. Recursion is powerful but requires careful consideration of space complexity.',
      difficulty: 'HARD',
      resources: [
        'https://www.geeksforgeeks.org/recursion/',
        'https://www.khanacademy.org/computing/computer-science/algorithms/recursive-algorithms'
      ],
      tags: ['recursion', 'algorithms', 'divide-and-conquer']
    }
  ]

  for (const entry of knowledgeEntries) {
    await prisma.knowledgeBase.create({ data: entry })
  }
  console.log(`✓ Created ${knowledgeEntries.length} knowledge base entries`)

  console.log('✅ Database seeded successfully!')
  console.log('\n📋 Demo Accounts:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Admin:      admin@demo.com / password123')
  console.log('Instructor: instructor@demo.com / password123')
  console.log('Student:    student@demo.com / password123')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
