import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
  _id : string,
  name: string;
  username : string,
  password : string,
  role : string,
} | null;

type UserStore = {
  user: User;
  setUser: (userData: NonNullable<User>) => void;
  clearUser: () => void;
};

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (userData) => set({ user: userData }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage', 
    }
  )
);

export default useUserStore;

