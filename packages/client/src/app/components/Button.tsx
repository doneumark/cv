import { clsx } from 'clsx';

export type ButtonProps = {
	type?: 'button' | 'submit' | 'reset';
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	children?: React.ReactNode;
	color?: 'primary' | 'secondary' | 'accent' | 'success';
	disabled?: boolean;
	outline?: boolean;
	loading?: boolean;
	block?: boolean;
	className?: string;
};

export default function Button({
	type,
	color,
	children,
	onClick,
	disabled,
	outline,
	loading,
	block,
	className,
}: ButtonProps) {
	return (
		<button
			type={type}
			disabled={disabled}
			onClick={onClick}
			className={clsx([
				'btn',
				color && `btn-${color}`,
				outline && 'btn-outline',
				color && outline && `btn-outline-${color}`,
				disabled && 'btn-disabled',
				loading && 'loading',
				block && 'btn-block',
				className,
			])}
		>
			{ children }
		</button>
	);
}
