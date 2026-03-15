import axiosInstance from "./axiosInstance";

export const getProjects = (params) => axiosInstance.get("/projects", { params });
export const createProject = (data) => axiosInstance.post("/projects", data);
export const updateProject = (id, data) => axiosInstance.put(`/projects/${id}`, data);
export const deleteProject = (id) => axiosInstance.delete(`/projects/${id}`);