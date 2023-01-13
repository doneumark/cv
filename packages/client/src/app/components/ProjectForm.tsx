import { Project } from '@cv/api/interface';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import OutlineSaveIcon from '../icons/OutlineSaveIcon';
import * as api from '../services/api';
import Button from './Button';
import Input from './Input';
import Label from './Label';
import StartsAtEndsAtInput from './StartsAtEndsAtInput';

export interface ProjectFormProps {
	project?: Project | null;
	onSave?: (project: Project) => void;
	onDelete?: (project: Project) => void;
	onCancel: () => void;
}

export default function ProjectForm({
	project, onSave, onCancel, onDelete,
}: ProjectFormProps) {
	const {
		register,
		handleSubmit,
		formState: { isDirty },
		reset,
		control,
	} = useForm({
		defaultValues: project || {},
	});
	const queryClient = useQueryClient();

	const save = handleSubmit(async (data) => {
		try {
			let savedProject: Project;
			if (!project) {
				savedProject = await api.createProject(data);
				queryClient.invalidateQueries(['projects', 'userCounts']);
			} else {
				savedProject = await api.updateProject(project.id, data);
				queryClient.invalidateQueries('projects');
			}

			if (onSave) {
				onSave(savedProject);
			}

			reset(data);
		} catch (err) {
			alert(err);
		}
	});

	const onClickDelete = async () => {
		if (!project) {
			return;
		}

		try {
			await api.deleteProject(project.id);
			if (onDelete) {
				onDelete(project);
			}

			reset();
		} catch (err) {
			alert(err);
		}
	};

	return (
		<form onSubmit={save} className='space-y-6'>
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
					{ project && <Button color='secondary' type='button' onClick={onClickDelete}>Delete</Button> }
				</div>
				<div className='flex gap-2'>
					<Button outline color='secondary' type='button' onClick={onCancel}>
						Cancel
					</Button>
					<Button className='gap-2' color='secondary' type='submit' disabled={!isDirty}>
						<OutlineSaveIcon />
						Save
					</Button>
				</div>
			</div>
		</form>
	);
}
