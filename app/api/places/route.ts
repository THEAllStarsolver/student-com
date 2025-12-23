import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!type || !lat || !lng) {
      return NextResponse.json(
        { error: 'Type, lat, and lng parameters required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      console.error('Google Places API key not configured');
      return NextResponse.json({ error: 'Places API not configured' }, { status: 500 });
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=${type}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Places API request failed');
    }

    const data = await response.json();

    const places = data.results.slice(0, 5).map((place: any) => ({
      name: place.name,
      type: place.types[0],
      rating: place.rating,
      address: place.vicinity,
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        place.name
      )}&query_place_id=${place.place_id}`,
    }));

    return NextResponse.json(places);
  } catch (error) {
    console.error('Places API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch places' },
      { status: 500 }
    );
  }
}
