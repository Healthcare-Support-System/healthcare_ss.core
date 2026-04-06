import { donorProfileResponseDTO } from "../DTOs/donorProfileDTO.js";
import {
  deleteDonorProfileByUserId,
  getDonorProfileByUserId,
  updateDonorProfileByUserId
} from "../Services/donorProfileService.js";

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

    if (phone && !/^07\d{8}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    const donor = await updateDonorProfileByUserId(req.user.id, {
      email,
      first_name,
      last_name,
      nic,
      phone,
      address
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
