import { create } from 'zustand';
import { User } from '@prisma/client';

type StateUser = Pick<User, 'id' | 'email' | 'fullName'>;

interface UserStore {
	user: StateUser | null;
	login: (user: StateUser) => void;
	logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
	user: null,
	login: (user) => set({ user }),
	logout: () => set({ user: null }),
}));
