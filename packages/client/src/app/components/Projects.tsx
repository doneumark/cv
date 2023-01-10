import { useState, useMemo } from 'react';
import { Project } from '@cv/api/interface';
import Table from './Table';
import Button from './Button';
import { parseLinkedinDate, filterByQuery } from '../utils';
import SearchInput from './SearchInput';
import Modal from './Modal';
import ProjectForm from './ProjectForm';

interface ProjectsProps {
	projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
	const [search, setSearch] = useState('');
	const [showAddProject, setShowAddProject] = useState(false);

	const filteredProjects = useMemo(
		() => filterByQuery(search, projects, ['description', 'title']),
		[projects, search],
	);

	return (
		<div className='space-y-6'>
			<div className='flex justify-between'>
				<SearchInput value={search} onChange={(e) => setSearch(e.target.value)} />
				<Button color='secondary' type='submit' className='gap-2' onClick={() => setShowAddProject(true)}>
					<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
						<path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
					</svg>
					Add Project
				</Button>
				<Modal show={showAddProject} onClose={() => setShowAddProject(false)}>
					<ProjectForm project={null} />
				</Modal>
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
								{ parseLinkedinDate(
									project.startsAtDay,
									project.startsAtMonth,
									project.startsAtYear,
								) }
							</td>
							<td>
								{ parseLinkedinDate(
									project.endsAtDay,
									project.endsAtMonth,
									project.endsAtYear,
								) }
							</td>
							<td>{ project.title }</td>
							<td>{ project.description }</td>
						</tr>
					)) }
				</tbody>
			</Table>
		</div>
	);
}
