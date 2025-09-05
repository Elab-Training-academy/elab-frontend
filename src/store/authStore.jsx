"use client";

// src/store/authStore.js
import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  courses: [],
  url: "https://elab-server-xg5r.onrender.com",
  token: null,
  user: null,
  role: null,

  setRole: (role) => set({role}),
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  clearToken: () => set({ token: null }),

  loadToken: () => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        set({ token: storedToken });
      }
    }
  },

  setCourses: (courses) => set({ courses }),

  // Categories
  categories: [],
  setCategories: (categories) => set({ categories }),

  // Smart Practice
  smartPractices: [],
  setSmartPractices: (smartPractices) => set({ smartPractices }),

  loading: false,

  // Fetch categories
  fetchAllCategories: async () => {
    const url = get().url;
    const newToken = get().token;
    try {
      set({ loading: true });
      const response = await fetch(`${url}/categories/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${newToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        set({ categories: data });
      } else {
        console.error("Failed to fetch categories:", response.status);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      set({ loading: false });
    }
  },

  // Fetch Smart Practice
  fetchAllSmartPractice: async () => {
    const url = get().url;
    const newToken = get().token;
    try {
      set({ loading: true });
      const response = await fetch(`${url}/sp-questions`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${newToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        set({ smartPractices: data });
      } else {
        console.error("Failed to fetch smart practices:", response);
      }
    } catch (err) {
      console.error("Error fetching smart practices:", err);
    } finally {
      set({ loading: false });
    }
  },

  // Fetch all courses
  fetchAllCourses: async () => {
    const { url } = get();
    if (typeof window === "undefined") return;
    set({ loading: true });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${url}/courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        console.error("Failed to fetch courses", res.status);
        set({ courses: [] });
        return;
      }
      const data = await res.json();
      set({ courses: data });
    } catch (err) {
      console.error("Error fetching courses:", err);
      set({ courses: [] });
    } finally {
      set({ loading: false });
    }
  },


   // Fetch user + role
  fetchUser: async () => {
    useAuthStore.getState().setRole(response.data.role);
    const { url } = get();
    if (typeof window === "undefined") return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${url}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Failed to fetch user", res.status);
        set({ user: null, role: null });
        return;
      }

      const data = await res.json();
      console.log("Fetched user:", data);

      // ✅ Assume API returns { id, name, email, role }

      const role =
    (data.role || data.user?.role || data.data?.role || "").toLowerCase();
      console.log("Extracted role:", role);

      localStorage.setItem("role", role);
      set({ user: data, role: data.role });
    } catch (err) {
      console.error("Error fetching user:", err);
      set({ user: null, role: null });
    }
  },

  // Orders
  orders: [],
  ordersLoading: false,
  fetchOrders: async () => {
    const { url } = get();
    if (typeof window === "undefined") return;
    set({ ordersLoading: true });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${url}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        console.error("Failed to fetch orders", res.status);
        set({ orders: [] });
        return;
      }
      const data = await res.json();
      set({ orders: data });
    } catch (err) {
      console.error("Error fetching orders:", err);
      set({ orders: [] });
    } finally {
      set({ ordersLoading: false });
    }
  },

  // Create order
  createOrder: async (courseId) => {
    const { token, url } = get();
    if (!token) {
      console.error("No token found. User must be logged in.");
      return false;
    }
    try {
      const response = await fetch(`${url}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ course_id: courseId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to create order:", response.status, errorData);
        return false;
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating order:", error);
      return false;
    }
  },

  // Index courses
  fetchIndexCourses: async () => {
    const { url } = get();
    set({ loading: true });
    try {
      const res = await fetch(`${url}/index/courses`);
      if (!res.ok) {
        console.error("Failed to fetch index courses", res.status);
        set({ courses: [] });
        return;
      }
      const data = await res.json();
      set({ courses: data });
    } catch (err) {
      console.error("Error fetching index courses:", err);
      set({ courses: [] });
    } finally {
      set({ loading: false });
    }
  },

  // Profile
  fetchProfile: async () => {
    const { url } = get();
    if (typeof window === "undefined") return;
    set({ loadingProfile: true });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${url}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        console.error("Failed to fetch profile", res.status);
        set({ profile: null });
        return;
      }
      const data = await res.json();
      set({ profile: data });
    } catch (err) {
      console.error("Error fetching profile:", err);
      set({ profile: null });
    } finally {
      set({ loadingProfile: false });
    }
  },

  // Update profile
  updateProfile: async (updatedData) => {
    const { url } = get();
    if (typeof window === "undefined") return false;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${url}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to update profile", res.status, errorText);
        return false;
      }
      const data = await res.json();
      set({ profile: data });
      return true;
    } catch (err) {
      console.error("Error updating profile:", err);
      return false;
    }
  },
}));

