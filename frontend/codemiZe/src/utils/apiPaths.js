export const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    LOGOUT: "/api/v1/auth/logout",
    CREATE_USER: "/api/v1/auth/signup",
    CREATE_SCHOOL: "/api/v1/auth/signup-school",
    GET_USER_INFO: "/api/v1/auth/getUserInfo",
  },
  GAMES: {
    GET_ALL_GAMES: "/api/v1/games",
    GET_ACTIVE_GAME: "/api/v1/games/active",
    ACTIVATE_GAME: (gameId) => `/api/v1/games/activate/${gameId}`,
    DEACTIVATE_GAME: (gameId) => `/api/v1/games/deactivate/${gameId}`,
  },
};