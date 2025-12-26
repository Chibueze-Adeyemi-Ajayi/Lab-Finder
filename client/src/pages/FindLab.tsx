import { Header } from "@/components/layout/Header";
import { ClinicCard } from "@/components/home/ClinicCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
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
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
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
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
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
    image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=800"
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
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800"
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
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=800"
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
    image: "https://images.unsplash.com/photo-1631217314830-c6e7c3a3f239?auto=format&fit=crop&q=80&w=800"
  }
];

export default function FindLab() {
  const [location, setLocation] = useState("");
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        {/* Search Bar */}
        <div className="sticky top-16 bg-white border-b border-border/40 z-40">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row gap-3">
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
          </div>
        </div>

        {/* Results */}
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              {location ? `Labs & Clinics near ${location}` : "All Labs & Clinics"}
            </h1>
            <p className="text-muted-foreground">Showing {ALL_CLINICS.length} results</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ALL_CLINICS.map((clinic) => (
              <ClinicCard key={clinic.id} clinic={clinic} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
