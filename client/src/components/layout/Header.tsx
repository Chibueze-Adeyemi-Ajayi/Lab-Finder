import { Link } from "wouter";
import { Beaker, Search, MapPin, Calendar, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const NavItems = () => (
    <>
      <Link href="/find-lab">
        <span className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer">Find a Lab</span>
      </Link>
      <Link href="/for-clinics">
        <span className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer">For Clinics</span>
      </Link>
      <Link href="/help">
        <span className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer">Help Center</span>
      </Link>
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border/40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <span className="font-heading font-bold text-lg tracking-tight text-foreground">
              <span className="text-primary">Lab</span>NearMe
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Find a Lab</span>
          <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">For Clinics</span>
          <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Help</span>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" className="text-sm text-muted-foreground hover:text-primary">Sign In</Button>
          <Button className="text-sm font-medium">Book Now</Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 mt-10">
                <NavItems />
                <hr className="border-border" />
                <Button variant="outline" className="w-full">Sign In</Button>
                <Button className="w-full">Book Appointment</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
