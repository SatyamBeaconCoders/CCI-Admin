
import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { 
  Users, Clock, Home, Hotel, Search, Plus, 
  LogOut, RefreshCw, AlertCircle,
  ChevronRight, ArrowRight, Bed, BarChart3,
  Calendar, Info
} from "lucide-react";
import { 
  isSameDay, startOfDay, parseISO, format, differenceInDays, 
  isAfter, subHours, differenceInHours,
  startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval 
} from 'date-fns';
import { getBookings, checkIn, checkOut } from "../services/bookingServices";
import { getRooms } from "../services/roomServices";

/* ================= CONSTANTS ================= */
const STATUS = {
  PENDING: "Pending",
  CHECKED_IN: "Checked-in",
  CHECKED_OUT: "Checked-out",
  CANCELLED: "Cancelled",
};

export default function Dashboard() {
  const navigate = useNavigate();
  
  // Data State
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI State
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [actionLoading, setActionLoading] = useState({}); // { bookingId: true }
  const [view, setView] = useState("today"); // today | week | month

  /* ================= FETCH DATA ================= */
  const fetchData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setError(null);
    try {
      const [bookingsRes, roomsRes] = await Promise.all([
        getBookings(),
        getRooms()
      ]);
      
      const bookingsData = bookingsRes.data?.data || bookingsRes.data || [];
      const roomsData = roomsRes.data?.data || roomsRes.data || [];
      
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setRooms(Array.isArray(roomsData) ? roomsData : []);
    } catch (err) {
      console.error("❌ Dashboard Load Error:", err);
      setError("Failed to load dashboard data. Please check your connection.");
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ================= SEARCH DEBOUNCE ================= */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  /* ================= DERIVED STATS (MEMOIZED) ================= */
  const today = useMemo(() => startOfDay(new Date()), []);

  const isInRange = useCallback((date) => {
    if (!date) return false;
    if (view === "today") return isSameDay(date, today);
    
    if (view === "week") {
      return isWithinInterval(date, {
        start: startOfWeek(today),
        end: endOfWeek(today),
      });
    }
    
    if (view === "month") {
      return isWithinInterval(date, {
        start: startOfMonth(today),
        end: endOfMonth(today),
      });
    }
    return false;
  }, [view, today]);

  const dashboardData = useMemo(() => {
    // 1. Filter for raw events within range
    const rawEvents = bookings.filter(b => {
      if (b.status === STATUS.CANCELLED) return false;
      const ci = b.check_in ? parseISO(b.check_in) : null;
      const co = b.check_out ? parseISO(b.check_out) : null;
      return isInRange(ci) || isInRange(co);
    });

    // 2. Separate counts (Always Today for Top Cards to keep operational focus)
    const checkInsCount = bookings.filter(b => {
      const date = b.check_in ? parseISO(b.check_in) : null;
      return date && isSameDay(date, today) && b.status !== STATUS.CANCELLED;
    }).length;

    const checkOutsCount = bookings.filter(b => {
      const date = b.check_out ? parseISO(b.check_out) : null;
      return date && isSameDay(date, today) && b.status !== STATUS.CANCELLED;
    }).length;

    // 3. Process events for table (Merging same-day cases)
    const processedEventsMap = new Map();

    rawEvents.forEach(b => {
      const ci = b.check_in ? parseISO(b.check_in) : null;
      const co = b.check_out ? parseISO(b.check_out) : null;
      const isCiInRange = isInRange(ci);
      const isCoInRange = isInRange(co);

      if (isCiInRange && isCoInRange && ci && co && isSameDay(ci, co)) {
        processedEventsMap.set(b.id, { ...b, opType: 'both', sortDate: ci });
      } else if (isCiInRange) {
        processedEventsMap.set(`${b.id}-ci`, { ...b, opType: 'check-in', sortDate: ci });
      } else if (isCoInRange) {
        processedEventsMap.set(`${b.id}-co`, { ...b, opType: 'check-out', sortDate: co });
      }
    });

    const combinedList = Array.from(processedEventsMap.values()).sort((a, b) => {
      const diff = new Date(a.sortDate) - new Date(b.sortDate);
      if (diff !== 0) return diff;
      if (a.opType === 'check-in' && b.opType !== 'check-in') return -1;
      if (b.opType === 'check-in' && a.opType !== 'check-in') return 1;
      return 0;
    });

    const occupiedCount = rooms.filter(r => r.status?.toLowerCase() === 'occupied' || r.status?.toLowerCase() === 'booked').length;
    const availableCount = rooms.length - occupiedCount;

    // Financial Metrics (based on events in active range)
    const totalRevenue = combinedList.reduce((sum, b) => sum + (Number(b.total_amount || b.total_amt || 0)), 0);
    const totalCollected = combinedList.reduce((sum, b) => sum + (Number(b.paid_amount || b.advance_paid || b.total_paid || 0)), 0);
    const totalPending = totalRevenue - totalCollected;

    const filteredList = combinedList.filter(b => {
      const term = debouncedSearch.toLowerCase();
      return (
        b.guest_name?.toLowerCase().includes(term) ||
        b.id?.toString().includes(term) ||
        (b.rooms?.[0]?.room_no || "").toString().includes(term)
      );
    }).slice(0, 10);

    // Placeholder Fill (min 5 rows)
    const tableRows = [...filteredList];
    while (tableRows.length > 0 && tableRows.length < 5 && !debouncedSearch) {
      tableRows.push({ isEmpty: true, id: `empty-${tableRows.length}` });
    }

    return {
      checkInsCount,
      checkOutsCount,
      occupiedCount,
      availableCount,
      filteredList: tableRows,
      totalCount: combinedList.length,
      totalRevenue,
      totalCollected,
      totalPending
    };
  }, [bookings, rooms, today, debouncedSearch, isInRange]);

  const handleAction = async (e, id, type) => {
    e.stopPropagation(); // Safe navigation guard
    if (actionLoading[id]) return;
    const confirmMsg = type === 'checkin' ? "Confirm Check-in?" : "Confirm Check-out?";
    if (!window.confirm(confirmMsg)) return;

    setActionLoading(prev => ({ ...prev, [id]: true }));
    const toastId = toast.loading(`${type === 'checkin' ? 'Checking in' : 'Checking out'}...`);

    try {
      if (type === 'checkin') await checkIn(id);
      else await checkOut(id);
      toast.success("Action successful!", { id: toastId });
      await fetchData(true);
    } catch (err) {
      toast.error(`Failed to handle action.`, { id: toastId });
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  /* ================= HELPERS ================= */
  const formatDateSafe = (dateStr) => {
    try {
      if (!dateStr) return "—";
      return format(parseISO(dateStr), "dd MMM, hh:mm a");
    } catch (e) {
      return dateStr;
    }
  };

  const getNights = (start, end) => {
    try {
       if (!start || !end) return 1;
       const diff = differenceInDays(parseISO(end), parseISO(start));
       return diff <= 0 ? 1 : diff;
    } catch (e) { return 1; }
  };

  const getUrgency = (booking) => {
    if (booking.status !== STATUS.PENDING) return null;
    const checkInDate = booking.check_in ? parseISO(booking.check_in) : null;
    if (!checkInDate || !isSameDay(checkInDate, today)) return null;
    
    const now = new Date();
    if (isAfter(now, subHours(checkInDate, 2))) {
        const hours = differenceInHours(checkInDate, now);
        if (hours <= 0) return "Arriving now";
        return `Arriving in < ${hours + 1} hrs`;
    }
    return null;
  };

  if (loading) return <DashboardSkeleton />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  return (
    <div className="space-y-4">
      
      {/* 1. TOP STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Check-ins Today" value={dashboardData.checkInsCount} icon={<Users className="w-5 h-5"/>} color="blue" />
        <StatCard title="Check-outs Today" value={dashboardData.checkOutsCount} icon={<LogOut className="w-5 h-5"/>} color="orange" />
        <StatCard title="Available Rooms" value={dashboardData.availableCount} icon={<Home className="w-5 h-5"/>} color="green" />
        <StatCard title="Occupied Rooms" value={dashboardData.occupiedCount} icon={<Hotel className="w-5 h-5"/>} color="purple" />
      </div>

      {/* 2. MAIN GRID (70/30) */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* LEFT: OPERATIONS HUB */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-white border border-gray-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
               </div>
               <p className="text-sm text-gray-700 font-semibold tracking-tight">
                {dashboardData.totalCount} operations scheduled for {view === 'today' ? 'today' : view}
               </p>
            </div>
            <button onClick={() => navigate(`/bookings?view=${view}`)} className="text-[11px] text-blue-600 font-bold uppercase tracking-wider hover:underline">
              View All
            </button>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50/20 rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Operational Hub</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                        <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Live</p>
                    </div>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-xl">
                  {["today", "week", "month"].map(v => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded-lg font-bold transition-all ${
                        view === v
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input 
                  type="text"
                  placeholder="Search name, ID, or room..."
                  className="w-full pl-10 pr-4 py-2 bg-white/60 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400 font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto max-h-[440px] border-t border-gray-100 transition-all duration-150 ease-out">
              {dashboardData.filteredList.length > 0 ? (
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[10px] font-medium text-gray-500 uppercase tracking-widest border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3.5">Guest & Details</th>
                      <th className="px-6 py-3.5">Room</th>
                      <th className="px-6 py-3.5 hidden sm:table-cell">Arrival / Departure</th>
                      <th className="px-6 py-3.5 hidden md:table-cell">Status</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {dashboardData.filteredList.map((booking, index) => booking.isEmpty ? (
                      <tr key={booking.id} className="opacity-10">
                        <td className="px-6 py-4">—</td>
                        <td className="px-6 py-4">—</td>
                        <td className="px-6 py-4 hidden sm:table-cell">—</td>
                        <td className="px-6 py-4 hidden md:table-cell">—</td>
                        <td className="px-6 py-4 text-right">—</td>
                      </tr>
                    ) : (
                      <tr 
                        key={`${booking.id}-${booking.opType}`} 
                        onClick={() => navigate(`/bookings/${booking.id}`)}
                        className="hover:bg-gray-50 transition-all cursor-pointer group border-l-4 border-transparent hover:border-blue-600 relative"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 mb-1">
                             <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors text-sm tracking-tight">{booking.guest_name}</p>
                             <div className="flex gap-1">
                                {booking.opType === 'both' ? (
                                    <>
                                        <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter bg-blue-50 text-blue-600">Arrival</span>
                                        <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter bg-orange-50 text-orange-600">Departure</span>
                                    </>
                                ) : (
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter ${
                                        booking.opType === 'check-in' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                                    }`}>
                                        {booking.opType === 'check-in' ? 'Arrival' : 'Departure'}
                                    </span>
                                )}
                             </div>
                             {index === 0 && !debouncedSearch && view === 'today' && (
                                <span className="text-[9px] text-green-600 font-bold bg-green-50 px-1 rounded animate-pulse">NEXT</span>
                             )}
                          </div>
                          <div className="flex items-center gap-2">
                             <p className="text-[10px] text-gray-400 font-medium tracking-tight">#{booking.id}</p>
                             <span className="text-gray-300">•</span>
                             <p className="text-[10px] text-gray-500 font-medium whitespace-nowrap">
                                {getNights(booking.check_in, booking.check_out)} Nights • ₹{booking.total_amount || booking.total_amt || "0"}
                             </p>
                          </div>
                          {/* Payment Line */}
                          <div className="flex items-center gap-2 mt-0.5">
                             <p className={`text-[10px] font-bold ${((Number(booking.total_amount || booking.total_amt || 0) - Number(booking.paid_amount || booking.advance_paid || 0)) > 0) ? 'text-red-500' : 'text-green-600'}`}>
                                {(Number(booking.total_amount || booking.total_amt || 0) - Number(booking.paid_amount || booking.advance_paid || 0)) > 0 
                                  ? `Due ₹${Number(booking.total_amount || booking.total_amt || 0) - Number(booking.paid_amount || booking.advance_paid || 0)}`
                                  : `Paid ₹${booking.total_amount || booking.total_amt || "0"}`}
                             </p>
                             {(Number(booking.total_amount || booking.total_amt || 0) - Number(booking.paid_amount || booking.advance_paid || 0)) > 5000 && (
                               <span className="text-[9px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded border border-red-100 font-bold uppercase tracking-tight">
                                  HIGH PENDING
                               </span>
                             )}
                          </div>
                          {booking.status === STATUS.PENDING && (booking.opType === 'check-in' || booking.opType === 'both') && (
                            <p className="text-[10px] text-amber-600 font-semibold mt-1 flex items-center gap-1">
                               <Clock className="w-2.5 h-2.5" /> Awaiting Check-in
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-gray-50 border border-gray-100 rounded-lg text-xs font-semibold text-gray-600">
                             {booking.rooms?.[0]?.room_no || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <div className="text-[10px] font-medium space-y-1">
                            <div className="flex items-center gap-2 text-gray-700">
                                <ArrowRight className={`w-2.5 h-2.5 ${(booking.opType === 'check-in' || booking.opType === 'both') ? 'text-blue-500 font-bold' : 'text-gray-300'}`} />
                                <span className={(booking.opType === 'check-in' || booking.opType === 'both') ? 'font-bold' : ''}>{formatDateSafe(booking.check_in)}</span>
                                {getUrgency(booking) && (
                                    <span className="text-red-500 font-bold ml-1 animate-pulse flex items-center gap-1">
                                      <AlertCircle className="w-2.5 h-2.5" /> {getUrgency(booking)}
                                    </span>
                                )}
                            </div>
                            <p className="flex items-center gap-2 text-gray-400">
                                <LogOut className={`w-2.5 h-2.5 ${(booking.opType === 'check-out' || booking.opType === 'both') ? 'text-orange-500 font-bold' : 'text-gray-300'}`} />
                                <span className={(booking.opType === 'check-out' || booking.opType === 'both') ? 'font-bold' : ''}>{formatDateSafe(booking.check_out)}</span>
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <StatusBadge status={booking.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {booking.status === STATUS.PENDING && (booking.opType === 'check-in' || booking.opType === 'both') && (
                              <button 
                                onClick={(e) => handleAction(e, booking.id, 'checkin')}
                                disabled={actionLoading[booking.id]}
                                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 shadow-sm transition-all hover:scale-[1.02] disabled:opacity-50"
                              >
                                {actionLoading[booking.id] ? "..." : "Check-in"}
                              </button>
                            )}
                            {booking.status === STATUS.CHECKED_IN && (booking.opType === 'check-out' || booking.opType === 'both') && (
                              <button 
                                onClick={(e) => handleAction(e, booking.id, 'checkout')}
                                disabled={actionLoading[booking.id]}
                                className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-semibold hover:bg-orange-600 shadow-sm transition-all hover:scale-[1.02] disabled:opacity-50"
                              >
                                {actionLoading[booking.id] ? "..." : "Check-out"}
                              </button>
                            )}
                            <button className="p-1.5 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all hidden sm:block">
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <EmptyState searchTerm={searchTerm} />
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: QUICK PANEL */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          
          {/* A. TODAY SUMMARY */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-3">{view} Summary</h3>
            <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                    <p className="text-4xl font-bold text-gray-900 tracking-tighter">
                        {dashboardData.totalCount}
                    </p>
                    <p className="text-[11px] text-gray-400 font-medium">Daily Actions</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                    <div>
                        <p className="text-lg font-bold text-blue-600">{dashboardData.checkInsCount}</p>
                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tight">Check-ins</p>
                    </div>
                    <div>
                        <p className="text-lg font-bold text-orange-600">{dashboardData.checkOutsCount}</p>
                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tight">Check-outs</p>
                    </div>
                </div>

                {/* Financial Insights - Zero Redesign */}
                <div className="pt-4 border-t border-gray-50 space-y-3">
                    <div className="flex justify-between items-center">
                        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-tight">Total Revenue</p>
                        <p className="text-base font-bold text-gray-900">₹{dashboardData.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-tight">Collected</p>
                        <p className="text-base font-bold text-green-600">₹{dashboardData.totalCollected.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-tight">Pending</p>
                        <p className="text-base font-bold text-red-600">₹{dashboardData.totalPending.toLocaleString()}</p>
                    </div>
                </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 tracking-tight">Quick Actions</h3>
            <div className="flex gap-3">
              <ActionButton 
                label="New Booking" 
                icon={<Plus className="w-4 h-4" />} 
                onClick={() => navigate('/bookings')}
                color="blue"
              />
              <ActionButton 
                label="Search" 
                icon={<Search className="w-4 h-4" />} 
                onClick={() => navigate('/bookings')}
                color="gray"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 tracking-tight">Room Availability</h3>
                <Bed className="w-4 h-4 text-gray-400" />
            </div>
            <div className="space-y-2">
              <RoomStatusRow label="Available Now" count={dashboardData.availableCount} color="green" />
              <RoomStatusRow label="Occupied" count={dashboardData.occupiedCount} color="purple" />
              <div className="pt-2 border-t border-gray-50 mt-2">
                <RoomStatusRow label="Total Units" count={rooms.length} color="gray" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ================= SUB-COMPONENTS ================= */

function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    green: "bg-green-50 text-green-600 border-green-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };
  
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all flex items-center justify-between group">
      <div className="space-y-0.5">
        <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">{title}</p>
        <p className="text-3xl font-bold text-gray-900 tracking-tighter">{value}</p>
      </div>
      <div className={`p-2.5 rounded-xl border ${colors[color]} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    [STATUS.PENDING]: "bg-yellow-50 text-yellow-700 border-yellow-200",
    [STATUS.CHECKED_IN]: "bg-green-50 text-green-700 border-green-200",
    [STATUS.CHECKED_OUT]: "bg-gray-50 text-gray-500 border-gray-200 shadow-inner",
    [STATUS.CANCELLED]: "bg-red-50 text-red-700 border-red-200",
  };
  
  return (
    <span className={`px-2 py-0.5 rounded-md text-[9px] uppercase font-bold border tracking-wider ${styles[status] || styles[STATUS.PENDING]}`}>
      {status}
    </span>
  );
}

function ActionButton({ label, icon, onClick, color }) {
    const bg = color === 'blue' ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200';
    return (
        <button 
            onClick={onClick}
            className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl transition-all font-semibold text-xs hover:scale-[1.02] ${bg}`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}

function RoomStatusRow({ label, count, color }) {
  const dots = { green: "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]", purple: "bg-purple-500", gray: "bg-gray-400" };
  return (
    <div className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-blue-50 transition-colors">
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-tighter">
        <div className={`w-1.5 h-1.5 rounded-full ${dots[color]}`} />
        <span>{label}</span>
      </div>
      <span className="text-sm font-bold text-gray-900 tracking-tight">{count}</span>
    </div>
  );
}

function EmptyState({ searchTerm }) {
  return (
    <div className="py-16 text-center border-t border-gray-100">
      <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
        <Clock className="w-6 h-6 text-gray-300" />
      </div>
      <h3 className="text-gray-900 font-semibold text-sm uppercase tracking-tight">{searchTerm ? "No results found" : "All Quiet Today"}</h3>
      <p className="text-gray-400 text-[10px] font-medium mt-1">Check filters or adjust your search term.</p>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="py-20 text-center bg-white rounded-3xl border border-red-50">
      <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-bold text-gray-900 tracking-tight uppercase">Connection Error</h3>
      <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto font-medium">{message}</p>
      <button onClick={() => onRetry()} className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-all inline-flex items-center gap-2 text-sm uppercase">
        <RefreshCw className="w-4 h-4" /> Reconnect
      </button>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 h-[500px] bg-gray-50 rounded-2xl" />
        <div className="col-span-4 h-[500px] bg-gray-50 rounded-2xl" />
      </div>
    </div>
  );
}