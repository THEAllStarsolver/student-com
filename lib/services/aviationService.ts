// Aviation Service - AviationStack API Integration
import { config, endpoints } from '../config';

export interface FlightData {
  flight_date: string;
  flight_status: string;
  departure: {
    airport: string;
    timezone: string;
    iata: string;
    icao: string;
    terminal: string;
    gate: string;
    scheduled: string;
    estimated: string;
    actual: string;
  };
  arrival: {
    airport: string;
    timezone: string;
    iata: string;
    icao: string;
    terminal: string;
    gate: string;
    scheduled: string;
    estimated: string;
    actual: string;
  };
  airline: {
    name: string;
    iata: string;
    icao: string;
  };
  flight: {
    number: string;
    iata: string;
    icao: string;
  };
}

export interface AirportData {
  airport_name: string;
  iata_code: string;
  icao_code: string;
  country_name: string;
  country_iso2: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

class AviationService {
  private baseUrl = config.aviationStack.baseUrl;
  private accessKey = config.aviationStack.accessKey;

  // Get real-time flight information
  async getFlights(params?: {
    airline_name?: string;
    flight_iata?: string;
    dep_iata?: string;
    arr_iata?: string;
    limit?: number;
  }): Promise<FlightData[]> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('access_key', this.accessKey!);
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const response = await fetch(`${endpoints.aviation.flights}?${queryParams}`);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      return data.data || [];
    } catch (error) {
      console.error('Aviation Service - Get Flights Error:', error);
      throw error;
    }
  }

  // Get airport information
  async getAirports(params?: {
    country_name?: string;
    city_name?: string;
    iata_code?: string;
    limit?: number;
  }): Promise<AirportData[]> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('access_key', this.accessKey!);
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const response = await fetch(`${endpoints.aviation.airports}?${queryParams}`);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      return data.data || [];
    } catch (error) {
      console.error('Aviation Service - Get Airports Error:', error);
      throw error;
    }
  }

  // Get airline information
  async getAirlines(params?: {
    airline_name?: string;
    iata_code?: string;
    country_name?: string;
    limit?: number;
  }) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('access_key', this.accessKey!);
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const response = await fetch(`${endpoints.aviation.airlines}?${queryParams}`);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      return data.data || [];
    } catch (error) {
      console.error('Aviation Service - Get Airlines Error:', error);
      throw error;
    }
  }

  // Get flight routes
  async getRoutes(params?: {
    dep_iata?: string;
    arr_iata?: string;
    airline_iata?: string;
    limit?: number;
  }) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('access_key', this.accessKey!);
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const response = await fetch(`${endpoints.aviation.routes}?${queryParams}`);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      return data.data || [];
    } catch (error) {
      console.error('Aviation Service - Get Routes Error:', error);
      throw error;
    }
  }

  // Mock data for demo purposes when API is not available
  getMockFlightData(): FlightData[] {
    return [
      {
        flight_date: new Date().toISOString().split('T')[0],
        flight_status: 'active',
        departure: {
          airport: 'Indira Gandhi International Airport',
          timezone: 'Asia/Kolkata',
          iata: 'DEL',
          icao: 'VIDP',
          terminal: '3',
          gate: 'A12',
          scheduled: '2024-01-15T14:30:00+00:00',
          estimated: '2024-01-15T14:35:00+00:00',
          actual: '',
        },
        arrival: {
          airport: 'Chhatrapati Shivaji International Airport',
          timezone: 'Asia/Kolkata',
          iata: 'BOM',
          icao: 'VABB',
          terminal: '2',
          gate: 'B7',
          scheduled: '2024-01-15T16:45:00+00:00',
          estimated: '2024-01-15T16:50:00+00:00',
          actual: '',
        },
        airline: {
          name: 'Air India',
          iata: 'AI',
          icao: 'AIC',
        },
        flight: {
          number: '2847',
          iata: 'AI2847',
          icao: 'AIC2847',
        },
      },
    ];
  }
}

export const aviationService = new AviationService();
export default aviationService;