import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "/api/v1/";

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// User Answers
export const submitUserAnswer = data => apiClient.post("/user-answers", data);

// Elements
export const createElement = data => apiClient.post("/elements", data);
export const setCorrectAnswer = (elementId, data) =>
  apiClient.put(`/elements/${elementId}/right-answer`, data);

// Leaderboard
export const getLeaderboard = params =>
  apiClient.get("/leaderboard", { params });

// Users
export const loginUser = data => apiClient.post("/users/login", data);
export const getUsers = () => apiClient.get("/users");
export const getUserById = userId => apiClient.get(`/users/${userId}`);

export default apiClient;
