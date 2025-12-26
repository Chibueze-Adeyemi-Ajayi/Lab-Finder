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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/find-lab" component={FindLab} />
      <Route path="/for-clinics" component={ClinicSignup} />
      <Route path="/signin" component={SignIn} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
