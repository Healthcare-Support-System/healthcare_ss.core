import User from "../Models/userModel.js";
import Donor from "../Models/donorModel.js";
import Staff from "../Models/staffModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  let profile = null;

  if (user.role === "donor") {
    profile = await Donor.findOne({ user_id: user._id });
  } else if (user.role === "admin" || user.role === "social_worker") {
    profile = await Staff.findOne({ user_id: user._id });
  }

  return {
    user: {
      ...user.toObject(),
      profile
    },
    token
  };
};

export const getAllUsers = async () => {
  return await User.find();
};
