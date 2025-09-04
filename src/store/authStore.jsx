// src/store/authStore.js
import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  courses: [],
  url: "https://elab-server-xg5r.onrender.com",
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  setToken: (token) => set({ token}),
  clearToken: () => set({ token: null }),
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
    // console.log(newToken);

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
        console.log(data)
      } else {
        console.error("Failed to fetch smart practices:", response);
      }
    } catch (err) {
      console.error("Error fetching smart practices:", err);
    } finally {
      set({ loading: false });
    }
  },



   fetchAllCourses: async () => {
    const { url } = get();
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


  fetchUser: async () => {
  const { url } = get();
  set({ loading: true });

  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${url}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch user", res.status);
      set({ user: null });
      return;
    }

    const data = await res.json();
    set({ user: data }); // 👈 this sets the user
  } catch (err) {
    console.error("Error fetching user:", err);
    set({ user: null });
  } finally {
    set({ loading: false });
  }
},


orders: [],
ordersLoading: false,

fetchOrders: async () => {
  const { url } = get();
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
  //  createOrder
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
          Authorization: `Bearer ${token}`, // ✅ attach token here
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


  // fetchIndexCourses
fetchIndexCourses: async () => {
  const { url } = get();
  set({ loading: true });

  try {
    const res = await fetch(`${url}/courses/index/courses`);

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




// fetchProfile
fetchProfile: async () => {
  const { url } = get();
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


  //  updateProfile
  
 // Updated Zustand functions for better error handling and consistency

updateProfile: async (updatedData) => {
  const { url } = get();
  set({ loadingProfile: true }); // ✅ Add loading state

  try {
    const token = localStorage.getItem("token");
    
    console.log("🔄 Updating profile with data:", updatedData);
    console.log("🌐 Making request to:", `${url}/users/profile`);
    
    const res = await fetch(`${url}/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    console.log("📡 Response status:", res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Failed to update profile", res.status, errorText);
      return false;
    }

    const data = await res.json();
    console.log("✅ Profile updated successfully:", data);
    
    // ✅ Update the profile in store immediately
    set({ profile: data });
    return true;
    
  } catch (err) {
    console.error("❌ Error updating profile:", err);
    return false;
  } finally {
    set({ loadingProfile: false }); // ✅ Always stop loading
  }
},

// ✅ Add a fetchProfile function if you don't have one
fetchProfile: async () => {
  const { url } = get();
  set({ loadingProfile: true });

  try {
    const token = localStorage.getItem("token");
    
    if (!token) {
      console.log("No token found, user not authenticated");
      set({ profile: null, loadingProfile: false });
      return;
    }

    console.log("🔄 Fetching profile from:", `${url}/users/profile`);
    
    const res = await fetch(`${url}/users/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("📡 Fetch profile response status:", res.status);

    if (!res.ok) {
      if (res.status === 401) {
        // Token might be expired
        localStorage.removeItem("token");
        set({ profile: null, isAuthenticated: false });
      }
      const errorText = await res.text();
      console.error("❌ Failed to fetch profile", res.status, errorText);
      return;
    }

    const data = await res.json();
    console.log("✅ Profile fetched successfully:", data);
    
    set({ profile: data, isAuthenticated: true });
    
  } catch (err) {
    console.error("❌ Error fetching profile:", err);
    set({ profile: null });
  } finally {
    set({ loadingProfile: false });
  }
},

setProfilePicture: async (file) => {
  const { url } = get();
  set({ loadingProfile: true });

  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${url}/users/profile-picture`, { // ✅ Fixed endpoint
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      console.error("Failed to update profile picture", res.status);
      return null;
    }

    const data = await res.json();

    // ✅ Update the profile in store
    set((state) => ({
      profile: { ...state.profile, profile_picture: data.profile_picture },
    }));

    return data.profile_picture;
  } catch (err) {
    console.error("Error updating profile picture:", err);
    return null;
  } finally {
    set({ loadingProfile: false });
  }
},







}));
