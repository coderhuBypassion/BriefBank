import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePayment } from "@/lib/clerk";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, Shield } from "lucide-react";

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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            {isCompleted ? (
              <>
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Upgrade Complete!
              </>
            ) : (
              <>Upgrade to BriefBank Pro</>
            )}
          </DialogTitle>
          <DialogDescription>
            {isCompleted
              ? "Thank you for upgrading. You now have unlimited access to all pitch deck summaries."
              : "You've used 3 of 3 free summaries. Upgrade to Pro for unlimited access to all pitch deck summaries and insights."}
          </DialogDescription>
        </DialogHeader>
        
        {isCompleted ? (
          <div className="flex flex-col items-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Successful</h3>
            <p className="text-gray-500 text-center mb-6">Enjoy unlimited access to all pitch deck summaries</p>
            <Button onClick={() => onOpenChange(false)}>
              Back to Dashboard
            </Button>
          </div>
        ) : (
          <>
            <div className="mt-4 border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="font-medium">BriefBank Pro Subscription</div>
                <div className="text-xl font-bold">₹499<span className="text-sm font-normal text-gray-500">/month</span></div>
              </div>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                  <span className="ml-2 text-sm text-gray-700">Unlimited AI-powered summaries</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                  <span className="ml-2 text-sm text-gray-700">Advanced search & filtering options</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                  <span className="ml-2 text-sm text-gray-700">Early access to new decks</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                  <span className="ml-2 text-sm text-gray-700">Cancel anytime</span>
                </li>
              </ul>
              
              <div className="bg-gray-50 rounded p-3 flex items-center mb-4">
                <Shield className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-sm text-gray-700">Secure payment via Razorpay</span>
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  type="email"
                  id="email"
                  className="mt-1 block w-full"
                  value={email}
                  disabled
                />
              </div>
              
              <Button 
                className="w-full" 
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Pay ₹499 Now</>
                )}
              </Button>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={handleClose} disabled={isProcessing}>
                Maybe Later
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
