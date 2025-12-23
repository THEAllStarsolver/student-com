import { NextRequest, NextResponse } from 'next/server';

export interface PaymentRequest {
  amount: number;
  currency: string;
  bookingType: 'flight' | 'hotel';
  bookingDetails: {
    id: string;
    title: string;
    description: string;
    dates?: string;
    passengers?: number;
    rooms?: number;
  };
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paymentMethod?: string;
  timestamp: string;
  bookingReference?: string;
  message: string;
}

// Simulate payment processing delay
const simulateProcessing = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate realistic transaction IDs
const generateTransactionId = () => {
  const prefix = 'STARK';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}_${timestamp}_${random}`;
};

const generateOrderId = () => {
  const prefix = 'ORD';
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}_${timestamp}_${random}`;
};

const generateBookingReference = (type: string) => {
  const prefix = type === 'flight' ? 'FL' : 'HT';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = prefix;
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export async function POST(request: NextRequest) {
  try {
    const paymentData: PaymentRequest = await request.json();
    
    console.log('Dummy Payment Gateway - Processing payment:', {
      amount: paymentData.amount,
      type: paymentData.bookingType,
      customer: paymentData.customerInfo.email
    });

    // Validate required fields
    if (!paymentData.amount || !paymentData.bookingType || !paymentData.customerInfo) {
      return NextResponse.json({
        success: false,
        message: 'Missing required payment information',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    // Simulate processing time (1-3 seconds)
    const processingTime = Math.random() * 2000 + 1000;
    await simulateProcessing(processingTime);

    // Simulate payment success/failure (95% success rate)
    const isSuccess = Math.random() > 0.05;
    
    const transactionId = generateTransactionId();
    const orderId = generateOrderId();
    const bookingReference = generateBookingReference(paymentData.bookingType);

    if (isSuccess) {
      const response: PaymentResponse = {
        success: true,
        transactionId,
        orderId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: 'completed',
        paymentMethod: 'Stark Industries Secure Payment',
        timestamp: new Date().toISOString(),
        bookingReference,
        message: `Payment successful! Your ${paymentData.bookingType} booking has been confirmed.`
      };

      console.log('Payment successful:', response);
      return NextResponse.json(response);
    } else {
      // Simulate failure scenarios
      const failureReasons = [
        'Insufficient funds',
        'Card declined',
        'Network timeout',
        'Invalid card details',
        'Bank authorization failed'
      ];
      
      const failureReason = failureReasons[Math.floor(Math.random() * failureReasons.length)];
      
      const response: PaymentResponse = {
        success: false,
        transactionId,
        orderId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: 'failed',
        timestamp: new Date().toISOString(),
        message: `Payment failed: ${failureReason}. Please try again.`
      };

      console.log('Payment failed:', response);
      return NextResponse.json(response, { status: 402 });
    }

  } catch (error: any) {
    console.error('Dummy Payment Gateway Error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Payment processing error occurred',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// GET endpoint for payment status check
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const transactionId = searchParams.get('transactionId');
  
  if (!transactionId) {
    return NextResponse.json({
      success: false,
      message: 'Transaction ID required'
    }, { status: 400 });
  }

  // Simulate status check
  await simulateProcessing(500);
  
  return NextResponse.json({
    success: true,
    transactionId,
    status: 'completed',
    message: 'Transaction found',
    timestamp: new Date().toISOString()
  });
}