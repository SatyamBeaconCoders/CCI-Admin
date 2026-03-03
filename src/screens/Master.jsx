
// // 📁 screens/Master.jsx (Updated - Settings removed)
// import { useState, useEffect } from "react";
// import { Plus, Trash2, Pencil, X, Users, Home, User, Mail, Phone, Key, CheckCircle, AlertCircle, Search } from "lucide-react";

// // Import services
// import * as roomService from "../services/roomServices";
// import * as memberService from "../services/memberServices";
// import * as userService from "../services/userServices";

// export default function Masters() {
//   const [activeTab, setActiveTab] = useState("rooms");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Master Data Management</h1>
//           <p className="text-gray-600 mt-1">Manage rooms and members</p>
//         </div>

//         {/* Error Display */}
//         {error && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
//             <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
//             <p className="text-red-700">{error}</p>
//             <button onClick={() => setError("")} className="ml-auto">
//               <X className="w-4 h-4 text-red-500" />
//             </button>
//           </div>
//         )}

//         {/* ===== Tabs ===== */}
//         <div className="bg-white rounded-xl shadow-sm p-2 mb-6 inline-flex">
//           <Tab 
//             label="Rooms" 
//             icon={<Home className="w-4 h-4" />}
//             active={activeTab === "rooms"} 
//             onClick={() => setActiveTab("rooms")} 
//           />
//           <Tab 
//             label="Members" 
//             icon={<Users className="w-4 h-4" />}
//             active={activeTab === "members"} 
//             onClick={() => setActiveTab("members")} 
//           />
//         </div>

//         {activeTab === "rooms" && <RoomsMaster setError={setError} setLoading={setLoading} />}
//         {activeTab === "members" && <MembersMaster setError={setError} setLoading={setLoading} />}

//         {/* Loading Overlay */}
//         {loading && (
//           <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
//             <div className="bg-white rounded-xl p-6 flex items-center gap-3">
//               <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
//               <span className="text-gray-700">Processing...</span>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ================= TAB ================= */
// function Tab({ label, icon, active, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
//         active 
//           ? "bg-orange-500 text-white shadow-sm" 
//           : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
//       }`}
//     >
//       {icon}
//       {label}
//     </button>
//   );
// }

// /* ================= ROOMS MASTER ================= */
// function RoomsMaster({ setError, setLoading }) {
//   const [rooms, setRooms] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [editingRoom, setEditingRoom] = useState(null);
//   const [form, setForm] = useState({
//     room_no: "",
//     type: "Standard",
//     guest_limit: 2,
//     status: "Available",
//     price_3day: "",
//     price_7day: "",
//     price_8day: ""
//   });

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(0);
//   const [pageSize] = useState(4);
//   const [hasMore, setHasMore] = useState(true);

//   // Room types and statuses
//   const roomTypes = ["Standard", "Deluxe", "Premium", "Suite", "Family"];
//   const roomStatuses = ["Available", "Booked", "Maintenance", "Cleaning"];

//   useEffect(() => {
//     fetchRooms();
//   }, []);

//   const fetchRooms = async () => {
//     try {
//       setLoading(true);
//       const response = await roomService.getRooms();
//       setRooms(response.data || []);
//       setCurrentPage(0); // Reset to first page when fetching all rooms
//       setHasMore(response.data && response.data.length > pageSize);
//       setError("");
//     } catch (err) {
//       console.error("❌ ROOMS FETCH ERROR:", err);
//       setError("Failed to load rooms. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter rooms based on search term
//   const filteredRooms = rooms.filter(room =>
//     room.room_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     room.status.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Get paginated rooms
//   const paginatedRooms = filteredRooms.slice(0, (currentPage + 1) * pageSize);

//   // Load more rooms
//   const loadMoreRooms = () => {
//     const nextPage = currentPage + 1;
//     const nextStartIndex = nextPage * pageSize;
//     const nextEndIndex = (nextPage + 1) * pageSize;
//     const nextBatch = filteredRooms.slice(nextStartIndex, nextEndIndex);
    
//     if (nextBatch.length > 0) {
//       setCurrentPage(nextPage);
//       if (filteredRooms.length <= nextEndIndex) {
//         setHasMore(false);
//       }
//     }
//   };

