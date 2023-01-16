import { create } from 'zustand';

export interface Toast {
	type: 'success' | 'error' | 'info' | 'warning';
	message: string;
	id: string;
}

interface ToastStore {
	toasts: Toast[],
	addToast: (toast: Pick<Toast, 'type' | 'message'>) => void;
	removeToast: (toast: Toast) => void;
}

const generateRandomId = () => Math.floor((1 + Math.random()) * 0x10000)
	.toString(16)
	.substring(1);

export const useToastsStore = create<ToastStore>((set) => ({
	toasts: [],
	addToast: (toast) => set((state) => ({
		toasts: [{ id: generateRandomId(), ...toast }, ...state.toasts],
	})),
	removeToast: (toast) => set((state) => ({
		toasts: state.toasts.filter((t) => t.id !== toast.id),
	})),
}));
