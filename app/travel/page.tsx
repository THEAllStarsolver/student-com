'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { searchFlights } from '@/lib/flights';
import GlassCard from '@/components/ui/GlassCard';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Plane, MapPin, Star, Clock, Calendar } from 'lucide-react';

const airlineLogos: any = {
  'IndiGo': { logo: '/airlines/indigo.png', color: '#0033A0', website: 'https://www.goindigo.in/' },
  'Vistara': { logo: '/airlines/indigo.png', color: '#7F3F98', website: 'https://www.airvistara.com/' },
  'Air India': { logo: '/airlines/airindia.jpeg', color: '#E30613', website: 'https://www.airindia.com/' },
  'SpiceJet': { logo: '/airlines/spicejet.png', color: '#ED1C24', website: 'https://www.spicejet.com/' },
};

const hotelImages = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
];

export default function TravelPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [searchMode, setSearchMode] = useState<'flights' | 'hotels'>('flights');
  const [showResults, setShowResults] = useState(false);
  const [flights, setFlights] = useState<import('@/lib/flights').Flight[]>([]);
  const [hotels, setHotels] = useState<any[]>([]); // Using any for simplicity in this iteration
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingHotels, setIsLoadingHotels] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const getStops = () => Math.random() > 0.5 ? 'Non-stop' : '1 Stop';

  const handleSearch = async () => {
    if (searchMode === 'flights') {
      if (!from || !to) {
        alert('Please enter both From and To cities');
        return;
      }
      setIsSearching(true);
      setShowResults(true);
      try {
        const results = await searchFlights(from, to, date);
        setFlights(results);
      } catch (error) {
        console.error('Failed to fetch flights', error);
        alert('Failed to fetch flights. Please try again.');
      } finally {
        setIsSearching(false);
      }
    } else {
      fetchHotels();
    }
  };

  const fetchHotels = async () => {
    const destination = to || 'Mumbai';
    setIsLoadingHotels(true);
    setShowResults(true);
    try {
      const res = await fetch(`/api/hotels?city=${encodeURIComponent(destination)}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const hotelsWithImages = data.map((hotel, idx) => ({
          ...hotel,
          image: hotelImages[idx % hotelImages.length],
          location: hotel.location || 'Near Airport',
        }));
        setHotels(hotelsWithImages);
      } else {
        setHotels([]);
      }
    } catch (error) {
      console.error('Failed to fetch hotels', error);
      alert('Failed to fetch hotels. Please try again.');
    } finally {
      setIsLoadingHotels(false);
    }
  };

  const handleFlightBooking = (airline: string, flight: import('@/lib/flights').Flight) => {
    const airlineData = airlineLogos[airline] || {};
    const params = new URLSearchParams({
      airline: airline,
      flightNumber: flight.flightNumber,
      from: flight.from,
      to: flight.to,
      departure: flight.departure,
      arrival: flight.arrival,
      price: flight.price.toString(),
      duration: flight.duration,
      logo: airlineData.logo || ''
    });

    // Open in new tab as requested
    window.open(`/travel/book?${params.toString()}`, '_blank');
  };

  const handleHotelBooking = () => {
    window.open('https://www.makemytrip.com/hotels/', '_blank');
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Travel Planner ✈️</h1>
      <p className="text-slate-300 mb-10 text-lg">Book flights and hotels at best prices</p>

      {/* Segmented Control Tabs */}
      <div className="inline-flex gap-1 p-1 mb-8 backdrop-blur-xl bg-slate-800/40 border border-white/10 rounded-2xl">
        <button
          onClick={() => { setSearchMode('flights'); setShowResults(false); }}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${searchMode === 'flights'
            ? 'backdrop-blur-xl bg-white/20 border border-white/30 text-white shadow-lg'
            : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
        >
          <Plane className="w-5 h-5" />
          Flights
        </button>
        <button
          onClick={() => { setSearchMode('hotels'); setShowResults(false); }}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${searchMode === 'hotels'
            ? 'backdrop-blur-xl bg-white/20 border border-white/30 text-white shadow-lg'
            : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
        >
          <MapPin className="w-5 h-5" />
          Hotels
        </button>
      </div>

      {/* Search Card */}
      <GlassCard className="mb-10">
        <h2 className="text-2xl font-bold mb-6 text-white">
          {searchMode === 'flights' ? 'Search Flights' : 'Search Hotels'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <div>
            <label className="block text-xs font-semibold mb-2 text-slate-400 uppercase tracking-wider">
              {searchMode === 'flights' ? 'From' : 'City'}
            </label>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder={searchMode === 'flights' ? 'Delhi' : 'Mumbai'}
              className="w-full px-4 py-3.5 rounded-xl bg-slate-700/50 border border-white/10 text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
          {searchMode === 'flights' && (
            <div>
              <label className="block text-xs font-semibold mb-2 text-slate-400 uppercase tracking-wider">To</label>
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Mumbai"
                className="w-full px-4 py-3.5 rounded-xl bg-slate-700/50 border border-white/10 text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold mb-2 text-slate-400 uppercase tracking-wider">
              {searchMode === 'flights' ? 'Departure' : 'Check-in'}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-slate-700/50 border border-white/10 text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
        </div>
        <button
          onClick={handleSearch}
          disabled={isSearching || isLoadingHotels}
          className="w-full py-4 text-lg font-bold rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all hover:shadow-xl"
        >
          {isSearching || isLoadingHotels ? 'Searching...' : `Search ${searchMode === 'flights' ? 'Flights' : 'Hotels'}`}
        </button>
      </GlassCard>

      {/* Results Section */}
      {showResults && searchMode === 'flights' && (
        <>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              {flights.length} Flights Found
            </h2>
          </div>
          {isSearching ? (
            <div className="text-center py-16 text-slate-600 dark:text-gray-400">Searching for best flights...</div>
          ) : flights.length === 0 ? (
            <div className="text-center py-16 text-slate-500 dark:text-gray-400">No flights found. Try different cities or dates.</div>
          ) : (
            <div className="space-y-4">
              {flights.map((flight) => {
                const airlineData = airlineLogos[flight.airline] || { logo: '', color: '#0033A0' };
                const stops = Math.random() > 0.5 ? 'Non-stop' : '1 Stop';
                return (
                  <GlassCard key={flight.id} className="card-hover">
                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                      {/* Left: Airline Info */}
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-xl p-2 flex items-center justify-center border border-white/20">
                          {airlineData.logo ? (
                            <img src={airlineData.logo} alt={flight.airline} className="w-full h-full object-contain" />
                          ) : (
                            <Plane className="w-8 h-8" style={{ color: airlineData.color }} />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{flight.airline}</h3>
                          <p className="text-sm text-slate-400">{flight.flightNumber}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                            {stops}
                          </span>
                        </div>
                      </div>

                      {/* Center: Flight Details */}
                      <div className="flex items-center gap-6 flex-1">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-white">{flight.departure}</p>
                          <p className="text-sm text-slate-400">{flight.from}</p>
                        </div>
                        <div className="flex-1 flex flex-col items-center">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-medium">{flight.duration}</span>
                          </div>
                          <div className="w-full h-px bg-slate-600 my-2 relative">
                            <Plane className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-500" />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-white">{flight.arrival}</p>
                          <p className="text-sm text-slate-400">{flight.to}</p>
                        </div>
                      </div>

                      {/* Right: Price & Book */}
                      <div className="flex flex-col justify-center items-end gap-3 min-w-[180px]">
                        <div className="text-right">
                          <p className="text-3xl font-bold text-blue-400">₹{flight.price.toLocaleString()}</p>
                          <p className="text-xs text-slate-400">{flight.seats} seats left</p>
                        </div>
                        <button
                          onClick={() => handleFlightBooking(flight.airline, flight)}
                          className="w-full px-6 py-3 rounded-xl font-bold text-white backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 shadow-lg transition-all hover:shadow-xl hover:scale-105"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </>
      )}

      {showResults && searchMode === 'hotels' && (
        <>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">
              {hotels.length} Hotels Found
            </h2>
          </div>
          {isLoadingHotels ? (
            <div className="text-center py-16 text-slate-600 dark:text-gray-400">Finding best hotels...</div>
          ) : hotels.length === 0 ? (
            <div className="text-center py-16 text-slate-500 dark:text-gray-400">No hotels found. Try a different city.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hotels.map((hotel, idx) => (
                <GlassCard key={hotel.id} className="overflow-hidden p-0 card-hover">
                  {/* Hotel Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm font-bold text-white">{hotel.rating?.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Hotel Details */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{hotel.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{hotel.location}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2 mb-4">
                      <span className="px-2 py-1 text-xs font-semibold rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Luxury</span>
                      <span className="px-2 py-1 text-xs font-semibold rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">Near Airport</span>
                    </div>

                    {/* Price & Book */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div>
                        <div>
                          <p className="text-xs text-slate-500 line-through">₹{(hotel.price * 1.3).toLocaleString()}</p>
                          <p className="text-2xl font-bold text-white">₹{hotel.price.toLocaleString()}</p>
                          <p className="text-xs text-slate-400">per night</p>
                        </div>
                      </div>
                      <button
                        onClick={handleHotelBooking}
                        className="px-5 py-2.5 rounded-xl font-bold text-white backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 shadow-lg transition-all hover:shadow-xl hover:scale-105"
                      >
                        View Deal
                      </button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
