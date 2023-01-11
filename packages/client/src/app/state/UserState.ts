import { atom } from 'recoil';

export interface User {
	fullName: string;
}

export default atom<User | null>({
	key: 'userState', // unique ID (with respect to other atoms/selectors)
	default: null,
});
