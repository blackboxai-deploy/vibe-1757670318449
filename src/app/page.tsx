"use client";

import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0c1317] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg overflow-hidden shadow-2xl">
        <ChatInterface />
      </div>
    </div>
  );
}