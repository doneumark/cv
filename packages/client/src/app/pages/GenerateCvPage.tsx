import { useQueries, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
	Education, Experience, Job, Profile, Project, VolunteerWork,
} from '@cv/api/interface';
import {
	Routes, Route, Navigate, useNavigate, NavLink,
} from 'react-router-dom';
import clsx from 'clsx';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { useTransition, animated } from '@react-spring/web';
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
import Spinner from '../components/Spinner';

interface BoxInputProps {
	children: React.ReactNode;
	radio?: boolean
	name: string;
	value?: boolean;
}

function BoxInput({
	children, radio, name, value,
}: BoxInputProps) {
	const formContext = useFormContext();
	const formProps = (name && formContext?.register) ? formContext.register(name) : {};

	return (
		<div className='card card-bordered border-base-300'>
			<div className='card-body p-3 text-sm'>
				<div className='form-control'>
					<label className='cursor-pointer flex items-center gap-3'>
						{
							radio
								? (
									<input type='radio' checked={value} className='radio checkbox-primary radio-sm' {...formProps} />
								) : (
									<input type='checkbox' checked={value} className='checkbox checkbox-primary checkbox-sm' {...formProps} />
								)
						}
						{ children }
					</label>
				</div>
			</div>
		</div>
	);
}

interface CheckboxFormProps<T, K extends keyof T> {
	array?: T[];
	indexField: K;
	isCheckedField: K;
	onSubmit: (isChecked: boolean, element: T) => void;
	children: React.ReactNode;
}

