import api from "./api";

export const getRooms = () => api.get("/rooms");
export const getRoomById = (id) => api.get(`/rooms/${id}`);
export const createRoom = (data) => api.post("/rooms", data);

// Try multiple methods for update — server may block PUT
export const updateRoom = async (id, data) => {
  try {
    // Try PATCH first (most Laravel APIs support this)
    return await api.patch(`/rooms/${id}`, data);
  } catch (err1) {
    console.warn("⚠️ PATCH failed, trying PUT...", err1.response?.status);
    try {
      return await api.put(`/rooms/${id}`, data);
    } catch (err2) {
      console.warn("⚠️ PUT failed, trying POST with _method...", err2.response?.status);
      return await api.post(`/rooms/${id}`, { ...data, _method: "PUT" });
    }
  }
};

export const deleteRoom = (id) => api.delete(`/rooms/${id}`);