import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/clerk";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Github } from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultView?: "signIn" | "signUp";
}

export default function AuthModal({ 
  open, 
  onOpenChange,
  defaultView = "signUp" 
}: AuthModalProps) {
  const [view, setView] = useState<"signIn" | "signUp">(defaultView);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (view === "signIn") {
        const result = await signIn(email, password);
        if (result.success) {
          toast({
            title: "Welcome back!",
            description: "You've successfully signed in.",
          });
          onOpenChange(false);
        } else {
          toast({
            title: "Sign in failed",
            description: result.error || "Invalid email or password. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        const result = await signUp(email, password);
        if (result.success) {
          toast({
            title: "Account created!",
            description: "Welcome to BriefBank! You can now explore pitch decks and get AI summaries.",
          });
          onOpenChange(false);
        } else {
          toast({
            title: "Sign up failed",
            description: result.error || "Could not create account. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Authentication error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleView = () => {
    setView(view === "signIn" ? "signUp" : "signIn");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {view === "signIn" ? "Sign in to your account" : "Create your account"}
          </DialogTitle>
          <DialogDescription>
            {view === "signIn" 
              ? "Enter your credentials to access your account" 
              : "Join thousands of founders, product managers, and VC firms using BriefBank."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {view === "signIn" ? "Signing in..." : "Signing up..."}
              </>
            ) : (
              view === "signIn" ? "Sign In" : "Sign Up with Email"
            )}
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" type="button" disabled={isLoading}>
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                  <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                  <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                  <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                </g>
              </svg>
              Google
            </Button>
            <Button variant="outline" type="button" disabled={isLoading}>
              <Github className="h-5 w-5 mr-2" />
              GitHub
            </Button>
          </div>
          
          <div className="text-center text-sm">
            {view === "signIn" ? (
              <p>
                Don't have an account?{" "}
                <Button variant="link" className="p-0 h-auto" onClick={toggleView} disabled={isLoading}>
                  Sign up
                </Button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <Button variant="link" className="p-0 h-auto" onClick={toggleView} disabled={isLoading}>
                  Sign in
                </Button>
              </p>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
