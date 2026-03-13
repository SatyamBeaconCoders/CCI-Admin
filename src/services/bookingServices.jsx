import api from "../services/api";

export const getBookings = () => api.get("/bookings");


export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const createBooking = (data) => api.post("/bookings", data);
export const updateBooking = (id, data) => api.post(`/bookings/${id}`, { ...data, _method: "PUT" });
export const deleteBooking = (id) => api.delete(`/bookings/${id}`);

export const checkIn = (id) =>
  api.post(`/bookings/${id}/check-in`);

export const checkOut = (id) =>
  api.post(`/bookings/${id}/check-out`);

export const getPayments = (bookingId) => api.get(`/bookings/${bookingId}/payments`);

export const addPayment = (bookingId, data) => api.post(`/bookings/${bookingId}/payments`, data);

export const deletePayment = (paymentId) => api.delete(`/payments/${paymentId}`);
