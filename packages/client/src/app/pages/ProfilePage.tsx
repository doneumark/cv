import { useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import Button from '../components/Button';
import Table from '../components/Table';

const parseLinkedinDate = (linkedinDate) => {
	if (!linkedinDate) {
		return null;
	}

	const { day, month, year } = linkedinDate;
	return `${day}/${month}/${year}`;
};

function User({ data }) {
	if (!data) {
		return null;
	}

	const {
		educations, email, experiences, fullName,
		id, linkedinUsername, profile,
		projects, updatedAt, volunteerWorks,
	} = data;

	return (
		<div>
			<div className='stats shadow'>
				<div className='stat'>
					<div className='stat-title'>Name</div>
					<div className='stat-value text-primary'>{ fullName }</div>
				</div>
				<div className='stat'>
					<div className='stat-title'>Headline</div>
					<div className='stat-value text-secondary'>{ profile.headline }</div>
				</div>
				<div className='stat'>
					<div className='stat-title'>Occupation</div>
					<div className='stat-value'>{ profile.occupation }</div>
				</div>
				<div className='stat'>
					<div className='stat-title'>Summary</div>
					<div className='stat-value'>{ profile.occupation }</div>
				</div>
			</div>
			<div className='prose'>
				<h5>Experiences</h5>
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
								<td>{ parseLinkedinDate(experience.startsAt) }</td>
								<td>{ parseLinkedinDate(experience.endsAt) }</td>
								<td>{ experience.company }</td>
								<td>{ experience.title }</td>
								<td>{ experience.description }</td>
							</tr>
						)) }
					</tbody>
				</Table>
				<h5>Education</h5>
				<Table>
					<thead>
						<tr>
							<th>From</th>
							<th>To</th>
							<th>Degree</th>
							<th>Field of Study</th>
							<th>Grade</th>
							<th>School</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						{ educations.map((education) => (
							<tr>
								<td>{ parseLinkedinDate(education.startsAt) }</td>
								<td>{ parseLinkedinDate(education.endsAt) }</td>
								<td>{ education.degreeName }</td>
								<td>{ education.field }</td>
								<td>{ education.grade }</td>
								<td>{ education.school }</td>
								<td>{ education.description }</td>
							</tr>
						)) }
					</tbody>
				</Table>
				<h5>Projects</h5>
				<Table>
					<thead>
						<tr>
							<th>From</th>
							<th>To</th>
							<th>Title</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						{ projects.map((project) => (
							<tr>
								<td>{ parseLinkedinDate(project.starts_at) }</td>
								<td>{ parseLinkedinDate(project.ends_at) }</td>
								<td>{ project.title }</td>
								<td>{ project.description }</td>
							</tr>
						)) }
					</tbody>
				</Table>
				<h5>Volunteers</h5>
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
						{ volunteers.map((volunteer) => (
							<tr>
								<td>{ parseLinkedinDate(volunteer.starts_at) }</td>
								<td>{ parseLinkedinDate(volunteer.ends_at) }</td>
								<td>{ volunteer.company }</td>
								<td>{ volunteer.title }</td>
								<td>{ volunteer.cause }</td>
								<td>{ volunteer.description }</td>
							</tr>
						)) }
					</tbody>
				</Table>
			</div>
		</div>
	);
}

const syncLinkedinToServer = async () => {
	try {
		const syncLinkedinRes = await axios.post('/api/linkedin');
		return syncLinkedinRes.data;
	} catch (err) {
		if (axios.isAxiosError(err) && err.response) {
			throw err.response.data;
		}

		throw err;
	}
};

export function ProfilePage() {
	const [isSyncingLinkedin, setIsSyncingLinkedin] = useState(false);
	const {
		data: user, isLoading, refetch, error,
	} = useQuery(
		'user',
		async () => {
			try {
				const resUser = await axios.get('/api/user', { withCredentials: true });
				return resUser.data;
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
		defaultValues: user,
	});

	const updateUser = handleSubmit(async (data) => {
		try {
			await axios.put('/api/user', data, { withCredentials: true });
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError('linkedinUsername', { message: String(err.response?.data) });
				return;
			}

			if (err instanceof Error) {
				setError('linkedinUsername', { message: err.message });
				return;
			}

			setError('linkedinUsername', { message: 'Unknown error' });
		}
	});

	const syncLinkedin = useCallback(async () => {
		setIsSyncingLinkedin(true);
		try {
			await syncLinkedinToServer();
			await refetch();
		} catch (err) {
			alert(err);
		}

		setIsSyncingLinkedin(false);
	}, [refetch]);

	if (isLoading) {
		return <h1>Loading...</h1>;
	}

	return (
		<>
			{ error }
			<form onSubmit={updateUser}>
				<Button type='submit'>Update</Button>
				<div className='form-control'>
					<div className='input-group'>
						<div className='form-control w-full max-w-xs'>
							<label className='label'>
								<span className='label-text'>Linkedin Username</span>
							</label>
							<input type='linkedinUsername' placeholder='linkedin username' className='input input-bordered w-full max-w-xs' {...register('linkedinUsername')} />
							{ errors.linkedinUsername && <p className='text-red-500'>{ `${errors.linkedinUsername.message}` }</p> }
						</div>
						<Button type='button' color='primary' onClick={syncLinkedin}>Sync</Button>
						{ isSyncingLinkedin && <h1>Loading...</h1> }
					</div>
				</div>
				<User data={user} />

			</form>
		</>
	);
}

export default ProfilePage;
