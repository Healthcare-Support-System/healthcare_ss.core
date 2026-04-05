import SupportRequestService from "../Services/supportRequestService.js";

class SupportRequestController {
  static async createSupportRequest(req, res) {
    try {
      const supportRequest = await SupportRequestService.createSupportRequest(
        req.body,
        req.user.id
      );

      return res.status(201).json({
        success: true,
        message: "Support request created successfully",
        data: supportRequest,
      });
    } catch (error) {
      console.error("Error creating support request:", error);
      return res.status(400).json({
        success: false,
        message: "Failed to create support request",
        error: error.message,
      });
    }
  }

  static async getAllSupportRequests(req, res) {
    try {
      const userRole = req.user?.role || null;

      const supportRequests =
        await SupportRequestService.getAllSupportRequests(userRole);

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

  static async getSupportRequestById(req, res) {
    try {
      const userRole = req.user?.role || null;

      const supportRequest =
        await SupportRequestService.getSupportRequestById(
          req.params.id,
          userRole
        );

      return res.status(200).json({
        success: true,
        data: supportRequest,
      });
    } catch (error) {
      console.error("Error fetching support request:", error);
      return res.status(404).json({
        success: false,
        message: "Failed to fetch support request",
        error: error.message,
      });
    }
  }

  static async updateSupportRequest(req, res) {
    try {
      const supportRequest =
        await SupportRequestService.updateSupportRequest(
          req.params.id,
          req.body
        );

      return res.status(200).json({
        success: true,
        message: "Support request updated successfully",
        data: supportRequest,
      });
    } catch (error) {
      console.error("Error updating support request:", error);
      return res.status(400).json({
        success: false,
        message: "Failed to update support request",
        error: error.message,
      });
    }
  }

  static async deleteSupportRequest(req, res) {
    try {
      await SupportRequestService.deleteSupportRequest(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Support request deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting support request:", error);
      return res.status(404).json({
        success: false,
        message: "Failed to delete support request",
        error: error.message,
      });
    }
  }
}

export default SupportRequestController;