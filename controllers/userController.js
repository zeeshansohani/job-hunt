import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataURI.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message:
          "Something is missing, please go through each field once again",
        success: false,
      });
    }
    const file = req.file;
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        message: "User already registered with this email. Try again",
        sucess: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: cloudResponse.secure_url,
      },
    });
    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  // AUTHENTICATION:
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message:
          "Something is missing, please go through each field once again",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({
        message: "Incorrect email or password",
        sucess: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      res.status(400).json({
        message: "Incorrect email or password",
        sucess: false,
      });
    }
    // CHECK ROLE IS CORRECT OR NOT
    if (role !== user.role) {
      res.status(400).json({
        message: "Account doesn't exist with role chosen. Please try again",
        sucess: false,
      });
    }

    // AUTHORIZATION : GENERATE TOKEN
    const tokenData = {
      userId: user._id,
    };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 100,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back, ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;
    // cloudinary will be set up here!
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    // Split skills by comma and trim each skill
    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",");
    }

    const userId = req.id; // from middleware authentication
    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }
    //updating data
    if (fullname) user.fullname = fullname;
    if (email) user.email - email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;

    //resume comes later here...
    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url; // Save the Cloudinary URL for upload
      user.profile.resumeOriginalName = file.originalname; // Save the original file name
    }

    await user.save();
    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    return res.status(200).json({
      message: "Profile updated successfully",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
