import { useQuery } from 'react-query';
import axios from 'axios';
import { User } from '@cv/api/interface';
import UserForm from '../components/UserForm';
import PageTitle from '../components/PageTitle';
import PageContent from '../components/PageContent';
import Spinner from '../components/Spinner';

export function SettingsPage() {
	const {
		data: user, isLoading, error,
	} = useQuery<User>({
		queryKey: ['user'],
		queryFn: async () => {
			try {
				const resUser = await axios.get<User>('/api/user', { withCredentials: true });
				return resUser.data;
			} catch (err) {
				if (axios.isAxiosError(err) && err.response) {
					throw err.response.data;
				}

				throw err;
			}
		},
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	});

	if (error || !user) {
		return <h1>ERROR</h1>;
	}

	return (
		<>
			<PageTitle title='Settings' />
			<PageContent>
				{isLoading
					? (
						<div className='w-full h-60'>
							<Spinner />
						</div>
					)
					: (
						<UserForm user={user} />
					)}
			</PageContent>
		</>
	);
}

export default SettingsPage;
