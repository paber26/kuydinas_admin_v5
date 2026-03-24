import api from "./api.js";

export default {
  list(params = {}) {
    return api.get("/topup-packages", { params });
  },
  get(id) {
    return api.get(`/topup-packages/${id}`);
  },
  create(payload) {
    return api.post("/topup-packages", payload);
  },
  update(id, payload) {
    return api.put(`/topup-packages/${id}`, payload);
  },
  remove(id) {
    return api.delete(`/topup-packages/${id}`);
  },
};
