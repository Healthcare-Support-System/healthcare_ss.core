import express from "express";
import {
    districtWiseDonationDistribution,
    mostDonatedItemsDistribution,
    cancerTypeDonationPattern,
    monthlyDemandForecast,
    donationShortageAnalysis,
    monthlyDonationForecast,
    riskForecast,
} from "../Controllers/analyticsController.js";

const router = express.Router();

router.get("/district-distribution", districtWiseDonationDistribution);
router.get("/most-donated-items", mostDonatedItemsDistribution);
router.get("/cancer-type-donation-pattern", cancerTypeDonationPattern);
router.get("/monthly-demand-forecast", monthlyDemandForecast);
router.get("/donation-shortages", donationShortageAnalysis);
router.get("/monthly-donation-forecast", monthlyDonationForecast);
router.get("/risk-forecast", riskForecast);

export default router;