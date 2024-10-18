import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswers: number[]
  image?: string
}

export async function POST(request: NextRequest) {
  try {
    const { questionId, selectedAnswers } = await request.json() as { questionId: number, selectedAnswers: number[] }

    const jsonDirectory = path.join(process.cwd(), 'json')
    const fileContents = await fs.readFile(jsonDirectory + '/questions.json', 'utf8')
    const questions = JSON.parse(fileContents) as Question[]

    const question = questions.find((q: Question) => q.id === questionId)

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    const isCorrect = JSON.stringify(selectedAnswers.sort()) === JSON.stringify(question.correctAnswers.sort())

    return NextResponse.json({ isCorrect })
  } catch (error) {
    console.error('Error checking answer:', error)
    return NextResponse.json({ error: 'Failed to check answer' }, { status: 500 })
  }
}