//   // Reset pagination when search term changes
//   useEffect(() => {
//     setCurrentPage(0);
//     setHasMore(filteredRooms.length > pageSize);
//   }, [searchTerm, rooms]);

//   const handleSubmit = async () => {
//     // Validation
//     if (!form.room_no || !form.type || !form.guest_limit) {
//       setError("Room number, type, and guest limit are required");
//       return;
//     }

//     if (!form.price_3day || !form.price_7day || !form.price_8day) {
//       setError("All price fields are required");
//       return;
//     }

//     try {
//       setLoading(true);
      
//       if (editingRoom) {
//         // Update existing room
//         await roomService.updateRoom(editingRoom.id, {
//           ...form,
//           price_3day: parseFloat(form.price_3day),
//           price_7day: parseFloat(form.price_7day),
//           price_8day: parseFloat(form.price_8day)
//         });
//       } else {
//         // Create new room
//         await roomService.createRoom({
//           ...form,
//           price_3day: parseFloat(form.price_3day),
//           price_7day: parseFloat(form.price_7day),
//           price_8day: parseFloat(form.price_8day)
//         });
//       }
      
//       await fetchRooms();
//       resetForm();
//       setShowForm(false);
//     } catch (err) {
//       console.error("❌ ROOM SAVE ERROR:", err.response?.data || err);
//       setError(err.response?.data?.message || "Failed to save room. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this room?")) return;
    
//     try {
//       setLoading(true);
//       await roomService.deleteRoom(id);
//       await fetchRooms();
//       setError("");
//     } catch (err) {
//       console.error("❌ ROOM DELETE ERROR:", err);
//       setError("Failed to delete room. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setForm({
//       room_no: "",
//       type: "Standard",
//       guest_limit: 2,
//       status: "Available",
//       price_3day: "",
//       price_7day: "",
//       price_8day: ""
//     });
//     setEditingRoom(null);
//   };

//   const openEdit = (room) => {
//     setEditingRoom(room);
//     setForm({
//       room_no: room.room_no,
//       type: room.type,
//       guest_limit: room.guest_limit,
//       status: room.status,
//       price_3day: room.price_3day,
//       price_7day: room.price_7day,
//       price_8day: room.price_8day
//     });
//     setShowForm(true);
//   };

//   const openAdd = () => {
//     resetForm();
//     setShowForm(true);
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Available": return "bg-green-100 text-green-800";
//       case "Booked": return "bg-blue-100 text-blue-800";
//       case "Maintenance": return "bg-red-100 text-red-800";
//       case "Cleaning": return "bg-yellow-100 text-yellow-800";
//       default: return "bg-gray-100 text-gray-800";
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header with Actions */}
//       <div className="bg-white rounded-xl shadow-sm p-4">
//         <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-orange-50 rounded-lg">
//               <Home className="w-5 h-5 text-orange-500" />
//             </div>
//             <div>
//               <h2 className="text-lg font-bold text-gray-900">Room Management</h2>
//               <p className="text-sm text-gray-600">Manage all hotel rooms and pricing</p>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-3">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search rooms..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//               />
//             </div>
//             <button
//               onClick={openAdd}
//               className="px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
//             >
//               <Plus className="w-4 h-4" />
//               Add Room
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <div className="bg-white rounded-xl shadow-sm p-4">
//           <p className="text-sm text-gray-600">Total Rooms</p>
//           <p className="text-2xl font-bold text-gray-900">{rooms.length}</p>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-4">
//           <p className="text-sm text-gray-600">Available</p>
//           <p className="text-2xl font-bold text-green-600">
//             {rooms.filter(r => r.status === "Available").length}
//           </p>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-4">
//           <p className="text-sm text-gray-600">Occupied</p>
//           <p className="text-2xl font-bold text-blue-600">
//             {rooms.filter(r => r.status === "Booked").length}
//           </p>
//         </div>
//         <div className="bg-white rounded-xl shadow-sm p-4">
//           <p className="text-sm text-gray-600">Under Maintenance</p>
//           <p className="text-2xl font-bold text-red-600">
//             {rooms.filter(r => r.status === "Maintenance").length}
//           </p>
//         </div>
//       </div>

