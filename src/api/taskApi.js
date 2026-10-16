import api from "./axios";

export const getTasks = (status) =>
  api.get("/tasks", { params: status ? { status } : {} }).then((res) => res.data);

export const getTask = (id) => api.get(`/tasks/${id}`).then((res) => res.data);
export const createTask = (data) => api.post("/tasks", data).then((res) => res.data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data).then((res) => res.data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`).then((res) => res.data);
