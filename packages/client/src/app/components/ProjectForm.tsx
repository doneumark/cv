import { Project } from '@cv/api/interface';
import { useForm } from 'react-hook-form';
import axios, { AxiosResponse } from 'axios';
import Button from './Button';
import Input from './Input';

export interface ProjectFormProps {
	project?: Project | null;
	onCreate?: (project: Project) => void;
	onUpdate?: (project: Project) => void;
	onDelete?: (project: Project) => void;
	onCancel: () => void;
}

export default function ProjectForm({
	project, onCreate, onUpdate, onCancel, onDelete,
}: ProjectFormProps) {
	const {
		register,
		handleSubmit,
		formState: { isDirty },
		reset,
	} = useForm({
		defaultValues: project || {},
	});

	const save = handleSubmit(async (data) => {
		try {
			let axiosRes: AxiosResponse<Project>;
			if (!project) {
				axiosRes = await axios.post<Project>('/api/projects', data, { withCredentials: true });

				if (onCreate) {
					onCreate(axiosRes.data);
				}
			} else {
				axiosRes = await axios.put<Project>(`/api/projects/${project.id}`, data, { withCredentials: true });

				if (onUpdate) {
					onUpdate(axiosRes.data);
				}
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
			await axios.delete<Project>(`/api/projects/${project.id}`, { withCredentials: true });
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
			<div className='prose'>
				<h3>{ project ? 'Update Project' : 'Add Project'}</h3>
			</div>
			<div className='form-control'>
				<label className='label pt-0 pb-2'>
					<span className='label-text'>Title</span>
				</label>
				<Input type='text' placeholder='Project Title' {...register('title')} />
			</div>
			<div className='grid grid-cols-6 gap-6'>
				<div className='col-span-6 sm:col-span-3'>
					<div className='form-control'>
						<label className='label'>
							<span className='label-text'>Enter amount</span>
						</label>
						<label className='input-group'>
							<input type='number' min='1' max='31' placeholder='00' className='input input-bordered block w-20' />
							<span>/</span>
							<input type='number' min='1' max='12' placeholder='00' className='input input-bordered block w-20' />
							<span>/</span>
							<input type='number' min='1900' max='2030' placeholder='0000' className='input input-bordered block w-32' />
						</label>
					</div>
				</div>
				<div className='col-span-6 sm:col-span-3'>
					<div className='form-control'>
						<label className='label'>
							<span className='label-text'>Enter amount</span>
						</label>
						<label className='input-group'>
							<input type='number' placeholder='--' className='input input-bordered block w-16' />
							<span>/</span>
							<input type='number' placeholder='--' className='input input-bordered block w-16' />
							<span>/</span>
							<input type='number' placeholder='----' className='input input-bordered block w-32' />
						</label>
					</div>
				</div>
			</div>
			<div className='form-control'>
				<label className='label pt-0 pb-2'>
					<span className='label-text'>Description</span>
				</label>
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
						<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
							<path strokeLinecap='round' strokeLinejoin='round' d='M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9' />
						</svg>
						Save
					</Button>
				</div>
			</div>
		</form>
	);
}
