import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, Building2, ShieldCheck } from "lucide-react";
import { toPatients, toClinics, toSuperAdmin, setToken } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link } from "wouter";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type Role = "patient" | "clinic" | "superadmin";

export default function SignIn() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>("patient");
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptedTerms) {
      toast({
        title: "Agreement Required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        // Handle Sign Up
        if (role === "patient") {
          await toPatients.signup({ full_name: name, email, password });
          toast({ title: "Account created!", description: "Please login to continue." });
          setIsSignUp(false);
        } else if (role === "clinic") {
          // Redirect to dedicated clinic signup page as it's more complex
          setLocation("/for-clinics");
        } else {
          toast({ title: "Error", description: "Super Admin signup is not publicly available.", variant: "destructive" });
        }
      } else {
        // Handle Login
        let response;
        if (role === "patient") {
          // Postman: username=email, password=password
          response = await toPatients.login({ username: email, password });
          setToken("patient", response.access_token);
          setLocation("/user/dashboard");
        } else if (role === "clinic") {
          response = await toClinics.login({ username: email, password });
          setToken("clinic", response.access_token);
          setLocation("/clinic/dashboard");
        } else if (role === "superadmin") {
          response = await toSuperAdmin.login({ username: email, password });
          setToken("superadmin", response.access_token);
          setLocation("/"); // No superadmin dashboard yet
          toast({ title: "Success", description: "Logged in as Super Admin" });
        }

      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background flex items-center justify-center py-12">
      <Header />

      <div className="container mx-auto px-4 max-w-md pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl border border-border/60 shadow-lg p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-muted-foreground">
              {isSignUp
                ? "Join LabNearMe to book appointments easily"
                : "Sign in to your LabNearMe account"}
            </p>
          </div>

          {/* Role Selection */}
          {/* <div className="flex justify-center gap-2 mb-6 p-1 bg-secondary/50 rounded-lg">
            <button
              type="button"
              onClick={() => setRole("patient")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === "patient" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <div className="flex items-center justify-center gap-2">
                <User className="w-4 h-4" />
                <span>Patient</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setRole("clinic")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === "clinic" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>Clinic</span>
              </div>
            </button>
            {!isSignUp && (
              <button
                type="button"
                onClick={() => setRole("superadmin")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === "superadmin" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin</span>
                </div>
              </button>
            )}
          </div> */}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && role === "patient" && (
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Email as Username</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-start space-x-2 mt-4">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                className="mt-1"
              />
              <Label htmlFor="terms" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-medium text-muted-foreground">
                I accept the{" "}
                <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Terms of Service</a>
                {" "}and{" "}
                <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Privacy Policy</a>
              </Label>
            </div>

            <Button type="submit" className="w-full h-11 font-semibold mt-6" disabled={isLoading}>
              {isLoading ? "Processing..." : (isSignUp ? "Create Account" : "Sign In")}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Toggle Sign In / Sign Up */}
          <div className="mt-8 text-center text-sm">
            <span className="text-muted-foreground">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
            </span>
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline font-semibold"
            >
              {isSignUp ? "Sign In" : "Create Account"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
