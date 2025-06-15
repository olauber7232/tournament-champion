import { useQuery } from "@tanstack/react-query";
import { User, History, HelpCircle, Settings, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import type { UserStats } from "@shared/schema";

interface ProfileProps {
  onNavigate: (page: string) => void;
}

export default function Profile({ onNavigate }: ProfileProps) {
  const { user, logout } = useAuth();

  const { data: statsData } = useQuery<{ stats: UserStats }>({
    queryKey: [`/api/user/${user?.id}/stats`],
    enabled: !!user?.id,
  });

  const stats = statsData?.stats || {
    tournamentsPlayed: 0,
    wins: 0,
    winRate: '0%',
    totalEarned: '0.00',
  };

  const handleLogout = () => {
    logout();
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="gradient-gaming text-white">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.username}</h2>
              <p className="opacity-90">Member since Jan 2024</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gray-850 border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">{stats.tournamentsPlayed}</div>
            <div className="text-sm text-muted-foreground">Tournaments</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-850 border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">{stats.wins}</div>
            <div className="text-sm text-muted-foreground">Wins</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-850 border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.winRate}</div>
            <div className="text-sm text-muted-foreground">Win Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Menu */}
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full justify-between bg-gray-850 border-border hover:bg-gray-800"
          onClick={() => onNavigate('wallet')}
        >
          <div className="flex items-center">
            <History className="w-5 h-5 mr-3 text-primary" />
            <span>Transaction History</span>
          </div>
          <span>›</span>
        </Button>

        <Button
          variant="outline"
          className="w-full justify-between bg-gray-850 border-border hover:bg-gray-800"
          onClick={() => onNavigate('help')}
        >
          <div className="flex items-center">
            <HelpCircle className="w-5 h-5 mr-3 text-accent" />
            <span>Help & Support</span>
          </div>
          <span>›</span>
        </Button>

        <Button
          variant="outline"
          className="w-full justify-between bg-gray-850 border-border hover:bg-gray-800"
        >
          <div className="flex items-center">
            <Settings className="w-5 h-5 mr-3 text-muted-foreground" />
            <span>Settings</span>
          </div>
          <span>›</span>
        </Button>

        <Button
          variant="outline"
          className="w-full justify-between bg-gray-850 border-border hover:bg-gray-800"
        >
          <div className="flex items-center">
            <Shield className="w-5 h-5 mr-3 text-secondary" />
            <span>Privacy Policy</span>
          </div>
          <span>›</span>
        </Button>

        <Button
          onClick={handleLogout}
          className="w-full bg-destructive hover:bg-destructive/90 text-white font-semibold"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
      </div>

      {/* Additional Info */}
      <Card className="bg-gray-850 border-border">
        <CardContent className="p-4">
          <div className="text-center text-sm text-muted-foreground">
            <div className="mb-2">App Version 1.0.0</div>
            <div>© 2024 Kirda Gaming Platform</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
