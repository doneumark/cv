import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as api from '../services/api';
import Button from '../components/Button';
import { filterByQuery } from '../services/misc';
import SearchInput from '../components/SearchInput';
import Modal from '../components/Modal';
import VolunteerWorkForm from '../components/VolunteerWorkForm';
import PageContent from '../components/PageContent';
import PageTitle from '../components/PageTitle';
import PlusIcon from '../icons/PlusIcon';
import LoadingContainer from '../components/LoadingContainer';
import { useFormRoute } from '../services/routes';
import BoxLink from '../components/BoxLinkContainer';
import VolunteerWorkBox from '../components/VolunteerWorkBox';

function CreateVolunteerWorkModal() {
	const { isCreatePath, rootPath: volunteersPath } = useFormRoute();
	const navigate = useNavigate();

	return (
		<Modal show={isCreatePath} onClose={() => navigate(volunteersPath)}>
			<div className='prose mb-6'>
				<h3>Create Volunteer</h3>
			</div>
			<VolunteerWorkForm onClose={() => navigate(volunteersPath)} />
		</Modal>
	);
}

function UpdateVolunteerWorkModal() {
	const { isUpdatePath, pathParam: volunteerWorkId, rootPath: volunteersPath } = useFormRoute();
	const navigate = useNavigate();

	const { data: volunteerWork, isInitialLoading } = useQuery({
		queryKey: ['volunteer-work', volunteerWorkId],
		queryFn: () => (volunteerWorkId ? api.getVolunteerWork(volunteerWorkId) : null),
		enabled: isUpdatePath,
		refetchOnWindowFocus: false,
	});

	return (
		<Modal show={isUpdatePath} onClose={() => navigate(volunteersPath)}>
			<div className='prose mb-6'>
				<h3>Update Volunteer</h3>
			</div>
			<LoadingContainer height={400} isLoading={isInitialLoading}>
				<VolunteerWorkForm
					volunteerWork={volunteerWork || undefined}
					onClose={() => navigate(volunteersPath)}
				/>
			</LoadingContainer>
		</Modal>
	);
}

function VolunteerWorks() {
	const navigate = useNavigate();
	const [search, setSearch] = useState('');
	const {
		data: volunteerWorks, isInitialLoading, isSuccess, error,
	} = useQuery({
		queryKey: ['volunteer-works'],
		queryFn: api.getVolunteerWorks,
	});

	const filteredVolunteerWorks = useMemo(
		() => filterByQuery(search, volunteerWorks || [], ['description', 'title', 'cause', 'company']),
		[volunteerWorks, search],
	);

	return (
		<LoadingContainer height={200} isLoading={isInitialLoading}>
			<div className='space-y-6'>
				<div className='flex justify-between'>
					<SearchInput value={search} onChange={(e) => setSearch(e.target.value)} />
					<Button size='sm' color='primary' type='submit' onClick={() => navigate('new')}>
						<PlusIcon />
						Add Volunteer
					</Button>
				</div>
				{
					isSuccess && (
						filteredVolunteerWorks.length > 0
							? (
								<div className='space-y-3'>
									{ filteredVolunteerWorks.map((volunteerWork) => (
										<BoxLink to={volunteerWork.id} key={`volunteer-box-${volunteerWork.id}`}>
											<VolunteerWorkBox extended volunteerWork={volunteerWork} />
										</BoxLink>
									)) }
								</div>
							)
							: (
								<div className='text-center'>
									No volunteers added yet
								</div>
							)
					)
				}
				{ error ? (
					<div className='text-center text-error'>
						{ error instanceof Error ? error.message : 'Unknown Error' }
					</div>
				) : null }
			</div>
		</LoadingContainer>
	);
}

export default function VolunteerPage() {
	return (
		<>
			<PageTitle title='Volunteers' />
			<PageContent>
				<VolunteerWorks />
			</PageContent>
			<CreateVolunteerWorkModal />
			<UpdateVolunteerWorkModal />
		</>
	);
}
