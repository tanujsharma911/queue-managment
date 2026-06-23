import { create } from "zustand";

interface UserState {
  user: {
    id: string;
    username: string;
    name: string;
    email: string;
    token: string;
  } | null;
  isAuthenticated: boolean;
  login: (payload: {
    id: string;
    username: string;
    name: string;
    email: string;
    token: string;
  }) => void;
  logout: () => void;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (payload) => {
    set({ user: payload, isAuthenticated: true });
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));

export { useUserStore };
