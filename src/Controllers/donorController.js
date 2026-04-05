import bcrypt from "bcryptjs";
import User from "../Models/userModel.js";
import Donor from "../Models/donorModel.js";

export const registerDonor = async (req, res) => {
  try {
    const {
      email,
      password,
      first_name,
      last_name,
      nic,
      phone,
      address
    } = req.body;

    // 🔴 Validate required fields
    if (!email || !password || !first_name || !last_name || !nic) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // 🔴 Email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 🔴 NIC exists
    const existingNIC = await Donor.findOne({ nic });
    if (existingNIC) {
      return res.status(400).json({ message: "NIC already registered" });
    }

    // 🔴 Phone validation (Sri Lanka)
    if (phone && !/^07\d{8}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create User
    const user = new User({
      email,
      password_hash: hashedPassword,
      role: "donor"
    });

    const savedUser = await user.save();

    // ✅ Create Donor
    const donor = new Donor({
      user_id: savedUser._id,
      first_name,
      last_name,
      nic,
      phone,
      address
    });

    await donor.save();

    res.status(201).json({
      message: "Donor registered successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};