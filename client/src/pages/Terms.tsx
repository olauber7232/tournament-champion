
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Terms() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold gradient-text">Terms & Conditions</h1>
        <p className="text-sm text-muted-foreground">Effective Date: December 2024</p>
      </div>

      <Card className="bg-gray-850 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-accent" />
            By using Kidra, you agree to the following terms and conditions:
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] w-full rounded-md border border-border p-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-accent">1. Eligibility</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Users must be 18 years or older to participate in paid tournaments.</li>
                  <li>Kidra reserves the right to ban users for fraudulent activity or policy violations.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-accent">2. Account Registration</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>All users must provide valid information while registering.</li>
                  <li>Each user can have only one account.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-accent">3. Wallet System</h3>
                <p className="text-muted-foreground mb-2">Kidra provides three separate wallets:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Deposit Wallet (for tournament entry)</li>
                  <li>Withdrawal Wallet (for prize winnings)</li>
                  <li>Referral Wallet (bonus coins; not withdrawable)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-accent">4. Deposits & Withdrawals</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>All payments are processed via secure UPI gateways.</li>
                  <li>Minimum deposit is ₹20.</li>
                  <li>Withdrawals are processed within 48 working hours and are subject to verification.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-accent">5. Referral System</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Users can earn bonus coins through referrals.</li>
                  <li>Referral bonuses are non-withdrawable and can only be used to join tournaments.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-accent">6. Game Rules</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Each tournament will have its own set of rules mentioned in the tournament section.</li>
                  <li>Players must strictly follow the rules or risk disqualification.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-accent">7. Cancellation & Refund</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Entry fees are non-refundable once a user joins a tournament.</li>
                  <li>In case of technical failure or match cancellation, Kidra will refund the amount to the deposit wallet.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-accent">8. Abuse & Misconduct</h3>
                <p className="text-muted-foreground">
                  Any form of cheating, foul play, or abuse will result in permanent account suspension.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-accent">9. Limitation of Liability</h3>
                <p className="text-muted-foreground">
                  Kidra is not liable for any game-related technical issues or disconnections from third-party gaming platforms.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-accent">10. Changes to Terms</h3>
                <p className="text-muted-foreground">
                  Kidra reserves the right to update these terms without prior notice.
                </p>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="bg-gray-850 border-border">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground mb-4">
            For help or disputes, contact:
          </p>
          <Button variant="outline" onClick={() => window.location.href = 'mailto:support@kidra.in'}>
            <Mail className="w-4 h-4 mr-2" />
            support@kidra.in
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
