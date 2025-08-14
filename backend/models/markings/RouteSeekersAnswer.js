import mongoose from "mongoose";

const routeSeekersAnswerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
    Answers: [{
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "RouteSeekersQuestion" },
      answer: String,
      status: {
        type: String,
        enum: ['correct', 'incorrect'],
        default: 'incorrect'
      }
    }],
    score: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("RouteSeekersAnswer", routeSeekersAnswerSchema);