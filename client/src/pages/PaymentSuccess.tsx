import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | 'pending'>('pending');

  // Get order ID from URL params or session storage
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get("order_id") || sessionStorage.getItem('pendingOrderId');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!orderId) {
        setPaymentStatus('failed');
        setIsVerifying(false);
        return;
      }

      try {
        const response = await apiRequest('POST', '/api/payment/verify', { orderId });
        const data = await response.json();

        if (data.success) {
          setPaymentStatus('success');
          toast({ title: "Payment successful!", description: "Funds added to your deposit wallet" });
          // Clear pending order
          sessionStorage.removeItem('pendingOrderId');
        } else {
          setPaymentStatus('failed');
          toast({ title: "Payment failed", description: data.message || "Payment was not completed", variant: "destructive" });
        }
      } catch (error) {
        setPaymentStatus('failed');
        toast({ title: "Verification failed", description: "Unable to verify payment status", variant: "destructive" });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [orderId, toast]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Loader2 className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
            <CardTitle>Verifying Payment...</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Please wait while we verify your payment status.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {paymentStatus === "success" ? (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-green-600">Payment Successful!</CardTitle>
            </>
          ) : (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-red-600">Payment Failed</CardTitle>
            </>
          )}
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            {paymentStatus === "success" 
              ? "Your deposit has been processed successfully and added to your wallet!" 
              : "There was an issue processing your payment. If money was deducted, please contact support."}
          </p>
          <div className="space-y-2">
            <Button onClick={() => setLocation("/wallet")} className="w-full">
              Go to Wallet
            </Button>
            {paymentStatus === "failed" && (
              <Button variant="outline" onClick={() => setLocation("/help")} className="w-full">
                Contact Support
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}