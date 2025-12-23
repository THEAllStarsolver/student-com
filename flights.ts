'use server';

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  seats: number;
}

const CITY_CODES: Record<string, string> = {
  'delhi': 'DEL',
  'mumbai': 'BOM',
  'bangalore': 'BLR',
  'chennai': 'MAA',
  'kolkata': 'CCU',
  'hyderabad': 'HYD',
  'pune': 'PNQ',
  'goa': 'GOI',
  'jaipur': 'JAI',
  'ahmedabad': 'AMD'
};

function getIataCode(city: string): string {
  const normalized = city.toLowerCase().trim();
  return CITY_CODES[normalized] || normalized.toUpperCase();
}

function calculateDuration(dep: string, arr: string): string {
  // Simple duration calculation if dates are available, else return rough estimate
  // API returns ISO strings like "2024-03-20T10:00:00+00:00"
  try {
    const d1 = new Date(dep);
    const d2 = new Date(arr);
    const diffMs = d2.getTime() - d1.getTime();
    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  } catch (e) {
    return '2h 0m';
  }
}

function formatTime(isoString: string): string {
  try {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    return isoString;
  }
}

export async function searchFlights(from: string, to: string, date: string): Promise<Flight[]> {
  try {
    const accessKey = process.env.AVIATIONSTACK_ACCESS_KEY;
    if (!accessKey) {
      console.warn('Aviationstack API key is missing');
      // Return empty or mock for safety if key missing during dev
      return [];
    }

    const depIata = getIataCode(from);
    const arrIata = getIataCode(to);

    // API expects YYYY-MM-DD
    // If date is not provided, maybe default to today? Or handle in UI.
    // Assuming date is passed in correct format or present.

    const url = `http://api.aviationstack.com/v1/flights?access_key=${accessKey}&dep_iata=${depIata}&arr_iata=${arrIata}`; // Add &flight_date=${date} if needed, but strictly filter might return 0 results if specific date has no flights in free tier

    // Note: Free tier might not strictly support route filtering perfectly or realtime data for all routes. 
    // We will try our best.

    const response = await fetch(url, { cache: 'no-store' });
    const data = await response.json();

    if (!data.data || !Array.isArray(data.data)) {
      console.error('Invalid API response:', data);
      return [];
    }

    // Map the response to our Flight interface
    // Note: API response structure:
    // {
    //   flight_date: '2024-03-20',
    //   flight_status: 'scheduled',
    //   departure: { airport: '...', iata: 'DEL', scheduled: '...' },
    //   arrival: { airport: '...', iata: 'BOM', scheduled: '...' },
    //   airline: { name: 'IndiGo', iata: '6E', ... },
    //   flight: { number: '2045', ... }
    // }

    return data.data.slice(0, 10).map((item: any, index: number) => ({
      id: `${item.flight?.iata || index}`,
      airline: item.airline?.name || 'Unknown Airline',
      flightNumber: item.flight?.iata || item.flight?.number || 'N/A',
      from: item.departure?.airport || from,
      to: item.arrival?.airport || to,
      departure: formatTime(item.departure?.scheduled),
      arrival: formatTime(item.arrival?.scheduled),
      duration: calculateDuration(item.departure?.scheduled, item.arrival?.scheduled),
      price: Math.floor(Math.random() * (8000 - 3000) + 3000), // Mock price as API doesn't provide it in basic tier
      seats: Math.floor(Math.random() * 20) + 1, // Mock seats
    }));

  } catch (error) {
    console.error('Error fetching flights:', error);
    return [];
  }
}
