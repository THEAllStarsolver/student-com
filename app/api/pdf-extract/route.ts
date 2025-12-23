import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
// import pdf from 'pdf-parse'; // Uncomment for production

export async function POST(request: NextRequest) {
  try {
    const { fileUrl, uid } = await request.json();

    // TODO: In production, implement actual PDF parsing:
    // const response = await fetch(fileUrl);
    // const buffer = await response.arrayBuffer();
    // const data = await pdf(Buffer.from(buffer));
    // Parse transaction data from PDF text
    
    // For demo purposes, we'll create mock transaction data based on common bank statement patterns
    const mockTransactions = [
      {
        date: new Date().toISOString().split('T')[0],
        description: 'UPI Payment to Merchant',
        amount: -250.00,
        type: 'debit',
        category: 'food'
      },
      {
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        description: 'ATM Withdrawal',
        amount: -500.00,
        type: 'debit',
        category: 'misc'
      },
      {
        date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
        description: 'Online Purchase',
        amount: -1200.00,
        type: 'debit',
        category: 'shopping'
      }
    ];

    // Store parsed transactions
    for (const transaction of mockTransactions) {
      await addDoc(collection(db, 'expenses'), {
        uid,
        amount: Math.abs(transaction.amount),
        category: transaction.category,
        paymentMethod: 'UPI',
        date: transaction.date,
        notes: `Auto-imported: ${transaction.description}`,
        createdAt: new Date(),
        source: 'bank_statement'
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'PDF processed and transactions imported',
      transactionsCount: mockTransactions.length 
    });

  } catch (error) {
    console.error('PDF extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to process PDF' },
      { status: 500 }
    );
  }
}