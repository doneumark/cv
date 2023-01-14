import { VolunteerWork } from '@cv/api/interface';
import { parseApiDate } from '../../services/misc';

export interface VolunteerWorkBoxProps {
	volunteerWork: VolunteerWork;
	extended?: boolean;

}

export default function VolunteerWorkBox({ volunteerWork, extended }: VolunteerWorkBoxProps) {
	return (
		<div>
			{ extended ? (
				<>
					<div className='flex items-center gap-3'>
						<div className='card-title'>
							{ volunteerWork.company }
						</div>
						<h6>{ `${volunteerWork.title}${volunteerWork.cause ? `, ${volunteerWork.cause}` : ''}`}</h6>
					</div>
					<div className='flex items-center gap-3'>
						<div className='flex items-center'>
							{ parseApiDate(
								volunteerWork.startsAtDay,
								volunteerWork.startsAtMonth,
								volunteerWork.startsAtYear,
							) }
							{ ' - ' }
							{ parseApiDate(
								volunteerWork.endsAtDay,
								volunteerWork.endsAtMonth,
								volunteerWork.endsAtYear,
							) || 'Now' }
						</div>
						{ volunteerWork.description }
					</div>
				</>
			) : (
				<div className='flex items-center gap-3'>
					<span className='font-bold'>
						{ volunteerWork.company }
					</span>
					<span>{ `${volunteerWork.title}${volunteerWork.cause ? `, ${volunteerWork.cause}` : ''}`}</span>
				</div>
			)}
		</div>
	);
}
