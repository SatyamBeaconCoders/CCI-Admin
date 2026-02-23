import api from "./api";

export const getMembers = () => api.get("/members");
export const getMemberById = (id) => api.get(`/members/${id}`);
export const createMember = (data) => api.post("/members", data);
export const updateMember = (id, data) => api.put(`/members/${id}`, data);
export const deleteMember = (id) => api.delete(`/members/${id}`);
export const lookupMember = (membershipNo) => api.get(`/members/lookup/${membershipNo}`);