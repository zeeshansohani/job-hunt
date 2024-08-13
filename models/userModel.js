import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      // The full name of the user.
      type: String,
      required: true,
    },
    email: {
      // The email address of the user. This field must be unique in the database.
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      // The phone number of the user.
      type: Number,
      required: true,
    },
    password: {
      // The password for the user's account. This should be stored in a hashed format for security.
      type: String,
      required: true,
    },
    role: {
      // The role of the user, which can be either "Student" or "Recruiter".
      type: String,
      enum: ["Student", "Recruiter"],
      required: true,
    },
    profile: {
      bio: { type: String },
      skills: { type: Array },
      resume: { type: String }, // will contain url to the resume
      resumeOriginalName: { type: String },
      company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
      // The ID referencing the company the user is associated with, if any.
      profilePhoto: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
