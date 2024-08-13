import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      // The ID referencing the job that the application is for. This creates a relationship between the application and the job.
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      // The ID referencing the user who applied for the job. This creates a relationship between the application and the user.
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      // The status of the application. It can be "Pending", "Accepted", or "Rejected". The default value is "Pending".
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const Application = mongoose.model("Application", applicationSchema);
