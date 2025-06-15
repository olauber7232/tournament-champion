import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [paymentStatus, setPaymentStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  // Get order ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('order_id');

  const verifyPaymentMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const response = await apiRequest('POST', '/api/payment/verify', { orderId });
      return response.json();
    },
    onSuccess: (data) => {
      setPaymentDetails(data);
      if (data.success) {
        setPaymentStatus('success');
        toast({ title: "Payment successful!", description: "Funds have been added to your wallet" });
      } else {
        setPaymentStatus('failed');
        toast({ title: "Payment failed", description: data.message, variant: "destructive" });
      }
    },
    onError: () => {
      setPaymentStatus('failed');
      toast({ title: "Verification failed", description: "Please contact support if payment was deducted", variant: "destructive" });
    },
  });

  useEffect(() => {
    if (orderId && user) {
      // Verify payment status
      verifyPaymentMutation.mutate(orderId);
    } else if (!orderId) {
      setPaymentStatus('failed');
    }
  }, [orderId, user]);

  const handleGoToWallet = () => {
    setLocation('/wallet');
  };

  const handleGoToDashboard = () => {
    setLocation('/dashboard');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p>Please log in to view payment status</p>
            <Button onClick={() => setLocation('/auth')} className="mt-4">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto pt-8">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              {paymentStatus === 'verifying' && (
                <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
              )}
              {paymentStatus === 'success' && (
                <CheckCircle className="w-16 h-16 text-green-500" />
              )}
              {paymentStatus === 'failed' && (
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-500 text-2xl">✕</span>
                </div>
              )}
            </div>
            <CardTitle className="text-2xl">
              {paymentStatus === 'verifying' && 'Verifying Payment...'}
              {paymentStatus === 'success' && 'Payment Successful!'}
              {paymentStatus === 'failed' && 'Payment Failed'}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {paymentStatus === 'verifying' && (
              <div className="text-center text-muted-foreground">
                <p>Please wait while we verify your payment...</p>
                <p className="text-sm mt-2">This may take a few moments</p>
              </div>
            )}
            
            {paymentStatus === 'success' && paymentDetails && (
              <div className="space-y-3">
                <div className="text-center">
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(paymentDetails.amount || '0')} added to your wallet
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Transaction completed successfully
                  </p>
                </div>
                
                {orderId && (
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Order ID</p>
                    <p className="font-mono text-sm break-all">{orderId}</p>
                  </div>
                )}
              </div>
            )}
            
            {paymentStatus === 'failed' && (
              <div className="text-center">
                <p className="text-red-600 mb-2">Payment could not be processed</p>
                <p className="text-sm text-muted-foreground">
                  If money was deducted from your account, please contact our support team.
                </p>
                {orderId && (
                  <div className="bg-muted p-3 rounded-lg mt-3">
                    <p className="text-xs text-muted-foreground">Reference ID</p>
                    <p className="font-mono text-sm break-all">{orderId}</p>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex flex-col gap-3 pt-4">
              {paymentStatus === 'success' && (
                <Button onClick={handleGoToWallet} className="w-full gradient-accent">
                  View Wallet
                </Button>
              )}
              
              <Button 
                onClick={handleGoToDashboard} 
                variant={paymentStatus === 'success' ? 'outline' : 'default'}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}