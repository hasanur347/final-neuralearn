import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateQuizScore, identifyWeakTopics } from '@/lib/slm'
import { z } from 'zod'

const submitAttemptSchema = z.object({
  quizId: z.string(),
  answers: z.record(z.number()),
  timeSpent: z.number()
})

// GET user's quiz attempts
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const quizId = searchParams.get('quizId')
    const userId = searchParams.get('userId') || session.user.id

    const where: any = { userId }
    if (quizId) {
      where.quizId = quizId
    }

    const attempts = await prisma.quizAttempt.findMany({
      where,
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            topic: true,
            difficulty: true
          }
        }
      },
      orderBy: { completedAt: 'desc' }
    })

    return NextResponse.json(attempts)
  } catch (error) {
    console.error('Error fetching attempts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST submit quiz attempt
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = submitAttemptSchema.parse(body)

    // Get quiz with questions
    const quiz = await prisma.quiz.findUnique({
      where: { id: validatedData.quizId },
      include: { questions: true }
    })

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    // Calculate score
    const { score, correctAnswers, totalQuestions } = calculateQuizScore(
      validatedData.answers,
      quiz.questions
    )

    // Identify weak topics
    const weakAreas = identifyWeakTopics(validatedData.answers, quiz.questions)

    // Save attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId: validatedData.quizId,
        userId: session.user.id,
        answers: validatedData.answers,
        score,
        totalQuestions,
        correctAnswers,
        weakAreas,
        timeSpent: validatedData.timeSpent
      },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            topic: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Quiz attempt submitted successfully',
      attempt,
      results: {
        score,
        correctAnswers,
        totalQuestions,
        weakAreas,
        passed: score >= 60
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error submitting attempt:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
