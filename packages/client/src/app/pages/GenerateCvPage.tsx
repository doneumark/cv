import { useQueries } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import {
	Education, Experience, Job, Profile, Project, VolunteerWork,
} from '@cv/api/interface';
import {
	Routes, Route, Navigate, useNavigate, NavLink,
} from 'react-router-dom';
import clsx from 'clsx';
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
import { useToast } from '../services/toasts';
import Button from '../components/Button';

interface BoxInputProps {
	children: React.ReactNode;
	onChange: () => void;
	value: boolean;
	radio?: boolean
}

function BoxInput({
	children, onChange, value, radio,
}: BoxInputProps) {
	return (
		<div className='card card-bordered border-base-300'>
			<div className='card-body p-3 text-sm'>
				<div className='form-control'>
					<label className='cursor-pointer flex items-center gap-3'>
						{
							radio
								? (
									<input type='radio' checked={value || false} className='radio checkbox-primary radio-sm' onChange={onChange} />
								) : (
									<input type='checkbox' checked={value || false} className='checkbox checkbox-primary checkbox-sm' onChange={onChange} />
								)
						}
						{ children }
					</label>
				</div>
			</div>
		</div>
	);
}

function updateIsSelectedById<
	T extends { id: string, isSelected: boolean },
>(array: T[] | undefined, id: string, value: boolean) {
	return array?.map((element) => {
		if (id === element.id) {
			return { ...element, isSelected: value };
		}

		return element;
	});
}

function ProfileField({ profile }: { profile?: Profile }) {
	return (
		<div>
			<Label text='Profile' />
			<BoxInput value onChange={() => {}}>
				{ profile?.headline || null }
				{ !profile && ('No profile written yet') }
			</BoxInput>
		</div>
	);
}

function ExperienceField({ experiences }: { experiences?: Experience[] }) {
	const { addToast } = useToast();

	const [updatedExperiences, setUpdatedExperiences] = useState(experiences);
	useEffect(() => {
		setUpdatedExperiences(experiences);
	}, [experiences]);

	const toggleUpdatedExperiences = useCallback((experienceId: string, isSelectedValue: boolean) => {
		setUpdatedExperiences((prev) => updateIsSelectedById(prev, experienceId, isSelectedValue));
	}, []);

	const onToggle = useCallback(async (experience: Experience) => {
		const { isSelected, company, id } = experience;

		const oldValue = experience.isSelected;
		const newValue = !oldValue;

		try {
			toggleUpdatedExperiences(id, !isSelected);
			await api.updateExperience(id, { isSelected: newValue });
			addToast({ message: `${company} is now ${newValue ? 'selected' : 'unselected'}`, type: 'success' });
		} catch (err) {
			toggleUpdatedExperiences(experience.id, isSelected);
			addToast({ message: `An error occurred while updating ${company}`, type: 'warning' });
		}
	}, [addToast, toggleUpdatedExperiences]);

	return (
		<div>
			<Label text='Experiences' />
			<div className='space-y-1.5'>
				{ updatedExperiences?.map((experience) => (
					<BoxInput value={experience.isSelected} onChange={() => onToggle(experience)} key={`experience-box-${experience.id}`}>
						<ExperienceBox experience={experience} />
					</BoxInput>
				)) || null }
				{ !updatedExperiences?.length && ('No experiences added yet') }
			</div>
		</div>
	);
}

function EducationField({ educations }: { educations?: Education[] }) {
	const { addToast } = useToast();

	const [updatedEducations, setUpdatedEducations] = useState(educations);
	useEffect(() => {
		setUpdatedEducations(educations);
	}, [educations]);

	const toggleUpdatedEducations = useCallback((educationId: string, isSelectedValue: boolean) => {
		setUpdatedEducations((prev) => updateIsSelectedById(prev, educationId, isSelectedValue));
	}, []);

	const onToggle = useCallback(async (education: Education) => {
		const { isSelected, id, school } = education;

		const oldValue = education.isSelected;
		const newValue = !oldValue;

		try {
			toggleUpdatedEducations(id, !isSelected);
			await api.updateEducation(id, { isSelected: newValue });
			addToast({ message: `${school} is now ${newValue ? 'selected' : 'unselected'}`, type: 'success' });
		} catch (err) {
			toggleUpdatedEducations(education.id, isSelected);
			addToast({ message: `An error occurred while updating ${school}`, type: 'warning' });
		}
	}, [addToast, toggleUpdatedEducations]);

	return (
		<div>
			<Label text='Educations' />
			<div className='space-y-1.5'>
				{ updatedEducations?.map((education) => (
					<BoxInput value={education.isSelected} onChange={() => onToggle(education)} key={`education-box-${education.id}`}>
						<EducationBox education={education} />
					</BoxInput>
				)) || null }
				{ !updatedEducations?.length && ('No educations added yet') }
			</div>
		</div>
	);
}

function ProjectField({ projects }: { projects?: Project[] }) {
	const { addToast } = useToast();

	const [updatedProjects, setUpdatedProjects] = useState(projects);
	useEffect(() => {
		setUpdatedProjects(projects);
	}, [projects]);

	const toggleUpdatedProjects = useCallback((projectId: string, isSelectedValue: boolean) => {
		setUpdatedProjects((prev) => updateIsSelectedById(prev, projectId, isSelectedValue));
	}, []);

	const onToggle = useCallback(async (project: Project) => {
		const { isSelected, id, title } = project;

		const oldValue = project.isSelected;
		const newValue = !oldValue;

		try {
			toggleUpdatedProjects(id, !isSelected);
			await api.updateProject(id, { isSelected: newValue });
			addToast({ message: `${title} is now ${newValue ? 'selected' : 'unselected'}`, type: 'success' });
		} catch (err) {
			toggleUpdatedProjects(project.id, isSelected);
			addToast({ message: `An error occurred while updating ${title}`, type: 'warning' });
		}
	}, [addToast, toggleUpdatedProjects]);

	return (
		<div>
			<Label text='Projects' />
			<div className='space-y-1.5'>
				{ updatedProjects?.map((project) => (
					<BoxInput value={project.isSelected} onChange={() => onToggle(project)} key={`project-box-${project.id}`}>
						<ProjectBox project={project} />
					</BoxInput>
				)) || null }
				{ !updatedProjects?.length && ('No projects added yet') }
			</div>
		</div>
	);
}

