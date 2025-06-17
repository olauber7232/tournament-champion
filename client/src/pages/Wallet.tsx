import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { History, Coins, Wallet as WalletIcon, Users, Plus, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/utils";
import type { Transaction } from "@shared/schema";

export default function Wallet() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const { data: transactionsData } = useQuery<{ transactions: Transaction[] }>({
    queryKey: [`/api/transactions/${user?.id}`],
    enabled: !!user?.id,
  });

  const createOrderMutation = useMutation({
    mutationFn: async (amount: string) => {
      const response = await apiRequest('POST', '/api/payment/create-order', {
        userId: user?.id,
        amount,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }
      return response.json();
    },
    onSuccess: async (data) => {
      try {
        // Store order ID for verification
        sessionStorage.setItem('pendingOrderId', data.orderId);
        
        // Initialize Cashfree SDK
        const cashfree = Cashfree({
          mode: "sandbox", // Change to "production" for live environment
        });
        
        // Create checkout options
        const checkoutOptions = {
          paymentSessionId: data.paymentSessionId,
          redirectTarget: "_self", // Stay on same tab
        };
        
        // Open Cashfree checkout
        cashfree.checkout(checkoutOptions).then((result: any) => {
          if (result.error) {
            console.error("Payment failed:", result.error);
            toast({ 
              title: "Payment failed", 
              description: result.error.message || "Payment could not be processed", 
              variant: "destructive" 
            });
          }
          if (result.redirect) {
            console.log("Payment completed, redirecting...");
          }
        });
        
        toast({ 
          title: "Payment initiated", 
          description: "Complete your payment in the checkout window" 
        });
      } catch (error: any) {
        console.error("Cashfree checkout error:", error);
        toast({ 
          title: "Checkout error", 
          description: "Failed to open payment window", 
          variant: "destructive" 
        });
      }
    },
    onError: (error: any) => {
      toast({ title: "Payment initiation failed", description: error.message, variant: "destructive" });
    },
  });

  const verifyPaymentMutation = useMutation({
    mutationFn: async (orderId: string) => {
      // Start verification immediately, then poll
      const response = await apiRequest('POST', '/api/payment/verify', { orderId });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({ title: "Payment successful!", description: "Funds added to your deposit wallet" });
        setDepositAmount('');
        setShowDepositModal(false);
        queryClient.invalidateQueries();
      } else {
        // If payment is not completed, show appropriate message
        toast({ 
          title: "Payment status", 
          description: data.message || "Please complete the payment process",
          variant: data.status === 'PENDING' ? "default" : "destructive"
        });
      }
    },
    onError: (error: any) => {
      toast({ 
        title: "Payment verification failed", 
        description: "Please try again or contact support if payment was deducted", 
        variant: "destructive" 
      });
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: async (data: { amount: string; bankAccount: string; ifsc: string; accountHolderName: string }) => {
      const response = await apiRequest('POST', '/api/wallet/withdraw', {
        userId: user?.id,
        ...data,
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({ 
        title: "Withdrawal request submitted!", 
        description: `Transfer ID: ${data.transferId}. Funds will be processed within 2-4 hours` 
      });
      setWithdrawAmount('');
      setBankAccount('');
      setIfsc('');
      setAccountHolderName('');
      setShowWithdrawModal(false);
      queryClient.invalidateQueries();
    },
    onError: (error: any) => {
      toast({ title: "Withdrawal failed", description: error.message, variant: "destructive" });
    },
  });

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseFloat(depositAmount) < 20) {
      toast({ title: "Invalid amount", description: "Minimum deposit is ₹20", variant: "destructive" });
      return;
    }
    createOrderMutation.mutate(depositAmount);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseFloat(withdrawAmount) < 100) {
      toast({ title: "Invalid amount", description: "Minimum withdrawal is ₹100", variant: "destructive" });
      return;
    }
    if (parseFloat(withdrawAmount) > parseFloat(user?.withdrawalWallet || '0')) {
      toast({ title: "Insufficient balance", description: "You don't have enough balance", variant: "destructive" });
      return;
    }
    if (!bankAccount || !ifsc || !accountHolderName) {
      toast({ title: "Missing bank details", description: "Please fill all bank details", variant: "destructive" });
      return;
    }
    withdrawMutation.mutate({ 
      amount: withdrawAmount, 
      bankAccount, 
      ifsc, 
      accountHolderName 
    });
  };

  const quickSelectAmount = (amount: string) => {
    setDepositAmount(amount);
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Wallet</h1>
        <Button variant="outline" size="sm">
          <History className="w-4 h-4 mr-2" />
          History
        </Button>
      </div>

      {/* Wallet Cards */}
      <div className="space-y-4">
        <Card className="gradient-accent text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Deposit Wallet</h3>
                <p className="text-sm opacity-90">For tournament entries</p>
              </div>
              <Coins className="w-8 h-8 opacity-75" />
            </div>
            <div className="text-3xl font-bold mb-4">
              {formatCurrency(user.depositWallet)}
            </div>
            
            <Dialog open={showDepositModal} onOpenChange={setShowDepositModal}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
                  Add Money
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Money</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleDeposit} className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Enter Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="20"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="Minimum ₹20"
                      required
                    />
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground mb-2">Quick Select</div>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => quickSelectAmount('100')}
                      >
                        ₹100
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => quickSelectAmount('500')}
                      >
                        ₹500
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => quickSelectAmount('1000')}
                      >
                        ₹1000
                      </Button>
                    </div>
                  </div>
                  
                  {depositAmount && (
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Amount:</span>
                        <span>{formatCurrency(depositAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">You'll receive:</span>
                        <span className="text-accent font-semibold">{depositAmount} Coins</span>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full gradient-accent" 
                    disabled={createOrderMutation.isPending || verifyPaymentMutation.isPending}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {createOrderMutation.isPending ? "Initiating Payment..." : 
                     verifyPaymentMutation.isPending ? "Verifying Payment..." : "Pay with Cashfree"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card className="gradient-gaming text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Withdrawal Wallet</h3>
                <p className="text-sm opacity-90">Your winnings</p>
              </div>
              <WalletIcon className="w-8 h-8 opacity-75" />
            </div>
            <div className="text-3xl font-bold mb-4">
              {formatCurrency(user.withdrawalWallet)}
            </div>
            
            <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                  Withdraw
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Withdraw Money</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleWithdraw} className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-sm text-muted-foreground mb-1">Available Balance</div>
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(user.withdrawalWallet)}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="withdrawAmount">Withdrawal Amount</Label>
                    <Input
                      id="withdrawAmount"
                      type="number"
                      min="100"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="Minimum ₹100"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="accountHolderName">Account Holder Name</Label>
                      <Input
                        id="accountHolderName"
                        type="text"
                        value={accountHolderName}
                        onChange={(e) => setAccountHolderName(e.target.value)}
                        placeholder="Enter account holder name"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="bankAccount">Bank Account Number</Label>
                      <Input
                        id="bankAccount"
                        type="text"
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                        placeholder="Enter bank account number"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="ifsc">IFSC Code</Label>
                      <Input
                        id="ifsc"
                        type="text"
                        value={ifsc}
                        onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                        placeholder="Enter IFSC code"
                        maxLength={11}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Processing Fee:</span>
                        <span>₹5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Processing Time:</span>
                        <span>2-4 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Method:</span>
                        <span>Bank Transfer (Cashfree)</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full gradient-gaming" 
                    disabled={withdrawMutation.isPending}
                  >
                    <ArrowUp className="w-4 h-4 mr-2" />
                    {withdrawMutation.isPending ? "Processing..." : "Withdraw via Cashfree"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card className="gradient-warning text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Referral Wallet</h3>
                <p className="text-sm opacity-90">Commission earnings</p>
              </div>
              <Users className="w-8 h-8 opacity-75" />
            </div>
            <div className="text-3xl font-bold mb-4">
              {formatCurrency(user.referralWallet)}
            </div>
            <div className="text-sm opacity-90">* Use only for tournaments</div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Limits */}
      <Card className="bg-gray-850 border-border">
        <CardHeader>
          <CardTitle>Transaction Limits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Minimum Deposit</span>
              <span>₹20</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Minimum Withdrawal</span>
              <span>₹100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Daily Withdrawal Limit</span>
              <span>₹50,000</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      {transactionsData && transactionsData.transactions.length > 0 && (
        <Card className="bg-gray-850 border-border">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactionsData.transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <div className="font-medium text-sm">{transaction.description}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(transaction.createdAt!).toLocaleDateString()}
                    </div>
                  </div>
                  <div className={`font-semibold ${
                    parseFloat(transaction.amount) > 0 ? 'text-accent' : 'text-destructive'
                  }`}>
                    {parseFloat(transaction.amount) > 0 ? '+' : ''}
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
