import api from "./api";

export const CourseService = {
  // ==== COURSE ====
  getAllCourses: () => api.get("/course"),
  getCourseById: (id: number) => api.get(`/course/${id}`),
  createCourse: (data: { course_name: string; description?: string }) =>
    api.post("/course", data),
  updateCourse: (
    id: number,
    data: { course_name?: string; description?: string }
  ) => api.put(`/course/${id}`, data),
  deleteCourse: (id: number) => api.delete(`/course/${id}`),

  // ==== COURSE MEMBERS ====
  getAllCourseMembers: () => api.get("/course-members"),
  getCourseMemberById: (id: number) => api.get(`/course-members/${id}`),
  addCourseMember: (data: {
    user_id: number;
    course_id: number;
    role: "admin" | "lecturer" | "student";
  }) => api.post("/course-members", data),
  updateCourseMember: (
    id: number,
    data: { role?: "admin" | "lecturer" | "student" }
  ) => api.put(`/course-members/${id}`, data),
  deleteCourseMember: (id: number) => api.delete(`/course-members/${id}`),
};
