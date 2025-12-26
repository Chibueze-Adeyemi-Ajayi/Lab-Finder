import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Mail, Phone, MapPin, CheckCircle } from "lucide-react";

export default function ClinicSignup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    clinicName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    contactPerson: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex justify-between mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-all ${
                    s <= step 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-secondary text-muted-foreground"
                  }`}>
                    {s === 3 && s < step ? <CheckCircle className="w-5 h-5" /> : s}
                  </div>
                  <span className="text-xs text-muted-foreground text-center">
                    {s === 1 ? "Clinic Info" : s === 2 ? "Location" : "Confirmation"}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-1 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Form */}
          {step !== 3 && (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl border border-border/60 shadow-lg p-8 md:p-10"
            >
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Clinic Name *</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        type="text"
                        name="clinicName"
                        placeholder="Enter your clinic name"
                        value={formData.clinicName}
                        onChange={handleChange}
                        className="pl-10 h-11"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Contact Person Name *</label>
                    <Input
                      type="text"
                      name="contactPerson"
                      placeholder="Your full name"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      className="h-11"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        type="email"
                        name="email"
                        placeholder="clinic@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10 h-11"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        type="tel"
                        name="phone"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={handleChange}
                        className="pl-10 h-11"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Street Address *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        type="text"
                        name="address"
                        placeholder="123 Medical Street"
                        value={formData.address}
                        onChange={handleChange}
                        className="pl-10 h-11"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">City *</label>
                      <Input
                        type="text"
                        name="city"
                        placeholder="New York"
                        value={formData.city}
                        onChange={handleChange}
                        className="h-11"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">State *</label>
                      <Input
                        type="text"
                        name="state"
                        placeholder="NY"
                        value={formData.state}
                        onChange={handleChange}
                        className="h-11"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">ZIP Code *</label>
                    <Input
                      type="text"
                      name="zipCode"
                      placeholder="10001"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="h-11"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Password *</label>
                    <Input
                      type="password"
                      name="password"
                      placeholder="Enter a secure password"
                      value={formData.password}
                      onChange={handleChange}
                      className="h-11"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Confirm Password *</label>
                    <Input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="h-11"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-4 mt-8">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="flex-1 h-11"
                  >
                    Back
                  </Button>
                )}
                <Button
                  type={step === 2 ? "submit" : "button"}
                  onClick={step === 1 ? handleNextStep : undefined}
                  className="flex-1 h-11 font-semibold"
                >
                  {step === 2 ? "Complete Registration" : "Next Step"}
                </Button>
              </div>
            </motion.form>
          )}

          {/* Success Message */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl border border-border/60 shadow-lg p-12 text-center"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-heading font-bold text-foreground mb-3">Registration Complete!</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Thank you for registering {formData.clinicName}. Our team will verify your details and contact you shortly to activate your clinic dashboard.
              </p>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  A confirmation email has been sent to <span className="font-semibold text-foreground">{formData.email}</span>
                </p>
                <Button className="font-semibold" onClick={() => window.location.href = "/"}>
                  Back to Home
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
