import { atom } from 'recoil';

export interface Toast {
	type: 'success' | 'error' | 'info' | 'warning';
	message: string;
	id: string;
}

export default atom<Toast[]>({
	key: 'toastsState', // unique ID (with respect to other atoms/selectors)
	default: [],
});
