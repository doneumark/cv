import ReactDOM from 'react-dom';

interface ModalProps {
	show: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

function Modal({ show, onClose, children }: ModalProps) {
	return (
		<>
			<input type='checkbox' className='modal-toggle' checked={show} />
			<div className='modal'>
				<div className='modal-box w-11/12 max-w-5xl'>
					{ children }
					<div className='modal-action'>
						<button className='btn' onClick={onClose}>Yay!</button>
					</div>
				</div>
			</div>
		</>
	);
}

export default function ModalPortal(props: ModalProps) {
	return ReactDOM.createPortal(<Modal {...props} />, document.body);
}
