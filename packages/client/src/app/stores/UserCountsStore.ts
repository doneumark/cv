import { create } from 'zustand';

export interface UserCounts {
	educations?: number;
	experiences?: number;
	projects?: number;
	volunteerWorks?: number;
	jobs?: number;
}

interface UserCountsStore {
	userCounts: UserCounts,
	setUserCounts: (userCounts: UserCounts) => void;
}

export const useUserCountsStore = create<UserCountsStore>((set) => ({
	userCounts: {},
	setUserCounts: (userCounts) => set({ userCounts }),
}));
