// Location cache utility for managing user coordinates
// Cache is session-based and refreshed on each page load

const LOCATION_CACHE_KEY = 'user_location_cache';
const SESSION_KEY = 'location_session_id';

interface LocationCache {
    user_lat: number;
    user_lng: number;
    timestamp: number;
    sessionId: string;
}

// Generate a unique session ID for this browsing session
function getSessionId(): string {
    let sessionId = sessionStorage.getItem(SESSION_KEY);
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
}

// Get cached location if it exists and is from current session
export function getCachedLocation(): { user_lat: number; user_lng: number } | null {
    try {
        const cached = localStorage.getItem(LOCATION_CACHE_KEY);
        if (!cached) return null;

        const data: LocationCache = JSON.parse(cached);
        const currentSessionId = getSessionId();

        // If it's from a different session, invalidate cache
        if (data.sessionId !== currentSessionId) {
            localStorage.removeItem(LOCATION_CACHE_KEY);
            return null;
        }

        return { user_lat: data.user_lat, user_lng: data.user_lng };
    } catch (error) {
        console.error('Error reading location cache:', error);
        return null;
    }
}

// Cache the user's location for the current session
export function cacheLocation(user_lat: number, user_lng: number): void {
    try {
        const cache: LocationCache = {
            user_lat,
            user_lng,
            timestamp: Date.now(),
            sessionId: getSessionId()
        };
        localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
        console.error('Error caching location:', error);
    }
}

// Clear the location cache
export function clearLocationCache(): void {
    try {
        localStorage.removeItem(LOCATION_CACHE_KEY);
    } catch (error) {
        console.error('Error clearing location cache:', error);
    }
}

// Request fresh location and cache it
export function requestAndCacheLocation(): Promise<{ user_lat: number; user_lng: number }> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = {
                    user_lat: position.coords.latitude,
                    user_lng: position.coords.longitude
                };
                cacheLocation(coords.user_lat, coords.user_lng);
                resolve(coords);
            },
            (error) => {
                reject(error);
            }
        );
    });
}
