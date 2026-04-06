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

  const hasMessage = Object.prototype.hasOwnProperty.call(updateData, "message");
  const hasPhone = Object.prototype.hasOwnProperty.call(updateData, "phone");

  if (!hasMessage && !hasPhone) {
    throw new Error("No valid fields provided for update");
  }

  if (hasMessage) {
    request.message = updateData.message;
  }

  if (hasPhone) {
    const trimmedPhone = String(updateData.phone).trim();

    if (!/^07\d{8}$/.test(trimmedPhone)) {
      throw new Error("Invalid phone number");
    }

    request.phone = trimmedPhone;
  }

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

// GENERATE UNIQUE REFERENCE CODE
const generateReferenceCode = () => {
  const randomPart = Math.floor(100000 + Math.random() * 900000);
  return `REF-${randomPart}`;
};

// ACCEPT REQUEST
export const acceptRequest = async (id, staffId) => {
  const request = await DonationRequest.findById(id);

  if (!request) {
    throw new Error("Request not found");
  }

  if (request.status !== "pending") {
    throw new Error("Only pending requests can be accepted");
  }

  let referenceCode;
  let exists = true;

  while (exists) {
    referenceCode = generateReferenceCode();

    const existingRequest = await DonationRequest.findOne({
      reference_code: referenceCode,
    });

    if (!existingRequest) {
      exists = false;
    }
  }

  request.status = "accepted";
  request.reference_code = referenceCode;
  request.accepted_by = staffId;
  request.accepted_at = new Date();

  return await request.save();
};


//GET ALL DONATION REQUEST
export const getAllRequests = async () => {
  return await DonationRequest.find()
    .populate("donor_id")
    .populate("request_id")
    .sort({ created_at: -1 });
};

//REJECT DONATION REQUESTS
export const rejectRequest = async (id, staffId) => {
  const request = await DonationRequest.findById(id);

  if (!request) {
    throw new Error("Request not found");
  }

  if (request.status !== "pending") {
    throw new Error("Only pending requests can be rejected");
  }

  request.status = "rejected";
  request.accepted_by = staffId;
  request.accepted_at = new Date();

  return await request.save();
};
