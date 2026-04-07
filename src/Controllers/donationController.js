import * as donationService from "../Services/donationservice.js";
import Staff from "../Models/staffModel.js";
import SupportRequest from "../Models/supportRequestModel.js";

export const getDonationRequestByReferenceCode = async (req, res) => {
  try {
    const { code } = req.params;

    const donationRequest =
      await donationService.findDonationRequestByReferenceCode(code);

    res.status(200).json({
      message: "Donation request found",
      data: donationRequest
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createDonation = async (req, res) => {
  try {
    const staff = await Staff.findOne({ user_id: req.user.id });

    if (!staff) {
      return res.status(404).json({
        message: "Staff record not found for this user"
      });
    }

    const donation = await donationService.createDonationRecord(
      req.body,
      staff._id
    );

    res.status(201).json({
      message: "Donation recorded successfully",
      data: donation
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET ALL DONATIONS
export const getAllDonations = async (req, res) => {
  try {
    const donations = await donationService.getAllDonations();

    res.status(200).json({
      data: donations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE DONATION
export const deleteDonation = async (req, res) => {
  try {
    await donationService.deleteDonation(req.params.id);

    res.status(200).json({
      message: "Donation deleted successfully"
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateDonationStatus = async (req, res) => {
  try {
    const { donation_status } = req.body;

    if (!donation_status) {
      return res.status(400).json({
        message: "donation_status is required"
      });
    }

    const updatedDonation = await donationService.updateDonationStatus(
      req.params.id,
      donation_status
    );

    res.status(200).json({
      message: "Donation status updated successfully",
      data: updatedDonation
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};