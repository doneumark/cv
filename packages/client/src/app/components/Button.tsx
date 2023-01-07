import { clsx } from 'clsx';

export type ButtonProps = {
	type?: 'button' | 'submit' | 'reset';
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	children?: React.ReactNode;
	color?: 'primary' | 'secondary'; // two styling options (you can create as many as you want)
	disabled?: boolean;
	outline?: boolean;
};

export default function Button({
	type = 'button',
	color = 'primary',
	children,
	onClick,
	disabled,
	outline,
}: ButtonProps) {
	return (
		<button
			type={type}
			disabled={disabled}
			onClick={onClick}
			className={clsx([
				'btn',
				`btn-${color}`,
				outline && `btn-outline btn-outline-${color}`,
				disabled && 'btn-disabled',
			])}
		>
			{ children }
		</button>
	);
}
