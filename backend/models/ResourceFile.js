import mongoose from "mongoose";

const resourceFileSchema = new mongoose.Schema(
  {
    file: { type: String },
    gameName: { type: String },
    fileType: { type: String },
    path: { type: String },
    filename: { type: String },
    originalname: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("ResourceFile", resourceFileSchema);