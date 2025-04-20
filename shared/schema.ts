import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull(),
  usedSummaries: integer("used_summaries").notNull().default(0),
  isPro: boolean("is_pro").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const insertUserSchema = createInsertSchema(users).pick({
  clerkId: true,
  email: true,
  usedSummaries: true,
  isPro: true
});

// Pitch Deck schema
export const decks = pgTable("decks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  companyName: text("company_name").notNull(),
  industry: text("industry").notNull(),
  stage: text("stage").notNull(),
  type: text("type").notNull(),
  fileUrl: text("file_url").notNull(),
  sourceUrl: text("source_url"),
  aiSummary: jsonb("ai_summary"), // Will store the structured AI analysis
  highlights: jsonb("highlights"), // Will store an array of key insights
  tags: jsonb("tags"), // Will store an array of tags
  createdAt: timestamp("created_at").notNull().defaultNow(),
  year: integer("year"),
});

export const insertDeckSchema = createInsertSchema(decks).pick({
  title: true,
  companyName: true,
  industry: true,
  stage: true,
  type: true,
  fileUrl: true,
  sourceUrl: true,
  aiSummary: true,
  highlights: true,
  tags: true,
  year: true
});

// Saved Decks schema (for tracking user's saved decks)
export const savedDecks = pgTable("saved_decks", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.clerkId),
  deckId: integer("deck_id").notNull().references(() => decks.id),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const insertSavedDeckSchema = createInsertSchema(savedDecks).pick({
  userId: true,
  deckId: true
});

// Views schema (for tracking user's view history)
export const views = pgTable("views", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.clerkId),
  deckId: integer("deck_id").notNull().references(() => decks.id),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const insertViewSchema = createInsertSchema(views).pick({
  userId: true,
  deckId: true
});

// Payments schema (for tracking razorpay payments)
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.clerkId),
  razorpayOrderId: text("razorpay_order_id").notNull(),
  razorpayPaymentId: text("razorpay_payment_id"),
  amount: integer("amount").notNull(),
  status: text("status").notNull(), // "created", "paid", "failed"
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPaymentSchema = createInsertSchema(payments).pick({
  userId: true,
  razorpayOrderId: true,
  razorpayPaymentId: true,
  amount: true,
  status: true
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Deck = typeof decks.$inferSelect;
export type InsertDeck = z.infer<typeof insertDeckSchema>;

export type SavedDeck = typeof savedDecks.$inferSelect;
export type InsertSavedDeck = z.infer<typeof insertSavedDeckSchema>;

export type View = typeof views.$inferSelect;
export type InsertView = z.infer<typeof insertViewSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

// Define Structure for AI Summary
export const AISummarySchema = z.object({
  summary: z.array(z.string()),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  fundingStage: z.string()
});

export type AISummary = z.infer<typeof AISummarySchema>;
