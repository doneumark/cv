import { useQuery } from 'react-query';
import { Profile } from '@cv/api/interface';
import * as api from '../services/api';
import ProfileForm from '../components/ProfileForm';
import PageTitle from '../components/PageTitle';
import PageContent from '../components/PageContent';
import LoadingContainer from '../components/LoadingContainer';

export function ProfilePage() {
	const {
		data: profile, isLoading,
	} = useQuery<Profile>({
		queryKey: ['profile'],
		queryFn: api.getProfile,
		refetchOnWindowFocus: false,
	});

	return (
		<>
			<PageTitle title='Profile' />
			<PageContent>
				<LoadingContainer height={200} isLoading={isLoading}>
					<ProfileForm profile={profile || undefined} />
				</LoadingContainer>
			</PageContent>
		</>
	);
}

export default ProfilePage;
