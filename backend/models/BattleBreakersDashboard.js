import mongoose from "mongoose";

const battleBreakersDashboardSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BattleBreakersQuestion",
    },
    schools: [
      {
        schoolId: mongoose.Schema.Types.ObjectId,
        time: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("BattleBreakersDashboard",battleBreakersDashboardSchema);