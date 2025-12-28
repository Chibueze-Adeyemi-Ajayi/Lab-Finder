import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";
import { Link } from "wouter";

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie-consent", "accepted");
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-[100]"
                >
                    <div className="bg-white rounded-2xl shadow-2xl border border-primary/10 p-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                <Cookie className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-foreground mb-2">We value your privacy</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                    We use cookies and collect data for personalization to improve your experience and remember your preferences. See our <Link href="/privacy" className="text-primary hover:underline font-medium">Privacy Policy</Link> for details.
                                </p>
                                <div className="flex items-center gap-3">
                                    <Button onClick={handleAccept} className="flex-1 h-10 font-semibold shadow-lg shadow-primary/20">
                                        Accept All
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => setIsVisible(false)} className="h-10 w-10 shrink-0 text-muted-foreground">
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
