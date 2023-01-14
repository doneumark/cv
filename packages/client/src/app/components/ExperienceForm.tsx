import { Experience } from '@cv/api/interface';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import * as api from '../services/api';
import Button from './Button';
import Input from './Input';
import Label from './Label';
import StartsAtEndsAtInput from './StartsAtEndsAtInput';
import OutlineSaveIcon from '../icons/OutlineSaveIcon';
import { useToast } from '../services/toasts';

export interface ExperienceFormProps {
	experience?: Experience;
	onClose: () => void;
}

export default function ExperienceForm({ experience, onClose }: ExperienceFormProps) {
	const {
		register,
		handleSubmit,
		formState: { isDirty, isSubmitting },
		reset,
		control,
	} = useForm({ defaultValues: experience });

	const queryClient = useQueryClient();
	const { addToast } = useToast();
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => reset(experience), [experience, reset]);

	const save = async (data: Experience) => {
		try {
			if (!experience) {
				await api.createExperience(data);
				queryClient.invalidateQueries(['experiences']);
				queryClient.invalidateQueries(['userCounts']);
				addToast({ message: 'Experience created successfully', type: 'success' });
			} else {
				await api.updateExperience(experience.id, data);
				queryClient.invalidateQueries(['experiences']);
				addToast({ message: 'Experience updated successfully', type: 'success' });
			}

			if (onClose) {
				onClose();
			}

			reset(data);
		} catch {
			addToast({ message: 'Experience save failed', type: 'error' });
		}
	};

	const onClickDelete = async () => {
		if (!experience) {
			return;
		}

		setIsDeleting(true);

		try {
			await api.deleteExperience(experience.id);
			queryClient.invalidateQueries(['experiences']);
			queryClient.invalidateQueries(['userCounts']);
			addToast({ message: 'Experience deleted successfully', type: 'success' });

			if (onClose) {
				onClose();
			}

			reset();
		} catch (err) {
			addToast({ message: 'Experience delete failed', type: 'error' });
		}

		setIsDeleting(false);
	};

	return (
		<form onSubmit={handleSubmit(save)} className='space-y-6'>
			<div className='form-control'>
				<Label text='Title' />
				<Input type='text' placeholder='Experience Title' {...register('title')} />
			</div>
			<div className='form-control'>
				<Label text='Company' />
				<Input type='text' placeholder='Experience Title' {...register('company')} />
			</div>
			<StartsAtEndsAtInput control={control} />
			<div className='form-control'>
				<Label text='Description' />
				<textarea
					className='textarea textarea-bordered block'
					rows={2}
					placeholder='Description'
					{...register('description')}
				/>
			</div>
			<div className='flex justify-between gap-2'>
				<div>
					{ experience && <Button color='secondary' type='button' onClick={onClickDelete} loading={isDeleting}>Delete</Button> }
				</div>
				<div className='flex gap-2'>
					<Button outline color='secondary' type='button' onClick={onClose}>
						Cancel
					</Button>
					<Button className='gap-2' loading={isSubmitting} color='secondary' type='submit' disabled={!isDirty}>
						{ !isSubmitting && <OutlineSaveIcon /> }
						Save
					</Button>
				</div>
			</div>
		</form>
	);
}
