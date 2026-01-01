import { Link, useLocation } from "wouter";
import { Home, Search, Sparkles, PlusCircle } from "lucide-react";


export function MobileBottomNav() {
    const [location] = useLocation();


    const NavLink = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
        const isActive = location === href;
        return (
            <Link href={href}>
                <div className={`flex flex-col items-center justify-center w-full h-full space-y-1 cursor-pointer transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                    <Icon className={`w-5 h-5 ${isActive ? "fill-current" : ""}`} />
                    <span className="text-[10px] font-medium">{label}</span>
                </div>
            </Link>
        );
    };

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-border z-50 px-2 pb-safe-area-inset-bottom shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
            <div className="grid grid-cols-4 h-full items-center">
                <NavLink href="/" icon={Home} label="Home" />
                <NavLink href="/find-lab" icon={Search} label="Search" />
                <NavLink href="/ai" icon={Sparkles} label="BRAIN" />
                <NavLink href="/for-clinics" icon={PlusCircle} label="Add Clinic" />
            </div>
        </div>
    );
}
