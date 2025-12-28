import { useEffect, useState, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Navigation, ArrowLeft, Loader2 } from "lucide-react";

declare global {
    interface Window {
        L: any;
    }
}

export default function MapNavigation() {
    const searchParams = new URLSearchParams(window.location.search);
    const latParam = parseFloat(searchParams.get("lat") || "0");
    const lngParam = parseFloat(searchParams.get("lng") || "0");
    const clinicName = searchParams.get("name") || "Clinic Location";

    const [isLocating, setIsLocating] = useState(false);
    const [mapLoaded, setMapLoaded] = useState(false);
    const mapRef = useRef<any>(null);
    const routingControlRef = useRef<any>(null);
    const userMarkerRef = useRef<any>(null);

    const destination: [number, number] = [latParam, lngParam];

    useEffect(() => {
        // Load Leaflet and Routing Machine via CDN
        const libs = [
            { type: "script", url: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" },
            { type: "script", url: "https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js" }
        ];

        let loadedCount = 0;
        libs.forEach(lib => {
            const script = document.createElement("script");
            script.src = lib.url;
            script.async = true;
            script.onload = () => {
                loadedCount++;
                if (loadedCount === libs.length) {
                    initMap();
                }
            };
            document.head.appendChild(script);
        });

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

            const map = L.map("navigation-map").setView(destination, 15);
            mapRef.current = map;

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Clinic Icon
            const clinicIcon = L.divIcon({
                className: "clinic-location-marker",
                html: `<div class="w-8 h-8 bg-[#3b82f6] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        </div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 32]
            });

            L.marker(destination, { icon: clinicIcon })
                .addTo(map)
                .bindPopup(`<b>${clinicName}</b><br>Professional Clinic`)
                .openPopup();

            setMapLoaded(true);
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    const handleGetRoute = () => {
        if (!window.L || !mapRef.current) return;
        setIsLocating(true);

        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            setIsLocating(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const L = window.L;
                const userLat = pos.coords.latitude;
                const userLng = pos.coords.longitude;

                if (routingControlRef.current) {
                    mapRef.current.removeControl(routingControlRef.current);
                }

                if (userMarkerRef.current) {
                    mapRef.current.removeLayer(userMarkerRef.current);
                }

                const userIcon = L.divIcon({
                    className: "user-location-marker",
                    html: `<div class="w-6 h-6 bg-emerald-600 border-4 border-white rounded-full shadow-lg animate-pulse"></div>`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                });

                userMarkerRef.current = L.marker([userLat, userLng], { icon: userIcon })
                    .addTo(mapRef.current)
                    .bindPopup("Your Location");

                routingControlRef.current = L.Routing.control({
                    waypoints: [
                        L.latLng(userLat, userLng),
                        L.latLng(destination[0], destination[1])
                    ],
                    routeWhileDragging: false,
                    addWaypoints: false,
                    draggableWaypoints: false,
                    fitSelectedRoutes: true,
                    lineOptions: {
                        styles: [{ color: '#3b82f6', weight: 6, opacity: 0.8 }]
                    },
                    createMarker: () => null // We already have markers
                }).addTo(mapRef.current);

                setIsLocating(false);
            },
            (err) => {
                console.error(err);
                alert("Please enable location permissions to find the route");
                setIsLocating(false);
            }
        );
    };

    return (
        <div className="h-screen flex flex-col bg-background font-sans overflow-hidden">
            <Header />

            <main className="flex-1 relative pt-16">
                <div className="absolute top-20 left-4 z-[1000] max-w-sm w-full">
                    <Card className="shadow-2xl border-border/40 backdrop-blur-md bg-white/90">
                        <CardContent className="p-5">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="mb-4 -ml-2 text-muted-foreground hover:text-primary"
                                onClick={() => window.history.back()}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back
                            </Button>

                            <div className="flex items-start gap-3 mb-6">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h1 className="font-bold text-lg leading-tight">{clinicName}</h1>
                                    <p className="text-xs text-muted-foreground mt-1">Found Location</p>
                                </div>
                            </div>

                            <Button
                                className="w-full h-11 font-bold gap-2 shadow-lg shadow-primary/20"
                                onClick={handleGetRoute}
                                disabled={isLocating || !mapLoaded}
                            >
                                {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                                Get Directions
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div id="navigation-map" className="w-full h-full z-0" />
            </main>

            <style>{`
        .leaflet-routing-container {
          background: white !important;
          padding: 15px !important;
          border-radius: 12px !important;
          border: 1px solid rgba(0,0,0,0.1) !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important;
          max-height: 200px !important;
          overflow-y: auto !important;
          margin-right: 15px !important;
          font-family: inherit !important;
          font-size: 13px !important;
          color: #1e293b !important;
        }
        .leaflet-routing-alt-link { display: none !important; }
        .leaflet-routing-geocoders { display: none !important; }
      `}</style>
        </div>
    );
}
