import mongoose from "mongoose";
import { seedGames } from "../seeding/seedGames.js";

// Connect to MongoDB
const connectToDB = async () => {
  await mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));

  // Seed initial data if needed
  await seedGames();
};

export default connectToDB;