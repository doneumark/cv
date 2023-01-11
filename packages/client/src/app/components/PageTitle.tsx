interface PageTitleProps {
	title: string;
}

export default function PageTitle({ title }: PageTitleProps) {
	return (
		<div className='prose'>
			<h1 className='my-6'>{ title }</h1>
		</div>
	);
}
