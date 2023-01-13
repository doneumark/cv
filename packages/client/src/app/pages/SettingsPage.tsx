import { useQuery } from 'react-query';
import { User } from '@cv/api/interface';
import * as api from '../services/api';
import UserForm from '../components/UserForm';
import PageTitle from '../components/PageTitle';
import PageContent from '../components/PageContent';
import Spinner from '../components/Spinner';

export function SettingsPage() {
	const {
		data: user, isLoading, error,
	} = useQuery<User>({
		queryKey: ['user'],
		queryFn: api.getUser,
		onError: (err) => {
			alert(err);
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
