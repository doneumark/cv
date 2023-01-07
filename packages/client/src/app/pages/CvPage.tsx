import { useState, useEffect, useCallback } from 'react';
import lzString from 'lz-string';
import axios from 'axios';
import Button from '../components/Button';
import { LinkedinData } from '../types/linkedin';
import { CvData } from '../types/cv';

const generateCv = async (linkedinData: LinkedinData, jobData: string): Promise<CvData> => {
	try {
		const res = await axios.post<CvData>('/api/cv', { linkedinData, jobData });
		return res.data;
	} catch (err) {
		if (axios.isAxiosError(err) && err.response) {
			throw err.response.data;
		}

		throw err;
	}
};

export function CvPage() {
	const [jobData, setJobData] = useState<string>('');
	const [linkedinData, setLinkedinData] = useState<LinkedinData>(null);
	const [cvData, setCvData] = useState<CvData>(null);

	useEffect(() => {
		const localStorageLinkedinData = localStorage.getItem('linkedin');
		const localStorageJobData = localStorage.getItem('job');

		if (!localStorageLinkedinData || !localStorageJobData) {
			return;
		}

		const decompressedLinkedinData = lzString.decompressFromUTF16(localStorageLinkedinData);
		const decompressedJobData = lzString.decompressFromUTF16(localStorageJobData);

		if (!decompressedLinkedinData || !decompressedJobData) {
			return;
		}

		setLinkedinData(JSON.parse(decompressedLinkedinData));
		setJobData(JSON.parse(decompressedJobData));
	}, []);

	const generate = useCallback(async () => {
		const data = await generateCv(linkedinData, jobData);
		setCvData(data);
	}, [linkedinData, jobData]);

	if (!linkedinData || !jobData) {
		return <div>nothing to generate from</div>;
	}

	return (
		<>
			<Button color='primary' onClick={generate}>Generate CV</Button>
			{ cvData && (
				<p>
					{ cvData.hi }
				</p>
			)}
		</>
	);
}

export default CvPage;
