import axios from 'axios';

type LinkedinDate = {
	day: number,
	month: number,
	year: number,
} | null;

type LinkedinData = {
	first_name: string,
	last_name: string,
	full_name: string,
	occupation: string,
	headline: string,
	summary: string,
	country_full_name: string,
	experiences: {
		starts_at: LinkedinDate,
		ends_at?: LinkedinDate,
		company: string,
		title: string,
		description: string,
	}[],
	education: {
		starts_at: LinkedinDate,
		ends_at?: LinkedinDate,
		field_of_study: string,
		degree_name: string,
		school: string,
		description: string | null,
		grade: string | null,
	}[],
	accomplishment_projects: {
		starts_at: LinkedinDate,
		ends_at?: LinkedinDate,
		title: string,
		description: string,
	}[],
	volunteer_work: {
		starts_at: LinkedinDate,
		ends_at?: LinkedinDate,
		title: string | null,
		cause: string | null,
		company: string | null,
		description: string | null,
	}[],
} | null;

export const getLinkedinDataFromUsername = async (
	username: string,
): Promise<LinkedinData> => {
	const response = await axios.get(
		'https://nubela.co/proxycurl/api/v2/linkedin',
		{
			params: { url: `https://www.linkedin.com/in/${username}` },
			headers: {
				Authorization: 'Bearer 8UUJZwy4522bmjMzXRK7Rg',
				'Accept-Encoding': '*',
			},
		},
	);

	const { data } = response;
	return data;
};
