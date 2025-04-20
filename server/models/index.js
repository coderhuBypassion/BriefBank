import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  usedSummaries: { type: Number, default: 0 },
  isPro: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Deck Schema
const deckSchema = new mongoose.Schema({
  title: { type: String, required: true },
  companyName: { type: String, required: true },
  industry: { type: String, required: true },
  stage: { type: String, required: true },
  type: { type: String, required: true },
  fileUrl: { type: String, required: true },
  sourceUrl: { type: String },
  aiSummary: {
    summary: [String],
    strengths: [String],
    weaknesses: [String],
    fundingStage: String
  },
  highlights: [String],
  tags: [String],
  year: Number,
  createdAt: { type: Date, default: Date.now }
});

// Saved Decks Schema
const savedDeckSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: 'User' },
  deckId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Deck' },
  createdAt: { type: Date, default: Date.now }
});

// Views Schema
const viewSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: 'User' },
  deckId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Deck' },
  createdAt: { type: Date, default: Date.now }
});

// Payments Schema
const paymentSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: 'User' },
  razorpayOrderId: { type: String, required: true },
  razorpayPaymentId: { type: String },
  amount: { type: Number, required: true },
  status: { type: String, required: true, enum: ['created', 'paid', 'failed'] },
  createdAt: { type: Date, default: Date.now }
});

// Create models or get existing ones
const models = {};

// Avoid model redefinition errors in development with hot reloading
export function getModel(name, schema) {
  if (mongoose.models[name]) {
    return mongoose.models[name];
  }
  return mongoose.model(name, schema);
}

// Export models
export const User = getModel('User', userSchema);
export const Deck = getModel('Deck', deckSchema);
export const SavedDeck = getModel('SavedDeck', savedDeckSchema);
export const View = getModel('View', viewSchema);
export const Payment = getModel('Payment', paymentSchema);