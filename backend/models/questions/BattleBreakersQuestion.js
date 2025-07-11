import mongoose from "mongoose";

const battleBreakersQuestionSchema = new mongoose.Schema(
  {
    question: String,
    answer: String
  },
  { timestamps: true }
);

export default mongoose.model("BattleBreakersQuestion", battleBreakersQuestionSchema);