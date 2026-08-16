import api from "../utils/axios.js";

const getCurrentUser = () => {
    return api.get("/users/current-user");
};

const registerUser = (user) => {
    return api.post("/users/team", user);
}

const getTeamMembers = () => {
    return api.get("/users/team");
}

const updateTeamMember = (userId, user) => {
    return api.patch(`/users/team/${userId}`, user);
}

export { getCurrentUser, registerUser, getTeamMembers, updateTeamMember };