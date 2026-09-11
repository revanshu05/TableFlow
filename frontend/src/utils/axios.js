import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URI,
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request interceptor: attach token from localStorage if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("tableflow_access_token");
        if (token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handle 401 with silent queued refresh
api.interceptors.response.use(
    (response) => {
        // Save tokens if returned in response (e.g. login or refresh)
        if (response.data?.data?.accessToken) {
            localStorage.setItem("tableflow_access_token", response.data.data.accessToken);
        }
        if (response.data?.data?.refreshToken) {
            localStorage.setItem("tableflow_refresh_token", response.data.data.refreshToken);
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/auth/login") &&
            !originalRequest.url?.includes("/auth/refresh-token")
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest._retry = true;
                        const validToken = token || localStorage.getItem("tableflow_access_token");
                        if (validToken) {
                            originalRequest.headers.Authorization = `Bearer ${validToken}`;
                        }
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const storedRefreshToken = localStorage.getItem("tableflow_refresh_token");

            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URI}/auth/refresh-token`,
                    { refreshToken: storedRefreshToken },
                    { 
                        withCredentials: true,
                        headers: storedRefreshToken ? { "x-refresh-token": storedRefreshToken } : {}
                    }
                );

                const newAccessToken = response.data?.data?.accessToken;
                const newRefreshToken = response.data?.data?.refreshToken;

                if (newAccessToken) {
                    localStorage.setItem("tableflow_access_token", newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }
                if (newRefreshToken) {
                    localStorage.setItem("tableflow_refresh_token", newRefreshToken);
                }

                processQueue(null, newAccessToken);
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.removeItem("tableflow_access_token");
                localStorage.removeItem("tableflow_refresh_token");

                // Only redirect if user is not already on auth page and not initial user check
                if (
                    window.location.pathname !== "/auth" &&
                    !originalRequest.url?.includes("/users/current-user")
                ) {
                    window.location.href = "/auth";
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;