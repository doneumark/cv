import { clsx } from 'clsx';

export type InputProps = {
	type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local' | 'month' | 'week' | 'range' | 'color' | 'file' | 'image' | 'submit' | 'reset' | 'button';
	disabled?: boolean;
	onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	value?: string;
};

export default function Input({
	type = 'text',
	value = '',
	disabled,
	onFocus,
	onBlur,
	onChange,
	placeholder,
}: InputProps) {
	return (
		<input
			type={type}
			disabled={disabled}
			onFocus={onFocus}
			onBlur={onBlur}
			onChange={onChange}
			placeholder={placeholder}
			value={value}
			className={clsx([
				'input input-bordered',
			])}
		/>
	);
}
