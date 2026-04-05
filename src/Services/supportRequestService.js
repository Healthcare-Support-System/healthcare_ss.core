import SupportRequest from "../Models/supportRequestModel.js";
import SupportRequestDTO from "../DTOs/supportRequestDTO.js";

class SupportRequestService {
  static async getAllSupportRequests() {
    const supportRequests = await SupportRequest.find()
      .populate("patient_id")
      .populate("created_by")
      .sort({ created_at: -1 });

    return supportRequests.map(
      (supportRequest) => new SupportRequestDTO(supportRequest)
    );
  }
}

export default SupportRequestService;