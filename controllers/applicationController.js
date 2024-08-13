import { Application } from "../models/applicationModel.js";
import { Job } from "../models/jobModel.js";

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;
    if (!jobId) {
      return res.status(400).json({
        message: "Job id is required, Try again.",
        success: false,
      });
    }
    // check if user has already applied?
    const applied = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (applied) {
      return res.status(400).json({
        message: "You have already applied",
        success: false,
      });
    }
    // check if job exists:
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    // create application
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
      status: "pending",
    });

    job.application.push(newApplication._id);
    await job.save();
    return res.status(200).json({
      message: "Application sent. Thank you for applying",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// ALL THE APPLIED JOBS BY A USER:
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "company",
          options: { sort: { createdAt: -1 } },
        },
      });
    if (!application) {
      return res.status(404).json({
        message: "No Applications",
        success: false,
      });
    }
    return res.status(200).json({
      application,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// NUM OF USER APPLIED TO THE JOB FROM ADMIN SIDE
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "application",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
        options: { sort: { createdAt: -1 } },
      },
    });
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }
    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    if (!status) {
      return res.status(400).json({
        message: "Status is required",
        success: false,
      });
    }
    // find application by application id:
    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return res.status(404).json({
        message: "Application not found",
        success: false,
      });
    }

    // update the status:
    application.status = status.toLowerCase();
    await application.save();
    return res.status(200).json({
      message: "Status updated successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
