import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./mongodb-storage";
import { requireAuth, getAuthUser } from "./lib/clerk";
import { openAIService } from "./lib/openai";
import { pdfService } from "./lib/pdf";
import { razorpayService } from "./lib/razorpay";
import { z } from "zod";
import { insertUserSchema, insertSavedDeckSchema } from "@shared/schema";

// Fee amount in INR (499)
const PRO_SUBSCRIPTION_AMOUNT = 49900;
// Summary limit for free users
const FREE_SUMMARY_LIMIT = 3;

export async function registerRoutes(app: Express): Promise<Server> {
  // === Auth Routes ===
  
  // Get current user data
  app.get("/api/me", requireAuth, async (req: Request, res: Response) => {
    try {
      const authUser = getAuthUser(req);
      if (!authUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const user = await storage.getUserByClerkId(authUser.id);
      
      if (!user) {
        // Create new user if first time login
        const newUser = await storage.createUser({
          clerkId: authUser.id,
          email: authUser.email,
          usedSummaries: 0,
          isPro: false
        });
        
        return res.json(newUser);
      }
      
      return res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // === Deck Routes ===
  
  // Get list of decks with filtering
  app.get("/api/decks", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const industry = req.query.industry as string | undefined;
      const stage = req.query.stage as string | undefined;
      const type = req.query.type as string | undefined;
      const sort = req.query.sort as string | undefined;
      
      const decks = await storage.getDecks({
        limit,
        offset,
        industry,
        stage,
        type,
        sort
      });
      
      return res.json(decks);
    } catch (error) {
      console.error("Error fetching decks:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get featured decks for homepage
  app.get("/api/decks/featured", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      
      const decks = await storage.getFeaturedDecks(limit);
      
      return res.json(decks);
    } catch (error) {
      console.error("Error fetching featured decks:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get single deck by ID
  app.get("/api/deck/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid deck ID" });
      }
      
      const deck = await storage.getDeck(id);
      
      if (!deck) {
        return res.status(404).json({ message: "Deck not found" });
      }
      
      // If user is logged in, record this view
      const authUser = getAuthUser(req);
      if (authUser) {
        await storage.recordView({
          userId: authUser.id,
          deckId: id
        });
      }
      
      return res.json(deck);
    } catch (error) {
      console.error("Error fetching deck:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Generate summary for a deck
  app.post("/api/summarize/:deckId", requireAuth, async (req: Request, res: Response) => {
    try {
      const deckId = parseInt(req.params.deckId);
      
      if (isNaN(deckId)) {
        return res.status(400).json({ message: "Invalid deck ID" });
      }
      
      const authUser = getAuthUser(req);
      if (!authUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const user = await storage.getUserByClerkId(authUser.id);
      
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      // Check if user can access summary (either Pro or within free limit)
      if (!user.isPro && user.usedSummaries >= FREE_SUMMARY_LIMIT) {
        return res.status(402).json({ 
          message: "Free summary limit reached. Please upgrade to Pro.",
          summariesUsed: user.usedSummaries,
          summaryLimit: FREE_SUMMARY_LIMIT,
          isPro: user.isPro
        });
      }
      
      const deck = await storage.getDeck(deckId);
      
      if (!deck) {
        return res.status(404).json({ message: "Deck not found" });
      }
      
      // If the deck already has a summary, return it without incrementing count
      if (deck.aiSummary) {
        return res.json({
          summary: deck.aiSummary,
          summariesUsed: user.usedSummaries,
          summaryLimit: FREE_SUMMARY_LIMIT,
          isPro: user.isPro
        });
      }
      
      // Extract text from PDF
      const pdfText = await pdfService.extractTextFromPDF(deck.fileUrl);
      
      // Generate AI summary
      const aiSummary = await openAIService.summarizePitchDeck(pdfText);
      
      // Update deck with summary
      const updatedDeck = await storage.updateDeckSummary(deckId, aiSummary);
      
      // Increment user's used summaries count
      const updatedUser = await storage.incrementUsedSummaries(user.clerkId);
      
      return res.json({
        summary: aiSummary,
        summariesUsed: updatedUser?.usedSummaries || user.usedSummaries + 1,
        summaryLimit: FREE_SUMMARY_LIMIT,
        isPro: user.isPro
      });
    } catch (error) {
      console.error("Error generating summary:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Save a deck (bookmark)
  app.post("/api/deck/:id/save", requireAuth, async (req: Request, res: Response) => {
    try {
      const deckId = parseInt(req.params.id);
      
      if (isNaN(deckId)) {
        return res.status(400).json({ message: "Invalid deck ID" });
      }
      
      const authUser = getAuthUser(req);
      if (!authUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Validate deck exists
      const deck = await storage.getDeck(deckId);
      if (!deck) {
        return res.status(404).json({ message: "Deck not found" });
      }
      
      // Check if already saved
      const alreadySaved = await storage.isSavedDeck(authUser.id, deckId);
      if (alreadySaved) {
        return res.status(409).json({ message: "Deck already saved" });
      }
      
      // Save the deck
      const savedDeckData = insertSavedDeckSchema.parse({
        userId: authUser.id,
        deckId
      });
      
      const savedDeck = await storage.saveDeck(savedDeckData);
      
      return res.status(201).json(savedDeck);
    } catch (error) {
      console.error("Error saving deck:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Unsave a deck (remove bookmark)
  app.delete("/api/deck/:id/save", requireAuth, async (req: Request, res: Response) => {
    try {
      const deckId = parseInt(req.params.id);
      
      if (isNaN(deckId)) {
        return res.status(400).json({ message: "Invalid deck ID" });
      }
      
      const authUser = getAuthUser(req);
      if (!authUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Remove saved deck
      const removed = await storage.removeSavedDeck(authUser.id, deckId);
      
      if (!removed) {
        return res.status(404).json({ message: "Saved deck not found" });
      }
      
      return res.status(200).json({ message: "Deck unsaved successfully" });
    } catch (error) {
      console.error("Error unsaving deck:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get user's saved decks
  app.get("/api/saved-decks", requireAuth, async (req: Request, res: Response) => {
    try {
      const authUser = getAuthUser(req);
      if (!authUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const savedDecks = await storage.getSavedDecks(authUser.id);
      
      return res.json(savedDecks);
    } catch (error) {
      console.error("Error fetching saved decks:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get user's recently viewed decks
  app.get("/api/recent-views", requireAuth, async (req: Request, res: Response) => {
    try {
      const authUser = getAuthUser(req);
      if (!authUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      
      const recentViews = await storage.getRecentViews(authUser.id, limit);
      const viewCount = await storage.getViewCount(authUser.id);
      
      return res.json({
        decks: recentViews,
        count: viewCount
      });
    } catch (error) {
      console.error("Error fetching recent views:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // === Payment Routes ===
  
  // Create a Razorpay order
  app.post("/api/payment/checkout", requireAuth, async (req: Request, res: Response) => {
    try {
      const authUser = getAuthUser(req);
      if (!authUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const user = await storage.getUserByClerkId(authUser.id);
      
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      // Skip if user is already Pro
      if (user.isPro) {
        return res.status(409).json({ message: "User is already Pro" });
      }
      
      // Create Razorpay order
      const order = await razorpayService.createOrder({
        amount: PRO_SUBSCRIPTION_AMOUNT,
        currency: "INR",
        receipt: `order_${user.id}_${Date.now()}`
      });
      
      // Store payment record
      await storage.createPayment({
        userId: user.clerkId,
        razorpayOrderId: order.id,
        razorpayPaymentId: "",
        amount: order.amount,
        status: "created"
      });
      
      // Return payment details for client
      return res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: razorpayService.getClientConfig().key_id
      });
    } catch (error) {
      console.error("Error creating payment:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Verify payment and update user status
  app.post("/api/payment/verify", requireAuth, async (req: Request, res: Response) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      
      // Validate required fields
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ message: "Missing payment verification parameters" });
      }
      
      const authUser = getAuthUser(req);
      if (!authUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Verify signature
      const isValid = razorpayService.verifyPaymentSignature({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      });
      
      if (!isValid) {
        return res.status(400).json({ message: "Invalid payment signature" });
      }
      
      // Update payment status
      await storage.updatePaymentStatus(
        razorpay_order_id,
        razorpay_payment_id,
        "paid"
      );
      
      // Upgrade user to Pro
      const updatedUser = await storage.upgradeUserToPro(authUser.id);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      return res.json({
        success: true,
        user: updatedUser
      });
    } catch (error) {
      console.error("Error verifying payment:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
