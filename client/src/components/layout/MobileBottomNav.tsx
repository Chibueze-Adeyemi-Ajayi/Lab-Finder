import { Link, useLocation } from "wouter";
import { Home, Search, User, LogIn } from "lucide-react";
import { getToken } from "@/lib/api";

export function MobileBottomNav() {
    const [location] = useLocation();
    const isLoggedIn = !!getToken("patient") || !!getToken("clinic");

    const NavLink = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
        const isActive = location === href;
        return (
            <Link href={href}>
                <div className={`flex flex-col items-center justify-center w-full h-full space-y-1 cursor-pointer ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                    <Icon className={`w-5 h-5 ${isActive ? "fill-current" : ""}`} />
                    <span className="text-[10px] font-medium">{label}</span>
                </div>
            </Link>
        );
    };

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-border z-50 px-4 pb-safe-area-inset-bottom">
            <div className="grid grid-cols-4 h-full items-center">
                <NavLink href="/" icon={Home} label="Home" />
                <NavLink href="/find-lab" icon={Search} label="Search" />
                {isLoggedIn ? (
                    <NavLink href="/user/dashboard" icon={User} label="Profile" />
                ) : (
                    <NavLink href="/signin" icon={LogIn} label="Login" />
                )}
                {/* Placeholder for Appointments or another tab */}
                <Link href="/for-clinics">
                    <div className={`flex flex-col items-center justify-center w-full h-full space-y-1 cursor-pointer ${location === '/for-clinics' ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                        <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center">
                            <span className="text-[10px] font-bold leading-none">+</span>
                        </div>
                        <span className="text-[10px] font-medium">Add Clinic</span>
                    </div>
                </Link>
            </div>
        </div>
    );
}