function CheckboxForm<T, K extends keyof T>({
	array, indexField, isCheckedField, onSubmit, children,
}: CheckboxFormProps<T, K>) {
	const methods = useForm();

	const { watch, reset, setValue } = methods;
	useEffect(() => {
		reset(array?.reduce(
			(rest, element) => ({ ...rest, [element[indexField] as string]: element[isCheckedField] }),
			{},
		) || {});
	}, [reset, array, isCheckedField, indexField]);

	useEffect(() => {
		const subscription = watch(async (value, { name: index, type }) => {
			if (!type) {
				return;
			}

			if (!index || !array) {
				return;
			}

			const element = array?.find((elem) => elem[indexField] === index);
			if (!element) {
				return;
			}

			const newIsCheckedValue = value[index];
			try {
				await onSubmit(newIsCheckedValue, element);
			} catch (err) {
				setValue(index, !newIsCheckedValue);
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [watch, array, indexField, onSubmit, setValue]);

	return (
		<FormProvider {...methods}>
			<form>
				{ children }
			</form>
		</FormProvider>
	);
}

function ProfileField({ profile }: { profile?: Profile }) {
	return (
		<div>
			<Label text='Profile' />
			<BoxInput value name='profileField'>
				{ profile?.headline || null }
				{ !profile && ('No profile written yet') }
			</BoxInput>
		</div>
	);
}

function ExperienceField({ experiences }: { experiences?: Experience[] }) {
	const { addToast } = useToast();

	return (
		<CheckboxForm
			onSubmit={async (isChecked, element) => {
				const { id, company } = element;
				try {
					await api.updateExperience(id, { isSelected: isChecked });
					addToast({ message: `${company} is now ${isChecked ? 'selected' : 'unselected'}`, type: 'success' });
				} catch (err) {
					addToast({ message: `An error occurred while updating ${company}`, type: 'warning' });
					throw err;
				}
			}}
			indexField='id'
			isCheckedField='isSelected'
			array={experiences}
		>
			<Label text='Experiences' />
			<div className='space-y-1.5'>
				{ experiences?.map((experience) => (
					<BoxInput name={experience.id} key={`experience-box-${experience.id}`}>
						<ExperienceBox experience={experience} />
					</BoxInput>
				)) || null }
				{ !experiences?.length && ('No experiences added yet') }
			</div>
		</CheckboxForm>
	);
}

function EducationField({ educations }: { educations?: Education[] }) {
	const { addToast } = useToast();

	return (
		<CheckboxForm
			onSubmit={async (isChecked, element) => {
				const { id, school } = element;
				try {
					await api.updateEducation(id, { isSelected: isChecked });
					addToast({ message: `${school} is now ${isChecked ? 'selected' : 'unselected'}`, type: 'success' });
				} catch (err) {
					addToast({ message: `An error occurred while updating ${school}`, type: 'warning' });
					throw err;
				}
			}}
			indexField='id'
			isCheckedField='isSelected'
			array={educations}
		>
			<Label text='Educations' />
			<div className='space-y-1.5'>
				{ educations?.map((education) => (
					<BoxInput name={education.id} key={`education-box-${education.id}`}>
						<EducationBox education={education} />
					</BoxInput>
				)) || null }
				{ !educations?.length && ('No educations added yet') }
			</div>
		</CheckboxForm>
	);
}

function ProjectField({ projects }: { projects?: Project[] }) {
	const { addToast } = useToast();

	return (
		<CheckboxForm
			onSubmit={async (isChecked, element) => {
				const { id, title } = element;
				try {
					await api.updateProject(id, { isSelected: isChecked });
					addToast({ message: `${title} is now ${isChecked ? 'selected' : 'unselected'}`, type: 'success' });
				} catch (err) {
					addToast({ message: `An error occurred while updating ${title}`, type: 'warning' });
					throw err;
				}
			}}
			indexField='id'
			isCheckedField='isSelected'
			array={projects}
		>
			<Label text='Projects' />
			<div className='space-y-1.5'>
				{ projects?.map((project) => (
					<BoxInput name={project.id} key={`project-box-${project.id}`}>
						<ProjectBox project={project} />
					</BoxInput>
				)) || null }
				{ !projects?.length && ('No projects added yet') }
			</div>
		</CheckboxForm>
	);
}

function VolunteerField({ volunteerWorks }: { volunteerWorks?: VolunteerWork[] }) {
	const { addToast } = useToast();

	return (
		<CheckboxForm
			onSubmit={async (isChecked, element) => {
				const { id, company } = element;
				try {
					await api.updateVolunteerWork(id, { isSelected: isChecked });
					addToast({ message: `${company} is now ${isChecked ? 'selected' : 'unselected'}`, type: 'success' });
				} catch (err) {
					addToast({ message: `An error occurred while updating ${company}`, type: 'warning' });
					throw err;
				}
			}}
			indexField='id'
			isCheckedField='isSelected'
			array={volunteerWorks}
		>
			<Label text='Volunteer' />
			<div className='space-y-1.5'>
				{ volunteerWorks?.map((volunteerWork) => (
					<BoxInput name={volunteerWork.id} key={`volunteer-work-box-${volunteerWork.id}`}>
						<VolunteerWorkBox volunteerWork={volunteerWork} />
					</BoxInput>
				)) || null }
				{ !volunteerWorks?.length && ('No volunteer works added yet') }
			</div>
		</CheckboxForm>
	);
}

function JobField({ jobs }: { jobs?: Job[] }) {
	return (
		<div>
			<Label text='Jobs' />
			<div className='space-y-1.5'>
				{ jobs?.map((job) => (
					<BoxInput radio name='jobId' key={`job-box-${job.id}`}>
						<JobBox job={job} />
					</BoxInput>
				)) || null }
				{ !jobs?.length && ('No jobs added yet') }
			</div>
		</div>
	);
}

function UserData() {
	const navigate = useNavigate();

	const [
		{ data: experiences, isInitialLoading: isLoadingExperiences },
		{ data: profile, isInitialLoading: isLoadingProfile },
		{ data: educations, isInitialLoading: isLoadingEducation },
		{ data: projects, isInitialLoading: isLoadingProject },
		{ data: volunteerWorks, isInitialLoading: isLoadingVolunteerWorks },
	] = useQueries({
		queries: [
			{
				queryKey: ['experiences'], queryFn: api.getExperiences, refetchOnWindowFocus: false,
			},
			{ queryKey: ['profile'], queryFn: api.getProfile, refetchOnWindowFocus: false },
			{ queryKey: ['educations'], queryFn: api.getEducations, refetchOnWindowFocus: false },
			{ queryKey: ['projects'], queryFn: api.getProjects, refetchOnWindowFocus: false },
			{ queryKey: ['volunteer-works'], queryFn: api.getVolunteerWorks, refetchOnWindowFocus: false },
			{ queryKey: ['jobs'], queryFn: api.getJobs, refetchOnWindowFocus: false },
		],
	});

	const isLoading = isLoadingExperiences
	|| isLoadingProfile
	|| isLoadingEducation
	|| isLoadingProject
	|| isLoadingVolunteerWorks;

	const [showNextButton, setShowNextButton] = useState(!isLoading);

	const transitions = useTransition(showNextButton, {
		from: { opacity: 0 },
		enter: { opacity: 1 },
	});

	return (
		<LoadingContainer
			height={400}
			isLoading={isLoading}
			onAnimationEnd={() => setShowNextButton(true)}
		>
			<div className='space-y-6'>
				<ProfileField profile={profile} />
				<ExperienceField experiences={experiences} />
				<EducationField educations={educations} />
				<ProjectField projects={projects} />
				<VolunteerField volunteerWorks={volunteerWorks} />
			</div>
			{
				transitions((opacityStyle, isShow) => (
					isShow && (
						<animated.div
							className='flex -mb-6 -mr-6 -ml-6 p-6 justify-end sticky bottom-0 bg-base-100'
							style={opacityStyle}
						>
							<Button onClick={() => navigate('../job')}>
								Next
							</Button>
						</animated.div>
					)
				))
			}
		</LoadingContainer>
	);
}

export default function GenerateCvPage() {
	const navigate = useNavigate();
	const { data: jobs } = useQuery({
		queryKey: ['jobs'],
		queryFn: api.getJobs,
		refetchOnWindowFocus: false,
	});

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
						element={<UserData />}
					/>
					<Route
						path='job'
						element={(
							<>
								<JobField jobs={jobs} />
								<div className='flex mt-6 justify-end'>
									<Button onClick={() => navigate('../generate')}>
										Next
									</Button>
								</div>
							</>
						)}
					/>
					<Route
						path='generate'
						element={(
							<div style={{ height: 200 }}>
								Generating CV ua39-asj3-asd3-asd3... (CV already craeted in db, just waiting for streaming of "finish")
								<Spinner />
							</div>
						)}
					/>

				</Routes>
			</PageContent>
		</>
	);
}
