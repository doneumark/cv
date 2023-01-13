import { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { useTransition, animated, SpringValue } from '@react-spring/web';
import { clsx } from 'clsx';
import ToastsState, { Toast } from '../state/ToastsState';

const generateRandomId = () => Math.floor((1 + Math.random()) * 0x10000)
	.toString(16)
	.substring(1);

type ToastToCreateType = Omit<Toast, keyof { id: string; }>;

export function useToast() {
	const [, setToasts] = useRecoilState(ToastsState);

	const addToast = useCallback((toast: ToastToCreateType) => {
		const newToast: Toast = { id: generateRandomId(), ...toast };
		setToasts((toasts) => [newToast, ...toasts]);

		return newToast;
	}, [setToasts]);

	const removeToast = useCallback((toast: Toast) => {
		setToasts((toasts) => (
			toasts.filter((t) => t.id !== toast.id)
		));
	}, [setToasts]);

	return { addToast, removeToast };
}

function ToastIcon({ type }: { type: Toast['type'] }) {
	if (type === 'success') {
		return (
			<svg xmlns='http://www.w3.org/2000/svg' className='stroke-current flex-shrink-0 h-6 w-6' fill='none' viewBox='0 0 24 24'>
				<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
			</svg>
		);
	}

	if (type === 'warning') {
		return (
			<svg xmlns='http://www.w3.org/2000/svg' className='stroke-current flex-shrink-0 h-6 w-6' fill='none' viewBox='0 0 24 24'>
				<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
			</svg>
		);
	}

	if (type === 'error') {
		return (
			<svg xmlns='http://www.w3.org/2000/svg' className='stroke-current flex-shrink-0 h-6 w-6' fill='none' viewBox='0 0 24 24'>
				<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' />
			</svg>
		);
	}

	if (type === 'info') {
		return (
			<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' className='stroke-info flex-shrink-0 w-6 h-6'>
				<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
			</svg>
		);
	}

	return null;
}

interface ToastElementInterface {
	toast: Toast;
	style: { opacity: SpringValue<number> };
}

function ToastElement({ toast, style }: ToastElementInterface) {
	const { removeToast } = useToast();

	useEffect(() => {
		const toastTimeout = setTimeout(() => {
			removeToast(toast);
		}, 5000);

		return () => {
			clearTimeout(toastTimeout);
		};
	});

	const onClick = () => {
		removeToast(toast);
	};

	return (
		<animated.div
			className={clsx(['alert shadow-xl', toast.type && `alert-${toast.type}`])}
			style={style}
			onClick={onClick}
			role='button'
			onKeyDown={() => {}}
			tabIndex={0}
		>
			<div>
				<ToastIcon type={toast.type} />
				<span>{ toast.message }</span>
			</div>
		</animated.div>
	);
}

export function ToastContainer() {
	const [toasts] = useRecoilState(ToastsState);

	const transitions = useTransition(toasts, {
		from: {
			opacity: 1, height: '0rem', paddingTop: '0rem', paddingBottom: '0rem',
		},
		enter: {
			opacity: 1, height: '3.5rem', paddingTop: '1rem', paddingBottom: '1rem',
		},
		leave: {
			opacity: 0, height: '0rem', paddingTop: '0rem', paddingBottom: '0rem',
		},
	});

	return (
		<div className='toast toast-top toast-end absolute'>
			{
				transitions((style, toast) => (
					<ToastElement style={style} toast={toast} />
				))
			}
		</div>
	);
}
