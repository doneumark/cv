import { clsx } from 'clsx';

export type TableProps = {
	children?: React.ReactNode;
};

export default function Table({
	children,
}: TableProps) {
	return (
		<div className='overflow-x-auto w-full'>
			<table
				className={clsx([
					'table',
					// 'table-compact',
					'w-full',
					'my-0',
				])}
			>
				{ children }
			</table>
		</div>
	);
}
