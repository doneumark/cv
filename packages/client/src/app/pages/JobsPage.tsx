import { Job } from '@cv/api/interface';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import Button from '../components/Button';
import Input from '../components/Input';
import PageTitle from '../components/PageTitle';
import PageContent from '../components/PageContent';

interface JobProps {
	job: Job;
}

function JobForm({ job }: JobProps) {
	const {
		register,
		handleSubmit,
		setError,
	} = useForm({
		defaultValues: job,
	});

	const updateJob = handleSubmit(async (data) => {
		try {
			await axios.put(`/api/jobs/${data.id}`, data, { withCredentials: true });
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError('title', { message: String(err.response?.data) });
				return;
			}

			if (err instanceof Error) {
				setError('title', { message: err.message });
				return;
			}

			setError('title', { message: 'Unknown error' });
		}
	});

	return (
		<>
			<PageTitle title='Jobs' />
			<PageContent>
				<form onSubmit={updateJob} className='space-y-6'>
					<div className='form-control'>
						<label className='label pt-0 pb-2'>
							<span className='label-text'>Title</span>
						</label>
						<Input type='text' placeholder='Job Title' {...register('title')} />
					</div>
					<div className='form-control'>
						<label className='label pt-0 pb-2'>
							<span className='label-text'>Description</span>
						</label>
						<textarea
							className='textarea textarea-bordered w-full block'
							rows={4}
							placeholder='Jop description'
							{...register('description')}
						/>
					</div>
					<Button color='primary' type='submit'>Save</Button>
					<Button color='secondary' type='submit'>Analyze</Button>
				</form>
			</PageContent>
		</>
	);
}

export function JobsPage() {
	const {
		data: jobs, isLoading,
	} = useQuery<Job[]>(
		'jobs',
		async () => {
			try {
				const resJobs = await axios.get<Job[]>('/api/jobs', { withCredentials: true });
				return resJobs.data;
			} catch (err) {
				if (axios.isAxiosError(err) && err.response) {
					throw err.response.data;
				}

				throw err;
			}
		},
	);

	if (isLoading || !jobs) {
		return <h1>Loading...</h1>;
	}

	return (
		<>
			{ jobs.map((job) => (
				<JobForm job={job} />
			)) }
		</>
	);
}

export default JobsPage;
