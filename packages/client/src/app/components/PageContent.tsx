interface PageTitleProps {
	children: React.ReactNode;
}

export default function PageTitle({ children }: PageTitleProps) {
	return (
		<div className='card bg-base-100 card-bordered border-base-300'>
			<div className='card-body p-6'>
				{ children }
			</div>
		</div>
	);
}
