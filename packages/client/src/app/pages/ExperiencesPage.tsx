import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Experience } from '@cv/api/interface';
import * as api from '../services/api';
import Button from '../components/Button';
import { parseApiDate, filterByQuery } from '../services/misc';
import SearchInput from '../components/SearchInput';
import Modal from '../components/Modal';
import ExperienceForm from '../components/ExperienceForm';
import PageContent from '../components/PageContent';
import PageTitle from '../components/PageTitle';
import PlusIcon from '../icons/PlusIcon';
import PencilIcon from '../icons/PencilIcon';
import LoadingContainer from '../components/LoadingContainer';
import { useFormRoute } from '../services/routes';

interface ExperienceBoxProps {
	experience: Experience;
}

function ExperienceBox({ experience }: ExperienceBoxProps) {
	return (
		<Link className='card card-bordered border-base-300 card-compact hover:shadow-md cursor-pointer flex items-between group' to={experience.id}>
			<div className='card-body flex-row items-center justify-between'>
				<div>
					<div className='flex items-center gap-3'>
						<div className='card-title'>
							{ experience.company }
						</div>
						<h6>{ experience.title }</h6>
					</div>
					<div className='flex items-center gap-3'>
						<div className='flex items-center'>
							{ parseApiDate(
								experience.startsAtDay,
								experience.startsAtMonth,
								experience.startsAtYear,
							) }
							{ ' - ' }
							{ parseApiDate(
								experience.endsAtDay,
								experience.endsAtMonth,
								experience.endsAtYear,
							) || 'Now' }
						</div>
						{ experience.description }
					</div>
				</div>
				<div className='hidden group-hover:block'>
					<PencilIcon />
				</div>
			</div>
		</Link>
	);
}

function CreateExperienceModal() {
	const { isCreatePath, rootPath: experiencesPath } = useFormRoute();
	const navigate = useNavigate();

	return (
		<Modal show={isCreatePath} onClose={() => navigate(experiencesPath)}>
			<div className='prose mb-6'>
				<h3>Create Experience</h3>
			</div>
			<ExperienceForm onClose={() => navigate(experiencesPath)} />
		</Modal>
	);
}

function UpdateExperienceModal() {
	const { isUpdatePath, pathParam: experienceId, rootPath: experiencesPath } = useFormRoute();
	const navigate = useNavigate();

	const { data: experience, isLoading } = useQuery({
		queryKey: ['experience', experienceId],
		queryFn: () => (experienceId ? api.getExperience(experienceId) : null),
		enabled: isUpdatePath,
		refetchOnWindowFocus: false,
	});

	return (
		<Modal show={isUpdatePath} onClose={() => navigate(experiencesPath)}>
			<div className='prose mb-6'>
				<h3>Update Experience</h3>
			</div>
			<LoadingContainer height={400} isLoading={isLoading}>
				<ExperienceForm
					experience={experience || undefined}
					onClose={() => navigate(experiencesPath)}
				/>
			</LoadingContainer>
		</Modal>
	);
}

export default function Experiences() {
	const navigate = useNavigate();
	const [search, setSearch] = useState('');
	const { data: experiences, isLoading } = useQuery({
		queryKey: ['experiences'],
		queryFn: api.getExperiences,
	});

	const filteredExperiences = useMemo(
		() => filterByQuery(search, experiences || [], ['company', 'description', 'title']),
		[experiences, search],
	);

	return (
		<>
			<PageTitle title='Experiences' />
			<PageContent>
				<LoadingContainer height={200} isLoading={isLoading}>
					<div className='space-y-6'>
						<div className='flex justify-between'>
							<SearchInput value={search} onChange={(e) => setSearch(e.target.value)} />
							<Button size='sm' color='secondary' type='submit' className='gap-2' onClick={() => navigate('new')}>
								<PlusIcon />
								Add Experience
							</Button>
						</div>

						<div className='space-y-3'>
							{ filteredExperiences.map((experience) => (
								<ExperienceBox experience={experience} key={`experience-box-${experience.id}`} />
							)) }
							{ !filteredExperiences.length && (
								<div className='text-center'>
									No experiences added yet
								</div>
							)}
						</div>
					</div>
				</LoadingContainer>
			</PageContent>
			<CreateExperienceModal />
			<UpdateExperienceModal />
		</>
	);
}
