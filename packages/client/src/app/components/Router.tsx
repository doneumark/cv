import {
	Route, Routes, Navigate, useLocation,
} from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import JobsPage from '../pages/JobsPage';
import ProfilePage from '../pages/ProfilePage';
import CvPage from '../pages/CvPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import LogoutPage from '../pages/LogoutPage';
import UserState from '../state/UserState';

import ExperiencesPage from '../pages/ExperiencesPage';
import EducationsPage from '../pages/EducationsPage';
import ProjectsPage from '../pages/ProjectsPage';
import VolunteerWorksPage from '../pages/VolunteerWorksPage';

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

export default function Router() {
	return (
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
				path='/experiences'
				element={(
					<ProtectedRoute>
						<ExperiencesPage />
					</ProtectedRoute>
				)}
			/>
			<Route
				path='/educations'
				element={(
					<ProtectedRoute>
						<EducationsPage />
					</ProtectedRoute>
				)}
			/>
			<Route
				path='/projects'
				element={(
					<ProtectedRoute>
						<ProjectsPage />
					</ProtectedRoute>
				)}
			/>
			<Route
				path='/volunteer'
				element={(
					<ProtectedRoute>
						<VolunteerWorksPage />
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
	);
}
