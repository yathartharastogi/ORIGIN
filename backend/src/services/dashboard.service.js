import {
  getDashboardSummary as getSummary,
} from "../repositories/dashboard.repository.js";


const getDashboardSummary = async () => {
  return getSummary();
};


export {
  getDashboardSummary,
};