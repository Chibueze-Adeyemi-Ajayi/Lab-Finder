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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Beaker className="w-6 h-6 text-primary" />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-foreground">
              Lab<span className="text-primary">Finder</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <NavItems />
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" className="text-muted-foreground hover:text-primary">Sign In</Button>
          <Button className="font-medium">Book Appointment</Button>
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
