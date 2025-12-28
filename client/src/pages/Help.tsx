import { Header } from "@/components/layout/Header";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, Mail, MessageCircle, Phone, LifeBuoy, BookOpen, ShieldCheck } from "lucide-react";

const FAQS = [
    {
        question: "How do I book a lab test?",
        answer: "You can book a lab test by searching for your desired test or clinic on the 'Find a Lab' page. Once you find a suitable option, klik the 'Book' button and fill in your details."
    },
    {
        question: "How will I receive my results?",
        answer: "Results are uploaded directly to the platform by the clinic. You can access them from your patient dashboard under the 'Lab Requests' section as soon as they are ready."
    },
    {
        question: "Is my medical data secure?",
        answer: "Yes, we prioritize your privacy. All your medical data and results are encrypted and only accessible by you and the authorized clinic staff."
    },
    {
        question: "How do I add my clinic to LabNearMe?",
        answer: "Clinics can join by clicking the 'For Clinics' link and following the registration process. Once verified, you'll be able to manage your services and receive requests."
    },
    {
        question: "What are the payment methods?",
        answer: "We support various payment methods including credit/debit cards, bank transfers, and mobile money, depending on your location."
    }
];

export default function Help() {
    return (
        <div className="min-h-screen bg-background font-sans flex flex-col">
            <Header />

            <main className="flex-1 pt-24 pb-20">
                {/* Hero Section */}
                <section className="bg-primary/5 border-b border-border py-16 mb-12">
                    <div className="container mx-auto px-4 text-center max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">How can we help you?</h1>
                        <div className="relative max-w-xl mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <Input
                                placeholder="Search for articles, guides..."
                                className="pl-12 h-14 text-lg border-primary/20 bg-white shadow-lg shadow-primary/5 focus-visible:ring-primary"
                            />
                        </div>
                        <p className="mt-6 text-muted-foreground">
                            Popular topics: <span className="text-primary cursor-pointer hover:underline">Booking</span>, <span className="text-primary cursor-pointer hover:underline">Results</span>, <span className="text-primary cursor-pointer hover:underline">Clinic setup</span>
                        </p>
                    </div>
                </section>

                <div className="container mx-auto px-4 max-w-5xl">
                    {/* Quick Support Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mb-16">
                        <div className="p-6 bg-white border border-border rounded-2xl hover:border-primary/40 transition-all hover:shadow-lg group">
                            <LifeBuoy className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                            <h3 className="text-lg font-bold mb-2">Technical Support</h3>
                            <p className="text-sm text-muted-foreground mb-4">Facing issues with our platform? Our technical team is here to help.</p>
                            <Button variant="ghost" className="text-primary p-0 h-auto font-bold hover:bg-transparent">Contact Support</Button>
                        </div>
                        <div className="p-6 bg-white border border-border rounded-2xl hover:border-primary/40 transition-all hover:shadow-lg group">
                            <BookOpen className="w-10 h-10 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                            <h3 className="text-lg font-bold mb-2">Guides & Resources</h3>
                            <p className="text-sm text-muted-foreground mb-4">Step-by-step guides for patients and healthcare providers.</p>
                            <Button variant="ghost" className="text-primary p-0 h-auto font-bold hover:bg-transparent">Browse Guides</Button>
                        </div>
                        <div className="p-6 bg-white border border-border rounded-2xl hover:border-primary/40 transition-all hover:shadow-lg group">
                            <ShieldCheck className="w-10 h-10 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
                            <h3 className="text-lg font-bold mb-2">Privacy & Security</h3>
                            <p className="text-sm text-muted-foreground mb-4">Learn about how we protect your data and privacy.</p>
                            <Button variant="ghost" className="text-primary p-0 h-auto font-bold hover:bg-transparent">Read More</Button>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* FAQ Section */}
                        <div className="lg:col-span-2">
                            <h2 className="text-2xl font-heading font-bold mb-8">Frequently Asked Questions</h2>
                            <Accordion type="single" collapsible className="w-full space-y-4">
                                {FAQS.map((faq, i) => (
                                    <AccordionItem key={i} value={`item-${i}`} className="border border-border rounded-xl px-6 bg-white">
                                        <AccordionTrigger className="hover:no-underline py-4 text-left font-semibold">
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>

                        {/* Contact Sidebar */}
                        <div className="space-y-6">
                            <div className="p-8 bg-black text-white rounded-3xl overflow-hidden relative">
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold mb-4">Still need help?</h3>
                                    <p className="text-white/70 mb-8">If you couldn't find your answer, our support team is available 24/7.</p>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                                <Mail className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-white/50 uppercase font-bold tracking-wider">Email us</p>
                                                <p className="font-medium">support@labnearme.com</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                                <MessageCircle className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-white/50 uppercase font-bold tracking-wider">Live Chat</p>
                                                <p className="font-medium">Start conversation</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                                <Phone className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-white/50 uppercase font-bold tracking-wider">Call us</p>
                                                <p className="font-medium">+1 (555) 000-0000</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Decorative glow */}
                                <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-primary opacity-20 blur-3xl rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-background py-12 border-t border-border">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} LabNearMe Help Center</p>
                    <div className="flex gap-6">
                        <Link href="/privacy"><span className="text-sm text-primary cursor-pointer font-medium">Privacy Policy</span></Link>
                        <Link href="/terms"><span className="text-sm text-primary cursor-pointer font-medium">Terms of Service</span></Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
