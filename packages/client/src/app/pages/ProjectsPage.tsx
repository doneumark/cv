import { useState, useMemo } from 'react';
import { Project } from '@cv/api/interface';
import {
	useMatch, useResolvedPath, useNavigate, Link, useParams,
} from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';
import Table from '../components/Table';
import Button from '../components/Button';
import { parseLinkedinDate, filterByQuery } from '../utils';
import SearchInput from '../components/SearchInput';
import Modal from '../components/Modal';
import ProjectForm from '../components/ProjectForm';

interface ProjectRouteProps {
	path: string;
}

function CreateProjectRoute({ path }: ProjectRouteProps) {
	const navigate = useNavigate();
	const { pathname: projectsPath } = useResolvedPath('');
	const { pathname: createProjectPath } = useResolvedPath(path);
	const isCreateProjectPath = !!useMatch(createProjectPath);

	return (
		<Modal show={isCreateProjectPath} onClose={() => navigate(projectsPath)}>
			<ProjectForm
				project={null}
				onCreate={() => navigate(projectsPath)}
				onCancel={() => navigate(projectsPath)}
				onDelete={() => navigate(projectsPath)}
			/>
		</Modal>
	);
}

function UpdateProjectRoute({ path }: ProjectRouteProps) {
	const navigate = useNavigate();
	const { pathname: projectsPath } = useResolvedPath('');
	const { pathname: updateProjectPath } = useResolvedPath(path);
	const { '*': relativePath } = useParams();
	const projectId = relativePath?.split('/')[0];
	const isUpdateProjectPath = !!useMatch(updateProjectPath) && projectId !== 'new';

	const { data: project, isLoading } = useQuery(
		['project', projectId],
		async () => {
			if (!isUpdateProjectPath) {
				return null;
			}

			const projectRes = await axios.get(`/api/projects/${projectId}`, { withCredentials: true });
			return projectRes.data;
		},
	);

	if (isLoading) {
		return (
			<h1>Loading...</h1>
		);
	}

	return (
		<Modal show={isUpdateProjectPath} onClose={() => navigate(projectsPath)}>
			<ProjectForm
				project={project}
				onUpdate={() => navigate(projectsPath)}
				onCancel={() => navigate(projectsPath)}
				onDelete={() => navigate(projectsPath)}
			/>
		</Modal>
	);
}

interface ProjectsProps {
	projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
	const navigate = useNavigate();

	const [search, setSearch] = useState('');

	const filteredProjects = useMemo(
		() => filterByQuery(search, projects, ['description', 'title']),
		[projects, search],
	);

	return (
		<div className='space-y-6'>
			<div className='flex justify-between'>
				<SearchInput value={search} onChange={(e) => setSearch(e.target.value)} />
				<Button color='secondary' type='submit' className='gap-2' onClick={() => navigate('new')}>
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
			<CreateProjectRoute path='new' />
			<UpdateProjectRoute path=':projectId' />
		</div>
	);
}
