import Input from './Input';

interface SearchInputProps {
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchInput({ value, onChange }: SearchInputProps) {
	return (
		<div className='input-group input-group-sm'>
			<span className='bg-base-200 btn-sm'>
				<svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
					<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
				</svg>
			</span>
			<Input size='sm' value={value} onChange={onChange} type='text' placeholder='Search…' />
		</div>
	);
}
