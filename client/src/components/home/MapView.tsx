import { useEffect, useState, useRef } from "react";
import { Loader2, MapPin } from "lucide-react";

interface MapViewProps {
  clinics: any[];
  selectedDistance?: number;
  userLocation?: { lat: number; lng: number };
}

declare global {
  interface Window {
    L: any;
  }
}

export function MapView({ clinics, selectedDistance = 5, userLocation }: MapViewProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);

  useEffect(() => {
    // Load Leaflet via CDN if not already loaded
    if (!document.getElementById("leaflet-js")) {
      const script = document.createElement("script");
      script.id = "leaflet-js";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.onload = () => initMap();
      document.head.appendChild(script);

      const style = document.createElement("link");
      style.rel = "stylesheet";
      style.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(style);
    } else if (window.L) {
      initMap();
    }

    function initMap() {
      if (!window.L || mapRef.current) return;

      const L = window.L;

      // Fix marker icons
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Default center (could be a major city or userLocation if provided)
      const center: [number, number] = userLocation ? [userLocation.lat, userLocation.lng] : [6.5244, 3.3792]; // Lagos default

      const map = L.map("clinics-map").setView(center, 13);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      setMapLoaded(true);

      // If no userLocation provided yet, try to get it
      if (!userLocation) {
        requestUserLocation();
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const requestUserLocation = () => {
    if (!navigator.geolocation || !window.L || !mapRef.current) return;
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const L = window.L;
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        mapRef.current.setView([lat, lng], 13);

        if (userMarkerRef.current) {
          mapRef.current.removeLayer(userMarkerRef.current);
        }

        const userIcon = L.divIcon({
          className: "user-current-location",
          html: `<div class="w-6 h-6 bg-blue-600 border-4 border-white rounded-full shadow-lg animate-pulse"></div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        userMarkerRef.current = L.marker([lat, lng], { icon: userIcon })
          .addTo(mapRef.current)
          .bindPopup("You are here");

        setIsLocating(false);
      },
      (err) => {
        console.error(err);
        setIsLocating(false);
      }
    );
  };

  // Sync Markers when clinics data changes
  useEffect(() => {
    if (!mapLoaded || !window.L || !mapRef.current) return;

    const L = window.L;

    // Clear old markers
    markersRef.current.forEach(m => mapRef.current.removeLayer(m));
    markersRef.current = [];

    clinics.forEach((clinic) => {
      let lat, lng;
      if (clinic.location?.coordinates) {
        lng = clinic.location.coordinates[0];
        lat = clinic.location.coordinates[1];
      } else if (clinic.latitude && clinic.longitude) {
        lat = clinic.latitude;
        lng = clinic.longitude;
      }

      if (lat && lng) {
        const image = clinic.image || (clinic.images && clinic.images[0]) || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400";
        const address = typeof clinic.address === 'object'
          ? `${clinic.address.street_address || ''}, ${clinic.address.city || ''}`
          : (clinic.address || clinic.location || "Address not specified");

        // Extract phone number
        const phone = clinic.phone || clinic.contact_phone || clinic.contact?.phone || "";
        const phoneDisplay = phone || "Not available";

        const clinicIcon = L.divIcon({
          className: "clinic-marker",
          html: `<div class="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          </div>`,
          iconSize: [40, 40],
          iconAnchor: [20, 40]
        });

        const popupContent = `
          <div class="p-2 max-w-[240px] font-sans">
            <div class="h-24 w-full mb-2 rounded-lg overflow-hidden bg-muted">
              <img src="${image}" class="w-full h-full object-cover" alt="${clinic.name}" />
            </div>
            <h3 class="font-bold text-sm text-foreground line-clamp-1">${clinic.name}</h3>
            <p class="text-[11px] text-muted-foreground mt-1 line-clamp-2">${address}</p>
            <div class="mt-2 flex items-center gap-1 text-[10px] font-bold text-primary">
              <span class="bg-primary/10 px-1.5 py-0.5 rounded">★ ${clinic.rating || 4.5}</span>
              <span class="bg-primary/10 px-1.5 py-0.5 rounded">${clinic.distance || 'Nearby'}</span>
            </div>
            
            <!-- Action Buttons -->
            <div class="mt-3 grid grid-cols-2 gap-2">
              <a 
                href="tel:${phone}" 
                class="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[11px] font-semibold transition-colors no-underline ${!phone ? 'opacity-50 pointer-events-none' : ''}"
                ${!phone ? 'onclick="return false;"' : ''}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>Call</span>
              </a>
              
              <a 
                href="/map-navigation?lat=${lat}&lng=${lng}&name=${encodeURIComponent(clinic.name)}" 
                class="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-[11px] font-semibold transition-colors no-underline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                </svg>
                <span>Directions</span>
              </a>
            </div>
            
            ${!phone ? '<p class="text-[9px] text-muted-foreground mt-1.5 text-center">Phone number not available</p>' : ''}
          </div>
        `;

        const marker = L.marker([lat, lng], { icon: clinicIcon })
          .addTo(mapRef.current)
          .bindPopup(popupContent, { minWidth: 240, maxWidth: 240 });

        markersRef.current.push(marker);
      }
    });

    // Auto-fit bounds if markers exist
    if (markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      mapRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [clinics, mapLoaded]);

  // Sync User Location from Props
  useEffect(() => {
    if (userLocation && mapRef.current && window.L) {
      const L = window.L;
      mapRef.current.setView([userLocation.lat, userLocation.lng], 13);

      if (userMarkerRef.current) {
        mapRef.current.removeLayer(userMarkerRef.current);
      }

      const userIcon = L.divIcon({
        className: "user-current-location",
        html: `<div class="w-6 h-6 bg-blue-600 border-4 border-white rounded-full shadow-lg animate-pulse"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(mapRef.current)
        .bindPopup("You are here");
    }
  }, [userLocation, mapLoaded]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-inner">
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30 z-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
        </div>
      )}

      {isLocating && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-primary/20 flex items-center gap-2 text-xs font-bold text-primary animate-in fade-in zoom-in duration-300">
          <Loader2 className="w-3 h-3 animate-spin" />
          LOCATING YOU...
        </div>
      )}

      <div id="clinics-map" className="w-full h-full z-0" />

      <style>{`
        .leaflet-popup-content-wrapper {
          border-radius: 12px !important;
          padding: 0 !important;
          overflow: hidden !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          width: 240px !important;
        }
        .leaflet-popup-tip-container {
          display: none !important;
        }
        .leaflet-container {
          font-family: inherit !important;
        }
        .leaflet-popup a {
          text-decoration: none !important;
        }
        .leaflet-popup a:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}
