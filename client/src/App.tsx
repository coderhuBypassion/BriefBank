import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import DeckDetail from "@/pages/deck-detail";
import { useAuth } from "./lib/clerk";

function App() {
  const { status, isSignedIn } = useAuth();

  // Show loading state while authentication is being checked
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Toaster />
      <Switch>
        {/* Public route */}
        <Route path="/" component={Home} />
        
        {/* Protected routes */}
        <Route path="/dashboard">
          {isSignedIn ? <Dashboard /> : <Home />}
        </Route>
        
        <Route path="/deck/:id">
          {params => isSignedIn ? <DeckDetail id={params.id} /> : <Home />}
        </Route>
        
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </TooltipProvider>
  );
}

export default App;
