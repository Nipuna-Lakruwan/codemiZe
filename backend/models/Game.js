import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  icon: {
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
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: false
  },
});

export default mongoose.model("Game", gameSchema);