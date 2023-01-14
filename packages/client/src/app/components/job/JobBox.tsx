import { Job } from '@cv/api/interface';

export interface JobBoxProps {
	job: Job;
	extended?: boolean;
}

export default function JobBox({ job, extended }: JobBoxProps) {
	return (
		<div>
			{ extended ? (
				<>
					<div className='flex items-center gap-3'>
						<div className='card-title'>
							{ job.title }
						</div>
					</div>
					<div className='flex items-center gap-3'>
						{ `${job.description}` }
					</div>
				</>
			) : (
				<span className='font-bold'>
					{ job.title }
				</span>
			)}
		</div>
	);
}
