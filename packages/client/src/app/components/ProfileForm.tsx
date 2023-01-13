import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Profile } from '@cv/api/interface';
import * as api from '../services/api';

import Button from './Button';
import Input from './Input';

interface ProfileFormProps {
	profile: Profile,
}

export default function ProfileForm({ profile }: ProfileFormProps) {
	const {
		register,
		handleSubmit,
		formState: { isDirty, isSubmitting },
		reset,
	} = useForm({
		defaultValues: profile,
	});

	useEffect(() => {
		if (!profile) {
			return;
		}

		reset(profile);
	}, [profile, reset]);

	const updateProfile = async (data: Profile) => {
		await api.updateProfile(data);
		reset(data);
	};

	return (
		<form onSubmit={handleSubmit(updateProfile)} className='space-y-6'>
			<div className='grid grid-cols-6 gap-6'>
				<div className='form-control col-span-6 sm:col-span-3'>
					<label className='label pt-0 pb-2'>
						<span className='label-text'>Headline</span>
					</label>
					<Input type='text' placeholder='exmp1' {...register('headline')} />
				</div>
				<div className='form-control col-span-6 sm:col-span-3'>
					<label className='label pt-0 pb-2'>
						<span className='label-text'>Occupation</span>
					</label>
					<Input type='text' placeholder='exmp2' {...register('occupation')} />
				</div>
				<div className='form-control col-span-12 sm:col-span-6'>
					<label className='label pt-0 pb-2'>
						<span className='label-text'>Summary</span>
					</label>
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
