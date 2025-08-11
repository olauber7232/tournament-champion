import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Clock, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Game, TournamentWithGame, User } from "@shared/schema";

interface DashboardProps {
  onNavigate: (page: string, gameId?: number) => void;
  onDeposit: () => void;
  onWithdraw: () => void;
}

export default function Dashboard({ onNavigate, onDeposit, onWithdraw }: DashboardProps) {
  const userId = parseInt(localStorage.getItem('userId') || '0');

  const { data: userData } = useQuery<{ user: User }>({
    queryKey: ['/api/user', userId],
  });

  const { data: gamesData } = useQuery<{ games: Game[] }>({
    queryKey: ['/api/games'],
  });

  const { data: tournamentsData } = useQuery<{ tournaments: TournamentWithGame[] }>({
    queryKey: ['/api/tournaments'],
  });

  const user = userData?.user;
  const games = gamesData?.games || [];
  const tournaments = tournamentsData?.tournaments || [];

  const onGameSelect = (gameId: number) => {
    onNavigate('tournaments', gameId);
  };

  const totalWalletBalance = user 
    ? (parseFloat(user.depositWallet || '0') + parseFloat(user.withdrawalWallet || '0')).toFixed(2)
    : '0.00';

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.username || 'Player'}! 🎮
        </h1>
        <p className="text-muted-foreground">Ready to dominate the leaderboards?</p>
      </div>

      {/* Wallet Overview */}
      <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Total Balance</h3>
              <div className="text-3xl font-bold text-accent">
                {formatCurrency(parseFloat(totalWalletBalance))}
              </div>
              <div className="flex items-center space-x-4 mt-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Deposit: </span>
                  <span className="font-semibold">{formatCurrency(parseFloat(user?.depositWallet || '0'))}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Winnings: </span>
                  <span className="font-semibold">{formatCurrency(parseFloat(user?.withdrawalWallet || '0'))}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <Button onClick={onDeposit} className="gradient-gaming">
                Add Money
              </Button>
              <Button 
                variant="outline" 
                onClick={onWithdraw}
                className="border-accent text-accent hover:bg-accent hover:text-white"
              >
                Withdraw
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gray-850 border-border">
          <CardContent className="p-4 text-center">
            <Trophy className="w-6 h-6 text-accent mx-auto mb-2" />
            <div className="text-lg font-semibold">0</div>
            <div className="text-xs text-muted-foreground">Wins</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-850 border-border">
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-lg font-semibold">{user?.totalReferrals || 0}</div>
            <div className="text-xs text-muted-foreground">Referrals</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-850 border-border">
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <div className="text-lg font-semibold">{tournaments.filter(t => t.status === 'upcoming').length}</div>
            <div className="text-xs text-muted-foreground">Live</div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Tournament Games with Photos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">🎮 Tournament Games</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onNavigate('tournaments')}
            className="text-accent hover:text-accent"
          >
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {games.map((game) => {
            const gameImage = getGameImage(game.name);
            const activeTournaments = tournaments.filter(t => t.gameId === game.id && t.status === 'upcoming').length;
            
            return (
              <Card 
                key={game.id} 
                className="bg-gray-850 border-border cursor-pointer hover:bg-gray-800 transition-all duration-300 overflow-hidden group"
                onClick={() => onGameSelect(game.id)}
              >
                <div className="relative">
                  {/* Game Banner Image */}
                  <div 
                    className="h-32 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center relative overflow-hidden"
                    style={{
                      backgroundImage: `linear-gradient(135deg, rgba(147, 51, 234, 0.8), rgba(37, 99, 235, 0.8)), url(${gameImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="text-4xl">{game.icon}</div>
                    
                    {/* Active Tournament Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-600 hover:bg-green-700 text-white">
                        {activeTournaments} Active
                      </Badge>
                    </div>
                    
                    {/* Prize Pool Badge */}
                    <div className="absolute bottom-3 left-3">
                      <Badge className="bg-black/60 backdrop-blur-sm text-white border-0">
                        ₹50k+ Prize Pool
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-accent transition-colors">
                        {game.displayName}
                      </h3>
                      <p className="text-sm text-muted-foreground">{game.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Upcoming Tournaments */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">⚡ Starting Soon</h2>
        <div className="space-y-3">
          {tournaments
            .filter(t => t.status === 'upcoming')
            .slice(0, 3)
            .map((tournament) => (
              <Card key={tournament.id} className="bg-gray-850 border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-xl">
                        {games.find(g => g.id === tournament.gameId)?.icon || '🎮'}
                      </div>
                      <div>
                        <h4 className="font-medium">{tournament.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Entry: {formatCurrency(parseFloat(tournament.entryFee))} • 
                          Prize: {formatCurrency(parseFloat(tournament.prizePool))}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="border-green-500 text-green-500">
                        {tournament.currentPlayers || 0}/{tournament.maxPlayers} Players
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}

function getGameImage(gameName: string): string {
  const gameImages = {
    'freefire': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=200&fit=crop',
    'bgmi': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop',
    'codmobile': 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=200&fit=crop'
  };
  
  return gameImages[gameName as keyof typeof gameImages] || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=200&fit=crop';
}