// User type matching the MongoDB schema
export interface User {
  id: number;
  clerkId: string;
  email: string;
  usedSummaries: number;
  isPro: boolean;
  createdAt: string;
}

// Pitch deck type matching the MongoDB schema
export interface Deck {
  id: number;
  title: string;
  companyName: string;
  industry: string;
  stage: string;
  type: string;
  fileUrl: string;
  sourceUrl?: string;
  aiSummary?: AISummary;
  highlights?: string[];
  tags?: string[];
  createdAt: string;
  year?: number;
}

// AI Summary structure
export interface AISummary {
  summary: string[];
  strengths: string[];
  weaknesses: string[];
  fundingStage: string;
}

// Filter options for deck search
export interface DeckFilters {
  industry?: string;
  stage?: string;
  type?: string;
  sort?: 'newest' | 'oldest' | 'a-z' | 'z-a';
}

// Pagination metadata
export interface PaginationMeta {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

// Response types
export interface DeckListResponse {
  decks: Deck[];
  pagination: PaginationMeta;
}

export interface PaymentOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface PaymentVerifyResponse {
  success: boolean;
  user: User;
}

export interface UsageStatsType {
  usedSummaries: number;
  summaryLimit: number;
  isPro: boolean;
  viewedDecks: number;
  savedDecks: number;
  weeklyViews: number;
  weeklySaves: number;
}

// Industry options
export const industries = [
  "SaaS",
  "FinTech",
  "E-commerce",
  "Health Tech",
  "EdTech",
  "AI & ML",
  "Marketplace",
  "Hardware",
  "Consumer",
  "Mobile",
  "Other"
];

// Funding stage options
export const stages = [
  "Pre-Seed",
  "Seed",
  "Series A",
  "Series B",
  "Series C+",
  "Growth",
  "Exit"
];

// Deck type options
export const deckTypes = [
  "Pitch Deck",
  "Strategy Document",
  "Business Plan",
  "Investor Update",
  "Product Roadmap"
];
