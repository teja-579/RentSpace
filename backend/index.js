import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet"; // Import helmet for security
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import bookingRouter from "./routes/booking.route.js";
import userRouter from "./routes/user.route.js";
import uploadRouter from "./routes/upload.route.js"; // Import the upload route
import { errorHandler } from "./utils/error.js";
import path from "path";
import { fileURLToPath } from "url";

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

console.log("MONGO_URI:", process.env.MONGO_URI); // Log the MONGO_URI

// Configure mongoose
mongoose.set('debug', true); // Enable debugging

// Connect to MongoDB with retry and timeout settings
console.log("Attempting to connect to MongoDB...");
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    connectTimeoutMS: 10000, // Initial connection timeout
    retryWrites: true,
    retryReads: true,
    maxPoolSize: 10 // Maximum number of connections in the pool
  })
  .then(() => {
    console.log("Successfully connected to MongoDB!");
    console.log("MongoDB connection state:", mongoose.connection.readyState); // Log the connection state
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit if we can't connect to the database
  });

// Monitor MongoDB connection
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

const app = express();

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve static files from the public/uploads directory
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Add CSP middleware
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    fontSrc: ["'self'", "http://localhost:9999"], // Allow fonts from the server
  },
}));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/user", userRouter);
app.use("/api/upload", uploadRouter); // Use the upload route

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});