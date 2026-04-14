"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { MembershipLevel, UserRole } from "@/data/site-data";

type SessionUser = {
  id?: string;
  nama: string;
  email: string;
  noHp: string;
  role: UserRole;
  membership: MembershipLevel;
};

type SessionState = {
  user: SessionUser | null;
  setUser: (user: SessionUser) => void;
  updateUser: (partial: Partial<SessionUser>) => void;
  logout: () => void;
  /** @deprecated Use logout() instead */
  clearUser: () => void;
  isAuthenticated: () => boolean;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : state.user,
        })),
      logout: () => set({ user: null }),
      clearUser: () => set({ user: null }),
      isAuthenticated: () => get().user !== null,
    }),
    {
      name: "dormcare-session",
    },
  ),
);

export type { SessionUser };
