"use client";

import React from "react";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  showBookingForm?: boolean;
}

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} mb-2 animate-fade-in`}>
      <div
        className={`max-w-[80%] px-3 py-2 rounded-lg shadow-sm ${
          message.isBot
            ? 'bg-white text-gray-800 rounded-tl-none'
            : 'bg-[#dcf8c6] text-gray-800 rounded-tr-none'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        <div className={`flex items-center mt-1 ${message.isBot ? 'justify-start' : 'justify-end'}`}>
          <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
          {!message.isBot && (
            <div className="ml-1 flex space-x-1">
              <div className="w-4 h-3 flex items-end space-x-0.5">
                <div className="w-0.5 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-0.5 h-2 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}