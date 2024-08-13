import express from "express";
const router = express.Router();
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
} from "../controllers/jobController.js";

router.route("/create").post(isAuthenticated, postJob);
router.route("/get").get(isAuthenticated, getAllJobs);
router.route("/get/:id").get(isAuthenticated, getJobById);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);

export default router;
