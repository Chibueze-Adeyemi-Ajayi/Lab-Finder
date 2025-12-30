import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { toPublic } from "@/lib/api";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Star, Clock, Info, Share2, Navigation2, ArrowLeft, Loader2, Globe, Target } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function ClinicDetails() {
    const [match, params] = useRoute("/clinic/:id");
    const id = params?.id;

    const { data: clinic, isLoading, error } = useQuery({
        queryKey: ["clinic-details", id],
        queryFn: () => id ? toPublic.getClinic(id) : null,
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background pb-20">
                <Header />
                <div className="flex items-center justify-center h-[60vh]">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            </div>
        );
    }

    if (error || !clinic) {
        return (
            <div className="min-h-screen bg-background pb-20">
                <Header />
                <div className="container px-4 py-20 text-center">
                    <h2 className="text-2xl font-bold mb-4">Clinic not found</h2>
                    <Link href="/find-lab">
                        <Button>Back to Search</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: clinic.name,
                text: `Check out ${clinic.name} on LabNearMe`,
                url: window.location.href,
            }).catch(console.error);
        }
    };

    const services = clinic.services || [];
    const address = typeof clinic.address === 'string'
        ? clinic.address
        : `${clinic.address?.street_address || ''}, ${clinic.address?.city || ''}, ${clinic.address?.state || ''}`;

    let lat, lng;
    if (clinic.location?.coordinates) {
        [lng, lat] = clinic.location.coordinates;
    }

    return (
        <div className="min-h-screen bg-background font-sans pb-24 md:pb-12">
            <Header />

            <main className="pt-20">
                {/* Banner/Header */}
                <div className="bg-secondary/20 border-b border-border/50">
                    <div className="container mx-auto px-4 py-6 md:py-10">
                        <Link href="/find-lab">
                            <Button variant="ghost" size="sm" className="mb-4 pl-0 hover:bg-transparent hover:underline text-muted-foreground">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Search
                            </Button>
                        </Link>

                        <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">{clinic.name}</h1>
                                    {clinic.is_online && <Badge className="bg-emerald-500 hover:bg-emerald-600">Active</Badge>}
                                </div>
                                <div className="flex flex-col gap-2 text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <span>{address}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Star className="w-4 h-4 text-amber-500 fill-current" />
                                        <span className="font-semibold text-foreground">{clinic.rating || "New"}</span>
                                        <span>({clinic.reviews || 0} reviews)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-2 md:mt-0">
                                <Button variant="outline" size="icon" onClick={handleShare}>
                                    <Share2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <div className="md:col-span-2 space-y-8">

                        {/* Gallery (Placeholder or Real) */}
                        <div className="aspect-video bg-secondary rounded-xl overflow-hidden relative group">
                            <img
                                src={clinic.image || clinic.images?.[0] || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"}
                                alt={clinic.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* About */}
                        <section>
                            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                                <Info className="w-5 h-5 text-primary" />
                                About
                            </h2>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {clinic.description || "No description available for this clinic."}
                            </p>
                        </section>

                        <Separator />

                        {/* Services */}
                        <section>
                            <h2 className="text-xl font-bold mb-4">Services Available</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {services.length > 0 ? services.map((service: string, idx: number) => (
                                    <div key={idx} className="flex items-center gap-2 p-3 rounded-lg border border-border bg-card">
                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                        <span className="text-sm font-medium">{service}</span>
                                    </div>
                                )) : (
                                    <p className="text-muted-foreground italic">Service list not specified.</p>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Actions */}
                    <div className="md:col-span-1">
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm sticky top-24 space-y-6">
                            <h3 className="font-bold text-lg">Contact & Location</h3>

                            <div className="space-y-4">
                                {clinic.phone && (
                                    <Button className="w-full h-12 text-base" onClick={() => window.location.href = `tel:${clinic.phone}`}>
                                        <Phone className="w-4 h-4 mr-2" />
                                        Call Clinic
                                    </Button>
                                )}

                                {lat && lng ? (
                                    <Link href={`/map-navigation?lat=${lat}&lng=${lng}&name=${encodeURIComponent(clinic.name)}`}>
                                        <Button variant="outline" className="w-full h-12 text-base border-primary/20 hover:bg-primary/5 text-primary">
                                            <Target className="w-4 h-4 mr-2" />
                                            Direction
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button variant="outline" disabled className="w-full h-12">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        Location Unavailable
                                    </Button>
                                )}

                                {clinic.website && (
                                    <Button variant="secondary" className="w-full h-12" onClick={() => window.open(clinic.website, '_blank')}>
                                        <Globe className="w-4 h-4 mr-2" />
                                        Visit Website
                                    </Button>
                                )}
                            </div>

                            <div className="pt-4 border-t border-border">
                                <div className="flex items-start gap-3">
                                    <Clock className="w-4 h-4 text-muted-foreground mt-1" />
                                    <div className="text-sm text-muted-foreground">
                                        <span className="font-medium text-foreground block mb-1">Opening Hours</span>
                                        {clinic.hours || "Contact clinic for hours"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
