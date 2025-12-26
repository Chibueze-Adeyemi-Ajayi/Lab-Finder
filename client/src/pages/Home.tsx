import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";
import { ClinicCard } from "@/components/home/ClinicCard";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, FileText, Beaker } from "lucide-react";

// Mock Data
const FEATURED_CLINICS = [
  {
    id: 1,
    name: "Apex Diagnostic Center",
    rating: 4.9,
    reviews: 128,
    location: "Downtown Medical Park",
    distance: "0.8 mi",
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
    distance: "2.1 mi",
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
    distance: "3.5 mi",
    tags: ["Radiology", "Cardiology", "Full Checkup"],
    isOpen: false,
    image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=800"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <main>
        <Hero />
        
        <section className="py-20 container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-heading font-bold text-foreground mb-2">Top Rated Near You</h2>
              <p className="text-muted-foreground">Highly recommended labs and clinics based on patient reviews.</p>
            </div>
            <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/5 self-start md:self-end">
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURED_CLINICS.map((clinic) => (
              <ClinicCard key={clinic.id} clinic={clinic} />
            ))}
          </div>
          
        </section>

        <section className="py-20 bg-secondary/30 border-y border-border/50">
           <div className="container mx-auto px-4 text-center max-w-4xl">
              <h2 className="text-3xl font-heading font-bold mb-6">Why Choose LabFinder?</h2>
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
      </main>
      
      <footer className="bg-background py-12 border-t border-border mt-auto">
         <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="bg-primary/10 p-2 rounded-lg">
                  <Beaker className="w-5 h-5 text-primary" />
               </div>
               <span className="font-heading font-bold text-xl tracking-tight">LabFinder</span>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
            <p className="text-sm text-muted-foreground">© 2024 LabFinder Inc.</p>
         </div>
      </footer>
    </div>
  );
}
