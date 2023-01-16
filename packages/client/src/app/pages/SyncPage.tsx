import { useQuery, useQueryClient } from '@tanstack/react-query';
import { User } from '@cv/api/interface';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useEffect } from 'react';
import * as api from '../services/api';
import Button from '../components/Button';
import LoadingContainer from '../components/LoadingContainer';
import PageContent from '../components/PageContent';
import PageTitle from '../components/PageTitle';
import Label from '../components/Label';
import Input from '../components/Input';
import OutlineImportIcon from '../icons/OutlineImportIcon';
import { useToastsStore } from '../stores/ToastsStore';

interface SyncLinkedin {
	linkedinUsername: string | null;
}

interface SyncLinkedinFormProps {
	user?: User,
}

function SyncLinkedinForm({ user }: SyncLinkedinFormProps) {
	const defaultValues = { linkedinUsername: user?.linkedinUsername || null };
	const {
		register,
		handleSubmit,
		formState: { isSubmitting },
		reset,
	} = useForm({ defaultValues });
	const { addToast } = useToastsStore();

	const queryClient = useQueryClient();

	useEffect(() => reset(user), [user, reset]);

	const syncLinkedin = async (data: SyncLinkedin) => {
		try {
			await api.syncFromLinkedin(data.linkedinUsername);
			await queryClient.invalidateQueries(['userCounts']);
			addToast({ message: 'Synced from linkedin successfully', type: 'success' });
			reset(data);
		} catch (err) {
			if (axios.isAxiosError(err) && err.response) {
				addToast({ message: err.response.data, type: 'error' });
				return;
			}

			addToast({ message: 'Synced from linkedin failed', type: 'error' });
		}
	};

	return (
		<form onSubmit={handleSubmit(syncLinkedin)}>
			<div className='form-control col-span-12 sm:col-span-6'>
				<Label text='Linkedin' />
				<label className='input-group'>
					<Input
						type='text'
						placeholder='Linkedin username'
						className='flex-1'
						{...register('linkedinUsername')}
					/>
					<Button
						type='submit'
						className='gap-4'
						loading={isSubmitting}
						color='secondary'
					>
						{ !isSubmitting && <OutlineImportIcon /> }
						Sync
					</Button>
				</label>
			</div>
		</form>
	);
}

export default function SyncPage() {
	const {
		data: user, isInitialLoading,
	} = useQuery<User>({
		queryKey: ['user'],
		queryFn: api.getUser,
		refetchOnWindowFocus: false,
	});

	return (

		<>
			<PageTitle title='Sync' />
			<PageContent>
				<LoadingContainer height={200} isLoading={isInitialLoading}>
					<SyncLinkedinForm user={user} />
				</LoadingContainer>
			</PageContent>
		</>
	);
}
