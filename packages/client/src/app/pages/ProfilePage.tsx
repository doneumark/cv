import { useQuery } from 'react-query';
import axios from 'axios';
import { User } from '@cv/api/interface';
import { Routes, NavLink, Route } from 'react-router-dom';
import { clsx } from 'clsx';

import Experiences from '../components/Experiences';
import Educations from '../components/Educations';
import Projects from '../components/Projects';
import VolunteerWorks from '../components/VolunteerWorks';
import UserForm from '../components/UserForm';

export function ProfilePage() {
	const {
		data: user, isLoading, error, refetch,
	} = useQuery<User>(
		'user',
		async () => {
			try {
				const resUser = await axios.get<User>('/api/user', { withCredentials: true });
				return resUser.data;
			} catch (err) {
				if (axios.isAxiosError(err) && err.response) {
					throw err.response.data;
				}

				throw err;
			}
		},
	);

	if (isLoading || !user) {
		return <h1>Loading...</h1>;
	}

	if (error) {
		return <h1>ERROR</h1>;
	}

	const {
		educations, experiences,
		projects, volunteerWorks,
	} = user;

	return (
		<>
			<h1>Profile</h1>
			<div className='grid'>
				<div className='tabs not-prose z-10 -mb-px'>
					<NavLink to='' end className={({ isActive }) => clsx(['tab tab-lg tab-lifted flex items-center gap-2', isActive ? 'tab-active' : '[--tab-border-color:transparent]'])}>
						General
					</NavLink>
					<NavLink to='experiences' className={({ isActive }) => clsx(['tab tab-lg tab-lifted flex items-center gap-2', isActive ? 'tab-active' : '[--tab-border-color:transparent]'])}>
						{({ isActive }) => (
							<>
								Experiences
								<div className={clsx('badge', isActive ? 'badge-primary' : 'badge-outline')}>{ experiences.length }</div>
							</>
						)}
					</NavLink>
					<NavLink to='educations' className={({ isActive }) => clsx(['tab tab-lg tab-lifted flex items-center gap-2', isActive ? 'tab-active' : '[--tab-border-color:transparent]'])}>
						{({ isActive }) => (
							<>
								Educations
								<div className={clsx('badge', isActive ? 'badge-primary' : 'badge-outline')}>{ educations.length }</div>
							</>
						)}
					</NavLink>
					<NavLink to='projects' className={({ isActive }) => clsx(['tab tab-lg tab-lifted flex items-center gap-2', isActive ? 'tab-active' : '[--tab-border-color:transparent]'])}>
						{({ isActive }) => (
							<>
								Projects
								<div className={clsx('badge', isActive ? 'badge-primary' : 'badge-outline')}>{ projects.length }</div>
							</>
						)}
					</NavLink>
					<NavLink to='volunteer-works' className={({ isActive }) => clsx(['tab tab-lg tab-lifted flex items-center gap-2', isActive ? 'tab-active' : '[--tab-border-color:transparent]'])}>
						{({ isActive }) => (
							<>
								Volunteer
								<div className={clsx('badge', isActive ? 'badge-primary' : 'badge-outline')}>{ volunteerWorks.length }</div>
							</>
						)}
					</NavLink>
					<div className='tab tab-lifted flex-1 mr-6 cursor-default [--tab-border-color:transparent]' />
				</div>
				<div className='rounded-b-box rounded-tr-box relative overflow-x-auto'>
					<div className='border-base-300 rounded-b-box rounded-tr-box border p-4'>
						<Routes>
							<Route
								path='/'
								element={<UserForm user={user} refetch={() => { refetch(); }} />}
							/>
							<Route
								path='/experiences'
								element={<Experiences experiences={experiences} />}
							/>
							<Route
								path='/educations'
								element={<Educations educations={educations} />}
							/>
							<Route
								path='/projects'
								element={<Projects projects={projects} />}
							/>
							<Route
								path='/volunteer-works'
								element={<VolunteerWorks volunteerWorks={volunteerWorks} />}
							/>
						</Routes>
					</div>
				</div>
			</div>
		</>
	);
}

export default ProfilePage;
