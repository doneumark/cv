import { useMemo } from 'react';
import {
	Control, FieldValues, useController, Path,
} from 'react-hook-form';
import Datepicker from 'react-tailwindcss-datepicker';

export interface DateInputProps<T extends FieldValues> {
	dayField: Path<T>;
	monthField: Path<T>;
	yearField: Path<T>;
	control: Control<T>;
}

export default function DateInput<T extends FieldValues>({
	dayField, monthField, yearField, control,
}: DateInputProps<T>) {
	const {
		field: { value: dayValue, onChange: onChangeDay },
	} = useController({ name: dayField, control });

	const {
		field: { value: monthValue, onChange: onChangeMonth },
	} = useController({ name: monthField, control });

	const {
		field: { value: yearValue, onChange: onChangeYear },
	} = useController({ name: yearField, control });

	const valueAsDate = useMemo(() => {
		if (
			(!dayValue && dayValue !== 0)
			|| (!monthValue && monthValue !== 0)
			|| (!yearValue && yearValue !== 0)
		) {
			return null;
		}

		const date = new Date();
		date.setDate(dayValue);
		date.setMonth(monthValue - 1);
		date.setFullYear(yearValue);

		return { startDate: date, endDate: date };
	}, [dayValue, monthValue, yearValue]);

	return (
		<Datepicker
			asSingle
			value={valueAsDate}
			onChange={(newDateString) => {
				if (!newDateString?.startDate || newDateString.startDate instanceof Date) {
					return;
				}

				const splittedDate = newDateString?.startDate?.split('-');
				if (!splittedDate) {
					return;
				}

				const [year, month, day] = splittedDate;
				onChangeDay(parseInt(day, 10));
				onChangeMonth(parseInt(month, 10));
				onChangeYear(parseInt(year, 10));
			}}
			displayFormat='DD/MM/YYYY'
			useRange={false}
			inputClassName='input input-bordered'
			primaryColor='base-300'
		/>
	);
}
