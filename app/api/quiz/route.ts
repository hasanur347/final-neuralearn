import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createQuizSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  topic: z.string().min(2),
  difficulty: z.string().default('MEDIUM'),
  duration: z.number().default(30),
  questions: z.array(z.object({
    question: z.string(),
    options: z.array(z.string()).min(2),
    correctAnswer: z.number(),
    explanation: z.string().optional(),
    topic: z.string(),
    difficulty: z.string().default('MEDIUM')
  }))
})

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
    const validatedData = createQuizSchema.parse(body)

    // Create quiz with questions
    const quiz = await prisma.quiz.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        topic: validatedData.topic,
        difficulty: validatedData.difficulty,
        duration: validatedData.duration,
        instructorId: session.user.id,
        questions: {
          create: validatedData.questions
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating quiz:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
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
