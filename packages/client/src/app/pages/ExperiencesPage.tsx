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
			<div className='prose'>
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
			<div className='prose'>
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
							<Table>
								<thead>
									<tr>
										<th>From</th>
										<th>To</th>
										<th>Company</th>
										<th>Title</th>
										<th>Description</th>
									</tr>
								</thead>
								<tbody>
									{ !filteredExperiences.length && (
										<tr>
											<td colSpan={4} className='text-center'>
												No experiences found
											</td>
										</tr>
									)}
									{ filteredExperiences.map((experience) => (
										<tr key={experience.id}>
											<td>
												<Link to={experience.id}>
													{ parseLinkedinDate(
														experience.startsAtDay,
														experience.startsAtMonth,
														experience.startsAtYear,
													) }
												</Link>
											</td>
											<td>
												{ parseLinkedinDate(
													experience.endsAtDay,
													experience.endsAtMonth,
													experience.endsAtYear,
												) }
											</td>
											<td>
												<Link to={experience.id}>
													{ experience.company }
												</Link>
											</td>
											<td>
												<Link to={experience.id}>
													{ experience.title }
												</Link>
											</td>
											<td>{ experience.description }</td>
										</tr>
									)) }
								</tbody>
							</Table>
						</div>
					)}
			</PageContent>
			<CreateExperienceRoute path='new' />
			<UpdateExperienceRoute path=':experienceId' />
		</>
	);
}
