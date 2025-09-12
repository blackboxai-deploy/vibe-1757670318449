"use client";

import React from "react";

export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-2">
      <div className="bg-white px-4 py-3 rounded-lg rounded-tl-none shadow-sm max-w-[80%]">
        <div className="flex items-center space-x-1">
          <span className="text-sm text-gray-600 mr-2">AI is typing</span>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}