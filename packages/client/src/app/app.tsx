import { useState, useCallback } from 'react';
// import { useQuery } from 'react-query';
import { Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import AboutPage from './pages/AboutPage';
import GeneratePage from './pages/GeneratePage';

type LinkedinData = {
	first_name: string,
	last_name: string,
	full_name: string,
	occupation: string,
	headline: string,
	summary: string,
	country_full_name: string,
	experiences: {
		starts_at: {
			day: number,
			month: number,
			year: number
		},
		ends_at: {
			day: number,
			month: number,
			year: number
		},
		company: string,
		title: string,
		description: string,
	}[],
	education: string,
	accomplishment_projects: string,
	volunteer_work: string,
} | null;

export function App() {
	const [username, setUsername] = useState('');
	const [linkedinData, setLinkedinData] = useState<LinkedinData>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	// const { data, isLoading } = useQuery(
	// 	['basic', username],
	// 	() => axios.get('/api/linkedin', { params: { username } }).then((res) => res.data),
	// );

	const submit = useCallback(async () => {
		try {
			const res = await axios.get<LinkedinData>('/api/linkedin', { params: { username } });
			setLinkedinData(res.data);
		} catch (err) {
			if (axios.isAxiosError(err) && err.response) {
				setErrorMessage(err.response.data);
			}
		}
	}, [username]);

	return (
		<>
			<input type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
			<button type='button' onClick={submit}>Submit</button>
			{ linkedinData && <h1>{ linkedinData.headline }</h1> }
			{ errorMessage && errorMessage }
			<div role='navigation'>
				<ul>
					<li>
						<Link to='/generate'>Generate</Link>
					</li>
					<li>
						<Link to='/about'>About</Link>
					</li>
				</ul>
			</div>
			<Routes>
				<Route
					path='/generate'
					element={<GeneratePage title='generate' />}
				/>
				<Route
					path='/about'
					element={<AboutPage title='about' />}
				/>
			</Routes>
			{/* END: routes */}
		</>
	);
}

export default App;
