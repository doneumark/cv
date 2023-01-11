import { useState, useMemo, useCallback } from 'react';
import { Project } from '@cv/api/interface';
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
import ProjectForm from '../components/ProjectForm';
import PageContent from '../components/PageContent';
import PageTitle from '../components/PageTitle';
import Spinner from '../components/Spinner';

interface ProjectRouteProps {
	path: string;
}

function CreateProjectRoute({ path }: ProjectRouteProps) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { pathname: projectsPath } = useResolvedPath('');
	const { pathname: createProjectPath } = useResolvedPath(path);
	const isCreateProjectPath = !!useMatch(createProjectPath);

	const refetchProjects = useCallback(() => {
		queryClient.invalidateQueries({ queryKey: ['projects'] });
	}, [queryClient]);

	const refetchCounts = useCallback(() => {
		queryClient.invalidateQueries({ queryKey: ['userCounts'] });
	}, [queryClient]);

	return (
		<Modal show={isCreateProjectPath} onClose={() => navigate(projectsPath)}>
			<div className='prose mb-6'>
				<h3>Create Project</h3>
			</div>
			<ProjectForm
				project={null}
				onSave={() => {
					navigate(projectsPath);
					refetchProjects();
					refetchCounts();
				}}
				onCancel={() => navigate(projectsPath)}
			/>
		</Modal>
	);
}

function UpdateProjectRoute({ path }: ProjectRouteProps) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { pathname: projectsPath } = useResolvedPath('');
	const { pathname: updateProjectPath } = useResolvedPath(path);
	const { '*': relativePath } = useParams();
	const projectId = relativePath?.split('/')[0];
	const isUpdateProjectPath = !!useMatch(updateProjectPath) && projectId !== 'new';

	const { data: project, isLoading } = useQuery({
		queryKey: ['project', projectId],
		queryFn: async () => {
			if (!isUpdateProjectPath) {
				return null;
			}

			const projectRes = await axios.get<Project>(`/api/projects/${projectId}`, { withCredentials: true });
			return projectRes.data;
		},
	});

	const refetchProjects = useCallback(() => {
		queryClient.invalidateQueries({ queryKey: ['projects'] });
	}, [queryClient]);

	const refetchCounts = useCallback(() => {
		queryClient.invalidateQueries({ queryKey: ['userCounts'] });
	}, [queryClient]);

	return (
		<Modal show={isUpdateProjectPath} onClose={() => navigate(projectsPath)}>
			<div className='prose mb-6'>
				<h3>Update Project</h3>
			</div>
			{ isLoading
				? (
					<div className='w-full h-60'>
						<Spinner />
					</div>
				)
				: (
					<ProjectForm
						project={project}
						onSave={() => {
							navigate(projectsPath);
							refetchProjects();
							refetchCounts();
						}}
						onDelete={() => {
							navigate(projectsPath);
							refetchProjects();
							refetchCounts();
						}}
						onCancel={() => navigate(projectsPath)}
					/>
				) }
		</Modal>
	);
}

export default function Projects() {
	const navigate = useNavigate();

	const [search, setSearch] = useState('');

	const { data: projects, isLoading } = useQuery({
		queryKey: ['projects'],
		queryFn: async () => {
			const projectsRes = await axios.get<Project[]>('/api/projects', { withCredentials: true });
			return projectsRes.data;
		},
	});

	const filteredProjects = useMemo(
		() => filterByQuery(search, projects || [], ['description', 'title']),
		[projects, search],
	);

	return (
		<>
			<PageTitle title='Projects' />
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
									Add Project
								</Button>
							</div>
							<Table>
								<thead>
									<tr>
										<th>From</th>
										<th>To</th>
										<th>Title</th>
										<th>Description</th>
									</tr>
								</thead>
								<tbody>
									{ !filteredProjects.length && (
										<tr>
											<td colSpan={4} className='text-center'>
												No projects found
											</td>
										</tr>
									)}
									{ filteredProjects.map((project) => (
										<tr key={project.id}>
											<td>
												<Link to={project.id}>
													{ parseLinkedinDate(
														project.startsAtDay,
														project.startsAtMonth,
														project.startsAtYear,
													) }
												</Link>
											</td>
											<td>
												{ parseLinkedinDate(
													project.endsAtDay,
													project.endsAtMonth,
													project.endsAtYear,
												) }
											</td>
											<td>
												<Link to={project.id}>
													{ project.title }
												</Link>
											</td>
											<td>{ project.description }</td>
										</tr>
									)) }
								</tbody>
							</Table>
						</div>
					)}
			</PageContent>
			<CreateProjectRoute path='new' />
			<UpdateProjectRoute path=':projectId' />
		</>
	);
}
