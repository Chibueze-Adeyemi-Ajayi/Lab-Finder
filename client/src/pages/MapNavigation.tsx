import { useEffect, useState, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    MapPin,
    Navigation,
    ArrowLeft,
    Loader2,
    Layers,
    Bike,
    Car,
    Footprints,
    Target,
    Clock,
    Info,
    ChevronDown,
    ChevronUp,
    Minimize2
} from "lucide-react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

declare global {
    interface Window {
        L: any;
    }
}

type TravelMode = "walking" | "cycling" | "driving";
type MapType = "street" | "satellite" | "terrain";

export default function MapNavigation() {
    const searchParams = new URLSearchParams(window.location.search);
    const latParam = parseFloat(searchParams.get("lat") || "0");
    const lngParam = parseFloat(searchParams.get("lng") || "0");
    const clinicName = searchParams.get("name") || "Clinic Location";

    const [isLocating, setIsLocating] = useState(false);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [mapType, setMapType] = useState<MapType>("street");
    const [distance, setDistance] = useState<string | null>(null);
    const [travelTime, setTravelTime] = useState<Record<TravelMode, string | null>>({
        walking: null,
        cycling: null,
        driving: null
    });

    const mapRef = useRef<any>(null);
    const tileLayerRef = useRef<any>(null);
    const routingControlRef = useRef<any>(null);
    const userMarkerRef = useRef<any>(null);
    const destination: [number, number] = [latParam, lngParam];

    useEffect(() => {
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

            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });

            const map = L.map("navigation-map", {
                zoomControl: false
            }).setView(destination, 15);
            mapRef.current = map;

            // Add standard zoom control at bottom right
            L.control.zoom({ position: 'bottomright' }).addTo(map);

            tileLayerRef.current = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);

            const clinicIcon = L.divIcon({
                className: "clinic-location-marker",
                html: `<div class="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)] border-2 border-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                       </div>`,
                iconSize: [40, 40],
                iconAnchor: [20, 40]
            });

            L.marker(destination, { icon: clinicIcon })
                .addTo(map)
                .bindPopup(`<div class="font-sans p-1"><b class="text-primary">${clinicName}</b><br/><span class="text-muted-foreground text-xs">Destination point</span></div>`);

            setMapLoaded(true);
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // Handle Map Type Toggle
    useEffect(() => {
        if (!mapRef.current || !window.L || !tileLayerRef.current) return;
        const L = window.L;
        mapRef.current.removeLayer(tileLayerRef.current);

        let url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
        if (mapType === "satellite") {
            url = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
        } else if (mapType === "terrain") {
            url = "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";
        }

        tileLayerRef.current = L.tileLayer(url, {
            attribution: mapType === "satellite" ? "Esri" : "OpenStreetMap contributors"
        }).addTo(mapRef.current);
    }, [mapType]);

    const calculateTimes = (meters: number) => {
        // Average speeds in km/h
        const speeds = {
            walking: 5,
            cycling: 15,
            driving: 40
        };

        const distKm = meters / 1000;

        const formatTime = (hours: number) => {
            const mins = Math.round(hours * 60);
            if (mins < 1) return "< 1 min";
            if (mins < 60) return `${mins} mins`;
            const h = Math.floor(mins / 60);
            const m = mins % 60;
            return `${h}h ${m}m`;
        };

        setTravelTime({
            walking: formatTime(distKm / speeds.walking),
            cycling: formatTime(distKm / speeds.cycling),
            driving: formatTime(distKm / speeds.driving)
        });
        setDistance(distKm < 1 ? `${Math.round(meters)}m` : `${distKm.toFixed(1)}km`);
    };

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
                    html: `<div class="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)] border-2 border-white animate-bounce-subtle">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                           </div>`,
                    iconSize: [40, 40],
                    iconAnchor: [20, 40]
                });

                userMarkerRef.current = L.marker([userLat, userLng], { icon: userIcon })
                    .addTo(mapRef.current)
                    .bindPopup("Your Location");

                const control = L.Routing.control({
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
                    show: false, // Hide the default instructions panel
                    createMarker: () => null
                }).addTo(mapRef.current);

                control.on('routesfound', (e: any) => {
                    const routes = e.routes;
                    const summary = routes[0].summary;
                    calculateTimes(summary.totalDistance);
                });

                routingControlRef.current = control;
                setIsLocating(false);
            },
            (err) => {
                console.error(err);
                alert("Please enable location permissions to find the route");
                setIsLocating(false);
            }
        );
    };

    const focusClinic = () => {
        if (mapRef.current) {
            const target = userMarkerRef.current ? userMarkerRef.current.getLatLng() : destination;
            mapRef.current.flyTo(target, 17, {
                duration: 1.5,
                easeLinearity: 0.25
            });
        }
    };

    return (
        <div className="h-screen flex flex-col bg-background font-sans overflow-hidden">
            <Header />

            <main className="flex-1 relative pt-16">
                {/* Info Overlay */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 md:left-4 md:translate-x-0 z-[1000] w-[calc(100%-2rem)] max-w-sm space-y-4 transition-all duration-300">
                    <Card className="shadow-2xl border-border/40 backdrop-blur-md bg-white/90 overflow-hidden">
                        <CardContent className="p-0">
                            <div className="p-5 border-b border-border/40 relative">
                                <div className="flex items-center justify-between mb-4">
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="-ml-2 text-muted-foreground hover:text-primary transition-all hover:bg-primary/5 h-8 px-2"
                                            >
                                                <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="max-w-[calc(100%-2rem)] w-full rounded-2xl">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle className="flex items-center gap-2">
                                                    <Info className="w-5 h-5 text-primary" />
                                                    Exit Navigation?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to close the map? Your current location tracking and route will be lost.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter className="mt-4">
                                                <AlertDialogCancel className="rounded-xl border-border/40">Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    className="rounded-xl bg-primary hover:bg-primary/90"
                                                    onClick={() => window.history.back()}
                                                >
                                                    Confirm
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-muted-foreground hover:text-primary h-8 w-8 p-0"
                                        onClick={() => setIsMinimized(!isMinimized)}
                                        title={isMinimized ? "Expand navigation" : "Minimize navigation"}
                                    >
                                        {isMinimized ? <ChevronDown className="w-5 h-5" /> : <Minimize2 className="w-4 h-4" />}
                                    </Button>
                                </div>

                                {!isMinimized && (
                                    <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                                        <div className="flex items-start gap-3 mb-6">
                                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 border border-primary/20">
                                                <MapPin className="w-6 h-6 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <h1 className="font-bold text-xl leading-snug text-foreground">{clinicName}</h1>
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                                                    <Navigation className="w-3 h-3 text-primary" />
                                                    <span>Destination coordinates locked</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mb-4">
                                            <Button
                                                className="h-11 font-bold gap-2 shadow-lg shadow-primary/20 flex-1"
                                                onClick={handleGetRoute}
                                                disabled={isLocating || !mapLoaded}
                                            >
                                                {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                                                Get Route
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="h-11 font-bold gap-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 text-primary"
                                                onClick={focusClinic}
                                            >
                                                <Target className="w-4 h-4" />
                                                Pin Focus
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {isMinimized && (
                                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <MapPin className="w-4 h-4 text-primary shrink-0" />
                                        <span className="font-bold text-sm truncate">{clinicName}</span>
                                    </div>
                                )}
                            </div>

                            {/* Estimated Times Area */}
                            {!isMinimized && distance && (
                                <div className="p-5 bg-secondary/20 animate-in fade-in slide-in-from-top-2 duration-500">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Estimated Arrival</span>
                                        <span className="text-sm font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">{distance} away</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="flex flex-col items-center p-2 bg-white rounded-xl shadow-sm border border-border/40">
                                            <Footprints className="w-4 h-4 text-muted-foreground mb-1" />
                                            <span className="text-[10px] text-muted-foreground">Walk</span>
                                            <span className="text-xs font-bold">{travelTime.walking}</span>
                                        </div>
                                        <div className="flex flex-col items-center p-2 bg-white rounded-xl shadow-sm border border-border/40">
                                            <Bike className="w-4 h-4 text-muted-foreground mb-1" />
                                            <span className="text-[10px] text-muted-foreground">Bike</span>
                                            <span className="text-xs font-bold">{travelTime.cycling}</span>
                                        </div>
                                        <div className="flex flex-col items-center p-2 bg-white rounded-xl shadow-sm border border-border/40">
                                            <Car className="w-4 h-4 text-muted-foreground mb-1" />
                                            <span className="text-[10px] text-muted-foreground">Drive</span>
                                            <span className="text-xs font-bold">{travelTime.driving}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Map Layers Toggler */}
                    <Card className="shadow-xl border-border/40 backdrop-blur-md bg-white/90 max-w-fit">
                        <CardContent className="p-2 flex gap-1">
                            {(["street", "satellite", "terrain"] as MapType[]).map((type) => (
                                <Button
                                    key={type}
                                    variant={mapType === type ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setMapType(type)}
                                    className="capitalize font-semibold text-[11px] h-8"
                                >
                                    {type}
                                </Button>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div id="navigation-map" className="w-full h-full z-0 bg-muted" />
            </main>

            <style>{`
                .leaflet-routing-container {
                    display: none !important;
                }
                .leaflet-bar {
                    border: none !important;
                    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1) !important;
                }
                .leaflet-bar a {
                    background-color: white !important;
                    color: #475569 !important;
                    border-bottom: 1px solid #f1f5f9 !important;
                    width: 36px !important;
                    height: 36px !important;
                    line-height: 36px !important;
                }
                .leaflet-bar a:hover {
                    color: #3b82f6 !important;
                }
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-bounce-subtle {
                    animation: bounce-subtle 2s infinite ease-in-out;
                }
                .leaflet-popup-content-wrapper {
                    border-radius: 12px !important;
                    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1) !important;
                }
            `}</style>
        </div>
    );
}
