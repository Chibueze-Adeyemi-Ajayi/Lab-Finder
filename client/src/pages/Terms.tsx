import { Header } from "@/components/layout/Header";

export default function Terms() {
    return (
        <div className="min-h-screen bg-background font-sans">
            <Header />
            <main className="container mx-auto px-4 pt-32 pb-20 max-w-4xl">
                <h1 className="text-4xl font-heading font-bold mb-8">Terms of Service</h1>
                <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">1. Agreement to Terms</h2>
                        <p>By accessing or using LabNearMe, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the service.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">2. Use of License</h2>
                        <p>Permission is granted to temporarily download one copy of the materials on LabNearMe's website for personal, non-commercial transitory viewing only.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">3. Disclaimer</h2>
                        <p>The materials on LabNearMe's website are provided on an 'as is' basis. LabNearMe makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">4. Limitations</h2>
                        <p>In no event shall LabNearMe or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on LabNearMe's website.</p>
                    </section>

                    <section>
                        <p className="text-sm italic">Last updated: December 28, 2024</p>
                    </section>
                </div>
            </main>
        </div>
    );
}
