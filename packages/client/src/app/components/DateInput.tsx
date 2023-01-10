import { useFormContext } from 'react-hook-form';

export interface DateInputProps {
	day: number;
	month: number;
	year: number;
}

export default function DateInput({ day, month, year }: DateInputProps) {
	const { register } = useFormContext();

	return (
		<label className='input-group'>
			<input value={day} type='number' min='1' max='31' placeholder='00' className='input input-bordered block w-20' />
			<span>/</span>
			<input value={month} type='number' min='1' max='12' placeholder='00' className='input input-bordered block w-20' />
			<span>/</span>
			<input value={year} type='number' min='1900' max='2030' placeholder='0000' className='input input-bordered block w-32' />
		</label>
	);
}
