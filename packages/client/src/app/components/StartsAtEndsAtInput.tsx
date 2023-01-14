import { Control, FieldValues, Path } from 'react-hook-form';
import DateInput from './DateInput';
import Label from './Label';

export interface StartsAtEndsAtInputProps<T extends FieldValues> {
	control: Control<T>;
}

export default function StartsAtEndsAtInput<T extends FieldValues>({
	control,
}: StartsAtEndsAtInputProps<T>) {
	return (
		<div className='grid grid-cols-6 gap-6'>
			<div className='col-span-6 sm:col-span-3'>
				<div className='form-control'>
					<Label text='Starts At' />
					<DateInput
						dayField={'startsAtDay' as Path<T>}
						monthField={'startsAtMonth' as Path<T>}
						yearField={'startsAtYear' as Path<T>}
						control={control}
					/>
				</div>
			</div>
			<div className='col-span-6 sm:col-span-3'>
				<div className='form-control'>
					<Label text='Ends At' />
					<DateInput
						dayField={'endsAtDay' as Path<T>}
						monthField={'endsAtMonth' as Path<T>}
						yearField={'endsAtYear' as Path<T>}
						control={control}
					/>
				</div>
			</div>
		</div>
	);
}
