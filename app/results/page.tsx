"use client"
import React, { useEffect } from 'react';
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import confetti from 'canvas-confetti';

const GaugeComponent = dynamic(() => import('react-gauge-component'), { ssr: false });

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const correct = parseInt(searchParams.get('correct') || '0');
  const incorrect = parseInt(searchParams.get('incorrect') || '0');
  const total = correct + incorrect;
  const score = total > 0 ? Math.round((correct / total) * 100) : 0;

  useEffect(() => {
    if (score > 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [score]);

  const handleStartAgain = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-purple-200 flex flex-col">
      <div className="h-40 bg-cover bg-center" style={{backgroundImage: "url('top.png')"}}>
  {/* Content */}
</div>
      <div className="bg-white rounded-t-3xl flex-grow flex flex-col items-center pt-6 px-4 pb-4 shadow-xl">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6">Your result</h1>
          
          <div className="w-full h-64 mb-6">
            <GaugeComponent
              arc={{
                nbSubArcs: 150,
                colorArray: ['#5BE12C', '#F5CD19', '#EA4228'].reverse(),
                width: 0.3,
                padding: 0.003
              }}
              value={score}
              maxValue={100}
              pointer={{
                color: '#345243',
                length: 0.80,
                width: 15,
                type: "arrow",
                elastic: true,
              }}
              labels={{
                valueLabel: {
                  formatTextValue: value => value + '%',
                  style: { fontSize: '40px', fill: '#000000' }
                }
              }}
            />
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center bg-green-100 rounded-xl p-4">
              <span className="text-green-600 text-lg font-medium flex items-center">
                <div className="w-4 h-4 rounded-full bg-green-500 mr-3"></div>
                Correct
              </span>
              <span className="text-green-600 text-xl font-bold">{correct}</span>
            </div>
            <div className="flex justify-between items-center bg-red-100 rounded-xl p-4">
              <span className="text-red-500 text-lg font-medium flex items-center">
                <div className="w-4 h-4 rounded-full bg-red-500 mr-3"></div>
                Incorrect
              </span>
              <span className="text-red-500 text-xl font-bold">{incorrect}</span>
            </div>
          </div>
          
          <Button 
            onClick={handleStartAgain}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-full text-xl font-semibold transition-colors duration-200"
          >
            Start Again
          </Button>
        </div>
      </div>
    </div>
  );
}