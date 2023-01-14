import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as api from '../services/api';
import Button from '../components/Button';
import { filterByQuery } from '../services/misc';
import SearchInput from '../components/SearchInput';
import Modal from '../components/Modal';
import EducationForm from '../components/education/EducationForm';
import PageContent from '../components/PageContent';
import PageTitle from '../components/PageTitle';
import PlusIcon from '../icons/PlusIcon';
import LoadingContainer from '../components/LoadingContainer';
import { useFormRoute } from '../services/routes';
import EducationBox from '../components/education/EducationBox';
import BoxLink from '../components/BoxLinkContainer';

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

	const { data: education, isInitialLoading } = useQuery({
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
			<LoadingContainer height={400} isLoading={isInitialLoading}>
				<EducationForm
					education={education || undefined}
					onClose={() => navigate(educationsPath)}
				/>
			</LoadingContainer>
		</Modal>
	);
}

function Educations() {
	const navigate = useNavigate();
	const [search, setSearch] = useState('');
	const {
		data: educations, isInitialLoading, isSuccess, error,
	} = useQuery({
		queryKey: ['educations'],
		queryFn: api.getEducations,
	});

	const filteredEducations = useMemo(
		() => filterByQuery(search, educations || [], ['description', 'school', 'degreeName', 'field']),
		[educations, search],
	);

	return (
		<LoadingContainer height={200} isLoading={isInitialLoading}>
			<div className='space-y-6'>
				<div className='flex justify-between'>
					<SearchInput value={search} onChange={(e) => setSearch(e.target.value)} />
					<Button size='sm' color='secondary' type='submit' className='gap-2' onClick={() => navigate('new')}>
						<PlusIcon />
						Add Education
					</Button>
				</div>
				{
					isSuccess && (
						filteredEducations.length > 0
							? (
								<div className='space-y-3'>
									{ filteredEducations.map((education) => (
										<BoxLink to={education.id} key={`education-box-${education.id}`}>
											<EducationBox extended education={education} />
										</BoxLink>
									)) }
								</div>
							)
							: (
								<div className='text-center'>
									No educations added yet
								</div>
							)
					)
				}
				{ error ? (
					<div className='text-center text-error'>
						{ error instanceof Error ? error.message : 'Unknown Error' }
					</div>
				) : null }
			</div>
		</LoadingContainer>
	);
}

export default function EducationsPage() {
	return (
		<>
			<PageTitle title='Educations' />
			<PageContent>
				<Educations />
			</PageContent>
			<CreateEducationModal />
			<UpdateEducationModal />
		</>
	);
}
