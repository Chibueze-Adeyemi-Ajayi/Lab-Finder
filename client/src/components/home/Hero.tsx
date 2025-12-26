import { Search, MapPin, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState } from "react";
import heroBg from "@assets/generated_images/clean_abstract_medical_background.png";
import heroImage from "@assets/generated_images/modern_medical_lab_and_healthcare_services_illustration.png";

export function Hero() {
  const [distance, setDistance] = useState(5);
  const DISTANCE_OPTIONS = [5, 10, 15, 20];

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-background via-secondary/20 to-background pt-32 pb-24 md:pt-40 md:pb-32">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
        <img src={heroBg} alt="" className="w-full h-full object-cover" style={{ maskImage: 'linear-gradient(to left, black, transparent)' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-foreground tracking-tight leading-[1.1] mb-6">
              The smartest way to find <span className="text-primary">a lab or clinic</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Discover verified labs and clinics, compare services, and book appointments in seconds. Get your reports online anytime.
            </p>
          </motion.div>

          {/* Search Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-5"
          >
            {/* Main Search Box */}
            <div className="bg-white rounded-2xl shadow-lg shadow-primary/10 border border-primary/10 p-4 flex flex-col md:flex-row gap-3">
              <div className="relative flex-1 group">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors pointer-events-none" />
                <Input 
                  placeholder="Enter city or ZIP code" 
                  className="pl-10 h-12 border-0 bg-transparent focus-visible:ring-0 text-base placeholder-muted-foreground/60"
                />
              </div>
              <div className="w-px bg-border hidden md:block"></div>
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors pointer-events-none" />
                <Input 
                  placeholder="Lab name, test, or specialty" 
                  className="pl-10 h-12 border-0 bg-transparent focus-visible:ring-0 text-base placeholder-muted-foreground/60"
                />
              </div>
              <Button className="h-12 px-6 md:px-8 font-semibold whitespace-nowrap">
                <Zap className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>

            {/* Distance Selector */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Within</span>
              <div className="flex gap-2 flex-wrap">
                {DISTANCE_OPTIONS.map((km) => (
                  <button
                    key={km}
                    onClick={() => setDistance(km)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      distance === km
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80 border border-border/60"
                    }`}
                  >
                    {km} km
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex gap-3 flex-wrap text-sm">
              <span className="text-muted-foreground font-medium">Quick:</span>
              <button className="px-3 py-1.5 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors text-sm">
                Blood Test
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors text-sm">
                Full Checkup
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors text-sm">
                MRI Scan
              </button>
            </div>
          </motion.div>
          </div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:flex justify-center"
          >
            <img 
              src={heroImage} 
              alt="Medical lab and healthcare services" 
              className="w-full max-w-md drop-shadow-lg"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
