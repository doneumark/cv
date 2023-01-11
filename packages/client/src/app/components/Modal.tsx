import { useCallback } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
	show: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

function Modal({ show, onClose, children }: ModalProps) {
	const onModalClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	}, [onClose]);

	const onKeyPress = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Escape') {
			onClose();
		}
	}, [onClose]);

	return (
		<>
			<input type='checkbox' className='modal-toggle' checked={show} onChange={() => {}} />
			<div className='modal cursor-pointer' onClick={onModalClick} onKeyDown={onKeyPress} role='button' tabIndex={0}>
				<div className='modal-box relative w-11/12 max-w-3xl cursor-auto'>
					<button className='btn btn-circle absolute btn-ghost right-3 top-3' onClick={onClose}>✕</button>
					{ children }
				</div>
			</div>
		</>
	);
}

export default function ModalPortal(props: ModalProps) {
	return ReactDOM.createPortal(<Modal {...props} />, document.body);
}
