import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import { useRecoilState } from 'recoil';
import UserState from '../state/UserState';

export default function Sidebar() {
	const [user] = useRecoilState(UserState);

	return (
		<aside className='bg-base-200 w-80 border-base-300 border-r'>
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
	);
}
