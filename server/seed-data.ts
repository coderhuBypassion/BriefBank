import { User, Deck, SavedDeck, View, Payment } from './models/index';
import mongoose from 'mongoose';

// Connect to MongoDB using environment variable
const connectToDatabase = async () => {
  try {
    const mongoURI = process.env.DATABASE_URL || 'mongodb+srv://rahulkottak:rahulkottak@cluster0.kvbbssx.mongodb.net/BriefBank';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample deck data
const sampleDecks = [
  {
    id: 1,
    title: "Notion's Seed Pitch Deck",
    companyName: "Notion",
    industry: "Software",
    stage: "Seed",
    type: "SaaS",
    fileUrl: "https://s3.amazonaws.com/startupdeck/notion_pitch_deck.pdf",
    sourceUrl: "https://www.notionpitchdeck.com",
    aiSummary: {
      summary: [
        "Notion is building an all-in-one workspace for notes, tasks, wikis, and databases.",
        "The platform tackles the problem of fragmented team knowledge spread across multiple tools.",
        "Their competitive advantage is a flexible, customizable interface that can replace up to 5 different tools."
      ],
      strengths: [
        "Strong founding team with prior successful exits",
        "Product already has 50,000 active users without paid marketing",
        "Impressive early adoption among tech companies with viral growth"
      ],
      weaknesses: [
        "Crowded marketplace with established competitors",
        "Complex positioning that requires customer education",
        "Pricing model might limit initial revenue growth"
      ],
      fundingStage: "Seed"
    },
    highlights: [
      "50,000 active users",
      "Zero customer acquisition cost",
      "Team with previous exits"
    ],
    tags: [
      "productivity",
      "team collaboration",
      "knowledge management"
    ],
    createdAt: new Date("2023-01-15"),
    year: 2016
  },
  {
    id: 2,
    title: "Airbnb Series A Pitch Deck",
    companyName: "Airbnb",
    industry: "Travel",
    stage: "Series A",
    type: "Marketplace",
    fileUrl: "https://s3.amazonaws.com/startupdeck/airbnb_pitch_deck.pdf",
    sourceUrl: "https://www.airbnbdeck.com",
    aiSummary: {
      summary: [
        "Airbnb is creating a marketplace for short-term rentals in people's homes.",
        "They've identified a gap between expensive hotels and couchsurfing.",
        "Initial traction shows strong demand from both hosts and travelers."
      ],
      strengths: [
        "Two-sided marketplace with network effects already showing",
        "Proven revenue model with 10% commission on each booking",
        "Scalable with minimal overhead compared to traditional hospitality"
      ],
      weaknesses: [
        "Regulatory risks in many cities",
        "Trust and safety concerns could limit adoption",
        "Seasonal business with uneven cash flow"
      ],
      fundingStage: "Series A"
    },
    highlights: [
      "1,000 listings in first year",
      "80% booking rate in major cities",
      "100% month-over-month growth"
    ],
    tags: [
      "travel",
      "marketplace",
      "sharing economy"
    ],
    createdAt: new Date("2023-01-20"),
    year: 2009
  },
  {
    id: 3,
    title: "Uber Series B Pitch Deck",
    companyName: "Uber",
    industry: "Transportation",
    stage: "Series B",
    type: "Marketplace",
    fileUrl: "https://s3.amazonaws.com/startupdeck/uber_pitch_deck.pdf",
    sourceUrl: "https://www.uberdeck.com",
    aiSummary: {
      summary: [
        "Uber is transforming urban transportation with on-demand rides via mobile app.",
        "They're creating a new category between taxis and private car services.",
        "Technology enables efficient driver-rider matching and seamless payments."
      ],
      strengths: [
        "Unit economics show profit per ride of $6.50 on average",
        "Technology platform offers significant advantages over traditional dispatching",
        "Early data shows drivers increasing earnings by 30% while riders wait less"
      ],
      weaknesses: [
        "High regulatory hurdles in each new market",
        "Driver acquisition and retention costs are significant",
        "Low barriers to entry could lead to copycat competitors"
      ],
      fundingStage: "Series B"
    },
    highlights: [
      "5 cities launched",
      "20,000 rides per month",
      "89% of users are repeat customers"
    ],
    tags: [
      "transportation",
      "mobile",
      "on-demand"
    ],
    createdAt: new Date("2023-02-10"),
    year: 2011
  }
];

// Sample user data
const sampleUsers = [
  {
    clerkId: "user_2UcEmB0xZLmB9I1yKhEZ5YF3I7x", // Real Clerk ID observed in the system
    email: "user@example.com",
    usedSummaries: 1,
    isPro: false,
    createdAt: new Date("2023-03-15")
  },
  {
    clerkId: "user_demo123",
    email: "demo@example.com",
    usedSummaries: 3,
    isPro: true,
    createdAt: new Date("2023-03-10")
  }
];

export async function seedDatabase() {
  try {
    // Connect to the database
    await connectToDatabase();
    console.log("Connected to MongoDB");

    // Clear existing data
    await Deck.deleteMany({});
    await User.deleteMany({});
    await SavedDeck.deleteMany({});
    await View.deleteMany({});
    await Payment.deleteMany({});
    console.log("Cleared existing data");

    // Insert sample decks
    const insertedDecks = await Deck.insertMany(sampleDecks);
    console.log(`Inserted ${insertedDecks.length} sample decks`);

    // Insert sample users
    const insertedUsers = await User.insertMany(sampleUsers);
    console.log(`Inserted ${insertedUsers.length} sample users`);

    // Create some sample saved decks and views
    if (insertedUsers.length > 0 && insertedDecks.length > 0) {
      const realUser = insertedUsers[0]; // The user with the real Clerk ID
      const demoUser = insertedUsers[1]; // The demo user
      
      // Create saved decks for the real user
      for (const deck of insertedDecks) {
        // Save all decks for the real user
        await SavedDeck.create({
          userId: realUser.clerkId,
          deckId: deck._id,
          createdAt: new Date()
        });
        
        // Create view records for all decks for the real user
        await View.create({
          userId: realUser.clerkId,
          deckId: deck._id,
          createdAt: new Date()
        });
      }
      console.log(`Created sample saved decks and views for real user: ${realUser.clerkId}`);
      
      // Create one saved deck for the demo user
      await SavedDeck.create({
        userId: demoUser.clerkId,
        deckId: insertedDecks[0]._id,
        createdAt: new Date()
      });
      console.log(`Created sample saved deck for demo user: ${demoUser.clerkId}`);
    }

    console.log("Database seeding completed successfully");
    return true;
  } catch (error) {
    console.error("Error seeding database:", error);
    return false;
  }
}

// In ES modules we don't have require.main === module,
// so we'll export the function instead and call it explicitly from index.ts