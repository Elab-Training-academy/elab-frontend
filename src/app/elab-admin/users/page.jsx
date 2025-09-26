"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// View User Modal (unchanged)
function ViewUserModal({ isOpen, onClose, user }) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">User Profile</h2>
          <button
            onClick={onClose}
            className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200"
          >
            Close
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center md:items-start">
            {user.profile_picture ? (
              <img
                src={user.profile_picture}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow-md"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg">
                No Image
              </div>
            )}
            <p className="mt-3 text-lg font-medium text-gray-700">{user.full_name || "N/A"}</p>
            <span className="text-sm text-gray-500">{user.email}</span>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Full Name</p>
              <p className="font-medium text-gray-800">{user.full_name || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium text-gray-800">{user.email || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-500">Phone Number</p>
              <p className="font-medium text-gray-800">{user.phone_number || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-500">Address</p>
              <p className="font-medium text-gray-800">{user.address || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-500">Country</p>
              <p className="font-medium text-gray-800">{user.country || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-500">Role</p>
              <p className="font-medium text-gray-800">{user.role || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-500">Status</p>
              <p className={`font-semibold ${user.is_active ? "text-green-600" : "text-red-600"}`}>
                {user.is_active ? "Active" : "Inactive"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">User ID</p>
              <p className="font-mono text-xs text-gray-700">{user.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Create User Modal
function CreateUserModal({ isOpen, onClose, onUserCreated }) {
  const [form, setForm] = useState({ full_name: "", email: "", password: "", role: "staff" });
  const [loading, setLoading] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if (
      form.password.length < 8 ||
      !/[A-Z]/.test(form.password) ||
      !/[a-z]/.test(form.password) ||
      !/[0-9]/.test(form.password) ||
      !/[^A-Za-z0-9]/.test(form.password)
    ) {
      toast.error("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://elab-server-xg5r.onrender.com/super-admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || `Error: ${res.status}`);
        throw new Error(data.message || `Error: ${res.status}`);
      }

      // Check for success status in response data
      if (data.status === "success" || data.user) {
        toast.success("User created successfully!");
        onUserCreated(data.user || data);
        onClose();
        setForm({ full_name: "", email: "", password: "", role: "staff" });
      } else {
        toast.error(data.message || "Failed to create user");
      }
    } catch (err) {
      console.error("Error creating user:", err);
      // Don't show toast here as it might have already been shown above
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Create New User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-lg text-sm">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit User Modal
function EditUserModal({ isOpen, onClose, user, onUserUpdated }) {
  const [form, setForm] = useState({ full_name: "", role: "", profile_picture: null });
  const [loading, setLoading] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {

    // check if token is expired
    const token = localStorage.getItem("token");
    if (!token){
      window.location.href = "/login"
      return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp < currentTime) {
      alert("Session Expired, pls login to continue.");
      return window.location.href = "/login"
    }
    if (user) {
      setForm({ full_name: user.full_name || "", role: user.role || "staff", profile_picture: null });
    }
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("user_id", user.id);
      formData.append("full_name", form.full_name);
      formData.append("role", form.role);
      if (form.profile_picture) formData.append("profile_picture", form.profile_picture);

      const res = await fetch("https://elab-server-xg5r.onrender.com/super-admin/users/update-user", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to update user.");
        throw new Error(data.message || "Failed to update user");
      }

      // Check for success status in response data
      if (data.status === "success" || data.user) {
        toast.success(data.message || "User updated successfully.");
        onUserUpdated(data.user || { ...user, ...form });
        onClose();
      } else {
        toast.error(data.message || "Failed to update user.");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      // Don't show toast here as it might have already been shown above
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600">Profile Picture</label>
            <input
              type="file"
              onChange={(e) => setForm({ ...form, profile_picture: e.target.files[0] })}
              className="w-full text-sm"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-lg text-sm" disabled={loading}>Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Delete User Modal
function DeleteUserModal({ isOpen, onClose, onDeleteConfirm, user, loading }) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm text-center">
        <h2 className="text-lg font-semibold mb-4">Delete User</h2>
        <p className="mb-6 text-gray-600">
          Are you sure you want to delete <strong>{user.full_name || user.email}</strong>?
        </p>
        <div className="flex justify-center gap-4">
          <button onClick={onClose} disabled={loading} className="px-4 py-2 bg-gray-100 rounded-lg text-sm">Cancel</button>
          <button onClick={() => onDeleteConfirm(user.id)} disabled={loading} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Main User Management Component
export default function UserManagement() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("https://elab-server-xg5r.onrender.com/super-admin/users/all", {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
        toast.error("Failed to load users");
      } finally {
        setLoadingUsers(false);
      }
    }
    if (token) fetchUsers();
  }, [token]);

  async function handleViewUser(id) {
    try {
      const res = await fetch(`https://elab-server-xg5r.onrender.com/super-admin/users/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }
      
      const data = await res.json();
      setSelectedUser(data);
      setIsViewModalOpen(true);
    } catch (err) {
      console.error("Error fetching user details:", err);
      toast.error("Failed to load user details");
    }
  }

  function handleDeleteClick(user) {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  }

  async function handleDeleteUser(id) {
    setDeleteLoading(true);
    try {
      const res = await fetch(`https://elab-server-xg5r.onrender.com/super-admin/users/delete-user/?user_id=${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        toast.error(data.message || "Failed to delete user.");
        throw new Error(data.message || "Failed to delete user");
      }
      
      // Check for success status in response data
      if (data.status === "success") {
        setUsers(prev => prev.filter(u => u.id !== id));
        toast.success(data.message || "User deleted successfully.");
      } else {
        toast.error(data.message || "Failed to delete user.");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      // Don't show toast here as it might have already been shown above
    } finally {
      setDeleteLoading(false);
      setIsDeleteModalOpen(false);
    }
  }

  function handleUserCreated(newUser) {
    setUsers(prev => [...prev, newUser]);
  }

  function handleEditClick(user) {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  }

  function handleUserUpdated(updatedUser) {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="w-full border-b p-2 bg-gray-50 flex justify-between items-center">
        <input type="text" placeholder="Type a command or search..." className="w-full max-w-sm px-4 py-2 border rounded-lg focus:outline-none text-sm" />
        <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
          <Plus size={18} /> Create User
        </button>
      </div>

      <div className="bg-white text-black p-6">
        <h1 className="text-xl sm:text-2xl font-bold">User Management</h1>
        <p className="text-gray-400 text-sm">Manage User's role and status</p>
      </div>

      <div className="flex-1 p-4 sm:p-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="hidden md:grid grid-cols-6 gap-4 p-4 border-b text-gray-500 font-medium text-sm">
            <span>User</span>
            <span>Role</span>
            <span>Status</span>
            <span>Email</span>
            <span>Action</span>
          </div>

          {loadingUsers ? (
            <p className="p-6 text-center text-gray-500">Loading users...</p>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-gray-600 mb-2">Looks like you haven't added any users yet</p>
              <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                <Plus size={18} /> Add New User
              </button>
            </div>
          ) : (
            users.map(user => (
              <div key={user.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border-b text-sm hover:bg-gray-50 transition rounded-lg items-center">
                <div className="flex items-center gap-3 md:col-span-1">
                  {user.profile_picture ? (
                    <img src={user.profile_picture} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-gray-200" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">N/A</div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">{user.full_name || "N/A"}</span>
                    <span className="text-gray-400 text-xs md:hidden">{user.email}</span>
                  </div>
                </div>
                <div className="flex items-center md:justify-start justify-between"><span className="text-gray-700 font-medium">{user.role || "N/A"}</span></div>
                <div className="flex items-center md:justify-start justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="hidden md:flex items-center text-gray-600 truncate">{user.email}</div>
                <div className="flex items-center gap-3 justify-start md:justify-end">
                  <button className="text-blue-600 hover:underline text-sm" onClick={() => handleViewUser(user.id)}>View</button>
                  <button className="text-green-600 hover:underline text-sm" onClick={() => handleEditClick(user)}>Edit</button>
                  <button className="text-red-600 hover:underline text-sm" onClick={() => handleDeleteClick(user)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <CreateUserModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onUserCreated={handleUserCreated} />
      <ViewUserModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} user={selectedUser} />
      <EditUserModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} user={selectedUser} onUserUpdated={handleUserUpdated} />
      <DeleteUserModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onDeleteConfirm={handleDeleteUser} user={selectedUser} loading={deleteLoading} />
    </div>
  );
}
