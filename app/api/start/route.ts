import { NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'

export async function GET() {
  try {
    const jsonDirectory = path.join(process.cwd(), 'json')
    const fileContents = await fs.readFile(jsonDirectory + '/questions.json', 'utf8')
    const questions = JSON.parse(fileContents)

    const shuffledQuestions = questions.sort(() => 0.5 - Math.random())
    const selectedQuestions = shuffledQuestions.slice(0, 5)

    return NextResponse.json({
      quizId: Date.now().toString(),
      questions: selectedQuestions
    })
  } catch (error) {
    console.error('Error starting quiz:', error)
    return NextResponse.json({ error: 'Failed to start quiz' }, { status: 500 })
  }
}