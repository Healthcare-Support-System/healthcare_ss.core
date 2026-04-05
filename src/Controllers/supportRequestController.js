import SupportRequestService from "../Services/supportRequestService.js";

class SupportRequestController {
  static async getAllSupportRequests(req, res) {
    try {
      const supportRequests = await SupportRequestService.getAllSupportRequests();

      return res.status(200).json({
        success: true,
        count: supportRequests.length,
        data: supportRequests,
      });
    } catch (error) {
      console.error("Error fetching support requests:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch support requests",
        error: error.message,
      });
    }
  }
}

export default SupportRequestController;