import { prisma } from './prisma'

export interface Recommendation {
  id: string
  topic: string
  subtopic: string
  content: string
  difficulty: string
  resources: string[]
  relevanceScore: number
}

export async function getRecommendations(
  weakTopics: string[],
  userLevel: string = 'MEDIUM'
): Promise<Recommendation[]> {
  try {
    if (weakTopics.length === 0) {
      return []
    }

    // Retrieve relevant knowledge base entries
    const knowledgeEntries = await prisma.knowledgeBase.findMany({
      where: {
        OR: [
          { topic: { in: weakTopics } },
          { subtopic: { in: weakTopics } },
          { tags: { hasSome: weakTopics } }
        ],
        difficulty: {
          in: getDifficultyRange(userLevel)
        }
      },
      take: 10
    })

    // Calculate relevance scores using simple keyword matching
    const recommendations: Recommendation[] = knowledgeEntries.map(entry => {
      let relevanceScore = 0
      
      // Exact topic match gets highest score
      if (weakTopics.includes(entry.topic)) {
        relevanceScore += 10
      }
      
      // Subtopic match
      if (weakTopics.includes(entry.subtopic)) {
        relevanceScore += 7
      }
      
      // Tag matches
      const matchingTags = entry.tags.filter(tag => weakTopics.includes(tag))
      relevanceScore += matchingTags.length * 3

      // Difficulty match bonus
      if (entry.difficulty === userLevel) {
        relevanceScore += 2
      }

      return {
        id: entry.id,
        topic: entry.topic,
        subtopic: entry.subtopic,
        content: entry.content,
        difficulty: entry.difficulty,
        resources: entry.resources,
        relevanceScore
      }
    })

    // Sort by relevance score
    return recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore)
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    return []
  }
}

export async function searchKnowledgeBase(
  query: string,
  limit: number = 5
): Promise<Recommendation[]> {
  try {
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2)
    
    const results = await prisma.knowledgeBase.findMany({
      where: {
        OR: [
          { topic: { contains: query, mode: 'insensitive' } },
          { subtopic: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: limit
    })

    return results.map(entry => ({
      id: entry.id,
      topic: entry.topic,
      subtopic: entry.subtopic,
      content: entry.content,
      difficulty: entry.difficulty,
      resources: entry.resources,
      relevanceScore: calculateRelevance(entry, searchTerms)
    })).sort((a, b) => b.relevanceScore - a.relevanceScore)
  } catch (error) {
    console.error('Error searching knowledge base:', error)
    return []
  }
}

function getDifficultyRange(userLevel: string): string[] {
  switch (userLevel) {
    case 'EASY':
      return ['EASY', 'MEDIUM']
    case 'MEDIUM':
      return ['EASY', 'MEDIUM', 'HARD']
    case 'HARD':
      return ['MEDIUM', 'HARD']
    default:
      return ['EASY', 'MEDIUM', 'HARD']
  }
}

function calculateRelevance(
  entry: {
    topic: string
    subtopic: string
    content: string
    tags: string[]
  },
  searchTerms: string[]
): number {
  let score = 0
  const combinedText = `${entry.topic} ${entry.subtopic} ${entry.content} ${entry.tags.join(' ')}`.toLowerCase()

  searchTerms.forEach(term => {
    const occurrences = (combinedText.match(new RegExp(term, 'g')) || []).length
    score += occurrences
  })

  return score
}

export async function generateStudyPlan(
  weakTopics: string[],
  userId: string
): Promise<{
  topic: string
  priority: number
  estimatedTime: number
  resources: string[]
}[]> {
  const recommendations = await getRecommendations(weakTopics)
  
  // Group by topic and calculate priority
  const topicMap = new Map<string, {
    priority: number
    resources: Set<string>
    count: number
  }>()

  recommendations.forEach((rec, index) => {
    if (!topicMap.has(rec.topic)) {
      topicMap.set(rec.topic, {
        priority: 0,
        resources: new Set(),
        count: 0
      })
    }

    const topicData = topicMap.get(rec.topic)!
    topicData.priority += (10 - index) // Higher priority for earlier recommendations
    topicData.count++
    rec.resources.forEach(resource => topicData.resources.add(resource))
  })

  // Convert to study plan
  const studyPlan = Array.from(topicMap.entries()).map(([topic, data]) => ({
    topic,
    priority: data.priority,
    estimatedTime: data.count * 30, // 30 minutes per resource
    resources: Array.from(data.resources)
  }))

  return studyPlan.sort((a, b) => b.priority - a.priority)
}
