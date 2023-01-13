import AnimateHeight from 'react-animate-height';
import { useTransition, animated } from '@react-spring/web';
import Spinner from './Spinner';

const ANIMATION_DURATION = 300;

interface LoadingContainerProps {
	isLoading: boolean;
	height: number;
	children: React.ReactNode;
}

export default function LoadingContainer({ isLoading, height, children }: LoadingContainerProps) {
	const transitions = useTransition(isLoading, {
		enter: { opacity: 1 },
		leave: { opacity: 0 },
		config: { duration: ANIMATION_DURATION },
	});

	return (
		<AnimateHeight duration={ANIMATION_DURATION} height={isLoading ? height : 'auto'} className='relative'>
			{
				transitions((opacityStyle, isShow) => (
					isShow && (
						<animated.div
							className='absolute right-0 left-0 top-0 bottom-0 bg-base-100'
							style={opacityStyle}
						>
							<Spinner />
						</animated.div>
					)
				))
			}
			{ children }
		</AnimateHeight>
	);
}
