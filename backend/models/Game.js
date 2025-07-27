import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  icon: {
    url: {
      type: String,
      default: ''
    },
    publicId: {
      type: String,
      default: ''
    }
  },
  allocateTime: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['inactive', 'active', 'completed'],
    default: 'inactive'
  }
});

export default mongoose.model("Game", gameSchema);