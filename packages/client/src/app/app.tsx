import { useRecoilState } from 'recoil';
import { useQuery } from 'react-query';
import axios from 'axios';

import UserState from './state/UserState';
import Input from './components/Input';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Router from './components/Router';

export function App() {
	const [, setUser] = useRecoilState(UserState);
	const { isLoading } = useQuery(
		'me',
		async () => {
			try {
				const resMe = await axios.get('/api/me', { withCredentials: true });
				setUser(resMe.data);
			} catch (err) {
				setUser(null);
			}
		},
	);

	if (isLoading) {
		return <h1>Loading...</h1>;
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
