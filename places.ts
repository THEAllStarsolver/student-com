// Google Places API Helper

export interface Place {
  name: string;
  type: string;
  rating?: number;
  address: string;
  mapsUrl: string;
}

export async function searchNearbyPlaces(
  type: string,
  lat?: number,
  lng?: number
): Promise<Place[]> {
  try {
    // TODO: Get real geolocation from browser navigator.geolocation
    const latitude = lat || 28.6139; // Default: Delhi
    const longitude = lng || 77.2090;
    
    const response = await fetch(
      `/api/places?type=${encodeURIComponent(type)}&lat=${latitude}&lng=${longitude}`
    );
    if (!response.ok) throw new Error('Places API failed');
    return await response.json();
  } catch (error) {
    console.error('Places search error:', error);
    return [];
  }
}

export function detectPlaceType(query: string): string | null {
  const lowerQuery = query.toLowerCase();
  if (lowerQuery.includes('cafe') || lowerQuery.includes('coffee')) return 'cafe';
  if (lowerQuery.includes('library')) return 'library';
  if (lowerQuery.includes('park')) return 'park';
  if (lowerQuery.includes('restaurant') || lowerQuery.includes('food')) return 'restaurant';
  if (lowerQuery.includes('gym')) return 'gym';
  return null;
}
