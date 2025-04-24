import api from "./api";

export const readingService = {
  getAllReadingKeys: () => api.get("reading/get-all-reading-key"),

  getReadingById: (reading_test_id: number) =>
    api.post("reading/reading-id-test", { reading_test_id }),

  createReadingTest: (data: {
    key_test: string;
    tittle: string;
    description: string;
    duration: number;
  }) => api.post("reading/create-test", data),

  createReadingPart1: (data: any) => api.post("reading/create-part1", data),
  createReadingPart2: (data: any) => api.post("reading/create-part2", data),
  createReadingPart3: (data: any) => api.post("reading/create-part3", data),
  createReadingPart4: (data: any) => api.post("reading/create-part4", data),
  createReadingPart5: (data: any) => api.post("reading/create-part5", data),

  updateReadingPart1: (id: number, data: any) => api.put(`reading/update-part1/${id}`, data),
  updateReadingPart2: (id: number, data: any) => api.put(`reading/update-part2/${id}`, data),
  updateReadingPart3: (id: number, data: any) => api.put(`reading/update-part3/${id}`, data),
  updateReadingPart4: (id: number, data: any) => api.put(`reading/update-part4/${id}`, data),
  updateReadingPart5: (id: number, data: any) => api.put(`reading/update-part5/${id}`, data),

  deleteReadingPart1: (id: number) => api.delete(`reading/delete-part1/${id}`),
  deleteReadingPart2: (id: number) => api.delete(`reading/delete-part2/${id}`),
  deleteReadingPart3: (id: number) => api.delete(`reading/delete-part3/${id}`),
  deleteReadingPart4: (id: number) => api.delete(`reading/delete-part4/${id}`),
  deleteReadingPart5: (id: number) => api.delete(`reading/delete-part5/${id}`),
};
