import api from "./api.js";

export default {
  list(params = {}) {
    return api.get("/users", { params }).catch((err) => {
      if (err?.response?.status === 404) {
        return api.get("/getakunv2", { params });
      }
      throw err;
    });
  },
  update(id, payload) {
    return api.patch(`/users/${id}`, payload);
  },
  getDetail(id) {
    return api.get(`/users/${id}`);
  },
  tryoutSummary(id) {
    return api.get(`/users/${id}/tryout-summary`);
  },
};
