import { useState, useMemo } from 'react';
import {
	useMatch, useResolvedPath, useNavigate, Link, useParams,
} from 'react-router-dom';
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
import Spinner from '../components/Spinner';
import { useToast } from '../services/toasts';
import PlusIcon from '../icons/PlusIcon';
import PencilIcon from '../icons/PencilIcon';
import LoadingContainer from '../components/LoadingContainer';

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

interface ExperienceRouteProps {
	path: string;
}

function CreateExperienceRoute({ path }: ExperienceRouteProps) {
	const { addToast } = useToast();
	const navigate = useNavigate();
	const { pathname: experiencesPath } = useResolvedPath('');
	const { pathname: createExperiencePath } = useResolvedPath(path);
	const isCreateExperiencePath = !!useMatch(createExperiencePath);

	return (
		<Modal show={isCreateExperiencePath} onClose={() => navigate(experiencesPath)}>
			<div className='prose mb-6'>
				<h3>Create Experience</h3>
			</div>
			<ExperienceForm
				experience={null}
				onSave={() => {
					addToast({ message: 'Experience created successfully', type: 'success' });
					navigate(experiencesPath);
				}}
				onCancel={() => navigate(experiencesPath)}
			/>
		</Modal>
	);
}

function UpdateExperienceRoute({ path }: ExperienceRouteProps) {
	const { addToast } = useToast();
	const navigate = useNavigate();
	const { pathname: experiencesPath } = useResolvedPath('');
	const { pathname: updateExperiencePath } = useResolvedPath(path);
	const { '*': relativePath } = useParams();
	const experienceId = relativePath?.split('/')[0];
	const isUpdateExperiencePath = !!useMatch(updateExperiencePath) && experienceId !== 'new';

	const { data: experience, isLoading } = useQuery({
		queryKey: ['experience', experienceId],
		queryFn: () => (
			isUpdateExperiencePath && experienceId ? api.getExperience(experienceId) : null
		),
	});

	return (
		<Modal show={isUpdateExperiencePath} onClose={() => navigate(experiencesPath)}>
			<div className='prose mb-6'>
				<h3>Update Experience</h3>
			</div>
			<LoadingContainer isLoading={isLoading}>
				<ExperienceForm
					experience={experience}
					onSave={() => {
						addToast({ message: 'Experience updated successfully', type: 'success' });
						navigate(experiencesPath);
					}}
					onDelete={() => {
						addToast({ message: 'Experience deleted successfully', type: 'info' });
						navigate(experiencesPath);
					}}
					onCancel={() => navigate(experiencesPath)}
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
				{ isLoading
					? (
						<div className='w-full h-60'>
							<Spinner />
						</div>
					)
					: (
						<div className='space-y-6'>
							<div className='flex justify-between'>
								<SearchInput value={search} onChange={(e) => setSearch(e.target.value)} />
								<Button size='sm' color='secondary' type='submit' className='gap-2' onClick={() => navigate('new')}>
									<PlusIcon />
									Add Experience
								</Button>
							</div>
							{ !filteredExperiences.length && (
								<div className='text-center'>
									No experiences found
								</div>
							)}
							<div className='space-y-3'>
								{ filteredExperiences.map((experience) => (
									<ExperienceBox experience={experience} />
								)) }
							</div>
						</div>
					)}
			</PageContent>
			<CreateExperienceRoute path='new' />
			<UpdateExperienceRoute path=':experienceId' />
		</>
	);
}
