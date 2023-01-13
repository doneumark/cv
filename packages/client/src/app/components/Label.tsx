export default function Label({ text }: { text: string }) {
	return (
		<label className='label pt-0 pb-2'>
			<span className='label-text'>{ text }</span>
		</label>
	);
}
