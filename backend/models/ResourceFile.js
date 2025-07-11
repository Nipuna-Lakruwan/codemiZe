import mongoose from "mongoose";

const resourceFileSchema = new mongoose.Schema(
  {
    file: String
  },
  { timestamps: true }
);

export default mongoose.model("ResourceFile", resourceFileSchema);