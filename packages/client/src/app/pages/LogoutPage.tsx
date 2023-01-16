import { useQuery } from '@tanstack/react-query';
import * as api from '../services/api';
import Spinner from '../components/Spinner';
import { useUserStore } from '../stores/UserStore';

export default function LogoutPage() {
	const { logout } = useUserStore();

	const { isLoading } = useQuery({
		queryKey: ['logout'],
		queryFn: api.logout,
		onSuccess: () => logout(),
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
