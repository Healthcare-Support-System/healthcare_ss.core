import axios from "axios";
import Donation from "../Models/donationModel.js";
import SupportRequest from "../Models/supportRequestModel.js";

export const getDistrictWiseDonationDistribution = async () => {
    const result = await Donation.aggregate([
        {
            $lookup: {
                from: "donors",
                localField: "donor_id",
                foreignField: "_id",
                as: "donor"
            }
        },
        {
            $unwind: {
                path: "$donor",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: {
                    $ifNull: ["$donor.district", "Unknown"]
                },
                totalDonations: { $sum: 1 },
                totalItems: {
                    $sum: {
                        $sum: "$received_items.quantity"
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                district: "$_id",
                totalDonations: 1,
                totalItems: 1
            }
        },
        {
            $sort: {
                totalDonations: -1
            }
        }
    ]);

    return result;
};

export const getMostDonatedItemsDistribution = async () => {
    const result = await Donation.aggregate([
        {
            $unwind: {
                path: "$received_items",
                preserveNullAndEmptyArrays: false,
            },
        },
        {
            $group: {
                _id: {
                    $ifNull: ["$received_items.item_name", "Unknown Item"],
                },
                totalQuantity: {
                    $sum: {
                        $ifNull: ["$received_items.quantity", 0],
                    },
                },
                donationCount: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                itemName: "$_id",
                totalQuantity: 1,
                donationCount: 1,
            },
        },
        {
            $sort: {
                totalQuantity: -1,
            },
        },
        {
            $limit: 10,
        },
    ]);

    return result;
};

export const getCancerTypeDonationPattern = async () => {
    const result = await Donation.aggregate([
        {
            $lookup: {
                from: "patients",
                localField: "patient_id",
                foreignField: "_id",
                as: "patient",
            },
        },
        {
            $unwind: {
                path: "$patient",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $unwind: {
                path: "$received_items",
                preserveNullAndEmptyArrays: false,
            },
        },
        {
            $group: {
                _id: {
                    cancerType: {
                        $ifNull: ["$patient.cancer_type", "$patient.medical_condition"],
                    },
                    itemName: {
                        $ifNull: ["$received_items.item_name", "Unknown Item"],
                    },
                },
                totalQuantity: {
                    $sum: {
                        $ifNull: ["$received_items.quantity", 0],
                    },
                },
            },
        },
        {
            $project: {
                _id: 0,
                cancerType: {
                    $ifNull: ["$_id.cancerType", "Unknown Cancer Type"],
                },
                itemName: "$_id.itemName",
                totalQuantity: 1,
            },
        },
        {
            $sort: {
                cancerType: 1,
                totalQuantity: -1,
            },
        },
    ]);

    const cancerMap = {};

    result.forEach((row) => {
        if (!cancerMap[row.cancerType]) {
            cancerMap[row.cancerType] = {
                cancerType: row.cancerType,
            };
        }

        cancerMap[row.cancerType][row.itemName] = row.totalQuantity;
    });

    return Object.values(cancerMap);
};

export const getMonthlyDemandForecast = async () => {
    const monthlyDemand = await SupportRequest.aggregate([
        {
            $group: {
                _id: {
                    year: { $year: "$created_at" },
                    month: { $month: "$created_at" },
                },
                totalRequests: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                ds: {
                    $dateToString: {
                        format: "%Y-%m-01",
                        date: {
                            $dateFromParts: {
                                year: "$_id.year",
                                month: "$_id.month",
                                day: 1,
                            },
                        },
                    },
                },
                y: "$totalRequests",
            },
        },
        { $sort: { ds: 1 } },
    ]);

    const forecastResponse = await axios.post(
        "http://127.0.0.1:5000/forecast/monthly-demand",
        {
            data: monthlyDemand,
            periods: 6,
        }
    );

    return {
        actual: monthlyDemand.map((item) => ({
            month: item.ds.slice(0, 7),
            actualRequests: item.y,
        })),
        forecast: forecastResponse.data.data || [],
    };
};

// export const getDonationShortageAnalysis = async () => {
//     const requestedItems = await SupportRequest.aggregate([
//         {
//             $unwind: {
//                 path: "$items",
//                 preserveNullAndEmptyArrays: false,
//             },
//         },
//         {
//             $group: {
//                 _id: {
//                     $ifNull: ["$items.item_name", "Unknown Item"],
//                 },
//                 requestedQuantity: {
//                     $sum: {
//                         $ifNull: ["$items.quantity", 0],
//                     },
//                 },
//             },
//         },
//     ]);

//     const donatedItems = await Donation.aggregate([
//         {
//             $unwind: {
//                 path: "$received_items",
//                 preserveNullAndEmptyArrays: false,
//             },
//         },
//         {
//             $group: {
//                 _id: {
//                     $ifNull: ["$received_items.item_name", "Unknown Item"],
//                 },
//                 donatedQuantity: {
//                     $sum: {
//                         $ifNull: ["$received_items.quantity", 0],
//                     },
//                 },
//             },
//         },
//     ]);

//     const donatedMap = new Map();

//     donatedItems.forEach((item) => {
//         donatedMap.set(item._id, item.donatedQuantity);
//     });

//     const result = requestedItems.map((item) => {
//         const donatedQuantity = donatedMap.get(item._id) || 0;
//         const shortageQuantity = item.requestedQuantity - donatedQuantity;

//         return {
//             itemName: item._id,
//             requestedQuantity: item.requestedQuantity,
//             donatedQuantity,
//             shortageQuantity: shortageQuantity > 0 ? shortageQuantity : 0,
//             status:
//                 shortageQuantity > 0
//                     ? "shortage"
//                     : donatedQuantity > item.requestedQuantity
//                         ? "surplus"
//                         : "balanced",
//         };
//     });

//     return result.sort((a, b) => b.shortageQuantity - a.shortageQuantity);
// };

const normalizeSupportCategory = (value) => {
    if (!value) return null;

    const text = value.toLowerCase().trim();

    if (
        text.includes("medical") ||
        text.includes("medicine") ||
        text.includes("drug")
    ) {
        return "medical_support";
    }

    if (
        text.includes("nutrition") ||
        text.includes("nutrient")
    ) {
        return "nutrition_support";
    }

    if (
        text.includes("supplement") ||
        text.includes("suppliment")
    ) {
        return "supplement_support";
    }

    return null;
};

export const getDonationShortageAnalysis = async () => {
    const latestSupport = await SupportRequest.findOne()
        .sort({ created_at: -1 })
        .select("created_at");

    const latestDonation = await Donation.findOne()
        .sort({ created_at: -1 })
        .select("created_at");

    const latestDate = new Date(
        Math.max(
            latestSupport?.created_at?.getTime() || 0,
            latestDonation?.created_at?.getTime() || 0
        )
    );

    const startDate = new Date(latestDate);
    startDate.setMonth(startDate.getMonth() - 6);

    const requestedRows = await SupportRequest.aggregate([
        {
            $match: {
                created_at: {
                    $gte: startDate,
                    $lte: latestDate,
                },
            },
        },
        {
            $unwind: {
                path: "$items",
                preserveNullAndEmptyArrays: false,
            },
        },
        {
            $project: {
                rawCategory: "$request_type",
                quantity: {
                    $ifNull: ["$items.quantity", 0],
                },
            },
        },
    ]);

    const donatedRows = await Donation.aggregate([
        {
            $match: {
                created_at: {
                    $gte: startDate,
                    $lte: latestDate,
                },
            },
        },
        {
            $unwind: {
                path: "$received_items",
                preserveNullAndEmptyArrays: false,
            },
        },
        {
            $project: {
                rawCategory: "$donation_type",
                quantity: {
                    $ifNull: ["$received_items.quantity", 0],
                },
            },
        },
    ]);

    const categories = [
        "medical_support",
        "nutrition_support",
        "supplement_support",
    ];

    const requestedMap = new Map();
    const donatedMap = new Map();

    categories.forEach((category) => {
        requestedMap.set(category, 0);
        donatedMap.set(category, 0);
    });

    requestedRows.forEach((row) => {
        const category = normalizeSupportCategory(row.rawCategory);

        if (category && requestedMap.has(category)) {
            requestedMap.set(
                category,
                requestedMap.get(category) + row.quantity
            );
        }
    });

    donatedRows.forEach((row) => {
        const category = normalizeSupportCategory(row.rawCategory);

        if (category && donatedMap.has(category)) {
            donatedMap.set(
                category,
                donatedMap.get(category) + row.quantity
            );
        }
    });

    return categories.map((category) => {
        const requestedQuantity = requestedMap.get(category) || 0;
        const donatedQuantity = donatedMap.get(category) || 0;
        const shortage = requestedQuantity - donatedQuantity;

        return {
            itemName: category,
            requestedQuantity,
            donatedQuantity,
            shortageQuantity: shortage > 0 ? shortage : 0,
            surplusQuantity: shortage < 0 ? Math.abs(shortage) : 0,
            shortagePercentage:
                requestedQuantity > 0
                    ? Number(
                        (((shortage > 0 ? shortage : 0) / requestedQuantity) * 100).toFixed(2)
                    )
                    : 0,
            status:
                shortage > 0
                    ? "shortage"
                    : shortage < 0
                        ? "surplus"
                        : "balanced",
            period: {
                from: startDate.toISOString().slice(0, 10),
                to: latestDate.toISOString().slice(0, 10),
            },
        };
    });
};

export const getMonthlyDonationForecast = async (months = 6) => {
    const monthlyDonations = await Donation.aggregate([
        {
            $unwind: {
                path: "$received_items",
                preserveNullAndEmptyArrays: false,
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: "$created_at" },
                    month: { $month: "$created_at" },
                },
                totalQuantity: {
                    $sum: {
                        $ifNull: ["$received_items.quantity", 0],
                    },
                },
            },
        },
        {
            $project: {
                _id: 0,
                ds: {
                    $dateToString: {
                        format: "%Y-%m-01",
                        date: {
                            $dateFromParts: {
                                year: "$_id.year",
                                month: "$_id.month",
                                day: 1,
                            },
                        },
                    },
                },
                y: "$totalQuantity",
            },
        },
        { $sort: { ds: 1 } },
    ]);

    const forecastResponse = await axios.post(
        "http://127.0.0.1:5000/forecast/monthly-demand",
        {
            data: monthlyDonations,
            periods: months,
        }
    );

    return {
        actual: monthlyDonations.map((item) => ({
            month: item.ds.slice(0, 7),
            actualQuantity: item.y,
        })),
        forecast: forecastResponse.data.data || [],
    };
};

export const getRiskForecast = async (months = 6) => {
    const demandForecast = await getMonthlyDemandForecast(months);
    const donationForecast = await getMonthlyDonationForecast(months);

    const demandData = demandForecast.forecast || [];
    const donationData = donationForecast.forecast || [];

    const riskData = demandData.map((demandItem) => {
        const donationItem = donationData.find(
            (item) => item.month === demandItem.month
        );

        const forecastDemand = demandItem.forecastRequests || 0;
        const forecastDonations = donationItem?.forecastRequests || 0;

        const shortage = forecastDemand - forecastDonations;

        let riskLevel = "low";

        if (shortage >= 20) {
            riskLevel = "high";
        } else if (shortage >= 10) {
            riskLevel = "medium";
        }

        return {
            month: demandItem.month,
            forecastDemand,
            forecastDonations,
            shortage: shortage > 0 ? shortage : 0,
            surplus: shortage < 0 ? Math.abs(shortage) : 0,
            riskLevel,
            demandLowerBound: demandItem.lowerBound,
            demandUpperBound: demandItem.upperBound,
            donationLowerBound: donationItem?.lowerBound || 0,
            donationUpperBound: donationItem?.upperBound || 0,
        };
    });

    return riskData;
};