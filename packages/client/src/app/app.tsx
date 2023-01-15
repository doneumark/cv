import { useRecoilState } from 'recoil';
import { useQuery } from '@tanstack/react-query';

// import clsx from 'clsx';
import UserState from './state/UserState';
import UserCountsState from './state/UserCountsState';
import Input from './components/Input';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Router from './components/Router';
import Spinner from './components/Spinner';
import { ToastContainer } from './services/toasts';
import * as api from './services/api';

// icons: https://tailwindcss.com/blog/heroicons-v1
// form: https://tailwindui.com/components/application-ui/forms/form-layouts
// example: https://protocol.tailwindui.com/quickstart
// examples: https://www.creative-tim.com/templates/tailwind-dashboard

export function App() {
	const [, setUser] = useRecoilState(UserState);
	const [, setUserCounts] = useRecoilState(UserCountsState);

	const { isInitialLoading: isLoadingAuth } = useQuery({
		queryKey: ['me'],
		queryFn: async () => {
			try {
				const user = await api.auth();
				setUser(user);
				return user;
			} catch (err) {
				setUser(null);
				return null;
			}
		},
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	});

	useQuery({
		queryKey: ['userCounts'],
		queryFn: async () => {
			const userCounts = await api.getUserCounts();
			setUserCounts(userCounts);
			return userCounts;
		},
	});

	if (isLoadingAuth) {
		return (
			<div className='w-screen h-screen'>
				<Spinner />
			</div>
		);
	}

	return (
		<div className='relative'>
			<div className='drawer drawer-mobile'>
				<Input id='layout-drawer' type='checkbox' className='drawer-toggle' />
				<div className='drawer-content bg-base-200'>
					<Navbar />
					<div className='px-6 xl:pr-2 pb-16'>
						<div className='w-full max-w-4xl flex-grow'>
							<Router />
						</div>
					</div>
				</div>
				<div className='drawer-side'>
					<label htmlFor='layout-drawer' className='drawer-overlay' />
					<Sidebar />
				</div>
			</div>
			<ToastContainer />
		</div>
	);
}

export default App;
