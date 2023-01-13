import { useState, useMemo } from 'react';
import {
	useMatch, useResolvedPath, useNavigate, Link, useParams,
} from 'react-router-dom';
import { useQuery } from 'react-query';
import { Project } from '@cv/api/interface';
import * as api from '../services/api';
import Button from '../components/Button';
import { parseApiDate, filterByQuery } from '../services/misc';
import SearchInput from '../components/SearchInput';
import Modal from '../components/Modal';
import ProjectForm from '../components/ProjectForm';
import PageContent from '../components/PageContent';
import PageTitle from '../components/PageTitle';
import Spinner from '../components/Spinner';
import PlusIcon from '../icons/PlusIcon';
import PencilIcon from '../icons/PencilIcon';
import { useToast } from '../services/toasts';
import LoadingContainer from '../components/LoadingContainer';

interface ProjectBoxProps {
	project: Project;
}

function ProjectBox({ project }: ProjectBoxProps) {
	return (
		<Link className='card card-bordered border-base-300 card-compact hover:shadow-md cursor-pointer flex items-between group' to={project.id}>
			<div className='card-body flex-row items-center justify-between'>
				<div>
					<div className='flex items-center gap-3'>
						<div className='card-title'>
							{ project.title }
						</div>
					</div>
					<div className='flex items-center gap-3'>
						<div className='flex items-center'>
							{ parseApiDate(
								project.startsAtDay,
								project.startsAtMonth,
								project.startsAtYear,
							) }
							{ ' - ' }
							{ parseApiDate(
								project.endsAtDay,
								project.endsAtMonth,
								project.endsAtYear,
							) || 'Now' }
						</div>
						{ project.description }
					</div>
				</div>
				<div className='hidden group-hover:block'>
					<PencilIcon />
				</div>
			</div>
		</Link>
	);
}

interface ProjectRouteProps {
	path: string;
}

function CreateProjectRoute({ path }: ProjectRouteProps) {
	const { addToast } = useToast();
	const navigate = useNavigate();

	const { pathname: projectsPath } = useResolvedPath('');
	const { pathname: createProjectPath } = useResolvedPath(path);
	const isCreateProjectPath = !!useMatch(createProjectPath);

	return (
		<Modal show={isCreateProjectPath} onClose={() => navigate(projectsPath)}>
			<div className='prose mb-6'>
				<h3>Create Project</h3>
			</div>
			<ProjectForm
				project={null}
				onSave={() => {
					addToast({ message: 'Project created successfully', type: 'success' });
					navigate(projectsPath);
				}}
				onCancel={() => navigate(projectsPath)}
			/>
		</Modal>
	);
}

function UpdateProjectRoute({ path }: ProjectRouteProps) {
	const { addToast } = useToast();
	const navigate = useNavigate();
	const { pathname: projectsPath } = useResolvedPath('');
	const { pathname: updateProjectPath } = useResolvedPath(path);
	const { '*': relativePath } = useParams();
	const projectId = relativePath?.split('/')[0];
	const isUpdateProjectPath = !!useMatch(updateProjectPath) && projectId !== 'new';

	const { data: project, isLoading } = useQuery({
		queryKey: ['project', projectId],
		queryFn: () => (
			isUpdateProjectPath && projectId ? api.getProject(projectId) : null
		),
	});

	return (
		<Modal show={isUpdateProjectPath} onClose={() => navigate(projectsPath)}>
			<div className='prose mb-6'>
				<h3>Update Project</h3>
			</div>
			<LoadingContainer isLoading={isLoading}>
				<ProjectForm
					project={project}
					onSave={() => {
						addToast({ message: 'Project updated successfully', type: 'success' });
						navigate(projectsPath);
					}}
					onDelete={() => {
						addToast({ message: 'Project deleted successfully', type: 'info' });
						navigate(projectsPath);
					}}
					onCancel={() => navigate(projectsPath)}
				/>
			</LoadingContainer>
		</Modal>
	);
}

export default function Projects() {
	const navigate = useNavigate();
	const [search, setSearch] = useState('');
	const { data: projects, isLoading } = useQuery({
		queryKey: ['projects'],
		queryFn: api.getProjects,
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
									<PlusIcon />
									Add Project
								</Button>
							</div>
							{ !filteredProjects.length && (
								<div className='text-center'>
									No projects found
								</div>
							)}
							<div className='space-y-3'>
								{ filteredProjects.map((project) => (
									<ProjectBox project={project} />
								)) }
							</div>
						</div>
					)}
			</PageContent>
			<CreateProjectRoute path='new' />
			<UpdateProjectRoute path=':projectId' />
		</>
	);
}
