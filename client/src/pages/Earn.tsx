import { useState } from "react";
import { Share2, Copy, Check, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { copyToClipboard, shareReferralLink, formatCurrency } from "@/lib/utils";

const referralHistory = [
  {
    id: 1,
    username: "NewGamer456",
    joinedDate: "2 days ago",
    depositAmount: "500",
    commission: "35",
  },
  {
    id: 2,
    username: "ProPlayer789",
    joinedDate: "5 days ago",
    depositAmount: "1000",
    commission: "70",
  },
  {
    id: 3,
    username: "GamerX123",
    joinedDate: "1 week ago",
    depositAmount: "750",
    commission: "52.50",
  },
];

export default function Earn() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyReferralCode = async () => {
    if (!user?.referralCode) return;
    
    try {
      await copyToClipboard(user.referralCode);
      setCopied(true);
      toast({ title: "Copied!", description: "Referral code copied to clipboard" });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({ title: "Failed to copy", description: "Please try again", variant: "destructive" });
    }
  };

  const handleShareReferralLink = () => {
    if (!user?.referralCode) return;
    shareReferralLink(user.referralCode);
    toast({ title: "Shared!", description: "Referral link shared successfully" });
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">💰 Earn Money</h1>
        <p className="text-muted-foreground">Invite friends and earn commissions</p>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="gradient-accent text-white">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {formatCurrency(user.totalEarned || '0')}
            </div>
            <div className="text-sm opacity-90">Total Earned</div>
          </CardContent>
        </Card>
        
        <Card className="gradient-gaming text-white">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{user.totalReferrals || 0}</div>
            <div className="text-sm opacity-90">Total Referrals</div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Code Section */}
      <Card className="bg-gray-850 border-border">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Share2 className="w-5 h-5 mr-2 text-primary" />
            Your Referral Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-600 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">
                {user.referralCode}
              </div>
              <Button 
                onClick={handleCopyReferralCode}
                variant="outline"
                className="mr-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Code
                  </>
                )}
              </Button>
              <Button onClick={handleShareReferralLink} className="gradient-accent">
                <Share2 className="w-4 h-4 mr-2" />
                Share Link
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Commission Structure */}
      <Card className="bg-gray-850 border-border">
        <CardHeader>
          <CardTitle>Commission Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div>
                <div className="font-medium">Direct Referral (Commission A)</div>
                <div className="text-sm text-muted-foreground">When your friend deposits money</div>
              </div>
              <div className="text-accent font-bold text-xl">7%</div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div>
                <div className="font-medium">Team Commission (Commission B)</div>
                <div className="text-sm text-muted-foreground">From your team's deposits</div>
              </div>
              <div className="text-warning font-bold text-xl">2%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="bg-gray-850 border-border">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-secondary" />
            How It Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-white">
                1
              </div>
              <div>
                <div className="font-medium">Share Your Code</div>
                <div className="text-sm text-muted-foreground">
                  Share your unique referral code with friends
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-white">
                2
              </div>
              <div>
                <div className="font-medium">Friends Join & Deposit</div>
                <div className="text-sm text-muted-foreground">
                  When they register and make their first deposit
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-white">
                3
              </div>
              <div>
                <div className="font-medium">Earn Commission</div>
                <div className="text-sm text-muted-foreground">
                  Get 7% of their deposit amount as commission
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral History */}
      <Card className="bg-gray-850 border-border">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-accent" />
            Recent Referrals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {referralHistory.length > 0 ? (
              referralHistory.map((referral) => (
                <div key={referral.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div>
                    <div className="font-medium">{referral.username}</div>
                    <div className="text-sm text-muted-foreground">
                      Joined {referral.joinedDate} • Deposited {formatCurrency(referral.depositAmount)}
                    </div>
                  </div>
                  <div className="text-accent font-semibold">
                    +{formatCurrency(referral.commission)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <div>No referrals yet</div>
                <div className="text-sm">Start sharing your code to earn commissions!</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
