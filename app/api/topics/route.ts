import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const subjectId = searchParams.get('subjectId')
    const onlyActive = searchParams.get('active') === 'true'

    const where: any = {}
    
    if (subjectId) {
      where.subjectId = subjectId
    }
    
    if (onlyActive) {
      where.isActive = true
    }

    const topics = await prisma.topic.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            icon: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(topics)
  } catch (error) {
    console.error('Error fetching topics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch topics' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const topic = await prisma.topic.create({
      data: {
        name: body.name,
        description: body.description,
        difficulty: body.difficulty || 'MEDIUM',
        isActive: body.isActive ?? true,
        subjectId: body.subjectId
      },
      include: {
        subject: true
      }
    })

    return NextResponse.json(topic, { status: 201 })
  } catch (error) {
    console.error('Error creating topic:', error)
    return NextResponse.json(
      { error: 'Failed to create topic' },
      { status: 500 }
    )
  }
}