import api from "../utils/axios.js";

const getCurrentUser = () => {
    return api.get("/users/current-user");
};

export { getCurrentUser };