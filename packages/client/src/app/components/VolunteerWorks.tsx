import { useState, useMemo } from 'react';
import { VolunteerWork } from '@cv/api/interface';
import Table from './Table';
import Button from './Button';

import { parseLinkedinDate, filterByQuery } from '../utils';

import SearchInput from './SearchInput';

interface VolunteerWorksProps {
	volunteerWorks: VolunteerWork[];
}

export default function VolunteerWorks({ volunteerWorks }: VolunteerWorksProps) {
	const [search, setSearch] = useState('');

	const filteredVolunteerWorks = useMemo(
		() => filterByQuery(search, volunteerWorks, ['description', 'title', 'cause', 'company']),
		[volunteerWorks, search],
	);
	return (
		<div className='space-y-4'>
			<div className='flex justify-between'>
				<SearchInput value={search} onChange={(e) => setSearch(e.target.value)} />
				<Button color='secondary' type='submit' className='gap-2'>
					<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
						<path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
					</svg>
					Add Volunteer Work
				</Button>
			</div>
			<Table>
				<thead>
					<tr>
						<th>from</th>
						<th>to</th>
						<th>company</th>
						<th>title</th>
						<th>cause</th>
						<th>description</th>
					</tr>
				</thead>
				<tbody>
					{ !filteredVolunteerWorks.length && (
						<tr>
							<td colSpan={6} className='text-center'>
								No volunteer works found
							</td>
						</tr>
					)}
					{ filteredVolunteerWorks.map((volunteerWork) => (
						<tr key={volunteerWork.id}>
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
		</div>
	);
}
