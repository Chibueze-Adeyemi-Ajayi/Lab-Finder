import { MapPin } from "lucide-react";

interface MapClinic {
  id: number;
  name: string;
  distance: string;
  rating: number;
  location: string;
  position: { top: string; left: string };
}

interface MapViewProps {
  clinics: MapClinic[];
  selectedDistance: number;
}

export function MapView({ clinics, selectedDistance }: MapViewProps) {
  const filteredClinics = clinics.filter(clinic => {
    const distNum = parseFloat(clinic.distance);
    return distNum <= selectedDistance;
  });

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50 rounded-xl overflow-hidden border border-border/40">

      {/* Street Grid Pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `linear-gradient(0deg, #cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }}></div>

      {/* Clinic Markers */}
      <div className="absolute inset-0">
        {filteredClinics.map((clinic) => (
          <div
            key={clinic.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
            style={{ top: clinic.position.top, left: clinic.position.left }}
          >
            {/* Pulse Circle */}
            <div className="absolute -inset-2 bg-primary/20 rounded-full animate-pulse group-hover:bg-primary/30 transition-colors"></div>

            {/* Marker Pin */}
            <div className="relative w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all group-hover:scale-110 cursor-pointer border border-primary/20">
              <MapPin className="w-5 h-5" />
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-foreground text-background px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
              <div>{clinic.name}</div>
              <div className="text-primary-foreground/80">{clinic.distance} • ★{clinic.rating}</div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-lg border border-border/40 shadow-md">
        <div className="text-xs font-semibold text-foreground mb-2">Search Radius</div>
        <div className="text-sm text-muted-foreground">
          Within <span className="font-bold text-primary">{selectedDistance} km</span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Found: <span className="font-semibold text-foreground">{filteredClinics.length}</span> clinics
        </div>
      </div>

      {/* Top Right Info */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-lg border border-border/40 shadow-md">
        <div className="flex items-center gap-2 text-xs text-foreground">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <span>Verified Clinic</span>
        </div>
      </div>
    </div>
  );
}
