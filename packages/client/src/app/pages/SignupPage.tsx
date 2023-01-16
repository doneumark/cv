import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { User } from '@cv/api/interface';
import { useUserStore } from '../stores/UserStore';
import * as api from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';
import PageContent from '../components/PageContent';
import PageTitle from '../components/PageTitle';
import Label from '../components/Label';

export default function SignupPage() {
	const { user, login } = useUserStore();
	const {
		register,
		handleSubmit,
	} = useForm<User>();

	if (user) {
		return <Navigate to='/' />;
	}

	const signup = async (data: User) => {
		try {
			const signedUpUser = await api.signup(data);
			login(signedUpUser);
		} catch (err) {
			alert(err);
		}
	};

	return (
		<>
			<PageTitle title='Sign Up' />
			<PageContent>
				<form onSubmit={handleSubmit(signup)} className='space-y-6'>
					<div className='form-control'>
						<Label text='Email' />
						<Input type='email' placeholder='username@company.com' {...register('email')} />
					</div>
					<div className='form-control'>
						<Label text='Password' />
						<Input type='password' {...register('password')} />
					</div>
					<div className='form-control'>
						<Label text='Full Name' />
						<Input type='text' placeholder='John Doe' {...register('fullName')} />
					</div>
					<Button color='primary' type='submit' block>Save</Button>
				</form>
			</PageContent>
		</>
	);
}
