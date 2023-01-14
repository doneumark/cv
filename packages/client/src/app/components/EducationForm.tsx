import { Education } from '@cv/api/interface';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useEffect, useState } from 'react';
import * as api from '../services/api';
import Button from './Button';
import Input from './Input';
import Label from './Label';
import StartsAtEndsAtInput from './StartsAtEndsAtInput';
import OutlineSaveIcon from '../icons/OutlineSaveIcon';
import { useToast } from '../services/toasts';

export interface EducationFormProps {
	education?: Education;
	onClose: () => void;
}

export default function EducationForm({ education, onClose }: EducationFormProps) {
	const {
		register,
		handleSubmit,
		formState: { isDirty, isSubmitting },
		reset,
		control,
	} = useForm({ defaultValues: education });

	const queryClient = useQueryClient();
	const { addToast } = useToast();
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => reset(education), [education, reset]);

	const save = async (data: Education) => {
		try {
			if (!education) {
				await api.createEducation(data);
				queryClient.invalidateQueries(['educations']);
				queryClient.invalidateQueries(['userCounts']);
				addToast({ message: 'Education created successfully', type: 'success' });
			} else {
				await api.updateEducation(education.id, data);
				queryClient.invalidateQueries(['educations']);
				addToast({ message: 'Education updated successfully', type: 'success' });
			}

			if (onClose) {
				onClose();
			}

			reset(data);
		} catch {
			addToast({ message: 'Education save failed', type: 'error' });
		}
	};

	const onClickDelete = async () => {
		if (!education) {
			return;
		}

		setIsDeleting(true);

		try {
			await api.deleteEducation(education.id);
			queryClient.invalidateQueries(['educations']);
			queryClient.invalidateQueries(['userCounts']);
			addToast({ message: 'Education deleted successfully', type: 'success' });

			if (onClose) {
				onClose();
			}

			reset();
		} catch (err) {
			addToast({ message: 'Education delete failed', type: 'error' });
		}

		setIsDeleting(false);
	};

	return (
		<form onSubmit={handleSubmit(save)} className='space-y-6'>
			<div className='form-control'>
				<Label text='School' />
				<Input type='text' placeholder='School Name' {...register('school')} />
			</div>
			<div className='form-control'>
				<Label text='Degree' />
				<Input type='text' placeholder='Degree Name' {...register('degreeName')} />
			</div>
			<div className='form-control'>
				<Label text='Field of study' />
				<Input type='text' placeholder='Field Name' {...register('field')} />
			</div>
			<StartsAtEndsAtInput control={control} />
			<div className='form-control'>
				<Label text='Grade' />
				<Input
					type='number'
					min={0}
					max={100}
					placeholder='Grade'
					{...register('grade', {
						valueAsNumber: true,
					})}
				/>
			</div>
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
					{ education && <Button color='secondary' type='button' onClick={onClickDelete} loading={isDeleting}>Delete</Button> }
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
