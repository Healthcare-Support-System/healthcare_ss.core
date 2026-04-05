import DonationRequest from "../Models/donationRequestModel.js";

// CREATE REQUEST
export const createRequest = async (data) => {
  return await DonationRequest.create(data);
};

// GET ALL REQUESTS BY DONOR
export const getRequestsByDonor = async (donorId) => {
  return await DonationRequest.find({ donor_id: donorId })
    .populate("request_id")
    .sort({ created_at: -1 });
};

// GET SINGLE REQUEST
export const getRequestById = async (id) => {
  return await DonationRequest.findById(id).populate("request_id");
};

// UPDATE (ONLY IF PENDING)
export const updateRequest = async (id, updateData) => {
  const request = await DonationRequest.findById(id);

  if (!request) {
    throw new Error("Request not found");
  }

  if (request.status !== "pending") {
    throw new Error("Cannot update after approval");
  }

  request.message = updateData.message;

  return await request.save();
};

//Delete Request
export const deleteRequest = async (id) => {
  const request = await DonationRequest.findById(id);

  if (!request) {
    throw new Error("Request not found");
  }

  if (request.status !== "pending") {
    throw new Error("Cannot delete after approval");
  }

  return await DonationRequest.findByIdAndDelete(id);
};