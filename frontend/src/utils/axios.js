import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URI,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/auth/login") &&
            !originalRequest.url?.includes("/auth/refresh-token")
        ) {
            originalRequest._retry = true;

            try {
                await axios.post(
                    `${import.meta.env.VITE_API_BASE_URI}/auth/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                return api(originalRequest);
            } catch (refreshError) {
                // Only redirect if not already on the auth page to prevent infinite reload loops
                if (window.location.pathname !== "/auth" && !originalRequest.url?.includes("/users/current-user")) {
                    window.location.href = "/auth";
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;