export const parseApiDate = (
	day: number | null,
	month: number | null,
	year: number | null,
) => {
	if (day === null || month === null || year === null) {
		return '';
	}

	return `${day}/${month}/${year}`;
};

export function filterByQuery<T, K extends keyof T>(
	query: string,
	data: T[],
	fields: K[],
): T[] {
	if (!query) {
		return data;
	}

	const loweredCaseQuery = query.toLowerCase();

	return data.filter((element) => {
		const fieldValues = fields
			.map((field) => element[field] as string)
			.filter((value) => !!value);

		return fieldValues.some((value) => value.toLowerCase().includes(loweredCaseQuery));
	});
}
