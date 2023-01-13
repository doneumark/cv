import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User } from '@cv/api/interface';
import { useQueryClient } from 'react-query';
import * as api from '../services/api';

import Button from './Button';
import Input from './Input';

// const syncLinkedinToServer = async () => {
// 	try {
// 		await axios.post('/api/user/linkedin');
// 	} catch (err) {
// 		if (axios.isAxiosError(err) && err.response) {
// 			throw err.response.data;
// 		}

// 		throw err;
// 	}
// };

interface UserFormProps {
	user: User,
}

export default function UserForm({ user }: UserFormProps) {
	const queryClient = useQueryClient();

	const [isSyncingLinkedin, setIsSyncingLinkedin] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty, isSubmitting },
		reset,
	} = useForm({
		defaultValues: user,
	});

	useEffect(() => {
		reset(user);
	}, [user, reset]);

	const updateUser = handleSubmit(async (data) => {
		try {
			await api.updateUser(data);
			reset(data);
		} catch (err) {
			alert(err);
		}
	});

	const syncLinkedin = useCallback(async () => {
		setIsSyncingLinkedin(true);
		// await syncLinkedinToServer();
		await queryClient.invalidateQueries({ queryKey: ['userCounts'] });
		setIsSyncingLinkedin(false);
	}, [queryClient]);

	return (
		<form onSubmit={updateUser} className='space-y-6'>
			<div className='grid grid-cols-6 gap-6'>
				<div className='form-control col-span-6 sm:col-span-3'>
					<label className='label pt-0 pb-2'>
						<span className='label-text'>Email</span>
					</label>
					<Input type='email' placeholder='user@company.com' {...register('email')} />
				</div>
				<div className='form-control col-span-6 sm:col-span-3'>
					<label className='label pt-0 pb-2'>
						<span className='label-text'>Password</span>
					</label>
					<Input type='password' placeholder='exmp2' {...register('password')} />
				</div>
				<div className='form-control col-span-12 sm:col-span-6'>
					<label className='label pt-0 pb-2'>
						<span className='label-text'>Full Name</span>
					</label>
					<Input type='text' placeholder='john doe' {...register('fullName')} />
				</div>
				<div className='form-control col-span-12 sm:col-span-6'>
					<label className='label pt-0 pb-2'>
						<span className='label-text'>Linkedin Username</span>
					</label>
					<div>
						<Input type='text' placeholder='johndoe12' className='flex-1 w-full' {...register('linkedinUsername')} />
						{ errors.linkedinUsername && <p className='text-red-500'>{ `${errors.linkedinUsername.message}` }</p> }
					</div>
				</div>
			</div>
			<div className='flex justify-end space-x-3'>
				<Button className='gap-2' loading={isSyncingLinkedin} color='secondary' onClick={syncLinkedin} disabled={isDirty || !user.linkedinUsername}>
					{ !isSyncingLinkedin && (
						<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
							<path strokeLinecap='round' strokeLinejoin='round' d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3' />
						</svg>
					) }
					Sync from Linkedin
				</Button>
				<Button className='gap-2' loading={isSubmitting} color='secondary' type='submit' disabled={!isDirty}>
					{ !isSubmitting && (
						<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
							<path strokeLinecap='round' strokeLinejoin='round' d='M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9' />
						</svg>
					) }
					Save
				</Button>
			</div>
		</form>
	);
}
