import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import Button from '../components/Button';
import Input from '../components/Input';
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
			<div className='prose'>
				<h1 className='mt-3 mb-6'>Log In</h1>
			</div>
			<div className='card w-96 bg-base-100 card-bordered border-base-300'>
				<div className='card-body'>
					<form onSubmit={login} className='space-y-6'>
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
				</div>
			</div>
		</>
	);
}
