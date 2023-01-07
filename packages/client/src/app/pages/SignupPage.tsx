import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import Button from '../components/Button';
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
			<div className='form-control w-full max-w-xs'>
				<label className='label'>
					<span className='label-text'>Email</span>
				</label>
				<input type='email' placeholder='Email' className='input input-bordered w-full max-w-xs' {...register('email')} />
				{ errors.email && (
					<label className='label'>
						<span className='label-text-alt'>{ errors.email.message }</span>
					</label>
				) }
			</div>
			<div className='form-control w-full max-w-xs'>
				<label className='label'>
					<span className='label-text'>Password</span>
				</label>
				<input type='password' placeholder='Password' className='input input-bordered w-full max-w-xs' {...register('password')} />
				{ errors.password && (
					<label className='label'>
						<span className='label-text-alt'>{ errors.password.message }</span>
					</label>
				) }
			</div>
			<div className='form-control w-full max-w-xs'>
				<label className='label'>
					<span className='label-text'>Full Name</span>
				</label>
				<input type='text' placeholder='Full Name' className='input input-bordered w-full max-w-xs' {...register('fullName')} />
				{ errors.fullName && (
					<label className='label'>
						<span className='label-text-alt'>{ errors.fullName.message }</span>
					</label>
				) }
			</div>
			<Button color='primary' type='submit'>Save</Button>
		</form>
	);
}
