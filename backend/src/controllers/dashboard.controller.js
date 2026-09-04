import {
  getDashboardSummary,
} from "../services/dashboard.service.js";


const getSummary = async (req, res) => {
  const summary =
    await getDashboardSummary();

  res.status(200).json({
    success: true,
    data: summary,
    error: null,
    meta: {
      requestId: req.id,
    },
  });
};


export {
  getSummary,
};