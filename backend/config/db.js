import mongoose from "mongoose";

// Connect to MongoDB
const connectToDB = async () => {
  await mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));
};

export default connectToDB;