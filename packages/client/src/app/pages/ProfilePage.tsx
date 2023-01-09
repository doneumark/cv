import { useState, useCallback, useEffect } from 'react';
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
		const syncLinkedinRes = await axios.post('/api/user/linkedin');
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
		formState: { errors, isDirty },
		setError,
		reset,
	} = useForm({
		defaultValues: user,
	});

	useEffect(() => {
		reset(user);
	}, [user, reset]);

	const updateUser = handleSubmit(async (data) => {
		try {
			await axios.put('/api/user', data, { withCredentials: true });
			reset(data);
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
		educations, experiences,
		profile,
		projects, volunteerWorks,
	} = user;

	return (
		<>
			<h1>Profile</h1>
			{ error }
			<form onSubmit={updateUser}>
				<div className='form-control'>
					<label className='label'>
						<span className='label-text'>Linkedin Username</span>
					</label>
					<div className='input-group'>
						<Input type='linkedinUsername' placeholder='johndoe12' className='flex-1' {...register('linkedinUsername')} />
						<Button loading={isSyncingLinkedin} color='secondary' onClick={syncLinkedin} disabled={isDirty || !user.linkedinUsername}>Sync</Button>
						{ errors.linkedinUsername && <p className='text-red-500'>{ `${errors.linkedinUsername.message}` }</p> }
					</div>
				</div>
				<div className='form-control'>
					<label className='label'>
						<span className='label-text'>Full Name</span>
					</label>
					<Input type='text' placeholder='John Doe' {...register('fullName')} />
				</div>
				<div className='form-control'>
					<label className='label'>
						<span className='label-text'>Email</span>
					</label>
					<Input type='email' placeholder='username@company.com' {...register('email')} />
				</div>
				<div className='form-control'>
					<label className='label'>
						<span className='label-text'>Headline</span>
					</label>
					<Input type='text' placeholder='exmp1' {...register('profile.headline')} />
				</div>
				<div className='form-control'>
					<label className='label'>
						<span className='label-text'>Occupation</span>
					</label>
					<Input type='text' placeholder='exmp2' {...register('profile.occupation')} />
				</div>
				<div className='form-control'>
					<label className='label'>
						<span className='label-text'>Summary</span>
					</label>
					<textarea
						className='textarea textarea-bordered block'
						rows={2}
						placeholder='exmp3'
						{...register('profile.summary')}
					/>
				</div>
				<Button color='primary' type='submit' disabled={!isDirty}>Save</Button>
			</form>

			<h3 className='mb-0'>Experiences</h3>
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
			<h3 className='mb-0'>Education</h3>
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
			<h3 className='mb-0'>Projects</h3>
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
			<h3 className='mb-0'>Volunteers</h3>
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

		</>
	);
}

export default ProfilePage;
