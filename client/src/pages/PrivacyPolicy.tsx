
import { ArrowLeft, Shield, Eye, Database, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PrivacyPolicyProps {
  onBack: () => void;
}

export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-4">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: January 2024</p>
        </div>
      </div>

      {/* Privacy Sections */}
      <div className="space-y-4">
        <Card className="bg-gray-850 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="w-5 h-5" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              We collect information you provide directly to us, such as when you create an account, 
              participate in tournaments, or contact us for support.
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Account information (username, email, phone number)</li>
              <li>Payment information for deposits and withdrawals</li>
              <li>Game performance data and tournament results</li>
              <li>Device information and usage analytics</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gray-850 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Eye className="w-5 h-5" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              We use the information we collect to provide, maintain, and improve our gaming platform.
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Process tournament entries and distribute prizes</li>
              <li>Handle deposits, withdrawals, and referral rewards</li>
              <li>Send important notifications about tournaments and account activity</li>
              <li>Prevent fraud and ensure platform security</li>
              <li>Improve our services and user experience</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gray-850 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5" />
              Information Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction.
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>SSL encryption for all data transmission</li>
              <li>Secure payment processing through trusted partners</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal data by authorized personnel only</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gray-850 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserCheck className="w-5 h-5" />
              Your Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              You have certain rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Access and review your personal data</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your account and data</li>
              <li>Opt-out of marketing communications</li>
              <li>Data portability for your gaming history</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gray-850 border-border">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              For questions about this Privacy Policy, contact us at{" "}
              <span className="text-primary">privacy@kirdagaming.com</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
