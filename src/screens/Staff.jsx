// 📁 screens/Staff.jsx
import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, X, User, Search, CheckCircle, AlertCircle, Shield, Key, Mail, Phone } from "lucide-react";
import * as userService from "../services/userServices";

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    role: "Reception",
    is_active: true,
    email: "",
    phone: ""
  });

  const roles = ["Admin", "Manager", "Reception", "Housekeeping", "Maintenance"];

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await userService.getUsers();
      setStaff(response.data || []);
      setError("");
    } catch (err) {
      console.error("❌ STAFF FETCH ERROR:", err);
      setError("Failed to load staff. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.username || (!editingStaff && !form.password)) {
      setError("Name, username, and password are required");
      return;
    }

    try {
      setLoading(true);
      
      const payload = { ...form };
      if (!editingStaff) {
        payload.password = form.password;
      } else {
        delete payload.password;
      }

      if (editingStaff) {
        await userService.updateUser(editingStaff.id, payload);
      } else {
        await userService.createUser(payload);
      }
      
      await fetchStaff();
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("❌ STAFF SAVE ERROR:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to save staff. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) return;
    
    try {
      setLoading(true);
      await userService.deleteUser(id);
      await fetchStaff();
    } catch (err) {
      console.error("❌ STAFF DELETE ERROR:", err);
      setError("Failed to delete staff. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      username: "",
      password: "",
      role: "Reception",
      is_active: true,
      email: "",
      phone: ""
    });
    setEditingStaff(null);
  };

  const openEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setForm({
      name: staffMember.name || "",
      username: staffMember.username || "",
      password: "",
      role: staffMember.role || "Reception",
      is_active: staffMember.is_active !== false,
      email: staffMember.email || "",
      phone: staffMember.phone || ""
    });
    setShowForm(true);
  };

  const openAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const filteredStaff = staff.filter(staffMember =>
    staffMember.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staffMember.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staffMember.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin": return "bg-red-100 text-red-800";
      case "Manager": return "bg-purple-100 text-purple-800";
      case "Reception": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "Admin": return <Shield className="w-4 h-4" />;
      case "Manager": return <User className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-1">Manage all staff accounts and permissions</p>
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

        {/* Header with Actions */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <User className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Staff Accounts</h2>
                <p className="text-sm text-gray-600">Manage user access and permissions</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={openAdd}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Staff
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-600">Total Staff</p>
            <p className="text-2xl font-bold text-gray-900">{staff.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {staff.filter(s => s.is_active).length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-600">Admins</p>
            <p className="text-2xl font-bold text-red-600">
              {staff.filter(s => s.role === "Admin").length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-600">Reception</p>
            <p className="text-2xl font-bold text-blue-600">
              {staff.filter(s => s.role === "Reception").length}
            </p>
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Staff Member</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Contact</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Role</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStaff.length > 0 ? (
                  filteredStaff.map((staffMember) => (
                    <tr key={staffMember.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{staffMember.name}</p>
                            <div className="flex items-center gap-2">
                              <Key className="w-3 h-3 text-gray-400" />
                              <span className="text-sm text-gray-500 font-mono">{staffMember.username}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          {staffMember.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-3 h-3 text-gray-400" />
                              <span className="text-sm text-gray-600">{staffMember.email}</span>
                            </div>
                          )}
                          {staffMember.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-3 h-3 text-gray-400" />
                              <span className="text-sm text-gray-600">{staffMember.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${getRoleColor(staffMember.role).split(' ')[0]}`}>
                            <div className={getRoleColor(staffMember.role).split(' ')[1]}>
                              {getRoleIcon(staffMember.role)}
                            </div>
                          </div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(staffMember.role)}`}>
                            {staffMember.role}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          staffMember.is_active 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${staffMember.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                          {staffMember.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(staffMember)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(staffMember.id)}
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
                        <User className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-gray-500">No staff members found</p>
                        {searchTerm && (
                          <button
                            onClick={() => setSearchTerm("")}
                            className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
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

        {/* Staff Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <User className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {editingStaff ? "Edit Staff" : "Add New Staff"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {editingStaff ? "Update staff details" : "Create new staff account"}
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
                    placeholder="Enter staff name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter username for login"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {!editingStaff && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      placeholder="Enter password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="staff@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                      className="rounded text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Active Account</span>
                  </label>
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
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  {editingStaff ? "Update Staff" : "Create Staff"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-700">Processing...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}