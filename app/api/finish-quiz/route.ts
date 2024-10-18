import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'

interface Question {
  id: number
  correctAnswers: number[]
}

interface QuizSubmission {
  quizId: string
  answers: {
    questionId: number
    selectedAnswers: number[]
  }[]
}

export async function POST(request: NextRequest) {
  try {
    const submission: QuizSubmission = await request.json()

    // Read questions from the JSON file
    const jsonDirectory = path.join(process.cwd(), 'json')
    const fileContents = await fs.readFile(jsonDirectory + '/questions.json', 'utf8')
    const questions = JSON.parse(fileContents) as Question[]

    let correctCount = 0
    let incorrectCount = 0

    submission.answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId)
      if (question) {
        const isCorrect = JSON.stringify(answer.selectedAnswers.sort()) === JSON.stringify(question.correctAnswers.sort())
        if (isCorrect) {
          correctCount++
        } else {
          incorrectCount++
        }
      }
    })

    return NextResponse.json({
      correct: correctCount,
      incorrect: incorrectCount,
      total: correctCount + incorrectCount
    })
  } catch (error) {
    console.error('Error finishing quiz:', error)
    return NextResponse.json({ error: 'Failed to finish quiz' }, { status: 500 })
  }
}