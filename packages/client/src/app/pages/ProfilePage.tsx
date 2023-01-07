import { useState, useCallback, useEffect } from 'react';
import lzString from 'lz-string';
import axios from 'axios';
import Button from '../components/Button';
import Input from '../components/Input';
import Table from '../components/Table';
import { LinkedinDate, LinkedinData } from '../types/linkedin';

const parseLinkedinDate = (linkedinDate: LinkedinDate) => {
	if (!linkedinDate) {
		return null;
	}

	const { day, month, year } = linkedinDate;
	return `${day}/${month}/${year}`;
};

type LinkedinProfileProps = {
	data: LinkedinData;
};

function LinkedinProfile({ data }: LinkedinProfileProps) {
	if (!data) {
		return null;
	}

	const {
		headline,
		full_name: fullName,
		occupation,
		experiences,
		education: educations,
		accomplishment_projects: projects,
		volunteer_work: volunteers,
	} = data;

	return (
		<div>
			<div className='stats shadow'>
				<div className='stat'>
					<div className='stat-title'>Name</div>
					<div className='stat-value text-primary'>{ fullName }</div>
				</div>
				<div className='stat'>
					<div className='stat-title'>Headline</div>
					<div className='stat-value text-secondary'>{ headline }</div>
				</div>
				<div className='stat'>
					<div className='stat-title'>Occupation</div>
					<div className='stat-value'>{ occupation }</div>
				</div>
			</div>
			<div className='prose'>
				<h5>Experiences</h5>
				<Table>
					<thead>
						<tr>
							<th>From</th>
							<th>To</th>
							<th>Company</th>
							<th>Title</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						{ experiences.map((experience) => (
							<tr>
								<td>{ parseLinkedinDate(experience.starts_at) }</td>
								<td>{ parseLinkedinDate(experience.ends_at) }</td>
								<td>{ experience.company }</td>
								<td>{ experience.title }</td>
								<td>{ experience.description }</td>
							</tr>
						)) }
					</tbody>
				</Table>
				<h5>Education</h5>
				<Table>
					<thead>
						<tr>
							<th>From</th>
							<th>To</th>
							<th>Degree</th>
							<th>Field of Study</th>
							<th>Grade</th>
							<th>School</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						{ educations.map((education) => (
							<tr>
								<td>{ parseLinkedinDate(education.starts_at) }</td>
								<td>{ parseLinkedinDate(education.ends_at) }</td>
								<td>{ education.degree_name }</td>
								<td>{ education.field_of_study }</td>
								<td>{ education.grade }</td>
								<td>{ education.school }</td>
								<td>{ education.description }</td>
							</tr>
						)) }
					</tbody>
				</Table>
				<h5>Projects</h5>
				<Table>
					<thead>
						<tr>
							<th>From</th>
							<th>To</th>
							<th>Title</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						{ projects.map((project) => (
							<tr>
								<td>{ parseLinkedinDate(project.starts_at) }</td>
								<td>{ parseLinkedinDate(project.ends_at) }</td>
								<td>{ project.title }</td>
								<td>{ project.description }</td>
							</tr>
						)) }
					</tbody>
				</Table>
				<h5>Volunteers</h5>
				<Table>
					<thead>
						<tr>
							<th>from</th>
							<th>to</th>
							<th>company</th>
							<th>title</th>
							<th>description</th>
						</tr>
					</thead>
					<tbody>
						{ volunteers.map((volunteer) => (
							<tr>
								<td>{ parseLinkedinDate(volunteer.starts_at) }</td>
								<td>{ parseLinkedinDate(volunteer.ends_at) }</td>
								<td>{ volunteer.company }</td>
								<td>{ volunteer.title }</td>
								<td>{ volunteer.cause }</td>
								<td>{ volunteer.description }</td>
							</tr>
						)) }
					</tbody>
				</Table>
			</div>
		</div>
	);
}

const getLinkedinDataFromUsername = async (username: string): Promise<LinkedinData> => {
	try {
		const res = await axios.get<LinkedinData>('/api/linkedin', { params: { username } });
		return res.data;
	} catch (err) {
		if (axios.isAxiosError(err) && err.response) {
			throw err.response.data;
		}

		throw err;
	}
};

export function ProfilePage() {
	const [username, setUsername] = useState('');
	const [linkedinData, setLinkedinData] = useState<LinkedinData>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	useEffect(() => {
		const localStorageLinkedinData = localStorage.getItem('linkedin');

		if (!localStorageLinkedinData) {
			return;
		}

		const decompressedData = lzString.decompressFromUTF16(localStorageLinkedinData);
		if (!decompressedData) {
			return;
		}

		setLinkedinData(JSON.parse(decompressedData));
	}, []);

	const submit = useCallback(async () => {
		try {
			const data = await getLinkedinDataFromUsername(username);
			setLinkedinData(data);
			setErrorMessage(null);
		} catch (err) {
			setLinkedinData(null);

			if (typeof err === 'string') {
				setErrorMessage(err);
			}
		}
	}, [username]);

	const save = useCallback(() => {
		const compressedData = lzString.compressToUTF16(JSON.stringify(linkedinData));
		localStorage.setItem('linkedin', compressedData);
	}, [linkedinData]);

	return (
		<>
			<div className='form-control'>
				<div className='input-group'>
					<Input type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
					<Button color='primary' onClick={submit}>Submit</Button>
					{linkedinData && <Button color='secondary' onClick={save}>Save</Button> }
				</div>
			</div>
			<LinkedinProfile data={linkedinData} />
			{ errorMessage && errorMessage }
		</>
	);
}

export default ProfilePage;
