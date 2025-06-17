import { useQuery } from "@tanstack/react-query";
import { Plus, ArrowUp, Gamepad2, Clock, Flame, Crosshair, Skull } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency } from "@/lib/utils";
import type { Game, Transaction } from "@shared/schema";

interface DashboardProps {
  onNavigate: (page: string, gameId?: number) => void;
  onDeposit: () => void;
  onWithdraw: () => void;
}

const gameIcons = {
  freefire: Flame,
  bgmi: Crosshair,
  codm: Skull,
};

export default function Dashboard({ onNavigate, onDeposit, onWithdraw }: DashboardProps) {
  const { user } = useAuth();

  const { data: gamesData } = useQuery<{ games: Game[] }>({
    queryKey: ['/api/games'],
  });

  const { data: transactionsData } = useQuery<{ transactions: Transaction[] }>({
    queryKey: [`/api/transactions/${user?.id}`],
    enabled: !!user?.id,
  });

  const games = gamesData?.games || [];
  const recentTransactions = transactionsData?.transactions?.slice(0, 3) || [];

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Wallet Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-gradient-to-br from-gray-850 to-gray-800 border-border">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1">Deposit</div>
            <div className="text-lg font-bold text-accent">
              {formatCurrency(user.depositWallet)}
            </div>
            <div className="text-xs text-muted-foreground">Entry Coins</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-gray-850 to-gray-800 border-border">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1">Withdrawal</div>
            <div className="text-lg font-bold text-primary">
              {formatCurrency(user.withdrawalWallet)}
            </div>
            <div className="text-xs text-muted-foreground">Cash</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-gray-850 to-gray-800 border-border">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1">Referral</div>
            <div className="text-lg font-bold text-warning">
              {formatCurrency(user.referralWallet)}
            </div>
            <div className="text-xs text-muted-foreground">Coins</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-3">
        <Button onClick={onDeposit} className="flex-1 gradient-accent">
          <Plus className="w-4 h-4 mr-2" />
          Deposit
        </Button>
        <Button onClick={onWithdraw} className="flex-1 gradient-gaming">
          <ArrowUp className="w-4 h-4 mr-2" />
          Withdraw
        </Button>
      </div>

      {/* Tournament Games Section */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Gamepad2 className="w-5 h-5 mr-2 text-primary" />
          Tournament Games
        </h2>
        
        <div className="space-y-3">
          {games.map((game) => {
            const IconComponent = gameIcons[game.name as keyof typeof gameIcons] || Gamepad2;
            
            return (
              <Card 
                key={game.id}
                className="bg-gradient-to-r from-gray-850 to-gray-800 border-border hover:border-primary transition-colors cursor-pointer"
                onClick={() => onNavigate('tournaments', game.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 gradient-gaming rounded-xl flex items-center justify-center mr-4">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{game.displayName}</h3>
                      <p className="text-sm text-muted-foreground">{game.description} • 5 Active Tournaments</p>
                    </div>
                    <div className="text-right">
                      <div className="text-accent font-semibold">₹50K+</div>
                      <div className="text-xs text-muted-foreground">Prize Pool</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-secondary" />
          Recent Activity
        </h2>
        
        <div className="space-y-3">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <Card key={transaction.id} className="bg-gray-850 border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-sm text-muted-foreground">
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
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-gray-850 border-border">
              <CardContent className="p-4 text-center text-muted-foreground">
                No recent activity
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Clock, Star, GamepadIcon } from "lucide-react";

interface DashboardProps {
  onNavigate: (page: string, gameId?: number) => void;
  onDeposit: () => void;
  onWithdraw: () => void;
}

export default function Dashboard({ onNavigate, onDeposit, onWithdraw }: DashboardProps) {
  const [games] = useState([
    { id: 1, name: "freefire", displayName: "Free Fire", icon: "🔥" },
    { id: 2, name: "bgmi", displayName: "BGMI", icon: "🎯" },
    { id: 3, name: "codmobile", displayName: "COD Mobile", icon: "⚔️" }
  ]);

  const [upcomingTournaments] = useState([
    {
      id: 1,
      title: "Free Fire Pro League",
      game: "Free Fire",
      entryFee: 50,
      prizePool: 5000,
      maxPlayers: 100,
      startTime: "2024-01-15T18:00:00Z",
      participants: 75
    },
    {
      id: 2,
      title: "BGMI Championship",
      game: "BGMI",
      entryFee: 100,
      prizePool: 10000,
      maxPlayers: 64,
      startTime: "2024-01-16T19:00:00Z",
      participants: 45
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold gradient-text">Welcome to Kirda</h1>
        <p className="text-muted-foreground">Join tournaments and win exciting prizes!</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gray-850 border-border">
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 text-accent mx-auto mb-2" />
            <div className="text-lg font-bold">0</div>
            <div className="text-sm text-muted-foreground">Tournaments Won</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-850 border-border">
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 text-accent mx-auto mb-2" />
            <div className="text-lg font-bold">₹0</div>
            <div className="text-sm text-muted-foreground">Total Winnings</div>
          </CardContent>
        </Card>
      </div>

      {/* Games Section */}
      <Card className="bg-gray-850 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GamepadIcon className="w-5 h-5 text-accent" />
            Popular Games
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {games.map((game) => (
              <Button
                key={game.id}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => onNavigate('tournaments', game.id)}
              >
                <div className="text-2xl">{game.icon}</div>
                <div className="text-xs text-center">{game.displayName}</div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Tournaments */}
      <Card className="bg-gray-850 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" />
            Upcoming Tournaments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingTournaments.map((tournament) => (
            <Card key={tournament.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-sm">{tournament.title}</h3>
                    <p className="text-xs text-muted-foreground">{tournament.game}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {tournament.participants}/{tournament.maxPlayers}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div className="space-y-1">
                    <div>Entry: ₹{tournament.entryFee}</div>
                    <div className="text-accent">Prize: ₹{tournament.prizePool}</div>
                  </div>
                  <Button size="sm" onClick={() => onNavigate('tournaments')}>
                    Join Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" onClick={() => onNavigate('wallet')}>
          <Users className="w-4 h-4 mr-2" />
          My Wallet
        </Button>
        <Button variant="outline" onClick={() => onNavigate('winners')}>
          <Trophy className="w-4 h-4 mr-2" />
          Recent Winners
        </Button>
      </div>
    </div>
  );
}
