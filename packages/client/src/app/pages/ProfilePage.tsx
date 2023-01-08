import { useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { User } from '@cv/api/interface';
import Button from '../components/Button';
import Table from '../components/Table';
import Input from '../components/Input';

const parseLinkedinDate = (day: number | null, month: number | null, year: number | null) => {
	if (day === null || month === null || year === null) {
		return '';
	}

	return `${day}/${month}/${year}`;
};

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
	} = useQuery<User>(
		'user',
		async () => {
			try {
				const resUser = await axios.get<User>('/api/user', { withCredentials: true });
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

	if (isLoading || !user) {
		return <h1>Loading...</h1>;
	}

	const {
		educations, experiences, fullName, email,
		profile,
		projects, volunteerWorks,
	} = user;

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
							<Input type='linkedinUsername' placeholder='linkedin username' className='input input-bordered w-full max-w-xs' {...register('linkedinUsername')} />
							{ errors.linkedinUsername && <p className='text-red-500'>{ `${errors.linkedinUsername.message}` }</p> }
						</div>
						<Button type='button' color='primary' onClick={syncLinkedin}>Sync</Button>
						{ isSyncingLinkedin && <h1>Loading...</h1> }
					</div>
				</div>
				<div>
					{/* <div className='stats shadow'>
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
					</div> */}
					<div className='div'>
						<div className='title'>Updated</div>
						<div className='desc'>{ email }</div>
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
										<td>
											{ parseLinkedinDate(
												project.startsAtDay,
												project.startsAtMonth,
												project.startsAtYear,
											) }
										</td>
										<td>
											{ parseLinkedinDate(
												project.endsAtDay,
												project.endsAtMonth,
												project.endsAtYear,
											) }
										</td>
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
					</div>
				</div>
			</form>
		</>
	);
}

export default ProfilePage;
