import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are an AI assistant for a car dealership. Your role is to help customers with:

1. Information about vehicles (inventory, specifications, pricing, financing)
2. Booking test drives and demos
3. General dealership services (trade-ins, maintenance, financing options)
4. Business hours and contact information

Key Guidelines:
- Be friendly, professional, and helpful
- Use a conversational tone like WhatsApp messaging
- When customers want to book a demo/test drive, let them know you'll help them schedule it
- If asked about specific car models or inventory, provide helpful general information but mention they should visit to see current stock
- For complex questions, offer to connect them with a sales representative
- Keep responses concise but informative
- Use car and relevant emojis sparingly but naturally

Dealership Info:
- Open Monday-Saturday 9 AM - 7 PM, Sunday 11 AM - 5 PM
- Phone: (555) 123-CARS
- Services: New & used car sales, financing, trade-ins, service & maintenance
- We carry multiple brands and have a wide selection

If someone expresses strong interest in booking a test drive or demo, respond positively and mention that you can help them schedule it right away.`;

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    // Check if user is asking about booking/demo/test drive
    const bookingKeywords = ['book', 'schedule', 'test drive', 'demo', 'appointment', 'visit', 'try'];
    const isBookingRelated = bookingKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );

    // Prepare conversation context for AI
    const conversationContext = conversationHistory
      .slice(-6) // Keep last 6 messages for context
      .map((msg: Message) => ({
        role: msg.isBot ? "assistant" : "user",
        content: msg.text
      }));

    const response = await fetch("https://oi-server.onrender.com/chat/completions", {
      method: "POST",
      headers: {
        "customerId": "cus_SvpMkhAlHdXztH",
        "Content-Type": "application/json",
        "Authorization": "Bearer xxx",
      },
      body: JSON.stringify({
        model: "openrouter/claude-sonnet-4",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT
          },
          ...conversationContext,
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    let aiResponse = data.choices?.[0]?.message?.content || "I apologize, but I'm having trouble responding right now. Please try again or contact us directly at (555) 123-CARS.";

    // Clean up the response
    aiResponse = aiResponse.trim();

    // Determine if we should show booking form
    let showBookingForm = false;
    
    if (isBookingRelated || aiResponse.toLowerCase().includes('schedule') || aiResponse.toLowerCase().includes('book')) {
      // Add a call-to-action for booking if not already mentioned
      if (!aiResponse.toLowerCase().includes('schedule it') && !aiResponse.toLowerCase().includes('book it')) {
        aiResponse += "\n\nWould you like me to help you schedule a test drive right now? 🚗";
      }
      showBookingForm = true;
    }

    return NextResponse.json({
      response: aiResponse,
      showBookingForm,
    });

  } catch (error) {
    console.error("Chat API error:", error);
    
    return NextResponse.json({
      response: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment or contact us directly at (555) 123-CARS for immediate assistance.",
      showBookingForm: false,
    }, { status: 500 });
  }
}