import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import { useRecoilState } from 'recoil';
import { useEffect, useState } from 'react';
import UserState from '../state/UserState';
import UserCountsState from '../state/UserCountsState';
import SearchIcon from '../icons/SearchIcon';
import SyncIcon from '../icons/SyncIcon';
import CvIcon from '../icons/CvIcon';

interface SidebarLinkProps {
	to: string;
	text: string;
	number?: number;
	icon?: React.ReactElement;
}

const NUDGE_DURATION = 500;

function SidebarLink({
	to, text, number, icon,
}: SidebarLinkProps) {
	const isNumberExists = !!number || number === 0;
	const [isNudging, setIsNudging] = useState(false);

	useEffect(() => {
		if (!isNumberExists) {
			return () => {};
		}

		setIsNudging(true);

		const nudgeTimeout = setTimeout(() => {
			setIsNudging(false);
		}, NUDGE_DURATION);

		return () => {
			clearTimeout(nudgeTimeout);
		};
	}, [isNumberExists, number]);

	return (
		<NavLink className={({ isActive }) => clsx(['flex gap-4', isActive && 'active'])} to={to}>
			{({ isActive }) => (
				<>
					{ icon }
					<span className='flex-1'>{ text }</span>
					{ isNumberExists && <span className={clsx(['badge badge-sm flex-none lowercase', isActive && 'badge-ghost', isNudging && 'animate-shake'])}>{ number }</span> }
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
						Miro
					</span>
				</a>
			</div>
			<div className='h-4' />
			<ul className='menu menu-compact flex flex-col p-0 px-4'>
				<li>
					<SidebarLink
						to='/sync'
						text='Sync'
						icon={<SyncIcon />}
					/>
				</li>
				<li>
					<SidebarLink
						to='/jobs'
						text='Find'
						icon={<SearchIcon />}
					/>
				</li>
				<li>
					<SidebarLink
						to='/generate-cv'
						text='Generate CV'
						icon={<CvIcon />}
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
									<SidebarLink to='/cvs' text='CVs' />
								</li>
								<li />
								<li>
									<SidebarLink to='/jobs' text='Jobs' number={userCounts.jobs} />
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
