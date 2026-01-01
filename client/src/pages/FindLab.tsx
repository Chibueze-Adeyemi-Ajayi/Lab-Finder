import { Header } from "@/components/layout/Header";
import { ClinicCard } from "@/components/home/ClinicCard";
import { MapView } from "@/components/home/MapView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Map, List, Building2, Star, Navigation, Loader2, X, ChevronDown, ChevronUp, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toPublic, toPatients, getToken } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const DISTANCE_OPTIONS = [5, 10, 15, 20, 50, 100];
const ITEMS_PER_PAGE = 12;

export default function FindLab() {
  const [locationPath, setLocationPath] = useLocation();
  const { toast } = useToast();

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // Initialize state from URL params
  const getParams = () => new URLSearchParams(window.location.search);
  const [location, setLocation] = useState(getParams().get("location") || "");
  const [search, setSearch] = useState(getParams().get("q") || "");
  const [selectedDistance, setSelectedDistance] = useState(parseInt(getParams().get("radius") || "5"));

  // Debounced search terms for real-time backend fetching
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [debouncedLocation, setDebouncedLocation] = useState(location);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setDebouncedLocation(location);

      // Sync URL in real-time as user types
      const params = new URLSearchParams(window.location.search);
      if (search) params.set("q", search); else params.delete("q");
      if (location) params.set("location", location); else params.delete("location");
      const currentUrl = `/find-lab?${params.toString()}`;
      if (window.location.search !== `?${params.toString()}`) {
        window.history.replaceState(null, "", currentUrl);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [search, location]);

  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [bookingClinicId, setBookingClinicId] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Booking Form State
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  // Location Coordinates
  const latParam = getParams().get("lat");
  const lngParam = getParams().get("lng");

  const [userLat, setUserLat] = useState<string | null>(latParam);
  const [userLng, setUserLng] = useState<string | null>(lngParam);
  const [addressDisplay, setAddressDisplay] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Reverse Geocoding Effect
  useEffect(() => {
    if (userLat && userLng) {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLat}&lon=${userLng}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.display_name) {
            // Extract city/suburb for a cleaner look
            const addr = data.address;
            const cleanAddr = addr.city || addr.town || addr.suburb || addr.neighbourhood || addr.state || "Current Area";
            setAddressDisplay(cleanAddr);
          } else {
            setAddressDisplay("Current Location");
          }
        })
        .catch(() => setAddressDisplay("Current Location"));
    } else {
      setAddressDisplay(null);
    }
  }, [userLat, userLng]);

  // Handle Proximity Search Click
  const handleProximityClick = () => {
    setIsLoadingLocation(true);
    if (!navigator.geolocation) {
      toast({ title: "Error", description: "Geolocation not supported", variant: "destructive" });
      setIsLoadingLocation(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLat = pos.coords.latitude.toString();
        const newLng = pos.coords.longitude.toString();
        setUserLat(newLat);
        setUserLng(newLng);
        setIsLoadingLocation(false);

        // Sync URL
        const params = new URLSearchParams(window.location.search);
        params.set("lat", newLat);
        params.set("lng", newLng);
        params.set("radius", "5");
        setLocationPath(`/find-lab?${params.toString()}`);
        setSelectedDistance(5); // Reset to 5km default for proximity
      },
      (err) => {
        console.error(err);
        toast({ title: "Error", description: "Location access denied", variant: "destructive" });
        setIsLoadingLocation(false);
      }
    );
  };

  const handleClearProximity = () => {
    setUserLat(null);
    setUserLng(null);
    setAddressDisplay(null);
    setViewMode("list");

    // Re-perform search with current input q and location, neglecting coordinates
    const params = new URLSearchParams();
    if (search) params.append("q", search);
    if (location) params.append("location", location);
    params.append("radius", selectedDistance.toString());

    setLocationPath(`/find-lab?${params.toString()}`);
  }

  const handleSearch = () => {
    // Immediate update of debounced values to trigger query instantly
    setDebouncedSearch(search);
    setDebouncedLocation(location);
    setCurrentPage(1); // Reset to first page on new search

    const params = new URLSearchParams();
    if (search) params.append("q", search);
    if (location) params.append("location", location);
    params.append("radius", selectedDistance.toString());
    if (userLat) params.append("lat", userLat);
    if (userLng) params.append("lng", userLng);

    const currentUrl = `/find-lab?${params.toString()}`;
    setLocationPath(currentUrl);
  };

  const { data: clinicsData, isLoading, isFetching } = useQuery({
    queryKey: ["clinics-search", debouncedSearch, debouncedLocation, selectedDistance, userLat, userLng, currentPage],
    queryFn: async () => {
      const skip = (currentPage - 1) * ITEMS_PER_PAGE;
      const res = await toPublic.searchClinics({
        q: debouncedSearch,
        location: debouncedLocation,
        radius: selectedDistance,
        lat: userLat ? parseFloat(userLat) : undefined,
        lng: userLng ? parseFloat(userLng) : undefined,
        skip,
        limit: ITEMS_PER_PAGE
      });
      return res;
    },
    // Ensure proximity changes feel immediate
    staleTime: 0,
  });

  const clinics = Array.isArray(clinicsData) ? clinicsData : (clinicsData?.items || clinicsData?.data || []);
  const totalCount = clinicsData?.total || clinics.length;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const createRequestMutation = useMutation({
    mutationFn: (data: FormData) => toPatients.createRequest(data),
    onSuccess: () => {
      toast({ title: "Request Sent", description: "Your lab request has been sent to the clinic." });
      setBookingClinicId(null);
      setServiceName("");
      setDescription("");
      setContactPhone("");
    },
    onError: (err: any) => {
      toast({ title: "Booking Failed", description: err.message || "Could not create request. Are you logged in?", variant: "destructive" });
    }
  });

  const handleBook = () => {
    if (!bookingClinicId) return;
    if (!getToken("patient")) {
      toast({ title: "Login Required", description: "Please login as a patient to book.", variant: "destructive" });
      return;
    }
    const formData = new FormData();
    formData.append("clinic_id", bookingClinicId);
    formData.append("service_name", serviceName);
    formData.append("description", description);
    formData.append("contact_phone", contactPhone);
    formData.append("hospital_location", location || "Online Search");
    createRequestMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <main className="pt-24 pb-20">
        {/* Search Header */}
        <div className="sticky top-16 bg-white/80 backdrop-blur-md border-b border-border/40 z-40">
          <div className="container mx-auto px-4 py-4 md:py-6">
            {/* Mobile Toggle */}
            <div className="flex md:hidden items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-primary">
                <Filter className="w-4 h-4" />
                <span className="font-bold text-sm uppercase tracking-wider">Search & Filters</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                className="h-9 px-3 gap-2 border-primary/20 text-primary"
              >
                {isSearchExpanded ? "Hide" : "Show"}
                {isSearchExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>

            <div className={`${isSearchExpanded ? 'flex' : 'hidden md:flex'} flex-col md:flex-row gap-3 mb-5 transition-all duration-300`}>
              <div className="relative flex-1 group">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors pointer-events-none" />
                <Input
                  placeholder="Enter city or ZIP code"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10 h-11 border-border/60 bg-secondary/30 focus-visible:ring-0 focus-visible:bg-white text-base"
                />
                {isFetching && !isLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-4 h-4 text-primary/40 animate-spin" />
                  </div>
                )}
              </div>
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors pointer-events-none" />
                <Input
                  placeholder="Test, clinic name, specialty"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-11 border-border/60 bg-secondary/30 focus-visible:ring-0 focus-visible:bg-white text-base"
                />
                {isFetching && !isLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-4 h-4 text-primary/40 animate-spin" />
                  </div>
                )}
              </div>
              <Button className="h-11 px-8 font-semibold whitespace-nowrap" onClick={handleSearch} disabled={isFetching}>
                {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
              </Button>
            </div>

            {/* Distance & Proximity Controls - also hidden when collapsed on mobile */}
            <div className={`${isSearchExpanded ? 'flex' : 'hidden md:flex'} flex-col md:flex-row justify-between md:items-center gap-4`}>
              {userLat && userLng ? (
                <div className="flex items-center gap-3 flex-wrap animate-in fade-in slide-in-from-left-2 duration-300">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Within</span>
                    <button
                      onClick={handleClearProximity}
                      className="p-1 hover:bg-secondary rounded-full text-muted-foreground hover:text-foreground transition-colors"
                      title="Clear proximity search"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {DISTANCE_OPTIONS.map((km) => (
                      <button
                        key={km}
                        onClick={() => {
                          setSelectedDistance(km);
                          // Update URL immediately for radius change
                          const params = new URLSearchParams(window.location.search);
                          params.set("radius", km.toString());
                          setLocationPath(`/find-lab?${params.toString()}`);
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedDistance === km
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                          : "bg-secondary text-muted-foreground hover:bg-secondary/80 border border-border/60"
                          }`}
                      >
                        {km} km
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleProximityClick}
                  disabled={isLoadingLocation}
                  className="font-bold text-primary border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all self-start md:self-auto"
                >
                  {isLoadingLocation ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Navigation className="w-4 h-4 mr-2" />}
                  {isLoadingLocation ? "Detecting Location..." : "Search by Proximity"}
                </Button>
              )}

              {userLat && userLng && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleProximityClick}
                  disabled={isLoadingLocation}
                  className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
                >
                  {isLoadingLocation ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Navigation className="w-3 h-3 mr-2" />}
                  Update Location
                </Button>
              )}
            </div>

            {/* Address Indication */}
            {userLat && userLng && (
              <div className="mt-4 flex items-center justify-between bg-emerald-50 border border-emerald-100 p-3 rounded-xl animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center text-sm text-emerald-700">
                  <MapPin className="w-4 h-4 mr-2" />
                  Showing labs around: <span className="font-bold ml-1">{addressDisplay || "Loading address..."}</span>
                </div>
                <button onClick={handleClearProximity} className="text-emerald-600 hover:text-emerald-800">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* View Toggle & Count */}
        <div className="sticky top-[148px] bg-white border-b border-border/40 z-39 shadow-sm">
          {/* Real-time Fetching Progress Bar */}
          {isFetching && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/10 overflow-hidden">
              <div className="h-full bg-primary animate-progress-fast shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
            </div>
          )}

          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-sm font-semibold text-foreground">
                {isLoading ? "Searching initial labs..." : (userLat && userLng ? `Found ${clinics.length} labs within ${selectedDistance}km` : `Found ${clinics.length} labs`)}
              </div>
              {isFetching && !isLoading && (
                <div className="flex items-center gap-2 px-2 py-0.5 bg-primary/5 text-primary rounded-full text-[10px] font-bold animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  UPDATING
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "secondary"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="gap-2"
              >
                <List className="w-4 h-4" />
                List
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "secondary"}
                size="sm"
                onClick={() => setViewMode("map")}
                className="gap-2"
              >
                <Map className="w-4 h-4" />
                Map
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="container mx-auto px-4 py-12">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 md:h-96 bg-secondary/30 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : viewMode === "list" ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
              {clinics.map((clinic: any) => (
                <ClinicCard key={clinic.id || clinic._id || Math.random()} clinic={clinic} />
              ))}
              {clinics.length === 0 && (
                <div className="col-span-full text-center py-20">
                  <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <h3 className="text-xl font-bold text-foreground mb-2">No labs found</h3>
                  <p className="text-muted-foreground">Try increasing the search radius or exploring another area.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-[600px] bg-muted rounded-2xl flex items-center justify-center border-2 border-dashed border-border overflow-hidden">
              <MapView clinics={clinics} selectedDistance={selectedDistance} userLocation={userLat && userLng ? { lat: parseFloat(userLat), lng: parseFloat(userLng) } : undefined} />
            </div>
          )}

          {/* Pagination Controls */}
          {!isLoading && clinics.length > 0 && totalPages > 1 && (
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pb-8">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount} labs
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentPage(prev => Math.max(1, prev - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1 || isFetching}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setCurrentPage(pageNum);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={isFetching}
                        className="w-10 h-10 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentPage(prev => Math.min(totalPages, prev + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages || isFetching}
                  className="gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Booking Dialog */}
        <Dialog open={!!bookingClinicId} onOpenChange={(open) => !open && setBookingClinicId(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Book Lab Appointment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Service Required</Label>
                <Input placeholder="e.g. Blood Test, MRI" value={serviceName} onChange={e => setServiceName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Contact Number</Label>
                <Input placeholder="Your phone number" value={contactPhone} onChange={e => setContactPhone(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Additional Notes (Optional)</Label>
                <Textarea placeholder="Any specific requirements or symptoms..." value={description} onChange={e => setDescription(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setBookingClinicId(null)}>Cancel</Button>
              <Button onClick={handleBook} disabled={createRequestMutation.isPending}>
                {createRequestMutation.isPending ? "Submitting..." : "Confirm Booking"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
