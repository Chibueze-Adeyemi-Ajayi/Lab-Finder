import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, X, Smartphone } from "lucide-react";

export function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
            setIsInstalled(true);
            return;
        }

        const handleBeforeInstallPrompt = (e: any) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);

            // Check if user has previously dismissed it in this session or dismissed it too many times
            const skipPrompt = localStorage.getItem("pwa-prompt-dismissed");
            if (!skipPrompt) {
                setIsVisible(true);
            }
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        window.addEventListener('appinstalled', () => {
            setIsInstalled(true);
            setIsVisible(false);
            setDeferredPrompt(null);
            console.log('PWA was installed');
        });

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setIsVisible(false);
        }
    };

    const handleDismiss = () => {
        setIsVisible(false);
        // We set a flag but maybe not "forever" if the user wants it persistent.
        // Let's set it for 24 hours so it stays persistent but not annoying.
        const expiry = new Date().getTime() + (24 * 60 * 60 * 1000);
        localStorage.setItem("pwa-prompt-dismissed", expiry.toString());
    };

    // Auto-check expiry of dismissal
    useEffect(() => {
        const skipUntil = localStorage.getItem("pwa-prompt-dismissed");
        if (skipUntil && new Date().getTime() > parseInt(skipUntil)) {
            localStorage.removeItem("pwa-prompt-dismissed");
        }
    }, []);

    if (isInstalled || !isVisible || !deferredPrompt) return null;

    return (
        <AnimatePresence>
            <motion.div
                key="desktop-prompt"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                className="fixed bottom-6 left-6 z-[90] hidden md:block"
            >
                <div className="bg-primary text-primary-foreground rounded-2xl shadow-2xl p-4 flex items-center gap-4 border border-white/10 backdrop-blur-md">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                        <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm">Install LabNearMe</h4>
                        <p className="text-xs opacity-90">Access labs faster from your home screen</p>
                    </div>
                    <div className="flex gap-2 ml-2">
                        <Button variant="secondary" size="sm" onClick={handleInstall} className="font-bold">
                            Install
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setIsVisible(false)} className="h-8 w-8 hover:bg-white/10">
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Mobile Version (Bottom Bar) */}
            <motion.div
                key="mobile-prompt"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                className="fixed bottom-16 left-0 right-0 z-[110] md:hidden bg-primary text-primary-foreground p-4 flex items-center justify-between border-t border-white/10"
            >
                <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5" />
                    <span className="text-sm font-bold">Install our App</span>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" size="sm" onClick={handleInstall} className="text-xs h-8 px-4 font-bold">
                        Add to Home Screen
                    </Button>
                    <button onClick={() => setIsVisible(false)}>
                        <X className="w-5 h-5 text-white/60" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
