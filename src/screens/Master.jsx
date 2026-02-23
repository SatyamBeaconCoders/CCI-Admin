
// import { useState, useEffect } from "react";
// import { Plus, Trash2, Pencil, X, Users, Home, User, Mail, Phone, Key, Settings, CreditCard, Calendar, Eye, Search, Download, Filter, Shield, CheckCircle, AlertCircle } from "lucide-react";

// // Import services
// import * as roomService from "../services/roomServices";
// import * as memberService from "../services/memberServices";
// import * as userService from "../services/userServices";
// import * as settingService from "../services/settingServices";

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
//           <p className="text-gray-600 mt-1">Manage rooms, members, staff, and system settings</p>
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
//           <Tab 
//             label="Staff" 
//             icon={<User className="w-4 h-4" />}
//             active={activeTab === "staff"} 
//             onClick={() => setActiveTab("staff")} 
//           />
//           <Tab 
//             label="Settings" 
//             icon={<Settings className="w-4 h-4" />}
//             active={activeTab === "settings"} 
//             onClick={() => setActiveTab("settings")} 
//           />
//         </div>

//         {activeTab === "rooms" && <RoomsMaster setError={setError} setLoading={setLoading} />}
//         {activeTab === "members" && <MembersMaster setError={setError} setLoading={setLoading} />}
//         {activeTab === "staff" && <StaffMaster setError={setError} setLoading={setLoading} />}
//         {activeTab === "settings" && <SettingsMaster setError={setError} setLoading={setLoading} />}

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
//       setError("");
//     } catch (err) {
//       console.error("❌ ROOMS FETCH ERROR:", err);
//       setError("Failed to load rooms. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

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

//   const filteredRooms = rooms.filter(room =>
//     room.room_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     room.status.toLowerCase().includes(searchTerm.toLowerCase())
//   );

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
//               {filteredRooms.length > 0 ? (
//                 filteredRooms.map((room) => (
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
//               >
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

// /* ================= STAFF MASTER ================= */
// function StaffMaster({ setError, setLoading }) {
//   const [staff, setStaff] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [editingStaff, setEditingStaff] = useState(null);
//   const [form, setForm] = useState({
//     name: "",
//     username: "",
//     password: "",
//     role: "Reception",
//     is_active: true
//   });

//   const roles = ["Admin", "Manager", "Reception", "Housekeeping", "Maintenance"];

//   useEffect(() => {
//     fetchStaff();
//   }, []);

//   const fetchStaff = async () => {
//     try {
//       setLoading(true);
//       const response = await userService.getUsers();
//       setStaff(response.data || []);
//       setError("");
//     } catch (err) {
//       console.error("❌ STAFF FETCH ERROR:", err);
//       setError("Failed to load staff. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!form.name || !form.username || (!editingStaff && !form.password)) {
//       setError("Name, username, and password are required");
//       return;
//     }

//     try {
//       setLoading(true);
      
//       const payload = { ...form };
//       if (!editingStaff) {
//         // Only include password for new users
//         payload.password = form.password;
//       } else {
//         // Don't send password in update unless changed
//         delete payload.password;
//       }

//       if (editingStaff) {
//         await userService.updateUser(editingStaff.id, payload);
//       } else {
//         await userService.createUser(payload);
//       }
      
//       await fetchStaff();
//       resetForm();
//       setShowForm(false);
//     } catch (err) {
//       console.error("❌ STAFF SAVE ERROR:", err.response?.data || err);
//       setError(err.response?.data?.message || "Failed to save staff. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this staff member?")) return;
    
//     try {
//       setLoading(true);
//       await userService.deleteUser(id);
//       await fetchStaff();
//     } catch (err) {
//       console.error("❌ STAFF DELETE ERROR:", err);
//       setError("Failed to delete staff. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setForm({
//       name: "",
//       username: "",
//       password: "",
//       role: "Reception",
//       is_active: true
//     });
//     setEditingStaff(null);
//   };

//   const openEdit = (staffMember) => {
//     setEditingStaff(staffMember);
//     setForm({
//       name: staffMember.name || "",
//       username: staffMember.username || "",
//       password: "", // Don't show current password
//       role: staffMember.role || "Reception",
//       is_active: staffMember.is_active !== false
//     });
//     setShowForm(true);
//   };

//   const openAdd = () => {
//     resetForm();
//     setShowForm(true);
//   };

