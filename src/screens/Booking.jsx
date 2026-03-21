import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Calendar,
  User,
  Users,
  Home,
  X,
  CheckCircle,
  AlertCircle,
  Pencil,
  Edit2,
  Trash2,
  Eye,
  Search,
  Filter,
  CreditCard,
  DollarSign,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from "lucide-react";
import {
  PageLayout,
  EmptyState,
  ContentCard,
  Pagination,
  Modal,
} from "../components/UIComponents";
import {
  safeString,
  safeArray,
  safeNumber,
  FALLBACK,
  logMissing,
} from "../utils/dataUtils";

/* ================= STATUS CONSTANTS ================= */
const STATUS = {
  CONFIRMED: "Confirmed",
  CHECKED_IN: "Checked-in",
  CHECKED_OUT: "Checked-out",
  CANCELLED: "Cancelled",
};

const STATUS_TRANSITIONS = {
  [STATUS.CONFIRMED]: [STATUS.CONFIRMED, STATUS.CHECKED_IN, STATUS.CANCELLED],
  [STATUS.CHECKED_IN]: [STATUS.CHECKED_IN, STATUS.CHECKED_OUT],
  [STATUS.CHECKED_OUT]: [STATUS.CHECKED_OUT],
  [STATUS.CANCELLED]: [STATUS.CANCELLED],
};

const getAllowedStatuses = (status) => STATUS_TRANSITIONS[status] || [status];

