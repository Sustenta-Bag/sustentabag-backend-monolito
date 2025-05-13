import mapboxSdk from '@mapbox/mapbox-sdk';
import geocodingService from '@mapbox/mapbox-sdk/services/geocoding.js';
import dotenv from 'dotenv';

dotenv.config();

async function testMapbox() {
  try {
    const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN;
    
    if (!mapboxToken) {
      console.error('Error: MAPBOX_ACCESS_TOKEN not set in environment');
      process.exit(1);
    }

    console.log('Testing Mapbox token...');
    
    const mapboxClient = mapboxSdk({ accessToken: mapboxToken });
    const geocodingClient = geocodingService(mapboxClient);
    
    const response = await geocodingClient
      .forwardGeocode({
        query: 'Avenida Paulista, 1000, São Paulo, SP, Brazil',
        limit: 1,
        countries: ['br']
      })
      .send();
    
    if (response.body && response.body.features && response.body.features.length > 0) {
      const [lng, lat] = response.body.features[0].center;
      console.log('Geocoding successful!');
      console.log(`Latitude: ${lat}, Longitude: ${lng}`);
      console.log('Place name:', response.body.features[0].place_name);
      console.log('Your Mapbox token is working correctly.');
    } else {
      console.error('Geocoding returned no results.');
    }
  } catch (error) {
    console.error('Error testing Mapbox token:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testMapbox();
