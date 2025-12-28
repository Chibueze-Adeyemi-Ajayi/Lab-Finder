import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Mail, Phone, MapPin, CheckCircle, Lock, ArrowRight, Eye, EyeOff, Key, Camera, X as CloseIcon, Image as ImageIcon, Loader2, ShieldCheck, Plus, ListChecks, XCircle } from "lucide-react";
import { toClinics, setToken } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";

type AuthMode = "signup" | "login" | "forgot" | "reset";

export default function ClinicSignup() {
  const [mode, setMode] = useState<AuthMode>("signup");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [locationPath, setLocationPath] = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    confirmPassword: "",
    otp: ""
  });

  const [services, setServices] = useState<string[]>([]);
  const [newService, setNewService] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addService = () => {
    if (newService.trim()) {
      if (services.includes(newService.trim())) {
        toast({ title: "Duplicate Service", description: "This service is already in your list." });
        return;
      }
      setServices([...services, newService.trim()]);
      setNewService("");
    }
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const availableSlots = 3 - selectedImages.length;
    const newFiles = files.slice(0, availableSlots);

    if (files.length > availableSlots) {
      toast({ title: "Limit Reached", description: "You can only upload up to 3 images." });
    }

    const newSelected = [...selectedImages, ...newFiles];
    setSelectedImages(newSelected);

    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previews[index]);
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      setStep(2);
      return;
    }
    if (step === 2) {
      if (services.length === 0) {
        toast({ title: "Services Required", description: "Please add at least one service offered by your clinic.", variant: "destructive" });
        return;
      }
      setStep(3);
      return;
    }
    if (step === 3) {
      if (selectedImages.length === 0) {
        toast({ title: "Photos Required", description: "Please upload at least one showcase image of your clinic.", variant: "destructive" });
        return;
      }
      setStep(4);
      return;
    }

    if (!acceptedTerms) {
      toast({
        title: "Terms Required",
        description: "You must accept the terms and conditions to create a clinic account.",
        variant: "destructive"
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        clinic_name: formData.clinicName,
        contact_person: formData.contactPerson,
        email: formData.email,
        phone_number: formData.phone,
        address: {
          street_address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode
        },
        services: services,
        password: formData.password
      };

      const signupResponse = await toClinics.signup(payload);

      const token = signupResponse.access_token || signupResponse.token;
      if (token) {
        setToken("clinic", token);
      } else {
        const loginRes = await toClinics.login({ username: formData.email, password: formData.password });
        setToken("clinic", loginRes.access_token);
      }

      if (selectedImages.length > 0) {
        await toClinics.uploadImages(selectedImages);
      }

      setStep(5);
      toast({ title: "Success", description: "Clinic registered and applications submitted for review!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Registration failed", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptedTerms) {
      toast({
        title: "Required",
        description: "Please accept the terms to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await toClinics.login({ username: formData.email, password: formData.password });
      setToken("clinic", response.access_token);
      toast({ title: "Welcome back!", description: "Logged in successfully" });
      setLocationPath("/clinic/dashboard");
    } catch (error: any) {
      toast({ title: "Login Failed", description: error.message || "Invalid credentials", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await toClinics.forgotPassword(formData.email);
      toast({ title: "OTP Sent", description: "Check your email for the recovery code." });
      setMode("reset");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      await toClinics.resetPassword({
        email: formData.email,
        otp: formData.otp,
        new_password: formData.password
      });
      toast({ title: "Password Reset", description: "You can now login with your new password." });
      setMode("login");
    } catch (error: any) {
      toast({ title: "Reset Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground mb-3">
              {mode === "signup" ? (step === 5 ? "Welcome Aboard!" : "Register Your Clinic") :
                mode === "login" ? "Clinic Login" :
                  mode === "forgot" ? "Reset Password" : "Enter Recovery Code"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "signup" ? (step === 5 ? "Your registration is being processed" : `Step ${step} of 4: ${step === 1 ? "Basic Information" : step === 2 ? "Services Offered" : step === 3 ? "Showcase Photos" : "Location & Security"}`) :
                mode === "login" ? "Manage your lab requests and reports" :
                  "We'll help you get back into your account"}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-border/60 shadow-xl overflow-hidden">
            {mode !== "reset" && step !== 5 && (
              <div className="flex border-b border-border">
                <button
                  onClick={() => { setMode("signup"); setStep(1); }}
                  className={`flex-1 py-4 text-sm font-bold transition-all ${mode === "signup" ? "text-primary border-b-2 border-primary bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}
                >
                  Create Account
                </button>
                <button
                  onClick={() => setMode("login")}
                  className={`flex-1 py-4 text-sm font-bold transition-all ${mode === "login" ? "text-primary border-b-2 border-primary bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}
                >
                  Sign In
                </button>
              </div>
            )}

            <div className="p-8 md:p-10">
              <AnimatePresence mode="wait">
                {mode === "signup" && step !== 5 && (
                  <motion.form
                    key="signup"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleSignup}
                    className="space-y-6"
                  >
                    {step === 1 && (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Clinic Name *</label>
                            <div className="relative">
                              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input name="clinicName" placeholder="Global Lab" value={formData.clinicName} onChange={handleChange} required className="pl-10 h-11" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Contact Person *</label>
                            <Input name="contactPerson" placeholder="John Doe" value={formData.contactPerson} onChange={handleChange} required className="h-11" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-foreground">Email Address *</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input type="email" name="email" placeholder="clinic@example.com" value={formData.email} onChange={handleChange} required className="pl-10 h-11" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-foreground">Phone Number *</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input name="phone" placeholder="08012345678" value={formData.phone} onChange={handleChange} required className="pl-10 h-11" />
                          </div>
                        </div>
                        <Button type="submit" className="w-full h-11 font-semibold group">
                          Next Step <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-foreground">What services do you offer? *</label>
                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <ListChecks className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                  placeholder="e.g. Blood Test, MRI, X-Ray"
                                  value={newService}
                                  onChange={(e) => setNewService(e.target.value)}
                                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                                  className="pl-10 h-11"
                                />
                              </div>
                              <Button type="button" onClick={addService} size="icon" className="h-11 w-11 shrink-0">
                                <Plus className="w-5 h-5" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-3 min-h-[150px] bg-secondary/10 rounded-xl p-4 border border-border/50">
                            {services.length === 0 ? (
                              <div className="h-[120px] flex flex-col items-center justify-center text-muted-foreground text-sm">
                                <ListChecks className="w-8 h-8 mb-2 opacity-20" />
                                <p>No services added yet</p>
                              </div>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {services.map((service, i) => (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key={i}
                                    className="flex items-center gap-2 bg-white border border-border px-3 py-1.5 rounded-full text-sm font-medium shadow-sm"
                                  >
                                    <span>{service}</span>
                                    <button type="button" onClick={() => removeService(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                                      <XCircle className="w-4 h-4" />
                                    </button>
                                  </motion.div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 h-11">Back</Button>
                          <Button type="submit" className="flex-1 h-11 font-semibold">Continue</Button>
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-6">
                        <div className="bg-secondary/20 border border-dashed border-border rounded-xl p-8 text-center relative">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleImageSelect}
                            disabled={selectedImages.length >= 3}
                          />
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                              <Camera className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="font-bold">Showcase Your Clinic *</h3>
                              <p className="text-xs text-muted-foreground">Upload 1-3 high-quality photos of your facility</p>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={selectedImages.length >= 3}
                              className="mt-2"
                            >
                              <ImageIcon className="w-4 h-4 mr-2" />
                              Select Images ({selectedImages.length}/3)
                            </Button>
                          </div>
                        </div>

                        {previews.length > 0 && (
                          <div className="grid grid-cols-3 gap-4">
                            {previews.map((src, i) => (
                              <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
                                <img src={src} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => removeImage(i)}
                                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-100 transition-opacity"
                                >
                                  <CloseIcon className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-4 pt-2">
                          <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1 h-11">Back</Button>
                          <Button type="submit" className="flex-1 h-11 font-semibold">Continue</Button>
                        </div>
                      </div>
                    )}

                    {step === 4 && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold">Street Address *</label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input name="address" placeholder="123 Medical St" value={formData.address} onChange={handleChange} required className="pl-10 h-11" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-semibold">City *</label>
                            <Input name="city" placeholder="Lagos" value={formData.city} onChange={handleChange} required className="h-11" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold">State *</label>
                            <Input name="state" placeholder="Lagos State" value={formData.state} onChange={handleChange} required className="h-11" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-semibold">ZIP Code *</label>
                            <Input name="zipCode" placeholder="10001" value={formData.zipCode} onChange={handleChange} required className="h-11" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-primary font-bold">Registration Ready</label>
                            <div className="h-11 flex items-center text-xs text-muted-foreground italic">Last step before review</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold">Access Password *</label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input type={showPassword ? "text" : "password"} name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required className="pl-10 pr-10 h-11" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold">Confirm Password *</label>
                          <Input type="password" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required className="h-11" />
                        </div>

                        <div className="flex items-start space-x-2 pt-2">
                          <Checkbox
                            id="clinic-terms"
                            checked={acceptedTerms}
                            onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                            className="mt-1 border-primary data-[state=checked]:bg-primary"
                          />
                          <Label htmlFor="clinic-terms" className="text-sm mt-1 leading-tight font-medium text-muted-foreground">
                            I agree to the{" "}
                            <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Terms of Service</a>
                            {" "}and{" "}
                            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Privacy Policy</a>
                          </Label>
                        </div>
                        <div className="flex gap-4 pt-4">
                          <Button type="button" variant="outline" onClick={() => setStep(3)} className="flex-1 h-11">Back</Button>
                          <Button type="submit" className="flex-1 h-11 font-bold shadow-lg shadow-primary/20" disabled={isLoading}>
                            {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Finalizing...</> : "Submit Application"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </motion.form>
                )}

                {mode === "login" && (
                  <motion.form
                    key="login"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleLogin}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input type="email" name="email" placeholder="clinic@example.com" value={formData.email} onChange={handleChange} required className="pl-10 h-11" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-semibold">Password</label>
                          <button type="button" onClick={() => setMode("forgot")} className="text-xs text-primary font-bold hover:underline">Forgot password?</button>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input type={showPassword ? "text" : "password"} name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required className="pl-10 pr-10 h-11" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2 pt-2 pb-4">
                        <Checkbox
                          id="clinic-login-terms"
                          checked={acceptedTerms}
                          onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                          className="mt-1 border-primary data-[state=checked]:bg-primary"
                        />
                        <Label htmlFor="clinic-login-terms" className="text-xs mt-1 leading-tight font-medium text-muted-foreground">
                          I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Terms of Service</a>
                        </Label>
                      </div>

                      <Button type="submit" className="w-full h-11 font-semibold" disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Login to Dashboard"}
                      </Button>
                    </div>
                  </motion.form>
                )}

                {mode === "forgot" && (
                  <motion.form
                    key="forgot"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleForgotPassword}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground mb-4">Enter your email address and we'll send you an OTP to reset your password.</p>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Email</label>
                        <Input type="email" name="email" placeholder="clinic@example.com" value={formData.email} onChange={handleChange} required className="h-11" />
                      </div>
                      <Button type="submit" className="w-full h-11 font-semibold" disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Send Recovery Code"}
                      </Button>
                      <Button type="button" variant="ghost" className="w-full h-11" onClick={() => setMode("login")}>Back to Login</Button>
                    </div>
                  </motion.form>
                )}

                {mode === "reset" && (
                  <motion.form
                    key="reset"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleResetPassword}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">OTP Code</label>
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input name="otp" placeholder="123456" value={formData.otp} onChange={handleChange} required className="pl-10 h-11" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">New Password</label>
                        <Input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required className="h-11" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Confirm New Password</label>
                        <Input type="password" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required className="h-11" />
                      </div>
                      <Button type="submit" className="w-full h-11 font-semibold" disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Reset & Login"}
                      </Button>
                    </div>
                  </motion.form>
                )}

                {step === 5 && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <Dialog open={step === 5} onOpenChange={(open) => !open && (window.location.href = "/")}>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader className="flex flex-col items-center text-center">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <ShieldCheck className="w-10 h-10 text-blue-600" />
                          </div>
                          <DialogTitle className="text-2xl font-bold">Application Under Review</DialogTitle>
                          <DialogDescription className="text-base pt-2">
                            Thank you for registering <span className="font-bold text-foreground">{formData.clinicName}</span>.
                            Your clinic is currently in review. Our assurance team will get back to you shortly after verifying your details.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="sm:justify-center mt-6">
                          <Button onClick={() => window.location.href = "/"} className="w-full sm:w-auto px-8">
                            Understood
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Registration Submitted!</h2>
                    <p className="text-muted-foreground mb-8">Please check the popup for next steps regarding your application review status.</p>
                    <Button onClick={() => window.location.href = "/"} className="w-full h-11 font-semibold">Back to Home</Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
