import { Experience } from '@cv/api/interface';
import Table from './Table';
import { parseLinkedinDate } from '../utils';

interface ExperiencesProps {
	experiences: Experience[];
}

export default function Experiences({ experiences }: ExperiencesProps) {
	return (
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
				{ experiences.map((experience) => (
					<tr>
						<td>
							{ parseLinkedinDate(
								experience.startsAtDay,
								experience.startsAtMonth,
								experience.startsAtYear,
							) }
						</td>
						<td>
							{ parseLinkedinDate(
								experience.endsAtDay,
								experience.endsAtMonth,
								experience.endsAtYear,
							) }
						</td>
						<td>{ experience.company }</td>
						<td>{ experience.title }</td>
						<td>{ experience.description }</td>
					</tr>
				)) }
			</tbody>
		</Table>
	);
}
