import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Validation helper functions
function validateQuizData(data: any) {
  if (!data.title || data.title.length < 3) {
    throw new Error('Title must be at least 3 characters')
  }
  if (!data.topic || data.topic.length < 2) {
    throw new Error('Topic must be at least 2 characters')
  }
  if (!Array.isArray(data.questions) || data.questions.length === 0) {
    throw new Error('Quiz must have at least one question')
  }
  
  // Validate each question
  data.questions.forEach((q: any, index: number) => {
    if (!q.question || q.question.length < 3) {
      throw new Error(`Question ${index + 1}: Question text is required`)
    }
    if (!Array.isArray(q.options) || q.options.length < 2) {
      throw new Error(`Question ${index + 1}: Must have at least 2 options`)
    }
    if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
      throw new Error(`Question ${index + 1}: Invalid correct answer index`)
    }
    if (!q.topic) {
      throw new Error(`Question ${index + 1}: Topic is required`)
    }
  })
}

// GET all quizzes or single quiz
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const quizId = searchParams.get('id')

    if (quizId) {
      // Get single quiz with questions
      const quiz = await prisma.quiz.findUnique({
        where: { id: quizId },
        include: {
          questions: true,
          instructor: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          _count: {
            select: { attempts: true }
          }
        }
      })

      if (!quiz) {
        return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
      }

      return NextResponse.json(quiz)
    }

    // Get all published quizzes
    const quizzes = await prisma.quiz.findMany({
      where: { isPublished: true },
      include: {
        instructor: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: { 
            questions: true,
            attempts: true 
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(quizzes)
  } catch (error) {
    console.error('Error fetching quizzes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create new quiz (Instructor/Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['INSTRUCTOR', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized. Only instructors can create quizzes.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    // Validate data
    try {
      validateQuizData(body)
    } catch (validationError: any) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validationError.message },
        { status: 400 }
      )
    }

    // Create quiz with questions
    const quiz = await prisma.quiz.create({
      data: {
        title: body.title,
        description: body.description || null,
        topic: body.topic,
        difficulty: body.difficulty || 'MEDIUM',
        duration: body.duration || 30,
        instructorId: session.user.id,
        questions: {
          create: body.questions.map((q: any) => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || null,
            topic: q.topic,
            difficulty: q.difficulty || 'MEDIUM'
          }))
        }
      },
      include: {
        questions: true
      }
    })

    return NextResponse.json(
      { message: 'Quiz created successfully', quiz },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating quiz:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE quiz (Instructor/Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['INSTRUCTOR', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const quizId = searchParams.get('id')

    if (!quizId) {
      return NextResponse.json({ error: 'Quiz ID required' }, { status: 400 })
    }

    // Check if user owns the quiz or is admin
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId }
    })

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    if (quiz.instructorId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await prisma.quiz.delete({
      where: { id: quizId }
    })

    return NextResponse.json({ message: 'Quiz deleted successfully' })
  } catch (error) {
    console.error('Error deleting quiz:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}