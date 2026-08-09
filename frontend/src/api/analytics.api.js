import api from "../utils/axios.js";

const getDashboardAnalytics = () => {
    return api.get("/analytics/dashboard");
};

export { getDashboardAnalytics };