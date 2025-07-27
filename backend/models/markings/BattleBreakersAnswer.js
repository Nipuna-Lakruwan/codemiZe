import mongoose from "mongoose";

const battleBreakersAnswerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BattleBreakersQuestion",
    },
    responses: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      attempt: { type: String, required: true },
      status: { type: String, enum: ["Correct", "Incorrect"], required: true }
    }],
  },
  { timestamps: true }
);

export default mongoose.model(
  "BattleBreakersAnswer",
  battleBreakersAnswerSchema
);