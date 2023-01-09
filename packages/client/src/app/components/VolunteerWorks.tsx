import { VolunteerWork } from '@cv/api/interface';
import Table from './Table';
import { parseLinkedinDate } from '../utils';

interface VolunteerWorksProps {
	volunteerWorks: VolunteerWork[];
}

export default function VolunteerWorks({ volunteerWorks }: VolunteerWorksProps) {
	return (
		<Table>
			<thead>
				<tr>
					<th>from</th>
					<th>to</th>
					<th>company</th>
					<th>title</th>
					<th>description</th>
				</tr>
			</thead>
			<tbody>
				{ volunteerWorks.map((volunteerWork) => (
					<tr>
						<td>
							{ parseLinkedinDate(
								volunteerWork.startsAtDay,
								volunteerWork.startsAtMonth,
								volunteerWork.startsAtYear,
							) }
						</td>
						<td>
							{ parseLinkedinDate(
								volunteerWork.endsAtDay,
								volunteerWork.endsAtMonth,
								volunteerWork.endsAtYear,
							) }
						</td>
						<td>{ volunteerWork.company }</td>
						<td>{ volunteerWork.title }</td>
						<td>{ volunteerWork.cause }</td>
						<td>{ volunteerWork.description }</td>
					</tr>
				)) }
			</tbody>
		</Table>
	);
}
