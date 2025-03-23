import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Auth from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import Profile from "@/pages/profile";
import { useEffect } from "react";
import { useLocation } from "wouter";

function Router() {
  const [location, setLocation] = useLocation();

  // Redirect to auth page if on the home page
  useEffect(() => {
    if (location === "/") {
      setLocation("/auth");
    }
  }, [location, setLocation]);

  return (
    <Switch>
      <Route path="/auth" component={Auth} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/profile" component={Profile} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
