import SupportRequest from "../Models/supportRequestModel.js";
import SupportRequestDTO from "../DTOs/supportRequestDTO.js";
import Staff from "../Models/staffModel.js";

class SupportRequestService {
  static async createSupportRequest(data, userId) {
    const staff = await Staff.findOne({ user_id: userId });

    if (!staff) {
      throw new Error("Staff record not found for this user");
    }

    const supportRequest = await SupportRequest.create({
      patient_id: data.patient_id,
      created_by: staff._id,
      request_type: data.request_type || "",
      description: data.description || "",
      items: data.items || [],
      urgency_level: data.urgency_level || "",
      status: data.status || "open",
      needed_date: data.needed_date || null,
    });

    return await SupportRequest.findById(supportRequest._id)
      .populate("patient_id")
      .populate("created_by");
  }

  static async getAllSupportRequests(userRole) {
    const supportRequests = await SupportRequest.find()
      .populate("patient_id")
      .populate("created_by")
      .sort({ created_at: -1 });

    if (userRole === "admin" || userRole === "social_worker") {
      return supportRequests;
    }

    return supportRequests.map(
      (supportRequest) => new SupportRequestDTO(supportRequest)
    );
  }

  static async getSupportRequestById(id, userRole) {
    const supportRequest = await SupportRequest.findById(id)
      .populate("patient_id")
      .populate("created_by");

    if (!supportRequest) {
      throw new Error("Support request not found");
    }

    if (userRole === "admin" || userRole === "social_worker") {
      return supportRequest;
    }

    return new SupportRequestDTO(supportRequest);
  }

  static async updateSupportRequest(id, data) {
    const supportRequest = await SupportRequest.findById(id);

    if (!supportRequest) {
      throw new Error("Support request not found");
    }

    supportRequest.patient_id = data.patient_id ?? supportRequest.patient_id;
    supportRequest.request_type = data.request_type ?? supportRequest.request_type;
    supportRequest.description = data.description ?? supportRequest.description;
    supportRequest.items = data.items ?? supportRequest.items;
    supportRequest.urgency_level = data.urgency_level ?? supportRequest.urgency_level;
    supportRequest.status = data.status ?? supportRequest.status;
    supportRequest.needed_date = data.needed_date ?? supportRequest.needed_date;

    await supportRequest.save();

    return await SupportRequest.findById(id)
      .populate("patient_id")
      .populate("created_by");
  }

  static async deleteSupportRequest(id) {
    const supportRequest = await SupportRequest.findById(id);

    if (!supportRequest) {
      throw new Error("Support request not found");
    }

    await SupportRequest.findByIdAndDelete(id);

    return supportRequest;
  }
}

export default SupportRequestService;