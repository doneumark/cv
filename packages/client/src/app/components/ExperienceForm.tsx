import { Experience } from '@cv/api/interface';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import * as api from '../services/api';
import Button from './Button';
import Input from './Input';
import Label from './Label';
import StartsAtEndsAtInput from './StartsAtEndsAtInput';
import OutlineSaveIcon from '../icons/OutlineSaveIcon';

export interface ExperienceFormProps {
	experience?: Experience | null;
	onSave?: (experience: Experience) => void;
	onDelete?: (experience: Experience) => void;
	onCancel: () => void;
}

export default function ExperienceForm({
	experience, onSave, onCancel, onDelete,
}: ExperienceFormProps) {
	const {
		register,
		handleSubmit,
		formState: { isDirty },
		reset,
		control,
	} = useForm({
		defaultValues: experience || {},
	});
	const queryClient = useQueryClient();

	const save = async (data: Experience) => {
		try {
			let savedExperience;
			if (!experience) {
				savedExperience = await api.createExperience(data);
				queryClient.invalidateQueries(['experiences', 'userCounts']);
			} else {
				savedExperience = await api.updateExperience(experience.id, data);
				queryClient.invalidateQueries(['experiences']);
			}

			if (onSave) {
				onSave(savedExperience);
			}

			reset(data);
		} catch (err) {
			alert(err);
		}
	};

	const onClickDelete = async () => {
		if (!experience) {
			return;
		}

		try {
			await api.deleteExperience(experience.id);
			if (onDelete) {
				onDelete(experience);
			}

			reset();
		} catch (err) {
			alert(err);
		}
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
					{ experience && <Button color='secondary' type='button' onClick={onClickDelete}>Delete</Button> }
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
