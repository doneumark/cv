import { Education } from '@cv/api/interface';
import { parseApiDate } from '../../services/misc';

export interface EducationBoxProps {
	education: Education;
	extended?: boolean;
}

export default function EducationBox({ education, extended }: EducationBoxProps) {
	return (
		<div>
			{ extended ? (
				<>
					<div className='flex items-center gap-3'>
						<div className='card-title'>
							{ education.school }
						</div>
						<h6>{ `${education.degreeName}, ${education.field}` }</h6>
					</div>
					<div className='flex items-center gap-3'>
						<div className='flex items-center'>
							{ parseApiDate(
								education.startsAtDay,
								education.startsAtMonth,
								education.startsAtYear,
							) }
							{ ' - ' }
							{ parseApiDate(
								education.endsAtDay,
								education.endsAtMonth,
								education.endsAtYear,
							) || 'Now' }
						</div>
						{ `${education.description}${education.grade ? ` (Grade: ${education.grade})` : ''}` }
					</div>
				</>
			) : (
				<div className='flex items-center gap-3'>
					<span className='font-bold'>
						{ education.school }
					</span>
					<span>{ `${education.degreeName}, ${education.field}` }</span>
				</div>
			) }
		</div>
	);
}
