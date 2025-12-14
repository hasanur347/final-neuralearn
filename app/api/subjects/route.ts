import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const includeTopics = searchParams.get('includeTopics') === 'true'
    const onlyActive = searchParams.get('active') === 'true'

    const subjects = await prisma.subject.findMany({
      where: onlyActive ? { isActive: true } : undefined,
      include: includeTopics ? {
        topics: {
          where: { isActive: true }
        }
      } : undefined,
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(subjects)
  } catch (error) {
    console.error('Error fetching subjects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subjects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const subject = await prisma.subject.create({
      data: {
        name: body.name,
        description: body.description,
        icon: body.icon,
        isActive: body.isActive ?? true
      }
    })

    return NextResponse.json(subject, { status: 201 })
  } catch (error) {
    console.error('Error creating subject:', error)
    return NextResponse.json(
      { error: 'Failed to create subject' },
      { status: 500 }
    )
  }
}