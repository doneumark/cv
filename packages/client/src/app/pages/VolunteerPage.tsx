import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { VolunteerWork } from '@cv/api/interface';
import * as api from '../services/api';
import Button from '../components/Button';
import { parseApiDate, filterByQuery } from '../services/misc';
import SearchInput from '../components/SearchInput';
import Modal from '../components/Modal';
import VolunteerWorkForm from '../components/VolunteerWorkForm';
import PageContent from '../components/PageContent';
import PageTitle from '../components/PageTitle';
import PlusIcon from '../icons/PlusIcon';
import PencilIcon from '../icons/PencilIcon';
import LoadingContainer from '../components/LoadingContainer';
import { useFormRoute } from '../services/routes';

interface VolunteerBoxProps {
	volunteerWork: VolunteerWork;
}

function VolunteerBox({ volunteerWork }: VolunteerBoxProps) {
	return (
		<Link className='card card-bordered border-base-300 card-compact hover:shadow-md cursor-pointer flex items-between group' to={volunteerWork.id}>
			<div className='card-body flex-row items-center justify-between'>
				<div>
					<div className='flex items-center gap-3'>
						<div className='card-title'>
							{ volunteerWork.company }
						</div>
						<h6>{ `${volunteerWork.title}${volunteerWork.cause ? `, ${volunteerWork.cause}` : ''}`}</h6>
					</div>
					<div className='flex items-center gap-3'>
						<div className='flex items-center'>
							{ parseApiDate(
								volunteerWork.startsAtDay,
								volunteerWork.startsAtMonth,
								volunteerWork.startsAtYear,
							) }
							{ ' - ' }
							{ parseApiDate(
								volunteerWork.endsAtDay,
								volunteerWork.endsAtMonth,
								volunteerWork.endsAtYear,
							) || 'Now' }
						</div>
						{ volunteerWork.description }
					</div>
				</div>
				<div className='hidden group-hover:block'>
					<PencilIcon />
				</div>
			</div>
		</Link>
	);
}

function CreateVolunteerModal() {
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

function UpdateVolunteerModal() {
	const { isUpdatePath, pathParam: volunteerWorkId, rootPath: volunteersPath } = useFormRoute();
	const navigate = useNavigate();

	const { data: volunteerWork, isLoading } = useQuery({
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
			<LoadingContainer height={400} isLoading={isLoading}>
				<VolunteerWorkForm
					volunteerWork={volunteerWork || undefined}
					onClose={() => navigate(volunteersPath)}
				/>
			</LoadingContainer>
		</Modal>
	);
}

export default function Volunteers() {
	const navigate = useNavigate();
	const [search, setSearch] = useState('');
	const { data: volunteerWorks, isLoading } = useQuery({
		queryKey: ['volunteer-work'],
		queryFn: api.getVolunteerWorks,
	});

	const filteredVolunteerWorks = useMemo(
		() => filterByQuery(search, volunteerWorks || [], ['description', 'title', 'cause', 'company']),
		[volunteerWorks, search],
	);

	return (
		<>
			<PageTitle title='Volunteers' />
			<PageContent>
				<LoadingContainer height={200} isLoading={isLoading}>
					<div className='space-y-6'>
						<div className='flex justify-between'>
							<SearchInput value={search} onChange={(e) => setSearch(e.target.value)} />
							<Button size='sm' color='primary' type='submit' onClick={() => navigate('new')}>
								<PlusIcon />
								Add Volunteer
							</Button>
						</div>
						<div className='space-y-3'>
							{ filteredVolunteerWorks.map((filteredVolunteerWork) => (
								<VolunteerBox volunteerWork={filteredVolunteerWork} key={`volunteer-box-${filteredVolunteerWork.id}`} />
							)) }
							{ !filteredVolunteerWorks.length && (
								<div className='text-center'>
									No volunteers added yet
								</div>
							)}
						</div>
					</div>
				</LoadingContainer>
			</PageContent>
			<CreateVolunteerModal />
			<UpdateVolunteerModal />
		</>
	);
}
