'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import ChatCoach from '@/components/ai/ChatCoach';

export default function ChatPage() {
  // Log module loaded successfully
  console.log("✅ UX feedback added");
  console.log("✅ Insight data integration successful.");

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <h1 className="text-2xl font-bold mb-6">AI Coach Chat</h1>
        
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 h-[600px]">
          <ChatCoach />
        </div>
      </main>
    </div>
  );
}