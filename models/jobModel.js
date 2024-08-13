import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      // The title of the job position (e.g., "Software Engineer")
      type: String,
      required: true,
    },
    description: {
      // A detailed description of the job, including responsibilities and tasks.
      type: String,
      required: true,
    },
    requirements: {
      // The qualifications and skills required for the job.
      type: [String],
    },
    salary: {
      // The salary offered for the position.
      type: Number,
      required: true,
    },
    experienceLevel: {
      type: Number,
      required: true,
    },
    location: {
      // The location where the job is based.
      type: String,
      required: true,
    },
    jobType: {
      // he type of job (e.g., Full-time, Part-time, Contract).
      type: String,
      required: true,
    },
    position: {
      // Represents the position or level of the job within the company (e.g., junior, mid-level, senior).
      type: Number,
      required: true,
    },
    company: {
      // The ID referencing the company offering the job. This creates a relationship between the job and the company.
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    created_by: {
      // The ID of the user who created the job listing, establishing a relationship between the job and the user.
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    application: [
      // An array of IDs referencing applications for the job. It creates a relationship where multiple applications can be associated with the job.
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Job = mongoose.model("Job", jobSchema);
