import mongoose from "mongoose";

const criteriaSchema = new mongoose.Schema({
  criteria: {
    type: String,
    required: true
  }
});

export default mongoose.model("Criteria", criteriaSchema);