import connectToDatabase from './db.js';
import { User, Deck, SavedDeck, View, Payment } from './models/index.js';
import mongoose from 'mongoose';

export class MongoDBStorage {
  constructor() {
    // Flag to track connection status
    this.isConnected = false;
    this.connectionPromise = null;
    
    // Initialize connection
    this.initConnection();
  }

  async initConnection() {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }
    
    this.connectionPromise = new Promise(async (resolve) => {
      try {
        await connectToDatabase();
        console.log('Connected to MongoDB');
        this.isConnected = true;
        resolve();
      } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        // Reset connection promise so we can try again
        this.connectionPromise = null;
      }
    });
    
    return this.connectionPromise;
  }
  
  // Helper method to ensure we're connected before database operations
  async ensureConnected() {
    if (!this.isConnected) {
      await this.initConnection();
    }
  }

  // User operations
  async getUser(id) {
    try {
      await this.ensureConnected();
      const user = await User.findById(id);
      return user ? user.toObject() : undefined;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return undefined;
    }
  }

  async getUserByClerkId(clerkId) {
    try {
      await this.ensureConnected();
      const user = await User.findOne({ clerkId });
      return user ? user.toObject() : undefined;
    } catch (error) {
      console.error('Error getting user by clerk ID:', error);
      return undefined;
    }
  }

  async createUser(userData) {
    try {
      await this.ensureConnected();
      const user = new User(userData);
      await user.save();
      return user.toObject();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(clerkId, data) {
    try {
      await this.ensureConnected();
      const user = await User.findOneAndUpdate(
        { clerkId },
        { $set: data },
        { new: true }
      );
      return user ? user.toObject() : undefined;
    } catch (error) {
      console.error('Error updating user:', error);
      return undefined;
    }
  }

  async incrementUsedSummaries(clerkId) {
    try {
      await this.ensureConnected();
      const user = await User.findOneAndUpdate(
        { clerkId },
        { $inc: { usedSummaries: 1 } },
        { new: true }
      );
      return user ? user.toObject() : undefined;
    } catch (error) {
      console.error('Error incrementing used summaries:', error);
      return undefined;
    }
  }

  async upgradeUserToPro(clerkId) {
    try {
      await this.ensureConnected();
      const user = await User.findOneAndUpdate(
        { clerkId },
        { $set: { isPro: true } },
        { new: true }
      );
      return user ? user.toObject() : undefined;
    } catch (error) {
      console.error('Error upgrading user to pro:', error);
      return undefined;
    }
  }

  // Deck operations
  async getDeck(id) {
    try {
      await this.ensureConnected();
      
      // Handle both string ObjectId and numeric id
      let deck = null;
      
      // First try to find by the numeric ID field which matches legacy IDs
      if (typeof id === 'number' || !isNaN(parseInt(id))) {
        const numId = typeof id === 'number' ? id : parseInt(id);
        deck = await Deck.findOne({ id: numId });
      }
      
      // If not found and it's a valid ObjectId, try finding by _id
      if (!deck && mongoose.Types.ObjectId.isValid(id)) {
        deck = await Deck.findById(id);
      }
      
      return deck ? deck.toObject() : undefined;
    } catch (error) {
      console.error('Error getting deck:', error);
      return undefined;
    }
  }

  async getDecks(options = {}) {
    try {
      // Ensure we're connected to MongoDB before querying
      await this.ensureConnected();
      
      let query = Deck.find();
      
      // Apply filters
      if (options.industry) {
        query = query.where('industry').equals(options.industry);
      }
      if (options.stage) {
        query = query.where('stage').equals(options.stage);
      }
      if (options.type) {
        query = query.where('type').equals(options.type);
      }
      
      // Apply sorting
      if (options.sort) {
        switch (options.sort) {
          case 'newest':
            query = query.sort('-createdAt');
            break;
          case 'oldest':
            query = query.sort('createdAt');
            break;
          case 'a-z':
            query = query.sort('title');
            break;
          case 'z-a':
            query = query.sort('-title');
            break;
          default:
            query = query.sort('-createdAt');
        }
      } else {
        query = query.sort('-createdAt');
      }
      
      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit);
      }
      if (options.offset) {
        query = query.skip(options.offset);
      }
      
      const decks = await query.exec();
      return decks.length ? decks.map(deck => deck.toObject()) : [];
    } catch (error) {
      console.error('Error getting decks:', error);
      return [];
    }
  }

  async getFeaturedDecks(limit = 3) {
    try {
      // Ensure we're connected to MongoDB before querying
      await this.ensureConnected();
      
      const decks = await Deck.find({ aiSummary: { $exists: true } })
        .sort('-createdAt')
        .limit(limit)
        .exec();
      
      return decks.length ? decks.map(deck => deck.toObject()) : [];
    } catch (error) {
      console.error('Error getting featured decks:', error);
      return [];
    }
  }

  async createDeck(deckData) {
    try {
      const deck = new Deck(deckData);
      await deck.save();
      return deck.toObject();
    } catch (error) {
      console.error('Error creating deck:', error);
      throw error;
    }
  }

  async updateDeckSummary(id, summary) {
    try {
      await this.ensureConnected();
      
      let deck = null;
      
      // First try to find by the numeric ID field which matches legacy IDs
      if (typeof id === 'number' || !isNaN(parseInt(id))) {
        const numId = typeof id === 'number' ? id : parseInt(id);
        deck = await Deck.findOneAndUpdate(
          { id: numId },
          { $set: { aiSummary: summary } },
          { new: true }
        );
      }
      
      // If not found and it's a valid ObjectId, try finding by _id
      if (!deck && mongoose.Types.ObjectId.isValid(id)) {
        deck = await Deck.findByIdAndUpdate(
          id,
          { $set: { aiSummary: summary } },
          { new: true }
        );
      }
      
      return deck ? deck.toObject() : undefined;
    } catch (error) {
      console.error('Error updating deck summary:', error);
      return undefined;
    }
  }

  // Saved decks operations
  async getSavedDecks(userId) {
    try {
      await this.ensureConnected();
      
      const savedDecks = await SavedDeck.find({ userId })
        .populate('deckId')
        .exec();
      
      return savedDecks
        .filter(saved => saved.deckId) // Filter out any null references
        .map(saved => saved.deckId.toObject());
    } catch (error) {
      console.error('Error getting saved decks:', error);
      return [];
    }
  }

  async saveDeck(savedDeckData) {
    try {
      await this.ensureConnected();
      
      // Convert numeric deckId to either ObjectId or numericId
      const deckId = savedDeckData.deckId;
      let deck = null;
      
      // First try to find by the numeric ID field which matches legacy IDs
      if (typeof deckId === 'number' || !isNaN(parseInt(deckId))) {
        const numId = typeof deckId === 'number' ? deckId : parseInt(deckId);
        deck = await Deck.findOne({ id: numId });
      }
      
      // If not found and it's a valid ObjectId, try finding by _id
      if (!deck && mongoose.Types.ObjectId.isValid(deckId)) {
        deck = await Deck.findById(deckId);
      }
      
      if (!deck) {
        throw new Error(`Deck not found with ID ${deckId}`);
      }
      
      // Use the MongoDB ObjectId for deckId
      const savedDeck = new SavedDeck({
        userId: savedDeckData.userId,
        deckId: deck._id
      });
      
      await savedDeck.save();
      return savedDeck.toObject();
    } catch (error) {
      console.error('Error saving deck:', error);
      throw error;
    }
  }

  async removeSavedDeck(userId, deckId) {
    try {
      let deck;
      
      if (mongoose.Types.ObjectId.isValid(deckId)) {
        // If it's already a valid ObjectId, use it directly
        deck = await Deck.findById(deckId);
      } else if (typeof deckId === 'number' || !isNaN(parseInt(deckId))) {
        // For numeric IDs from the legacy system, find by the numeric ID field
        const numId = typeof deckId === 'number' ? deckId : parseInt(deckId);
        deck = await Deck.findOne({ id: numId });
      }
      
      if (!deck) {
        return false;
      }
      
      const result = await SavedDeck.deleteOne({ 
        userId, 
        deckId: deck._id 
      });
      
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error removing saved deck:', error);
      return false;
    }
  }

  async isSavedDeck(userId, deckId) {
    try {
      let deck;
      
      if (mongoose.Types.ObjectId.isValid(deckId)) {
        // If it's already a valid ObjectId, use it directly
        deck = await Deck.findById(deckId);
      } else if (typeof deckId === 'number' || !isNaN(parseInt(deckId))) {
        // For numeric IDs from the legacy system, find by the numeric ID field
        const numId = typeof deckId === 'number' ? deckId : parseInt(deckId);
        deck = await Deck.findOne({ id: numId });
      }
      
      if (!deck) {
        return false;
      }
      
      const savedDeck = await SavedDeck.findOne({ 
        userId, 
        deckId: deck._id 
      });
      
      return !!savedDeck;
    } catch (error) {
      console.error('Error checking if deck is saved:', error);
      return false;
    }
  }

  // View history operations
  async getRecentViews(userId, limit = 5) {
    try {
      await this.ensureConnected();
      
      const recentViews = await View.find({ userId })
        .sort('-createdAt')
        .limit(limit)
        .populate('deckId')
        .exec();
      
      return recentViews
        .filter(view => view.deckId) // Filter out any null references
        .map(view => view.deckId.toObject());
    } catch (error) {
      console.error('Error getting recent views:', error);
      return [];
    }
  }

  async recordView(viewData) {
    try {
      await this.ensureConnected();
      
      const deckId = viewData.deckId;
      let deck = null;
      
      // First try to find by the numeric ID field which matches legacy IDs
      if (typeof deckId === 'number' || !isNaN(parseInt(deckId))) {
        const numId = typeof deckId === 'number' ? deckId : parseInt(deckId);
        deck = await Deck.findOne({ id: numId });
      }
      
      // If not found and it's a valid ObjectId, try finding by _id
      if (!deck && mongoose.Types.ObjectId.isValid(deckId)) {
        deck = await Deck.findById(deckId);
      }
      
      if (!deck) {
        throw new Error(`Deck not found with ID ${deckId}`);
      }
      
      // Check if this view already exists and is recent (last 1 hour)
      const lastHour = new Date();
      lastHour.setHours(lastHour.getHours() - 1);
      
      const existingView = await View.findOne({
        userId: viewData.userId,
        deckId: deck._id,
        createdAt: { $gt: lastHour }
      });
      
      if (existingView) {
        return existingView.toObject();
      }
      
      // Create the view with the MongoDB ObjectId
      const view = new View({
        userId: viewData.userId,
        deckId: deck._id
      });
      
      await view.save();
      return view.toObject();
    } catch (error) {
      console.error('Error recording view:', error);
      throw error;
    }
  }

  async getViewCount(userId) {
    try {
      await this.ensureConnected();
      const count = await View.countDocuments({ userId });
      return count;
    } catch (error) {
      console.error('Error getting view count:', error);
      return 0;
    }
  }

  // Payment operations
  async createPayment(paymentData) {
    try {
      await this.ensureConnected();
      const payment = new Payment(paymentData);
      await payment.save();
      return payment.toObject();
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  async updatePaymentStatus(orderId, paymentId, status) {
    try {
      await this.ensureConnected();
      const payment = await Payment.findOneAndUpdate(
        { razorpayOrderId: orderId },
        { 
          $set: { 
            razorpayPaymentId: paymentId,
            status
          } 
        },
        { new: true }
      );
      return payment ? payment.toObject() : undefined;
    } catch (error) {
      console.error('Error updating payment status:', error);
      return undefined;
    }
  }

  async getPayment(orderId) {
    try {
      await this.ensureConnected();
      const payment = await Payment.findOne({ razorpayOrderId: orderId });
      return payment ? payment.toObject() : undefined;
    } catch (error) {
      console.error('Error getting payment:', error);
      return undefined;
    }
  }
}

export const storage = new MongoDBStorage();