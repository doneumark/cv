import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

type Modify<T, R> = Omit<T, keyof R> & R;

export type InputProps = Modify<InputHTMLAttributes<HTMLInputElement>, {
	size?: 'lg' | 'md' | 'sm';
}>;

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, size, ...inputProps }, ref) => (
		<input
			{...inputProps}
			ref={ref}
			className={clsx([
				'input input-bordered',
				size && `input-${size}`,
				className,
			])}
		/>
	),
);

export default Input;
