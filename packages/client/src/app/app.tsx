import { useQuery } from '@tanstack/react-query';
import { useUserStore } from './stores/UserStore';
import { useUserCountsStore } from './stores/UserCountsStore';
import Input from './components/Input';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Router from './components/Router';
import Spinner from './components/Spinner';
import { ToastsContainer } from './components/ToastsContainer';
import * as api from './services/api';

// icons: https://tailwindcss.com/blog/heroicons-v1
// form: https://tailwindui.com/components/application-ui/forms/form-layouts
// example: https://protocol.tailwindui.com/quickstart
// examples: https://www.creative-tim.com/templates/tailwind-dashboard

export function App() {
	const { user, login, logout } = useUserStore();
	const { setUserCounts } = useUserCountsStore();

	const { isInitialLoading: isLoadingAuth } = useQuery({
		queryKey: ['me'],
		queryFn: async () => {
			try {
				const resUser = await api.auth();
				login(resUser);
				return resUser;
			} catch (err) {
				logout();
				return null;
			}
		},
		refetchOnWindowFocus: false,
	});

	useQuery({
		queryKey: ['userCounts'],
		queryFn: async () => {
			const userCounts = await api.getUserCounts();
			setUserCounts(userCounts);
			return userCounts;
		},
		enabled: !!user,
		refetchOnWindowFocus: false,
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
			<ToastsContainer />
		</div>
	);
}

export default App;
