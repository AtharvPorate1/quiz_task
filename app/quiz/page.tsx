'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { CheckCircle, XCircle } from 'lucide-react'

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswers: number[]
  image?: string
}

interface QuizData {
  quizId: string
  questions: Question[]
}

export default function QuizPage() {
  const router = useRouter()
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(30)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [allAnswers, setAllAnswers] = useState<{questionId: number, selectedAnswers: number[]}[]>([])

  useEffect(() => {
    fetch('/api/start')
      .then(response => response.json())
      .then(data => setQuizData(data))
      .catch(error => {
        console.error('Error fetching quiz data:', error)
        router.push('/')
      })
  }, [router])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === 1) {
          handleSubmitAnswer()
        }
        return prev > 0 ? prev - 1 : 0
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [currentQuestion])

  const handleAnswerSelect = (index: number) => {
    const newSelectedAnswers = selectedAnswers.includes(index)
      ? selectedAnswers.filter(i => i !== index)
      : [...selectedAnswers, index]
    setSelectedAnswers(newSelectedAnswers)
  }

  const handleSubmitAnswer = async () => {
    if (!quizData) return

    const response = await fetch('/api/check-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId: quizData.questions[currentQuestion].id,
        selectedAnswers
      })
    })

    const result = await response.json()

    setIsCorrect(result.isCorrect)
    setShowFeedback(true)

    setAllAnswers([...allAnswers, {
      questionId: quizData.questions[currentQuestion].id,
      selectedAnswers
    }])

    setTimeout(() => {
      setShowFeedback(false)
      if (currentQuestion < quizData.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswers([])
        setTimeLeft(30)
      } else {
        setQuizCompleted(true)
      }
    }, 2000)
  }

  const handleSubmitQuiz = async () => {
    if (!quizData) return

    const response = await fetch('/api/finish-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quizId: quizData.quizId,
        answers: allAnswers
      })
    })

    const result = await response.json()
    router.push(`/results?correct=${result.correct}&incorrect=${result.incorrect}`)
  }

  if (!quizData) return <div className="flex justify-center items-center h-screen">Loading...</div>

  const question = quizData.questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-purple-200 p-4 flex flex-col">
      <div className="max-w-3xl w-full mx-auto flex-grow flex flex-col">
        <div className="w-20 h-20 mx-auto mb-4">
          <CircularProgressbar 
            value={timeLeft} 
            maxValue={30} 
            text={`${timeLeft}`}
            styles={buildStyles({
              textColor: '#000',
              pathColor: timeLeft > 10 ? '#22c55e' : '#ef4444',
              trailColor: '#d1d5db',
            })}
          />
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 flex-grow flex flex-col">
          <h2 className="text-xl font-semibold mb-4">{question.question}</h2>
          {question.image && (
            <div className="mb-4 flex justify-center">
              <Image 
                src={question.image} 
                alt="Question Image" 
                width={300} 
                height={200} 
                className="rounded-lg"
              />
            </div>
          )}
          <div className="space-y-3 flex-grow">
            {question.options.map((option, index) => (
              <button
                key={index}
                className={`w-full p-4 text-left rounded-lg border transition-colors duration-200 ${
                  selectedAnswers.includes(index) 
                    ? 'bg-blue-100 border-blue-500 text-blue-700' 
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleAnswerSelect(index)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <Button 
          onClick={quizCompleted ? handleSubmitQuiz : handleSubmitAnswer}
          disabled={selectedAnswers.length === 0}
          className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-full text-lg font-semibold transition-colors duration-200"
        >
          {quizCompleted ? 'Submit Quiz' : 'Submit Answer'}
        </Button>
        {showFeedback && (
          <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50`}>
            <div className={`bg-white rounded-full p-8 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
              {isCorrect ? (
                <CheckCircle size={64} />
              ) : (
                <XCircle size={64} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}