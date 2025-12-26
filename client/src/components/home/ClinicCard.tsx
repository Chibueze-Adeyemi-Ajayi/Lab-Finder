import { Star, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface ClinicProps {
  name: string;
  rating: number;
  reviews: number;
  location: string;
  distance: string;
  tags: string[];
  image: string;
  isOpen: boolean;
}

export function ClinicCard({ clinic }: { clinic: ClinicProps }) {
  return (
    <Card className="group overflow-hidden border-border/60 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={clinic.image} 
          alt={clinic.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          {clinic.isOpen ? (
            <Badge className="bg-emerald-500/90 hover:bg-emerald-500 text-white border-0 backdrop-blur-sm">Open Now</Badge>
          ) : (
            <Badge variant="secondary" className="backdrop-blur-sm">Closed</Badge>
          )}
        </div>
      </div>
      
      <CardHeader className="p-5 pb-2">
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center gap-1 text-amber-400 text-sm font-semibold">
            <Star className="w-4 h-4 fill-current" />
            <span>{clinic.rating}</span>
            <span className="text-muted-foreground font-normal">({clinic.reviews})</span>
          </div>
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">{clinic.distance}</span>
        </div>
        <h3 className="font-heading font-bold text-xl text-foreground group-hover:text-primary transition-colors">
          {clinic.name}
        </h3>
        <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
          <MapPin className="w-3.5 h-3.5" />
          {clinic.location}
        </div>
      </CardHeader>
      
      <CardContent className="p-5 pt-3">
        <div className="flex flex-wrap gap-2">
          {clinic.tags.map((tag) => (
            <span key={tag} className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md border border-border">
              {tag}
            </span>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex gap-3">
        <Button variant="outline" className="flex-1">View Details</Button>
        <Button className="flex-1 group/btn">
          Book
          <ArrowRight className="w-4 h-4 ml-1 transform group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
}
