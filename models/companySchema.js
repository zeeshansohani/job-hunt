import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      // The name of the company.
      type: String,
      required: true,
    },
    description: {
      // A detailed description of the company.
      type: String,
    },
    website: {
      // The URL of the company's website.
      type: String,
    },
    location: {
      //  The physical location of the company.
      type: String,
    },
    logo: {
      type: String, // url to the company logo
    },
    userId: {
      // The ID of the user who created or is associated with the company. This creates a relationship between the company and the user.
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Company = mongoose.model("Company", companySchema);
