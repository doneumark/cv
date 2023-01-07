import { atom } from 'recoil';

export interface User {
	fullName: string;
}

export default atom({
	key: 'userState', // unique ID (with respect to other atoms/selectors)
	default: null as User | null, // default value (aka initial value)
});
