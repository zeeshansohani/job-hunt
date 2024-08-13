import express from "express";
import { register } from "../controllers/userController.js";
import { login } from "../controllers/userController.js";
import { logout } from "../controllers/userController.js";
import { updateProfile } from "../controllers/userController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router
  .route("/profile/update")
  .post(isAuthenticated, singleUpload, updateProfile);

export default router;