//       {/* Rooms Table */}
//       <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="bg-gray-50 border-b border-gray-200">
//                 <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Room No</th>
//                 <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Type</th>
//                 <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Guest Limit</th>
//                 <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Status</th>
//                 <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Prices (3/7/8+ days)</th>
//                 <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {paginatedRooms.length > 0 ? (
//                 paginatedRooms.map((room) => (
//                   <tr key={room.id} className="hover:bg-gray-50">
//                     <td className="py-4 px-6">
//                       <div className="flex items-center gap-3">
//                         <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
//                           <Home className="w-4 h-4 text-orange-500" />
//                         </div>
//                         <span className="font-medium text-gray-900">{room.room_no}</span>
//                       </div>
//                     </td>
//                     <td className="py-4 px-6">
//                       <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
//                         {room.type}
//                       </span>
//                     </td>
//                     <td className="py-4 px-6">
//                       <div className="flex items-center gap-2">
//                         <Users className="w-4 h-4 text-gray-400" />
//                         <span>{room.guest_limit} guests</span>
//                       </div>
//                     </td>
//                     <td className="py-4 px-6">
//                       <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
//                         {room.status}
//                       </span>
//                     </td>
//                     <td className="py-4 px-6">
//                       <div className="flex flex-col gap-1">
//                         <span className="text-sm">₹{room.price_3day} (3 days)</span>
//                         <span className="text-sm">₹{room.price_7day} (7 days)</span>
//                         <span className="text-sm">₹{room.price_8day} (8+ days)</span>
//                       </div>
//                     </td>
//                     <td className="py-4 px-6">
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => openEdit(room)}
//                           className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                           title="Edit"
//                         >
//                           <Pencil className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(room.id)}
//                           className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                           title="Delete"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="py-12 text-center">
//                     <div className="flex flex-col items-center justify-center">
//                       <Home className="w-12 h-12 text-gray-300 mb-4" />
//                       <p className="text-gray-500">No rooms found</p>
//                       {searchTerm && (
//                         <button
//                           onClick={() => setSearchTerm("")}
//                           className="mt-2 text-orange-600 hover:text-orange-700 text-sm font-medium"
//                         >
//                           Clear search
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Load More Button */}
//       {filteredRooms.length > pageSize && hasMore && (
//         <div className="flex justify-center mt-4">
//           <button
//             onClick={loadMoreRooms}
//             className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
//           >
//             Load More Rooms
//           </button>
//         </div>
//       )}

//       {/* Room Form Modal */}
//       {showForm && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
//             <div className="p-6 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-orange-50 rounded-lg">
//                     <Home className="w-5 h-5 text-orange-500" />
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-bold text-gray-900">
//                       {editingRoom ? "Edit Room" : "Add New Room"}
//                     </h3>
//                     <p className="text-sm text-gray-600">
//                       {editingRoom ? "Update room details" : "Enter new room information"}
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowForm(false);
//                     resetForm();
//                   }}
//                   className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                 >
//                   <X className="w-5 h-5 text-gray-500" />
//                 </button>
//               </div>
//             </div>

//             <div className="p-6 space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Room Number *
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="e.g., 101, 201"
//                   value={form.room_no}
//                   onChange={(e) => setForm({ ...form, room_no: e.target.value })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Room Type *
//                 </label>
//                 <select
//                   value={form.type}
//                   onChange={(e) => setForm({ ...form, type: e.target.value })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                 >
//                   {roomTypes.map((type) => (
//                     <option key={type} value={type}>{type}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Guest Limit *
//                 </label>
//                 <input
//                   type="number"
//                   min="1"
//                   max="10"
//                   value={form.guest_limit}
//                   onChange={(e) => setForm({ ...form, guest_limit: parseInt(e.target.value) || 1 })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Status
//                 </label>
//                 <select
//                   value={form.status}
//                   onChange={(e) => setForm({ ...form, status: e.target.value })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                 >
//                   {roomStatuses.map((status) => (
//                     <option key={status} value={status}>{status}</option>
//                   ))}
//                 </select>
//               </div>

