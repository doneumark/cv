import { useQuery } from '@tanstack/react-query';
import * as api from '../services/api';
import PageContent from '../components/PageContent';
import PageTitle from '../components/PageTitle';
import LoadingContainer from '../components/LoadingContainer';
import ExperienceBox from '../components/experience/ExperienceBox';
import EducationBox from '../components/education/EducationBox';
import ProjectBox from '../components/project/ProjectBox';
import VolunteerWorkBox from '../components/volunteer-work/VolunteerWorkBox';
import JobBox from '../components/job/JobBox';
import Label from '../components/Label';

interface BoxInputProps {
	children: React.ReactNode;
}

function BoxInput({ children }: BoxInputProps) {
	return (
		<div className='card card-bordered border-base-300'>
			<div className='card-body p-3 text-sm'>
				<div className='form-control'>
					<label className='cursor-pointer flex items-center gap-3'>
						<input type='checkbox' checked className='checkbox checkbox-primary checkbox-sm' />
						{ children }
					</label>
				</div>
			</div>
		</div>
	);
}

function ProfileSection() {
	const { data: profile, isInitialLoading: isLoadingProfile } = useQuery({
		queryKey: ['profile'],
		queryFn: api.getProfile,
	});

	return (
		<div>
			<Label text='Profile' />
			<LoadingContainer height={50} isLoading={isLoadingProfile}>
				<BoxInput>
					{ profile?.headline || null }
					{ !profile && (
						'No profile written yet'
					)}
				</BoxInput>
			</LoadingContainer>
		</div>
	);
}

function ExperienceSection() {
	const { data: experiences, isInitialLoading: isLoadingExperiences } = useQuery({
		queryKey: ['experiences'],
		queryFn: api.getExperiences,
	});

	return (
		<div>
			<Label text='Experiences' />
			<LoadingContainer height={50} isLoading={isLoadingExperiences}>
				<div className='space-y-1.5'>
					{ experiences?.map((experience) => (
						<BoxInput key={`experience-box-${experience.id}`}>
							<ExperienceBox experience={experience} />
						</BoxInput>
					)) || null }
					{ !experiences?.length && (
						'No experiences added yet'
					)}
				</div>
			</LoadingContainer>
		</div>
	);
}

function EducationSection() {
	const { data: educations, isInitialLoading: isLoadingEducation } = useQuery({
		queryKey: ['educations'],
		queryFn: api.getEducations,
	});

	return (
		<div>
			<Label text='Educations' />
			<LoadingContainer height={50} isLoading={isLoadingEducation}>
				<div className='space-y-1.5'>
					{ educations?.map((education) => (
						<BoxInput key={`education-box-${education.id}`}>
							<EducationBox education={education} />
						</BoxInput>
					)) || null }
					{ !educations?.length && (
						'No educations added yet'
					)}
				</div>
			</LoadingContainer>
		</div>
	);
}

function ProjectSection() {
	const { data: projects, isInitialLoading: isLoadingProject } = useQuery({
		queryKey: ['projects'],
		queryFn: api.getProjects,
	});

	return (
		<div>
			<Label text='Projects' />
			<LoadingContainer height={50} isLoading={isLoadingProject}>
				<div className='space-y-1.5'>
					{ projects?.map((project) => (
						<BoxInput key={`project-box-${project.id}`}>
							<ProjectBox project={project} />
						</BoxInput>
					)) || null }
					{ !projects?.length && (
						'No projects added yet'
					)}
				</div>
			</LoadingContainer>
		</div>
	);
}

function VolunteerSection() {
	const { data: volunteerWorks, isInitialLoading: isLoadingVolunteerWorks } = useQuery({
		queryKey: ['volunteer-works'],
		queryFn: api.getVolunteerWorks,
	});

	return (
		<div>
			<Label text='Volunteer' />
			<LoadingContainer height={50} isLoading={isLoadingVolunteerWorks}>
				<div className='space-y-1.5'>
					{ volunteerWorks?.map((volunteerWork) => (
						<BoxInput key={`volunteer-work-box-${volunteerWork.id}`}>
							<VolunteerWorkBox volunteerWork={volunteerWork} />
						</BoxInput>
					)) || null }
					{ !volunteerWorks?.length && (
						'No volunteerWorks added yet'
					)}
				</div>
			</LoadingContainer>
		</div>
	);
}

function JobSection() {
	const { data: jobs, isInitialLoading: isLoadingJobs } = useQuery({
		queryKey: ['jobs'],
		queryFn: api.getJobs,
	});

	return (
		<div>
			<Label text='Jobs' />
			<LoadingContainer height={50} isLoading={isLoadingJobs}>
				<div className='space-y-1.5'>
					{ jobs?.map((job) => (
						<BoxInput key={`job-box-${job.id}`}>
							<JobBox job={job} />
						</BoxInput>
					)) || null }
					{ !jobs?.length && (
						'No jobs added yet'
					)}
				</div>
			</LoadingContainer>
		</div>
	);
}

export default function GenerateCvPage() {
	return (
		<>
			<PageTitle title='Generate CV' />
			<PageContent>
				<div className='space-y-6'>
					<ProfileSection />
					<ExperienceSection />
					<EducationSection />
					<ProjectSection />
					<VolunteerSection />
					<JobSection />
				</div>
			</PageContent>
		</>
	);
}
