'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, 
  MapPin, 
  Star, 
  Calendar, 
  Users, 
  Wifi, 
  Car, 
  Coffee,
  Dumbbell,
  Waves,
  ArrowLeft,
  CreditCard
} from 'lucide-react';
import PaymentGateway from './PaymentGateway';
import BookingConfirmation from './BookingConfirmation';

interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: number;
  image: string;
  amenities: string[];
  description: string;
}

interface HotelBookingProps {
  hotel: Hotel;
  onClose: () => void;
}

export default function HotelBooking({ hotel, onClose }: HotelBookingProps) {
  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);

  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1,
    customerInfo: {
      name: '',
      email: '',
      phone: ''
    },
    specialRequests: ''
  });

  const calculateNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return nights * hotel.price * bookingData.rooms;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingData.checkIn || !bookingData.checkOut || !bookingData.customerInfo.name || 
        !bookingData.customerInfo.email || !bookingData.customerInfo.phone) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (new Date(bookingData.checkIn) >= new Date(bookingData.checkOut)) {
      alert('Check-out date must be after check-in date');
      return;
    }
    
    setShowPaymentGateway(true);
  };

  const handlePaymentComplete = (result: any) => {
    setPaymentResult({
      ...result,
      customerInfo: bookingData.customerInfo,
      details: {
        hotel: hotel.name,
        location: hotel.location,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        nights: calculateNights(),
        guests: bookingData.guests,
        rooms: bookingData.rooms,
        specialRequests: bookingData.specialRequests
      }
    });
    setShowPaymentGateway(false);
    setShowConfirmation(true);
  };

  const bookingDetails = {
    id: hotel.id,
    title: hotel.name,
    description: `${hotel.location} • ${calculateNights()} nights • ${bookingData.rooms} room(s)`,
    amount: calculateTotal(),
    currency: 'INR',
    type: 'hotel' as const,
    dates: `${bookingData.checkIn} to ${bookingData.checkOut}`,
    rooms: bookingData.rooms
  };

  const amenityIcons: { [key: string]: any } = {
    'WiFi': Wifi,
    'Parking': Car,
    'Restaurant': Coffee,
    'Gym': Dumbbell,
    'Pool': Waves,
    'Free WiFi': Wifi,
    'Free Parking': Car,
    'Breakfast': Coffee,
    'Fitness Center': Dumbbell,
    'Swimming Pool': Waves
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          className="stark-glass max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          {/* Header */}
          <div className="p-6 border-b border-indigo-400/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-indigo-500/20 rounded-lg transition-colors"
                >
                  <ArrowLeft className="text-gray-400" size={20} />
                </button>
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
                    <Building className="text-indigo-400" size={24} />
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-bold text-indigo-400 hud-font">
                      HOTEL BOOKING
                    </h2>
                    <p className="text-xs text-gray-400 hud-font">
                      STARK HOSPITALITY NETWORK
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Hotel Details */}
              <div className="lg:col-span-1 space-y-6">
                <div className="system-card p-0 overflow-hidden">
                  <img 
                    src={hotel.image} 
                    alt={hotel.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="hud-font text-lg font-bold text-indigo-400 mb-2">
                      {hotel.name}
                    </h3>
                    <div className="flex items-center space-x-2 mb-3">
                      <MapPin className="text-gray-400" size={14} />
                      <span className="hud-font text-sm text-gray-300">{hotel.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < hotel.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                          />
                        ))}
                      </div>
                      <span className="hud-font text-sm text-gray-300">{hotel.rating}/5</span>
                    </div>
                    <p className="hud-font text-xs text-gray-400 mb-4">
                      {hotel.description}
                    </p>
                    
                    {/* Amenities */}
                    <div>
                      <h4 className="hud-font text-sm font-semibold text-indigo-400 mb-2">
                        Amenities
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {hotel.amenities.map((amenity, index) => {
                          const IconComponent = amenityIcons[amenity] || Coffee;
                          return (
                            <div key={index} className="flex items-center space-x-2">
                              <IconComponent className="text-gray-400" size={14} />
                              <span className="hud-font text-xs text-gray-300">{amenity}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="system-card p-4">
                  <h4 className="hud-font text-sm font-semibold text-indigo-400 mb-3">
                    Price Breakdown
                  </h4>
                  <div className="space-y-2 hud-font text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">₹{hotel.price} × {calculateNights()} nights × {bookingData.rooms} room(s)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Subtotal:</span>
                      <span className="text-gray-300">₹{calculateTotal().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Taxes & Fees:</span>
                      <span className="text-gray-300">₹{Math.round(calculateTotal() * 0.12).toLocaleString()}</span>
                    </div>
                    <div className="border-t border-indigo-400/20 pt-2 flex justify-between">
                      <span className="font-semibold text-indigo-400">Total:</span>
                      <span className="font-semibold text-indigo-400">
                        ₹{Math.round(calculateTotal() * 1.12).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Booking Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Dates and Guests */}
                  <div className="system-card p-4">
                    <h3 className="hud-font text-lg font-semibold text-indigo-400 mb-4">
                      Booking Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="hud-font text-sm text-gray-300 block mb-2">
                          Check-in Date
                        </label>
                        <input
                          type="date"
                          value={bookingData.checkIn}
                          onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 bg-black/50 border border-indigo-400/30 rounded-lg text-white hud-font text-sm focus:outline-none focus:border-indigo-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="hud-font text-sm text-gray-300 block mb-2">
                          Check-out Date
                        </label>
                        <input
                          type="date"
                          value={bookingData.checkOut}
                          onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})}
                          min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 bg-black/50 border border-indigo-400/30 rounded-lg text-white hud-font text-sm focus:outline-none focus:border-indigo-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="hud-font text-sm text-gray-300 block mb-2">
                          Guests
                        </label>
                        <select
                          value={bookingData.guests}
                          onChange={(e) => setBookingData({...bookingData, guests: parseInt(e.target.value)})}
                          className="w-full px-4 py-3 bg-black/50 border border-indigo-400/30 rounded-lg text-white hud-font text-sm focus:outline-none focus:border-indigo-400"
                        >
                          {[1,2,3,4,5,6].map(num => (
                            <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="hud-font text-sm text-gray-300 block mb-2">
                          Rooms
                        </label>
                        <select
                          value={bookingData.rooms}
                          onChange={(e) => setBookingData({...bookingData, rooms: parseInt(e.target.value)})}
                          className="w-full px-4 py-3 bg-black/50 border border-indigo-400/30 rounded-lg text-white hud-font text-sm focus:outline-none focus:border-indigo-400"
                        >
                          {[1,2,3,4,5].map(num => (
                            <option key={num} value={num}>{num} Room{num > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="system-card p-4">
                    <h3 className="hud-font text-lg font-semibold text-indigo-400 mb-4">
                      Guest Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="hud-font text-sm text-gray-300 block mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={bookingData.customerInfo.name}
                          onChange={(e) => setBookingData({
                            ...bookingData, 
                            customerInfo: {...bookingData.customerInfo, name: e.target.value}
                          })}
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
                          value={bookingData.customerInfo.email}
                          onChange={(e) => setBookingData({
                            ...bookingData, 
                            customerInfo: {...bookingData.customerInfo, email: e.target.value}
                          })}
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
                          value={bookingData.customerInfo.phone}
                          onChange={(e) => setBookingData({
                            ...bookingData, 
                            customerInfo: {...bookingData.customerInfo, phone: e.target.value}
                          })}
                          className="w-full px-4 py-3 bg-black/50 border border-indigo-400/30 rounded-lg text-white hud-font text-sm focus:outline-none focus:border-indigo-400"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="hud-font text-sm text-gray-300 block mb-2">
                          Special Requests (Optional)
                        </label>
                        <textarea
                          value={bookingData.specialRequests}
                          onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                          rows={3}
                          className="w-full px-4 py-3 bg-black/50 border border-indigo-400/30 rounded-lg text-white hud-font text-sm focus:outline-none focus:border-indigo-400 resize-none"
                          placeholder="Any special requests or preferences..."
                        />
                      </div>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={!bookingData.checkIn || !bookingData.checkOut || calculateTotal() === 0}
                    className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hud-font text-lg transition-all hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CreditCard size={20} />
                    <span>Book Now - ₹{Math.round(calculateTotal() * 1.12).toLocaleString()}</span>
                  </motion.button>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payment Gateway Modal */}
      {showPaymentGateway && (
        <PaymentGateway
          bookingDetails={{
            ...bookingDetails,
            amount: Math.round(calculateTotal() * 1.12)
          }}
          onPaymentComplete={handlePaymentComplete}
          onCancel={() => setShowPaymentGateway(false)}
        />
      )}

      {/* Booking Confirmation Modal */}
      {showConfirmation && paymentResult && (
        <BookingConfirmation
          bookingData={{
            type: 'hotel',
            bookingReference: paymentResult.bookingReference,
            transactionId: paymentResult.transactionId,
            amount: paymentResult.amount,
            currency: paymentResult.currency,
            customerInfo: paymentResult.customerInfo,
            details: paymentResult.details,
            timestamp: paymentResult.timestamp
          }}
          onClose={onClose}
        />
      )}
    </>
  );
}