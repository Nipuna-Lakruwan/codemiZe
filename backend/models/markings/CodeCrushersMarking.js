import mongoose from "mongoose";

const codeCrushersMarkingSchema = new mongoose.Schema(
  {
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
    judgeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    marks: [
      {
        criteriaId: { type: mongoose.Schema.Types.ObjectId, ref: "Criteria" },
        mark: Number
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("CodeCrushersMarking", codeCrushersMarkingSchema);