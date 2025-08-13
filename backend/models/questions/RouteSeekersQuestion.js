import mongoose from "mongoose";

const routeSeekersQuestionSchema = new mongoose.Schema(
  {
    question: String,
    answer: String,
  },
  { timestamps: true }
);

export default mongoose.model("RouteSeekersQuestion", routeSeekersQuestionSchema);