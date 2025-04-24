import api from "./api";

export const listeningService = {
  getListeningById: (data: { listening_test_id: number }) =>
    api.post("listening/listening-id-test", data),

  getAllListeningKeys: () => api.get("listening/get-all-listening-key"),

  createListeningTest: (data: {
    key_test: string;
    tittle: string;
    description: string;
    duration: number;
  }) => api.post("listening/create-test", data),

  createListeningItem: (data: any) => api.post("listening/create-item", data),

  updateListeningTest: (
    listening_test_id: number,
    data: {
      key_test: string;
      tittle: string;
      description: string;
      duration: number;
    }
  ) => api.put(`listening/update-test/${listening_test_id}`, data),
  updateListeningItem: (
    listening_test_items_id: number,
    data: any
  ) => api.put(`listening/update-item/${listening_test_items_id}`, data),
  deleteListeningItem: (id: number) =>
    api.delete(`listening/delete-item/${id}`),
};
