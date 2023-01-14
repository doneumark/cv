import { useQuery } from '@tanstack/react-query';
import { useRecoilState } from 'recoil';
import * as api from '../services/api';
import Spinner from '../components/Spinner';
import UserState from '../state/UserState';

export default function LogoutPage() {
	const [, setUser] = useRecoilState(UserState);

	const { isLoading } = useQuery({
		queryKey: ['logout'],
		queryFn: api.logout,
		onSuccess: () => setUser(null),
	});

	if (isLoading) {
		return (
			<div className='w-screen h-screen'>
				<Spinner />
			</div>
		);
	}

	return null;
}
