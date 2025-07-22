import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8000",
    timeout: 10000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common errors globally
        if (error.response) {
            if (error.response.status === 401) {
                // Only redirect to login if we're not already on the login page
                // and if it's not an authentication check request
                const currentPath = window.location.pathname;
                const isAuthCheckRequest = error.config?.url?.includes('/getUserInfo');

                // Don't log 401 errors for auth check requests as they're expected
                if (!isAuthCheckRequest) {
                    console.log('Authentication required - redirecting to login');
                }

                if (currentPath !== '/' && !isAuthCheckRequest) {
                    window.location.href = "/";
                }
            } else if (error.response.status === 500) {
                console.error("Server error. Please try again later.");
            }
        } else if (error.code === "ECONNABORTED") {
            console.error("Request timeout. Please try again later.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;