
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw, Mail, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RefundPolicy() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold gradient-text">Refund Policy</h1>
        <p className="text-sm text-muted-foreground">Effective Date: December 2024</p>
      </div>

      <Card className="bg-gray-850 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-6 h-6 text-accent" />
            Our Refund Policy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed mb-4">
            At Kidra, we strive to offer a seamless and transparent experience to all our users. 
            Our Refund Policy outlines the conditions under which refunds are applicable for 
            tournament entries and deposits made on our platform.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card className="bg-gray-850 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              🧾 1. Tournament Entry Fees
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              Once a user successfully joins a tournament by paying the entry fee, the amount is 
              <strong className="text-destructive"> non-refundable</strong> under normal circumstances.
            </p>
            
            <div>
              <p className="text-muted-foreground mb-2">Entry fees will only be refunded if:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>The tournament is cancelled by the admin</li>
                <li>The match does not start due to technical errors or lack of participants</li>
                <li>The user is charged multiple times due to a system glitch (must provide proof)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-850 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              💸 2. Deposit Refunds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              All deposits are final and <strong className="text-destructive">non-refundable</strong>, 
              except in the following cases:
            </p>
            
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Double/multiple charges on the same transaction</li>
              <li>Failed transaction (amount debited but not credited to the wallet)</li>
            </ul>

            <div className="bg-gray-800 rounded-lg p-4 mt-4">
              <p className="text-sm text-muted-foreground mb-2">
                For such cases, users must contact support within <strong className="text-accent">48 hours</strong> and provide:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>UPI transaction ID</li>
                <li>Payment screenshot</li>
                <li>Registered username</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-850 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              🔁 3. Refund Method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground mb-2">Eligible refunds will be processed either:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>To the Deposit Wallet for in-app use, or</li>
              <li>To the original payment method, depending on the situation and user request</li>
            </ul>
            
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-semibold text-green-400">Processing Time</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Refunds are processed within <strong>3–7 business days</strong> after validation
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-850 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="w-6 h-6 text-destructive" />
              4. No Refunds in These Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>User voluntarily exits a tournament</li>
              <li>Disqualification due to rule violation, cheating, or abusive behavior</li>
              <li>Network issues or game crashes not caused by Kidra platform</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gray-850 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              📩 5. How to Request a Refund
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              To request a refund, email us with the following information:
            </p>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-accent">Required Information:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Your username</li>
                <li>Transaction ID</li>
                <li>Reason for refund</li>
                <li>Relevant proof (if applicable)</li>
              </ul>
            </div>

            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => window.location.href = 'mailto:support@kidra.in?subject=Refund Request'}
            >
              <Mail className="w-4 h-4 mr-2" />
              Email: support@kidra.in
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
