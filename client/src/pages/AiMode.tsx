import { ChevronLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";

const GeminiIcon = ({ className = "w-6 h-6", fillColor = "currentColor" }: { className?: string, fillColor?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path
            d="M12 3L14.5 9.5L21 12L14.5 14.5L12 21L9.5 14.5L3 12L9.5 9.5L12 3Z"
            fill={fillColor}
            stroke={fillColor}
            strokeWidth="0.5"
            strokeLinejoin="round"
        />
        <path
            d="M18 16L19 18.5L21.5 19.5L19 20.5L18 23L17 20.5L14.5 19.5L17 18.5L18 16Z"
            fill={fillColor}
            className="opacity-70 animate-pulse"
        />
    </svg>
);

export default function AiMode() {
    const [, setLocation] = useLocation();

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans overflow-hidden">
            {/* Back Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40 px-4 h-16 flex items-center justify-between">
                <button
                    onClick={() => window.history.back()}
                    className="p-2 hover:bg-secondary rounded-full transition-colors text-foreground/80 hover:text-primary"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-2 pr-8">
                    <GeminiIcon className="w-7 h-7" fillColor="hsl(var(--primary))" />
                    <span className="font-heading font-black text-xl tracking-tighter text-primary">BRAIN</span>
                </div>
                <div className="w-6" /> {/* Spacer */}
            </nav>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
                {/* Decorative Background Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" />
                <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-primary/5 rounded-full blur-2xl -z-10" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <div className="relative inline-block mb-8">
                        {/* Multiple Pulsing Rings */}
                        <div className="absolute -inset-8 bg-primary/10 rounded-full blur-2xl animate-pulse" />
                        <div className="absolute -inset-4 bg-primary/5 rounded-full blur-xl animate-pulse delay-75" />

                        <div className="relative bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-primary/10 shadow-2xl shadow-primary/10 flex items-center justify-center">
                            <motion.div
                                animate={{
                                    scale: [1, 1.05, 1],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <GeminiIcon className="w-24 h-24" fillColor="hsl(var(--primary))" />
                            </motion.div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h1 className="text-5xl md:text-6xl font-heading font-black text-foreground mb-4 tracking-tighter">
                            Coming <span className="text-primary">Soon</span>
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-muted-foreground font-medium uppercase tracking-[0.3em] text-xs">
                            <div className="h-px w-8 bg-border" />
                            AI-Powered Medical Assistant
                            <div className="h-px w-8 bg-border" />
                        </div>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    );
}
