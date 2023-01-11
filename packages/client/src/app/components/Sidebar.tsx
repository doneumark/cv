import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import { useRecoilState } from 'recoil';
import UserState from '../state/UserState';
import UserCountsState from '../state/UserCountsState';

interface SidebarLinkProps {
	to: string;
	text: string;
	number?: number;
	icon?: React.ReactElement;
}

function SidebarLink({
	to, text, number, icon,
}: SidebarLinkProps) {
	return (
		<NavLink className={({ isActive }) => clsx(['flex gap-4', isActive && 'active'])} to={to}>
			{({ isActive }) => (
				<>
					{ icon }
					<span className='flex-1'>{ text }</span>
					{ (number || number === 0) && <span className={clsx(['badge badge-sm flex-none lowercase', isActive && 'badge-ghost'])}>{ number }</span> }
				</>
			)}
		</NavLink>
	);
}

export default function Sidebar() {
	const [user] = useRecoilState(UserState);
	const [userCounts] = useRecoilState(UserCountsState);

	return (
		<aside className='bg-base-200 w-80 border-base-300 border-r'>
			<div className='z-20 bg-base-200 bg-opacity-90 backdrop-blur sticky top-0 items-center gap-2 px-4 py-2 hidden lg:flex'>
				<a href='/' className='flex-0 btn btn-ghost px-2'>
					<span className='font-title inline-flex text-lg transition-all duration-200 md:text-3xl'>
						CVs
					</span>
				</a>
			</div>
			<div className='h-4' />
			<ul className='menu menu-compact flex flex-col p-0 px-4'>
				<li>
					<SidebarLink
						to='/sync'
						text='Sync'
						icon={(
							<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
								<path strokeLinecap='round' strokeLinejoin='round' d='M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z' />
							</svg>
						)}
					/>
				</li>
				<li>
					<SidebarLink
						to='/generate-cv'
						text='Generate CV'
						icon={(
							<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
								<path strokeLinecap='round' strokeLinejoin='round' d='M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z' />
							</svg>
						)}
					/>
				</li>
			</ul>
			<ul className='menu menu-compact flex flex-col p-0 px-4'>
				<li />
				{
					user
						? (
							<>
								<li>
									<SidebarLink to='/profile' text='Profile' />
								</li>
								<li>
									<SidebarLink to='/experiences' text='Experiences' number={userCounts.experiences} />
								</li>
								<li>
									<SidebarLink to='/educations' text='Educations' number={userCounts.educations} />
								</li>
								<li>
									<SidebarLink to='/projects' text='Projects' number={userCounts.projects} />
								</li>
								<li>
									<SidebarLink to='/volunteer' text='Volunteer' number={userCounts.volunteerWorks} />
								</li>
								<li>
									<SidebarLink to='/jobs' text='Jobs' number={userCounts.jobs} />
								</li>
								<li>
									<SidebarLink to='/cv' text='CV' />
								</li>
							</>
						) : (
							<>
								<li>
									<SidebarLink to='/login' text='Log In' />
								</li>
								<li>
									<SidebarLink to='/signup' text='Sign Up' />
								</li>
							</>
						)
				}
			</ul>
		</aside>
	);
}
