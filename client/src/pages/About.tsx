
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Shield, Trophy, Users } from "lucide-react";

export default function About() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold gradient-text">About Kirda</h1>
        <p className="text-lg text-muted-foreground">
          India's Next-Gen Online Gaming Tournament Platform
        </p>
      </div>

      <Card className="bg-gray-850 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-accent" />
            Welcome to Kirda
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            At Kirda, we are passionate about eSports and committed to providing a fair and thrilling 
            experience to mobile gamers across India. We organize regular online tournaments for popular 
            games like Free Fire, BGMI, and more, allowing gamers to compete, win exciting prizes, and 
            build a career in competitive gaming.
          </p>
          
          <p className="text-muted-foreground leading-relaxed">
            Our platform is user-friendly and designed with gamers in mind. We offer an integrated wallet 
            system, instant tournament access, referral rewards, and 24x7 support for any issues. Whether 
            you are a casual gamer or a serious contender, Kirda is your destination to prove your skills 
            and earn real rewards.
          </p>

          <p className="text-muted-foreground leading-relaxed">
            We are a legally compliant Indian platform that strictly follows the guidelines of fair 
            gameplay, digital payments, and user privacy.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-850 border-border">
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 text-accent mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Secure Platform</h3>
            <p className="text-sm text-muted-foreground">
              100% secure transactions with encrypted data protection
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-850 border-border">
          <CardContent className="p-6 text-center">
            <Users className="w-12 h-12 text-accent mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Fair Play</h3>
            <p className="text-sm text-muted-foreground">
              Anti-cheat system ensuring fair gameplay for all participants
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-850 border-border">
          <CardContent className="p-6 text-center">
            <Trophy className="w-12 h-12 text-accent mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Real Rewards</h3>
            <p className="text-sm text-muted-foreground">
              Win real money and prizes in exciting gaming tournaments
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-850 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-6 h-6 text-accent" />
            Contact Us
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            For queries, reach out to us:
          </p>
          <Button variant="outline" className="w-full" onClick={() => window.location.href = 'mailto:support@kidra.in'}>
            <Mail className="w-4 h-4 mr-2" />
            support@kidra.in
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
