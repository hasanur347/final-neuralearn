import { prisma } from './prisma'

export interface WeakAreaAnalysis {
  topic: string
  correctRate: number
  totalAttempts: number
  averageScore: number
  trend: 'improving' | 'declining' | 'stable'
}

export async function analyzeWeakAreas(userId: string): Promise<WeakAreaAnalysis[]> {
  try {
    // Get all quiz attempts for the user
    const attempts = await prisma.quizAttempt.findMany({
      where: { userId },
      include: {
        quiz: {
          include: {
            questions: true
          }
        }
      },
      orderBy: { completedAt: 'desc' }
    })

    if (attempts.length === 0) {
      return []
    }

    // Aggregate performance by topic
    const topicPerformance = new Map<string, {
      correct: number
      total: number
      scores: number[]
      timestamps: Date[]
    }>()

    attempts.forEach(attempt => {
      const topic = attempt.quiz.topic
      const answers = attempt.answers as Record<string, number>
      
      if (!topicPerformance.has(topic)) {
        topicPerformance.set(topic, {
          correct: 0,
          total: 0,
          scores: [],
          timestamps: []
        })
      }

      const topicData = topicPerformance.get(topic)!
      topicData.correct += attempt.correctAnswers
      topicData.total += attempt.totalQuestions
      topicData.scores.push(attempt.score)
      topicData.timestamps.push(attempt.completedAt)
    })

    // Calculate weak areas and trends
    const weakAreas: WeakAreaAnalysis[] = []

    topicPerformance.forEach((data, topic) => {
      const correctRate = data.correct / data.total
      const averageScore = data.scores.reduce((a, b) => a + b, 0) / data.scores.length

      // Determine trend
      let trend: 'improving' | 'declining' | 'stable' = 'stable'
      if (data.scores.length >= 2) {
        const recentScores = data.scores.slice(0, Math.min(3, data.scores.length))
        const olderScores = data.scores.slice(Math.min(3, data.scores.length))
        
        if (olderScores.length > 0) {
          const recentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length
          const olderAvg = olderScores.reduce((a, b) => a + b, 0) / olderScores.length
          
          if (recentAvg > olderAvg + 5) trend = 'improving'
          else if (recentAvg < olderAvg - 5) trend = 'declining'
        }
      }

      weakAreas.push({
        topic,
        correctRate: Math.round(correctRate * 100) / 100,
        totalAttempts: data.scores.length,
        averageScore: Math.round(averageScore * 100) / 100,
        trend
      })
    })

    // Sort by correct rate (ascending) to show weakest areas first
    return weakAreas.sort((a, b) => a.correctRate - b.correctRate)
  } catch (error) {
    console.error('Error analyzing weak areas:', error)
    return []
  }
}

export async function getTopicRecommendations(weakAreas: WeakAreaAnalysis[]): Promise<string[]> {
  // Return topics that need improvement (correct rate < 70%)
  return weakAreas
    .filter(area => area.correctRate < 0.7)
    .map(area => area.topic)
    .slice(0, 5) // Top 5 weak areas
}

export function calculateQuizScore(
  answers: Record<string, number>,
  questions: Array<{ id: string; correctAnswer: number }>
): { score: number; correctAnswers: number; totalQuestions: number } {
  let correctAnswers = 0
  const totalQuestions = questions.length

  questions.forEach(question => {
    const userAnswer = answers[question.id]
    if (userAnswer === question.correctAnswer) {
      correctAnswers++
    }
  })

  const score = (correctAnswers / totalQuestions) * 100

  return {
    score: Math.round(score * 100) / 100,
    correctAnswers,
    totalQuestions
  }
}

export function identifyWeakTopics(
  answers: Record<string, number>,
  questions: Array<{ id: string; correctAnswer: number; topic: string }>
): string[] {
  const topicPerformance = new Map<string, { correct: number; total: number }>()

  questions.forEach(question => {
    const userAnswer = answers[question.id]
    const isCorrect = userAnswer === question.correctAnswer

    if (!topicPerformance.has(question.topic)) {
      topicPerformance.set(question.topic, { correct: 0, total: 0 })
    }

    const performance = topicPerformance.get(question.topic)!
    performance.total++
    if (isCorrect) performance.correct++
  })

  // Identify topics with < 60% correct rate
  const weakTopics: string[] = []
  topicPerformance.forEach((performance, topic) => {
    const correctRate = performance.correct / performance.total
    if (correctRate < 0.6) {
      weakTopics.push(topic)
    }
  })

  return weakTopics
}
