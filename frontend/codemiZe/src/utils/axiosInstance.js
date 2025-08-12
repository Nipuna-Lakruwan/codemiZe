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
    (response) => response,
    (error) => {
        if (error.response) {
            const { status } = error.response;
            const currentPath = window.location.pathname;
            const isAuthCheckRequest = error.config?.url?.includes('/getUserInfo');

            if (status === 401 && currentPath !== '/' && !isAuthCheckRequest) {
                console.log('Authentication required - redirecting to login');
                window.location.href = "/";
            } else if (status === 500) {
                console.error("Server error. Please try again later.");
            }
        } else if (error.code === "ECONNABORTED") {
            console.error("Request timeout. Please try again later.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;