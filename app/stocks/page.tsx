'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { collection, addDoc, query, orderBy, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import GlassCard from '@/components/ui/GlassCard';
import PrimaryButton from '@/components/ui/PrimaryButton';

interface StockLesson {
  id: string;
  title: string;
  content: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  order: number;
}

interface VirtualTrade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: any;
  uid: string;
}

interface Portfolio {
  cash: number;
  holdings: { [symbol: string]: { quantity: number; avgPrice: number } };
}

const stockLessons: StockLesson[] = [
  {
    id: '1',
    title: 'What is the Stock Market?',
    content: 'The stock market is a platform where shares of publicly traded companies are bought and sold. It allows companies to raise capital and investors to own a piece of businesses.',
    level: 'beginner',
    order: 1
  },
  {
    id: '2',
    title: 'How Shares Work',
    content: 'A share represents ownership in a company. When you buy shares, you become a shareholder and own a portion of that company. Share prices fluctuate based on supply, demand, and company performance.',
    level: 'beginner',
    order: 2
  },
  {
    id: '3',
    title: 'Long-term vs Short-term Investing',
    content: 'Long-term investing involves holding stocks for years to benefit from compound growth. Short-term trading focuses on quick profits from price movements but carries higher risk.',
    level: 'intermediate',
    order: 3
  },
  {
    id: '4',
    title: 'Mutual Funds Explained',
    content: 'Mutual funds pool money from many investors to buy a diversified portfolio of stocks, bonds, or other securities. They offer professional management and diversification.',
    level: 'intermediate',
    order: 4
  },
  {
    id: '5',
    title: 'Understanding ETFs',
    content: 'Exchange-Traded Funds (ETFs) are like mutual funds but trade on stock exchanges like individual stocks. They typically track an index and offer low fees.',
    level: 'intermediate',
    order: 5
  },
  {
    id: '6',
    title: 'Risk Management',
    content: 'Never invest more than you can afford to lose. Diversify your portfolio across different sectors and asset classes. Set stop-losses and have a clear investment strategy.',
    level: 'advanced',
    order: 6
  }
];

