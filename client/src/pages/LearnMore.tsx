import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
    CheckCircle2,
    ArrowRight,
    Search,
    Calendar,
    FileText,
    Star,
    ShieldCheck,
    Clock,
    BarChart3,
    Cloud,
    Layers,
    Sparkles
} from "lucide-react";

const CLINIC_FEATURES = [
    {
        title: "Patient Discovery",
        description: "Get discovered by patients in your area searching for specific tests and services. Our smart ranking ensures the best matches.",
        icon: <Search className="w-5 h-5" />
    },
    {
        title: "Appointment Management",
        description: "Streamlined booking system that allows you to manage slots, avoid overlaps, and send automated reminders to patients.",
        icon: <Calendar className="w-5 h-5" />
    },
    {
        title: "Digital Lab Reports",
        description: "Upload and deliver results securely. Patients can access their reports through their own dashboard as soon as you finish.",
        icon: <FileText className="w-5 h-5" />
    },
    {
        title: "Performance Analytics",
        description: "Trace your growth with detailed insights into booking trends, service popularity, and patient satisfaction ratings.",
        icon: <BarChart3 className="w-5 h-5" />
    },
    {
        title: "Cloud Infrastructure",
        description: "Your data is always safe, backed up, and accessible from any device. Manage your clinic from the office or on the go.",
        icon: <Cloud className="w-5 h-5" />
    },
    {
        title: "Online Reputation",
        description: "Build trust with verified reviews and scores. Premium clinics gain higher visibility and more trust from the community.",
        icon: <Star className="w-5 h-5" />
    }
];

export default function LearnMore() {
    return (
        <div className="min-h-screen bg-background font-sans">
            <Header />

            <main className="pt-24">
                {/* Animated Hero */}
                <section className="relative py-24 overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl" />

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                                <Sparkles className="w-3.5 h-3.5" />
                                Empowering Healthcare
                            </span>
                            <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-foreground tracking-tight mb-8">
                                Revolutionizing how patients <br /> <span className="text-primary">connect with labs</span>
                            </h1>
                            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                                LabNearMe is more than just a search engine. It's a comprehensive platform designed to streamline diagnostic healthcare for both patients and providers.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="/for-clinics">
                                    <Button size="lg" className="h-14 px-10 text-lg font-bold">Register Your Clinic</Button>
                                </Link>
                                <Link href="/find-lab">
                                    <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold">Find a Lab Today</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits for Patients */}
                <section className="py-24 bg-secondary/20">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">Why patients love us</h2>
                                <div className="space-y-6">
                                    {[
                                        "Verified clinic credentials and service quality.",
                                        "Real-time comparison of prices and test availability.",
                                        "Secure digital storage for all your lab history.",
                                        "Instant notifications when your reports are ready.",
                                        "No more phone calls or long waiting rooms."
                                    ].map((text, i) => (
                                        <div key={i} className="flex gap-4 items-start">
                                            <div className="mt-1 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                            </div>
                                            <p className="text-lg text-muted-foreground">{text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative">
                                <div className="bg-white p-8 rounded-3xl border border-border/60 shadow-2xl relative z-10">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                            <ShieldCheck className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl">Trusted Health Guardian</h3>
                                            <p className="text-muted-foreground text-sm">Your medical data is encrypted with AES-256</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="h-4 bg-secondary/50 rounded-full w-full" />
                                        <div className="h-4 bg-secondary/50 rounded-full w-[80%]" />
                                        <div className="h-4 bg-secondary/50 rounded-full w-[60%]" />
                                    </div>
                                    <div className="mt-8 pt-8 border-t border-border flex justify-between items-center text-sm font-bold opacity-60">
                                        <span>PATIENT PORTAL</span>
                                        <span>VERIFIED 2024</span>
                                    </div>
                                </div>
                                {/* Decorative background blocks */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border-2 border-primary/20 rounded-[40px] -rotate-3 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Platform Features for Clinics */}
                <section className="py-24">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16 max-w-2xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 italic">The Clinic Operating System</h2>
                            <p className="text-muted-foreground text-lg">Everything you need to run and grow your diagnostic lab in the digital age.</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {CLINIC_FEATURES.map((feature, i) => (
                                <div key={i} className="p-8 bg-white border border-border/60 rounded-3xl hover:border-primary/40 transition-all hover:shadow-xl hover:-translate-y-1 group">
                                    <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 group">
                    <div className="container mx-auto px-4">
                        <div className="bg-primary p-12 md:p-20 rounded-[48px] text-center text-white overflow-hidden relative">
                            <div className="relative z-10 max-w-3xl mx-auto">
                                <h2 className="text-4xl md:text-6xl font-heading font-bold mb-8">Ready to transform your healthcare experience?</h2>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                    <Link href="/signin">
                                        <Button size="lg" variant="secondary" className="h-16 px-12 text-xl font-bold w-full sm:w-auto">Get Started Now</Button>
                                    </Link>
                                    <Link href="/help">
                                        <Button size="lg" variant="ghost" className="h-16 px-12 text-xl font-bold text-white hover:bg-white/10 w-full sm:w-auto">
                                            Have Questions?
                                            <ArrowRight className="ml-2 w-6 h-6" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                                <Layers className="w-64 h-64" />
                            </div>
                            <div className="absolute bottom-0 left-0 p-12 opacity-10 pointer-events-none">
                                <Clock className="w-64 h-64 rotate-45" />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-background py-16 border-t border-border mt-24">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <span className="font-heading font-bold text-2xl tracking-tight text-foreground">
                            <span className="text-primary">Lab</span>NearMe
                        </span>
                    </div>
                    <p className="text-muted-foreground mb-8">Building the future of diagnostic convenience.</p>
                    <div className="flex justify-center gap-8 text-sm font-semibold uppercase tracking-wider text-muted-foreground flex-wrap">
                        <Link href="/" className="hover:text-primary">Home</Link>
                        <Link href="/find-lab" className="hover:text-primary">Find Lab</Link>
                        <Link href="/for-clinics" className="hover:text-primary">Clinics</Link>
                        <Link href="/help" className="hover:text-primary">Help</Link>
                        <Link href="/privacy" className="hover:text-primary">Privacy</Link>
                        <Link href="/terms" className="hover:text-primary">Terms</Link>
                        <Link href="/contact" className="hover:text-primary">Contact</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
