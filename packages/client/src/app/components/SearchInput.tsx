import SearchIcon from '../icons/SearchIcon';
import Input from './Input';

interface SearchInputProps {
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchInput({ value, onChange }: SearchInputProps) {
	return (
		<div className='input-group input-group-sm'>
			<span className='bg-base-200 btn-sm'>
				<SearchIcon />
			</span>
			<Input size='sm' className='input-sm' value={value} onChange={onChange} type='text' placeholder='Search…' />
		</div>
	);
}
