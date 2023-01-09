export const parseLinkedinDate = (
	day: number | null,
	month: number | null,
	year: number | null,
) => {
	if (day === null || month === null || year === null) {
		return '';
	}

	return `${day}/${month}/${year}`;
};
