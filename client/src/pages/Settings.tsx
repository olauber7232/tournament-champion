import { ArrowLeft, FileText, Shield, DollarSign, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SettingsProps {
  onBack: () => void;
}

export default function Settings({ onBack }: SettingsProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-4 z-10">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-3">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">Settings</h1>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-20">
        {/* About Us */}
        <Card className="bg-gray-850 border-border">
          <CardHeader className="flex flex-row items-center space-y-0 pb-3">
            <Info className="w-5 h-5 mr-2 text-primary" />
            <CardTitle>About Us</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-40">
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Kirda Gaming Platform is India's premier tournament gaming destination where skill meets opportunity. 
                  We provide a secure and competitive environment for gamers to showcase their talents in popular 
                  mobile games like Free Fire, BGMI, and Call of Duty Mobile.
                </p>
                <p>
                  Founded with the vision of empowering Indian gamers, Kirda offers fair play tournaments, 
                  instant prize distribution, and a comprehensive referral system that rewards our community.
                </p>
                <p>
                  Join thousands of gamers who trust Kirda for competitive gaming and earning opportunities.
                </p>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Terms & Conditions */}
        <Card className="bg-gray-850 border-border">
          <CardHeader className="flex flex-row items-center space-y-0 pb-3">
            <FileText className="w-5 h-5 mr-2 text-accent" />
            <CardTitle>Terms & Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-40">
              <div className="space-y-3 text-sm text-muted-foreground">
                <p><strong>1. Eligibility:</strong> Users must be 18+ years old to participate in tournaments.</p>
                <p><strong>2. Fair Play:</strong> Use of hacks, cheats, or third-party software is strictly prohibited.</p>
                <p><strong>3. Tournament Rules:</strong> All participants must follow game-specific rules and guidelines.</p>
                <p><strong>4. Payments:</strong> Entry fees are non-refundable once tournament starts.</p>
                <p><strong>5. Prize Distribution:</strong> Prizes will be distributed within 24 hours of tournament completion.</p>
                <p><strong>6. Account Security:</strong> Users are responsible for maintaining account security.</p>
                <p><strong>7. Disputes:</strong> All disputes will be resolved by admin team decision.</p>
                <p><strong>8. Platform Usage:</strong> Misuse of platform may result in account suspension.</p>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Privacy Policy */}
        <Card className="bg-gray-850 border-border">
          <CardHeader className="flex flex-row items-center space-y-0 pb-3">
            <Shield className="w-5 h-5 mr-2 text-secondary" />
            <CardTitle>Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-40">
              <div className="space-y-3 text-sm text-muted-foreground">
                <p><strong>Data Collection:</strong> We collect minimal information necessary for platform operation.</p>
                <p><strong>Personal Information:</strong> Username, password, and recovery details are stored securely.</p>
                <p><strong>Payment Data:</strong> All payment information is processed through secure third-party gateways.</p>
                <p><strong>Game Data:</strong> Tournament participation and performance statistics are recorded.</p>
                <p><strong>Data Security:</strong> We use industry-standard encryption to protect user data.</p>
                <p><strong>Data Sharing:</strong> We do not share personal information with third parties.</p>
                <p><strong>Cookies:</strong> Essential cookies are used for platform functionality.</p>
                <p><strong>User Rights:</strong> Users can request data deletion by contacting support.</p>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Refund Policy */}
        <Card className="bg-gray-850 border-border">
          <CardHeader className="flex flex-row items-center space-y-0 pb-3">
            <DollarSign className="w-5 h-5 mr-2 text-warning" />
            <CardTitle>Refund Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-40">
              <div className="space-y-3 text-sm text-muted-foreground">
                <p><strong>Tournament Entry Fees:</strong> Non-refundable once tournament has started.</p>
                <p><strong>Cancelled Tournaments:</strong> Full refund if tournament is cancelled by platform.</p>
                <p><strong>Technical Issues:</strong> Refund available if technical problems prevent participation.</p>
                <p><strong>Wallet Deposits:</strong> Can be withdrawn as per withdrawal policy.</p>
                <p><strong>Processing Time:</strong> Approved refunds processed within 3-5 business days.</p>
                <p><strong>Refund Method:</strong> Refunds credited to original payment method or wallet.</p>
                <p><strong>Dispute Resolution:</strong> Contact support within 24 hours for refund requests.</p>
                <p><strong>Fair Play Violations:</strong> No refunds for accounts suspended due to violations.</p>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground pt-4">
          <p>© 2025 Kirda Gaming Platform. All rights reserved.</p>
          <p>Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}