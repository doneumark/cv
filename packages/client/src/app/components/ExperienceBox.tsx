import { Experience } from '@cv/api/interface';
import { parseApiDate } from '../services/misc';

export interface ExperienceBoxProps {
	experience: Experience;
	extended?: boolean;
}

export default function ExperienceBox({ experience, extended }: ExperienceBoxProps) {
	return (
		<div>
			<div className='flex items-center gap-3'>
				<div className='card-title'>
					{ experience.company }
				</div>
				<h6>{ experience.title }</h6>
			</div>
			{ extended && (
				<div className='flex items-center gap-3'>
					<div className='flex items-center'>
						{ parseApiDate(
							experience.startsAtDay,
							experience.startsAtMonth,
							experience.startsAtYear,
						) }
						{ ' - ' }
						{ parseApiDate(
							experience.endsAtDay,
							experience.endsAtMonth,
							experience.endsAtYear,
						) || 'Now' }
					</div>
					{ experience.description }
				</div>
			) }
		</div>
	);
}
