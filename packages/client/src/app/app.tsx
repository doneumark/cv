import { useRecoilState } from 'recoil';
import { useQuery } from 'react-query';

import UserState from './state/UserState';
import UserCountsState from './state/UserCountsState';
import Input from './components/Input';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Router from './components/Router';
import { auth, getUserCountsFromApi } from './utils';
import Spinner from './components/Spinner';

// icons: https://tailwindcss.com/blog/heroicons-v1
// form: https://tailwindui.com/components/application-ui/forms/form-layouts
// example: https://protocol.tailwindui.com/quickstart
// examples: https://www.creative-tim.com/templates/tailwind-dashboard

export function App() {
	const [, setUser] = useRecoilState(UserState);
	const [, setUserCounts] = useRecoilState(UserCountsState);

	const { isLoading: isLoadingAuth } = useQuery({
		queryKey: 'me',
		queryFn: async () => {
			try {
				const user = await auth();
				setUser(user);
			} catch (err) {
				setUser(null);
			}
		},
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	});

	useQuery({
		queryKey: 'userCounts',
		queryFn: async () => {
			const userCounts = await getUserCountsFromApi();
			setUserCounts(userCounts);
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
	);
}

export default App;
