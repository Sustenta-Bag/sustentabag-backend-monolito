# Location Service for Sustenta-bag

This module provides location-based services for the Sustenta-bag application, allowing users to find nearby businesses based on their address.

## Features

- Geocoding of addresses to obtain geographic coordinates
- Finding nearby businesses within a specified radius
- Finding nearby businesses based on logged-in client's address
- Distance calculation between locations
- Integration with Mapbox API for enhanced geolocation services

## Setup

1. **Get a Mapbox API Key**:
   - Create an account at [Mapbox](https://account.mapbox.com/access-tokens/)
   - Generate an access token with the appropriate permissions

2. **Add the API Key to Environment Variables**:
   - In your `.env` file, add:
     ```
     MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
     ```

## API Endpoints

### Find Nearby Businesses by Logged-in Client

```
GET /api/location/nearby/client
```

Find businesses near the logged-in client's address. This endpoint requires authentication with a client role.

**Authentication**:
- Requires a valid JWT token in the Authorization header
- Token must be from a user with role "client"

**Parameters**:
- `radius` (query, optional): Search radius in kilometers (default: 10)
- `limit` (query, optional): Maximum number of results to return (default: 10)

**Response**:
```json
{
  "count": 3,
  "data": [
    {
      "id": 1,
      "name": "Example Business",
      "legalName": "Example Business Ltd.",
      "logo": "/uploads/logos/example.png",
      "distance": 2.34,
      "address": {
        "street": "Main Street",
        "number": "123",
        "city": "Example City",
        "state": "EX",
        "zipCode": "12345678"
      }
    }
  ]
}
```

**Error Responses**:
- `400 Bad Request`: Client has no address
- `401 Unauthorized`: Authentication required or invalid token
- `403 Forbidden`: Access allowed only for clients

### Find Nearby Businesses by Address ID

```
GET /api/location/nearby/:addressId
```

Find businesses near a specific address.

**Parameters**:
- `addressId` (path): ID of the reference address
- `radius` (query, optional): Search radius in kilometers (default: 10)
- `limit` (query, optional): Maximum number of results to return (default: 10)

**Response**:
```json
{
  "count": 3,
  "data": [
    {
      "id": 1,
      "name": "Example Business",
      "legalName": "Example Business Ltd.",
      "logo": "/uploads/logos/example.png",
      "distance": 2.34,
      "address": {
        "street": "Main Street",
        "number": "123",
        "city": "Example City",
        "state": "EX",
        "zipCode": "12345678"
      }
    },
  ]
}
```

### Geocode an Address

```
POST /api/location/geocode
```

Convert an address to geographic coordinates.

**Request Body**:
```json
{
  "street": "Main Street",
  "number": "123",
  "city": "Example City",
  "state": "EX",
  "zipCode": "12345678"
}
```

**Response**:
```json
{
  "latitude": -23.5505,
  "longitude": -46.6333,
  "fullAddress": "Main Street, 123, Example City, EX, 12345678"
}
```

## Implementation Details

The location service uses the Haversine formula to calculate distances between geographic points, taking into account the Earth's curvature for accurate distance measurement.

When an address is created or updated, the system attempts to geocode it automatically if a Mapbox API key is available. This enriches the address data with coordinates that can be used for location-based queries.

## Fallback Behavior

If the Mapbox API key is not set or if geocoding fails, the system will still function but with limited location capabilities. Addresses will be stored without coordinates, and location-based searches will be unavailable until coordinates are added.
