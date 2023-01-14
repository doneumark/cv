import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as api from '../services/api';
import Button from '../components/Button';
import { filterByQuery } from '../services/misc';
import SearchInput from '../components/SearchInput';
import Modal from '../components/Modal';
import JobForm from '../components/job/JobForm';
import PageContent from '../components/PageContent';
import PageTitle from '../components/PageTitle';
import PlusIcon from '../icons/PlusIcon';
import LoadingContainer from '../components/LoadingContainer';
import { useFormRoute } from '../services/routes';
import BoxLink from '../components/BoxLinkContainer';
import JobBox from '../components/job/JobBox';

function CreateJobModal() {
	const { isCreatePath, rootPath: jobsPath } = useFormRoute();
	const navigate = useNavigate();

	return (
		<Modal show={isCreatePath} onClose={() => navigate(jobsPath)}>
			<div className='prose mb-6'>
				<h3>Create Job</h3>
			</div>
			<JobForm onClose={() => navigate(jobsPath)} />
		</Modal>
	);
}

function UpdateJobModal() {
	const { isUpdatePath, pathParam: jobId, rootPath: jobsPath } = useFormRoute();
	const navigate = useNavigate();

	const { data: job, isInitialLoading } = useQuery({
		queryKey: ['job', jobId],
		queryFn: () => (jobId ? api.getJob(jobId) : null),
		enabled: isUpdatePath,
		refetchOnWindowFocus: false,
	});

	return (
		<Modal show={isUpdatePath} onClose={() => navigate(jobsPath)}>
			<div className='prose mb-6'>
				<h3>Update Job</h3>
			</div>
			<LoadingContainer height={400} isLoading={isInitialLoading}>
				<JobForm
					job={job || undefined}
					onClose={() => navigate(jobsPath)}
				/>
			</LoadingContainer>
		</Modal>
	);
}

function Jobs() {
	const navigate = useNavigate();
	const [search, setSearch] = useState('');
	const {
		data: jobs, isInitialLoading, isSuccess, error,
	} = useQuery({
		queryKey: ['jobs'],
		queryFn: api.getJobs,
	});

	const filteredJobs = useMemo(
		() => filterByQuery(search, jobs || [], ['description', 'title']),
		[jobs, search],
	);

	return (
		<LoadingContainer height={200} isLoading={isInitialLoading}>
			<div className='space-y-6'>
				<div className='flex justify-between'>
					<SearchInput value={search} onChange={(e) => setSearch(e.target.value)} />
					<Button size='sm' color='secondary' type='submit' className='gap-2' onClick={() => navigate('new')}>
						<PlusIcon />
						Add Job
					</Button>
				</div>
				{
					isSuccess && (
						filteredJobs.length > 0
							? (
								<div className='space-y-3'>
									{ filteredJobs.map((job) => (
										<BoxLink to={job.id} key={`job-box-${job.id}`}>
											<JobBox job={job} />
										</BoxLink>
									)) }
								</div>
							)
							: (
								<div className='text-center'>
									No jobs added yet
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

export default function JobsPage() {
	return (
		<>
			<PageTitle title='Jobs' />
			<PageContent>
				<Jobs />
			</PageContent>
			<CreateJobModal />
			<UpdateJobModal />
		</>
	);
}
