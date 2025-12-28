import { Header } from "@/components/layout/Header";

export default function Privacy() {
    return (
        <div className="min-h-screen bg-background font-sans">
            <Header />
            <main className="container mx-auto px-4 pt-32 pb-20 max-w-4xl">
                <h1 className="text-4xl font-heading font-bold mb-8">Privacy Policy</h1>
                <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
                        <p>Welcome to LabNearMe. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">2. Information We Collect</h2>
                        <p>We collect personal information that you provide to us such as name, address, contact information, passwords and security data, and payment information.</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Account Info:</strong> Name, email address, phone number.</li>
                            <li><strong>Medical Data:</strong> Lab requests, test results (encrypted and accessible only by you and the clinic).</li>
                            <li><strong>Location & Device:</strong> GPS coordinates (with permission) and your <strong>IP Address</strong>. We collect your IP address to personalize your search experience and remember your preferences for subsequent visits.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">3. How We Use Your Information</h2>
                        <p>We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">4. Data Security</h2>
                        <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.</p>
                    </section>

                    <section>
                        <p className="text-sm italic">Last updated: December 28, 2024</p>
                    </section>
                </div>
            </main>
        </div>
    );
}
