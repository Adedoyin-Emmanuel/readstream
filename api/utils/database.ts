import mongoose from "mongoose";

import { logger } from "./index";

export const connectToDatabase = async (): Promise<void> => {
  try {
    logger(`Connecting to MongoDB at: ${process.env.MONGODB_URL}`);

    await mongoose.connect(process.env.MONGODB_URL);

    logger("Connected to MongoDB successfully");
  } catch (error) {
    logger("MongoDB connection error:", error);
    throw error;
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();

    logger("Disconnected from MongoDB successfully");
  } catch (error) {
    logger("MongoDB disconnection error:", error);
    throw error;
  }
};
