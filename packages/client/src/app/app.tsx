// import { useQuery } from 'react-query';
import {
	Route, Routes, NavLink, Navigate, useLocation,
} from 'react-router-dom';
import { clsx } from 'clsx';
import { useRecoilValue, useRecoilState } from 'recoil';
import { useQuery } from 'react-query';
import axios from 'axios';
import JobsPage from './pages/JobsPage';
import LinkedinPage from './pages/LinkedinPage';
import CvPage from './pages/CvPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserState from './state/UserState';
import LogoutPage from './pages/LogoutPage';

export interface ProtectedRoutesProps {
	children: React.ReactElement
}

function ProtectedRoute({ children }: ProtectedRoutesProps): React.ReactElement {
	const location = useLocation();
	const user = useRecoilValue(UserState);

	if (!user) {
		return <Navigate to='/login' state={{ from: location }} replace />;
	}

	return children;
}

export function App() {
	const [user, setUser] = useRecoilState(UserState);
	const { isLoading } = useQuery(
		['me'],
		async () => {
			try {
				const resUser = await axios.get('/api/me', { withCredentials: true });
				console.log('ME');
				setUser(resUser.data);
			} catch (err) {
				setUser(null);
			}
		},
	);

	if (isLoading) {
		return <h1>Loading...</h1>;
	}

	return (
		<div className='container px-12 py-8'>
			{ user && (
				<h1 className='text-2xl font-bold'>
					Welcome
					{' '}
					{ user.fullName }
				</h1>
			) }
			<div className='tabs'>
				{
					user
						? (
							<>
								<NavLink className={({ isActive }) => clsx(['tab tab-bordered', isActive && 'tab-active'])} to='/linkedin'>Linkedin</NavLink>
								<NavLink className={({ isActive }) => clsx(['tab tab-bordered', isActive && 'tab-active'])} to='/jobs'>Jobs</NavLink>
								<NavLink className={({ isActive }) => clsx(['tab tab-bordered', isActive && 'tab-active'])} to='/cv'>CV</NavLink>
								<NavLink className={({ isActive }) => clsx(['tab tab-bordered', isActive && 'tab-active'])} to='/logout'>Logout</NavLink>
							</>
						) : (
							<>
								<NavLink className={({ isActive }) => clsx(['tab tab-bordered', isActive && 'tab-active'])} to='/signup'>Sign Up</NavLink>
								<NavLink className={({ isActive }) => clsx(['tab tab-bordered', isActive && 'tab-active'])} to='/login'>Log In</NavLink>
							</>
						)
				}

			</div>
			<div className='py-4'>
				<Routes>
					<Route path='/' element={<Navigate to='/linkedin' />} />
					<Route path='/login' element={<LoginPage />} />
					<Route path='/signup' element={<SignupPage />} />
					<Route
						path='/linkedin'
						element={(
							<ProtectedRoute>
								<LinkedinPage />
							</ProtectedRoute>
						)}
					/>
					<Route
						path='/jobs'
						element={(
							<ProtectedRoute>
								<JobsPage />
							</ProtectedRoute>
						)}
					/>
					<Route
						path='/cv'
						element={(
							<ProtectedRoute>
								<CvPage />
							</ProtectedRoute>
						)}
					/>
					<Route
						path='/logout'
						element={(
							<ProtectedRoute>
								<LogoutPage />
							</ProtectedRoute>
						)}
					/>
				</Routes>
			</div>
		</div>
	);
}

export default App;
