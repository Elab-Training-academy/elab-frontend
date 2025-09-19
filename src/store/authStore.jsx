"use client";

// src/store/authStore.js
import { create } from "zustand";
import { toast } from 'react-toastify';

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
    // useAuthStore.getState().setRole(response.data.role);
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
        if (res.status === 401) {
          // Unauthorized, token might be invalid
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          set({ token: null, user: null, role: null });
          alert("Session expired. Please log in again.");
          toast.warn("Session expired. Please log in again.");
          return window.location.href = "/login";
        }
        const err = await res.json();
        alert(err.detail || "Failed to fetch user. Please log in again.");
        throw new Error(err.detail || "Failed to fetch user");
        
      }

      const data = await res.json();
      console.log("Fetched user:", data);
      
      const role =
    (data.role || data.user?.role || data.data?.role || "").toLowerCase();

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

  
  // Profile
  fetchProfile: async () => {
  const { url } = get();
  set({ loadingProfile: true });
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${url}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok){
      if (res.status === 401) {
        // Unauthorized, token might be invalid
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        set({ token: null, user: null, role: null });
        alert("Session expired. Please log in again.");
        toast.warn("Session expired. Please log in again.");
        return window.location.href = "/login";
      }
      throw new Error("Failed to fetch profile");
      
    }
    set({ profile: await res.json() });
  } catch (err) {
    console.error("Error fetching profile:", err);
    set({ profile: null });
  } finally {
    set({ loadingProfile: false });
  }
},

updateProfile: async (updatedData) => {
  const { url } = get();
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
    if (!res.ok) return false;
    set({ profile: await res.json() });
    return true;
  } catch (err) {
    console.error("Error updating profile:", err);
    return false;
  }
},


  sendChat: async (message, file = null) => {
  const url = get().url;
  const token = get().token;
  
  try {
    set({ loading: true });
    
    // Prepare request body and headers
    let body;
    let headers = {
      Authorization: `Bearer ${token}`,
    };

    if (file) {
      // Use FormData for file uploads
      const formData = new FormData();
      formData.append("message", message);
      formData.append("file", file);
      body = formData;
    } else {
      // JSON for text-only messages
      headers["Content-Type"] = "application/json";
      body = JSON.stringify({ message });
    }

    const response = await fetch(`${url}/deepseek/chat/`, {
      method: "POST",
      headers,
      body,
    });

    if (response.ok) {
      const data = await response.json();
      
      // Update messages in store
      set((state) => ({
        messages: [
          ...(state.messages || []),
          { 
            role: "user", 
            content: message,
            file: file ? { name: file.name, size: file.size } : null,
            timestamp: new Date().toISOString()
          },
          {
            role: "assistant",
            content: data.reply,
            timestamp: new Date().toISOString()
          }
        ]
      }));
      
      return data;
    } else {
        if (response.status === 401) {
          toast.warn("Session expired. Please log in again.");
          set({ token: null, user: null, role: null });
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          return window.location.href = "/login";
        }

      const err = await response.json();
      toast.warn(err.detail|| "Failed to send chat. Please try again.");
      console.error("Failed to send chat:", response.status);
      return null;
    }
  } catch (err) {
    console.error("Error sending chat:", err);
    return null;
  } finally {
    set({ loading: false });
  }
}


}));

