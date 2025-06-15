import { 
  users, games, tournaments, tournamentEntries, transactions, helpRequests, adminMessages,
  type User, type InsertUser, type Game, type InsertGame, type Tournament, type InsertTournament,
  type TournamentEntry, type InsertTournamentEntry, type Transaction, type InsertTransaction,
  type HelpRequest, type InsertHelpRequest, type AdminMessage, type InsertAdminMessage,
  type TournamentWithGame, type UserStats
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserWallets(userId: number, depositWallet: string, withdrawalWallet: string, referralWallet: string): Promise<void>;
  getUserStats(userId: number): Promise<UserStats>;
  getUserByReferralCode(referralCode: string): Promise<User | undefined>;
  
  // Game operations
  getAllGames(): Promise<Game[]>;
  getGame(id: number): Promise<Game | undefined>;
  createGame(game: InsertGame): Promise<Game>;
  
  // Tournament operations
  getTournamentsByGame(gameId: number): Promise<TournamentWithGame[]>;
  getAllTournaments(): Promise<TournamentWithGame[]>;
  getTournament(id: number): Promise<Tournament | undefined>;
  createTournament(tournament: InsertTournament): Promise<Tournament>;
  joinTournament(entry: InsertTournamentEntry): Promise<TournamentEntry>;
  getTournamentEntries(tournamentId: number): Promise<TournamentEntry[]>;
  getUserTournamentEntries(userId: number): Promise<TournamentEntry[]>;
  
  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getUserTransactions(userId: number): Promise<Transaction[]>;
  getAllTransactions(): Promise<Transaction[]>;
  
  // Help operations
  createHelpRequest(helpRequest: InsertHelpRequest): Promise<HelpRequest>;
  getAllHelpRequests(): Promise<HelpRequest[]>;
  updateHelpRequest(id: number, status: string, adminResponse?: string): Promise<void>;
  
  // Admin operations
  createAdminMessage(message: InsertAdminMessage): Promise<AdminMessage>;
  getActiveAdminMessages(): Promise<AdminMessage[]>;
  getAllUsers(): Promise<User[]>;
  
  // Referral operations
  updateReferralStats(userId: number, amount: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private games: Map<number, Game>;
  private tournaments: Map<number, Tournament>;
  private tournamentEntries: Map<number, TournamentEntry>;
  private transactions: Map<number, Transaction>;
  private helpRequests: Map<number, HelpRequest>;
  private adminMessages: Map<number, AdminMessage>;
  private currentUserId: number = 1;
  private currentGameId: number = 1;
  private currentTournamentId: number = 1;
  private currentEntryId: number = 1;
  private currentTransactionId: number = 1;
  private currentHelpRequestId: number = 1;
  private currentAdminMessageId: number = 1;

  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.tournaments = new Map();
    this.tournamentEntries = new Map();
    this.transactions = new Map();
    this.helpRequests = new Map();
    this.adminMessages = new Map();
    
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize default games
    const defaultGames = [
      { name: 'freefire', displayName: 'Free Fire', icon: 'fas fa-fire', description: 'Battle Royale', isActive: true },
      { name: 'bgmi', displayName: 'BGMI', icon: 'fas fa-crosshairs', description: 'Battle Royale', isActive: true },
      { name: 'codm', displayName: 'Call of Duty Mobile', icon: 'fas fa-skull', description: 'FPS', isActive: true },
    ];

    defaultGames.forEach(game => {
      const newGame: Game = { ...game, id: this.currentGameId++, createdAt: new Date() };
      this.games.set(newGame.id, newGame);
    });

    // Initialize sample tournaments
    const now = new Date();
    const sampleTournaments = [
      {
        gameId: 1,
        name: 'Squad Championship',
        description: '4v4 Squad Battle',
        entryFee: '50.00',
        prizePool: '5000.00',
        maxPlayers: 100,
        currentPlayers: 24,
        startTime: new Date(now.getTime() + 2 * 60 * 60 * 1000),
        status: 'upcoming',
        rules: 'No cheating, fair play only',
        mapName: 'Bermuda',
      },
      {
        gameId: 2,
        name: 'Solo Victory',
        description: 'Solo Battle Royale',
        entryFee: '30.00',
        prizePool: '3000.00',
        maxPlayers: 50,
        currentPlayers: 12,
        startTime: new Date(now.getTime() + 4 * 60 * 60 * 1000),
        status: 'upcoming',
        rules: 'Solo gameplay only',
        mapName: 'Erangel',
      },
    ];

    sampleTournaments.forEach(tournament => {
      const newTournament: Tournament = {
        ...tournament,
        id: this.currentTournamentId++,
        createdAt: new Date(),
      };
      this.tournaments.set(newTournament.id, newTournament);
    });
  }

  private generateReferralCode(): string {
    return 'KIRDA' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByReferralCode(referralCode: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.referralCode === referralCode);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const referralCode = this.generateReferralCode();
    const user: User = {
      ...insertUser,
      referredBy: insertUser.referredBy || null,
      id: this.currentUserId++,
      referralCode,
      depositWallet: '0.00',
      withdrawalWallet: '0.00',
      referralWallet: '0.00',
      totalEarned: '0.00',
      totalReferrals: 0,
      tournamentsPlayed: 0,
      wins: 0,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUserWallets(userId: number, depositWallet: string, withdrawalWallet: string, referralWallet: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.depositWallet = depositWallet;
      user.withdrawalWallet = withdrawalWallet;
      user.referralWallet = referralWallet;
      this.users.set(userId, user);
    }
  }

  async getUserStats(userId: number): Promise<UserStats> {
    const user = this.users.get(userId);
    if (!user) {
      return { tournamentsPlayed: 0, wins: 0, winRate: '0%', totalEarned: '0.00' };
    }

    const tournamentsPlayed = user.tournamentsPlayed || 0;
    const wins = user.wins || 0;
    const winRate = tournamentsPlayed > 0 
      ? Math.round((wins / tournamentsPlayed) * 100) + '%'
      : '0%';

    return {
      tournamentsPlayed,
      wins,
      winRate,
      totalEarned: user.totalEarned || '0.00',
    };
  }

  async getAllGames(): Promise<Game[]> {
    return Array.from(this.games.values()).filter(game => game.isActive);
  }

  async getGame(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const game: Game = {
      ...insertGame,
      id: this.currentGameId++,
      isActive: true,
      createdAt: new Date(),
    };
    this.games.set(game.id, game);
    return game;
  }

  async getTournamentsByGame(gameId: number): Promise<TournamentWithGame[]> {
    const tournaments = Array.from(this.tournaments.values())
      .filter(tournament => tournament.gameId === gameId);
    
    return tournaments.map(tournament => {
      const game = this.games.get(tournament.gameId)!;
      return { ...tournament, game };
    });
  }

  async getAllTournaments(): Promise<TournamentWithGame[]> {
    const tournaments = Array.from(this.tournaments.values());
    return tournaments.map(tournament => {
      const game = this.games.get(tournament.gameId)!;
      return { ...tournament, game };
    });
  }

  async getTournament(id: number): Promise<Tournament | undefined> {
    return this.tournaments.get(id);
  }

  async createTournament(insertTournament: InsertTournament): Promise<Tournament> {
    const tournament: Tournament = {
      ...insertTournament,
      mapName: insertTournament.mapName || null,
      id: this.currentTournamentId++,
      currentPlayers: 0,
      status: 'upcoming',
      createdAt: new Date(),
    };
    this.tournaments.set(tournament.id, tournament);
    return tournament;
  }

  async joinTournament(insertEntry: InsertTournamentEntry): Promise<TournamentEntry> {
    const entry: TournamentEntry = {
      ...insertEntry,
      id: this.currentEntryId++,
      position: null,
      prize: null,
      createdAt: new Date(),
    };
    this.tournamentEntries.set(entry.id, entry);

    // Update tournament player count
    const tournament = this.tournaments.get(insertEntry.tournamentId);
    if (tournament) {
      tournament.currentPlayers++;
      this.tournaments.set(tournament.id, tournament);
    }

    // Update user stats
    const user = this.users.get(insertEntry.userId);
    if (user) {
      user.tournamentsPlayed++;
      this.users.set(user.id, user);
    }

    return entry;
  }

  async getTournamentEntries(tournamentId: number): Promise<TournamentEntry[]> {
    return Array.from(this.tournamentEntries.values())
      .filter(entry => entry.tournamentId === tournamentId);
  }

  async getUserTournamentEntries(userId: number): Promise<TournamentEntry[]> {
    return Array.from(this.tournamentEntries.values())
      .filter(entry => entry.userId === userId);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const transaction: Transaction = {
      ...insertTransaction,
      referenceId: insertTransaction.referenceId || null,
      id: this.currentTransactionId++,
      status: 'completed',
      createdAt: new Date(),
    };
    this.transactions.set(transaction.id, transaction);
    return transaction;
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async createHelpRequest(insertHelpRequest: InsertHelpRequest): Promise<HelpRequest> {
    const helpRequest: HelpRequest = {
      ...insertHelpRequest,
      tournamentId: insertHelpRequest.tournamentId || null,
      id: this.currentHelpRequestId++,
      status: 'open',
      adminResponse: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.helpRequests.set(helpRequest.id, helpRequest);
    return helpRequest;
  }

  async getAllHelpRequests(): Promise<HelpRequest[]> {
    return Array.from(this.helpRequests.values())
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async updateHelpRequest(id: number, status: string, adminResponse?: string): Promise<void> {
    const helpRequest = this.helpRequests.get(id);
    if (helpRequest) {
      helpRequest.status = status;
      if (adminResponse) {
        helpRequest.adminResponse = adminResponse;
      }
      helpRequest.updatedAt = new Date();
      this.helpRequests.set(id, helpRequest);
    }
  }

  async createAdminMessage(insertMessage: InsertAdminMessage): Promise<AdminMessage> {
    const message: AdminMessage = {
      ...insertMessage,
      id: this.currentAdminMessageId++,
      isActive: true,
      createdAt: new Date(),
    };
    this.adminMessages.set(message.id, message);
    return message;
  }

  async getActiveAdminMessages(): Promise<AdminMessage[]> {
    return Array.from(this.adminMessages.values()).filter(message => message.isActive);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async updateReferralStats(userId: number, amount: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      const currentReferralWallet = parseFloat(user.referralWallet);
      const currentTotalEarned = parseFloat(user.totalEarned);
      const amountFloat = parseFloat(amount);
      
      user.referralWallet = (currentReferralWallet + amountFloat).toFixed(2);
      user.totalEarned = (currentTotalEarned + amountFloat).toFixed(2);
      user.totalReferrals++;
      this.users.set(userId, user);
    }
  }
}

export const storage = new MemStorage();
