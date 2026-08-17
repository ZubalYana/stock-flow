import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  name: string | null;
  email: string | null;
}

interface AuthStore {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logOut: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logOut: () => set({ token: null, user: null }),
    }),
    { name: 'auth-storage' } 
  )
);

