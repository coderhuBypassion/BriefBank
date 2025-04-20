import { IStorage } from './storage';

export declare class MongoDBStorage implements IStorage {
  constructor();
  initConnection(): Promise<void>;
  ensureConnected(): Promise<void>;
  
  // User operations
  getUser(id: number): Promise<any | undefined>;
  getUserByClerkId(clerkId: string): Promise<any | undefined>;
  createUser(userData: any): Promise<any>;
  updateUser(clerkId: string, data: any): Promise<any | undefined>;
  incrementUsedSummaries(clerkId: string): Promise<any | undefined>;
  upgradeUserToPro(clerkId: string): Promise<any | undefined>;
  
  // Deck operations
  getDeck(id: number): Promise<any | undefined>;
  getDecks(options?: {
    limit?: number;
    offset?: number;
    industry?: string;
    stage?: string;
    type?: string;
    sort?: string;
  }): Promise<any[]>;
  getFeaturedDecks(limit?: number): Promise<any[]>;
  createDeck(deckData: any): Promise<any>;
  updateDeckSummary(id: number, summary: any): Promise<any | undefined>;
  
  // Saved decks operations
  getSavedDecks(userId: string): Promise<any[]>;
  saveDeck(savedDeckData: any): Promise<any>;
  removeSavedDeck(userId: string, deckId: number): Promise<boolean>;
  isSavedDeck(userId: string, deckId: number): Promise<boolean>;
  
  // View history operations
  getRecentViews(userId: string, limit?: number): Promise<any[]>;
  recordView(viewData: any): Promise<any>;
  getViewCount(userId: string): Promise<number>;
  
  // Payment operations
  createPayment(paymentData: any): Promise<any>;
  updatePaymentStatus(orderId: string, paymentId: string, status: string): Promise<any | undefined>;
  getPayment(orderId: string): Promise<any | undefined>;
}

export declare const storage: MongoDBStorage;