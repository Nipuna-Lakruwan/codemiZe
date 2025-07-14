export const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    CREATE_USER: "/api/v1/auth/signup",
    CREATE_SCHOOL: "/api/v1/auth/signup-school",
    GET_USER_INFO: "/api/v1/auth/getUserInfo",
  },
};