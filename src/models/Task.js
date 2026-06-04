import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    responsable: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("Task", taskSchema);
