import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { useUserStore } from '../stores/UserStore';

import * as api from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';
import PageTitle from '../components/PageTitle';
import PageContent from '../components/PageContent';

export default function LoginPage() {
	const { user, login } = useUserStore();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			email: '',
			password: '',
		},
	});

	if (user) {
		return <Navigate to='/' />;
	}

	const loginToApi = handleSubmit(async (data) => {
		try {
			const apiLoggedInUser = await api.login(data);
			login(apiLoggedInUser);
		} catch (err) {
			alert(err);
		}
	});

	return (
		<>
			<PageTitle title='Log in' />
			<PageContent>
				<form onSubmit={loginToApi} className='space-y-6'>
					{ errors.email && (
						<label className='label'>
							<span className='label-text-alt'>{ errors.email.message }</span>
						</label>
					) }
					<div className='form-control'>
						<label className='label pt-0 pb-2'>
							<span className='label-text'>Email</span>
						</label>
						<Input type='email' placeholder='username@company.com' {...register('email')} />
					</div>
					<div className='form-control'>
						<label className='label pt-0 pb-2'>
							<span className='label-text'>Password</span>
						</label>
						<Input type='password' {...register('password')} />
					</div>
					<Button color='primary' type='submit' block>Send</Button>
				</form>
			</PageContent>
		</>
	);
}
