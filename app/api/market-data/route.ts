import { NextRequest, NextResponse } from 'next/server';

// Mock stock data for educational purposes
const mockStocks = {
  'RELIANCE': { price: 2456.75, change: +12.30, changePercent: +0.50 },
  'TCS': { price: 3789.20, change: -45.80, changePercent: -1.19 },
  'INFY': { price: 1567.90, change: +23.45, changePercent: +1.52 },
  'HDFCBANK': { price: 1678.30, change: +8.90, changePercent: +0.53 },
  'ICICIBANK': { price: 987.65, change: -12.45, changePercent: -1.24 },
  'SBIN': { price: 567.80, change: +15.20, changePercent: +2.75 },
  'BHARTIARTL': { price: 876.45, change: +7.30, changePercent: +0.84 },
  'ITC': { price: 456.20, change: -3.80, changePercent: -0.82 },
  'HINDUNILVR': { price: 2345.60, change: +18.90, changePercent: +0.81 },
  'MARUTI': { price: 9876.40, change: -67.20, changePercent: -0.68 }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (symbol) {
      // Return specific stock data
      const stockData = mockStocks[symbol.toUpperCase() as keyof typeof mockStocks];
      if (!stockData) {
        return NextResponse.json(
          { error: 'Stock not found' },
          { status: 404 }
        );
      }

      // Add some random variation to simulate real-time data
      const variation = (Math.random() - 0.5) * 10; // ±5 rupees variation
      const newPrice = Math.max(stockData.price + variation, 1);
      
      return NextResponse.json({
        symbol: symbol.toUpperCase(),
        price: parseFloat(newPrice.toFixed(2)),
        change: parseFloat((newPrice - stockData.price).toFixed(2)),
        changePercent: parseFloat(((newPrice - stockData.price) / stockData.price * 100).toFixed(2)),
        timestamp: new Date().toISOString()
      });
    }

    // Return all stocks with random variations
    const allStocks = Object.entries(mockStocks).map(([symbol, data]) => {
      const variation = (Math.random() - 0.5) * 10;
      const newPrice = Math.max(data.price + variation, 1);
      
      return {
        symbol,
        price: parseFloat(newPrice.toFixed(2)),
        change: parseFloat((newPrice - data.price).toFixed(2)),
        changePercent: parseFloat(((newPrice - data.price) / data.price * 100).toFixed(2))
      };
    });

    return NextResponse.json({
      stocks: allStocks,
      timestamp: new Date().toISOString(),
      disclaimer: 'This is simulated market data for educational purposes only. Not real stock prices.'
    });

  } catch (error) {
    console.error('Market data API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
}