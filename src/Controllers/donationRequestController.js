import * as donationService from "../Services/donationRequestService.js";
import Staff from "../Models/staffModel.js";

// CREATE
export const createDonationRequest = async (req, res) => {
  try {
    const { donor_id, request_id, message, phone } = req.body;

    if (!phone || !phone.trim()) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const data = {
      donor_id,
      request_id,
      message,
      phone: phone.trim()
    };

    const result = await donationService.createRequest(data);

    res.status(201).json({
      message: "Donation request created",
      data: result
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET ALL (BY DONOR)
export const getMyRequests = async (req, res) => {
  try {
    const donorId = req.params.donorId;

    const requests = await donationService.getRequestsByDonor(donorId);

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ONE
export const getRequestById = async (req, res) => {
  try {
    const request = await donationService.getRequestById(req.params.id);

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateDonationRequest = async (req, res) => {
  try {
    const updated = await donationService.updateRequest(
      req.params.id,
      req.body
    );

    res.json({
      message: "Request updated",
      data: updated
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// WITHDRAW/DELETE
export const deleteDonationRequest = async (req, res) => {
  try {
    await donationService.deleteRequest(req.params.id);

    res.json({
      message: "Request deleted successfully"
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// ACCEPT DONATION REQUEST
export const acceptDonationRequest = async (req, res) => {
  try {
    const staff = await Staff.findOne({ user_id: req.user.id });

    if (!staff) {
      return res.status(404).json({
        message: "Staff record not found for this user"
      });
    }

    const acceptedRequest = await donationService.acceptRequest(
      req.params.id,
      staff._id
    );

    res.json({
      message: "Donation request accepted successfully",
      data: acceptedRequest
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


//GET ALL DONATION REQUEST 
export const getAllDonationRequests = async (req, res) => {
  try {
    const requests = await donationService.getAllRequests();

    res.json({
      data: requests
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//REJECT DONATION REQUEST 
export const rejectDonationRequest = async (req, res) => {
  try {
    const staff = await Staff.findOne({ user_id: req.user.id });

    if (!staff) {
      return res.status(404).json({
        message: "Staff record not found for this user"
      });
    }

    const rejectedRequest = await donationService.rejectRequest(
      req.params.id,
      staff._id
    );

    res.json({
      message: "Donation request rejected successfully",
      data: rejectedRequest
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
