import { Education } from '@cv/api/interface';
import Table from './Table';
import { parseLinkedinDate } from '../utils';

interface EducationsProps {
	educations: Education[];
}

export default function Educations({ educations }: EducationsProps) {
	return (
		<Table>
			<thead>
				<tr>
					<th>From</th>
					<th>To</th>
					<th>School</th>
					<th>Degree</th>
					<th>Field of Study</th>
					<th>Grade</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				{ educations.map((education) => (
					<tr>
						<td>
							{ parseLinkedinDate(
								education.startsAtDay,
								education.startsAtMonth,
								education.startsAtYear,
							) }
						</td>
						<td>
							{ parseLinkedinDate(
								education.endsAtDay,
								education.endsAtMonth,
								education.endsAtYear,
							) }
						</td>
						<td>{ education.school }</td>
						<td>{ education.degreeName }</td>
						<td>{ education.field }</td>
						<td>{ education.grade }</td>
						<td>{ education.description }</td>
					</tr>
				)) }
			</tbody>
		</Table>
	);
}
