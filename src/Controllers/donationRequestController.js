import * as donationService from "../Services/donationRequestService.js";

// CREATE
export const createDonationRequest = async (req, res) => {
  try {
    const data = {
      donor_id: req.body.donor_id,
      request_id: req.body.request_id,
      message: req.body.message
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