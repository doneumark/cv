import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Education } from '@cv/api/interface';
import * as api from '../services/api';
import Button from '../components/Button';
import { parseApiDate, filterByQuery } from '../services/misc';
import SearchInput from '../components/SearchInput';
import Modal from '../components/Modal';
import EducationForm from '../components/EducationForm';
import PageContent from '../components/PageContent';
import PageTitle from '../components/PageTitle';
import PlusIcon from '../icons/PlusIcon';
import PencilIcon from '../icons/PencilIcon';
import LoadingContainer from '../components/LoadingContainer';
import { useFormRoute } from '../services/routes';

interface EducationBoxProps {
	education: Education;
}

function EducationBox({ education }: EducationBoxProps) {
	return (
		<Link className='card card-bordered border-base-300 card-compact hover:shadow-md cursor-pointer flex items-between group' to={education.id}>
			<div className='card-body flex-row items-center justify-between'>
				<div>
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
				</div>
				<div className='hidden group-hover:block'>
					<PencilIcon />
				</div>
			</div>
		</Link>
	);
}

function CreateEducationModal() {
	const { isCreatePath, rootPath: educationsPath } = useFormRoute();
	const navigate = useNavigate();

	return (
		<Modal show={isCreatePath} onClose={() => navigate(educationsPath)}>
			<div className='prose mb-6'>
				<h3>Create Education</h3>
			</div>
			<EducationForm onClose={() => navigate(educationsPath)} />
		</Modal>
	);
}

function UpdateEducationModal() {
	const { isUpdatePath, pathParam: educationId, rootPath: educationsPath } = useFormRoute();
	const navigate = useNavigate();

	const { data: education, isLoading } = useQuery({
		queryKey: ['education', educationId],
		queryFn: () => (educationId ? api.getEducation(educationId) : null),
		enabled: isUpdatePath,
		refetchOnWindowFocus: false,
	});

	return (
		<Modal show={isUpdatePath} onClose={() => navigate(educationsPath)}>
			<div className='prose mb-6'>
				<h3>Update Education</h3>
			</div>
			<LoadingContainer height={400} isLoading={isLoading}>
				<EducationForm
					education={education || undefined}
					onClose={() => navigate(educationsPath)}
				/>
			</LoadingContainer>
		</Modal>
	);
}

export default function Educations() {
	const navigate = useNavigate();
	const [search, setSearch] = useState('');
	const { data: educations, isLoading } = useQuery({
		queryKey: ['educations'],
		queryFn: api.getEducations,
	});

	const filteredEducations = useMemo(
		() => filterByQuery(search, educations || [], ['description', 'school', 'degreeName', 'field']),
		[educations, search],
	);

	return (
		<>
			<PageTitle title='Educations' />
			<PageContent>
				<LoadingContainer height={200} isLoading={isLoading}>
					<div className='space-y-6'>
						<div className='flex justify-between'>
							<SearchInput value={search} onChange={(e) => setSearch(e.target.value)} />
							<Button size='sm' color='secondary' type='submit' className='gap-2' onClick={() => navigate('new')}>
								<PlusIcon />
								Add Education
							</Button>
						</div>

						<div className='space-y-3'>
							{ filteredEducations.map((education) => (
								<EducationBox education={education} key={`education-box-${education.id}`} />
							)) }
							{ !filteredEducations.length && (
								<div className='text-center'>
									No educations added yet
								</div>
							)}
						</div>
					</div>
				</LoadingContainer>
			</PageContent>
			<CreateEducationModal />
			<UpdateEducationModal />
		</>
	);
}
