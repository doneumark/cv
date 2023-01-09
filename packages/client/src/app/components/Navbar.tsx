import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import UserState from '../state/UserState';

export default function Navbar() {
	const [user] = useRecoilState(UserState);

	return (
		<div className='sticky top-0 z-30 flex h-16 w-full justify-center bg-opacity-90 backdrop-blur transition-all duration-100 bg-base-100 text-base-content'>
			<nav className='navbar w-full'>
				<div className='flex flex-1 md:gap-1 lg:gap-2'>
					<span className='tooltip tooltip-bottom before:text-xs before:content-[attr(data-tip)]' data-tip='Menu'>
						<label htmlFor='layout-drawer' className='btn btn-square btn-ghost drawer-button lg:hidden'>
							<svg width='20' height='20' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' className='inline-block h-5 w-5 stroke-current md:h-6 md:w-6'>
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16' />
							</svg>
						</label>
					</span>
				</div>
				<div className='flex-none'>
					{ user && (
						<div className='dropdown dropdown-hover dropdown-end'>
							<label tabIndex={0} className='btn btn-ghost btn-circle avatar'>
								<div className='w-10 rounded-full'>
									<img alt={user.fullName} src='https://placeimg.com/80/80/people' />
								</div>
							</label>
							<ul tabIndex={0} className='p-2 shadow menu dropdown-content bg-base-200 rounded-box w-52'>
								<li className='menu-title'>
									<span>{ user.fullName }</span>
								</li>
								<li>
									<Link to='/logout'>
										<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
											<path strokeLinecap='round' strokeLinejoin='round' d='M5.636 5.636a9 9 0 1012.728 0M12 3v9' />
										</svg>
										Logout
									</Link>
								</li>
							</ul>
						</div>
					) }
				</div>
			</nav>
		</div>
	);
}
