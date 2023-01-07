import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Link, Navigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import Button from '../components/Button';
import UserState from '../state/UserState';

export default function LoginPage() {
	const [user, setUser] = useRecoilState(UserState);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm({
		defaultValues: {
			email: '',
			password: '',
		},
	});

	if (user) {
		return <Navigate to='/' />;
	}

	const login = handleSubmit(async (data) => {
		try {
			const userRes = await axios.post('/api/login', data, { withCredentials: true });
			setUser(userRes.data);
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError('email', { message: String(err.response?.data) });
				return;
			}

			if (err instanceof Error) {
				setError('email', { message: err.message });
				return;
			}

			setError('email', { message: 'Unknown error' });
		}
	});

	return (
		<>
			<form onSubmit={login}>
				{ errors.email && (
					<label className='label'>
						<span className='label-text-alt'>{ errors.email.message }</span>
					</label>
				) }
				<div className='form-control w-full max-w-xs'>
					<label className='label'>
						<span className='label-text'>Email</span>
					</label>
					<input type='email' placeholder='Email' className='input input-bordered w-full max-w-xs' {...register('email')} />
				</div>
				<div className='form-control w-full max-w-xs'>
					<label className='label'>
						<span className='label-text'>Password</span>
					</label>
					<input type='password' placeholder='Password' className='input input-bordered w-full max-w-xs' {...register('password')} />
				</div>
				<Button color='primary' type='submit'>Send</Button>
			</form>
			<Link to='/signup'>Signup</Link>
		</>
	);
}
