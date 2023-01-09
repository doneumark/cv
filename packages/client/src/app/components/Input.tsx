import React, { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	className?: string,
}

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
