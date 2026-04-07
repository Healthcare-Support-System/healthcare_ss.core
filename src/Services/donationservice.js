import Donation from "../Models/donationModel.js";
import DonationRequest from "../Models/donationRequestModel.js";
import SupportRequest from "../Models/supportRequestModel.js";

export const findDonationRequestByReferenceCode = async (referenceCode) => {
  const donationRequest = await DonationRequest.findOne({
    reference_code: referenceCode,
    status: "accepted"
  })
    .populate("request_id")
    .populate("donor_id");

  if (!donationRequest) {
    throw new Error("Accepted donation request not found");
  }

  return donationRequest;
};

export const createDonationRecord = async (data, staffId) => {
  const donationRequest = await DonationRequest.findOne({
    reference_code: data.reference_code,
    status: "accepted"
  });

  if (!donationRequest) {
    throw new Error("Accepted donation request not found");
  }

  const existingDonation = await Donation.findOne({
    donation_request_id: donationRequest._id
  });

  if (existingDonation) {
    throw new Error("This donation has already been recorded");
  }

  const supportRequest = await SupportRequest.findById(donationRequest.request_id);

  if (!supportRequest) {
    throw new Error("Related support request not found");
  }

  const donation = await Donation.create({
    donation_request_id: donationRequest._id,
    request_id: donationRequest.request_id,
    patient_id: supportRequest.patient_id,
    donor_id: donationRequest.donor_id,
    reference_code: donationRequest.reference_code,
    received_by: staffId,
    received_date: data.received_date || new Date(),
    donation_type: data.donation_type || "item",
    received_items: data.received_items || [],
    donation_status: "received",
    remarks: data.remarks || ""
  });

  return donation;
};


// // CREATE DONATION
// export const createDonation = async (req, res) => {
//   try {
//     const staff = await Staff.findOne({ user_id: req.user.id });

//     if (!staff) {
//       return res.status(404).json({
//         message: "Staff record not found for this user"
//       });
//     }

//     const donation = await donationService.createDonationRecord(
//       req.body,
//       staff._id
//     );

//     res.status(201).json({
//       message: "Donation recorded successfully",
//       data: donation
//     });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

export const getAllDonations = async () => {
  const donations = await Donation.find()
    .populate("donation_request_id")
    .populate("request_id")
    .populate("patient_id")
    .populate("donor_id")
    .populate("received_by");

  return donations;
};

export const deleteDonation = async (donationId) => {
  const donation = await Donation.findById(donationId);

  if (!donation) {
    throw new Error("Donation not found");
  }

  await Donation.findByIdAndDelete(donationId);

  return donation;
};



export const updateDonationStatus = async (donationId, status) => {
  const allowedStatuses = ["allocated", "used", "completed"];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid donation status");
  }

  const donation = await Donation.findById(donationId);

  if (!donation) {
    throw new Error("Donation not found");
  }

  donation.donation_status = status;
  await donation.save();

  // 🔥 IMPORTANT: update support request when donation is allocated
  if (status === "allocated") {
  await SupportRequest.findByIdAndUpdate(
    donation.request_id,
    { status: "fulfilled" }
  );
}

  const updatedDonation = await Donation.findById(donationId)
    .populate("donation_request_id")
    .populate("request_id")
    .populate("patient_id")
    .populate("donor_id")
    .populate("received_by");

  return updatedDonation;
};