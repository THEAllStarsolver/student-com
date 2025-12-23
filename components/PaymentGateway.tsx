'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Shield, 
  Lock, 
  CheckCircle, 
  XCircle, 
  Loader2,
  ArrowLeft,
  Zap,
  Banknote,
  Smartphone,
  Wallet
} from 'lucide-react';

interface BookingDetails {
  id: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  type: 'flight' | 'hotel';
  dates?: string;
  passengers?: number;
  rooms?: number;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

interface PaymentGatewayProps {
  bookingDetails: BookingDetails;
  onPaymentComplete: (result: any) => void;
  onCancel: () => void;
}

export default function PaymentGateway({ 
  bookingDetails, 
  onPaymentComplete, 
  onCancel 
}: PaymentGatewayProps) {
  const [step, setStep] = useState<'details' | 'payment' | 'processing' | 'result'>('details');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet' | 'netbanking'>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerInfo.name && customerInfo.email && customerInfo.phone) {
      setStep('payment');
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStep('processing');

    try {
      const paymentData = {
        amount: bookingDetails.amount,
        currency: bookingDetails.currency,
        bookingType: bookingDetails.type,
        bookingDetails: {
          id: bookingDetails.id,
          title: bookingDetails.title,
          description: bookingDetails.description,
          dates: bookingDetails.dates,
          passengers: bookingDetails.passengers,
          rooms: bookingDetails.rooms
        },
        customerInfo,
        paymentMethod
      };

      const response = await fetch('/api/payment/dummy-gateway', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();
      setPaymentResult(result);
      setStep('result');
      
      if (result.success) {
        onPaymentComplete(result);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentResult({
        success: false,
        message: 'Payment processing failed. Please try again.'
      });
      setStep('result');
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const paymentMethods = [
    { id: 'card', label: 'Credit/Debit Card', icon: CreditCard, color: 'indigo' },
    { id: 'upi', label: 'UPI Payment', icon: Smartphone, color: 'green' },
    { id: 'wallet', label: 'Digital Wallet', icon: Wallet, color: 'purple' },
    { id: 'netbanking', label: 'Net Banking', icon: Banknote, color: 'blue' }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        className="stark-glass max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Header */}
        <div className="p-6 border-b border-indigo-400/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                className="p-2 rounded-lg arc-reactor-pulse"
                animate={{ 
                  boxShadow: [
                    '0 0 10px rgba(129, 140, 248, 0.5)',
                    '0 0 20px rgba(129, 140, 248, 0.8)',
                    '0 0 10px rgba(129, 140, 248, 0.5)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Shield className="text-indigo-400" size={24} />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-indigo-400 hud-font">
                  STARK SECURE PAYMENT
                </h2>
                <p className="text-xs text-gray-400 hud-font">
                  NIGHTSHADE PROTOCOL ENCRYPTION
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-indigo-500/20 rounded-lg transition-colors"
            >
              <XCircle className="text-gray-400" size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Booking Summary */}
          <div className="system-card p-4 mb-6">
            <h3 className="hud-font text-sm font-semibold text-indigo-400 mb-3">
              BOOKING SUMMARY
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="hud-font text-sm text-gray-300">{bookingDetails.title}</span>
                <span className="hud-font text-sm font-semibold text-indigo-400">
                  {formatAmount(bookingDetails.amount, bookingDetails.currency)}
                </span>
              </div>
              <div className="hud-font text-xs text-gray-400">
                {bookingDetails.description}
              </div>
              {bookingDetails.dates && (
                <div className="hud-font text-xs text-gray-400">
                  Dates: {bookingDetails.dates}
                </div>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="hud-font text-lg font-semibold text-indigo-400 mb-4">
                  Customer Information
                </h3>
                <form onSubmit={handleCustomerSubmit} className="space-y-4">
                  <div>
                    <label className="hud-font text-sm text-gray-300 block mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      className="w-full px-4 py-3 bg-black/50 border border-indigo-400/30 rounded-lg text-white hud-font text-sm focus:outline-none focus:border-indigo-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="hud-font text-sm text-gray-300 block mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      className="w-full px-4 py-3 bg-black/50 border border-indigo-400/30 rounded-lg text-white hud-font text-sm focus:outline-none focus:border-indigo-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="hud-font text-sm text-gray-300 block mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-black/50 border border-indigo-400/30 rounded-lg text-white hud-font text-sm focus:outline-none focus:border-indigo-400"
                      required
                    />
                  </div>
                  <motion.button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hud-font text-sm transition-all hover:shadow-lg hover:shadow-indigo-500/25"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue to Payment
                  </motion.button>
                </form>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="hud-font text-lg font-semibold text-indigo-400">
                    Payment Method
                  </h3>
                  <button
                    onClick={() => setStep('details')}
                    className="flex items-center space-x-2 text-gray-400 hover:text-indigo-400 transition-colors"
                  >
                    <ArrowLeft size={16} />
                    <span className="hud-font text-sm">Back</span>
                  </button>
                </div>

                {/* Payment Method Selection */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {paymentMethods.map((method) => (
                    <motion.button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`p-4 rounded-lg border transition-all ${
                        paymentMethod === method.id
                          ? 'border-indigo-400 bg-indigo-500/20'
                          : 'border-indigo-400/20 hover:border-indigo-400/40'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <method.icon className={`mx-auto mb-2 ${
                        paymentMethod === method.id ? 'text-indigo-400' : 'text-gray-400'
                      }`} size={24} />
                      <div className={`hud-font text-xs ${
                        paymentMethod === method.id ? 'text-indigo-400' : 'text-gray-300'
                      }`}>
                        {method.label}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Payment Form */}
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  {paymentMethod === 'card' && (
                    <>
                      <div>
                        <label className="hud-font text-sm text-gray-300 block mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                          className="w-full px-4 py-3 bg-black/50 border border-indigo-400/30 rounded-lg text-white hud-font text-sm focus:outline-none focus:border-indigo-400"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="hud-font text-sm text-gray-300 block mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                            className="w-full px-4 py-3 bg-black/50 border border-indigo-400/30 rounded-lg text-white hud-font text-sm focus:outline-none focus:border-indigo-400"
                            required
                          />
                        </div>
                        <div>
                          <label className="hud-font text-sm text-gray-300 block mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                            className="w-full px-4 py-3 bg-black/50 border border-indigo-400/30 rounded-lg text-white hud-font text-sm focus:outline-none focus:border-indigo-400"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {paymentMethod === 'upi' && (
                    <div>
                      <label className="hud-font text-sm text-gray-300 block mb-2">
                        UPI ID
                      </label>
                      <input
                        type="text"
                        placeholder="yourname@upi"
                        className="w-full px-4 py-3 bg-black/50 border border-indigo-400/30 rounded-lg text-white hud-font text-sm focus:outline-none focus:border-indigo-400"
                        required
                      />
                    </div>
                  )}

                  {paymentMethod === 'wallet' && (
                    <div className="system-card p-4">
                      <div className="hud-font text-sm text-gray-300 text-center">
                        You will be redirected to your wallet provider
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'netbanking' && (
                    <div>
                      <label className="hud-font text-sm text-gray-300 block mb-2">
                        Select Bank
                      </label>
                      <select className="w-full px-4 py-3 bg-black/50 border border-indigo-400/30 rounded-lg text-white hud-font text-sm focus:outline-none focus:border-indigo-400">
                        <option>State Bank of India</option>
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>Axis Bank</option>
                      </select>
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hud-font text-sm transition-all hover:shadow-lg hover:shadow-green-500/25 disabled:opacity-50"
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Lock size={16} />
                      <span>Pay {formatAmount(bookingDetails.amount, bookingDetails.currency)}</span>
                    </div>
                  </motion.button>
                </form>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  className="mx-auto mb-6 p-6 rounded-full arc-reactor-pulse"
                  animate={{ 
                    rotate: 360,
                    boxShadow: [
                      '0 0 20px rgba(129, 140, 248, 0.5)',
                      '0 0 40px rgba(129, 140, 248, 0.8)',
                      '0 0 20px rgba(129, 140, 248, 0.5)'
                    ]
                  }}
                  transition={{ 
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    boxShadow: { duration: 2, repeat: Infinity }
                  }}
                >
                  <Zap className="text-indigo-400" size={48} />
                </motion.div>
                <h3 className="hud-font text-xl font-semibold text-indigo-400 mb-2">
                  Processing Payment
                </h3>
                <p className="hud-font text-sm text-gray-400">
                  Securing your transaction with Stark Industries encryption...
                </p>
              </motion.div>
            )}

            {step === 'result' && paymentResult && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  className={`mx-auto mb-6 p-6 rounded-full ${
                    paymentResult.success ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  {paymentResult.success ? (
                    <CheckCircle className="text-green-400" size={48} />
                  ) : (
                    <XCircle className="text-red-400" size={48} />
                  )}
                </motion.div>
                
                <h3 className={`hud-font text-xl font-semibold mb-2 ${
                  paymentResult.success ? 'text-green-400' : 'text-red-400'
                }`}>
                  {paymentResult.success ? 'Payment Successful!' : 'Payment Failed'}
                </h3>
                
                <p className="hud-font text-sm text-gray-400 mb-6">
                  {paymentResult.message}
                </p>

                {paymentResult.success && (
                  <div className="system-card p-4 mb-6 text-left">
                    <h4 className="hud-font text-sm font-semibold text-indigo-400 mb-3">
                      Transaction Details
                    </h4>
                    <div className="space-y-2 hud-font text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Transaction ID:</span>
                        <span className="text-gray-300">{paymentResult.transactionId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Booking Reference:</span>
                        <span className="text-gray-300">{paymentResult.bookingReference}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Amount:</span>
                        <span className="text-gray-300">
                          {formatAmount(paymentResult.amount, paymentResult.currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <motion.button
                  onClick={onCancel}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hud-font text-sm transition-all hover:shadow-lg hover:shadow-indigo-500/25"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}