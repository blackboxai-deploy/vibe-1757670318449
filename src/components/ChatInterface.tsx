"use client";

import React, { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import DemoBookingForm from "./DemoBookingForm";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  showBookingForm?: boolean;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! 👋 Welcome to our car dealership. I'm here to help you find your perfect car and book test drives. How can I assist you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      
      setIsTyping(false);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isBot: true,
        timestamp: new Date(),
        showBookingForm: data.showBookingForm,
      };

      setMessages(prev => [...prev, botMessage]);

      if (data.showBookingForm) {
        setShowBookingForm(true);
      }
    } catch (error) {
      setIsTyping(false);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment or call us directly at (555) 123-CARS.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  const quickReplies = [
    "Show me available cars",
    "Schedule a test drive",
    "Financing options",
    "Trade-in value",
  ];

  return (
    <div className="flex flex-col h-[600px] bg-white">
      {/* Header */}
      <div className="bg-[#075e54] text-white px-4 py-3 flex items-center space-x-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <span className="text-[#075e54] font-bold text-lg">🚗</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm">Car Dealership Assistant</h3>
          <p className="text-xs text-green-100">Online • Ready to help</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#e5ddd5] space-y-2">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {!isTyping && (
        <div className="px-4 py-2 bg-white border-t flex flex-wrap gap-2">
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              onClick={() => handleQuickReply(reply)}
              className="bg-[#dcf8c6] text-[#075e54] px-3 py-1 rounded-full text-xs font-medium hover:bg-[#c8e6c9] transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
        <div className="flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#25d366] focus:border-transparent"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="bg-[#25d366] text-white p-2 rounded-full hover:bg-[#128c7e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22,2 15,22 11,13 2,9"></polygon>
            </svg>
          </button>
        </div>
      </form>

      {/* Demo Booking Modal */}
      {showBookingForm && (
        <DemoBookingForm 
          onClose={() => setShowBookingForm(false)}
          onBookingComplete={(bookingDetails) => {
            setShowBookingForm(false);
            const confirmationMessage: Message = {
              id: Date.now().toString(),
              text: `Great! I've scheduled your demo for ${bookingDetails.date} at ${bookingDetails.time}. We'll contact you at ${bookingDetails.phone} to confirm. Looking forward to helping you find your perfect car! 🚗`,
              isBot: true,
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, confirmationMessage]);
          }}
        />
      )}
    </div>
  );
}