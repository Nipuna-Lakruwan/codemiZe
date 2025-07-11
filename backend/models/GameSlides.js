import mongoose from "mongoose";

const gameSlidesSchema = new mongoose.Schema(
  {
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game" },
    slides: [String]
  },
  { timestamps: true }
);

export default mongoose.model("GameSlides", gameSlidesSchema);