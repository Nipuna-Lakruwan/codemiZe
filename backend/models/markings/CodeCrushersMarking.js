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
    ],
    totalMarks: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("CodeCrushersMarking", codeCrushersMarkingSchema);