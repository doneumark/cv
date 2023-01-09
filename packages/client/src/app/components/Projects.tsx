import { Project } from '@cv/api/interface';
import Table from './Table';
import { parseLinkedinDate } from '../utils';

interface ProjectsProps {
	projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
	return (
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
				{ projects.map((project) => (
					<tr>
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
	);
}
