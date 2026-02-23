import api from "./api";

export const getSettings = () => api.get("/settings");
export const createOrUpdateSetting = (data) => api.post("/settings", data);
export const deleteSetting = (key) => api.delete(`/settings/${key}`);