import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { toPublic } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        message: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await toPublic.sendContact(formData);
            toast({
                title: "Message Sent!",
                description: "We've received your inquiry and will get back to you shortly.",
            });
            // Clear form
            setFormData({
                first_name: "",
                last_name: "",
                email: "",
                message: ""
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to send message. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background font-sans">
            <Header />
            <main className="container mx-auto px-4 pt-32 pb-20">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Get in Touch</h1>
                        <p className="text-lg text-muted-foreground">Have questions? We're here to help you 24/7.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="bg-white p-8 rounded-3xl border border-border shadow-sm">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="first_name">First Name *</Label>
                                        <Input
                                            id="first_name"
                                            placeholder="John"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="last_name">Last Name</Label>
                                        <Input
                                            id="last_name"
                                            placeholder="Doe"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="message">Message *</Label>
                                    <Textarea
                                        id="message"
                                        placeholder="How can we help you?"
                                        className="min-h-[150px]"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <Button className="w-full h-12 font-bold gap-2" disabled={isLoading}>
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                    {isLoading ? "Sending..." : "Send Message"}
                                </Button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className="flex flex-col justify-center space-y-8">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                                    <Mail className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl mb-1">Email Us</h3>
                                    <p className="text-muted-foreground">support@labnearme.com</p>
                                    <p className="text-muted-foreground text-sm mt-1">Response within 2 hours</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
                                    <Phone className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl mb-1">Call Us</h3>
                                    <p className="text-muted-foreground">+1 (555) 000-0000</p>
                                    <p className="text-muted-foreground text-sm mt-1">Available 24/7 for urgent help</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
                                    <MapPin className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl mb-1">Our Office</h3>
                                    <p className="text-muted-foreground">123 Health Tech Plaza, Silicon Valley</p>
                                    <p className="text-muted-foreground text-sm mt-1">CA 94103, United States</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
