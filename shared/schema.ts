import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  recoveryQuestion: text("recovery_question").notNull(),
  recoveryAnswer: text("recovery_answer").notNull(),
  referralCode: text("referral_code").notNull().unique(),
  referredBy: text("referred_by"),
  depositWallet: decimal("deposit_wallet", { precision: 10, scale: 2 }).default("0.00"),
  withdrawalWallet: decimal("withdrawal_wallet", { precision: 10, scale: 2 }).default("0.00"),
  referralWallet: decimal("referral_wallet", { precision: 10, scale: 2 }).default("0.00"),
  totalEarned: decimal("total_earned", { precision: 10, scale: 2 }).default("0.00"),
  totalReferrals: integer("total_referrals").default(0),
  tournamentsPlayed: integer("tournaments_played").default(0),
  wins: integer("wins").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  displayName: text("display_name").notNull(),
  icon: text("icon").notNull(),
  description: text("description").notNull(),
  isActive: boolean("is_active").default(true),
});

export const tournaments = pgTable("tournaments", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id").references(() => games.id).notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  entryFee: decimal("entry_fee", { precision: 10, scale: 2 }).notNull(),
  prizePool: decimal("prize_pool", { precision: 10, scale: 2 }).notNull(),
  maxPlayers: integer("max_players").notNull(),
  currentPlayers: integer("current_players").default(0),
  startTime: timestamp("start_time").notNull(),
  status: text("status").notNull().default("upcoming"), // upcoming, active, completed, cancelled
  rules: text("rules").notNull(),
  mapName: text("map_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tournamentEntries = pgTable("tournament_entries", {
  id: serial("id").primaryKey(),
  tournamentId: integer("tournament_id").references(() => tournaments.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  entryFee: decimal("entry_fee", { precision: 10, scale: 2 }).notNull(),
  position: integer("position"),
  prize: decimal("prize", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // deposit, withdrawal, tournament_entry, referral_bonus, prize
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, completed, failed
  description: text("description").notNull(),
  referenceId: text("reference_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const helpRequests = pgTable("help_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  tournamentId: text("tournament_id"),
  issueType: text("issue_type").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("open"), // open, in_progress, resolved
  adminResponse: text("admin_response"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const adminMessages = pgTable("admin_messages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  recoveryQuestion: true,
  recoveryAnswer: true,
  referredBy: true,
});

export const insertGameSchema = createInsertSchema(games).pick({
  name: true,
  displayName: true,
  icon: true,
  description: true,
});

export const insertTournamentSchema = createInsertSchema(tournaments).pick({
  gameId: true,
  name: true,
  description: true,
  entryFee: true,
  prizePool: true,
  maxPlayers: true,
  startTime: true,
  rules: true,
  mapName: true,
});

export const insertTournamentEntrySchema = createInsertSchema(tournamentEntries).pick({
  tournamentId: true,
  userId: true,
  entryFee: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  userId: true,
  type: true,
  amount: true,
  description: true,
  referenceId: true,
});

export const insertHelpRequestSchema = createInsertSchema(helpRequests).pick({
  userId: true,
  tournamentId: true,
  issueType: true,
  description: true,
});

export const insertAdminMessageSchema = createInsertSchema(adminMessages).pick({
  title: true,
  message: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;
export type InsertTournament = z.infer<typeof insertTournamentSchema>;
export type Tournament = typeof tournaments.$inferSelect;
export type InsertTournamentEntry = z.infer<typeof insertTournamentEntrySchema>;
export type TournamentEntry = typeof tournamentEntries.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertHelpRequest = z.infer<typeof insertHelpRequestSchema>;
export type HelpRequest = typeof helpRequests.$inferSelect;
export type InsertAdminMessage = z.infer<typeof insertAdminMessageSchema>;
export type AdminMessage = typeof adminMessages.$inferSelect;

// Extended types for API responses
export type TournamentWithGame = Tournament & { game: Game };
export type UserStats = {
  tournamentsPlayed: number;
  wins: number;
  winRate: string;
  totalEarned: string;
};
