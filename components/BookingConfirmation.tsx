'use client';

import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Download, 
  Mail, 
  Calendar, 
  MapPin, 
  Users, 
  Plane,
  Building,
  Clock,
  CreditCard
} from 'lucide-react';

interface BookingConfirmationProps {
  bookingData: {
    type: 'flight' | 'hotel';
    bookingReference: string;
    transactionId: string;
    amount: number;
    currency: string;
    customerInfo: {
      name: string;
      email: string;
      phone: string;
    };
    details: any;
    timestamp: string;
  };
  onClose: () => void;
}

export default function BookingConfirmation({ bookingData, onClose }: BookingConfirmationProps) {
  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadTicket = () => {
    // Create a simple text-based ticket
    const ticketContent = `
STARK INDUSTRIES BOOKING CONFIRMATION
=====================================

Booking Reference: ${bookingData.bookingReference}
Transaction ID: ${bookingData.transactionId}
Type: ${bookingData.type.toUpperCase()}
Amount: ${formatAmount(bookingData.amount, bookingData.currency)}

Customer Information:
Name: ${bookingData.customerInfo.name}
Email: ${bookingData.customerInfo.email}
Phone: ${bookingData.customerInfo.phone}

Booking Date: ${formatDate(bookingData.timestamp)}

Thank you for choosing Stark Industries!
    `;

    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${bookingData.bookingReference}_ticket.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sendEmail = () => {
    const subject = `Booking Confirmation - ${bookingData.bookingReference}`;
    const body = `Dear ${bookingData.customerInfo.name},

Your ${bookingData.type} booking has been confirmed!

Booking Reference: ${bookingData.bookingReference}
Transaction ID: ${bookingData.transactionId}
Amount: ${formatAmount(bookingData.amount, bookingData.currency)}

Thank you for choosing Stark Industries!`;

    window.open(`mailto:${bookingData.customerInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        className="stark-glass max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
      >
        {/* Header */}
        <div className="p-6 border-b border-indigo-400/20">
          <div className="flex items-center space-x-3">
            <motion.div
              className="p-3 rounded-full bg-green-500/20"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <CheckCircle className="text-green-400" size={32} />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-green-400 hud-font">
                BOOKING CONFIRMED
              </h2>
              <p className="text-sm text-gray-400 hud-font">
                Your {bookingData.type} reservation is secured
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Booking Reference */}
          <motion.div
            className="system-card p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              {bookingData.type === 'flight' ? (
                <Plane className="text-indigo-400" size={24} />
              ) : (
                <Building className="text-indigo-400" size={24} />
              )}
              <h3 className="hud-font text-lg font-semibold text-indigo-400">
                {bookingData.type === 'flight' ? 'FLIGHT BOOKING' : 'HOTEL BOOKING'}
              </h3>
            </div>
            
            <div className="mb-4">
              <div className="hud-font text-sm text-gray-400 mb-1">Booking Reference</div>
              <div className="hud-font text-2xl font-bold text-indigo-400 tracking-wider">
                {bookingData.bookingReference}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="hud-font text-xs text-gray-400">Transaction ID</div>
                <div className="hud-font text-sm text-gray-300 font-mono">
                  {bookingData.transactionId}
                </div>
              </div>
              <div>
                <div className="hud-font text-xs text-gray-400">Amount Paid</div>
                <div className="hud-font text-sm font-semibold text-green-400">
                  {formatAmount(bookingData.amount, bookingData.currency)}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Customer Information */}
          <motion.div
            className="system-card p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="hud-font text-sm font-semibold text-indigo-400 mb-3 flex items-center">
              <Users className="mr-2" size={16} />
              CUSTOMER DETAILS
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 hud-font text-sm">
              <div>
                <div className="text-gray-400 text-xs">Name</div>
                <div className="text-gray-300">{bookingData.customerInfo.name}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs">Email</div>
                <div className="text-gray-300">{bookingData.customerInfo.email}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs">Phone</div>
                <div className="text-gray-300">{bookingData.customerInfo.phone}</div>
              </div>
            </div>
          </motion.div>

          {/* Booking Details */}
          <motion.div
            className="system-card p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h4 className="hud-font text-sm font-semibold text-indigo-400 mb-3 flex items-center">
              <Calendar className="mr-2" size={16} />
              BOOKING INFORMATION
            </h4>
            <div className="space-y-3 hud-font text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Booking Date:</span>
                <span className="text-gray-300">{formatDate(bookingData.timestamp)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-green-400 font-semibold">CONFIRMED</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Payment Method:</span>
                <span className="text-gray-300 flex items-center">
                  <CreditCard className="mr-1" size={14} />
                  Stark Secure Payment
                </span>
              </div>
            </div>
          </motion.div>

          {/* Important Information */}
          <motion.div
            className="system-card p-4 border-l-4 border-yellow-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h4 className="hud-font text-sm font-semibold text-yellow-400 mb-2 flex items-center">
              <Clock className="mr-2" size={16} />
              IMPORTANT INFORMATION
            </h4>
            <div className="hud-font text-xs text-gray-300 space-y-1">
              <p>• Please save your booking reference number for future reference</p>
              <p>• A confirmation email will be sent to your registered email address</p>
              <p>• {bookingData.type === 'flight' 
                  ? 'Please arrive at the airport at least 2 hours before departure' 
                  : 'Check-in time is usually 3:00 PM and check-out is 11:00 AM'}</p>
              <p>• For any changes or cancellations, contact our support team</p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.button
              onClick={downloadTicket}
              className="flex-1 flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hud-font text-sm transition-all hover:shadow-lg hover:shadow-indigo-500/25"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download size={16} />
              <span>Download Ticket</span>
            </motion.button>

            <motion.button
              onClick={sendEmail}
              className="flex-1 flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hud-font text-sm transition-all hover:shadow-lg hover:shadow-green-500/25"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Mail size={16} />
              <span>Email Confirmation</span>
            </motion.button>

            <motion.button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium hud-font text-sm transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Close
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}