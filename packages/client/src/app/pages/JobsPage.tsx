import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Job } from '@cv/api/interface';
import * as api from '../services/api';
import Button from '../components/Button';
import { filterByQuery } from '../services/misc';
import SearchInput from '../components/SearchInput';
import Modal from '../components/Modal';
import JobForm from '../components/JobForm';
import PageContent from '../components/PageContent';
import PageTitle from '../components/PageTitle';
import PlusIcon from '../icons/PlusIcon';
import PencilIcon from '../icons/PencilIcon';
import LoadingContainer from '../components/LoadingContainer';
import { useFormRoute } from '../services/routes';

interface JobBoxProps {
	job: Job;
}

function JobBox({ job }: JobBoxProps) {
	return (
		<Link className='card card-bordered border-base-300 card-compact hover:shadow-md cursor-pointer flex items-between group' to={job.id}>
			<div className='card-body flex-row items-center justify-between'>
				<div>
					<div className='flex items-center gap-3'>
						<div className='card-title'>
							{ job.title }
						</div>
					</div>
					<div className='flex items-center gap-3'>
						{ `${job.description}` }
					</div>
				</div>
				<div className='hidden group-hover:block'>
					<PencilIcon />
				</div>
			</div>
		</Link>
	);
}

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

	const { data: job, isLoading } = useQuery({
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
			<LoadingContainer height={400} isLoading={isLoading}>
				<JobForm
					job={job || undefined}
					onClose={() => navigate(jobsPath)}
				/>
			</LoadingContainer>
		</Modal>
	);
}

export default function Jobs() {
	const navigate = useNavigate();
	const [search, setSearch] = useState('');
	const { data: jobs, isLoading } = useQuery({
		queryKey: ['jobs'],
		queryFn: api.getJobs,
	});

	const filteredJobs = useMemo(
		() => filterByQuery(search, jobs || [], ['description', 'title']),
		[jobs, search],
	);

	return (
		<>
			<PageTitle title='Jobs' />
			<PageContent>
				<LoadingContainer height={200} isLoading={isLoading}>
					<div className='space-y-6'>
						<div className='flex justify-between'>
							<SearchInput value={search} onChange={(e) => setSearch(e.target.value)} />
							<Button size='sm' color='secondary' type='submit' className='gap-2' onClick={() => navigate('new')}>
								<PlusIcon />
								Add Job
							</Button>
						</div>

						<div className='space-y-3'>
							{ filteredJobs.map((job) => (
								<JobBox job={job} key={`job-box-${job.id}`} />
							)) }
							{ !filteredJobs.length && (
								<div className='text-center'>
									No jobs added yet
								</div>
							)}
						</div>
					</div>
				</LoadingContainer>
			</PageContent>
			<CreateJobModal />
			<UpdateJobModal />
		</>
	);
}
