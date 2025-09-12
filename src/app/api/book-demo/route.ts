import { NextRequest, NextResponse } from "next/server";

interface BookingDetails {
  name: string;
  phone: string;
  email: string;
  carInterest: string;
  date: string;
  time: string;
  notes: string;
}

export async function POST(request: NextRequest) {
  try {
    const bookingData: BookingDetails = await request.json();

    // Validate required fields
    const requiredFields: (keyof BookingDetails)[] = ['name', 'phone', 'email', 'carInterest', 'date', 'time'];
    const missingFields = requiredFields.filter(field => !bookingData[field]?.trim());
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingData.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate phone format (basic)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(bookingData.phone)) {
      return NextResponse.json(
        { error: 'Invalid phone format' },
        { status: 400 }
      );
    }

    // Validate date (must be today or future)
    const selectedDate = new Date(bookingData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return NextResponse.json(
        { error: 'Date must be today or in the future' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Save to database
    // 2. Send confirmation emails
    // 3. Add to calendar system
    // 4. Notify sales team
    // 5. Check availability

    // For demo purposes, we'll simulate successful booking
    console.log('Demo booking received:', {
      ...bookingData,
      timestamp: new Date().toISOString(),
      id: `DEMO-${Date.now()}`,
    });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate booking confirmation
    const bookingId = `DEMO-${Date.now()}`;
    const confirmationData = {
      success: true,
      bookingId,
      message: `Demo successfully scheduled for ${bookingData.name}`,
      details: {
        ...bookingData,
        bookingId,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      }
    };

    // In production, you might also:
    // - Send confirmation email to customer
    // - Send notification to sales team
    // - Add to dealership calendar system
    // - Send SMS confirmation if enabled

    return NextResponse.json(confirmationData);

  } catch (error) {
    console.error('Booking API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process booking. Please try again or contact us directly.',
        success: false 
      },
      { status: 500 }
    );
  }
}