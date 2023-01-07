import { useState, useCallback, useEffect } from 'react';
import lzString from 'lz-string';
import Button from '../components/Button';

export function JobsPage() {
	const [jobData, setJobData] = useState<string>('');

	useEffect(() => {
		const localStorageJobData = localStorage.getItem('job');

		if (!localStorageJobData) {
			return;
		}

		const decompressedData = lzString.decompressFromUTF16(localStorageJobData);
		if (!decompressedData) {
			return;
		}

		setJobData(JSON.parse(decompressedData));
	}, []);

	const save = useCallback(async () => {
		const compressedData = lzString.compressToUTF16(JSON.stringify(jobData));
		localStorage.setItem('job', compressedData);
	}, [jobData]);

	return (
		<>
			<textarea
				value={jobData}
				onChange={(e) => setJobData(e.target.value)}
				className='textarea textarea-bordered w-10/12 block mb-4'
				rows={10}
				placeholder='Jop description'
			/>
			<Button color='primary' onClick={save}>Save</Button>
		</>
	);
}

export default JobsPage;
