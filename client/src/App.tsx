import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import FindLab from "@/pages/FindLab";
import ClinicSignup from "@/pages/ClinicSignup";
import SignIn from "@/pages/SignIn";
import UserDashboard from "@/pages/UserDashboard";
import ClinicDashboard from "@/pages/ClinicDashboard";
import Help from "@/pages/Help";
import LearnMore from "@/pages/LearnMore";
import MapNavigation from "@/pages/MapNavigation";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Contact from "@/pages/Contact";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/find-lab" component={FindLab} />
      <Route path="/for-clinics" component={ClinicSignup} />
      <Route path="/signin" component={SignIn} />
      <Route path="/user/dashboard" component={UserDashboard} />
      <Route path="/clinic/dashboard" component={ClinicDashboard} />
      <Route path="/help" component={Help} />
      <Route path="/learn-more" component={LearnMore} />
      <Route path="/map-navigation" component={MapNavigation} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

import { CookieConsent } from "@/components/layout/CookieConsent";
import { PWAInstallPrompt } from "@/components/layout/PWAInstallPrompt";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
        <CookieConsent />
        <PWAInstallPrompt />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
