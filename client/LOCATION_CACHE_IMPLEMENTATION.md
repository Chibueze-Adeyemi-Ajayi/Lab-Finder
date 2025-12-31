# Location Caching Implementation

## Overview
Implemented a session-based location caching system that stores user coordinates and automatically refreshes them on each browsing session.

## Key Features

### 1. Location Cache Utility (`lib/locationCache.ts`)
- **Session-based caching**: Each browsing session gets a unique ID stored in `sessionStorage`
- **Automatic invalidation**: Cache is cleared when a new session starts (new tab/window or browser restart)
- **localStorage persistence**: Coordinates persist across page refreshes within the same session
- **Fresh location updates**: On each page load, cached location is used immediately while a fresh location is requested in the background

### 2. Home Page Integration
- **Automatic location loading**: 
  - Checks if location permission is granted on mount
  - Loads cached coordinates immediately for instant results
  - Requests fresh location in background and updates cache
- **Location-based search**: 
  - Passes `lat`, `lng`, and `radius` (20km default) to clinic search API when coordinates are available
  - Query automatically refetches when coordinates change
- **Dynamic heading**: Shows "Clinics close to you" when location is available

### 3. Hero Component Integration
- **Location caching on permission grant**: When user enables location, coordinates are cached
- **Proximity search caching**: When user clicks "Search by Proximity", coordinates are cached
- **Query invalidation**: Home page results refresh automatically when location is obtained

## How It Works

### Session Flow
1. **First page load in new session**:
   - New session ID generated
   - If location permission granted → request location → cache it
   - Show cached location immediately, update with fresh location in background

2. **Page refresh in same session**:
   - Same session ID used
   - Cached location loaded instantly
   - Fresh location requested and cache updated

3. **New browser tab/window**:
   - New session ID generated
   - Previous cache invalidated
   - Fresh location requested

### Cache Structure
```typescript
{
  user_lat: number,
  user_lng: number,
  timestamp: number,
  sessionId: string  // Unique per browsing session
}
```

## API Integration
All location-based API requests use `user_lat` and `user_lng` as parameter names for consistency.

## Benefits
- ✅ Instant results on page load (uses cache)
- ✅ Always up-to-date (fresh location requested in background)
- ✅ Privacy-friendly (cache cleared on new session)
- ✅ Reduced API calls (cache reused within session)
- ✅ Better UX (no loading delay for location-based results)
