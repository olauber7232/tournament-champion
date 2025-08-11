import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Users, 
  Trophy, 
  CreditCard, 
  MessageSquare, 
  Plus, 
  Settings,
  ArrowLeft,
  Calendar,
  DollarSign,
  Target,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { User, TournamentWithGame, Transaction, HelpRequest, Game } from "@shared/schema";

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  
  const [newTournament, setNewTournament] = useState({
    gameId: '',
    name: '',
    description: '',
    entryFee: '',
    prizePool: '',
    maxPlayers: '',
    startTime: '',
    rules: '',
    mapName: '',
    imageUrl: '',
  });
  
  const [broadcastMessage, setBroadcastMessage] = useState({
    title: '',
    message: '',
  });

  // Admin authentication check
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.username === 'govind' && loginData.password === 'govind@1234') {
      setIsAuthenticated(true);
      toast({ title: "Login successful!", description: "Welcome to admin panel" });
    } else {
      toast({ title: "Access denied", description: "Invalid admin credentials", variant: "destructive" });
    }
  };

  // Queries - moved here to be unconditional
  const { data: usersData } = useQuery<{ users: User[] }>({
    queryKey: ['/api/admin/users'],
    enabled: isAuthenticated,
  });

  const { data: tournamentsData } = useQuery<{ tournaments: TournamentWithGame[] }>({
    queryKey: ['/api/admin/tournaments'],
    enabled: isAuthenticated,
  });

  const { data: transactionsData } = useQuery<{ transactions: Transaction[] }>({
    queryKey: ['/api/admin/transactions'],
    enabled: isAuthenticated,
  });

  const { data: helpRequestsData } = useQuery<{ helpRequests: HelpRequest[] }>({
    queryKey: ['/api/admin/help-requests'],
    enabled: isAuthenticated,
  });

  const { data: gamesData } = useQuery<{ games: Game[] }>({
    queryKey: ['/api/games'],
    enabled: isAuthenticated,
  });

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-850 border-border">
          <CardHeader>
            <CardTitle className="text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={loginData.username}
                  onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter admin username"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <Button type="submit" className="w-full gradient-gaming">
                Login to Admin Panel
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mutations
  const createTournamentMutation = useMutation({
    mutationFn: async (tournamentData: any) => {
      const response = await apiRequest('POST', '/api/admin/tournaments', {
        ...tournamentData,
        gameId: parseInt(tournamentData.gameId),
        entryFee: tournamentData.entryFee,
        prizePool: tournamentData.prizePool,
        maxPlayers: parseInt(tournamentData.maxPlayers),
        startTime: new Date(tournamentData.startTime).toISOString(),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Tournament created!", description: "New tournament has been added" });
      setNewTournament({
        gameId: '',
        name: '',
        description: '',
        entryFee: '',
        prizePool: '',
        maxPlayers: '',
        startTime: '',
        rules: '',
        mapName: '',
        imageUrl: '',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/tournaments'] });
    },
    onError: (error: any) => {
      toast({ title: "Failed to create tournament", description: error.message, variant: "destructive" });
    },
  });

  const updateHelpRequestMutation = useMutation({
    mutationFn: async ({ id, status, adminResponse }: { id: number; status: string; adminResponse?: string }) => {
      const response = await apiRequest('PUT', `/api/admin/help-requests/${id}`, {
        status,
        adminResponse,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Help request updated", description: "Response sent to user" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/help-requests'] });
    },
    onError: (error: any) => {
      toast({ title: "Failed to update", description: error.message, variant: "destructive" });
    },
  });

  const broadcastMessageMutation = useMutation({
    mutationFn: async (messageData: typeof broadcastMessage) => {
      const response = await apiRequest('POST', '/api/admin/messages', messageData);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Message broadcast!", description: "Message sent to all users" });
      setBroadcastMessage({ title: '', message: '' });
    },
    onError: (error: any) => {
      toast({ title: "Failed to broadcast", description: error.message, variant: "destructive" });
    },
  });

  const users = usersData?.users || [];
  const tournaments = tournamentsData?.tournaments || [];
  const transactions = transactionsData?.transactions || [];
  const helpRequests = helpRequestsData?.helpRequests || [];
  const games = gamesData?.games || [];

  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTournament.gameId || !newTournament.name || !newTournament.entryFee) {
      toast({ title: "Missing information", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    createTournamentMutation.mutate(newTournament);
  };

  const handleUpdateHelpRequest = (id: number, status: string, adminResponse?: string) => {
    updateHelpRequestMutation.mutate({ id, status, adminResponse });
  };

  const handleBroadcastMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.title || !broadcastMessage.message) {
      toast({ title: "Missing information", description: "Please fill all fields", variant: "destructive" });
      return;
    }
    broadcastMessageMutation.mutate(broadcastMessage);
  };

  // Calculate stats
  const totalUsers = users.length;
  const totalDeposits = transactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const activeTournaments = tournaments.filter(t => t.status === 'upcoming').length;
  const pendingHelpRequests = helpRequests.filter(r => r.status === 'open').length;

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-gaming bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">Manage your tournament platform</p>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="gradient-gaming text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Users</p>
                  <p className="text-2xl font-bold">{totalUsers}</p>
                </div>
                <Users className="w-8 h-8 opacity-75" />
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-accent text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Deposits</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalDeposits.toString())}</p>
                </div>
                <CreditCard className="w-8 h-8 opacity-75" />
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-warning text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Active Tournaments</p>
                  <p className="text-2xl font-bold">{activeTournaments}</p>
                </div>
                <Trophy className="w-8 h-8 opacity-75" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-destructive text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Pending Help</p>
                  <p className="text-2xl font-bold">{pendingHelpRequests}</p>
                </div>
                <MessageSquare className="w-8 h-8 opacity-75" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="tournaments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-850">
            <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="help">Help Requests</TabsTrigger>
            <TabsTrigger value="broadcast">Broadcast</TabsTrigger>
          </TabsList>

          {/* Tournaments Tab */}
          <TabsContent value="tournaments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Tournament Management</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gradient-gaming">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Tournament
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Tournament</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateTournament} className="space-y-4">
                    <div>
                      <Label htmlFor="game">Game *</Label>
                      <Select onValueChange={(value) => setNewTournament(prev => ({ ...prev, gameId: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select game" />
                        </SelectTrigger>
                        <SelectContent>
                          {games.map(game => (
                            <SelectItem key={game.id} value={game.id.toString()}>
                              {game.displayName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="name">Tournament Name *</Label>
                      <Input
                        id="name"
                        value={newTournament.name}
                        onChange={(e) => setNewTournament(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Squad Championship"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={newTournament.description}
                        onChange={(e) => setNewTournament(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="e.g., 4v4 Squad Battle"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="entryFee">Entry Fee *</Label>
                        <Input
                          id="entryFee"
                          type="number"
                          value={newTournament.entryFee}
                          onChange={(e) => setNewTournament(prev => ({ ...prev, entryFee: e.target.value }))}
                          placeholder="50"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="prizePool">Prize Pool *</Label>
                        <Input
                          id="prizePool"
                          type="number"
                          value={newTournament.prizePool}
                          onChange={(e) => setNewTournament(prev => ({ ...prev, prizePool: e.target.value }))}
                          placeholder="5000"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="maxPlayers">Max Players *</Label>
                        <Input
                          id="maxPlayers"
                          type="number"
                          value={newTournament.maxPlayers}
                          onChange={(e) => setNewTournament(prev => ({ ...prev, maxPlayers: e.target.value }))}
                          placeholder="100"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="mapName">Map Name</Label>
                        <Input
                          id="mapName"
                          value={newTournament.mapName}
                          onChange={(e) => setNewTournament(prev => ({ ...prev, mapName: e.target.value }))}
                          placeholder="Bermuda"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="startTime">Start Time *</Label>
                      <Input
                        id="startTime"
                        type="datetime-local"
                        value={newTournament.startTime}
                        onChange={(e) => setNewTournament(prev => ({ ...prev, startTime: e.target.value }))}
                        min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="rules">Rules</Label>
                      <Textarea
                        id="rules"
                        rows={3}
                        value={newTournament.rules}
                        onChange={(e) => setNewTournament(prev => ({ ...prev, rules: e.target.value }))}
                        placeholder="Tournament rules and regulations..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="image">Tournament Banner Image</Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setNewTournament(prev => ({ ...prev, imageUrl: event.target?.result as string }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full gradient-gaming"
                      disabled={createTournamentMutation.isPending}
                    >
                      {createTournamentMutation.isPending ? "Creating..." : "Create Tournament"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {tournaments.map((tournament) => (
                <Card key={tournament.id} className="bg-gray-850 border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{tournament.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {tournament.game.displayName} • {tournament.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span>Entry: {formatCurrency(tournament.entryFee)}</span>
                          <span>Prize: {formatCurrency(tournament.prizePool)}</span>
                          <span>Players: {tournament.currentPlayers}/{tournament.maxPlayers}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={tournament.status === 'upcoming' ? 'default' : 'secondary'}>
                          {tournament.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(tournament.startTime)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <h2 className="text-xl font-semibold">User Management</h2>
            <div className="grid gap-4">
              {users.map((user) => (
                <Card key={user.id} className="bg-gray-850 border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{user.username}</h3>
                        <p className="text-sm text-muted-foreground">
                          Joined {formatDate(user.createdAt!)}
                        </p>
                        <div className="flex items-center space-x-4 text-sm mt-2">
                          <span>Deposit: {formatCurrency(user.depositWallet)}</span>
                          <span>Withdrawal: {formatCurrency(user.withdrawalWallet)}</span>
                          <span>Referral: {formatCurrency(user.referralWallet)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">
                          <span className="text-muted-foreground">Tournaments:</span> {user.tournamentsPlayed}
                        </p>
                        <p className="text-sm">
                          <span className="text-muted-foreground">Wins:</span> {user.wins}
                        </p>
                        <p className="text-sm">
                          <span className="text-muted-foreground">Referrals:</span> {user.totalReferrals}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <h2 className="text-xl font-semibold">Transaction History</h2>
            <div className="grid gap-4">
              {transactions.slice(0, 20).map((transaction) => (
                <Card key={transaction.id} className="bg-gray-850 border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(transaction.createdAt!)} • {transaction.type}
                        </p>
                        {transaction.referenceId && (
                          <p className="text-xs text-muted-foreground">
                            Ref: {transaction.referenceId}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          parseFloat(transaction.amount) > 0 ? 'text-accent' : 'text-destructive'
                        }`}>
                          {parseFloat(transaction.amount) > 0 ? '+' : ''}
                          {formatCurrency(transaction.amount)}
                        </p>
                        <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Help Requests Tab */}
          <TabsContent value="help" className="space-y-6">
            <h2 className="text-xl font-semibold">Help Requests</h2>
            <div className="grid gap-4">
              {helpRequests.map((request) => (
                <Card key={request.id} className="bg-gray-850 border-border">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{request.issueType}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(request.createdAt!)}
                            {request.tournamentId && ` • Tournament: ${request.tournamentId}`}
                          </p>
                        </div>
                        <Badge variant={request.status === 'open' ? 'destructive' : 'default'}>
                          {request.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm">{request.description}</p>
                      
                      {request.adminResponse && (
                        <div className="bg-gray-800 p-3 rounded-lg">
                          <p className="text-sm font-medium mb-1">Admin Response:</p>
                          <p className="text-sm text-muted-foreground">{request.adminResponse}</p>
                        </div>
                      )}
                      
                      {request.status === 'open' && (
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                Respond
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Respond to Help Request</DialogTitle>
                              </DialogHeader>
                              <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const response = formData.get('response') as string;
                                if (response) {
                                  handleUpdateHelpRequest(request.id, 'resolved', response);
                                }
                              }}>
                                <div className="space-y-4">
                                  <Textarea
                                    name="response"
                                    placeholder="Enter your response..."
                                    rows={4}
                                    required
                                  />
                                  <Button type="submit" className="w-full gradient-gaming">
                                    Send Response
                                  </Button>
                                </div>
                              </form>
                            </DialogContent>
                          </Dialog>
                          
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleUpdateHelpRequest(request.id, 'resolved')}
                          >
                            Mark Resolved
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Broadcast Tab */}
          <TabsContent value="broadcast" className="space-y-6">
            <h2 className="text-xl font-semibold">Broadcast Message</h2>
            <Card className="bg-gray-850 border-border">
              <CardContent className="p-6">
                <form onSubmit={handleBroadcastMessage} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Message Title *</Label>
                    <Input
                      id="title"
                      value={broadcastMessage.title}
                      onChange={(e) => setBroadcastMessage(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Important Announcement"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message Content *</Label>
                    <Textarea
                      id="message"
                      rows={6}
                      value={broadcastMessage.message}
                      onChange={(e) => setBroadcastMessage(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Enter your message to all users..."
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full gradient-gaming"
                    disabled={broadcastMessageMutation.isPending}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {broadcastMessageMutation.isPending ? "Sending..." : "Broadcast Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
