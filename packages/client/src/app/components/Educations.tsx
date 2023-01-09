import { useState, useMemo } from 'react';
import { Education } from '@cv/api/interface';
import Table from './Table';
import Button from './Button';

import { parseLinkedinDate, filterByQuery } from '../utils';

import SearchInput from './SearchInput';

interface EducationsProps {
	educations: Education[];
}

export default function Educations({ educations }: EducationsProps) {
	const [search, setSearch] = useState('');

	const filteredEducations = useMemo(
		() => filterByQuery(search, educations, ['description', 'school', 'degreeName', 'field']),
		[educations, search],
	);
	return (
		<div className='space-y-4'>
			<div className='flex justify-between'>
				<SearchInput value={search} onChange={(e) => setSearch(e.target.value)} />
				<Button color='secondary' type='submit' className='gap-2'>
					<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
						<path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
					</svg>
					Add Education
				</Button>
			</div>
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
					{ !filteredEducations.length && (
						<tr>
							<td colSpan={7} className='text-center'>
								No education found
							</td>
						</tr>
					)}
					{ filteredEducations.map((education) => (
						<tr key={education.id}>
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
		</div>
	);
}
