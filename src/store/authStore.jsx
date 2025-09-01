import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  url: "https://elab-server-xg5r.onrender.com",
  token: null,
  setToken: (token) => set({ token }),
  clearToken: () => set({ token: null }),
  courses: [],
  setCourses: (courses) => set({ courses }),
  loading: false,



  fetchAllCourses: async () => {
    const url = get().url;
    const newToken = get().token;

    try {
      set({ loading: true });

      const headers = newToken
        ? { Authorization: `Bearer ${newToken}` }
        : {};

      const response = await fetch(`${url}/courses`, {
        method: "GET",
        headers,
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
}));
