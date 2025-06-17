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
      {/* Game Banners */}
      <div className="space-y-4">
        <Card className="bg-gradient-to-r from-orange-600 to-red-600 border-0 overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Free Fire Tournament</h3>
                <p className="text-orange-100 mb-3">Join the ultimate battle royale experience</p>
                <Button className="bg-white text-orange-600 hover:bg-orange-50">
                  Play Now
                </Button>
              </div>
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Flame className="w-10 h-10 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">BGMI Championship</h3>
                <p className="text-blue-100 mb-3">Battle for glory in intense squad matches</p>
                <Button className="bg-white text-blue-600 hover:bg-blue-50">
                  Join Battle
                </Button>
              </div>
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Crosshair className="w-10 h-10 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
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

