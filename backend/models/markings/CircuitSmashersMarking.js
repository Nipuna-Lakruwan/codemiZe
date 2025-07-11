import mongoose from "mongoose";

const circuitSmashersMarkingSchema = new mongoose.Schema(
  {
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
    judgeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    marks: [
      {
        criteriaId: mongoose.Schema.Types.ObjectId,
        mark: Number
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("CircuitSmashersMarking", circuitSmashersMarkingSchema);