import { Star, MapPin, Clock, ArrowRight, PinIcon, LocateIcon, Phone as PhoneIcon, Navigation2, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Link } from "wouter";

// Adapted interface to handle both Mock and API data
interface ClinicProps {
  _id?: string;
  id?: string | number;
  name: string;
  rating?: number;
  average_rating?: number;
  reviews?: number;
  total_ratings?: number;
  location?: string | { type: string, coordinates: number[] };
  address?: string | {
    street_address: string;
    city: string;
    state: string;
    zip_code: string;
  };
  distance?: string;
  tags?: string[];
  services?: string[];
  image?: string;
  images?: string[];
  isOpen?: boolean;
  is_online?: boolean; // API field
  phone_number?: string;
  phone?: string;
}

export function ClinicCard({ clinic }: { clinic: ClinicProps }) {
  // Normalize Props
  const rating = clinic.rating ?? clinic.average_rating ?? 0;
  const reviews = clinic.reviews ?? clinic.total_ratings ?? 0;

  // Handle nested address object vs string vs location coords
  let displayAddress = "Location available on map";
  if (typeof clinic.address === 'object' && clinic.address !== null) {
    displayAddress = `${clinic.address.street_address}, ${clinic.address.city}`;
  } else if (typeof clinic.address === 'string') {
    displayAddress = clinic.address;
  }

  const location = typeof clinic.location === 'string'
    ? clinic.location
    : displayAddress;

  const tags = clinic.tags ?? clinic.services?.slice(0, 3) ?? [];
  const image = clinic.image ?? clinic.images?.[0] ?? "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800";
  const isOpen = clinic.isOpen ?? clinic.is_online ?? false;
  const getDistanceLabel = (dist?: string | number) => {
    if (!dist) return "Near You";

    let numericDist: number;
    if (typeof dist === 'string') {
      // Parse number from string like "5.2 km" or "10"
      numericDist = parseFloat(dist.replace(/[^\d.]/g, ''));
    } else {
      numericDist = dist;
    }

    if (isNaN(numericDist)) return dist.toString();

    if (numericDist < 5) return "Near";
    if (numericDist < 10) return "Fairly far";
    if (numericDist < 20) return "Moderate";
    return "Far";
  };

  const distanceLabel = getDistanceLabel(clinic.distance);

  // Coordinates Extraction
  let lat: number | null = null;
  let lng: number | null = null;

  if (typeof clinic.location === 'object' && clinic.location?.coordinates) {
    lng = clinic.location.coordinates[0];
    lat = clinic.location.coordinates[1];
  }

  const phoneNumber = clinic.phone_number || clinic.phone;

  return (
    <Card className="group overflow-hidden border-border/60 hover:border-primary/30 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <Link href={`/clinic/${clinic._id || clinic.id}`} className="flex-1 flex flex-col cursor-pointer block">
        <div className="relative h-32 md:h-48 overflow-hidden bg-secondary">
          <img
            src={image}
            alt={clinic.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              // Fallback if image load fails
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800";
            }}
          />
          <div className="absolute top-3 left-3">
            {isOpen ? (
              <Badge className="bg-emerald-500/90 hover:bg-emerald-500 text-white border-0 backdrop-blur-sm text-[10px] md:text-xs">Open Now</Badge>
            ) : (
              <Badge variant="secondary" className="backdrop-blur-sm text-[10px] md:text-xs">Closed</Badge>
            )}
          </div>
        </div>

        <CardHeader className="p-3 md:p-5 pb-2">
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center gap-1 text-amber-400 text-xs md:text-sm font-semibold">
              <Star className="w-3 h-3 md:w-4 md:h-4 fill-current" />
              <span>{rating}</span>
              <span className="text-muted-foreground font-normal">({reviews})</span>
            </div>
            <span className="text-[10px] md:text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">{distanceLabel}</span>
          </div>
          <h3 className="font-heading font-bold text-sm sm:text-base md:text-xl text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {clinic.name}
          </h3>
          <div className="flex items-center gap-1 text-muted-foreground text-xs md:text-sm mt-1">
            <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" />
            <span className="line-clamp-1 text-[10px] md:text-sm">{location}</span>
          </div>
        </CardHeader>

        <CardContent className="p-3 pt-0 md:p-5 md:pt-3 flex-1">
          <div className="flex flex-wrap gap-1 md:gap-2">
            {tags.map((tag) => (
              <span key={tag} className="text-[10px] md:text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 md:px-2 md:py-1 rounded-md border border-border">
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-3 md:p-5 pt-0 flex gap-2 mt-auto">
        {phoneNumber && (
          <Button
            className={`${lat && lng ? 'w-10 h-9 md:w-12 md:h-10' : 'flex-1 h-9 md:h-10'} shrink-0 group/btn flex items-center justify-center p-0`}
            variant="outline"
            onClick={() => window.location.href = `tel:${phoneNumber}`}
            title="Call Clinic"
          >
            <PhoneIcon className="w-4 h-4" />
            {!(lat && lng) && <span className="ml-2 font-semibold text-sm">Contact</span>}
          </Button>
        )}

        {lat && lng ? (
          <Link href={`/map-navigation?lat=${lat}&lng=${lng}&name=${encodeURIComponent(clinic.name)}`} className="flex-1">
            <Button className="w-full h-10 group/btn flex items-center justify-center gap-2">
              <span className="text-sm font-semibold whitespace-nowrap">Direction</span>
              <Target className="w-4 h-4 transform group-hover/btn:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        ) : !phoneNumber && (
          <Button className="flex-1 h-10 group/btn flex items-center justify-center gap-2" disabled>
            <span className="text-sm">No Location Info</span>
            <MapPin className="w-4 h-4 opacity-50" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
