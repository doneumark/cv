import { Project } from '@cv/api/interface';
import { parseApiDate } from '../services/misc';

export interface ProjectBoxProps {
	project: Project;
	extended?: boolean;
}

export default function ProjectBox({ project, extended }: ProjectBoxProps) {
	return (
		<div>
			<div className='flex items-center gap-3'>
				<div className='card-title'>
					{ project.title }
				</div>
			</div>
			{ extended && (
				<div className='flex items-center gap-3'>
					<div className='flex items-center'>
						{ parseApiDate(
							project.startsAtDay,
							project.startsAtMonth,
							project.startsAtYear,
						) }
						{ ' - ' }
						{ parseApiDate(
							project.endsAtDay,
							project.endsAtMonth,
							project.endsAtYear,
						) || 'Now' }
					</div>
					{ `${project.description}` }
				</div>
			) }
		</div>
	);
}
