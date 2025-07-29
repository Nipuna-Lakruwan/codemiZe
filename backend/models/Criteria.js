import mongoose from "mongoose";

const criteriaSchema = new mongoose.Schema({
  criteria: {
    type: String,
    required: true
  },
  gameType: {
    type: String,
    enum: ["circuitSmashers", "codeCrushers", "routeSeekers"],
    required: true
  }
});

export default mongoose.model("Criteria", criteriaSchema);