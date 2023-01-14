import { useQuery } from '@tanstack/react-query';
import { User } from '@cv/api/interface';
import * as api from '../services/api';
import UserForm from '../components/user/UserForm';
import PageTitle from '../components/PageTitle';
import PageContent from '../components/PageContent';
import LoadingContainer from '../components/LoadingContainer';

export default function SettingsPage() {
	const {
		data: user, isLoading,
	} = useQuery<User>({
		queryKey: ['user'],
		queryFn: api.getUser,
		refetchOnWindowFocus: false,
	});

	return (
		<>
			<PageTitle title='User' />
			<PageContent>
				<LoadingContainer height={200} isLoading={isLoading}>
					<UserForm user={user || undefined} />
				</LoadingContainer>
			</PageContent>
		</>
	);
}
