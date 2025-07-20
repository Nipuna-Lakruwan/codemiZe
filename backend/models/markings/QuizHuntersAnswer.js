import mongoose from "mongoose";

const quizHuntersAnswerSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "QuizHuntersQuestion", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
    selectedAnswer: { type: String, required: true },
    correctAnswer: { type: String, required: true },
    status: { type: String, enum: ["Correct", "Incorrect"], required: true }
  },
  { timestamps: true }
);

export default mongoose.model("QuizHuntersAnswer", quizHuntersAnswerSchema);