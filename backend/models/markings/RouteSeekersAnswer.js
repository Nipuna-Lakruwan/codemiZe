import mongoose from "mongoose";

const routeSeekersAnswerSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "RouteSeekersQuestion" },
    answer: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default mongoose.model("RouteSeekersAnswer", routeSeekersAnswerSchema);