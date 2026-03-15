import axiosInstance from "./axiosInstance";

export const inviteUser = (data) => axiosInstance.post("/users", data);
export const setPassword = (data) => axiosInstance.post("/users/set-password", data);
export const getUsers = () => axiosInstance.get("/users");