function VolunteerField({ volunteerWorks }: { volunteerWorks?: VolunteerWork[] }) {
	const { addToast } = useToast();

	const [updatedVolunteerWorks, setUpdatedVolunteerWorks] = useState(volunteerWorks);
	useEffect(() => {
		setUpdatedVolunteerWorks(volunteerWorks);
	}, [volunteerWorks]);

	const toggleUpdatedVolunteerWorks = useCallback(
		(volunteerWorkId: string, isSelectedValue: boolean) => {
			setUpdatedVolunteerWorks(
				(prev) => updateIsSelectedById(prev, volunteerWorkId, isSelectedValue),
			);
		},
		[],
	);

	const onToggle = useCallback(async (volunteerWork: VolunteerWork) => {
		const { isSelected, id, company } = volunteerWork;

		const oldValue = volunteerWork.isSelected;
		const newValue = !oldValue;

		try {
			toggleUpdatedVolunteerWorks(id, !isSelected);
			await api.updateVolunteerWork(id, { isSelected: newValue });
			addToast({ message: `${company} is now ${newValue ? 'selected' : 'unselected'}`, type: 'success' });
		} catch (err) {
			toggleUpdatedVolunteerWorks(volunteerWork.id, isSelected);
			addToast({ message: `An error occurred while updating ${company}`, type: 'warning' });
		}
	}, [addToast, toggleUpdatedVolunteerWorks]);

	return (
		<div>
			<Label text='Volunteer' />
			<div className='space-y-1.5'>
				{ updatedVolunteerWorks?.map((volunteerWork) => (
					<BoxInput value={volunteerWork.isSelected} onChange={() => onToggle(volunteerWork)} key={`volunteer-work-box-${volunteerWork.id}`}>
						<VolunteerWorkBox volunteerWork={volunteerWork} />
					</BoxInput>
				)) || null }
				{ !updatedVolunteerWorks?.length && ('No volunteer works added yet') }
			</div>
		</div>
	);
}

function JobField({ jobs }: { jobs?: Job[] }) {
	return (
		<div>
			<Label text='Jobs' />
			<div className='space-y-1.5'>
				{ jobs?.map((job) => (
					<BoxInput radio value={false} onChange={() => {}} key={`job-box-${job.id}`}>
						<JobBox job={job} />
					</BoxInput>
				)) || null }
				{ !jobs?.length && ('No jobs added yet') }
			</div>
		</div>
	);
}

export default function GenerateCvPage() {
	const navigate = useNavigate();

	const [
		{ data: experiences, isInitialLoading: isLoadingExperiences },
		{ data: profile, isInitialLoading: isLoadingProfile },
		{ data: educations, isInitialLoading: isLoadingEducation },
		{ data: projects, isInitialLoading: isLoadingProject },
		{ data: volunteerWorks, isInitialLoading: isLoadingVolunteerWorks },
		{ data: jobs, isInitialLoading: isLoadingJobs },
	] = useQueries({
		queries: [
			{ queryKey: ['experiences'], queryFn: api.getExperiences },
			{ queryKey: ['profile'], queryFn: api.getProfile },
			{ queryKey: ['educations'], queryFn: api.getEducations },
			{ queryKey: ['projects'], queryFn: api.getProjects },
			{ queryKey: ['volunteer-works'], queryFn: api.getVolunteerWorks },
			{ queryKey: ['jobs'], queryFn: api.getJobs },
		],
	});

	const isLoading = isLoadingExperiences
	|| isLoadingProfile
	|| isLoadingEducation
	|| isLoadingProject
	|| isLoadingVolunteerWorks
	|| isLoadingJobs;

	return (
		<>
			<PageTitle title='Generate CV' />
			<PageContent>
				<div className='flex justify-center'>
					<div className='steps w-2/5'>
						<NavLink className={({ isActive }) => clsx(['step', isActive && 'step-primary'])} to='you'>
							You
						</NavLink>
						<NavLink className={({ isActive }) => clsx(['step', isActive && 'step-primary'])} to='job'>
							Job
						</NavLink>
						<NavLink className={({ isActive }) => clsx(['step', isActive && 'step-primary'])} to='generate'>
							Generate
						</NavLink>
					</div>
				</div>
				<Routes>
					<Route path='/' element={<Navigate to='you' />} />
					<Route
						path='you'
						element={(
							<LoadingContainer height={400} isLoading={isLoading}>
								<div className='space-y-6'>
									<ProfileField profile={profile} />
									<ExperienceField experiences={experiences} />
									<EducationField educations={educations} />
									<ProjectField projects={projects} />
									<VolunteerField volunteerWorks={volunteerWorks} />

									<div className='flex justify-end'>
										<Button onClick={() => navigate('job')}>
											Next
										</Button>
									</div>
								</div>
							</LoadingContainer>
						)}
					/>
					<Route
						path='job'
						element={(
							<JobField jobs={jobs} />)}
					/>
				</Routes>
			</PageContent>
		</>
	);
}
