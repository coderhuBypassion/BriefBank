import {
  users,
  decks,
  savedDecks,
  views,
  payments,
  type User,
  type Deck,
  type SavedDeck,
  type View,
  type Payment,
  type InsertUser,
  type InsertDeck,
  type InsertSavedDeck,
  type InsertView,
  type InsertPayment,
  type AISummary
} from "@shared/schema";

// Storage interface for CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByClerkId(clerkId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
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
  createDeck(deck: InsertDeck): Promise<Deck>;
  updateDeckSummary(id: number, summary: AISummary): Promise<Deck | undefined>;
  
  // Saved decks operations
  getSavedDecks(userId: string): Promise<Deck[]>;
  saveDeck(savedDeck: InsertSavedDeck): Promise<SavedDeck>;
  removeSavedDeck(userId: string, deckId: number): Promise<boolean>;
  isSavedDeck(userId: string, deckId: number): Promise<boolean>;

  // View history operations
  getRecentViews(userId: string, limit?: number): Promise<Deck[]>;
  recordView(view: InsertView): Promise<View>;
  getViewCount(userId: string): Promise<number>;

  // Payment operations
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePaymentStatus(orderId: string, paymentId: string, status: string): Promise<Payment | undefined>;
  getPayment(orderId: string): Promise<Payment | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private clerkUserMap: Map<string, User>;
  private decks: Map<number, Deck>;
  private savedDecks: Map<number, SavedDeck>;
  private views: Map<number, View>;
  private payments: Map<number, Payment>;
  private currentUserId: number;
  private currentDeckId: number;
  private currentSavedDeckId: number;
  private currentViewId: number;
  private currentPaymentId: number;

  constructor() {
    this.users = new Map();
    this.clerkUserMap = new Map();
    this.decks = new Map();
    this.savedDecks = new Map();
    this.views = new Map();
    this.payments = new Map();
    this.currentUserId = 1;
    this.currentDeckId = 1;
    this.currentSavedDeckId = 1;
    this.currentViewId = 1;
    this.currentPaymentId = 1;

    // Initialize with sample decks
    this.initSampleData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByClerkId(clerkId: string): Promise<User | undefined> {
    return this.clerkUserMap.get(clerkId);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    this.clerkUserMap.set(user.clerkId, user);
    return user;
  }

  async updateUser(clerkId: string, data: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.clerkUserMap.get(clerkId);
    if (!user) return undefined;

    const updatedUser = { ...user, ...data };
    this.users.set(user.id, updatedUser);
    this.clerkUserMap.set(clerkId, updatedUser);
    return updatedUser;
  }

  async incrementUsedSummaries(clerkId: string): Promise<User | undefined> {
    const user = this.clerkUserMap.get(clerkId);
    if (!user) return undefined;

    const updatedUser = { ...user, usedSummaries: user.usedSummaries + 1 };
    this.users.set(user.id, updatedUser);
    this.clerkUserMap.set(clerkId, updatedUser);
    return updatedUser;
  }

  async upgradeUserToPro(clerkId: string): Promise<User | undefined> {
    const user = this.clerkUserMap.get(clerkId);
    if (!user) return undefined;

    const updatedUser = { ...user, isPro: true };
    this.users.set(user.id, updatedUser);
    this.clerkUserMap.set(clerkId, updatedUser);
    return updatedUser;
  }

  // Deck operations
  async getDeck(id: number): Promise<Deck | undefined> {
    return this.decks.get(id);
  }

  async getDecks(options: {
    limit?: number;
    offset?: number;
    industry?: string;
    stage?: string;
    type?: string;
    sort?: string;
  } = {}): Promise<Deck[]> {
    const { 
      limit = 10, 
      offset = 0, 
      industry, 
      stage, 
      type, 
      sort = 'newest' 
    } = options;
    
    let filteredDecks = Array.from(this.decks.values());
    
    // Apply filters
    if (industry) {
      filteredDecks = filteredDecks.filter(deck => deck.industry === industry);
    }
    
    if (stage) {
      filteredDecks = filteredDecks.filter(deck => deck.stage === stage);
    }
    
    if (type) {
      filteredDecks = filteredDecks.filter(deck => deck.type === type);
    }
    
    // Apply sorting
    if (sort === 'newest') {
      filteredDecks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else if (sort === 'oldest') {
      filteredDecks.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    } else if (sort === 'a-z') {
      filteredDecks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'z-a') {
      filteredDecks.sort((a, b) => b.title.localeCompare(a.title));
    }
    
    // Apply pagination
    return filteredDecks.slice(offset, offset + limit);
  }

  async getFeaturedDecks(limit: number = 3): Promise<Deck[]> {
    const allDecks = Array.from(this.decks.values());
    // For now, we'll just return the first few decks
    return allDecks.slice(0, limit);
  }

  async createDeck(insertDeck: InsertDeck): Promise<Deck> {
    const id = this.currentDeckId++;
    const deck: Deck = { 
      ...insertDeck, 
      id, 
      createdAt: new Date(),
    };
    this.decks.set(id, deck);
    return deck;
  }

  async updateDeckSummary(id: number, summary: AISummary): Promise<Deck | undefined> {
    const deck = this.decks.get(id);
    if (!deck) return undefined;

    const updatedDeck = { ...deck, aiSummary: summary };
    this.decks.set(id, updatedDeck);
    return updatedDeck;
  }

  // Saved decks operations
  async getSavedDecks(userId: string): Promise<Deck[]> {
    const savedDecksList = Array.from(this.savedDecks.values())
      .filter(saved => saved.userId === userId);
    
    return Promise.all(
      savedDecksList.map(saved => this.getDeck(saved.deckId))
    ).then(decks => decks.filter(deck => deck !== undefined) as Deck[]);
  }

  async saveDeck(insertSavedDeck: InsertSavedDeck): Promise<SavedDeck> {
    const id = this.currentSavedDeckId++;
    const savedDeck: SavedDeck = { 
      ...insertSavedDeck, 
      id, 
      createdAt: new Date() 
    };
    this.savedDecks.set(id, savedDeck);
    return savedDeck;
  }

  async removeSavedDeck(userId: string, deckId: number): Promise<boolean> {
    const savedDeckEntry = Array.from(this.savedDecks.entries())
      .find(([_, saved]) => saved.userId === userId && saved.deckId === deckId);
    
    if (savedDeckEntry) {
      const [id] = savedDeckEntry;
      this.savedDecks.delete(id);
      return true;
    }
    
    return false;
  }

  async isSavedDeck(userId: string, deckId: number): Promise<boolean> {
    return Array.from(this.savedDecks.values())
      .some(saved => saved.userId === userId && saved.deckId === deckId);
  }

  // View history operations
  async getRecentViews(userId: string, limit: number = 5): Promise<Deck[]> {
    const userViews = Array.from(this.views.values())
      .filter(view => view.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
      
    return Promise.all(
      userViews.map(view => this.getDeck(view.deckId))
    ).then(decks => decks.filter(deck => deck !== undefined) as Deck[]);
  }

  async recordView(insertView: InsertView): Promise<View> {
    const id = this.currentViewId++;
    const view: View = { 
      ...insertView, 
      id, 
      createdAt: new Date() 
    };
    this.views.set(id, view);
    return view;
  }

  async getViewCount(userId: string): Promise<number> {
    return Array.from(this.views.values())
      .filter(view => view.userId === userId)
      .length;
  }

  // Payment operations
  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = this.currentPaymentId++;
    const payment: Payment = { 
      ...insertPayment, 
      id, 
      createdAt: new Date() 
    };
    this.payments.set(id, payment);
    return payment;
  }

  async updatePaymentStatus(
    orderId: string, 
    paymentId: string, 
    status: string
  ): Promise<Payment | undefined> {
    const payment = Array.from(this.payments.values())
      .find(p => p.razorpayOrderId === orderId);
    
    if (!payment) return undefined;
    
    const updatedPayment = { 
      ...payment, 
      razorpayPaymentId: paymentId, 
      status 
    };
    this.payments.set(payment.id, updatedPayment);
    return updatedPayment;
  }

  async getPayment(orderId: string): Promise<Payment | undefined> {
    return Array.from(this.payments.values())
      .find(payment => payment.razorpayOrderId === orderId);
  }

  // Initialize sample data
  private initSampleData() {
    const sampleDecks: Omit<Deck, "id">[] = [
      {
        title: "Notion's Seed Pitch Deck",
        companyName: "Notion",
        industry: "SaaS",
        stage: "Series A",
        type: "Pitch Deck",
        fileUrl: "https://example.com/notion-deck.pdf",
        sourceUrl: "https://www.notion.so",
        aiSummary: {
          summary: [
            "Notion positions itself as an all-in-one workspace that replaces multiple productivity tools.",
            "The platform targets knowledge workers and teams with a collaborative, flexible document system.",
            "They show strong early traction with 100K+ users and 40% monthly growth prior to seeking seed funding.",
            "The business model is a freemium SaaS approach with personal and team subscription tiers."
          ],
          strengths: [
            "Unique positioning as an integrated workspace that replaces multiple tools",
            "Strong focus on user experience and design",
            "Clear revenue model with proven willingness to pay",
            "Impressive early user growth through word of mouth"
          ],
          weaknesses: [
            "Competing against established players (Evernote, Google Docs)",
            "Limited go-to-market strategy details",
            "High development costs needed for platform expansion",
            "Potential complexity overwhelming some users"
          ],
          fundingStage: "Seed to Series A"
        },
        highlights: [
          "All-in-one workspace",
          "40% monthly growth",
          "100K+ users"
        ],
        tags: ["productivity", "collaboration", "documents"],
        createdAt: new Date("2022-01-15"),
        year: 2022
      },
      {
        title: "Stripe's First Pitch Deck",
        companyName: "Stripe",
        industry: "FinTech",
        stage: "Seed",
        type: "Pitch Deck",
        fileUrl: "https://example.com/stripe-deck.pdf",
        sourceUrl: "https://stripe.com",
        aiSummary: {
          summary: [
            "Stripe's pitch centered on simplifying online payments for developers.",
            "The team identified a significant pain point in payment processing complexity.",
            "Their API-first approach allowed integration in minutes rather than weeks.",
            "The business model based on transaction fees aligned incentives with customer growth."
          ],
          strengths: [
            "Developer-focused approach with simple, well-documented API",
            "Clear market need and pain point identification",
            "Strong technical founding team with industry expertise",
            "Scalable business model with recurring revenue"
          ],
          weaknesses: [
            "Entering a highly regulated industry with significant compliance requirements",
            "Competing against established financial institutions",
            "Initial geographic limitations",
            "Customer acquisition dependent on developer adoption"
          ],
          fundingStage: "Seed"
        },
        highlights: [
          "7-line code integration",
          "Developer-first approach",
          "Transaction fee model"
        ],
        tags: ["payments", "api", "developers"],
        createdAt: new Date("2021-11-10"),
        year: 2021
      },
      {
        title: "Shopify Growth Strategy",
        companyName: "Shopify",
        industry: "E-commerce",
        stage: "Series B",
        type: "Pitch Deck",
        fileUrl: "https://example.com/shopify-deck.pdf",
        sourceUrl: "https://shopify.com",
        aiSummary: {
          summary: [
            "Shopify positioned itself as the operating system for independent retailers.",
            "The platform democratized e-commerce by providing enterprise tools to small businesses.",
            "Their growth strategy focused on expanding the merchant ecosystem through app marketplace.",
            "They demonstrated strong unit economics with increasing merchant lifetime value."
          ],
          strengths: [
            "Platform approach with strong ecosystem development",
            "Clear target market of underserved small to medium businesses",
            "Multiple revenue streams beyond subscription fees",
            "Strong retention metrics and growing ARPU"
          ],
          weaknesses: [
            "Dependency on small businesses which have high failure rates",
            "Competitive pressure from Amazon and other marketplaces",
            "Scaling customer support with merchant growth",
            "Balancing platform simplicity with feature expansion"
          ],
          fundingStage: "Series B"
        },
        highlights: [
          "Merchant ecosystem",
          "E-commerce democratization",
          "Multi-channel retail"
        ],
        tags: ["e-commerce", "retail", "platform"],
        createdAt: new Date("2023-02-22"),
        year: 2023
      }
    ];

    sampleDecks.forEach(deck => {
      const id = this.currentDeckId++;
      const completeDeck: Deck = { ...deck, id };
      this.decks.set(id, completeDeck);
    });
  }
}

export const storage = new MemStorage();
