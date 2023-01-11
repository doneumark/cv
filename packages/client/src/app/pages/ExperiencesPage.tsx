import { Experience } from '@cv/api/interface';
import { useState, useMemo } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import Table from '../components/Table';
import Button from '../components/Button';
import { parseLinkedinDate, filterByQuery } from '../utils';
import SearchInput from '../components/SearchInput';

export default function Experiences() {
	const [search, setSearch] = useState('');
	const {
		data: experiences, isLoading, error,
	} = useQuery({
		queryKey: ['experiences'],
		queryFn: async () => {
			try {
				const resUser = await axios.get<Experience[]>('/api/user/experiences', { withCredentials: true });
				return resUser.data;
			} catch (err) {
				if (axios.isAxiosError(err) && err.response) {
					throw err.response.data;
				}

				throw err;
			}
		},
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	});

	const filteredExperiences = useMemo(
		() => filterByQuery(search, experiences || [], ['company', 'description', 'title']),
		[experiences, search],
	);

	if (isLoading) {
		return <h1>Loading...</h1>;
	}

	if (error) {
		return <h1>ERROR</h1>;
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between'>
				<SearchInput value={search} onChange={(e) => setSearch(e.target.value)} />
				<Button color='secondary' type='submit' className='gap-2'>
					<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
						<path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
					</svg>
					Add Experience
				</Button>
			</div>
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
					{ !filteredExperiences.length && (
						<tr>
							<td colSpan={5} className='text-center'>
								No experiences found
							</td>
						</tr>
					)}
					{ filteredExperiences.map((experience) => (
						<tr key={experience.id}>
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
		</div>
	);
}
