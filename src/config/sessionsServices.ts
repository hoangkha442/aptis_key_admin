import api from "./api";

export const sessionsService = {
  // Lấy danh sách session của một user
  getUserSessions: (user_id: number) =>
    api.get(`/user-sessions/user/${user_id}`),

  // Xoá một session theo ID
  deleteSession: (session_id: string) =>
    api.delete(`/user-sessions/session/${session_id}`),
};