//               <div className="grid grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     3 Days Price *
//                   </label>
//                   <input
//                     type="number"
//                     placeholder="₹"
//                     value={form.price_3day}
//                     onChange={(e) => setForm({ ...form, price_3day: e.target.value })}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     7 Days Price *
//                   </label>
//                   <input
//                     type="number"
//                     placeholder="₹"
//                     value={form.price_7day}
//                     onChange={(e) => setForm({ ...form, price_7day: e.target.value })}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     8+ Days Price *
//                   </label>
//                   <input
//                     type="number"
//                     placeholder="₹"
//                     value={form.price_8day}
//                     onChange={(e) => setForm({ ...form, price_8day: e.target.value })}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
//               <button
//                 onClick={() => {
//                   setShowForm(false);
//                   resetForm();
//                 }}
//                 className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmit}
//                 className="px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
//               >
//                 <CheckCircle className="w-4 h-4" />
//                 {editingRoom ? "Update Room" : "Create Room"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ================= MEMBERS MASTER ================= */
// function MembersMaster({ setError, setLoading }) {
//   const [members, setMembers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [editingMember, setEditingMember] = useState(null);
//   const [form, setForm] = useState({
//     name: "",
//     membership_no: "",
//     mobile_no: "",
//     email: "",
//     address: ""
//   });

//   useEffect(() => {
//     fetchMembers();
//   }, []);

//   const fetchMembers = async () => {
//     try {
//       setLoading(true);
//       const response = await memberService.getMembers();
//       setMembers(response.data || []);
//       setError("");
//     } catch (err) {
//       console.error("❌ MEMBERS FETCH ERROR:", err);
//       setError("Failed to load members. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!form.name || !form.membership_no || !form.mobile_no) {
//       setError("Name, membership number, and mobile number are required");
//       return;
//     }

//     try {
//       setLoading(true);
      
//       if (editingMember) {
//         await memberService.updateMember(editingMember.id, form);
//       } else {
//         await memberService.createMember(form);
//       }
      
//       await fetchMembers();
//       resetForm();
//       setShowForm(false);
//     } catch (err) {
//       console.error("❌ MEMBER SAVE ERROR:", err.response?.data || err);
//       setError(err.response?.data?.message || "Failed to save member. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this member?")) return;
    
//     try {
//       setLoading(true);
//       await memberService.deleteMember(id);
//       await fetchMembers();
//     } catch (err) {
//       console.error("❌ MEMBER DELETE ERROR:", err);
//       setError("Failed to delete member. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setForm({
//       name: "",
//       membership_no: "",
//       mobile_no: "",
//       email: "",
//       address: ""
//     });
//     setEditingMember(null);
//   };

//   const openEdit = (member) => {
//     setEditingMember(member);
//     setForm({
//       name: member.name || "",
//       membership_no: member.membership_no || "",
//       mobile_no: member.mobile_no || "",
//       email: member.email || "",
//       address: member.address || ""
//     });
//     setShowForm(true);
//   };

//   const openAdd = () => {
//     resetForm();
//     setShowForm(true);
//   };

//   const filteredMembers = members.filter(member =>
//     member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     member.membership_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     member.mobile_no?.includes(searchTerm)
//   );

