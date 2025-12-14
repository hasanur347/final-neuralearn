import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createTopicSchema = z.object({
  subjectId: z.string(),
  name: z.string().min(2),
  description: z.string().optional(),
  orderIndex: z.number().optional()
})

// GET topics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subjectId = searchParams.get('subjectId')

    const where = subjectId ? { subjectId } : {}

    const topics = await prisma.topic.findMany({
      where,
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
        _count: {
          select: {
            quizzes: true,
            resources: true,
            knowledgeBase: true
          }
        }
      },
      orderBy: { orderIndex: 'asc' }
    })

    return NextResponse.json(topics)
  } catch (error) {
    console.error('Error fetching topics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create topic (Instructor/Admin)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['INSTRUCTOR', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized. Only instructors can create topics.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = createTopicSchema.parse(body)

    const topic = await prisma.topic.create({
      data: validatedData,
      include: {
        subject: true,
        _count: {
          select: {
            quizzes: true,
            resources: true
          }
        }
      }
    })

    return NextResponse.json(
      { message: 'Topic created successfully', topic },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating topic:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT update topic
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['INSTRUCTOR', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Topic ID required' }, { status: 400 })
    }

    const body = await request.json()
    const validatedData = createTopicSchema.partial().parse(body)

    const topic = await prisma.topic.update({
      where: { id },
      data: validatedData,
      include: {
        subject: true
      }
    })

    return NextResponse.json({ message: 'Topic updated successfully', topic })
  } catch (error) {
    console.error('Error updating topic:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE topic
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['INSTRUCTOR', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Topic ID required' }, { status: 400 })
    }

    await prisma.topic.delete({ where: { id } })

    return NextResponse.json({ message: 'Topic deleted successfully' })
  } catch (error) {
    console.error('Error deleting topic:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
