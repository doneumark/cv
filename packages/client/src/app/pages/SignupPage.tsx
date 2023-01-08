import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import Button from '../components/Button';
import Input from '../components/Input';
import UserState from '../state/UserState';

export default function SignupPage() {
	const [user, setUser] = useRecoilState(UserState);
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm({
		defaultValues: {
			email: '',
			password: '',
			fullName: '',
		},
	});

	if (user) {
		return <Navigate to='/' />;
	}

	const signup = handleSubmit(async (data) => {
		try {
			const resUser = await axios.post('/api/signup', data);
			setUser(resUser.data);
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError('password', { message: String(err.response?.data) });
				return;
			}

			if (err instanceof Error) {
				setError('password', { message: err.message });
				return;
			}

			setError('password', { message: 'Unknown error' });
		}
	});

	return (
		<form onSubmit={signup}>
			<div className='max-w-xs'>
				<div className='form-control'>
					<label className='label'>
						<span className='label-text'>Email</span>
					</label>
					<Input type='email' placeholder='username@company.com' {...register('email')} />
					{ errors.email && (
						<label className='label'>
							<span className='label-text-alt'>{ errors.email.message }</span>
						</label>
					) }
				</div>
				<div className='form-control'>
					<label className='label'>
						<span className='label-text'>Password</span>
					</label>
					<Input type='password' {...register('password')} />
					{ errors.password && (
						<label className='label'>
							<span className='label-text-alt'>{ errors.password.message }</span>
						</label>
					) }
				</div>
				<div className='form-control'>
					<label className='label'>
						<span className='label-text'>Full Name</span>
					</label>
					<Input type='text' placeholder='John Doe' {...register('fullName')} />
					{ errors.fullName && (
						<label className='label'>
							<span className='label-text-alt'>{ errors.fullName.message }</span>
						</label>
					) }
				</div>
				<Button color='primary' type='submit' block className='mt-3'>Save</Button>
			</div>
		</form>
	);
}