//   return (
//     <div className="space-y-6">
//       {/* Header with Actions */}
//       <div className="bg-white rounded-xl shadow-sm p-4">
//         <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-green-50 rounded-lg">
//               <Users className="w-5 h-5 text-green-500" />
//             </div>
//             <div>
//               <h2 className="text-lg font-bold text-gray-900">Member Management</h2>
//               <p className="text-sm text-gray-600">Manage all hotel members</p>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-3">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search members..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//               />
//             </div>
//             <button
//               onClick={openAdd}
//               className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
//             >
//               <Plus className="w-4 h-4" />
//               Add Member
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Members Table */}
//       <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="bg-gray-50 border-b border-gray-200">
//                 <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Member</th>
//                 <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Membership No</th>
//                 <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Contact</th>
//                 <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Address</th>
//                 <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {filteredMembers.length > 0 ? (
//                 filteredMembers.map((member) => (
//                   <tr key={member.id} className="hover:bg-gray-50">
//                     <td className="py-4 px-6">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
//                           <User className="w-5 h-5 text-green-500" />
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-900">{member.name}</p>
//                           <p className="text-sm text-gray-500">{member.email}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="py-4 px-6">
//                       <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
//                         {member.membership_no}
//                       </span>
//                     </td>
//                     <td className="py-4 px-6">
//                       <div className="space-y-1">
//                         <div className="flex items-center gap-2">
//                           <Phone className="w-4 h-4 text-gray-400" />
//                           <span className="text-sm">{member.mobile_no}</span>
//                         </div>
//                         {member.email && (
//                           <div className="flex items-center gap-2">
//                             <Mail className="w-4 h-4 text-gray-400" />
//                             <span className="text-sm text-gray-500">{member.email}</span>
//                           </div>
//                         )}
//                       </div>
//                     </td>
//                     <td className="py-4 px-6">
//                       <span className="text-sm text-gray-600 line-clamp-2">
//                         {member.address || "No address provided"}
//                       </span>
//                     </td>
//                     <td className="py-4 px-6">
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => openEdit(member)}
//                           className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                           title="Edit"
//                         >
//                           <Pencil className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(member.id)}
//                           className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                           title="Delete"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="5" className="py-12 text-center">
//                     <div className="flex flex-col items-center justify-center">
//                       <Users className="w-12 h-12 text-gray-300 mb-4" />
//                       <p className="text-gray-500">No members found</p>
//                       {searchTerm && (
//                         <button
//                           onClick={() => setSearchTerm("")}
//                           className="mt-2 text-orange-600 hover:text-orange-700 text-sm font-medium"
//                         >
//                           Clear search
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Member Form Modal */}
//       {showForm && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
//             <div className="p-6 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-green-50 rounded-lg">
//                     <Users className="w-5 h-5 text-green-500" />
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-bold text-gray-900">
//                       {editingMember ? "Edit Member" : "Add New Member"}
//                     </h3>
//                     <p className="text-sm text-gray-600">
//                       {editingMember ? "Update member details" : "Enter new member information"}
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowForm(false);
//                     resetForm();
//                   }}
//                   className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                 >
//                   <X className="w-5 h-5 text-gray-500" />
//                 </button>
//               </div>
//             </div>

//             <div className="p-6 space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Full Name *
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter member name"
//                   value={form.name}
//                   onChange={(e) => setForm({ ...form, name: e.target.value })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Membership Number *
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="e.g., M123456"
//                   value={form.membership_no}
//                   onChange={(e) => setForm({ ...form, membership_no: e.target.value })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Mobile Number *
//                 </label>
//                 <input
//                   type="tel"
//                   placeholder="9876543210"
//                   value={form.mobile_no}
//                   onChange={(e) => setForm({ ...form, mobile_no: e.target.value })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   placeholder="member@example.com"
//                   value={form.email}
//                   onChange={(e) => setForm({ ...form, email: e.target.value })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Address
//                 </label>
//                 <textarea
//                   placeholder="Enter full address"
//                   value={form.address}
//                   onChange={(e) => setForm({ ...form, address: e.target.value })}
//                   rows="3"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                 />
//               </div>
//             </div>

