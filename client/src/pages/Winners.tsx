import { Trophy, Medal, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const winners = [
  {
    id: 1,
    position: 1,
    username: "GamerPro2024",
    tournament: "Free Fire Championship",
    prize: "15000",
    icon: Trophy,
    color: "gradient-warning",
  },
  {
    id: 2,
    position: 2,
    username: "SnipeKing",
    tournament: "BGMI Squad Battle",
    prize: "8500",
    icon: Medal,
    color: "bg-gray-400",
  },
  {
    id: 3,
    position: 3,
    username: "FlashGamer",
    tournament: "COD Mobile Tournament",
    prize: "5000",
    icon: Award,
    color: "bg-orange-500",
  },
];

const recentWinners = [
  {
    id: 1,
    username: "ProGamer123",
    tournament: "Free Fire Solo",
    prize: "2500",
    timeAgo: "2 hours ago",
  },
  {
    id: 2,
    username: "QuickShot",
    tournament: "BGMI Duo",
    prize: "1800",
    timeAgo: "4 hours ago",
  },
  {
    id: 3,
    username: "NinjaGamer",
    tournament: "COD Mobile",
    prize: "1200",
    timeAgo: "6 hours ago",
  },
];

export default function Winners() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">🏆 Winners</h1>
        <p className="text-muted-foreground">Top performers this week</p>
      </div>

      {/* Leaderboard */}
      <div className="space-y-3">
        {winners.map((winner) => {
          const Icon = winner.icon;
          
          return (
            <Card key={winner.id} className="bg-gradient-to-r from-gray-850 to-gray-800 border-border">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className={`w-12 h-12 ${winner.color} rounded-full flex items-center justify-center mr-4 text-white font-bold`}>
                    #{winner.position}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{winner.username}</div>
                    <div className="text-sm text-muted-foreground">{winner.tournament}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-accent font-bold">₹{Number(winner.prize).toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Won</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Winners */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Tournament Winners</h2>
        <div className="space-y-3">
          {recentWinners.map((winner) => (
            <Card key={winner.id} className="bg-gray-850 border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{winner.username}</div>
                    <div className="text-sm text-muted-foreground">
                      {winner.tournament} • {winner.timeAgo}
                    </div>
                  </div>
                  <div className="text-accent font-semibold">
                    ₹{Number(winner.prize).toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Achievement Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gray-850 border-border">
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 text-warning mx-auto mb-2" />
            <div className="text-2xl font-bold">247</div>
            <div className="text-sm text-muted-foreground">Total Winners</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-850 border-border">
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold">₹2.5L</div>
            <div className="text-sm text-muted-foreground">Total Prizes</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
