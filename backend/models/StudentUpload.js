import mongoose from "mongoose";

const studentUploadSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
    gameName: { type: String, required: true },
    fileUrl: { type: String },
    originalName: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("StudentUpload", studentUploadSchema);