import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as api from '../services/api';
import Button from '../components/Button';
import { filterByQuery } from '../services/misc';
import SearchInput from '../components/SearchInput';
import Modal from '../components/Modal';
import ExperienceForm from '../components/experience/ExperienceForm';
import PageContent from '../components/PageContent';
import PageTitle from '../components/PageTitle';
import PlusIcon from '../icons/PlusIcon';
import LoadingContainer from '../components/LoadingContainer';
import { useFormRoute } from '../services/routes';
import BoxLink from '../components/BoxLinkContainer';
import ExperienceBox from '../components/experience/ExperienceBox';

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

	const { data: experience, isInitialLoading } = useQuery({
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
			<LoadingContainer height={400} isLoading={isInitialLoading}>
				<ExperienceForm
					experience={experience || undefined}
					onClose={() => navigate(experiencesPath)}
				/>
			</LoadingContainer>
		</Modal>
	);
}

function Experiences() {
	const navigate = useNavigate();
	const [search, setSearch] = useState('');
	const {
		data: experiences, isInitialLoading, error, isSuccess,
	} = useQuery({
		queryKey: ['experiences'],
		queryFn: api.getExperiences,
	});

	const filteredExperiences = useMemo(
		() => filterByQuery(search, experiences || [], ['company', 'description', 'title']),
		[experiences, search],
	);

	return (
		<LoadingContainer height={200} isLoading={isInitialLoading}>
			<div className='space-y-6'>
				<div className='flex justify-between'>
					<SearchInput value={search} onChange={(e) => setSearch(e.target.value)} />
					<Button size='sm' color='secondary' type='submit' className='gap-2' onClick={() => navigate('new')}>
						<PlusIcon />
						Add Experience
					</Button>
				</div>
				{
					isSuccess && (
						filteredExperiences.length > 0
							? (
								<div className='space-y-3'>
									{ filteredExperiences.map((experience) => (
										<BoxLink to={experience.id} key={`experience-box-${experience.id}`}>
											<ExperienceBox extended experience={experience} />
										</BoxLink>
									)) }
								</div>
							)
							: (
								<div className='text-center'>
									No experiences added yet
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

export default function ExperiencesPage() {
	return (
		<>
			<PageTitle title='Experiences' />
			<PageContent>
				<Experiences />
			</PageContent>
			<CreateExperienceModal />
			<UpdateExperienceModal />
		</>
	);
}
