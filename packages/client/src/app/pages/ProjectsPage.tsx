import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as api from '../services/api';
import Button from '../components/Button';
import { filterByQuery } from '../services/misc';
import SearchInput from '../components/SearchInput';
import Modal from '../components/Modal';
import ProjectForm from '../components/project/ProjectForm';
import PageContent from '../components/PageContent';
import PageTitle from '../components/PageTitle';
import PlusIcon from '../icons/PlusIcon';
import LoadingContainer from '../components/LoadingContainer';
import { useFormRoute } from '../services/routes';
import BoxLink from '../components/BoxLinkContainer';
import ProjectBox from '../components/project/ProjectBox';

function CreateProjectModal() {
	const { isCreatePath, rootPath: projectsPath } = useFormRoute();
	const navigate = useNavigate();

	return (
		<Modal show={isCreatePath} onClose={() => navigate(projectsPath)}>
			<div className='prose mb-6'>
				<h3>Create Project</h3>
			</div>
			<ProjectForm onClose={() => navigate(projectsPath)} />
		</Modal>
	);
}

function UpdateProjectModal() {
	const { isUpdatePath, pathParam: projectId, rootPath: projectsPath } = useFormRoute();
	const navigate = useNavigate();

	const { data: project, isInitialLoading } = useQuery({
		queryKey: ['project', projectId],
		queryFn: () => (projectId ? api.getProject(projectId) : null),
		enabled: isUpdatePath,
		refetchOnWindowFocus: false,
	});

	return (
		<Modal show={isUpdatePath} onClose={() => navigate(projectsPath)}>
			<div className='prose mb-6'>
				<h3>Update Project</h3>
			</div>
			<LoadingContainer height={400} isLoading={isInitialLoading}>
				<ProjectForm
					project={project || undefined}
					onClose={() => navigate(projectsPath)}
				/>
			</LoadingContainer>
		</Modal>
	);
}

function Projects() {
	const navigate = useNavigate();
	const [search, setSearch] = useState('');
	const {
		data: projects, isInitialLoading, isSuccess, error,
	} = useQuery({
		queryKey: ['projects'],
		queryFn: api.getProjects,
	});

	const filteredProjects = useMemo(
		() => filterByQuery(search, projects || [], ['description', 'title']),
		[projects, search],
	);

	return (
		<LoadingContainer height={200} isLoading={isInitialLoading}>
			<div className='space-y-6'>
				<div className='flex justify-between'>
					<SearchInput value={search} onChange={(e) => setSearch(e.target.value)} />
					<Button size='sm' color='secondary' type='submit' className='gap-2' onClick={() => navigate('new')}>
						<PlusIcon />
						Add Project
					</Button>
				</div>
				{
					isSuccess && (
						filteredProjects.length > 0
							? (
								<div className='space-y-3'>
									{ filteredProjects.map((project) => (
										<BoxLink to={project.id} key={`project-box-${project.id}`}>
											<ProjectBox extended project={project} />
										</BoxLink>
									)) }
								</div>
							)
							: (
								<div className='text-center'>
									No projects added yet
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

export default function ProjectsPage() {
	return (
		<>
			<PageTitle title='Projects' />
			<PageContent>
				<Projects />
			</PageContent>
			<CreateProjectModal />
			<UpdateProjectModal />
		</>
	);
}
