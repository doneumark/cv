import AnimateHeight from 'react-animate-height';
import Spinner from './Spinner';

interface LoadingContainerProps {
	isLoading: boolean;
	children: React.ReactNode;
}

export default function LoadingContainer({ isLoading, children }: LoadingContainerProps) {
	return (
		<AnimateHeight
			duration={300}
			height={isLoading ? 400 : 'auto'}
			className='h-full'
		>
			{ isLoading
				? (
					<div style={{ height: 400 }}>
						<Spinner />
					</div>
				)
				: (
					children
				)}
		</AnimateHeight>
	);
}
