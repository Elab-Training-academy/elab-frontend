"use client";

import { useState } from "react";
import { Search, Plus } from "lucide-react";
import AddUserModal from "../../../component/AddUserModal"; // ✅ Fixed import

export default function UserManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Search */}
      <div className="w-full border-b p-2 bg-gray-50">
        <input
          type="text"
          placeholder="Type a command or search..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm sm:text-base"
        />
      </div>

      {/* User Management Header */}
      <div className="bg-white text-black p-6">
        <h1 className="text-xl sm:text-2xl font-bold">User Management</h1>
        <p className="text-gray-400 text-sm">
          Manage User's role and status
        </p>

        {/* Filters */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700" size={18} />
            <input
              type="text"
              placeholder="Search by title, description and category"
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <select className="p-2 rounded-full border border-gray-300 text-sm sm:text-base">
              <option>All roles</option>
              <option>Admin</option>
              <option>Editor</option>
              <option>User</option>
            </select>
            <select className="p-2 rounded-full border border-gray-300 text-sm sm:text-base">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Table Section */}
      <div className="flex-1 p-4 sm:p-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="hidden md:grid grid-cols-6 gap-4 p-4 border-b text-gray-500 font-medium text-sm">
            <span>User</span>
            <span>Role</span>
            <span>Status</span>
            <span>Created On</span>
            <span>Last Login</span>
            <span>Action</span>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-gray-600 mb-2">Looks like you haven't added any users yet</p>
            <a href="#" className="text-blue-600 mb-6 hover:underline">Need a place to start?</a>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700"
            >
              <Plus size={18} /> Add New User
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AddUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
