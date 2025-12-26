import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import heroBg from "@assets/generated_images/clean_abstract_medical_background.png";

export function Hero() {
  return (
    <div className="relative w-full overflow-hidden bg-secondary/30 pt-32 pb-20 md:pt-40 md:pb-32">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
         <img src={heroBg} alt="" className="w-full h-full object-cover mask-image-gradient" style={{ maskImage: 'linear-gradient(to left, black, transparent)' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              Trusted by 10,000+ Patients
            </span>
            <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-foreground tracking-tight leading-[1.1] mb-6">
              Find the best labs <br/>
              <span className="text-primary">near you.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
              Book blood tests, scans, and health checkups at top-rated clinics. Compare prices and get reports online.
            </p>
          </motion.div>

          {/* Search Box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white p-2 rounded-2xl shadow-xl shadow-primary/5 border border-border/50 max-w-2xl flex flex-col md:flex-row gap-2"
          >
            <div className="relative flex-1 group">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="City, zip, or neighborhood" 
                className="pl-10 h-12 border-transparent bg-transparent focus-visible:ring-0 focus-visible:bg-secondary/20 text-base"
              />
            </div>
            <div className="w-px bg-border hidden md:block my-2"></div>
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Test, lab name, or specialty" 
                className="pl-10 h-12 border-transparent bg-transparent focus-visible:ring-0 focus-visible:bg-secondary/20 text-base"
              />
            </div>
            <Button size="lg" className="h-12 px-8 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
              Search
            </Button>
          </motion.div>
          
          <div className="mt-8 flex gap-4 text-sm text-muted-foreground">
            <span>Popular:</span>
            <span className="font-medium text-foreground cursor-pointer hover:underline decoration-primary underline-offset-4">Full Body Checkup</span>
            <span className="font-medium text-foreground cursor-pointer hover:underline decoration-primary underline-offset-4">MRI Scan</span>
            <span className="font-medium text-foreground cursor-pointer hover:underline decoration-primary underline-offset-4">Blood Test</span>
          </div>
        </div>
      </div>
    </div>
  );
}
