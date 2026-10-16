import api from "./axios";

export const updateMe = (data) => api.put("/users/me", data).then((res) => res.data);
export const deleteMe = () => api.delete("/users/me").then((res) => res.data);
export const getAllUsers = () => api.get("/users").then((res) => res.data);
export const deleteUser = (id) => api.delete(`/users/${id}`).then((res) => res.data);
