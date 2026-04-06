import bcrypt from "bcryptjs";
import User from "../Models/userModel.js";
import Donor from "../Models/donorModel.js";

const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const sriLankaPhoneRegex = /^07\d{8}$/;
const sriLankaNicRegex = /^(?:\d{9}[VvXx]|\d{12})$/;

// CREATE: Register a new donor with both user and donor profile records.
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

    const trimmedEmail = email?.trim();
    const trimmedFirstName = first_name?.trim();
    const trimmedLastName = last_name?.trim();
    const trimmedNic = nic?.trim();
    const trimmedPhone = phone?.trim();
    const trimmedAddress = address?.trim();

    // Validate the minimum required fields for donor registration.
    if (!trimmedEmail || !password || !trimmedFirstName || !trimmedLastName || !trimmedNic) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // Validate donor names to contain letters and spaces only.
    if (!nameRegex.test(trimmedFirstName)) {
      return res.status(400).json({
        message: "First name can only contain letters and spaces"
      });
    }

    if (!nameRegex.test(trimmedLastName)) {
      return res.status(400).json({
        message: "Last name can only contain letters and spaces"
      });
    }

    // Validate email format before checking uniqueness.
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Enforce a stronger password rule for donor signup.
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long"
      });
    }

    // Validate the supported Sri Lankan NIC formats.
    if (!sriLankaNicRegex.test(trimmedNic)) {
      return res.status(400).json({ message: "Invalid NIC number" });
    }

    // Check whether the email is already used by another account.
    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Check whether a donor profile already exists for the given NIC.
    const existingNIC = await Donor.findOne({ nic: trimmedNic });
    if (existingNIC) {
      return res.status(400).json({ message: "NIC already registered" });
    }

    // Validate the Sri Lankan mobile number format when a phone number is provided.
    if (trimmedPhone && !sriLankaPhoneRegex.test(trimmedPhone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    // Hash the password before storing the user record.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the authentication record in the users collection.
    const user = new User({
      email: trimmedEmail,
      password_hash: hashedPassword,
      role: "donor"
    });

    const savedUser = await user.save();

    // Create the donor profile linked to the newly created user.
    const donor = new Donor({
      user_id: savedUser._id,
      first_name: trimmedFirstName,
      last_name: trimmedLastName,
      nic: trimmedNic,
      phone: trimmedPhone,
      address: trimmedAddress
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
