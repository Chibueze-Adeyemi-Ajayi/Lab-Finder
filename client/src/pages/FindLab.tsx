import { Header } from "@/components/layout/Header";
import { ClinicCard } from "@/components/home/ClinicCard";
import { MapView } from "@/components/home/MapView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Map, List } from "lucide-react";
import { useState } from "react";

const ALL_CLINICS = [
  {
    id: 1,
    name: "Apex Diagnostic Center",
    rating: 4.9,
    reviews: 128,
    location: "Downtown Medical Park",
    distance: "0.8 km",
    tags: ["MRI", "CT Scan", "Pathology"],
    isOpen: true,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
    position: { top: "25%", left: "35%" }
  },
  {
    id: 2,
    name: "City Health Labs",
    rating: 4.7,
    reviews: 84,
    location: "Westside Plaza",
    distance: "2.1 km",
    tags: ["Blood Tests", "X-Ray", "Ultrasound"],
    isOpen: true,
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800",
    position: { top: "45%", left: "55%" }
  },
  {
    id: 3,
    name: "MediCare Imaging",
    rating: 4.5,
    reviews: 215,
    location: "North Hills",
    distance: "3.5 km",
    tags: ["Radiology", "Cardiology", "Full Checkup"],
    isOpen: false,
    image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=800",
    position: { top: "60%", left: "70%" }
  },
  {
    id: 4,
    name: "Prime Care Clinic",
    rating: 4.6,
    reviews: 95,
    location: "East Medical Complex",
    distance: "4.2 km",
    tags: ["General Checkup", "Blood Test", "Consultation"],
    isOpen: true,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
    position: { top: "70%", left: "40%" }
  },
  {
    id: 5,
    name: "Wellness Diagnostic Hub",
    rating: 4.8,
    reviews: 156,
    location: "Central District",
    distance: "5.1 km",
    tags: ["Full Body Scan", "Pathology", "Genetics"],
    isOpen: true,
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=800",
    position: { top: "35%", left: "65%" }
  },
  {
    id: 6,
    name: "Swift Labs",
    rating: 4.4,
    reviews: 67,
    location: "Riverside",
    distance: "6.3 km",
    tags: ["Quick Tests", "Home Sample", "24/7 Available"],
    isOpen: true,
    image: "https://images.unsplash.com/photo-1631217314830-c6e7c3a3f239?auto=format&fit=crop&q=80&w=800",
    position: { top: "55%", left: "25%" }
  }
];

const DISTANCE_OPTIONS = [5, 10, 15, 20];

export default function FindLab() {
  const [location, setLocation] = useState("");
  const [search, setSearch] = useState("");
  const [selectedDistance, setSelectedDistance] = useState(5);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const filteredClinics = ALL_CLINICS.filter(clinic => {
    const distNum = parseFloat(clinic.distance);
    return distNum <= selectedDistance;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        {/* Search Bar */}
        <div className="sticky top-16 bg-white border-b border-border/40 z-40">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row gap-3 mb-5">
              <div className="relative flex-1 group">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors pointer-events-none" />
                <Input 
                  placeholder="Enter city or ZIP code" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10 h-11 border-border/60 bg-secondary/30 focus-visible:ring-0 focus-visible:bg-white text-base"
                />
              </div>
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors pointer-events-none" />
                <Input 
                  placeholder="Test, clinic name, specialty" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-11 border-border/60 bg-secondary/30 focus-visible:ring-0 focus-visible:bg-white text-base"
                />
              </div>
              <Button className="h-11 px-8 font-semibold whitespace-nowrap">Search</Button>
            </div>

            {/* Distance Selector */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-medium text-muted-foreground">Within</span>
              <div className="flex gap-2 flex-wrap">
                {DISTANCE_OPTIONS.map((km) => (
                  <button
                    key={km}
                    onClick={() => setSelectedDistance(km)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedDistance === km
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80 border border-border/60"
                    }`}
                  >
                    {km} km near me
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="sticky top-[120px] bg-white border-b border-border/40 z-39">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="text-sm font-semibold text-foreground">
              Found {filteredClinics.length} clinics within {selectedDistance} km
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                <List className="w-4 h-4" />
                List
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "map"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                <Map className="w-4 h-4" />
                Map
              </button>
            </div>
          </div>
        </div>

        {/* Results - List View */}
        {viewMode === "list" && (
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredClinics.map((clinic) => (
                <ClinicCard key={clinic.id} clinic={clinic} />
              ))}
            </div>
          </div>
        )}

        {/* Results - Map View */}
        {viewMode === "map" && (
          <div className="container mx-auto px-4 py-8">
            <div className="grid lg:grid-cols-3 gap-8 h-[600px]">
              {/* List on Left */}
              <div className="lg:col-span-1 overflow-y-auto space-y-4 pr-2">
                {filteredClinics.map((clinic) => (
                  <div
                    key={clinic.id}
                    className="bg-white p-4 rounded-lg border border-border/40 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{clinic.name}</h3>
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">{clinic.distance}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{clinic.location}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-amber-400 text-xs font-semibold">★ {clinic.rating}</span>
                      <span className="text-xs text-muted-foreground">({clinic.reviews})</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map on Right */}
              <div className="lg:col-span-2">
                <MapView clinics={filteredClinics} selectedDistance={selectedDistance} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
