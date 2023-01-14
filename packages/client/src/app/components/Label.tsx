export default function Label({ text }: { text: string }) {
	return (
		<label className='label pt-0 pb-1.5'>
			<span className='label-text'>{ text }</span>
		</label>
	);
}