const getConfirmationMessage = (newStatus) => {
  switch (newStatus) {
    case STATUS.CHECKED_IN:
      return "Confirm check-in for this booking?";
    case STATUS.CHECKED_OUT:
      return "Confirm check-out for this booking?";
    case STATUS.CANCELLED:
      return "Are you sure you want to cancel this booking?";
    default:
      return `Change status to ${newStatus}?`;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case STATUS.CONFIRMED:
      return "bg-blue-100 text-blue-800 border-blue-200 shadow-sm";
    case STATUS.CHECKED_IN:
      return "bg-emerald-100 text-emerald-800 border-emerald-200 shadow-sm";
    case STATUS.CHECKED_OUT:
      return "bg-gray-100 text-gray-700 border-gray-200 shadow-inner";
    case STATUS.CANCELLED:
      return "bg-rose-100 text-rose-700 border-rose-200 shadow-sm";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};
import {
  getBookings,
  getBookingById,
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
  const navigate = useNavigate();
  /* ================= STATE ================= */
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    room_ids: [],
    guest_name: "",
    total_guest: 1,
    childrens: 0,
    check_in: "",
    check_out: "",
  });

  const [availableRooms, setAvailableRooms] = useState([]);

  // Status Loading Map (per-ID to support parallel updates)
  const [loadingMap, setLoadingMap] = useState({});
  // Which row is in dropdown-edit mode
  const [editingId, setEditingId] = useState(null);

  // Unified Booking Detail Modal state
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailTab, setDetailTab] = useState("info"); // "info" | "payments"
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Refs for concurrency & memory safety
  const abortRef = useRef({}); // AbortController per booking id
  const prevStatusRef = useRef({}); // Previous status per booking id for rollback
  const syncTimeoutRef = useRef({}); // Per-ID debounced sync timers
  const isMounted = useRef(true);

  const [isRowsDropdownOpen, setIsRowsDropdownOpen] = useState(false);
  const rowsDropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        rowsDropdownRef.current &&
        !rowsDropdownRef.current.contains(event.target)
      ) {
        setIsRowsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when expanded
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  // Cleanup on unmount
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      Object.values(abortRef.current).forEach((c) => c?.abort?.());
      abortRef.current = {};
      Object.values(syncTimeoutRef.current).forEach(clearTimeout);
      syncTimeoutRef.current = {};
    };
  }, []);
  // Payment State
  const [payments, setPayments] = useState([]);
  const [selectedBookingForPayment, setSelectedBookingForPayment] =
    useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSearchTerm, setPaymentSearchTerm] = useState("");
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    payment_mode: "Cash",
    remarks: "",
  });

  /* ================= NORMALIZE ================= */
  const normalizeStatus = (status) => {
    if (!status) return STATUS.CONFIRMED;
    const lower = status.toLowerCase();
    if (lower.includes("confirm")) return STATUS.CONFIRMED;
    if (lower.includes("check-in") || lower.includes("checked in"))
      return STATUS.CHECKED_IN;
    if (lower.includes("check-out") || lower.includes("checked out"))
      return STATUS.CHECKED_OUT;
    if (lower.includes("cancel")) return STATUS.CANCELLED;
    return status; // fallback
  };

  const normalizeBooking = (b) => {
    if (!b) return null;
    const rooms = safeArray(b.rooms);

    // Log if guest name is missing
    if (!b.guest_name) logMissing("guest_name", b);

    return {
      id: b.id,
      guest_name: safeString(b.guest_name) || FALLBACK,
      room_ids: rooms.map((r) => r.id),
      room_no:
        rooms.length > 0
          ? rooms.map((r) => safeString(r.room_no)).join(", ")
          : FALLBACK,
      room_type:
        rooms.length > 0
          ? [...new Set(rooms.map((r) => safeString(r.type)))].join(", ")
          : FALLBACK,
      check_in: safeString(b.check_in).slice(0, 10),
      check_out: safeString(b.check_out).slice(0, 10),
      status: normalizeStatus(safeString(b.status)),
      total_amt: safeNumber(b.total_amt || b.total_amount),
      total_guest: safeNumber(b.total_guest) || 1,
      childrens: safeNumber(b.childrens),
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

      const bookingsData = Array.isArray(bookingRes.data?.data)
        ? bookingRes.data.data.map(normalizeBooking).filter(Boolean)
        : [];

      setBookings(bookingsData);

      const roomsData = Array.isArray(roomRes.data)
        ? roomRes.data
        : roomRes.data?.data || [];

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
  }, [form.check_in, form.check_out, bookings, editing]);

  const checkAvailability = () => {
    if (!form.check_in || !form.check_out || form.check_out <= form.check_in) {
      setAvailableRooms(rooms);
      return;
    }

    // Find conflicting bookings
    const conflictingBookingIds = bookings
      .filter((booking) => {
        // Skip if booking is checked-out/cancelled
        if (
          booking.status === "Checked-out" ||
          booking.status === "Cancelled"
        ) {
          return false;
        }

        const bookingCheckIn = new Date(booking.check_in);
        const bookingCheckOut = new Date(booking.check_out);
        const selectedCheckIn = new Date(form.check_in);
        const selectedCheckOut = new Date(form.check_out);

        // Check for date overlap
        const isOverlap =
          (selectedCheckIn >= bookingCheckIn &&
            selectedCheckIn < bookingCheckOut) ||
          (selectedCheckOut > bookingCheckIn &&
            selectedCheckOut <= bookingCheckOut) ||
          (selectedCheckIn <= bookingCheckIn &&
            selectedCheckOut >= bookingCheckOut);

        // Skip if it's the same booking we are editing
        if (editing && Number(booking.id) === Number(editing.id)) {
          return false;
        }

        return isOverlap;
      })
      .flatMap((booking) => booking.room_ids || []); // Handle multiple rooms per booking

    // Filter available rooms and restrict types to Single Suite and Double Suite
    // BUT! Allow the currently selected room even if it has an old type, to prevent it from disappearing
    const available = rooms.filter((room) => {
      const isNotConflict = !conflictingBookingIds.includes(room.id);
      const isCorrectType =
        room.type === "Single Suite" || room.type === "Double Suite";

      // If we are editing, always keep the rooms that were already booked for this booking
      const isCurrentBookingRoom =
        editing && editing.room_ids?.includes(room.id);

      if (isCurrentBookingRoom) {
        return true;
      }

      return isNotConflict && isCorrectType;
    });

    setAvailableRooms(available);

    // Filter out selected rooms that are no longer available
    const stillAvailable = form.room_ids.filter((id) =>
      available.some((r) => Number(r.id) === Number(id)),
    );

    if (stillAvailable.length !== form.room_ids.length) {
      setForm((prev) => ({ ...prev, room_ids: stillAvailable }));
    }
  };

  /* ================= FORM ================= */
  const resetForm = () => {
    setForm({
      room_ids: [],
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
    // Validation
    if (
      form.room_ids.length === 0 ||
      !form.guest_name ||
      !form.check_in ||
      !form.check_out
    ) {
      setErrorMessage("All fields are required, including at least one room");
      return;
    }

    if (form.check_out <= form.check_in) {
      setErrorMessage("Check-out must be after check-in");
      return;
    }

    // Check guest limit (Sum limits for multiple rooms)
    const selectedRoomsData = rooms.filter((r) =>
      form.room_ids.includes(Number(r.id)),
    );
    const totalLimit = selectedRoomsData.reduce(
      (sum, r) => sum + (r.guest_limit || 0),
      0,
    );

    if (form.total_guest > totalLimit) {
      setErrorMessage(
        `Guest limit exceeded. Total capacity for selected rooms: ${totalLimit}`,
      );
      return;
    }

    // 🔥 EXACT PAYLOAD AS PER API IMAGE
    const payload = {
      guest_name: form.guest_name,
      total_guest: Number(form.total_guest),
      childrens: Number(form.childrens),
      check_in: form.check_in,
      check_out: form.check_out,
    };

    // If one room, use room_id, if multiple use rooms array
    if (form.room_ids.length === 1) {
      payload.room_id = Number(form.room_ids[0]);
    } else {
      payload.rooms = form.room_ids.map((id) => Number(id));
    }

    try {
      setErrorMessage("");
      if (editing) {
        await updateBooking(editing.id, payload);
      } else {
        await createBooking(payload);
      }

      setShowForm(false);
      resetForm();
      fetchAll();
    } catch (err) {
      console.error("❌ BACKEND ERROR 👉", err.response?.data);
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Booking failed. Please try again.";
      setErrorMessage(errorMsg);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?"))
      return;

    try {
      // Remove from local state
      setBookings((prev) => prev.filter((b) => b.id !== id));

      // Also refresh all data to ensure consistency
      await fetchAll();

      const newTotalPages = Math.ceil((bookings.length - 1) / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (err) {
      console.error("❌ DELETE ERROR:", err.response?.data || err.message);

      let errorMsg = "Delete failed. Please try again.";

      // Check for specific error messages
      if (err.response?.status === 500) {
        errorMsg =
          "Server error occurred. The backend might have an issue with deleting this booking. Please contact support.";
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      }

      setErrorMessage(errorMsg);
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /* ================= STATUS ================= */
  const handleStatusChange = useCallback(
    async (booking, newStatus) => {
      const id = booking.id;

      // Guards: same value or already loading
      if (newStatus === booking.status) return;
      if (loadingMap[id]) return;

      // Cancel any in-flight request for this row
      abortRef.current[id]?.abort?.();
      const controller = new AbortController();
      abortRef.current[id] = controller;

      // Store previous status for rollback
      prevStatusRef.current[id] = booking.status;

      // Optimistic update
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)),
      );
      setLoadingMap((prev) => ({ ...prev, [id]: true }));
      setEditingId(null);

      const toastId = toast.loading(`Updating booking #${id}...`);

      try {
        const normalizedStatus = normalizeStatus(newStatus);

        const requestOptions = { signal: controller.signal };

        if (normalizedStatus === STATUS.CHECKED_IN) {
          await checkIn(id, requestOptions);
        } else if (normalizedStatus === STATUS.CHECKED_OUT) {
          await checkOut(id, requestOptions);
        } else {
          await updateBooking(id, { status: normalizedStatus }, requestOptions);
        }

        if (!isMounted.current) return;

        toast.success(`Booking #${id} changed to ${newStatus}`, {
          id: toastId,
        });

        // Debounced background sync for accuracy via getBookingById
        clearTimeout(syncTimeoutRef.current[id]);
        syncTimeoutRef.current[id] = setTimeout(async () => {
          if (!isMounted.current) return;
          try {
            const fresh = await getBookingById(id);
            if (!isMounted.current) return;
            const freshBookingData = fresh.data?.data || fresh.data;
            if (freshBookingData) {
              const freshStatus = normalizeStatus(freshBookingData.status);
              if (freshStatus !== newStatus) {
                toast(`Booking #${id} synced to "${freshStatus}" by server`, {
                  icon: "🔄",
                });
                setBookings((prev) =>
                  prev.map((b) =>
                    b.id === id ? { ...b, status: freshStatus } : b,
                  ),
                );
              }
            }
          } catch {
            /* silent sync failure */
          }
          delete syncTimeoutRef.current[id];
        }, 300);
      } catch (err) {
        if (err.name === "AbortError") return;
        if (!isMounted.current) return;

        console.error("❌ STATUS UPDATE ERROR 👉", err.response?.data);

        // Rollback to specific previous status
        const prev = prevStatusRef.current[id];
        if (prev !== undefined) {
          setBookings((prevList) =>
            prevList.map((b) => (b.id === id ? { ...b, status: prev } : b)),
          );
        }

        toast.error(
          `Booking #${id}: ${err.response?.data?.message || "Failed to update status"}`,
          { id: toastId },
        );
      } finally {
        if (isMounted.current) {
          setLoadingMap((prev) => {
            const n = { ...prev };
            delete n[id];
            return n;
          });
        }
        delete abortRef.current[id];
        delete prevStatusRef.current[id];
      }
    },
    [loadingMap],
  );

  // Remove pagination hook
  const filteredBookings = bookings.filter((booking) => {
    const term = safeString(searchTerm).toLowerCase();
    const name = safeString(booking.guest_name);
    const roomsStr = safeString(booking.room_no);
    const status = safeString(booking.status);

    const matchesSearch =
      name.toLowerCase().includes(term) ||
      roomsStr.toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === "all" ||
      statusFilter === "" ||
      status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  /* ================= INLINE MODAL HANDLER ================= */
  const openDetailModal = useCallback(async (b) => {
    setSelectedBooking(b);
    setEditing(b);
    setForm({
      room_ids: b.room_ids,
      guest_name: b.guest_name,
      total_guest: b.total_guest || 1,
      childrens: b.childrens || 0,
      check_in: b.check_in,
      check_out: b.check_out,
    });
    setDetailTab("info");
    setShowDetailModal(true);
    // Preload payments
    setPaymentForm({ amount: "", payment_mode: "Cash", remarks: "" });
    setSelectedBookingForPayment(b);
    setPaymentLoading(true);
    try {
      const res = await getPayments(b.id);
      let data = [];
      if (Array.isArray(res.data)) data = res.data;
      else if (res.data?.data && Array.isArray(res.data.data))
        data = res.data.data;
      else if (res.data?.payments && Array.isArray(res.data.payments))
        data = res.data.payments;
      setPayments(data);
    } catch {
      setPayments([]);
    } finally {
      setPaymentLoading(false);
    }
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  /* ================= PAYMENT FILTER & PAGINATION ================= */
  const filteredPayments = payments.filter((payment) => {
    const term = paymentSearchTerm.toLowerCase();
    return (
      (payment.payment_mode || "").toLowerCase().includes(term) ||
      (payment.remarks || "").toLowerCase().includes(term) ||
      (payment.paid_amt || payment.amount || "").toString().includes(term)
    );
  });

  const paymentItemsPerPage = 4;
  const [paymentCurrentPage, setPaymentCurrentPage] = useState(1);
  const totalPaymentPages =
    Math.ceil(filteredPayments.length / paymentItemsPerPage) || 1;
  const paginatedPayments = filteredPayments.slice(
    (paymentCurrentPage - 1) * paymentItemsPerPage,
    paymentCurrentPage * paymentItemsPerPage,
  );

  // Reset page when search changes
  useEffect(() => {
    setPaymentCurrentPage(1);
  }, [safeString(paymentSearchTerm).toLowerCase()]);

  const handlePaymentSubmit = async () => {
    if (
      !paymentForm.amount ||
      isNaN(paymentForm.amount) ||
      Number(paymentForm.amount) <= 0
    ) {
      alert("Please enter a valid amount");
      return;
    }

    // Calculate total paid amount and remaining balance
    const totalPaid = payments.reduce(
      (sum, p) => sum + Number(p.paid_amt || p.amount || 0),
      0,
    );
    const totalAmount = Number(selectedBookingForPayment.total_amt || 0);
    const newPaymentAmount = Number(paymentForm.amount);
    const remainingBalance = totalAmount - totalPaid;

    // Check if new payment exceeds the remaining balance
    if (newPaymentAmount > remainingBalance) {
      alert(
        `Payment amount exceeds remaining balance!\n\nTotal Amount: ₹${totalAmount.toLocaleString()}\nAlready Paid: ₹${totalPaid.toLocaleString()}\nRemaining Balance: ₹${remainingBalance.toLocaleString()}\n\nYou can only add up to ₹${remainingBalance.toLocaleString()}`,
      );
      return;
    }

    try {
      setPaymentLoading(true);
      // Backend expects 'paid_amt' not 'amount'
      const payload = {
        paid_amt: newPaymentAmount,
        payment_mode: paymentForm.payment_mode,
        remarks: paymentForm.remarks || "Payment",
      };

      // Refresh payments list
      const res = await getPayments(selectedBookingForPayment.id);

      // Try different response structures
      let paymentsData = [];
      if (Array.isArray(res.data)) {
        paymentsData = res.data;
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        paymentsData = res.data.data;
      } else if (res.data?.payments && Array.isArray(res.data.payments)) {
        paymentsData = res.data.payments;
      } else {
        console.warn("⚠️ Unexpected payments format:", res.data);
        paymentsData = [];
      }

      setPayments(paymentsData);

      // Reset form
      setPaymentForm({ amount: "", payment_mode: "Cash", remarks: "" });

      // Show success message
      toast.success("Payment added successfully!");
    } catch (err) {
      console.error("❌ PAYMENT ERROR:", err.response?.data || err.message);

      let errorMsg = "Failed to add payment. Please try again.";
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.response?.data?.errors) {
        // Show validation errors
        const errors = Object.values(err.response.data.errors)
          .flat()
          .join("\n");
        errorMsg = errors;
      }

      toast.error(errorMsg);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleDeletePayment = async (paymentId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this payment transaction?",
      )
    )
      return;

    try {
      setPaymentLoading(true);
      await deletePayment(paymentId);

      // Refresh payments list with proper data handling
      const res = await getPayments(selectedBookingForPayment.id);

      // Try different response structures
      let paymentsData = [];
      if (Array.isArray(res.data)) {
        paymentsData = res.data;
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        paymentsData = res.data.data;
      } else if (res.data?.payments && Array.isArray(res.data.payments)) {
        paymentsData = res.data.payments;
      } else {
        console.warn("⚠️ Unexpected payments format:", res.data);
        paymentsData = [];
      }

      setPayments(paymentsData);

      // Reset pagination to first page if needed
      if (
        paymentCurrentPage > 1 &&
        paymentsData.length <= (paymentCurrentPage - 1) * paymentItemsPerPage
      ) {
        setPaymentCurrentPage(1);
      }

      // Reset search term
      setPaymentSearchTerm("");
      toast.success("Payment deleted successfully!");
    } catch (err) {
      console.error("❌ DELETE PAYMENT ERROR:", err.response?.data || err);
      toast.error("Failed to delete payment.");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col min-w-0 min-h-0 p-0 overflow-hidden w-full">
        <div className="flex-1 flex flex-col min-h-0 min-w-0 w-full overflow-hidden">
          {/* Skeleton Controls — matches search + filter + add button */}
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-md p-4 mb-6 flex-shrink-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="h-[46px] w-full sm:w-80 bg-gray-100 rounded-xl animate-shimmer" />
                <div className="h-[38px] w-28 bg-gray-100 rounded-lg animate-shimmer" />
              </div>
              <div className="h-[38px] w-full md:w-36 bg-orange-100/50 rounded-lg animate-shimmer" />
            </div>
          </div>

          {/* Skeleton Table — uses real <table> with table-fixed matching actual column widths */}
          <div className="flex-1 min-h-0 min-w-0 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="overflow-hidden flex-1">
              <table className="w-full table-fixed text-left border-separate border-spacing-0 min-w-[700px]">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-gray-50/95 backdrop-blur-sm border-b border-gray-200">
                    <th className="w-[25%] py-4 px-4 border-b border-gray-100">
                      <div className="h-3 w-24 bg-gray-200 rounded animate-shimmer" />
                    </th>
                    <th className="w-[15%] py-4 px-4 border-b border-gray-100">
                      <div className="h-3 w-20 bg-gray-200 rounded animate-shimmer" />
                    </th>
                    <th className="w-[20%] py-4 px-4 border-b border-gray-100">
                      <div className="h-3 w-12 bg-gray-200 rounded animate-shimmer" />
                    </th>
                    <th className="w-[20%] py-4 px-4 text-center border-b border-gray-100">
                      <div className="h-3 w-14 bg-gray-200 rounded animate-shimmer mx-auto" />
                    </th>
                    <th className="w-[20%] py-4 px-4 text-right border-b border-gray-100">
                      <div className="h-3 w-14 bg-gray-200 rounded animate-shimmer ml-auto" />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[...Array(8)].map((_, i) => (
                    <tr key={i}>
                      {/* Guest Details */}
                      <td className="py-3 px-4">
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-gray-100 rounded animate-shimmer" />
                          <div className="h-2 w-40 bg-gray-50 rounded animate-shimmer" />
                        </div>
                      </td>
                      {/* Room Details */}
                      <td className="py-3 px-4">
                        <div className="space-y-2">
                          <div className="h-3 w-20 bg-gray-100 rounded animate-shimmer" />
                          <div className="h-2 w-16 bg-gray-50 rounded animate-shimmer" />
                        </div>
                      </td>
                      {/* Dates */}
                      <td className="py-3 px-4">
                        <div className="space-y-2">
                          <div className="h-3 w-24 bg-gray-50 rounded animate-shimmer" />
                          <div className="h-3 w-24 bg-gray-50 rounded animate-shimmer" />
                        </div>
                      </td>
                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <div className="h-6 w-20 bg-gray-50 rounded-lg animate-shimmer mx-auto" />
                      </td>
                      {/* Actions */}
                      <td className="py-3 px-4">
                        <div className="flex justify-end gap-2">
                          <div className="h-8 w-8 bg-gray-50/50 rounded-xl animate-shimmer" />
                          <div className="h-8 w-8 bg-gray-50/50 rounded-xl animate-shimmer" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Skeleton Pagination */}
            <div className="mt-auto shrink-0 flex items-center justify-between bg-white/50 p-4 border-t border-gray-100 h-[68px]">
              <div className="flex items-center gap-6">
                <div className="h-3 w-32 bg-gray-100 rounded animate-shimmer" />
                <div className="h-6 w-24 bg-gray-50 rounded animate-shimmer hidden sm:block" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-16 bg-gray-50 rounded-lg animate-shimmer" />
                <div className="flex gap-1">
                  <div className="h-7 w-7 bg-gray-100 rounded-lg animate-shimmer" />
                  <div className="h-7 w-7 bg-gray-50 rounded-lg animate-shimmer" />
                  <div className="h-7 w-7 bg-gray-50 rounded-lg animate-shimmer" />
                </div>
                <div className="h-6 w-16 bg-gray-50 rounded-lg animate-shimmer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageLayout>
      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 flex-shrink-0">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700">{errorMessage}</p>
          <button onClick={() => setErrorMessage("")} className="ml-auto">
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>
      )}

      {/* Bookings Header - Standardized Style */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-md px-3 py-2 h-14 flex items-center justify-between gap-2 mb-4 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="h-10 grow max-w-[200px] relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              placeholder="Search name/room..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-full pl-9 pr-3 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-200 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Status Filter Dropdown */}
          <div className="h-10 relative hidden sm:block">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-full px-3 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-extrabold uppercase tracking-tight text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer hover:bg-white transition-all appearance-none pr-8"
            >
              <option value="all">ALL STATUS</option>
              <option value="confirmed">CONFIRMED</option>
              <option value="checked-in">IN-HOUSE</option>
              <option value="checked-out">CHECKED-OUT</option>
              <option value="cancelled">CANCELLED</option>
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="h-10 px-4 bg-orange-600 text-white rounded-lg text-xs font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Booking</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Bookings - Mobile Cards + Desktop Table */}
      <ContentCard className="flex-1">
        {/* ===== MOBILE CARD VIEW (< lg) ===== */}
        <div className="lg:hidden overflow-auto flex-1 scroll-smooth overscroll-contain custom-scrollbar min-h-0">
          <div className="max-w-3xl mx-auto w-full">
            {paginatedBookings.length > 0 ? (
              <div className="p-4 space-y-2">
                {paginatedBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 bg-white border border-gray-100 rounded-xl hover:bg-blue-50/40 transition-all duration-200 cursor-pointer shadow-sm group"
                    onClick={() => openDetailModal(b)}
                  >
                    {/* Row 1: Guest Name + Status */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-gray-900 truncate leading-tight">
                          {b.guest_name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-gray-400 font-medium tracking-tight">
                            #{b.id}
                          </span>
                          <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                          <span className="text-[10px] text-gray-500 font-bold tracking-tight">
                            Room {b.room_no}
                          </span>
                        </div>
                      </div>
                      {editingId === b.id ? (
                        <select
                          autoFocus
                          value={b.status}
                          aria-label="Booking status"
                          disabled={loading || !!loadingMap[b.id]}
                          onBlur={() => setEditingId(null)}
                          onKeyDown={(e) => {
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          onChange={(e) => {
                            const newStatus = e.target.value;
                            if (newStatus !== b.status) {
                              if (
                                window.confirm(
                                  getConfirmationMessage(newStatus),
                                )
                              ) {
                                handleStatusChange(b, newStatus);
                              } else {
                                setEditingId(null);
                              }
                            } else {
                              setEditingId(null);
                            }
                          }}
                          className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm shrink-0"
                        >
                          {getAllowedStatuses(b.status).map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              !loadingMap[b.id] &&
                              !loading &&
                              b.status !== STATUS.CHECKED_OUT &&
                              b.status !== STATUS.CANCELLED
                            ) {
                              setEditingId(b.id);
                            }
                          }}
                          disabled={loading || !!loadingMap[b.id]}
                          className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wider border transition-all ${getStatusColor(
                            b.status,
                          )} ${
                            loading ||
                            b.status === STATUS.CHECKED_OUT ||
                            b.status === STATUS.CANCELLED
                              ? "cursor-not-allowed opacity-80"
                              : "cursor-pointer"
                          }`}
                        >
                          {loadingMap[b.id] ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            b.status
                          )}
                        </button>
                      )}
                    </div>

                    {/* Row 2: Dates + Actions */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 text-[10px] text-gray-500 font-medium min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5 text-blue-400" />
                          <span className="tabular-nums">{b.check_in}</span>
                        </div>
                        <span className="text-gray-200">/</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5 text-gray-300" />
                          <span className="tabular-nums">{b.check_out}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditing(b);
                            setForm({
                              guest_name: b.guest_name,
                              room_ids: b.room_ids || [],
                              total_guest: b.total_guest,
                              childrens: b.childrens,
                              check_in: b.check_in,
                              check_out: b.check_out,
                            });
                            setShowForm(true);
                          }}
                          disabled={
                            loading ||
                            b.status === STATUS.CHECKED_OUT ||
                            b.status === STATUS.CANCELLED
                          }
                          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all active:scale-90 border ${
                            loading ||
                            b.status === STATUS.CHECKED_OUT ||
                            b.status === STATUS.CANCELLED
                              ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                              : "bg-orange-50 text-orange-600 border-orange-100"
                          }`}
                          title="Edit Booking"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/bookings/${b.id}`);
                          }}
                          disabled={loading}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all active:scale-90 border ${
                            loading
                              ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                              : "bg-blue-50 text-blue-600 border-blue-100"
                          }`}
                          title="View Full Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Calendar}
                title={
                  searchTerm ? "No matching bookings" : "No bookings found"
                }
                message={
                  searchTerm
                    ? "Try adjusting your search or filters."
                    : "New bookings will appear here once created."
                }
                actionText={searchTerm ? "" : "Add First Booking"}
                onAction={
                  searchTerm
                    ? null
                    : () => {
                        resetForm();
                        setShowForm(true);
                      }
                }
              />
            )}
          </div>
        </div>

        {/* ===== DESKTOP TABLE VIEW (md+) ===== */}
        <div className="hidden lg:flex overflow-auto flex-1 scroll-smooth overscroll-contain custom-scrollbar min-h-0">
          <table className="w-full table-fixed text-left border-separate border-spacing-0 min-w-[700px]">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-50/95 backdrop-blur-sm border-b border-gray-200">
                <th className="w-[25%] py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  Guest Details
                </th>
                <th className="w-[15%] py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  Room Details
                </th>
                <th className="w-[20%] py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  Dates
                </th>
                <th className="w-[20%] py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center border-b border-gray-100">
                  Status
                </th>
                <th className="w-[20%] py-4 px-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedBookings.length > 0 ? (
                paginatedBookings.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-blue-50/40 transition-all duration-200 group cursor-pointer border-l-4 border-transparent hover:border-blue-600"
                    onClick={() => openDetailModal(b)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1.5">
                        <p className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors tracking-tight leading-relaxed">
                          {b.guest_name}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 font-medium tracking-tight">
                            #{b.id}
                          </span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 rounded-md text-[10px] font-bold text-blue-600 uppercase tracking-tight">
                              <Users className="w-3 h-3" />
                              {b.total_guest}{" "}
                              {b.total_guest > 1 ? "Guests" : "Guest"}
                            </div>
                            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-indigo-50 rounded-md text-[10px] font-bold text-indigo-600 uppercase tracking-tight">
                              <Users className="w-3 h-3" />
                              {b.childrens}{" "}
                              {b.childrens > 1 ? "Children" : "Child"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-bold text-gray-900 tracking-tight leading-relaxed">
                          Room {b.room_no}
                        </p>
                        <p className="text-xs text-gray-400 font-medium italic">
                          {b.room_type}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" />
                          <span className="text-xs font-bold tabular-nums leading-none">
                            {b.check_in}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="text-xs font-bold tabular-nums leading-none">
                            {b.check_out}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {/* Badge + Dropdown Combo */}
                      {editingId === b.id ? (
                        <select
                          autoFocus
                          value={b.status}
                          aria-label="Booking status"
                          disabled={loading || !!loadingMap[b.id]}
                          onBlur={() => setEditingId(null)}
                          onKeyDown={(e) => {
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          onChange={(e) => {
                            const newStatus = e.target.value;
                            if (newStatus !== b.status) {
                              if (
                                window.confirm(
                                  getConfirmationMessage(newStatus),
                                )
                              ) {
                                handleStatusChange(b, newStatus);
                              } else {
                                setEditingId(null);
                              }
                            } else {
                              setEditingId(null);
                            }
                          }}
                          className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
                        >
                          {getAllowedStatuses(b.status).map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              !loadingMap[b.id] &&
                              !loading &&
                              b.status !== STATUS.CHECKED_OUT &&
                              b.status !== STATUS.CANCELLED
                            ) {
                              setEditingId(b.id);
                            }
                          }}
                          disabled={loading || !!loadingMap[b.id]}
                          title={
                            loadingMap[b.id]
                              ? "Updating..."
                              : b.status === STATUS.CHECKED_OUT ||
                                  b.status === STATUS.CANCELLED
                                ? "Terminal status"
                                : "Click to change status"
                          }
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border transition-all ${getStatusColor(
                            b.status,
                          )} ${
                            loading ||
                            b.status === STATUS.CHECKED_OUT ||
                            b.status === STATUS.CANCELLED
                              ? "cursor-not-allowed opacity-80"
                              : "cursor-pointer hover:shadow-md hover:scale-105 active:scale-95"
                          }`}
                        >
                          {loadingMap[b.id] ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            b.status
                          )}
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditing(b);
                            setForm({
                              guest_name: b.guest_name,
                              room_ids: b.room_ids || [],
                              total_guest: b.total_guest,
                              childrens: b.childrens,
                              check_in: b.check_in,
                              check_out: b.check_out,
                            });
                            setShowForm(true);
                          }}
                          disabled={
                            loading ||
                            b.status === STATUS.CHECKED_OUT ||
                            b.status === STATUS.CANCELLED
                          }
                          className={`p-2 rounded-xl transition-all border shadow-sm ${
                            loading ||
                            b.status === STATUS.CHECKED_OUT ||
                            b.status === STATUS.CANCELLED
                              ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                              : "bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-600 hover:text-white hover:border-orange-600 hover:shadow-lg hover:shadow-orange-500/20 active:scale-90"
                          }`}
                          title="Edit Booking"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/bookings/${b.id}`);
                          }}
                          disabled={loading}
                          className={`p-2 rounded-xl transition-all border shadow-sm ${
                            loading
                              ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                              : "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-lg hover:shadow-blue-500/20 active:scale-90"
                          }`}
                          title="View Full Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
                    <EmptyState
                      icon={Calendar}
                      title={
                        searchTerm
                          ? "No matching bookings"
                          : "No bookings found"
                      }
                      message={
                        searchTerm
                          ? "Try adjusting your search or filters."
                          : "Start by adding your first reservation."
                      }
                      actionText={searchTerm ? "" : "Add First Booking"}
                      onAction={
                        searchTerm
                          ? null
                          : () => {
                              resetForm();
                              setShowForm(true);
                            }
                      }
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <Pagination
          currentPage={currentPage - 1}
          totalPages={totalPages}
          totalItems={filteredBookings.length}
          itemsPerPage={itemsPerPage}
          onPageChange={(p) => setCurrentPage(p + 1)}
          onItemsPerPageChange={setItemsPerPage}
          themeColor="orange"
        />
      </ContentCard>

      {/* Booking Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          resetForm();
        }}
        title={editing ? "Edit Booking" : "New Booking"}
        subtitle={
          editing ? "Update booking details" : "Create a new room booking"
        }
        icon={Calendar}
        footer={
          <div className="flex justify-end gap-3">
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
              className={`px-4 py-2 font-medium rounded-lg transition-colors flex items-center gap-2 ${
                availableRooms.length === 0 && !editing
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              {editing ? "Update Booking" : "Create Booking"}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
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

          {/* Room Selection — Premium Card Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                <Home className="w-4 h-4 inline mr-1.5" />
                Select Rooms
                <span className="ml-2 text-xs font-normal text-gray-400">
                  (Multiple allowed)
                </span>
              </label>
              {form.room_ids.length > 0 && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, room_ids: [] })}
                  className="text-xs text-orange-500 hover:text-orange-700 font-medium"
                >
                  Clear all
                </button>
              )}
            </div>

            {availableRooms.length === 0 ? (
              <div className="border border-dashed border-red-200 bg-red-50 rounded-xl p-4 text-center">
                <Home className="w-6 h-6 text-red-300 mx-auto mb-1" />
                <p className="text-sm text-red-500 font-medium">
                  No rooms available for selected dates
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
                {availableRooms.map((r) => {
                  const isSelected = form.room_ids.includes(Number(r.id));
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        const id = Number(r.id);
                        setForm({
                          ...form,
                          room_ids: isSelected
                            ? form.room_ids.filter((rid) => rid !== id)
                            : [...form.room_ids, id],
                        });
                      }}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all duration-150 ${
                        isSelected
                          ? "border-orange-500 bg-orange-50 shadow-sm"
                          : "border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50/40"
                      }`}
                    >
                      {/* Check indicator */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected
                            ? "border-orange-500 bg-orange-500"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      {/* Room Info */}
                      <div className="min-w-0">
                        <p
                          className={`text-sm font-semibold truncate ${isSelected ? "text-orange-700" : "text-gray-800"}`}
                        >
                          Room {r.room_no}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {r.type}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Count badge */}
            <p
              className={`mt-2 text-xs font-medium ${form.room_ids.length > 0 ? "text-orange-600" : "text-gray-400"}`}
            >
              {form.room_ids.length > 0
                ? `✓ ${form.room_ids.length} room${form.room_ids.length > 1 ? "s" : ""} selected`
                : "No rooms selected"}
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
              max={rooms.find((r) => r.id == form.room_id)?.guest_limit || 10}
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
                min={new Date().toISOString().split("T")[0]}
                value={form.check_in}
                onChange={(e) =>
                  setForm({
                    ...form,
                    check_in: e.target.value,
                    check_out:
                      e.target.value >= form.check_out ? "" : form.check_out,
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
                min={form.check_in || new Date().toISOString().split("T")[0]}
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
                {Math.ceil(
                  (new Date(form.check_out) - new Date(form.check_in)) /
                    (1000 * 60 * 60 * 24),
                )}{" "}
                nights
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
      </Modal>

      {/* ===== UNIFIED BOOKING DETAIL MODAL ===== */}
      <Modal
        isOpen={showDetailModal && !!selectedBooking}
        onClose={() => {
          setShowDetailModal(false);
          resetForm();
          setEditing(null);
        }}
        title={selectedBooking?.guest_name || "Booking Detail"}
        subtitle={
          selectedBooking
            ? `Room ${selectedBooking.room_no} • Booking #${selectedBooking.id}`
            : ""
        }
        icon={Calendar}
        maxWidth="max-w-5xl"
        headerExtra={
          selectedBooking && (
            <span
              className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(selectedBooking.status)}`}
            >
              {selectedBooking.status}
            </span>
          )
        }
        footer={
          detailTab === "info" && (
            <div className="flex justify-between items-center w-full">
              <button
                onClick={() => {
                  setDetailTab("payments");
                }}
                className="flex items-center gap-2 text-sm text-green-700 font-semibold hover:text-green-800 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors"
              >
                <DollarSign className="w-4 h-4" /> View Payments
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    resetForm();
                    setEditing(null);
                  }}
                  className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await submitForm();
                    setShowDetailModal(false);
                  }}
                  disabled={form.room_ids.length === 0}
                  className={`px-4 py-2 font-medium rounded-lg transition-colors flex items-center gap-2 ${
                    form.room_ids.length === 0
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}
                >
                  <CheckCircle className="w-4 h-4" /> Update Booking
                </button>
              </div>
            </div>
          )
        }
      >
        {selectedBooking && (
          <div className="flex flex-col h-full">
            {/* Tabs */}
            <div className="flex border-b border-gray-100 mb-6 flex-shrink-0 -mx-6 px-6 bg-gray-50/30">
              <button
                onClick={() => setDetailTab("info")}
                className={`px-6 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                  detailTab === "info"
                    ? "border-orange-500 text-orange-600 bg-orange-50/50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Edit2 className="w-4 h-4" /> Booking Info
              </button>
              <button
                onClick={() => setDetailTab("payments")}
                className={`px-6 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                  detailTab === "payments"
                    ? "border-green-500 text-green-600 bg-green-50/50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <DollarSign className="w-4 h-4" /> Payments & Billing
                {/* Balance due indicator */}
                {(() => {
                  const due = Math.max(
                    0,
                    (selectedBooking.total_amt || 0) -
                      payments.reduce(
                        (s, p) => s + Number(p.paid_amt || p.amount || 0),
                        0,
                      ),
                  );
                  return due > 0 ? (
                    <span className="ml-1 bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      ₹{due.toLocaleString()} DUE
                    </span>
                  ) : null;
                })()}
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-x-hidden">
              {/* --- Booking Info Tab --- */}
              {detailTab === "info" && (
                <div className="space-y-6">
                  {/* Error */}
                  {errorMessage && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <p className="text-sm text-red-700 font-medium flex-1">
                        {errorMessage}
                      </p>
                      <button
                        onClick={() => setErrorMessage("")}
                        className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Guest Name */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        <User className="w-3.5 h-3.5 inline mr-1" /> Guest Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter guest name"
                        value={form.guest_name}
                        onChange={(e) =>
                          setForm({ ...form, guest_name: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all font-medium"
                      />
                    </div>

                    {/* Room Selection */}
                    <div className="md:col-span-2">
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                          <Home className="w-3.5 h-3.5 inline mr-1" /> Select
                          Rooms
                        </label>
                        {form.room_ids.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, room_ids: [] })}
                            className="text-xs text-orange-600 hover:underline font-bold"
                          >
                            Clear all
                          </button>
                        )}
                      </div>
                      {availableRooms.length === 0 ? (
                        <div className="border border-dashed border-red-200 bg-red-50/30 rounded-2xl p-6 text-center">
                          <Home className="w-8 h-8 text-red-200 mx-auto mb-2" />
                          <p className="text-sm text-red-500 font-bold">
                            No rooms available for selected dates
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pr-1">
                          {availableRooms.map((r) => {
                            const isSel = form.room_ids.includes(Number(r.id));
                            return (
                              <button
                                key={r.id}
                                type="button"
                                onClick={() => {
                                  const id = Number(r.id);
                                  setForm({
                                    ...form,
                                    room_ids: isSel
                                      ? form.room_ids.filter(
                                          (rid) => rid !== id,
                                        )
                                      : [...form.room_ids, id],
                                  });
                                }}
                                className={`flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all ${isSel ? "border-orange-500 bg-orange-50 shadow-sm" : "border-gray-100 bg-white hover:border-orange-200"}`}
                              >
                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${isSel ? "border-orange-500 bg-orange-500 shadow-sm shadow-orange-200" : "border-gray-200"}`}
                                >
                                  {isSel && (
                                    <svg
                                      className="w-3 h-3 text-white"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth={4}
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p
                                    className={`text-sm font-bold truncate ${isSel ? "text-orange-700" : "text-gray-800"}`}
                                  >
                                    Room {r.room_no}
                                  </p>
                                  <p className="text-[10px] text-gray-400 font-medium truncate uppercase">
                                    {r.type}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                      <p
                        className={`mt-3 text-xs font-bold ${form.room_ids.length > 0 ? "text-orange-600" : "text-gray-400"}`}
                      >
                        {form.room_ids.length > 0
                          ? `✓ ${form.room_ids.length} room${form.room_ids.length > 1 ? "s" : ""} selected`
                          : "Required: Select at least one room"}
                      </p>
                    </div>

                    {/* Guests & Children */}
                    <div className="grid grid-cols-2 gap-4 md:col-span-2">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                          <Users className="w-3.5 h-3.5 inline mr-1" /> Guests
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={form.total_guest}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              total_guest: parseInt(e.target.value) || 1,
                            })
                          }
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                          <Users className="w-3.5 h-3.5 inline mr-1" /> Children
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
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-bold"
                        />
                      </div>
                    </div>

                    {/* Dates */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        <Calendar className="w-3.5 h-3.5 inline mr-1" />{" "}
                        Check-in
                      </label>
                      <input
                        type="date"
                        value={form.check_in}
                        onChange={(e) =>
                          setForm({ ...form, check_in: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        <Calendar className="w-3.5 h-3.5 inline mr-1" />{" "}
                        Check-out
                      </label>
                      <input
                        type="date"
                        value={form.check_out}
                        onChange={(e) =>
                          setForm({ ...form, check_out: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-bold"
                      />
                    </div>

                    {/* Nights info */}
                    {form.check_in && form.check_out && (
                      <div className="md:col-span-2">
                        <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Calendar className="w-4 h-4 text-blue-600" />
                            </div>
                            <p className="text-sm text-blue-800 font-bold uppercase tracking-tight">
                              Stay Duration
                            </p>
                          </div>
                          <p className="text-lg font-black text-blue-900">
                            {Math.ceil(
                              (new Date(form.check_out) -
                                new Date(form.check_in)) /
                                (1000 * 60 * 60 * 24),
                            )}{" "}
                            Nights
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* --- Payments Tab --- */}
              {detailTab === "payments" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* Financial Overview */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">
                        Total Bill
                      </p>
                      <p className="text-xl font-black text-gray-900">
                        ₹
                        {Number(
                          selectedBooking.total_amt || 0,
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100">
                      <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">
                        Received
                      </p>
                      <p className="text-xl font-black text-gray-900">
                        ₹
                        {payments
                          .reduce(
                            (s, p) => s + Number(p.paid_amt || p.amount || 0),
                            0,
                          )
                          .toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
                      <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">
                        Pending
                      </p>
                      <p className="text-xl font-black text-gray-900">
                        ₹
                        {Math.max(
                          0,
                          (selectedBooking.total_amt || 0) -
                            payments.reduce(
                              (s, p) => s + Number(p.paid_amt || p.amount || 0),
                              0,
                            ),
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Transaction History */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-gray-800 flex items-center gap-2 uppercase tracking-tight text-sm">
                          <CreditCard className="w-4 h-4 text-gray-400" />{" "}
                          History
                        </h4>
                      </div>
                      {/* Search */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search payments..."
                          value={paymentSearchTerm}
                          onChange={(e) => setPaymentSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium outline-none transition-all"
                        />
                      </div>
                      {paymentLoading && filteredPayments.length === 0 ? (
                        <div className="text-center py-10 text-gray-400 font-bold uppercase text-[10px] animate-pulse">
                          Loading Transaction History...
                        </div>
                      ) : filteredPayments.length > 0 ? (
                        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm divide-y divide-gray-50 overflow-hidden">
                          {paginatedPayments.map((payment) => (
                            <div
                              key={payment.id}
                              className="p-4 hover:bg-gray-50 transition-colors group"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-black text-gray-900 text-lg leading-none">
                                    ₹
                                    {Number(
                                      payment.paid_amt || payment.amount || 0,
                                    ).toLocaleString()}
                                  </p>
                                  <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">
                                    {new Date(
                                      payment.created_at || Date.now(),
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="text-right flex items-center gap-2">
                                  <span className="px-2 py-1 bg-gray-50 text-gray-500 text-[10px] font-black uppercase rounded-lg border border-gray-100">
                                    {payment.payment_mode}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleDeletePayment(payment.id)
                                    }
                                    disabled={paymentLoading}
                                    className="text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1.5 hover:bg-red-50 rounded-lg"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              {payment.remarks && (
                                <p className="text-xs text-gray-400 italic mt-2 font-medium bg-gray-50 p-2 rounded-lg border border-gray-100/50">
                                  {payment.remarks}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                          <DollarSign className="w-10 h-10 text-gray-100 mx-auto mb-2" />
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                            No payments found
                          </p>
                        </div>
                      )}
                      {/* Pagination */}
                      {totalPaymentPages > 1 && (
                        <div className="flex justify-center gap-1.5 mt-4">
                          {[...Array(totalPaymentPages)].map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setPaymentCurrentPage(i + 1)}
                              className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${paymentCurrentPage === i + 1 ? "bg-green-600 text-white shadow-md shadow-green-100" : "text-gray-400 hover:bg-gray-100 border border-transparent"}`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* New Payment Form */}
                    <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-200 h-fit sticky top-0">
                      <h4 className="font-black text-gray-800 flex items-center gap-2 mb-6 uppercase tracking-tight text-sm">
                        <Plus className="w-4 h-4 text-green-500" /> New
                        Transaction
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                            Amount (₹)
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 font-black">
                              ₹
                            </span>
                            <input
                              type="number"
                              value={paymentForm.amount}
                              onChange={(e) =>
                                setPaymentForm({
                                  ...paymentForm,
                                  amount: e.target.value,
                                })
                              }
                              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-black text-lg"
                              placeholder="0.00"
                            />
                          </div>
                          {/* Balance indicator */}
                          <div className="mt-3 p-3 bg-white/80 rounded-xl border border-gray-100">
                            {(() => {
                              const totalPaid = payments.reduce(
                                (s, p) =>
                                  s + Number(p.paid_amt || p.amount || 0),
                                0,
                              );
                              const remaining =
                                (selectedBooking.total_amt || 0) - totalPaid;
                              const entered = Number(paymentForm.amount) || 0;
                              if (entered > remaining + 0.1)
                                return (
                                  <p className="text-[11px] text-red-600 font-bold flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5" />{" "}
                                    OVERPAYING: ₹
                                    {(entered - remaining).toLocaleString()}
                                  </p>
                                );
                              if (entered > 0)
                                return (
                                  <p className="text-[11px] text-green-600 font-bold flex items-center gap-1">
                                    <CheckCircle className="w-3.5 h-3.5" />{" "}
                                    BALANCE AFTER: ₹
                                    {(remaining - entered).toLocaleString()}
                                  </p>
                                );
                              return (
                                <p className="text-[11px] text-gray-500 font-bold flex items-center gap-1">
                                  <DollarSign className="w-3.5 h-3.5" />{" "}
                                  PENDING: ₹{remaining.toLocaleString()}
                                </p>
                              );
                            })()}
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                            Method
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {["Cash", "UPI", "Card", "Bank Transfer"].map(
                              (mode) => (
                                <button
                                  key={mode}
                                  onClick={() =>
                                    setPaymentForm({
                                      ...paymentForm,
                                      payment_mode: mode,
                                    })
                                  }
                                  className={`py-2 px-3 rounded-xl border-2 text-[10px] font-black uppercase transition-all ${paymentForm.payment_mode === mode ? "border-green-500 bg-green-50 text-green-700" : "border-white bg-white text-gray-400 hover:border-gray-100"}`}
                                >
                                  {mode}
                                </button>
                              ),
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                            Remarks
                          </label>
                          <textarea
                            rows="2"
                            value={paymentForm.remarks}
                            onChange={(e) =>
                              setPaymentForm({
                                ...paymentForm,
                                remarks: e.target.value,
                              })
                            }
                            placeholder="Notes for this payment..."
                            className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-sm font-medium resize-none shadow-sm"
                          />
                        </div>
                        <button
                          onClick={handlePaymentSubmit}
                          disabled={paymentLoading || !paymentForm.amount}
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-xl shadow-lg shadow-green-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] mt-2"
                        >
                          {paymentLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
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
              )}
            </div>
          </div>
        )}
      </Modal>
    </PageLayout>
  );
}
