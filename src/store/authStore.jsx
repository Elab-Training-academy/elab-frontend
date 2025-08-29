import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  url: "https://elab-server-xg5r.onrender.com",  // ✅ removed space
  token: null,
  setToken: (token) => set({ token }),
  clearToken: () => set({ token: null }),
  courses: [],
  setCourses: (courses) => set({ courses }),
  categories: [],
  setCategories: (categories) => set({categories}),
  loading: false,

  fetchAllCourses: async () => {
    const url = get().url;
    const newToken = get().token;

    try {
      set({ loading: true });

      
      const response = await fetch(`${url}/courses`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${newToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        set({ courses: data });
      } else {
        console.error("Failed to fetch courses:", response.status);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      set({ loading: false });
    }
  },
  fetchAllCategories: async () => {
    const url = get().url;
    const newToken = get().token;

    try {
      set({ loading: true });

      
      const response = await fetch(`${url}/categories/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${newToken}`
        }
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
}));
