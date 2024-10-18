'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const router = useRouter()

  const handleStartQuiz = () => {
    router.push('/quiz')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-100 flex flex-col items-center justify-between p-4">
      <div className="w-full max-w-md flex justify-start items-center pt-4">
        <span className="text-orange-500 font-semibold text-lg">quiz app</span>
      </div>
      
      <div className="flex-grow flex items-center justify-center">
        <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-lg">
          <span className="text-red-500 text-4xl font-bold">Quiz</span>
        </div>
      </div>
      
      <Button 
        onClick={handleStartQuiz}
        className="w-full max-w-xs bg-red-500 hover:bg-red-600 text-white py-3 rounded-full text-lg font-semibold mb-8"
      >
        Start Quiz
      </Button>
    </div>
  )
}