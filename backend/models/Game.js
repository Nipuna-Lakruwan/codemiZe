import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  allocateTime: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["Inactive", "Active"],
    default: "Inactive"
  }
});

export default mongoose.model("Game", gameSchema);