import { Search, MapPin, Zap, Navigation, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { cacheLocation } from "@/lib/locationCache";
import heroBg from "@assets/generated_images/clean_abstract_medical_background.png";
import heroImage from "@assets/generated_images/modern_medical_lab_and_healthcare_services_illustration.png";

export function Hero() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Search Inputs
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  // State for location prompt
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined" && "geolocation" in navigator) {
      // Check permission status
      const permissions = (navigator as any).permissions;
      if (permissions && typeof permissions.query === "function") {
        permissions.query({ name: "geolocation" })
          .then((result: any) => {
            if (result.state === "prompt") {
              setTimeout(() => setShowLocationPrompt(true), 1500); // Slight delay for better UX
            }
          })
          .catch(() => {
            // Ignore errors if permissions API fails
          });
      }
    }
  }, []);

  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    const checkPWA = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
      setIsPWA(!!isStandalone);
    };
    checkPWA();
    window.matchMedia('(display-mode: standalone)').addEventListener('change', checkPWA);
    return () => window.matchMedia('(display-mode: standalone)').removeEventListener('change', checkPWA);
  }, []);

  const enableLocation = () => {
    setIsLoadingLocation(true);
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLoadingLocation(false);
        setShowLocationPrompt(false);
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCoords(coords);

        // Cache the location
        cacheLocation(coords.lat, coords.lng);

        // Reload home page results with new location data
        queryClient.invalidateQueries({ queryKey: ["home-featured-clinics"] });

        toast({
          title: "Location Enabled",
          description: "Great! Your search results will now be personalized based on your location."
        });
      },
      (err) => {
        setIsLoadingLocation(false);
        console.error(err);
        // Don't show error toast if they simply denied it, just close prompt
        if (err.code === err.PERMISSION_DENIED) {
          setShowLocationPrompt(false);
        }
      }
    );
  };

  const handleProximityClick = () => {
    setIsLoadingLocation(true);
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive"
      });
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setCoords({ lat, lng });

        // Cache the location
        cacheLocation(lat, lng);

        setIsLoadingLocation(false);

        toast({
          title: "Location detected",
          description: "Redirecting to nearby labs within 5km..."
        });

        // Immediately navigate to FindLab with 5km default
        const params = new URLSearchParams();
        if (searchQuery) params.append("q", searchQuery);
        if (locationQuery) params.append("location", locationQuery);
        params.append("radius", "5");
        params.append("lat", lat.toString());
        params.append("lng", lng.toString());

        setLocation(`/find-lab?${params.toString()}`);
      },
      (error) => {
        console.error(error);
        toast({
          title: "Location Request Denied",
          description: "Please enable location permissions to use proximity search.",
          variant: "destructive"
        });
        setIsLoadingLocation(false);
      }
    );
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append("q", searchQuery);
    if (locationQuery) params.append("location", locationQuery);

    // Standard search without proximity unless already set (which logic below handles via URL)
    setLocation(`/find-lab?${params.toString()}`);
  };

  return (
    <div className={`relative w-full overflow-hidden bg-gradient-to-br from-background via-secondary/20 to-background ${isPWA ? 'pt-24 pb-12' : 'pt-32 pb-24 md:pt-40 md:pb-32'}`}>
      {/* Background Decor */}
      {!isPWA && (
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
          <img src={heroBg} alt="" className="w-full h-full object-cover" style={{ maskImage: 'linear-gradient(to left, black, transparent)' }} />
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className="items-center">
          <div className="max-w-4xl">
            {!isPWA && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-12"
              >
                <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-foreground tracking-tight leading-[1.1] mb-6">
                  The smartest way to find<br></br> <span className="text-primary">a lab or clinic</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                  Discover verified labs and clinics, compare services, and book appointments in seconds. Get your reports online anytime.
                </p>
              </motion.div>
            )}

            {/* Search Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: isPWA ? 0 : 0.1 }}
              className="space-y-5"
            >
              {/* Main Search Box */}
              <div className="bg-white rounded-2xl shadow-lg shadow-primary/10 border border-primary/10 p-4 flex flex-col md:flex-row gap-3">
                <div className="relative flex-1 group">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors pointer-events-none" />
                  <Input
                    placeholder="Enter city or ZIP code"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    className="pl-10 h-12 border-0 bg-transparent focus-visible:ring-0 text-base placeholder-muted-foreground/60"
                  />
                </div>
                <div className="w-px bg-border hidden md:block"></div>
                <div className="relative flex-1 group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors pointer-events-none" />
                  <Input
                    placeholder="Lab name, test, or specialty"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 border-0 bg-transparent focus-visible:ring-0 text-base placeholder-muted-foreground/60"
                  />
                </div>
                <Button
                  className="h-12 px-6 md:px-8 font-semibold whitespace-nowrap"
                  onClick={handleSearch}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>

              {/* Location Prompt Banner */}
              {showLocationPrompt && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex flex-col items-start gap-3 overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full hidden sm:block">
                        <Navigation className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">See results near you</p>
                        <p className="text-xs text-muted-foreground">Enable location access to automatically find the closest labs.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowLocationPrompt(false)}
                      className="p-1.5 hover:bg-black/5 rounded-full text-muted-foreground transition-colors sm:hidden self-end absolute top-2 right-2"
                      title="Dismiss"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowLocationPrompt(false)}
                      className="p-1.5 hover:bg-black/5 rounded-full text-muted-foreground transition-colors hidden sm:block"
                      title="Dismiss"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-3 pt-2 border-t border-primary/10">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="location-terms"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="location-terms" className="text-xs text-muted-foreground cursor-pointer select-none">
                        I accept the <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
                      </label>
                    </div>
                    <Button
                      size="sm"
                      onClick={enableLocation}
                      disabled={isLoadingLocation || !termsAccepted}
                      variant="default"
                      className="h-8 text-xs font-semibold shadow-none w-full sm:w-auto mt-2 sm:mt-0"
                    >
                      {isLoadingLocation ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                      Enable Location
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Just the Proximity Button (No visible selector on home anymore per request) */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleProximityClick}
                  disabled={isLoadingLocation}
                  className="font-bold text-primary border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all justify-start"
                >
                  {isLoadingLocation ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Navigation className="w-4 h-4 mr-2" />}
                  {isLoadingLocation ? "Detecting Location..." : "Search by Proximity (Auto 5km)"}
                </Button>
              </div>

              {/* Quick Links */}
              <div className="flex gap-3 flex-wrap text-sm">
                <span className="text-muted-foreground font-medium mt-1">Quick:</span>
                {["Blood Test", "Body Checkup", "X-Ray", "MRI Scan"].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term);
                      const params = new URLSearchParams();
                      params.append("q", term);
                      if (locationQuery) params.append("location", locationQuery);
                      setLocation(`/find-lab?${params.toString()}`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors text-sm cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div >
  );
}
