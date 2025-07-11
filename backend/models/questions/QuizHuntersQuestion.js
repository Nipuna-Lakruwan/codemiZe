import mongoose from "mongoose";

const quizHuntersQuestionSchema = new mongoose.Schema(
  {
    question: String,
    answer: String,
    option1: String,
    option2: String,
    option3: String
  },
  { timestamps: true }
);

export default mongoose.model("QuizHuntersQuestion", quizHuntersQuestionSchema);