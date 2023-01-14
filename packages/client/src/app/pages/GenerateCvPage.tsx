import { useQuery } from '@tanstack/react-query';
import * as api from '../services/api';
import PageContent from '../components/PageContent';
import PageTitle from '../components/PageTitle';
import LoadingContainer from '../components/LoadingContainer';
import ExperienceBox from '../components/ExperienceBox';
import EducationBox from '../components/EducationBox';
import ProjectBox from '../components/ProjectBox';
import VolunteerWorkBox from '../components/VolunteerWorkBox';
import JobBox from '../components/JobBox';

export default function GenerateCvPage() {
	const { data: profile, isInitialLoading: isLoadingProfile } = useQuery({
		queryKey: ['profile'],
		queryFn: api.getProfile,
	});

	const { data: experiences, isInitialLoading: isLoadingExperiences } = useQuery({
		queryKey: ['experiences'],
		queryFn: api.getExperiences,
	});

	const { data: educations, isInitialLoading: isLoadingEducation } = useQuery({
		queryKey: ['educations'],
		queryFn: api.getEducations,
	});

	const { data: projects, isInitialLoading: isLoadingProject } = useQuery({
		queryKey: ['projects'],
		queryFn: api.getProjects,
	});

	const { data: volunteerWorks, isInitialLoading: isLoadingVolunteerWorks } = useQuery({
		queryKey: ['volunteer-works'],
		queryFn: api.getVolunteerWorks,
	});

	const { data: jobs, isInitialLoading: isLoadingJobs } = useQuery({
		queryKey: ['jobs'],
		queryFn: api.getJobs,
	});

	return (
		<>
			<PageTitle title='Generate CV' />
			<PageContent>
				<div className='space-y-6'>
					<div className='space-y-3'>
						Profile
						<div className='card card-bordered'>
							<div className='card-body p-3'>
								<LoadingContainer height={50} isLoading={isLoadingProfile}>
									<div className='space-y-1.5 mt-1.5' />
									{ profile?.headline || null }
								</LoadingContainer>
							</div>
						</div>
					</div>
					<div className='space-y-3'>
						Experiences
						<LoadingContainer height={50} isLoading={isLoadingExperiences}>
							<div className='space-y-1.5 mt-1.5'>
								{ experiences?.map((experience) => (
									<div className='card card-bordered' key={`experience-box-${experience.id}`}>
										<div className='card-body p-3'>
											<ExperienceBox experience={experience} />
										</div>
									</div>
								)) || null }
								{ !experiences?.length && (
									'No experiences added yet'
								)}
							</div>
						</LoadingContainer>
					</div>

					<div className='space-y-3'>
						Educations
						<div className='card card-bordered'>
							<div className='card-body p-3'>
								<LoadingContainer height={50} isLoading={isLoadingEducation}>
									<div className='space-y-1.5 mt-1.5' />
									{ educations?.map((education) => (
										<EducationBox education={education} />
									)) || null }
									{ !educations?.length && (
										'No educations added yet'
									)}
								</LoadingContainer>
							</div>
						</div>
					</div>
					<div className='space-y-3'>
						Projects
						<div className='card card-bordered'>
							<div className='card-body p-3'>
								<LoadingContainer height={50} isLoading={isLoadingProject}>
									<div className='space-y-1.5 mt-1.5'>
										{ projects?.map((project) => (
											<ProjectBox project={project} />
										)) || null }
										{ !projects?.length && (
											'No projects added yet'
										)}
									</div>
								</LoadingContainer>
							</div>
						</div>
					</div>
					<div className='space-y-3'>
						Volunteer
						<LoadingContainer height={50} isLoading={isLoadingVolunteerWorks}>
							<div className='space-y-1.5 mt-1.5'>
								{ volunteerWorks?.map((volunteerWork) => (
									<div className='card card-bordered'>
										<div className='card-body p-3'>
											<VolunteerWorkBox volunteerWork={volunteerWork} />
										</div>
									</div>
								)) || null }
								{ !volunteerWorks?.length && (
									'No volunteerWorks added yet'
								)}
							</div>
						</LoadingContainer>
					</div>
					<div className='space-y-3'>
						Jobs
						<LoadingContainer height={50} isLoading={isLoadingJobs}>
							<div className='space-y-1.5 mt-1.5'>
								{ jobs?.map((job) => (
									<div className='card card-bordered'>
										<div className='card-body p-3'>
											<JobBox job={job} />
										</div>
									</div>
								)) || null }
								{ !jobs?.length && (
									'No jobs added yet'
								)}
							</div>
						</LoadingContainer>
					</div>
				</div>
			</PageContent>
		</>
	);
}
