import axios from 'axios';
import { useQuery } from 'react-query';
import { useRecoilState } from 'recoil';
import UserState from '../state/UserState';

export default function LogoutPage() {
	const [user, setUser] = useRecoilState(UserState);

	const { isLoading } = useQuery(
		['logout'],
		async () => {
			try {
				await axios.post('/api/logout', { withCredentials: true });
				setUser(null);
			} catch (err) {
				setUser(user);
			}
		},
	);

	if (isLoading) {
		return <h1>Loading...</h1>;
	}

	return null;
}
