import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createSubjectSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2).max(10),
  description: z.string().optional()
})

// GET all subjects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeTopics = searchParams.get('includeTopics') === 'true'
    const onlyActive = searchParams.get('active') === 'true'

    const subjects = await prisma.subject.findMany({
      where: onlyActive ? { isActive: true } : undefined,
      include: includeTopics ? {
        topics: {
          orderBy: { orderIndex: 'asc' }
        },
        _count: {
          select: {
            quizzes: true,
            resources: true
          }
        }
      } : {
        _count: {
          select: {
            topics: true,
            quizzes: true,
            resources: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(subjects)
  } catch (error) {
    console.error('Error fetching subjects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create new subject (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Only admins can create subjects.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = createSubjectSchema.parse(body)

    // Check if subject already exists
    const existing = await prisma.subject.findFirst({
      where: {
        OR: [
          { name: validatedData.name },
          { code: validatedData.code }
        ]
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Subject with this name or code already exists' },
        { status: 400 }
      )
    }

    const subject = await prisma.subject.create({
      data: validatedData,
      include: {
        _count: {
          select: {
            topics: true,
            quizzes: true,
            resources: true
          }
        }
      }
    })

    return NextResponse.json(
      { message: 'Subject created successfully', subject },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating subject:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT update subject (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Subject ID required' }, { status: 400 })
    }

    const body = await request.json()
    const validatedData = createSubjectSchema.partial().parse(body)

    const subject = await prisma.subject.update({
      where: { id },
      data: validatedData,
      include: {
        _count: {
          select: {
            topics: true,
            quizzes: true,
            resources: true
          }
        }
      }
    })

    return NextResponse.json({ message: 'Subject updated successfully', subject })
  } catch (error) {
    console.error('Error updating subject:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE subject (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Subject ID required' }, { status: 400 })
    }

    await prisma.subject.delete({ where: { id } })

    return NextResponse.json({ message: 'Subject deleted successfully' })
  } catch (error) {
    console.error('Error deleting subject:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
