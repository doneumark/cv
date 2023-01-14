import { useForm } from 'react-hook-form';
import { Profile } from '@cv/api/interface';
import { useEffect } from 'react';
import * as api from '../../services/api';

import Button from '../Button';
import Input from '../Input';
import Label from '../Label';
import OutlineSaveIcon from '../../icons/OutlineSaveIcon';
import { useToast } from '../../services/toasts';

interface ProfileFormProps {
	profile?: Profile,
}

export default function ProfileForm({ profile }: ProfileFormProps) {
	const {
		register,
		handleSubmit,
		formState: { isDirty, isSubmitting },
		reset,
	} = useForm({ defaultValues: profile });

	const { addToast } = useToast();

	useEffect(() => reset(profile), [profile, reset]);

	const update = async (data: Profile) => {
		try {
			await api.updateProfile(data);
			addToast({ message: 'Profile updated successfully', type: 'success' });
			reset(data);
		} catch {
			addToast({ message: 'Profile failed to update', type: 'error' });
		}
	};

	return (
		<form onSubmit={handleSubmit(update)} className='space-y-6'>
			<div className='grid grid-cols-6 gap-6'>
				<div className='form-control col-span-6 sm:col-span-3'>
					<Label text='Headline' />
					<Input type='text' placeholder='exmp1' {...register('headline')} />
				</div>
				<div className='form-control col-span-6 sm:col-span-3'>
					<Label text='Occupation' />
					<Input type='text' placeholder='exmp2' {...register('occupation')} />
				</div>
				<div className='form-control col-span-12 sm:col-span-6'>
					<Label text='Summary' />
					<textarea
						className='textarea textarea-bordered block'
						rows={2}
						placeholder='exmp3'
						{...register('summary')}
					/>
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
