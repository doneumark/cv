import { useForm } from 'react-hook-form';
import { User } from '@cv/api/interface';
import { useEffect } from 'react';
import * as api from '../../services/api';

import Button from '../Button';
import Input from '../Input';
import Label from '../Label';
import OutlineSaveIcon from '../../icons/OutlineSaveIcon';
import { useToast } from '../../services/toasts';

interface UserFormProps {
	user?: User,
}

export default function UserForm({ user }: UserFormProps) {
	const {
		register,
		handleSubmit,
		formState: { isDirty, isSubmitting },
		reset,
	} = useForm({ defaultValues: user });
	const { addToast } = useToast();

	useEffect(() => reset(user), [user, reset]);

	const update = async (data: User) => {
		try {
			await api.updateUser(data);
			addToast({ message: 'User updated successfully', type: 'success' });
			reset(data);
		} catch {
			addToast({ message: 'User failed to update', type: 'error' });
		}
	};

	return (
		<form onSubmit={handleSubmit(update)} className='space-y-6'>
			<div className='grid grid-cols-6 gap-6'>
				<div className='form-control col-span-6 sm:col-span-3'>
					<Label text='Email' />
					<Input type='email' placeholder='user@company.com' {...register('email')} />
				</div>
				<div className='form-control col-span-6 sm:col-span-3'>
					<Label text='Password' />
					<Input type='password' placeholder='password' {...register('password')} />
				</div>
				<div className='form-control col-span-12 sm:col-span-6'>
					<Label text='Full Name' />
					<Input type='text' placeholder='john doe' {...register('fullName')} />
				</div>
			</div>
			<div className='flex justify-end space-x-3'>

				<Button className='gap-2' loading={isSubmitting} color='secondary' type='submit' disabled={!isDirty}>
					{ !isSubmitting && <OutlineSaveIcon /> }
					Save
				</Button>
			</div>
		</form>
	);
}
