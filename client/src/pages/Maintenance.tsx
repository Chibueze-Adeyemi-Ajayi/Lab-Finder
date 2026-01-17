import { Beaker, Hammer, Clock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Maintenance() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
            <div className="max-w-2xl w-full space-y-8 animate-in fade-in zoom-in duration-700">
                <div className="flex justify-center">
                    <div className="bg-primary/10 p-4 rounded-2xl">
                        <Beaker className="w-12 h-12 text-primary animate-pulse" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-heading font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent tracking-tight">
                        System Upgrade
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground font-medium">
                        LabNearMe is currently under maintenance upgrade
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
                    <div className="bg-secondary/30 p-6 rounded-xl border border-border/50 backdrop-blur-sm">
                        <Hammer className="w-8 h-8 text-primary mx-auto mb-4" />
                        <h3 className="font-bold mb-2">Upgrading</h3>
                        <p className="text-sm text-muted-foreground">We're adding new features to improve your experience.</p>
                    </div>
                    <div className="bg-secondary/30 p-6 rounded-xl border border-border/50 backdrop-blur-sm">
                        <Clock className="w-8 h-8 text-primary mx-auto mb-4" />
                        <h3 className="font-bold mb-2">Back Soon</h3>
                        <p className="text-sm text-muted-foreground">We expect to be back online shortly.</p>
                    </div>
                    <div className="bg-secondary/30 p-6 rounded-xl border border-border/50 backdrop-blur-sm">
                        <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
                        <h3 className="font-bold mb-2">Support</h3>
                        <p className="text-sm text-muted-foreground">Reach out to us at jiloinnovations@gmail.com if you need urgent assistance.</p>
                    </div>
                </div>

                <div className="pt-8">
                    <Button
                        variant="outline"
                        size="lg"
                        className="font-semibold"
                        onClick={() => window.location.reload()}
                    >
                        Check Again
                    </Button>
                </div>

                <footer className="pt-12 text-sm text-muted-foreground">
                    © {new Date().getFullYear()} LabNearMe. All rights reserved.
                </footer>
            </div>
        </div>
    );
}
