import mongoose from "mongoose";

const routeSeekersQuestionSchema = new mongoose.Schema(
  {
    question: String
  },
  { timestamps: true }
);

export default mongoose.model("RouteSeekersQuestion", routeSeekersQuestionSchema);