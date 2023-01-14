import { Job } from '@cv/api/interface';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import * as api from '../services/api';
import Button from './Button';
import Input from './Input';
import Label from './Label';
import OutlineSaveIcon from '../icons/OutlineSaveIcon';
import { useToast } from '../services/toasts';

export interface JobFormProps {
	job?: Job;
	onClose: () => void;
}

export default function JobForm({ job, onClose }: JobFormProps) {
	const {
		register,
		handleSubmit,
		formState: { isDirty, isSubmitting },
		reset,
	} = useForm({ defaultValues: job });

	const queryClient = useQueryClient();
	const { addToast } = useToast();
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => reset(job), [job, reset]);

	const save = async (data: Job) => {
		try {
			if (!job) {
				await api.createJob(data);
				queryClient.invalidateQueries(['jobs']);
				queryClient.invalidateQueries(['userCounts']);
				addToast({ message: 'Job created successfully', type: 'success' });
			} else {
				await api.updateJob(job.id, data);
				queryClient.invalidateQueries(['jobs']);
				addToast({ message: 'Job updated successfully', type: 'success' });
			}

			if (onClose) {
				onClose();
			}

			reset(data);
		} catch {
			addToast({ message: 'Job save failed', type: 'error' });
		}
	};

	const onClickDelete = async () => {
		if (!job) {
			return;
		}

		setIsDeleting(true);

		try {
			await api.deleteJob(job.id);
			queryClient.invalidateQueries(['jobs']);
			queryClient.invalidateQueries(['userCounts']);
			addToast({ message: 'Job deleted successfully', type: 'success' });

			if (onClose) {
				onClose();
			}

			reset();
		} catch (err) {
			addToast({ message: 'Job delete failed', type: 'error' });
		}

		setIsDeleting(false);
	};

	return (
		<form onSubmit={handleSubmit(save)} className='space-y-6'>
			<div className='form-control'>
				<Label text='Title' />
				<Input type='text' placeholder='Job Title' {...register('title')} />
			</div>
			<div className='form-control'>
				<Label text='Description' />
				<textarea
					className='textarea textarea-bordered block'
					rows={8}
					placeholder='exmp3'
					{...register('description')}
				/>
			</div>
			<div className='flex justify-between gap-2'>
				<div>
					{ job && <Button color='secondary' type='button' onClick={onClickDelete} loading={isDeleting}>Delete</Button> }
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
