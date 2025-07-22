export const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

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
  CRITERIA: {
    GET_ALL: "/api/v1/criteria",
    CREATE: "/api/v1/criteria",
    UPDATE: (id) => `/api/v1/criteria/${id}`,
    DELETE: (id) => `/api/v1/criteria/${id}`,
  },
  BATTLE_BREAKERS: {
    GET_QUESTIONS: "/api/v1/battle-breakers",
    ADD_QUESTION: "/api/v1/battle-breakers/addQuestion",
    UPLOAD_CSV: "/api/v1/battle-breakers/uploadCSV",
    DELETE_QUESTION: (questionId) => `/api/v1/battle-breakers/deleteQuestion/${questionId}`,
    DELETE_ALL_QUESTIONS: "/api/v1/battle-breakers/deleteAllQuestions",
    BUZZER_PRESS: "/api/v1/battle-breakers/press",
    GET_DASHBOARD: (questionId) => `/api/v1/battle-breakers/school/${questionId}`,
  },
  QUIZ_HUNTERS: {
    GET_ALL_QUESTIONS: "/api/v1/quiz-hunters/",
    GET_Q_WITH_A: "/api/v1/quiz-hunters/QnA",
    ADD_QUESTION: "/api/v1/quiz-hunters/addQuestion",
    EDIT_QUESTION: (questionId) => `/api/v1/quiz-hunters/editQuestion/${questionId}`,
    DELETE_QUESTION: (questionId) => `/api/v1/quiz-hunters/deleteQuestion/${questionId}`,
    DELETE_ALL_QUESTIONS: "/api/v1/quiz-hunters/deleteAllQuestions",
    UPLOAD_CSV: "/api/v1/quiz-hunters/uploadCSV",
    SET_TIME: "/api/v1/quiz-hunters/setTime",
    SUBMIT: "/api/v1/quiz-hunters/submit",
  },
  CODE_CRUSHERS: {
    GET_SLIDES: "/api/v1/code-crushers/",
    UPLOAD_SLIDES: "/api/v1/code-crushers/slides",
    DELETE_ALL_SLIDES: "/api/v1/code-crushers/slides/delete",
    UPLOAD_RESOURCE: "/api/v1/code-crushers/upload",
    GET_ALL_RESOURCES: "/api/v1/code-crushers/resources",
    GET_RESOURCE: (id) => `/api/v1/code-crushers/resources/${id}`,
    SET_TIME: "/api/v1/code-crushers/time",
  },
};