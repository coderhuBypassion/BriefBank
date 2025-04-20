import connectToDatabase from './db.js';
import { User, Deck, SavedDeck, View, Payment } from './models/index.js';
import mongoose from 'mongoose';

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
    clerkId: "user_demo123",
    email: "user@example.com",
    usedSummaries: 1,
    isPro: false,
    createdAt: new Date("2023-03-15")
  }
];

async function seedDatabase() {
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
      const user = insertedUsers[0];
      const deck = insertedDecks[0];

      // Create a saved deck
      await SavedDeck.create({
        userId: user.clerkId,
        deckId: deck._id,
        createdAt: new Date()
      });
      console.log("Created sample saved deck");

      // Create a view
      await View.create({
        userId: user.clerkId,
        deckId: deck._id,
        createdAt: new Date()
      });
      console.log("Created sample view");
    }

    console.log("Database seeding completed successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

// Run the seeding function
seedDatabase();