import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTournamentSchema, insertHelpRequestSchema, insertAdminMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Check if referral code is valid (if provided)
      if (userData.referredBy) {
        const referrer = await storage.getUserByReferralCode(userData.referredBy);
        if (!referrer) {
          return res.status(400).json({ message: "Invalid referral code" });
        }
      }

      const user = await storage.createUser(userData);
      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          referralCode: user.referralCode,
          depositWallet: user.depositWallet,
          withdrawalWallet: user.withdrawalWallet,
          referralWallet: user.referralWallet 
        } 
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid registration data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          referralCode: user.referralCode,
          depositWallet: user.depositWallet,
          withdrawalWallet: user.withdrawalWallet,
          referralWallet: user.referralWallet 
        } 
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // User routes
  app.get("/api/user/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          referralCode: user.referralCode,
          depositWallet: user.depositWallet,
          withdrawalWallet: user.withdrawalWallet,
          referralWallet: user.referralWallet,
          totalEarned: user.totalEarned,
          totalReferrals: user.totalReferrals 
        } 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.get("/api/user/:id/stats", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const stats = await storage.getUserStats(userId);
      res.json({ stats });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  // Wallet routes
  app.post("/api/wallet/deposit", async (req, res) => {
    try {
      const { userId, amount } = req.body;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const currentDeposit = parseFloat(user.depositWallet);
      const newDeposit = (currentDeposit + parseFloat(amount)).toFixed(2);
      
      await storage.updateUserWallets(userId, newDeposit, user.withdrawalWallet, user.referralWallet);
      
      // Create transaction record
      await storage.createTransaction({
        userId,
        type: 'deposit',
        amount: amount,
        description: `Deposit of ₹${amount}`,
        referenceId: `DEP_${Date.now()}`,
      });

      // Handle referral commission if user was referred
      if (user.referredBy) {
        const referrer = await storage.getUserByReferralCode(user.referredBy);
        if (referrer) {
          const commission = (parseFloat(amount) * 0.07).toFixed(2); // 7% commission
          await storage.updateReferralStats(referrer.id, commission);
          
          await storage.createTransaction({
            userId: referrer.id,
            type: 'referral_bonus',
            amount: commission,
            description: `Referral commission from ${user.username}`,
            referenceId: `REF_${Date.now()}`,
          });
        }
      }

      res.json({ message: "Deposit successful", newBalance: newDeposit });
    } catch (error) {
      res.status(500).json({ message: "Deposit failed" });
    }
  });

  app.post("/api/wallet/withdraw", async (req, res) => {
    try {
      const { userId, amount } = req.body;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const currentWithdrawal = parseFloat(user.withdrawalWallet);
      const withdrawAmount = parseFloat(amount);
      
      if (currentWithdrawal < withdrawAmount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      const newWithdrawal = (currentWithdrawal - withdrawAmount).toFixed(2);
      
      await storage.updateUserWallets(userId, user.depositWallet, newWithdrawal, user.referralWallet);
      
      // Create transaction record
      await storage.createTransaction({
        userId,
        type: 'withdrawal',
        amount: `-${amount}`,
        description: `Withdrawal of ₹${amount}`,
        referenceId: `WTH_${Date.now()}`,
      });

      res.json({ message: "Withdrawal successful", newBalance: newWithdrawal });
    } catch (error) {
      res.status(500).json({ message: "Withdrawal failed" });
    }
  });

  // Game routes
  app.get("/api/games", async (req, res) => {
    try {
      const games = await storage.getAllGames();
      res.json({ games });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch games" });
    }
  });

  // Tournament routes
  app.get("/api/tournaments", async (req, res) => {
    try {
      const gameId = req.query.gameId ? parseInt(req.query.gameId as string) : null;
      
      const tournaments = gameId 
        ? await storage.getTournamentsByGame(gameId)
        : await storage.getAllTournaments();
        
      res.json({ tournaments });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tournaments" });
    }
  });

  app.post("/api/tournaments/join", async (req, res) => {
    try {
      const { tournamentId, userId } = req.body;
      
      const tournament = await storage.getTournament(tournamentId);
      const user = await storage.getUser(userId);
      
      if (!tournament || !user) {
        return res.status(404).json({ message: "Tournament or user not found" });
      }

      if (tournament.currentPlayers >= tournament.maxPlayers) {
        return res.status(400).json({ message: "Tournament is full" });
      }

      const entryFee = parseFloat(tournament.entryFee);
      const currentDeposit = parseFloat(user.depositWallet);
      const currentReferral = parseFloat(user.referralWallet);
      
      // Check if user has enough balance (can use both deposit and referral wallet)
      if (currentDeposit + currentReferral < entryFee) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      // Deduct entry fee (prioritize deposit wallet, then referral)
      let newDeposit = user.depositWallet;
      let newReferral = user.referralWallet;
      
      if (currentDeposit >= entryFee) {
        newDeposit = (currentDeposit - entryFee).toFixed(2);
      } else {
        newDeposit = "0.00";
        newReferral = (currentReferral - (entryFee - currentDeposit)).toFixed(2);
      }

      await storage.updateUserWallets(userId, newDeposit, user.withdrawalWallet, newReferral);

      // Create tournament entry
      const entry = await storage.joinTournament({
        tournamentId,
        userId,
        entryFee: tournament.entryFee,
      });

      // Create transaction record
      await storage.createTransaction({
        userId,
        type: 'tournament_entry',
        amount: `-${tournament.entryFee}`,
        description: `Tournament entry: ${tournament.name}`,
        referenceId: `TNT_${entry.id}`,
      });

      res.json({ message: "Successfully joined tournament", entry });
    } catch (error) {
      res.status(500).json({ message: "Failed to join tournament" });
    }
  });

  // Transaction routes
  app.get("/api/transactions/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const transactions = await storage.getUserTransactions(userId);
      res.json({ transactions });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Help routes
  app.post("/api/help", async (req, res) => {
    try {
      const helpData = insertHelpRequestSchema.parse(req.body);
      const helpRequest = await storage.createHelpRequest(helpData);
      res.json({ helpRequest });
    } catch (error) {
      res.status(400).json({ message: "Invalid help request data" });
    }
  });

  // Admin routes
  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json({ users });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/tournaments", async (req, res) => {
    try {
      const tournaments = await storage.getAllTournaments();
      res.json({ tournaments });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tournaments" });
    }
  });

  app.post("/api/admin/tournaments", async (req, res) => {
    try {
      const tournamentData = insertTournamentSchema.parse(req.body);
      const tournament = await storage.createTournament(tournamentData);
      res.json({ tournament });
    } catch (error) {
      res.status(400).json({ message: "Invalid tournament data" });
    }
  });

  app.get("/api/admin/help-requests", async (req, res) => {
    try {
      const helpRequests = await storage.getAllHelpRequests();
      res.json({ helpRequests });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch help requests" });
    }
  });

  app.put("/api/admin/help-requests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, adminResponse } = req.body;
      await storage.updateHelpRequest(id, status, adminResponse);
      res.json({ message: "Help request updated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update help request" });
    }
  });

  app.get("/api/admin/transactions", async (req, res) => {
    try {
      const transactions = await storage.getAllTransactions();
      res.json({ transactions });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post("/api/admin/messages", async (req, res) => {
    try {
      const messageData = insertAdminMessageSchema.parse(req.body);
      const message = await storage.createAdminMessage(messageData);
      res.json({ message });
    } catch (error) {
      res.status(400).json({ message: "Invalid message data" });
    }
  });

  app.get("/api/admin/messages", async (req, res) => {
    try {
      const messages = await storage.getActiveAdminMessages();
      res.json({ messages });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
