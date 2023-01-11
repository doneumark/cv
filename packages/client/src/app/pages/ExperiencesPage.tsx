import { useState, useMemo, useCallback } from 'react';
import { Experience } from '@cv/api/interface';
import {
	useMatch, useResolvedPath, useNavigate, Link, useParams,
} from 'react-router-dom';
import axios from 'axios';
import { useQuery, useQueryClient } from 'react-query';
import Table from '../components/Table';
import Button from '../components/Button';
import { parseLinkedinDate, filterByQuery } from '../utils';
import SearchInput from '../components/SearchInput';
import Modal from '../components/Modal';
import ExperienceForm from '../components/ExperienceForm';
import PageContent from '../components/PageContent';
import PageTitle from '../components/PageTitle';
import Spinner from '../components/Spinner';

interface ExperienceRouteProps {
	path: string;
}

function CreateExperienceRoute({ path }: ExperienceRouteProps) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { pathname: experiencesPath } = useResolvedPath('');
	const { pathname: createExperiencePath } = useResolvedPath(path);
	const isCreateExperiencePath = !!useMatch(createExperiencePath);

	const refetchExperiences = useCallback(() => {
		queryClient.invalidateQueries({ queryKey: ['experiences'] });
	}, [queryClient]);

	const refetchCounts = useCallback(() => {
		queryClient.invalidateQueries({ queryKey: ['userCounts'] });
	}, [queryClient]);

	return (
		<Modal show={isCreateExperiencePath} onClose={() => navigate(experiencesPath)}>
			<div className='prose mb-6'>
				<h3>Create Experience</h3>
			</div>
			<ExperienceForm
				experience={null}
				onSave={() => {
					navigate(experiencesPath);
					refetchExperiences();
					refetchCounts();
				}}
				onCancel={() => navigate(experiencesPath)}
			/>
		</Modal>
	);
}

function UpdateExperienceRoute({ path }: ExperienceRouteProps) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { pathname: experiencesPath } = useResolvedPath('');
	const { pathname: updateExperiencePath } = useResolvedPath(path);
	const { '*': relativePath } = useParams();
	const experienceId = relativePath?.split('/')[0];
	const isUpdateExperiencePath = !!useMatch(updateExperiencePath) && experienceId !== 'new';

	const { data: experience, isLoading } = useQuery({
		queryKey: ['experience', experienceId],
		queryFn: async () => {
			if (!isUpdateExperiencePath) {
				return null;
			}

			const experienceRes = await axios.get<Experience>(`/api/experiences/${experienceId}`, { withCredentials: true });
			return experienceRes.data;
		},
	});

	const refetchExperiences = useCallback(() => {
		queryClient.invalidateQueries({ queryKey: ['experiences'] });
	}, [queryClient]);

	const refetchCounts = useCallback(() => {
		queryClient.invalidateQueries({ queryKey: ['userCounts'] });
	}, [queryClient]);

	return (
		<Modal show={isUpdateExperiencePath} onClose={() => navigate(experiencesPath)}>
			<div className='prose mb-6'>
				<h3>Update Experience</h3>
			</div>
			{ isLoading
				? (
					<div className='w-full h-60'>
						<Spinner />
					</div>
				)
				: (
					<ExperienceForm
						experience={experience}
						onSave={() => {
							navigate(experiencesPath);
							refetchExperiences();
							refetchCounts();
						}}
						onDelete={() => {
							navigate(experiencesPath);
							refetchExperiences();
							refetchCounts();
						}}
						onCancel={() => navigate(experiencesPath)}
					/>
				)}
		</Modal>
	);
}

export default function Experiences() {
	const navigate = useNavigate();

	const [search, setSearch] = useState('');

	const { data: experiences, isLoading } = useQuery({
		queryKey: ['experiences'],
		queryFn: async () => {
			const experiencesRes = await axios.get<Experience[]>('/api/experiences', { withCredentials: true });
			return experiencesRes.data;
		},
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
									<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
										<path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
									</svg>
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
														{ parseLinkedinDate(
															experience.startsAtDay,
															experience.startsAtMonth,
															experience.startsAtYear,
														) }
														{ ' - ' }
														{ parseLinkedinDate(
															experience.endsAtDay,
															experience.endsAtMonth,
															experience.endsAtYear,
														) || 'Now' }
													</div>
													{ experience.description }
												</div>
											</div>
											<div className='hidden group-hover:block'>
												<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
													<path strokeLinecap='round' strokeLinejoin='round' d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125' />
												</svg>
											</div>
										</div>
									</Link>
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
