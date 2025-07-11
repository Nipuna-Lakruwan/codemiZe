import mongoose from "mongoose";

const studentUploadSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game" },
    fileUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("StudentUpload", studentUploadSchema);