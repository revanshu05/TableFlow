import api from "../utils/axios.js";

const loginUser = (credentials) => {
    return api.post("/auth/login", credentials);
};

const logoutUser = () => {
    return api.post("/auth/logout");
};

const refreshAccessToken = () => {
    return api.post("/auth/refresh-token");
};

export { loginUser, logoutUser, refreshAccessToken };