import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
import PlusIcon from '../icons/PlusIcon';
import PencilIcon from '../icons/PencilIcon';
import LoadingContainer from '../components/LoadingContainer';
import { useFormRoute } from '../services/routes';

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
						{ `${project.description}` }
					</div>
				</div>
				<div className='hidden group-hover:block'>
					<PencilIcon />
				</div>
			</div>
		</Link>
	);
}

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

	const { data: project, isLoading } = useQuery({
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
			<LoadingContainer height={400} isLoading={isLoading}>
				<ProjectForm
					project={project || undefined}
					onClose={() => navigate(projectsPath)}
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
				<LoadingContainer height={200} isLoading={isLoading}>
					<div className='space-y-6'>
						<div className='flex justify-between'>
							<SearchInput value={search} onChange={(e) => setSearch(e.target.value)} />
							<Button size='sm' color='secondary' type='submit' className='gap-2' onClick={() => navigate('new')}>
								<PlusIcon />
								Add Project
							</Button>
						</div>

						<div className='space-y-3'>
							{ filteredProjects.map((project) => (
								<ProjectBox project={project} key={`project-box-${project.id}`} />
							)) }
							{ !filteredProjects.length && (
								<div className='text-center'>
									No projects added yet
								</div>
							)}
						</div>
					</div>
				</LoadingContainer>
			</PageContent>
			<CreateProjectModal />
			<UpdateProjectModal />
		</>
	);
}
