import mongoose from "mongoose";

const gameSlidesSchema = new mongoose.Schema(
  {
    gameType: { type: String, required: true },
    slides: [String]
  },
  { timestamps: true }
);

export default mongoose.model("GameSlides", gameSlidesSchema);