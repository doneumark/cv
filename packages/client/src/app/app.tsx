// import { useQuery } from 'react-query';
import {
	Route, Routes, NavLink, Navigate,
} from 'react-router-dom';
import { clsx } from 'clsx';
import JobsPage from './pages/JobsPage';
import LinkedinPage from './pages/LinkedinPage';
import CvPage from './pages/CvPage';

export function App() {
	// const { data, isLoading } = useQuery(
	// 	['basic', username],
	// 	() => axios.get('/api/linkedin', { params: { username } }).then((res) => res.data),
	// );

	return (
		<div className='container px-12 py-8'>
			<div className='tabs'>
				<NavLink className={({ isActive }) => clsx(['tab tab-bordered', isActive && 'tab-active'])} to='/linkedin'>Linkedin</NavLink>
				<NavLink className={({ isActive }) => clsx(['tab tab-bordered', isActive && 'tab-active'])} to='/jobs'>Jobs</NavLink>
				<NavLink className={({ isActive }) => clsx(['tab tab-bordered', isActive && 'tab-active'])} to='/cv'>CV</NavLink>
			</div>
			<div className='py-4'>
				<Routes>
					<Route path='/' element={<Navigate to='/linkedin' />} />
					<Route path='/linkedin' element={<LinkedinPage />} />
					<Route path='/jobs' element={<JobsPage />} />
					<Route path='/cv' element={<CvPage />} />
				</Routes>
			</div>
		</div>
	);
}

export default App;