//   const filteredStaff = staff.filter(staffMember =>
//     staffMember.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     staffMember.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     staffMember.role?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const getRoleColor = (role) => {
//     switch (role) {
//       case "Admin": return "bg-red-100 text-red-800";
//       case "Manager": return "bg-purple-100 text-purple-800";
//       case "Reception": return "bg-blue-100 text-blue-800";
//       default: return "bg-gray-100 text-gray-800";
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header with Actions */}
//       <div className="bg-white rounded-xl shadow-sm p-4">
//         <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-blue-50 rounded-lg">
//               <User className="w-5 h-5 text-blue-500" />
//             </div>
//             <div>
//               <h2 className="text-lg font-bold text-gray-900">Staff Management</h2>
//               <p className="text-sm text-gray-600">Manage all staff accounts</p>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-3">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search staff..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//               />
//             </div>
//             <button
//               onClick={openAdd}
//               className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
//             >
//               <Plus className="w-4 h-4" />
//               Add Staff
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Staff Table */}
//       <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="bg-gray-50 border-b border-gray-200">
//                 <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Staff Member</th>
//                 <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Username</th>
//                 <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Role</th>
//                 <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Status</th>
//                 <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {filteredStaff.length > 0 ? (
//                 filteredStaff.map((staffMember) => (
//                   <tr key={staffMember.id} className="hover:bg-gray-50">
//                     <td className="py-4 px-6">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
//                           <User className="w-5 h-5 text-blue-500" />
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-900">{staffMember.name}</p>
//                           <p className="text-sm text-gray-500">ID: {staffMember.id}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="py-4 px-6">
//                       <span className="font-mono text-sm">{staffMember.username}</span>
//                     </td>
//                     <td className="py-4 px-6">
//                       <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(staffMember.role)}`}>
//                         {staffMember.role}
//                       </span>
//                     </td>
//                     <td className="py-4 px-6">
//                       <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
//                         staffMember.is_active 
//                           ? "bg-green-100 text-green-800" 
//                           : "bg-red-100 text-red-800"
//                       }`}>
//                         <div className={`w-2 h-2 rounded-full ${staffMember.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
//                         {staffMember.is_active ? "Active" : "Inactive"}
//                       </span>
//                     </td>
//                     <td className="py-4 px-6">
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => openEdit(staffMember)}
//                           className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                           title="Edit"
//                         >
//                           <Pencil className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(staffMember.id)}
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
//                       <User className="w-12 h-12 text-gray-300 mb-4" />
//                       <p className="text-gray-500">No staff members found</p>
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

//       {/* Staff Form Modal */}
//       {showForm && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
//             <div className="p-6 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-blue-50 rounded-lg">
//                     <User className="w-5 h-5 text-blue-500" />
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-bold text-gray-900">
//                       {editingStaff ? "Edit Staff" : "Add New Staff"}
//                     </h3>
//                     <p className="text-sm text-gray-600">
//                       {editingStaff ? "Update staff details" : "Create new staff account"}
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
//                   placeholder="Enter staff name"
//                   value={form.name}
//                   onChange={(e) => setForm({ ...form, name: e.target.value })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Username *
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter username for login"
//                   value={form.username}
//                   onChange={(e) => setForm({ ...form, username: e.target.value })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                 />
//               </div>

//               {!editingStaff && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Password *
//                   </label>
//                   <input
//                     type="password"
//                     placeholder="Enter password"
//                     value={form.password}
//                     onChange={(e) => setForm({ ...form, password: e.target.value })}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                   />
//                 </div>
//               )}

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Role *
//                 </label>
//                 <select
//                   value={form.role}
//                   onChange={(e) => setForm({ ...form, role: e.target.value })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                 >
//                   {roles.map((role) => (
//                     <option key={role} value={role}>{role}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={form.is_active}
//                     onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
//                     className="rounded text-orange-500 focus:ring-orange-500"
//                   />
//                   <span className="text-sm text-gray-700">Active Account</span>
//                 </label>
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
//                 className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
//               >
//                 <CheckCircle className="w-4 h-4" />
//                 {editingStaff ? "Update Staff" : "Create Staff"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ================= SETTINGS MASTER ================= */
// function SettingsMaster({ setError, setLoading }) {
//   const [settings, setSettings] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editingSetting, setEditingSetting] = useState(null);
//   const [form, setForm] = useState({
//     key: "",
//     value: ""
//   });

//   useEffect(() => {
//     fetchSettings();
//   }, []);

