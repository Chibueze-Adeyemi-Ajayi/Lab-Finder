import { Link, useLocation } from "wouter";
import { Beaker, Search, MapPin, Calendar, Menu, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const isHome = location === "/";

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

  const handleBack = () => {
    window.history.back();
  };

  const NavItems = () => (
    <>
      <Link href="/find-lab">
        <span className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer">Find a Lab</span>
      </Link>
      <Link href="/ai">
        <span className="text-sm font-black font-heading text-muted-foreground hover:text-primary transition-colors cursor-pointer flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          BRAIN
        </span>
      </Link>
      <Link href="/for-clinics">
        <span className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer">For Clinics</span>
      </Link>
      <Link href="/help">
        <span className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer">Help</span>
      </Link>
    </>
  );

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border/40 ${isPWA ? 'h-20 pt-4' : 'h-16'}`}>
      <div className={`container mx-auto px-4 h-full flex items-center ${isPWA && isHome ? 'justify-center' : 'justify-between'} gap-4`}>
        <div className={`flex items-center gap-2 ${isPWA && isHome ? 'flex-1 justify-center' : ''}`}>
          {!isHome && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden -ml-2 mr-1 h-9 w-9 text-muted-foreground hover:text-primary"
              onClick={handleBack}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}

          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer flex-shrink-0">
              <span className={`font-heading font-bold tracking-tight text-foreground whitespace-nowrap ${isPWA && isHome ? 'text-2xl' : 'text-lg'}`}>
                <span className="text-primary">Lab</span>NearMe
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav - Hide if centered logo and in PWA */}
        {!isPWA && (
          <nav className="hidden lg:flex items-center gap-8 text-sm flex-1 justify-center">
            <Link href="/find-lab">
              <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors font-medium">Find a Lab</span>
            </Link>
            <Link href="/ai">
              <span className="text-primary hover:text-primary/80 cursor-pointer transition-colors font-black font-heading flex items-center gap-1.5 uppercase tracking-tighter">
                <Sparkles className="w-4 h-4 fill-current" />
                BRAIN
              </span>
            </Link>
            <Link href="/for-clinics">
              <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors font-medium">For Clinics</span>
            </Link>
            <Link href="/help">
              <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors font-medium">Help</span>
            </Link>
          </nav>
        )}

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
          {/* <Link href="/signin">
            <Button className="text-sm  hover:text-primary px-3">Sign In</Button>
          </Link> */}
          {/* <Link href="/find-lab">
            <Button className="text-sm font-medium px-4 py-2 h-9">Book Now</Button>
          </Link> */}
        </div>

        {/* Tablet & Mobile Menu - Hidden entirely as we now use Bottom Nav on mobile */}
        <div className="hidden flex items-center">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 sm:w-96 px-6">
              <div className="flex flex-col gap-8 mt-12">
                <div className="flex flex-col gap-4 space-y-2">
                  <Link href="/find-lab" onClick={() => setIsOpen(false)}>
                    <span className="text-base font-semibold text-foreground hover:text-primary transition-colors cursor-pointer block py-3">Find a Lab</span>
                  </Link>
                  <Link href="/ai" onClick={() => setIsOpen(false)}>
                    <span className="text-base font-black font-heading text-primary hover:text-primary/80 transition-colors cursor-pointer flex items-center gap-2 py-3 uppercase tracking-tighter">
                      <Sparkles className="w-5 h-5 fill-current" />
                      BRAIN AI
                    </span>
                  </Link>
                  <Link href="/for-clinics" onClick={() => setIsOpen(false)}>
                    <span className="text-base font-semibold text-foreground hover:text-primary transition-colors cursor-pointer block py-3">For Clinics</span>
                  </Link>
                  <Link href="/help" onClick={() => setIsOpen(false)}>
                    <span className="text-base font-semibold text-foreground hover:text-primary transition-colors cursor-pointer block py-3">Help</span>
                  </Link>
                </div>
                <div className="w-full h-px bg-border"></div>
                <div className="flex flex-col gap-3">
                  {/* <Link href="/signin" className="block" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full h-10 font-semibold">Sign In</Button>
                  </Link> */}
                  {/* <Link href="/find-lab" className="block" onClick={() => setIsOpen(false)}>
                    <Button className="w-full h-10 font-semibold">Book Appointment</Button>
                  </Link> */}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
