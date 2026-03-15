import axiosInstance from "./axiosInstance";

export const getTasks = (params) => axiosInstance.get("/tasks", { params });
export const createTask = (data) => axiosInstance.post("/tasks", data);
export const updateTaskStatus = (data) => axiosInstance.patch("/tasks/status", data);