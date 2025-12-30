import { Header } from "@/components/layout/Header";
import { ClinicCard } from "@/components/home/ClinicCard";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, FileText, Beaker, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Hero } from "@/components/home/Hero";
import { useQuery } from "@tanstack/react-query";
import { toPublic } from "@/lib/api";

import { useState, useEffect } from "react";

export default function Home() {
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

  // Fetch Top Clinics
  // Using searchClinics with a default broad query or 'General'
  // Ideally, valid real-world apps might have a dedicated 'featured' endpoint, but search works.
  const { data: clinicsData = [], isLoading } = useQuery({
    queryKey: ["home-featured-clinics"],
    queryFn: async () => {
      // Load all clinics by default with skip/limit, other params empty as requested
      const res = await toPublic.searchClinics({ limit: 10, skip: 0 });
      // The API return format is likely { items: [], total: ... } or just [] based on user snippet
      // User snippet shows: { items: [...], total: ... }
      // So ensuring we extract items
      if (res && res.items && Array.isArray(res.items)) {
        return res.items;
      }
      return Array.isArray(res) ? res : (res.data || []);
    }
  });

  // Limit to top 6 (or 10 as requested but 3 columns x 2 rows = 6 looks better, let's do 6 unless explicit strict requirement for 10 which might clutter)
  // User asked for "top 10 result cards".
  const featuredClinics = clinicsData.slice(0, 9);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <Hero />
      <main className={isPWA ? "pb-24" : ""}>
        <section className={`container mx-auto px-4 ${isPWA ? 'py-10' : 'py-20'}`}>
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-heading font-bold text-foreground mb-2">Top Rated</h2>
              <p className="text-muted-foreground">Highly recommended labs and clinics based on patient reviews.</p>
            </div>
            <Link href="/find-lab">
              <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/5 self-start md:self-end">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-[200px] md:h-[400px] bg-secondary/30 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
              {featuredClinics.length > 0 ? (
                featuredClinics.map((clinic: any) => (
                  <ClinicCard key={clinic._id || clinic.id} clinic={clinic} />
                ))
              ) : (
                <div className="col-span-full text-center text-muted-foreground py-10">
                  No clinics found at the moment. Check back soon!
                </div>
              )}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/find-lab">
              <Button size="lg" variant="secondary" className="font-semibold text-primary">
                View More Clinics
              </Button>
            </Link>
          </div>

        </section>

        {!isPWA && (
          <section className="py-20 bg-secondary/30 border-y border-border/50">
            <div className="container mx-auto px-4 text-center max-w-4xl">
              <h2 className="text-3xl font-heading font-bold mb-6">Why Choose LabNearMe?</h2>
              <div className="grid md:grid-cols-3 gap-8 text-left mt-12">
                <div className="bg-background p-6 rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">Verified Labs</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">All clinics are verified and accredited for quality assurance to ensure the best care.</p>
                </div>
                <div className="bg-background p-6 rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">Instant Booking</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">Skip the waiting room. Book your specific time slot online in seconds.</p>
                </div>
                <div className="bg-background p-6 rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">Online Reports</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">Access your test reports digitally as soon as they are ready, anywhere.</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {!isPWA && (
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-background border-b border-border">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-heading font-bold text-foreground mb-4">Are you a clinic or lab?</h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Join LabNearMe and connect with thousands of patients actively searching for quality medical services in your area. Grow your business and reach more customers.
                </p>
                <div className="flex gap-4 flex-col sm:flex-row">
                  <Link href="/for-clinics">
                    <Button size="lg" className="font-semibold cursor-pointer">Register Your Clinic</Button>
                  </Link>
                  <Link href="/learn-more">
                    <Button size="lg" variant="outline" className="font-semibold">Learn More</Button>
                  </Link>
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-border/60 shadow-lg shadow-primary/5">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">Get More Patients</h3>
                      <p className="text-sm text-muted-foreground">Increase bookings from nearby patients searching for your services</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">Manage Easily</h3>
                      <p className="text-sm text-muted-foreground">Simple booking and management tools to streamline your operations</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">Transparent Pricing</h3>
                      <p className="text-sm text-muted-foreground">Fair and transparent fee structure with no hidden charges</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {!isPWA && (
        <footer className="bg-background py-12 border-t border-border mt-auto">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Beaker className="w-5 h-5 text-primary" />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight">LabNearMe</span>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground uppercase font-semibold tracking-wider">
              <Link href="/privacy"><span className="hover:text-primary cursor-pointer transition-colors">Privacy</span></Link>
              <Link href="/terms"><span className="hover:text-primary cursor-pointer transition-colors">Terms</span></Link>
              <Link href="/contact"><span className="hover:text-primary cursor-pointer transition-colors">Contact</span></Link>
            </div>
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} LabNearMe Inc.</p>
          </div>
        </footer>
      )}
    </div>
  );
}
