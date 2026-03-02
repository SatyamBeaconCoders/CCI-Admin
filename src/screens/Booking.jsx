import { useEffect, useState } from "react";
import { Calendar, User, Users, Home, X, CheckCircle, AlertCircle, Edit2, Trash2, Eye, Search, Filter, CreditCard, DollarSign, Plus } from "lucide-react";
import {
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
  checkIn,
  checkOut,
  getPayments,
  addPayment,
  deletePayment,
} from "../services/bookingServices";
import { getRooms } from "../services/roomServices";

export default function Bookings() {
  /* ================= STATE ================= */
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    room_id: "",
    guest_name: "",
    total_guest: 1,
    childrens: 0,
    check_in: "",
    check_out: "",
  });

  const [availableRooms, setAvailableRooms] = useState([]);

  // Payment State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payments, setPayments] = useState([]);
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    payment_mode: "Cash",
    remarks: ""
  });

  /* ================= NORMALIZE ================= */
  const normalizeBooking = (b) => {
    const room =
      Array.isArray(b.rooms) && b.rooms.length > 0
        ? b.rooms[0]
        : null;

    return {
      id: b.id,
      guest_name: b.guest_name,
      room_id: room?.id || null,
      room_no: room?.room_no || "-",
      room_type: room?.type || "-",
      check_in: b.check_in?.slice(0, 10),
      check_out: b.check_out?.slice(0, 10),
      status: b.status,
      total_amt: b.total_amt,
      total_guest: b.total_guest || 1,
      childrens: b.childrens || 0,
    };
  };

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const [bookingRes, roomRes] = await Promise.all([
        getBookings(),
        getRooms(),
      ]);

      console.log("📦 RAW BOOKINGS RESPONSE 👉", bookingRes.data);
      console.log("🏨 RAW ROOMS RESPONSE 👉", roomRes.data);

      setBookings(
        Array.isArray(bookingRes.data.data)
          ? bookingRes.data.data.map(normalizeBooking)
          : []
      );

      const roomsData = Array.isArray(roomRes.data) ? roomRes.data : [];
      setRooms(roomsData);

      // Initially show all rooms
      setAvailableRooms(roomsData);

    } catch (e) {
      console.error("❌ FETCH ERROR 👉", e);
      setErrorMessage("Data load failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= CHECK ROOM AVAILABILITY ================= */
  useEffect(() => {
    if (form.check_in && form.check_out) {
      checkAvailability();
    }
  }, [form.check_in, form.check_out, bookings]);

  const checkAvailability = () => {
    if (!form.check_in || !form.check_out || form.check_out <= form.check_in) {
      setAvailableRooms(rooms);
      return;
    }

    // Find conflicting bookings
    const conflictingBookingIds = bookings
      .filter(booking => {
        // Skip if room_id is not available or booking is checked-out/cancelled
        if (!booking.room_id || booking.status === "Checked-out" || booking.status === "Cancelled") {
          return false;
        }

        const bookingCheckIn = new Date(booking.check_in);
        const bookingCheckOut = new Date(booking.check_out);
        const selectedCheckIn = new Date(form.check_in);
        const selectedCheckOut = new Date(form.check_out);

        // Check for date overlap
        return (
          (selectedCheckIn >= bookingCheckIn && selectedCheckIn < bookingCheckOut) ||
          (selectedCheckOut > bookingCheckIn && selectedCheckOut <= bookingCheckOut) ||
          (selectedCheckIn <= bookingCheckIn && selectedCheckOut >= bookingCheckOut)
        );
      })
      .map(booking => booking.room_id);

    // Filter available rooms
    const available = rooms.filter(room =>
      !conflictingBookingIds.includes(room.id)
    );

    setAvailableRooms(available);

    // If currently selected room is not available, reset it
    if (form.room_id && !available.find(r => r.id == form.room_id)) {
      setForm(prev => ({ ...prev, room_id: "" }));
    }
  };

  /* ================= FORM ================= */
  const resetForm = () => {
    console.log("♻️ RESET FORM");
    setForm({
      room_id: "",
      guest_name: "",
      total_guest: 1,
      childrens: 0,
      check_in: "",
      check_out: "",
    });
    setEditing(null);
    setErrorMessage("");
    setAvailableRooms(rooms);
  };

  const submitForm = async () => {
    console.log("📝 CURRENT FORM STATE 👉", form);

    // Validation
    if (!form.room_id || !form.guest_name || !form.check_in || !form.check_out) {
      setErrorMessage("All fields are required");
      return;
    }

    if (form.check_out <= form.check_in) {
      setErrorMessage("Check-out must be after check-in");
      return;
    }

    // Check guest limit
    const selectedRoom = rooms.find(r => r.id == form.room_id);
    if (selectedRoom && form.total_guest > selectedRoom.guest_limit) {
      setErrorMessage(`Guest limit exceeded. Maximum allowed: ${selectedRoom.guest_limit}`);
      return;
    }

    // Check if room is still available
    const isRoomAvailable = availableRooms.some(r => r.id == form.room_id);
    if (!isRoomAvailable) {
      setErrorMessage("Selected room is no longer available. Please choose another room.");
      return;
    }

    // 🔥 EXACT POSTMAN PAYLOAD
    const payload = {
      room_id: Number(form.room_id),
      guest_name: form.guest_name,
      total_guest: Number(form.total_guest),
      childrens: Number(form.childrens),
      check_in: form.check_in,
      check_out: form.check_out,
    };

    console.log("🚀 FINAL PAYLOAD (POSTMAN MATCH) 👉", payload);

    try {
      setErrorMessage("");
      if (editing) {
        console.log("✏️ UPDATE BOOKING 👉", editing.id);
        await updateBooking(editing.id, payload);
      } else {
        console.log("➕ CREATE BOOKING");
        await createBooking(payload);
      }

      setShowForm(false);
      resetForm();
      fetchAll();
    } catch (err) {
      console.error("❌ BACKEND ERROR 👉", err.response?.data);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || "Booking failed. Please try again.";
      setErrorMessage(errorMsg);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      console.log("🗑 DELETE BOOKING 👉", id);
      await deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch {
      setErrorMessage("Delete failed. Please try again.");
    }
  };

  /* ================= STATUS ================= */
  const handleStatusChange = async (b, status) => {
    try {
      console.log("🔁 STATUS CHANGE 👉", b.id, status);
      setErrorMessage("");

      if (status === "Checked-in") {
        await checkIn(b.id);
      } else if (status === "Checked-out") {
        await checkOut(b.id);
      } else {
        await updateBooking(b.id, { status });
      }

      setBookings((prev) =>
        prev.map((x) => (x.id === b.id ? { ...x, status } : x))
      );
    } catch (err) {
      console.error("❌ STATUS UPDATE ERROR 👉", err.response?.data);
      setErrorMessage("Status update failed. Please try again.");
    }
  };

  /* ================= FILTER BOOKINGS ================= */
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.room_no.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      booking.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed": return "bg-blue-100 text-blue-800";
      case "Checked-in": return "bg-green-100 text-green-800";
      case "Checked-out": return "bg-gray-100 text-gray-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  /* ================= PAYMENT HANDLERS ================= */
  const openPaymentModal = async (booking) => {
    setSelectedBookingForPayment(booking);
    setPaymentForm({ amount: "", payment_mode: "Cash", remarks: "" });
    setShowPaymentModal(true);
    setPaymentLoading(true);
    try {
      const res = await getPayments(booking.id);
      console.log("💰 PAYMENTS FOR BOOKING", booking.id, res.data);
      // Ensure we're setting an array
      setPayments(Array.isArray(res.data) ? res.data : (res.data.data || []));
    } catch (err) {
      console.error("Failed to fetch payments", err);
      // Don't show error to user immediately on open, just log
      setPayments([]);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!paymentForm.amount || isNaN(paymentForm.amount) || Number(paymentForm.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      setPaymentLoading(true);
      const payload = {
        amount: Number(paymentForm.amount),
        payment_mode: paymentForm.payment_mode,
        remarks: paymentForm.remarks || "Payment"
      };

      console.log("💸 ADDING PAYMENT", payload);
      await addPayment(selectedBookingForPayment.id, payload);

      // Refresh payments list
      const res = await getPayments(selectedBookingForPayment.id);
      setPayments(Array.isArray(res.data) ? res.data : (res.data.data || []));

      // Reset form
      setPaymentForm({ amount: "", payment_mode: "Cash", remarks: "" });
    } catch (err) {
      console.error("Payment failed", err);
      alert("Failed to add payment. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleDeletePayment = async (paymentId) => {
    if (!window.confirm("Are you sure you want to delete this payment transaction?")) return;

    try {
      setPaymentLoading(true);
      await deletePayment(paymentId);

      // Refresh payments list
      const res = await getPayments(selectedBookingForPayment.id);
      setPayments(Array.isArray(res.data) ? res.data : (res.data.data || []));
    } catch (err) {
      console.error("Delete payment failed", err);
      alert("Failed to delete payment.");
    } finally {
      setPaymentLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading bookings...</p>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Bookings Management</h1>
          <p className="text-gray-600 mt-1">Manage all hotel bookings and room assignments</p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{errorMessage}</p>
            <button onClick={() => setErrorMessage("")} className="ml-auto">
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by guest or room..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="checked-in">Checked-in</option>
                  <option value="checked-out">Checked-out</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

          
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-600">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-600">Active Guests</p>
            <p className="text-2xl font-bold text-gray-900">
              {bookings.filter(b => b.status === "Checked-in").length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-600">Today's Check-ins</p>
            <p className="text-2xl font-bold text-gray-900">
              {bookings.filter(b =>
                b.check_in === new Date().toISOString().slice(0, 10) &&
                b.status === "Confirmed"
              ).length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-600">Available Rooms</p>
            <p className="text-2xl font-bold text-gray-900">
              {rooms.filter(r => r.status === "Available").length}
            </p>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Guest Details
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Room Details
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-gray-900">{b.guest_name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Users className="w-3 h-3 text-gray-400" />
                            <span className="text-sm text-gray-600">{b.total_guest} guests</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Users className="w-3 h-3 text-gray-400" />
                            <span className="text-sm text-gray-600">{b.childrens} children</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-gray-900">Room {b.room_no}</p>
                          <p className="text-sm text-gray-600">{b.room_type}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span className="text-sm">{b.check_in}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span className="text-sm">{b.check_out}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(b.status)}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <select
                            value={b.status}
                            onChange={(e) => handleStatusChange(b, e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Checked-in">Checked-in</option>
                            <option value="Checked-out">Checked-out</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>

                          <button
                            onClick={() => openPaymentModal(b)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Payments"
                          >
                            <CreditCard className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              console.log("✏️ EDIT BOOKING 👉", b);
                              setEditing(b);
                              setForm({
                                room_id: b.room_id,
                                guest_name: b.guest_name,
                                total_guest: b.total_guest || 1,
                                childrens: b.childrens || 0,
                                check_in: b.check_in,
                                check_out: b.check_out,
                              });
                              setShowForm(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(b.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Calendar className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-gray-500">No bookings found</p>
                        {searchTerm && (
                          <button
                            onClick={() => setSearchTerm("")}
                            className="mt-2 text-orange-600 hover:text-orange-700 text-sm font-medium"
                          >
                            Clear search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Booking Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {editing ? "Edit Booking" : "New Booking"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {editing ? "Update booking details" : "Create a new room booking"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Guest Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Guest Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter guest name"
                    value={form.guest_name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        guest_name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Room Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Home className="w-4 h-4 inline mr-2" />
                    Select Room
                  </label>
                  <select
                    value={form.room_id}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        room_id: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select Room</option>
                    {availableRooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.room_no} ({r.type}) - Max {r.guest_limit} guests
                        {r.price_3day && ` - ₹${r.price_3day}/night`}
                      </option>
                    ))}
                  </select>
                  {availableRooms.length === 0 && form.check_in && form.check_out && (
                    <p className="mt-2 text-sm text-red-600">
                      No rooms available for selected dates
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    {availableRooms.length} rooms available for selected dates
                  </p>
                </div>

                {/* Guest Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-2" />
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={rooms.find(r => r.id == form.room_id)?.guest_limit || 10}
                    value={form.total_guest}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        total_guest: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Children Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-2" />
                    Number of Children
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.childrens}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        childrens: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-in Date
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={form.check_in}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          check_in: e.target.value,
                          check_out: e.target.value >= form.check_out ? "" : form.check_out,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-out Date
                    </label>
                    <input
                      type="date"
                      min={form.check_in || new Date().toISOString().split('T')[0]}
                      value={form.check_out}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          check_out: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Date Range Info */}
                {form.check_in && form.check_out && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      {Math.ceil((new Date(form.check_out) - new Date(form.check_in)) / (1000 * 60 * 60 * 24))} nights
                    </p>
                  </div>
                )}

                {/* Error Display */}
                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{errorMessage}</p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitForm}
                  disabled={availableRooms.length === 0 && !editing}
                  className={`px-4 py-2 font-medium rounded-lg transition-colors flex items-center gap-2 ${availableRooms.length === 0 && !editing
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                    }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  {editing ? "Update Booking" : "Create Booking"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Management Modal */}
        {showPaymentModal && selectedBookingForPayment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 flex justify-between items-center rounded-t-2xl bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Payment & Billing</h3>
                    <p className="text-sm text-gray-600">
                      Guest: <span className="font-semibold text-gray-800">{selectedBookingForPayment.guest_name}</span> •
                      Room: <span className="font-semibold text-gray-800">{selectedBookingForPayment.room_no}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="p-2 hover:bg-white rounded-full transition-colors text-gray-500 hover:text-gray-700 hover:shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">

                {/* Financial Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Total Amount</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      ₹{selectedBookingForPayment.total_amt?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Total Paid</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      ₹{payments.reduce((sum, p) => sum + parseFloat(p.amount), 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">Balance Due</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      ₹{((selectedBookingForPayment.total_amt || 0) - payments.reduce((sum, p) => sum + parseFloat(p.amount), 0)).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                  {/* Left Column: Transaction History */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-800 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" /> Transaction History
                    </h4>

                    {paymentLoading && payments.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">Loading payments...</div>
                    ) : payments.length > 0 ? (
                      <div className="bg-white border border-gray-100 rounded-xl shadow-sm divide-y divide-gray-100">
                        {payments.map((payment) => (
                          <div key={payment.id} className="p-4 hover:bg-gray-50 transition-colors group">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-bold text-gray-900 text-lg">₹{parseFloat(payment.amount).toLocaleString()}</p>
                                <p className="text-xs text-gray-500">{new Date(payment.created_at || Date.now()).toLocaleDateString()}</p>
                              </div>
                              <div className="text-right">
                                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium mb-1">
                                  {payment.payment_mode}
                                </span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <p className="text-sm text-gray-600 italic">
                                "{payment.remarks || 'No remarks'}"
                              </p>
                              <button
                                onClick={() => handleDeletePayment(payment.id)}
                                disabled={paymentLoading}
                                className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                title="Delete Transaction"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400">
                        No payments recorded yet
                      </div>
                    )}
                  </div>

                  {/* Right Column: New Payment Form */}
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 h-fit">
                    <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                      <Plus className="w-4 h-4" /> Record New Payment
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                          <input
                            type="number"
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                            placeholder="0.00"
                            value={paymentForm.amount}
                            onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
                        <select
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                          value={paymentForm.payment_mode}
                          onChange={(e) => setPaymentForm({ ...paymentForm, payment_mode: e.target.value })}
                        >
                          <option value="Cash">Cash</option>
                          <option value="UPI">UPI</option>
                          <option value="Card">Card</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                        <textarea
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm"
                          rows="3"
                          placeholder="Advance, Full Settlement, etc."
                          value={paymentForm.remarks}
                          onChange={(e) => setPaymentForm({ ...paymentForm, remarks: e.target.value })}
                        ></textarea>
                      </div>

                      <button
                        onClick={handlePaymentSubmit}
                        disabled={paymentLoading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-green-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {paymentLoading ? (
                          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5" /> Record Payment
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}