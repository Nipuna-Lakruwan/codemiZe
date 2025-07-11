import mongoose from "mongoose";

const battleBreakersAnswerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BattleBreakersQuestion",
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    answer: String,
  },
  { timestamps: true }
);

export default mongoose.model(
  "BattleBreakersAnswer",
  battleBreakersAnswerSchema
);