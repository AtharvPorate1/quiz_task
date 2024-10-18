"use client"
"use client"
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

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
  const [startTime, setStartTime] = useState(Date.now())
  const [score, setScore] = useState({ correct: 0, incorrect: 0 })
  const [totalTimeTaken, setTotalTimeTaken] = useState(0)

  useEffect(() => {
    fetch('/api/start')
      .then(response => response.json())
      .then(data => setQuizData(data))
      .catch(error => {
        console.error('Error fetching quiz data:', error)
        router.push('/')
      })
  }, [router])

  const handleSubmitAnswer = useCallback(async () => {
    if (!quizData) return

    const timeTaken = Date.now() - startTime
    setTotalTimeTaken(prev => prev + timeTaken)
    const currentQuestionData = quizData.questions[currentQuestion]

    try {
      const response = await fetch('/api/check-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: currentQuestionData.id,
          selectedAnswers,
          timeTaken
        })
      })

      const result = await response.json()

      if (result.isCorrect) {
        setScore(prevScore => ({
          ...prevScore,
          correct: prevScore.correct + 1
        }))
      } else {
        setScore(prevScore => ({
          ...prevScore,
          incorrect: prevScore.incorrect + 1
        }))
      }

      if (currentQuestion < quizData.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswers([])
        setTimeLeft(30)
      } else {
        setQuizCompleted(true)
      }
    } catch (error) {
      console.error('Error checking answer:', error)
    }
  }, [quizData, currentQuestion, selectedAnswers, startTime])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === 1) {
          // Auto-progress with random answer if time runs out
          if (selectedAnswers.length === 0 && quizData) {
            const randomAnswer = Math.floor(Math.random() * quizData.questions[currentQuestion].options.length)
            setSelectedAnswers([randomAnswer])
          }
          handleSubmitAnswer()
        }
        return prev > 0 ? prev - 1 : 0
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [currentQuestion, handleSubmitAnswer, quizData, selectedAnswers.length])

  useEffect(() => {
    setStartTime(Date.now())
  }, [currentQuestion])

  const handleAnswerSelect = (index: number) => {
    const newSelectedAnswers = selectedAnswers.includes(index)
      ? selectedAnswers.filter(i => i !== index)
      : [...selectedAnswers, index]
    setSelectedAnswers(newSelectedAnswers)
  }

  const handleSubmitQuiz = async () => {
    if (!quizData) return

    await fetch('/api/finish-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quizId: quizData.quizId,
        score,
        totalTimeTaken
      })
    })

    router.push(`/results?correct=${score.correct}&incorrect=${score.incorrect}&timeTaken=${totalTimeTaken}`)
  }

  if (!quizData) return <div className="flex justify-center items-center h-screen">Loading...</div>

  const question = quizData.questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-b bg-purple-200"  >
              <div className="h-40 bg-cover bg-center" style={{backgroundImage: "url('top.png')"}}/>

      <div className="max-w-md mx-auto p-4 pt-20 -translate-y-24">
        <div className="relative mb-8">
          <div className="absolute -top-16 z-30 bg-white rounded-full p-1 left-1/2 transform -translate-x-1/2 translate-y-6 w-32 h-32">
            <CircularProgressbar 
              value={timeLeft} 
              maxValue={30}
              styles={buildStyles({
                pathColor: timeLeft > 10 ? '#22c55e' : '#ef4444',
                trailColor: '#d1d5db',
              })}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24">
                <CircularProgressbar 
                  value={currentQuestion + 1} 
                  maxValue={quizData.questions.length} 
                  text={`${currentQuestion + 1}/${quizData.questions.length}`}
                  styles={buildStyles({
                    textColor: '#000',
                    pathColor: '#3b82f6',
                    trailColor: '#d1d5db',
                  })}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl  shadow-lg p-6 mb-20">
          <div className="max-h-[90vh] overflow-y-auto pb-4 translate-y-6">
            <h2 className="text-xl font-semibold mb-4">{question.question}</h2>
            {question.image && (
              <div className="mb-4">
                <Image src={question.image} alt="Question Image" width={400} height={200} layout="responsive" />
              </div>
            )}
            <div className="space-y-3">
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
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 z-20">
        <div className="max-w-md mx-auto">
          <Button 
            onClick={quizCompleted ? handleSubmitQuiz : handleSubmitAnswer}
            disabled={selectedAnswers.length === 0}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-full text-lg font-semibold transition-colors duration-200"
          >
            {quizCompleted ? 'Finish Quiz' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  )
}