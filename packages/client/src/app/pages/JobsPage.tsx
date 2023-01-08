import { Job } from '@cv/api/interface';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import Button from '../components/Button';
import Input from '../components/Input';

interface JobProps {
	job: Job;
}

function JobForm({ job }: JobProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
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
		<form onSubmit={updateJob}>
			<Input type='text' placeholder='linkedin username' className='input input-bordered w-full max-w-xs' {...register('title')} />
			<textarea
				className='textarea textarea-bordered w-10/12 block mb-4'
				rows={10}
				placeholder='Jop description'
			/>
			<Button color='primary' type='submit'>Save</Button>
		</form>
	);
}

export function JobsPage() {
	const {
		data: jobs, isLoading,
	} = useQuery<Job[]>(
		'user',
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

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm({
		defaultValues: jobs,
	});

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
