import { useQuery } from 'react-query';
import axios from 'axios';
import { Profile } from '@cv/api/interface';
import ProfileForm from '../components/ProfileForm';
import PageTitle from '../components/PageTitle';
import PageContent from '../components/PageContent';
import Spinner from '../components/Spinner';

export function ProfilePage() {
	const {
		data: profile, isLoading, error,
	} = useQuery<Profile>({
		queryKey: ['profile'],
		queryFn: async () => {
			try {
				const resProfile = await axios.get<Profile>('/api/profile', { withCredentials: true });
				return resProfile.data;
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
