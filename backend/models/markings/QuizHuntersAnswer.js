import mongoose from "mongoose";

const quizHuntersAnswerSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "QuizHuntersQuestion" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
    status: { type: String }, // "Correct", "Incorrect"
  },
  { timestamps: true }
);

export default mongoose.model("QuizHuntersAnswer", quizHuntersAnswerSchema);