//   const fetchSettings = async () => {
//     try {
//       setLoading(true);
//       const response = await settingService.getSettings();
//       setSettings(response.data || []);
//       setError("");
//     } catch (err) {
//       console.error("❌ SETTINGS FETCH ERROR:", err);
//       setError("Failed to load settings. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!form.key || !form.value) {
//       setError("Key and value are required");
//       return;
//     }

//     try {
//       setLoading(true);
//       await settingService.createOrUpdateSetting(form);
//       await fetchSettings();
//       resetForm();
//       setShowForm(false);
//     } catch (err) {
//       console.error("❌ SETTING SAVE ERROR:", err.response?.data || err);
//       setError(err.response?.data?.message || "Failed to save setting. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (key) => {
//     if (!window.confirm("Are you sure you want to delete this setting?")) return;
    
//     try {
//       setLoading(true);
//       await settingService.deleteSetting(key);
//       await fetchSettings();
//     } catch (err) {
//       console.error("❌ SETTING DELETE ERROR:", err);
//       setError("Failed to delete setting. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setForm({
//       key: "",
//       value: ""
//     });
//     setEditingSetting(null);
//   };

//   const openEdit = (setting) => {
//     setEditingSetting(setting);
//     setForm({
//       key: setting.key,
//       value: setting.value
//     });
//     setShowForm(true);
//   };

//   const openAdd = () => {
//     resetForm();
//     setShowForm(true);
//   };

//   const commonSettings = [
//     { key: "TAX_RATE", label: "Tax Rate (%)", placeholder: "e.g., 18" },
//     { key: "CHECK_IN_TIME", label: "Check-in Time", placeholder: "e.g., 14:00" },
//     { key: "CHECK_OUT_TIME", label: "Check-out Time", placeholder: "e.g., 12:00" },
//     { key: "CURRENCY", label: "Currency Symbol", placeholder: "e.g., ₹" },
//     { key: "ADVANCE_PERCENTAGE", label: "Advance Payment (%)", placeholder: "e.g., 30" },
//     { key: "CANCELLATION_FEE", label: "Cancellation Fee (%)", placeholder: "e.g., 10" },
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Header with Actions */}
//       <div className="bg-white rounded-xl shadow-sm p-4">
//         <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-purple-50 rounded-lg">
//               <Settings className="w-5 h-5 text-purple-500" />
//             </div>
//             <div>
//               <h2 className="text-lg font-bold text-gray-900">System Settings</h2>
//               <p className="text-sm text-gray-600">Configure hotel system parameters</p>
//             </div>
//           </div>
          
//           <button
//             onClick={openAdd}
//             className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
//           >
//             <Plus className="w-4 h-4" />
//             Add Setting
//           </button>
//         </div>
//       </div>

