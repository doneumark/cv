import { useQuery } from 'react-query';
import { Profile } from '@cv/api/interface';
import * as api from '../services/api';
import ProfileForm from '../components/ProfileForm';
import PageTitle from '../components/PageTitle';
import PageContent from '../components/PageContent';
import Spinner from '../components/Spinner';

export function ProfilePage() {
	const {
		data: profile, isLoading, error,
	} = useQuery<Profile>({
		queryKey: ['profile'],
		queryFn: api.getProfile,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	});

	if (!profile || error) {
		return <h1>ERROR</h1>;
	}

	return (
		<>
			<PageTitle title='Profile' />
			<PageContent>
				{ isLoading
					? (
						<div className='w-full h-60'>
							<Spinner />
						</div>
					)
					: (
						<ProfileForm profile={profile} />
					)}
			</PageContent>
		</>
	);
}

export default ProfilePage;
