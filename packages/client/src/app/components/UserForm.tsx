import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User } from '@cv/api/interface';
import axios from 'axios';

import Button from './Button';
import Input from './Input';

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

interface UserFormProps {
	user: User,
	refetch: () => void,
}

export default function UserForm({ user, refetch }: UserFormProps) {
	const [isSyncingLinkedin, setIsSyncingLinkedin] = useState(false);

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

	return (
		<form onSubmit={updateUser} className='space-y-6'>
			<div className='form-control'>
				<label className='label pt-0'>
					<span className='label-text'>Linkedin Username</span>
				</label>
				<div className='input-group'>
					<Input type='linkedinUsername' placeholder='johndoe12' className='flex-1' {...register('linkedinUsername')} />
					<Button loading={isSyncingLinkedin} color='secondary' onClick={syncLinkedin} disabled={isDirty || !user.linkedinUsername}>Sync</Button>
					{ errors.linkedinUsername && <p className='text-red-500'>{ `${errors.linkedinUsername.message}` }</p> }
				</div>
			</div>
			<div className='form-control'>
				<label className='label pt-0'>
					<span className='label-text'>Full Name</span>
				</label>
				<Input type='text' placeholder='John Doe' {...register('fullName')} />
			</div>
			<div className='form-control'>
				<label className='label pt-0'>
					<span className='label-text'>Email</span>
				</label>
				<Input type='email' placeholder='username@company.com' {...register('email')} />
			</div>
			<div className='form-control'>
				<label className='label pt-0'>
					<span className='label-text'>Headline</span>
				</label>
				<Input type='text' placeholder='exmp1' {...register('profile.headline')} />
			</div>
			<div className='form-control'>
				<label className='label pt-0'>
					<span className='label-text'>Occupation</span>
				</label>
				<Input type='text' placeholder='exmp2' {...register('profile.occupation')} />
			</div>
			<div className='form-control'>
				<label className='label pt-0'>
					<span className='label-text'>Summary</span>
				</label>
				<textarea
					className='textarea textarea-bordered block'
					rows={2}
					placeholder='exmp3'
					{...register('profile.summary')}
				/>
			</div>
			<div className='flex justify-end'>
				<Button color='primary' type='submit' disabled={!isDirty}>Save</Button>
			</div>
		</form>
	);
}