//       {/* Common Settings */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {commonSettings.map((setting) => {
//           const currentValue = settings.find(s => s.key === setting.key)?.value;
//           return (
//             <div key={setting.key} className="bg-white rounded-xl shadow-sm p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-900">{setting.label}</p>
//                   <p className="text-sm text-gray-500">Key: {setting.key}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-lg font-bold text-gray-900">
//                     {currentValue || "Not set"}
//                   </p>
//                   <button
//                     onClick={() => {
//                       if (currentValue) {
//                         openEdit({ key: setting.key, value: currentValue });
//                       } else {
//                         setForm({ key: setting.key, value: "" });
//                         setEditingSetting(null);
//                         setShowForm(true);
//                       }
//                     }}
//                     className="text-sm text-purple-600 hover:text-purple-700 font-medium"
//                   >
//                     {currentValue ? "Edit" : "Set"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* All Settings Table */}
//       <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//         <div className="p-6 border-b border-gray-200">
//           <h3 className="text-lg font-bold text-gray-900">All Settings</h3>
//           <p className="text-sm text-gray-600">Complete list of system settings</p>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="bg-gray-50 border-b border-gray-200">
//                 <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Key</th>
//                 <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Value</th>
//                 <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Description</th>
//                 <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {settings.length > 0 ? (
//                 settings.map((setting) => (
//                   <tr key={setting.key} className="hover:bg-gray-50">
//                     <td className="py-4 px-6">
//                       <code className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm font-mono">
//                         {setting.key}
//                       </code>
//                     </td>
//                     <td className="py-4 px-6">
//                       <span className="font-medium">{setting.value}</span>
//                     </td>
//                     <td className="py-4 px-6">
//                       <span className="text-sm text-gray-600">
//                         {commonSettings.find(s => s.key === setting.key)?.label || "Custom setting"}
//                       </span>
//                     </td>
//                     <td className="py-4 px-6">
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => openEdit(setting)}
//                           className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                           title="Edit"
//                         >
//                           <Pencil className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(setting.key)}
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
//                   <td colSpan="4" className="py-12 text-center">
//                     <div className="flex flex-col items-center justify-center">
//                       <Settings className="w-12 h-12 text-gray-300 mb-4" />
//                       <p className="text-gray-500">No settings found</p>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Settings Form Modal */}
//       {showForm && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
//             <div className="p-6 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-purple-50 rounded-lg">
//                     <Settings className="w-5 h-5 text-purple-500" />
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-bold text-gray-900">
//                       {editingSetting ? "Edit Setting" : "Add New Setting"}
//                     </h3>
//                     <p className="text-sm text-gray-600">
//                       {editingSetting ? "Update system setting" : "Add new system parameter"}
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
//                   Setting Key *
//                 </label>
//                 {editingSetting ? (
//                   <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700">
//                     {form.key}
//                   </div>
//                 ) : (
//                   <input
//                     type="text"
//                     placeholder="e.g., TAX_RATE, CHECK_IN_TIME"
//                     value={form.key}
//                     onChange={(e) => setForm({ ...form, key: e.target.value.toUpperCase() })}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                   />
//                 )}
//                 <p className="text-xs text-gray-500 mt-1">
//                   Use uppercase with underscores (e.g., SITE_NAME)
//                 </p>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Value *
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter value"
//                   value={form.value}
//                   onChange={(e) => setForm({ ...form, value: e.target.value })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                 />
//               </div>

//               {commonSettings.find(s => s.key === form.key) && (
//                 <div className="p-3 bg-blue-50 rounded-lg">
//                   <p className="text-sm text-blue-700">
//                     This is a common setting: {commonSettings.find(s => s.key === form.key)?.label}
//                   </p>
//                 </div>
//               )}
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
//                 className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
//               >
//                 <CheckCircle className="w-4 h-4" />
//                 {editingSetting ? "Update Setting" : "Save Setting"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// 📁 screens/Master.jsx (Updated - Settings removed)
import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, X, Users, Home, User, Mail, Phone, Key, CheckCircle, AlertCircle, Search } from "lucide-react";

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

/* ================= ROOMS MASTER ================= */
function RoomsMaster({ setError, setLoading }) {
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [form, setForm] = useState({
    room_no: "",
    type: "Standard",
    guest_limit: 2,
    status: "Available",
    price_3day: "",
    price_7day: "",
    price_8day: ""
  });

  // Room types and statuses
  const roomTypes = ["Standard", "Deluxe", "Premium", "Suite", "Family"];
  const roomStatuses = ["Available", "Booked", "Maintenance", "Cleaning"];

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await roomService.getRooms();
      setRooms(response.data || []);
      setError("");
    } catch (err) {
      console.error("❌ ROOMS FETCH ERROR:", err);
      setError("Failed to load rooms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!form.room_no || !form.type || !form.guest_limit) {
      setError("Room number, type, and guest limit are required");
      return;
    }

    if (!form.price_3day || !form.price_7day || !form.price_8day) {
      setError("All price fields are required");
      return;
    }

    try {
      setLoading(true);
      
      if (editingRoom) {
        // Update existing room
        await roomService.updateRoom(editingRoom.id, {
          ...form,
          price_3day: parseFloat(form.price_3day),
          price_7day: parseFloat(form.price_7day),
          price_8day: parseFloat(form.price_8day)
        });
      } else {
        // Create new room
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
      setError(err.response?.data?.message || "Failed to save room. Please try again.");
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

  const filteredRooms = rooms.filter(room =>
    room.room_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              {filteredRooms.length > 0 ? (
                filteredRooms.map((room) => (
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

            <div className="p-6 space-y-4">
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

/* ================= MEMBERS MASTER ================= */
function MembersMaster({ setError, setLoading }) {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [form, setForm] = useState({
    name: "",
    membership_no: "",
    mobile_no: "",
    email: "",
    address: ""
  });

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
    if (!form.name || !form.membership_no || !form.mobile_no) {
      setError("Name, membership number, and mobile number are required");
      return;
    }

    try {
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
      setError(err.response?.data?.message || "Failed to save member. Please try again.");
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
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
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