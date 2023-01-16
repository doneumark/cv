import { Link } from 'react-router-dom';
import { useUserStore } from '../stores/UserStore';

export default function Navbar() {
	const { user } = useUserStore();

	return (
		<div className='sticky top-0 z-30 flex h-16 w-full justify-center bg-opacity-90 backdrop-blur transition-all duration-100 bg-base-200 text-base-content border-base-300 border-b'>
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
							<div className='flex items-center gap-2 from-stone-500'>
								<div className='cursor-pointer text-sm'>{ user.fullName }</div>
								<label tabIndex={0} className='btn btn-ghost btn-circle avatar'>
									<div className='w-10 rounded-full'>
										<img alt={user.fullName} src='https://placeimg.com/80/80/people' />
									</div>
								</label>
							</div>
							<div className='dropdown-content'>
								<ul tabIndex={0} className='p-2 shadow menu bg-base-100 rounded-box w-52 mt-2'>
									<li>
										<Link to='/settings'>
											<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
												<path strokeLinecap='round' strokeLinejoin='round' d='M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z' />
												<path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
											</svg>
											Settings
										</Link>
										<Link to='/logout'>
											<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
												<path strokeLinecap='round' strokeLinejoin='round' d='M5.636 5.636a9 9 0 1012.728 0M12 3v9' />
											</svg>
											Logout
										</Link>
									</li>
								</ul>
							</div>
						</div>
					) }
				</div>
			</nav>
		</div>
	);
}
