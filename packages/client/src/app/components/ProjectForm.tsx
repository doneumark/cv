import { Project } from '@cv/api/interface';
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

export interface ProjectFormProps {
	project?: Project;
	onClose: () => void;
}

export default function ProjectForm({ project, onClose }: ProjectFormProps) {
	const {
		register,
		handleSubmit,
		formState: { isDirty, isSubmitting },
		reset,
		control,
	} = useForm({ defaultValues: project });

	const queryClient = useQueryClient();
	const { addToast } = useToast();
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => reset(project), [project, reset]);

	const save = async (data: Project) => {
		try {
			if (!project) {
				await api.createProject(data);
				queryClient.invalidateQueries(['projects']);
				queryClient.invalidateQueries(['userCounts']);
				addToast({ message: 'Project created successfully', type: 'success' });
			} else {
				await api.updateProject(project.id, data);
				queryClient.invalidateQueries(['projects']);
				addToast({ message: 'Project updated successfully', type: 'success' });
			}

			if (onClose) {
				onClose();
			}

			reset(data);
		} catch {
			addToast({ message: 'Project save failed', type: 'error' });
		}
	};

	const onClickDelete = async () => {
		if (!project) {
			return;
		}

		setIsDeleting(true);

		try {
			await api.deleteProject(project.id);
			queryClient.invalidateQueries(['projects']);
			queryClient.invalidateQueries(['userCounts']);
			addToast({ message: 'Project deleted successfully', type: 'success' });

			if (onClose) {
				onClose();
			}

			reset();
		} catch (err) {
			addToast({ message: 'Project delete failed', type: 'error' });
		}

		setIsDeleting(false);
	};

	return (
		<form onSubmit={handleSubmit(save)} className='space-y-6'>
			<div className='form-control'>
				<Label text='Title' />
				<Input type='text' placeholder='Project Title' {...register('title')} />
			</div>
			<StartsAtEndsAtInput control={control} />
			<div className='form-control'>
				<Label text='Description' />
				<textarea
					className='textarea textarea-bordered block'
					rows={2}
					placeholder='exmp3'
					{...register('description')}
				/>
			</div>
			<div className='flex justify-between gap-2'>
				<div>
					{ project && <Button color='secondary' type='button' onClick={onClickDelete} loading={isDeleting}>Delete</Button> }
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
