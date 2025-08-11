import { create } from 'zustand'

export const useAuthStore = create((set) => ({
 url: " https://elab-server.onrender.com",
//  token: localStorage.getItem('token')
}))

