'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import GlassCard from '@/components/ui/GlassCard';
import PaymentGateway from '@/components/PaymentGateway';
import BookingConfirmation from '@/components/BookingConfirmation';
import { Plane, Calendar, Clock, CreditCard, CheckCircle, XCircle, ArrowLeft, QrCode } from 'lucide-react';

function BookingContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [step, setStep] = useState<'form' | 'payment' | 'confirmation'>('form');
    const [showPaymentGateway, setShowPaymentGateway] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [paymentResult, setPaymentResult] = useState<any>(null);

    // Flight Details from URL
    const airline = searchParams.get('airline') || 'Airline';
    const flightNumber = searchParams.get('flightNumber') || 'XX-000';
    const from = searchParams.get('from') || 'Origin';
    const to = searchParams.get('to') || 'Destination';
    const departure = searchParams.get('departure') || '00:00';
    const arrival = searchParams.get('arrival') || '00:00';
    const price = searchParams.get('price') || '0';
    const duration = searchParams.get('duration') || '0h 0m';
    const logo = searchParams.get('logo') || '';

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        phone: '',
        email: '',
        food: 'none',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.age || !formData.phone || !formData.email) {
            alert('Please fill in all required fields');
            return;
        }
        setShowPaymentGateway(true);
    };

    const handlePaymentComplete = (result: any) => {
        setPaymentResult({
            ...result,
            customerInfo: {
                name: formData.name,
                email: formData.email,
                phone: formData.phone
            },
            details: {
                airline,
                flightNumber,
                from,
                to,
                departure,
                arrival,
                duration,
                food: formData.food
            }
        });
        setShowPaymentGateway(false);
        setShowConfirmation(true);
    };

    const handleClose = () => {
        window.close();
        router.push('/travel');
    };

    const bookingDetails = {
        id: flightNumber,
        title: `${airline} Flight ${flightNumber}`,
        description: `${from} to ${to} • ${departure} - ${arrival}`,
        amount: parseFloat(price),
        currency: 'INR',
        type: 'flight' as const,
        dates: `Departure: ${departure}`,
        passengers: 1
    };

    if (step === 'processing') {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md text-center">
                    <div className="mb-8 relative">
                        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse"></div>
                        <Plane className="w-24 h-24 text-blue-400 mx-auto animate-bounce relative z-10" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Processing Booking...</h2>
                    <p className="text-slate-400 text-lg mb-8">Please wait while we confirm your seat.</p>
                    <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden border border-white/10">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000 ease-linear"
                            style={{ width: `${((15 - timer) / 15) * 100}%` }}
                        />
                    </div>
                    <p className="mt-4 text-slate-500 font-mono">{timer} seconds remaining</p>
                </div>
            </div>
        );
    }

    if (step === 'success') {
        return (
            <div className="min-h-screen bg-slate-900 py-12 px-4 flex items-center justify-center">
                <div className="w-full max-w-2xl">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 text-green-400 mb-6 ring-4 ring-green-500/10">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">Bon Voyage!</h1>
                        <p className="text-slate-400">Your flight has been successfully booked.</p>
                    </div>

                    <div className="bg-white text-slate-900 rounded-3xl overflow-hidden shadow-2xl relative">
                        {/* Boarding Pass Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg opacity-80">BOARDING PASS</h3>
                                <p className="text-sm opacity-60">First Class</p>
                            </div>
                            <div className="text-right">
                                <h3 className="font-bold text-lg">{airline}</h3>
                            </div>
                        </div>

                        {/* Boarding Pass Body */}
                        <div className="p-8 relative">
                            {/* Dashed Line Decoration */}
                            <div className="absolute top-0 left-0 w-full -translate-y-1/2 flex justify-between px-4">
                                <div className="w-6 h-6 rounded-full bg-slate-900"></div>
                                <div className="flex-1 border-t-2 border-dashed border-slate-300 mx-4"></div>
                                <div className="w-6 h-6 rounded-full bg-slate-900"></div>
                            </div>

                            <div className="flex flex-col md:flex-row justify-between gap-8">
                                <div className="flex-1 space-y-6">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Passenger</p>
                                            <p className="font-bold text-lg">{formData.name || 'Traveler'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Flight</p>
                                            <p className="font-bold text-lg">{flightNumber}</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <div>
                                            <p className="text-2xl font-bold text-slate-800">{from.substring(0, 3).toUpperCase()}</p>
                                            <p className="text-xs text-slate-500">{from}</p>
                                        </div>
                                        <div className="flex-1 px-4 text-center">
                                            <Plane className="w-5 h-5 text-blue-500 mx-auto transform rotate-90" />
                                            <p className="text-xs text-slate-400 mt-1">{duration}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-slate-800">{to.substring(0, 3).toUpperCase()}</p>
                                            <p className="text-xs text-slate-500">{to}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Date</p>
                                            <p className="font-bold text-slate-800">12 Dec</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Time</p>
                                            <p className="font-bold text-slate-800">{departure}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Gate</p>
                                            <p className="font-bold text-slate-800">B12</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side / QR */}
                                <div className="md:border-l md:pl-8 border-dashed border-slate-200 flex flex-col justify-between">
                                    <div className="text-center">
                                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Seat</p>
                                        <p className="text-4xl font-bold text-blue-600 mb-6">{Math.floor(Math.random() * 30) + 1}F</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="bg-slate-900 p-2 rounded-lg">
                                            <QrCode className="w-24 h-24 text-white" />
                                        </div>
                                        <p className="text-xs text-slate-400 font-mono tracking-widest">{flightNumber}83726</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Stub bottom */}
                        <div className="h-4 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
                    </div>

                    <div className="mt-8 text-center">
                        <button
                            onClick={handleClose}
                            className="px-8 py-3 rounded-xl font-bold bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2 mx-auto"
                        >
                            <XCircle className="w-5 h-5" />
                            Close & Return
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10 w-full">
                <GlassCard className="p-8">
                    <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                        <button onClick={() => window.close()} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <ArrowLeft className="w-6 h-6 text-slate-400" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Complete your Booking</h1>
                            <p className="text-slate-400 text-sm">Fill in your details to secure your seat</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left: Flight Summary */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Plane className="w-5 h-5 text-blue-400" /> Flight Summary
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        {logo ? <img src={logo} alt={airline} className="w-8 h-8 object-contain bg-white rounded-md p-1" /> : <div className="w-8 h-8 bg-blue-600 rounded-md"></div>}
                                        <div>
                                            <p className="font-bold text-white">{airline}</p>
                                            <p className="text-xs text-slate-400">{flightNumber}</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center text-sm relative">
                                        <div className="z-10 bg-slate-800/50 pr-2">
                                            <p className="font-bold text-white text-lg">{departure}</p>
                                            <p className="text-slate-400">{from}</p>
                                        </div>
                                        <div className="absolute left-0 w-full h-px bg-slate-600 flex items-center justify-center">
                                            <Plane className="w-3 h-3 text-slate-500 bg-slate-800 rotate-90" />
                                        </div>
                                        <div className="z-10 bg-slate-800/50 pl-2 text-right">
                                            <p className="font-bold text-white text-lg">{arrival}</p>
                                            <p className="text-slate-400">{to}</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                        <span className="text-slate-400">Total Price</span>
                                        <span className="text-2xl font-bold text-blue-400">₹{price}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 flex items-start gap-3">
                                <div className="bg-blue-500/20 p-2 rounded-lg">
                                    <Clock className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-blue-100 text-sm">Limited Seats</h4>
                                    <p className="text-xs text-blue-200/70 mt-1">Prices may increase soon. Complete your booking now.</p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Passenger Details */}
                                <section>
                                    <h3 className="text-xl font-semibold text-white mb-4">Passenger Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                                            <input
                                                required
                                                type="text"
                                                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Age</label>
                                            <input
                                                required
                                                type="number"
                                                min="1" max="100"
                                                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                                placeholder="25"
                                                value={formData.age}
                                                onChange={e => setFormData({ ...formData, age: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                                            <input
                                                required
                                                type="tel"
                                                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                                placeholder="+91 98765 43210"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                                            <input
                                                required
                                                type="email"
                                                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                                placeholder="john@example.com"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Meal Preference</label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {['Veg', 'Non-Veg', 'None'].map((option) => (
                                                    <label key={option} className={`
                              cursor-pointer border rounded-xl p-3 flex items-center justify-center gap-2 transition-all
                              ${formData.food === option.toLowerCase()
                                                            ? 'bg-blue-500/20 border-blue-500 text-white'
                                                            : 'bg-slate-800/50 border-white/10 text-slate-400 hover:bg-slate-700/50'}
                           `}>
                                                        <input
                                                            type="radio"
                                                            name="food"
                                                            value={option.toLowerCase()}
                                                            className="hidden"
                                                            checked={formData.food === option.toLowerCase()}
                                                            onChange={e => setFormData({ ...formData, food: e.target.value })}
                                                        />
                                                        <span className="font-semibold">{option}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <div className="h-px bg-white/10"></div>

                                <button
                                    type="submit"
                                    className="w-full py-4 text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Proceed to Payment
                                </button>
                            </form>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Payment Gateway Modal */}
            {showPaymentGateway && (
                <PaymentGateway
                    bookingDetails={bookingDetails}
                    onPaymentComplete={handlePaymentComplete}
                    onCancel={() => setShowPaymentGateway(false)}
                />
            )}

            {/* Booking Confirmation Modal */}
            {showConfirmation && paymentResult && (
                <BookingConfirmation
                    bookingData={{
                        type: 'flight',
                        bookingReference: paymentResult.bookingReference,
                        transactionId: paymentResult.transactionId,
                        amount: paymentResult.amount,
                        currency: paymentResult.currency,
                        customerInfo: paymentResult.customerInfo,
                        details: paymentResult.details,
                        timestamp: paymentResult.timestamp
                    }}
                    onClose={handleClose}
                />
            )}
        </div>
    );
}

export default function BookingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading booking details...</div>}>
            <BookingContent />
        </Suspense>
    );
}
