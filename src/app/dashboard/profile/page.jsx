"use client";
import { useState } from "react";

export default function ProfilePage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    photo: null,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Profile</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <form className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full"
              placeholder="First name"
            />
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full"
              placeholder="Last name"
            />
          </div>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="border rounded-lg p-3 w-full"
            placeholder="Email"
          />

          <div className="flex items-center gap-4">
            <img
              src={form.photo || "/default-avatar.png"}
              alt="profile"
              className="w-16 h-16 rounded-full object-cover"
            />
            <input type="file" accept="image/*" />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              className="px-5 py-2 rounded-lg border border-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 text-white"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
