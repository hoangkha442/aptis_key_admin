import api from "./api";

export const userServices = {
  getAllUsers: () =>
    api.get("/user"),
  getUserById: (id: number) =>
    api.get(`/user/${id}`),
  updateUser: (id: number, data: any) =>
    api.put(`/user/${id}`, data),
  deleteUser: (id: number) =>
    api.delete(`/user/${id}`),
  createUser: (data: any) =>
    api.post("/user", data),
};
