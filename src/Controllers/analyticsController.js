import {
    getDistrictWiseDonationDistribution,
    getMostDonatedItemsDistribution,
    getCancerTypeDonationPattern,
    getMonthlyDemandForecast,
    getDonationShortageAnalysis,
    getMonthlyDonationForecast,
    getRiskForecast,
} from "../Services/analyticsService.js";

export const districtWiseDonationDistribution = async (req, res) => {
    try {
        const data = await getDistrictWiseDonationDistribution();

        res.status(200).json({
            success: true,
            message: "District-wise donation distribution fetched successfully",
            data
        });
    } catch (error) {
        console.error("District analytics error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch district-wise donation distribution",
            error: error.message
        });
    }
};

export const mostDonatedItemsDistribution = async (req, res) => {
    try {
        const data = await getMostDonatedItemsDistribution();

        res.status(200).json({
            success: true,
            message: "Most donated items distribution fetched successfully",
            data,
        });
    } catch (error) {
        console.error("Most donated items analytics error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch most donated items distribution",
            error: error.message,
        });
    }
};

export const cancerTypeDonationPattern = async (req, res) => {
    try {
        const data = await getCancerTypeDonationPattern();

        res.status(200).json({
            success: true,
            message: "Cancer type donation pattern fetched successfully",
            data,
        });
    } catch (error) {
        console.error("Cancer type analytics error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch cancer type donation pattern",
            error: error.message,
        });
    }
};

export const monthlyDemandForecast = async (req, res) => {
    try {
        const data = await getMonthlyDemandForecast();

        res.status(200).json({
            success: true,
            message: "Monthly demand forecast fetched successfully",
            data,
        });
    } catch (error) {
        console.error("Monthly demand forecast error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch monthly demand forecast",
            error: error.message,
        });
    }
};

export const donationShortageAnalysis = async (req, res) => {
    try {
        const data = await getDonationShortageAnalysis();

        res.status(200).json({
            success: true,
            message: "Donation shortage analysis fetched successfully",
            data,
        });
    } catch (error) {
        console.error("Donation shortage analytics error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch donation shortage analysis",
            error: error.message,
        });
    }
};

export const monthlyDonationForecast = async (req, res) => {
  try {
    const months = Number(req.query.months) || 6;

    const data = await getMonthlyDonationForecast(months);

    res.status(200).json({
      success: true,
      message: "Monthly donation forecast fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Donation forecast error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch donation forecast",
      error: error.message,
    });
  }
};

export const riskForecast = async (req, res) => {
  try {
    const months = Number(req.query.months) || 6;

    const data = await getRiskForecast(months);

    res.status(200).json({
      success: true,
      message: "Risk forecast fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Risk forecast error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch risk forecast",
      error: error.message,
    });
  }
};