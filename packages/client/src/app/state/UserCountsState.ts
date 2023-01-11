import { atom } from 'recoil';

export interface UserCounts {
	educations?: number;
	experiences?: number;
	projects?: number;
	volunteerWorks?: number;
	jobs?: number;
}

export default atom<UserCounts>({
	key: 'userCountsState', // unique ID (with respect to other atoms/selectors)
	default: {},
});
