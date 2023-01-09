// import { useQuery } from 'react-query';
import {
	Route, Routes, Link, NavLink, Navigate, useLocation,
} from 'react-router-dom';
import { clsx } from 'clsx';
import { useRecoilValue, useRecoilState } from 'recoil';
import { useQuery } from 'react-query';
import axios from 'axios';
import JobsPage from './pages/JobsPage';
import ProfilePage from './pages/ProfilePage';
import CvPage from './pages/CvPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserState from './state/UserState';
import LogoutPage from './pages/LogoutPage';
import Input from './components/Input';

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
		'me',
		async () => {
			try {
				const resMe = await axios.get('/api/me', { withCredentials: true });
				setUser(resMe.data);
			} catch (err) {
				setUser(null);
			}
		},
	);

	if (isLoading) {
		return <h1>Loading...</h1>;
	}

	return (
		<div className='drawer drawer-mobile'>
			<Input id='layout-drawer' type='checkbox' className='drawer-toggle' />
			<div className='drawer-content'>
				<div className='sticky top-0 z-30 flex h-16 w-full justify-center bg-opacity-90 backdrop-blur transition-all duration-100 bg-base-100 text-base-content'>
					<nav className='navbar w-full'>
						<div className='flex flex-1' />
						<div className='flex flex-0 gap-4'>
							{ user && (
								<>
									{ user?.fullName }
									<Link className='btn btn-sm btn-ghost' to='/logout'>Logout</Link>
								</>
							) }
						</div>
					</nav>
				</div>
				<div className='px-6 xl:pr-2 pb-16'>
					<div className='prose w-full max-w-4xl flex-grow'>
						<Routes>
							<Route path='/' element={<Navigate to='/profile' />} />
							<Route path='/login' element={<LoginPage />} />
							<Route path='/signup' element={<SignupPage />} />
							<Route
								path='/profile/*'
								element={(
									<ProtectedRoute>
										<ProfilePage />
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
				<label htmlFor='layout-drawer' className='btn btn-primary drawer-button lg:hidden'>
					Open drawer
				</label>
			</div>
			<div className='drawer-side'>
				<label htmlFor='layout-drawer' className='drawer-overlay' />
				<aside className='bg-base-200 w-80'>
					<div className='z-20 bg-base-200 bg-opacity-90 backdrop-blur sticky top-0 items-center gap-2 px-4 py-2 hidden lg:flex'>
						<a href='/' className='flex-0 btn btn-ghost px-2'>
							<span className='font-title inline-flex text-lg transition-all duration-200 md:text-3xl'>
								CV
							</span>
						</a>
					</div>
					<div className='h-4' />
					<ul className='menu menu-compact flex flex-col p-0 px-4'>
						{
							user
								? (
									<>
										<li><NavLink className={({ isActive }) => clsx(['flex gap-4', isActive && 'active'])} to='/profile'>Profile</NavLink></li>
										<li><NavLink className={({ isActive }) => clsx(['flex gap-4', isActive && 'active'])} to='/jobs'>Jobs</NavLink></li>
										<li><NavLink className={({ isActive }) => clsx(['flex gap-4', isActive && 'active'])} to='/cv'>CV</NavLink></li>
									</>
								) : (
									<>
										<li><NavLink className={({ isActive }) => clsx(['flex gap-4', isActive && 'active'])} to='/login'>Log In</NavLink></li>
										<li><NavLink className={({ isActive }) => clsx(['flex gap-4', isActive && 'active'])} to='/signup'>Sign Up</NavLink></li>
									</>
								)
						}
					</ul>
				</aside>
			</div>
		</div>
	);
}

export default App;
