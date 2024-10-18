import React from 'react';
import dynamic from 'next/dynamic';

// Client-side only components
const ClientSideResults = dynamic(() => import('@/components/ui/ClientSideResults'), { ssr: false });

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-purple-200 flex flex-col">
      <div className="h-40 bg-cover bg-center" style={{backgroundImage: "url('top.png')"}}>
        {/* Content for the top section if needed */}
      </div>
      <div className="bg-white rounded-t-3xl flex-grow flex flex-col items-center pt-6 px-4 pb-4 shadow-xl">
        <ClientSideResults />
      </div>
    </div>
  );
}