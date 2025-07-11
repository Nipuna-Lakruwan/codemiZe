import mongoose from "mongoose";

// Connect to MongoDB
const connectToDB = async () => {
  await mongoose
    .connect(process.env.API_KEY)
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));
};

export default connectToDB;