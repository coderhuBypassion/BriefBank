import { IStorage } from './storage';

export class MongoDBStorage implements IStorage {
  constructor();
  initConnection(): Promise<void>;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByClerkId(clerkId: string): Promise<User | undefined>;
  createUser(userData: InsertUser): Promise<User>;
  updateUser(clerkId: string, data: Partial<InsertUser>): Promise<User | undefined>;
  incrementUsedSummaries(clerkId: string): Promise<User | undefined>;
  upgradeUserToPro(clerkId: string): Promise<User | undefined>;
  
  // Deck operations
  getDeck(id: number): Promise<Deck | undefined>;
  getDecks(options?: {
    limit?: number;
    offset?: number;
    industry?: string;
    stage?: string;
    type?: string;
    sort?: string;
  }): Promise<Deck[]>;
  getFeaturedDecks(limit?: number): Promise<Deck[]>;
  createDeck(deckData: InsertDeck): Promise<Deck>;
  updateDeckSummary(id: number, summary: AISummary): Promise<Deck | undefined>;
  
  // Saved decks operations
  getSavedDecks(userId: string): Promise<Deck[]>;
  saveDeck(savedDeckData: InsertSavedDeck): Promise<SavedDeck>;
  removeSavedDeck(userId: string, deckId: number): Promise<boolean>;
  isSavedDeck(userId: string, deckId: number): Promise<boolean>;
  
  // View history operations
  getRecentViews(userId: string, limit?: number): Promise<Deck[]>;
  recordView(viewData: InsertView): Promise<View>;
  getViewCount(userId: string): Promise<number>;
  
  // Payment operations
  createPayment(paymentData: InsertPayment): Promise<Payment>;
  updatePaymentStatus(orderId: string, paymentId: string, status: string): Promise<Payment | undefined>;
  getPayment(orderId: string): Promise<Payment | undefined>;
}

export const storage: MongoDBStorage;

import { 
  User, 
  InsertUser, 
  Deck, 
  InsertDeck, 
  SavedDeck, 
  InsertSavedDeck, 
  View, 
  InsertView, 
  Payment, 
  InsertPayment, 
  AISummary 
} from '@shared/schema';