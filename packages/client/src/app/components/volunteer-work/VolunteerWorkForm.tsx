import { VolunteerWork } from '@cv/api/interface';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import * as api from '../../services/api';
import Button from '../Button';
import Input from '../Input';
import Label from '../Label';
import StartsAtEndsAtInput from '../StartsAtEndsAtInput';
import OutlineSaveIcon from '../../icons/OutlineSaveIcon';
import { useToast } from '../../services/toasts';

export interface VolunteerFormProps {
	volunteerWork?: VolunteerWork;
	onClose: () => void;
}

export default function VolunteerWorkForm({ volunteerWork, onClose }: VolunteerFormProps) {
	const {
		register,
		handleSubmit,
		formState: { isDirty, isSubmitting },
		reset,
		control,
	} = useForm({ defaultValues: volunteerWork });

	const queryClient = useQueryClient();
	const { addToast } = useToast();
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => reset(volunteerWork), [volunteerWork, reset]);

	const save = async (data: VolunteerWork) => {
		try {
			if (!volunteerWork) {
				await api.createVolunteerWork(data);
				queryClient.invalidateQueries(['volunteer-works']);
				queryClient.invalidateQueries(['userCounts']);
				addToast({ message: 'Volunteer created successfully', type: 'success' });
			} else {
				await api.updateVolunteerWork(volunteerWork.id, data);
				queryClient.invalidateQueries(['volunteer-works']);
				addToast({ message: 'Volunteer updated successfully', type: 'success' });
			}

			if (onClose) {
				onClose();
			}

			reset(data);
		} catch {
			addToast({ message: 'Volunteer save failed', type: 'error' });
		}
	};

	const onClickDelete = async () => {
		if (!volunteerWork) {
			return;
		}

		setIsDeleting(true);

		try {
			await api.deleteVolunteerWork(volunteerWork.id);
			queryClient.invalidateQueries(['volunteer-works']);
			queryClient.invalidateQueries(['userCounts']);
			addToast({ message: 'Volunteer deleted successfully', type: 'success' });

			if (onClose) {
				onClose();
			}

			reset();
		} catch (err) {
			addToast({ message: 'Volunteer delete failed', type: 'error' });
		}

		setIsDeleting(false);
	};

	return (
		<form onSubmit={handleSubmit(save)} className='space-y-6'>
			<div className='form-control'>
				<Label text='Organization' />
				<Input type='text' placeholder='School Name' {...register('company')} />
			</div>
			<div className='form-control'>
				<Label text='Role' />
				<Input type='text' placeholder='Degree Name' {...register('title')} />
			</div>
			<div className='form-control'>
				<Label text='Cause' />
				<Input type='text' placeholder='Field Name' {...register('cause')} />
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
					{ volunteerWork && <Button color='secondary' type='button' onClick={onClickDelete} loading={isDeleting}>Delete</Button> }
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
