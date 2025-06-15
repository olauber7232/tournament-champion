import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Users, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { TournamentWithGame } from "@shared/schema";

interface TournamentsProps {
  gameId?: number;
  onBack: () => void;
}

export default function Tournaments({ gameId, onBack }: TournamentsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tournamentsData, isLoading } = useQuery<{ tournaments: TournamentWithGame[] }>({
    queryKey: ['/api/tournaments', { gameId }],
  });

  const joinTournamentMutation = useMutation({
    mutationFn: async (tournamentId: number) => {
      const response = await apiRequest('POST', '/api/tournaments/join', {
        tournamentId,
        userId: user?.id,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success!", description: "Successfully joined the tournament" });
      queryClient.invalidateQueries();
    },
    onError: (error: any) => {
      toast({ title: "Failed to join", description: error.message, variant: "destructive" });
    },
  });

  const tournaments = tournamentsData?.tournaments || [];
  const gameName = tournaments[0]?.game?.displayName || "Tournaments";

  const handleJoinTournament = (tournamentId: number) => {
    joinTournamentMutation.mutate(tournamentId);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-gray-850 border-border">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-gray-700 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-4">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">{gameName} Tournaments</h1>
          <p className="text-sm text-muted-foreground">
            {tournaments.length} active tournaments
          </p>
        </div>
      </div>

      {/* Tournament Cards */}
      <div className="space-y-4">
        {tournaments.length > 0 ? (
          tournaments.map((tournament) => (
            <Card key={tournament.id} className="bg-gradient-to-r from-gray-850 to-gray-800 border-border">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{tournament.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{tournament.description}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {tournament.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-accent font-bold text-lg">
                      {formatCurrency(tournament.prizePool)}
                    </div>
                    <div className="text-xs text-muted-foreground">Prize Pool</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Entry Fee:</span>
                    <span className="font-semibold ml-1">
                      {formatCurrency(tournament.entryFee)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Players:</span>
                    <span className="font-semibold ml-1">
                      {tournament.currentPlayers}/{tournament.maxPlayers}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Start Time:</span>
                    <span className="font-semibold ml-1">
                      {formatDate(tournament.startTime)}
                    </span>
                  </div>
                  {tournament.mapName && (
                    <div>
                      <span className="text-muted-foreground">Map:</span>
                      <span className="font-semibold ml-1">{tournament.mapName}</span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={() => handleJoinTournament(tournament.id)}
                    disabled={
                      joinTournamentMutation.isPending ||
                      tournament.currentPlayers >= tournament.maxPlayers ||
                      tournament.status !== 'upcoming'
                    }
                    className="flex-1 gradient-gaming"
                  >
                    {joinTournamentMutation.isPending
                      ? "Joining..."
                      : tournament.currentPlayers >= tournament.maxPlayers
                      ? "Tournament Full"
                      : tournament.status !== 'upcoming'
                      ? "Tournament Started"
                      : "Join Tournament"}
                  </Button>
                  <Button variant="outline" className="px-6">
                    Details
                  </Button>
                </div>

                {/* Tournament Rules */}
                {tournament.rules && (
                  <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                    <div className="text-sm font-medium mb-1">Rules:</div>
                    <div className="text-xs text-muted-foreground">{tournament.rules}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="bg-gray-850 border-border">
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <div className="text-lg font-medium mb-2">No tournaments available</div>
                <div className="text-sm">Check back later for new tournaments!</div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
