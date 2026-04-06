import { donorProfileResponseDTO } from "../DTOs/donorProfileDTO.js";
import {
  deleteDonorProfileByUserId,
  getDonorProfileByUserId,
  updateDonorProfileByUserId
} from "../Services/donorProfileService.js";

const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const sriLankaPhoneRegex = /^07\d{8}$/;
const sriLankaNicRegex = /^(?:\d{9}[VvXx]|\d{12})$/;

export const getDonorProfile = async (req, res) => {
  try {
    const donor = await getDonorProfileByUserId(req.user.id);

    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    res.status(200).json(donorProfileResponseDTO(donor));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateDonorProfile = async (req, res) => {
  try {
    const { email, first_name, last_name, nic, phone, address } = req.body;

    const trimmedEmail = email?.trim();
    const trimmedFirstName = first_name?.trim();
    const trimmedLastName = last_name?.trim();
    const trimmedNic = nic?.trim();
    const trimmedPhone = phone?.trim();
    const trimmedAddress = address?.trim();

    if (trimmedFirstName !== undefined && !nameRegex.test(trimmedFirstName)) {
      return res.status(400).json({
        message: "First name can only contain letters and spaces"
      });
    }

    if (trimmedLastName !== undefined && !nameRegex.test(trimmedLastName)) {
      return res.status(400).json({
        message: "Last name can only contain letters and spaces"
      });
    }

    if (trimmedEmail !== undefined && !emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    if (trimmedNic !== undefined && !sriLankaNicRegex.test(trimmedNic)) {
      return res.status(400).json({ message: "Invalid NIC number" });
    }

    if (trimmedPhone !== undefined && !sriLankaPhoneRegex.test(trimmedPhone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    const donor = await updateDonorProfileByUserId(req.user.id, {
      email: trimmedEmail,
      first_name: trimmedFirstName,
      last_name: trimmedLastName,
      nic: trimmedNic,
      phone: trimmedPhone,
      address: trimmedAddress
    });

    res.status(200).json({
      message: "Donor profile updated successfully",
      profile: donorProfileResponseDTO(donor)
    });
  } catch (error) {
    if (
      error.message === "Donor not found"
      || error.message === "Email already registered"
      || error.message === "NIC already registered"
    ) {
      const statusCode = error.message === "Donor not found" ? 404 : 400;
      return res.status(statusCode).json({ message: error.message });
    }

    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteDonorProfile = async (req, res) => {
  try {
    await deleteDonorProfileByUserId(req.user.id);

    res.status(200).json({
      message: "Donor profile deleted successfully"
    });
  } catch (error) {
    if (error.message === "Donor not found") {
      return res.status(404).json({ message: error.message });
    }

    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
