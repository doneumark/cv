import { Link } from 'react-router-dom';
import PencilIcon from '../icons/PencilIcon';

interface BoxLinkProps {
	to: string;
	children: React.ReactNode;
}

export default function BoxLink({ to, children }: BoxLinkProps) {
	return (
		<Link className='card card-bordered border-base-300 card-compact hover:shadow-md cursor-pointer flex items-between group' to={to}>
			<div className='card-body flex-row items-center justify-between'>
				{ children }
				<div className='hidden group-hover:block'>
					<PencilIcon />
				</div>
			</div>
		</Link>
	);
}