//             <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
//               <button
//                 onClick={() => {
//                   setShowForm(false);
//                   resetForm();
//                 }}
//                 className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmit}
//                 className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
//               
//                 <CheckCircle className="w-4 h-4" />
//                 {editingMember ? "Update Member" : "Create Member"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// 📁 screens/Master.jsx (Complete – with scrollable room table)
import { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Trash2, Pencil, X, Users, Home, User, Mail, Phone, Key, CheckCircle, AlertCircle, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

// Import services
import * as roomService from "../services/roomServices";
import * as memberService from "../services/memberServices";
import * as userService from "../services/userServices";

export default function Masters() {
  const [activeTab, setActiveTab] = useState("rooms");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Master Data Management</h1>
          <p className="text-gray-600 mt-1">Manage rooms and members</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
            <button onClick={() => setError("")} className="ml-auto">
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}

        {/* ===== Tabs ===== */}
        <div className="bg-white rounded-xl shadow-sm p-2 mb-6 inline-flex">
          <Tab 
            label="Rooms" 
            icon={<Home className="w-4 h-4" />}
            active={activeTab === "rooms"} 
            onClick={() => setActiveTab("rooms")} 
          />
          <Tab 
            label="Members" 
            icon={<Users className="w-4 h-4" />}
            active={activeTab === "members"} 
            onClick={() => setActiveTab("members")} 
          />
        </div>

        {activeTab === "rooms" && <RoomsMaster setError={setError} setLoading={setLoading} />}
        {activeTab === "members" && <MembersMaster setError={setError} setLoading={setLoading} />}

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-700">Processing...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= TAB ================= */
function Tab({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
        active 
          ? "bg-orange-500 text-white shadow-sm" 
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

/* ================= PAGINATION COMPONENT ================= */
function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) {
  if (totalItems === 0) return null;

  return (
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <p className="text-sm text-gray-600 font-medium order-2 sm:order-1">
        Showing <span className="font-bold text-gray-900">{Math.min((currentPage * itemsPerPage) + 1, totalItems)}</span> to <span className="font-bold text-gray-900">{Math.min((currentPage + 1) * itemsPerPage, totalItems)}</span> of <span className="font-bold text-gray-900">{totalItems}</span> records
      </p>
      
      <div className="flex items-center gap-1 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(0)}
          disabled={currentPage === 0}
          className={`p-2 rounded-lg transition-all ${
            currentPage === 0 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600 active:scale-90'
          }`}
          title="First Page"
        >
          <ChevronsLeft className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => onPageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
          className={`p-2 rounded-lg transition-all mr-2 ${
            currentPage === 0 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600 active:scale-90'
          }`}
          title="Previous Page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1 mx-2">
          {[...Array(totalPages)].map((_, i) => {
            if (
              totalPages <= 7 ||
              i === 0 ||
              i === totalPages - 1 ||
              (i >= currentPage - 1 && i <= currentPage + 1)
            ) {
              return (
                <button
                  key={i}
                  onClick={() => onPageChange(i)}
                  className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                    currentPage === i
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-200 transform scale-105'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {i + 1}
                </button>
              );
            } else if (
              (i === 1 && currentPage > 2) ||
              (i === totalPages - 2 && currentPage < totalPages - 3)
            ) {
              return <span key={i} className="px-1 text-gray-400">...</span>;
            }
            return null;
          })}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage === totalPages - 1}
          className={`p-2 rounded-lg transition-all ml-2 ${
            currentPage === totalPages - 1 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600 active:scale-90'
          }`}
          title="Next Page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <button
          onClick={() => onPageChange(totalPages - 1)}
          disabled={currentPage === totalPages - 1}
          className={`p-2 rounded-lg transition-all ${
            currentPage === totalPages - 1 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600 active:scale-90'
          }`}
          title="Last Page"
        >
          <ChevronsRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

/* ================= ROOMS MASTER ================= */
function RoomsMaster({ setError, setLoading }) {
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formError, setFormError] = useState("");   // 🔥 inline popup error
  const [form, setForm] = useState({
    room_no: "",
    type: "Standard",
    guest_limit: 2,
    status: "Available",
    price_3day: "",
    price_7day: "",
    price_8day: ""
  });

  // Pagination state – 10 items per page
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  // Room types and statuses
  const roomTypes = ["Single","Double", "Deluxe", "Premium", "Suite", "Family"];
  const roomStatuses = ["Available", "Booked", "Maintenance", "Cleaning"];

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await roomService.getRooms();
      setRooms(response.data || []);
      setCurrentPage(0);
      setError("");
    } catch (err) {
      console.error("❌ ROOMS FETCH ERROR:", err);
      setError("Failed to load rooms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filtered rooms based on search
  const filteredRooms = useMemo(() => {
    return rooms.filter(room =>
      room.room_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [rooms, searchTerm]);

  // Paginated rooms
  const paginatedRooms = useMemo(() => {
    return filteredRooms.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  }, [filteredRooms, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);


  const handleSubmit = async () => {
    // Validation – show error inside popup
    if (!form.room_no || !form.type || !form.guest_limit) {
      setFormError("Room number, type, and guest limit are required.");
      return;
    }

    if (!form.price_3day || !form.price_7day || !form.price_8day) {
      setFormError("All price fields (3 days, 7 days, 8+ days) are required.");
      return;
    }

    try {
      setFormError("");
      setLoading(true);
      
      if (editingRoom) {
        await roomService.updateRoom(editingRoom.id, {
          ...form,
          price_3day: parseFloat(form.price_3day),
          price_7day: parseFloat(form.price_7day),
          price_8day: parseFloat(form.price_8day)
        });
      } else {
        await roomService.createRoom({
          ...form,
          price_3day: parseFloat(form.price_3day),
          price_7day: parseFloat(form.price_7day),
          price_8day: parseFloat(form.price_8day)
        });
      }
      
      await fetchRooms();
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("❌ ROOM SAVE ERROR:", err.response?.data || err);
      setFormError(err.response?.data?.message || "Failed to save room. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    
    try {
      setLoading(true);
      await roomService.deleteRoom(id);
      await fetchRooms();
      setError("");
    } catch (err) {
      console.error("❌ ROOM DELETE ERROR:", err);
      setError("Failed to delete room. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      room_no: "",
      type: "Standard",
      guest_limit: 2,
      status: "Available",
      price_3day: "",
      price_7day: "",
      price_8day: ""
    });
    setEditingRoom(null);
    setFormError("");   // clear inline error on reset
  };

  const openEdit = (room) => {
    setEditingRoom(room);
    setForm({
      room_no: room.room_no,
      type: room.type,
      guest_limit: room.guest_limit,
      status: room.status,
      price_3day: room.price_3day,
      price_7day: room.price_7day,
      price_8day: room.price_8day
    });
    setShowForm(true);
  };

  const openAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Available": return "bg-green-100 text-green-800";
      case "Booked": return "bg-blue-100 text-blue-800";
      case "Maintenance": return "bg-red-100 text-red-800";
      case "Cleaning": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Home className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Room Management</h2>
              <p className="text-sm text-gray-600">Manage all hotel rooms and pricing</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={openAdd}
              className="px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Room
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600">Total Rooms</p>
          <p className="text-2xl font-bold text-gray-900">{rooms.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600">Available</p>
          <p className="text-2xl font-bold text-green-600">
            {rooms.filter(r => r.status === "Available").length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600">Occupied</p>
          <p className="text-2xl font-bold text-blue-600">
            {rooms.filter(r => r.status === "Booked").length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600">Under Maintenance</p>
          <p className="text-2xl font-bold text-red-600">
            {rooms.filter(r => r.status === "Maintenance").length}
          </p>
        </div>
      </div>
      {/* Rooms Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Room No</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Guest Limit</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Prices (3/7/8+ days)</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedRooms.length > 0 ? (
                paginatedRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                          <Home className="w-4 h-4 text-orange-500" />
                        </div>
                        <span className="font-medium text-gray-900">{room.room_no}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                        {room.type}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{room.guest_limit} guests</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                        {room.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm">₹{room.price_3day} (3 days)</span>
                        <span className="text-sm">₹{room.price_7day} (7 days)</span>
                        <span className="text-sm">₹{room.price_8day} (8+ days)</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(room)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(room.id)}
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
                  <td colSpan="6" className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Home className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="text-gray-500">No rooms found</p>
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

      {/* Pagination Controls */}
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredRooms.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      {/* Room Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Home className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {editingRoom ? "Edit Room" : "Add New Room"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {editingRoom ? "Update room details" : "Enter new room information"}
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

            {/* 🔥 Inline error banner inside popup */}
            {formError && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 flex-1">{formError}</p>
                <button onClick={() => setFormError("")}>
                  <X className="w-4 h-4 text-red-400 hover:text-red-600" />
                </button>
              </div>
            )}

            <div className="p-6 space-y-4">
              {/* ... form fields (same as before) ... */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g., 101, 201"
                  value={form.room_no}
                  onChange={(e) => setForm({ ...form, room_no: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Type *
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {roomTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guest Limit *
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={form.guest_limit}
                  onChange={(e) => setForm({ ...form, guest_limit: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {roomStatuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    3 Days Price *
                  </label>
                  <input
                    type="number"
                    placeholder="₹"
                    value={form.price_3day}
                    onChange={(e) => setForm({ ...form, price_3day: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    7 Days Price *
                  </label>
                  <input
                    type="number"
                    placeholder="₹"
                    value={form.price_7day}
                    onChange={(e) => setForm({ ...form, price_7day: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    8+ Days Price *
                  </label>
                  <input
                    type="number"
                    placeholder="₹"
                    value={form.price_8day}
                    onChange={(e) => setForm({ ...form, price_8day: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
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
                onClick={handleSubmit}
                className="px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                {editingRoom ? "Update Room" : "Create Room"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= MEMBERS MASTER (unchanged) ================= */
function MembersMaster({ setError, setLoading }) {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formError, setFormError] = useState("");   // 🔥 inline popup error
  const [form, setForm] = useState({
    name: "",
    membership_no: "",
    mobile_no: "",
    email: "",
    address: ""
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await memberService.getMembers();
      setMembers(response.data || []);
      setError("");
    } catch (err) {
      console.error("❌ MEMBERS FETCH ERROR:", err);
      setError("Failed to load members. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validation – show error inside popup
    if (!form.name || !form.membership_no || !form.mobile_no) {
      setFormError("Name, membership number, and mobile number are required.");
      return;
    }

    try {
      setFormError("");
      setLoading(true);
      
      if (editingMember) {
        await memberService.updateMember(editingMember.id, form);
      } else {
        await memberService.createMember(form);
      }
      
      await fetchMembers();
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("❌ MEMBER SAVE ERROR:", err.response?.data || err);
      setFormError(err.response?.data?.message || "Failed to save member. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    
    try {
      setLoading(true);
      await memberService.deleteMember(id);
      await fetchMembers();
    } catch (err) {
      console.error("❌ MEMBER DELETE ERROR:", err);
      setError("Failed to delete member. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      membership_no: "",
      mobile_no: "",
      email: "",
      address: ""
    });
    setEditingMember(null);
    setFormError("");   // clear inline error on reset
  };

  const openEdit = (member) => {
    setEditingMember(member);
    setForm({
      name: member.name || "",
      membership_no: member.membership_no || "",
      mobile_no: member.mobile_no || "",
      email: member.email || "",
      address: member.address || ""
    });
    setShowForm(true);
  };

  const openAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const filteredMembers = members.filter(member =>
    member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.membership_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.mobile_no?.includes(searchTerm)
  );

  // Paginated members
  const paginatedMembers = useMemo(() => {
    return filteredMembers.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  }, [filteredMembers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Users className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Member Management</h2>
              <p className="text-sm text-gray-600">Manage all hotel members</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={openAdd}
              className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Member
            </button>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Member</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Membership No</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Contact</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Address</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedMembers.length > 0 ? (
                paginatedMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                          <User className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                        {member.membership_no}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{member.mobile_no}</span>
                        </div>
                        {member.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">{member.email}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600 line-clamp-2">
                        {member.address || "No address provided"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(member)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
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
                      <Users className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="text-gray-500">No members found</p>
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

      {/* Pagination Controls */}
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredMembers.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      {/* Member Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Users className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {editingMember ? "Edit Member" : "Add New Member"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {editingMember ? "Update member details" : "Enter new member information"}
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

            {/* 🔥 Inline error banner inside popup */}
            {formError && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 flex-1">{formError}</p>
                <button onClick={() => setFormError("")}>
                  <X className="w-4 h-4 text-red-400 hover:text-red-600" />
                </button>
              </div>
            )}

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter member name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Membership Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g., M123456"
                  value={form.membership_no}
                  onChange={(e) => setForm({ ...form, membership_no: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={form.mobile_no}
                  onChange={(e) => setForm({ ...form, mobile_no: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="member@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  placeholder="Enter full address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
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
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                {editingMember ? "Update Member" : "Create Member"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}