import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { analyzeWeakAreas, getTopicRecommendations } from '@/lib/slm'
import { getRecommendations, generateStudyPlan } from '@/lib/rag'

// GET personalized recommendations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'recommendations'

    if (type === 'weak-areas') {
      // Analyze weak areas using SLM
      const weakAreas = await analyzeWeakAreas(session.user.id)
      
      return NextResponse.json({
        weakAreas,
        summary: {
          totalTopics: weakAreas.length,
          criticalTopics: weakAreas.filter(area => area.correctRate < 0.5).length,
          improvingTopics: weakAreas.filter(area => area.trend === 'improving').length
        }
      })
    }

    if (type === 'study-plan') {
      // Generate study plan
      const weakAreas = await analyzeWeakAreas(session.user.id)
      const weakTopics = await getTopicRecommendations(weakAreas)
      const studyPlan = await generateStudyPlan(weakTopics, session.user.id)
      
      return NextResponse.json({
        studyPlan,
        totalTime: studyPlan.reduce((sum, item) => sum + item.estimatedTime, 0),
        topicsCount: studyPlan.length
      })
    }

    // Default: Get recommendations using RAG
    const weakAreas = await analyzeWeakAreas(session.user.id)
    const weakTopics = await getTopicRecommendations(weakAreas)
    
    if (weakTopics.length === 0) {
      return NextResponse.json({
        message: 'No weak areas detected. Keep up the great work!',
        recommendations: []
      })
    }

    const recommendations = await getRecommendations(weakTopics)
    
    return NextResponse.json({
      weakTopics,
      recommendations,
      message: `Found ${recommendations.length} personalized recommendations for your weak areas`
    })
  } catch (error) {
    console.error('Error generating recommendations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST search knowledge base
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { query } = body

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    const { searchKnowledgeBase } = await import('@/lib/rag')
    const results = await searchKnowledgeBase(query, 10)

    return NextResponse.json({
      query,
      results,
      count: results.length
    })
  } catch (error) {
    console.error('Error searching knowledge base:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
