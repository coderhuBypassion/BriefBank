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
import { usePayment } from "@/lib/clerk";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, Shield, Sparkles, Zap, BadgeCheck, Flame } from "lucide-react";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  email?: string;
}

export default function PaymentModal({ 
  open, 
  onOpenChange,
  onSuccess,
  email = ""
}: PaymentModalProps) {
  const { initiatePayment } = usePayment();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      await initiatePayment();
      setIsCompleted(true);
      toast({
        title: "Payment successful!",
        description: "You now have unlimited access to all pitch deck summaries.",
        variant: "success",
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Payment failed",
        description: error instanceof Error ? error.message : "An error occurred during payment processing.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleClose = () => {
    if (!isProcessing) {
      onOpenChange(false);
      // Reset state if modal is closed
      setTimeout(() => {
        setIsCompleted(false);
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl border-0 p-0 rounded-2xl overflow-hidden">
        {isCompleted ? (
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-8">
            <div className="flex flex-col items-center py-6 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-md">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
              <p className="text-gray-600 text-center max-w-md mb-8">
                Thank you for upgrading to BriefBank Pro. You now have unlimited access to all pitch deck summaries and premium features.
              </p>
              <Button 
                onClick={() => onOpenChange(false)}
                className="rounded-xl px-8 py-6 bg-gray-900 hover:bg-gray-800 text-white shadow-lg"
                size="lg"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-primary to-indigo-600 text-white p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-3">
                    <Sparkles className="h-5 w-5 mr-2" />
                    <h2 className="text-xl font-bold">Upgrade to BriefBank Pro</h2>
                  </div>
                  <p className="text-white/80 max-w-md">
                    Unlock the full potential of BriefBank with unlimited AI-powered pitch deck summaries and advanced features.
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-1.5 text-sm font-medium">
                  Most Popular
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Left Side - Pricing & Features */}
                <div className="flex-1">
                  <div className="mb-6">
                    <div className="flex items-baseline mb-1">
                      <span className="text-3xl font-bold">₹499</span>
                      <span className="text-gray-500 ml-1">/month</span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Billed monthly. Cancel anytime.
                    </p>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-green-100 rounded-full text-green-600">
                        <Zap className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Unlimited AI Summaries</div>
                        <p className="text-sm text-gray-600">Generate AI summaries for any pitch deck, anytime</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-blue-100 rounded-full text-blue-600">
                        <BadgeCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Advanced Filtering & Search</div>
                        <p className="text-sm text-gray-600">Find exactly what you need with powerful search tools</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-amber-100 rounded-full text-amber-600">
                        <Flame className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Early Access to New Features</div>
                        <p className="text-sm text-gray-600">Be the first to try new tools and capabilities</p>
                      </div>
                    </div>
                  </div>
                
                  <div className="bg-gray-50 rounded-xl p-4 flex items-center mb-6 border border-gray-100">
                    <Shield className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Secure payment processing via Razorpay</span>
                  </div>
                </div>
                
                {/* Right Side - Payment Form */}
                <div className="flex-1">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <Input
                        type="email"
                        id="email"
                        className="block w-full rounded-lg border-gray-200 focus:ring-primary focus:border-primary"
                        value={email}
                        disabled
                      />
                    </div>
                    
                    <Button 
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-white shadow-md" 
                      onClick={handlePayment}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>Upgrade Now - ₹499/month</>
                      )}
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      onClick={handleClose} 
                      disabled={isProcessing}
                      className="w-full font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    >
                      Maybe Later
                    </Button>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                      By upgrading, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
