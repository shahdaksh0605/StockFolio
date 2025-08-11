// Import necessary packages
const mongoose = require('mongoose');
require('dotenv').config(); // Loads environment variables from .env file

// Import your models
const User = require('../model/usersmodel');
const Stock = require('../model/stocksmodel');

// Get the database URL from environment variables
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
    console.error("Missing MONGO_URL in .env file. Please add it.");
    process.exit(1); // Exit the script if the URL is not found
}

// --- GENERATE LINKED DUMMY DATA ---
// User ObjectIDs
const userId1 = new mongoose.Types.ObjectId();
const userId2 = new mongoose.Types.ObjectId();
const userId3 = new mongoose.Types.ObjectId();
const userId4 = new mongoose.Types.ObjectId();
const userId5 = new mongoose.Types.ObjectId();

// Stock ObjectIDs
const stockId1 = new mongoose.Types.ObjectId();
const stockId2 = new mongoose.Types.ObjectId();
const stockId3 = new mongoose.Types.ObjectId();
const stockId4 = new mongoose.Types.ObjectId();
const stockId5 = new mongoose.Types.ObjectId();
const stockId6 = new mongoose.Types.ObjectId();
const stockId7 = new mongoose.Types.ObjectId();
const stockId8 = new mongoose.Types.ObjectId();
const stockId9 = new mongoose.Types.ObjectId();
const stockId10 = new mongoose.Types.ObjectId();
const stockId11 = new mongoose.Types.ObjectId();
const stockId12 = new mongoose.Types.ObjectId();

// Dummy Users
const dummyUsers = [
    { _id: userId1, name: "Alice Johnson", email: "alice.j@example.com", firebaseUID: "auth-uid-alice-123", portfolio: [stockId1, stockId2, stockId11] },
    { _id: userId2, name: "Bob Smith", email: "bob.smith@example.com", firebaseUID: "auth-uid-bob-456", portfolio: [stockId3, stockId4, stockId5] },
    { _id: userId3, name: "Charlie Brown", email: "charlie.b@example.com", firebaseUID: "auth-uid-charlie-789", portfolio: [stockId6, stockId7, stockId12] },
    { _id: userId4, name: "Diana Prince", email: "diana.p@example.com", firebaseUID: "auth-uid-diana-101", portfolio: [stockId8, stockId9] },
    { _id: userId5, name: "Ethan Hunt", email: "ethan.h@example.com", firebaseUID: "auth-uid-ethan-112", portfolio: [stockId10] }
];

// Dummy Stocks
const dummyStocks = [
    { _id: stockId1, stockName: "AAPL", stockPrice: 195.89, quantity: 15, userId: userId1 },
    { _id: stockId2, stockName: "GOOGL", stockPrice: 177.50, quantity: 5, userId: userId1 },
    { _id: stockId11, stockName: "DIS", stockPrice: 105.10, quantity: 25, userId: userId1 },
    { _id: stockId3, stockName: "TSLA", stockPrice: 184.01, quantity: 10, userId: userId2 },
    { _id: stockId4, stockName: "AMZN", stockPrice: 185.36, quantity: 8, userId: userId2 },
    { _id: stockId5, stockName: "MSFT", stockPrice: 427.59, quantity: 12, userId: userId2 },
    { _id: stockId6, stockName: "NVDA", stockPrice: 121.35, quantity: 20, userId: userId3 }, // Adjusted for 10-for-1 split
    { _id: stockId7, stockName: "META", stockPrice: 498.45, quantity: 18, userId: userId3 },
    { _id: stockId12, stockName: "PYPL", stockPrice: 65.77, quantity: 50, userId: userId3 },
    { _id: stockId8, stockName: "JPM", stockPrice: 198.60, quantity: 30, userId: userId4 },
    { _id: stockId9, stockName: "V", stockPrice: 275.80, quantity: 22, userId: userId4 },
    { _id: stockId10, stockName: "NFLX", stockPrice: 672.90, quantity: 7, userId: userId5 }
];


// --- DATABASE SEEDING LOGIC ---
const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Database connected successfully.");

        // Clear existing data to avoid duplicates on re-run
        console.log("Clearing existing User and Stock data...");
        await User.deleteMany({});
        await Stock.deleteMany({});
        
        // Insert the new data
        console.log("Inserting new dummy data...");
        await User.insertMany(dummyUsers);
        await Stock.insertMany(dummyStocks);

        console.log("Database seeded successfully! 🌱");

    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        // Ensure the connection is closed
        await mongoose.connection.close();
        console.log("Database connection closed.");
    }
};

// Run the seeder function
seedDatabase();