export default function StocksPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'learn' | 'simulator'>('learn');
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [portfolio, setPortfolio] = useState<Portfolio>({ cash: 1000000, holdings: {} });
  const [trades, setTrades] = useState<VirtualTrade[]>([]);
  const [tradeForm, setTradeForm] = useState({
    symbol: '',
    type: 'buy' as 'buy' | 'sell',
    quantity: '',
    price: ''
  });
  const [marketData, setMarketData] = useState<any[]>([]);
  const [selectedStock, setSelectedStock] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadPortfolio();
      loadTrades();
      fetchMarketData();
    }
  }, [user]);

  const fetchMarketData = async () => {
    try {
      const response = await fetch('/api/market-data');
      if (response.ok) {
        const data = await response.json();
        setMarketData(data.stocks || []);
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  };

  const fetchStockPrice = async (symbol: string) => {
    try {
      const response = await fetch(`/api/market-data?symbol=${symbol}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedStock(data);
        setTradeForm(prev => ({ ...prev, price: data.price.toString() }));
      }
    } catch (error) {
      console.error('Error fetching stock price:', error);
    }
  };

  const loadPortfolio = async () => {
    if (!user) return;
    
    try {
      const portfolioDoc = await getDoc(doc(db, 'virtualPortfolios', user.uid));
      if (portfolioDoc.exists()) {
        setPortfolio(portfolioDoc.data() as Portfolio);
      } else {
        const initialPortfolio = { cash: 1000000, holdings: {} };
        await updateDoc(doc(db, 'virtualPortfolios', user.uid), initialPortfolio);
        setPortfolio(initialPortfolio);
      }
    } catch (error) {
      console.error('Error loading portfolio:', error);
    }
  };

  const loadTrades = () => {
    if (!user) return;

    const q = query(
      collection(db, 'virtualTrades'),
      orderBy('timestamp', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tradeData = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(trade => trade.uid === user.uid) as VirtualTrade[];
      setTrades(tradeData);
    });

    return () => unsubscribe();
  };

  const executeTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { symbol, type, quantity, price } = tradeForm;
    const qty = parseInt(quantity);
    const prc = parseFloat(price);
    const totalValue = qty * prc;

    if (type === 'buy' && totalValue > portfolio.cash) {
      alert('Insufficient cash balance');
      return;
    }

    if (type === 'sell') {
      const holding = portfolio.holdings[symbol];
      if (!holding || holding.quantity < qty) {
        alert('Insufficient shares to sell');
        return;
      }
    }

    try {
      await addDoc(collection(db, 'virtualTrades'), {
        symbol: symbol.toUpperCase(),
        type,
        quantity: qty,
        price: prc,
        timestamp: new Date(),
        uid: user.uid
      });

      const newPortfolio = { ...portfolio };
      
      if (type === 'buy') {
        newPortfolio.cash -= totalValue;
        if (newPortfolio.holdings[symbol]) {
          const existing = newPortfolio.holdings[symbol];
          const totalShares = existing.quantity + qty;
          const totalCost = (existing.quantity * existing.avgPrice) + totalValue;
          newPortfolio.holdings[symbol] = {
            quantity: totalShares,
            avgPrice: totalCost / totalShares
          };
        } else {
          newPortfolio.holdings[symbol] = { quantity: qty, avgPrice: prc };
        }
      } else {
        newPortfolio.cash += totalValue;
        newPortfolio.holdings[symbol].quantity -= qty;
        if (newPortfolio.holdings[symbol].quantity === 0) {
          delete newPortfolio.holdings[symbol];
        }
      }

      await updateDoc(doc(db, 'virtualPortfolios', user.uid), newPortfolio);
      setPortfolio(newPortfolio);
      setTradeForm({ symbol: '', type: 'buy', quantity: '', price: '' });
    } catch (error) {
      console.error('Error executing trade:', error);
    }
  };

  const filteredLessons = selectedLevel === 'all' 
    ? stockLessons 
    : stockLessons.filter(lesson => lesson.level === selectedLevel);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Stock Market Hub 📈
        </h1>
        <p className="text-xl text-slate-300">Learn investing and practice with virtual trading</p>
        <div className="text-sm text-slate-400 mt-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          ⚠️ SEBI Compliance: This content is for educational purposes only and not financial advice. Consult a registered financial advisor for personalized investment guidance.
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('learn')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'learn'
              ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
              : 'bg-white/10 border border-white/20 text-slate-300 hover:bg-white/20'
          }`}
        >
          📚 Learn
        </button>
        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'simulator'
              ? 'bg-green-500/20 border border-green-500/30 text-green-400'
              : 'bg-white/10 border border-white/20 text-slate-300 hover:bg-white/20'
          }`}
        >
          💰 Virtual Trading
        </button>
      </div>

      {activeTab === 'learn' && (
        <>
          <div className="flex gap-3 mb-6">
            {['all', 'beginner', 'intermediate', 'advanced'].map(level => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level as any)}
                className={`px-4 py-2 rounded-lg capitalize transition-all ${
                  selectedLevel === level
                    ? 'bg-purple-500/20 border border-purple-500/30 text-purple-400'
                    : 'bg-white/10 border border-white/20 text-slate-300 hover:bg-white/20'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredLessons.map(lesson => (
              <GlassCard key={lesson.id}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-white">{lesson.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    lesson.level === 'beginner' ? 'bg-green-500/20 text-green-400' :
                    lesson.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {lesson.level}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">{lesson.content}</p>
              </GlassCard>
            ))}
          </div>
        </>
      )}

      {activeTab === 'simulator' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-2">Cash Balance</h3>
              <p className="text-3xl font-bold text-green-400">₹{portfolio.cash.toLocaleString()}</p>
            </GlassCard>
            
            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-2">Holdings</h3>
              <p className="text-3xl font-bold text-blue-400">{Object.keys(portfolio.holdings).length}</p>
            </GlassCard>
            
            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-2">Total Trades</h3>
              <p className="text-3xl font-bold text-purple-400">{trades.length}</p>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GlassCard>
              <h3 className="text-xl font-bold text-white mb-4">Place Trade</h3>
              <form onSubmit={executeTrade} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Stock Symbol</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tradeForm.symbol}
                      onChange={(e) => setTradeForm({...tradeForm, symbol: e.target.value.toUpperCase()})}
                      className="flex-1 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400"
                      placeholder="e.g., RELIANCE, TCS"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => tradeForm.symbol && fetchStockPrice(tradeForm.symbol)}
                      className="px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-all"
                    >
                      Get Price
                    </button>
                  </div>
                  {selectedStock && (
                    <div className="mt-2 p-2 bg-white/5 rounded-lg">
                      <p className="text-sm text-white">
                        {selectedStock.symbol}: ₹{selectedStock.price} 
                        <span className={selectedStock.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                          ({selectedStock.change >= 0 ? '+' : ''}{selectedStock.change}) {selectedStock.changePercent}%
                        </span>
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
                    <select
                      value={tradeForm.type}
                      onChange={(e) => setTradeForm({...tradeForm, type: e.target.value as 'buy' | 'sell'})}
                      className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                    >
                      <option value="buy" className="bg-slate-800">Buy</option>
                      <option value="sell" className="bg-slate-800">Sell</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Quantity</label>
                    <input
                      type="number"
                      value={tradeForm.quantity}
                      onChange={(e) => setTradeForm({...tradeForm, quantity: e.target.value})}
                      className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Price per Share (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={tradeForm.price}
                    onChange={(e) => setTradeForm({...tradeForm, price: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                    required
                  />
                </div>
                
                <PrimaryButton type="submit" className="w-full">
                  Execute Trade
                </PrimaryButton>
              </form>
            </GlassCard>

            <div className="space-y-6">
              <GlassCard>
                <h3 className="text-xl font-bold text-white mb-4">Live Market Data</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {marketData.slice(0, 8).map(stock => (
                    <div key={stock.symbol} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                      <span className="text-white font-medium">{stock.symbol}</span>
                      <div className="text-right">
                        <p className="text-sm text-white">₹{stock.price}</p>
                        <p className={`text-xs ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {stock.change >= 0 ? '+' : ''}{stock.changePercent}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={fetchMarketData}
                  className="mt-3 w-full px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-all text-sm"
                >
                  Refresh Prices
                </button>
              </GlassCard>

              <GlassCard>
                <h3 className="text-xl font-bold text-white mb-4">Portfolio Holdings</h3>
              <div className="space-y-3">
                {Object.entries(portfolio.holdings).map(([symbol, holding]) => (
                  <div key={symbol} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{symbol}</p>
                      <p className="text-sm text-slate-400">{holding.quantity} shares</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-300">Avg: ₹{holding.avgPrice.toFixed(2)}</p>
                      <p className="text-xs text-slate-400">Value: ₹{(holding.quantity * holding.avgPrice).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                {Object.keys(portfolio.holdings).length === 0 && (
                  <p className="text-slate-400 text-center py-4">No holdings yet. Start trading!</p>
                )}
              </div>
            </GlassCard>
            </div>
          </div>

          <GlassCard className="mt-8">
            <h3 className="text-xl font-bold text-white mb-4">Recent Trades</h3>
            <div className="space-y-3">
              {trades.slice(0, 10).map(trade => (
                <div key={trade.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-white font-medium">
                      {trade.type.toUpperCase()} {trade.quantity} {trade.symbol}
                    </p>
                    <p className="text-sm text-slate-400">₹{trade.price.toFixed(2)} per share</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${trade.type === 'buy' ? 'text-red-400' : 'text-green-400'}`}>
                      {trade.type === 'buy' ? '-' : '+'}₹{(trade.quantity * trade.price).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(trade.timestamp?.toDate()).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {trades.length === 0 && (
                <p className="text-slate-400 text-center py-8">No trades yet. Place your first trade!</p>
              )}
            </div>
          </GlassCard>
        </>
      )}
    </div>
  );
}