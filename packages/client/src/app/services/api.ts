import {
	User, Profile, Experience, Job, Education, Project, VolunteerWork,
} from '@cv/api/interface';
import axios from 'axios';
import { UserCounts } from '../stores/UserCountsStore';

const axiosApi = axios.create({
	baseURL: '/api/',
	withCredentials: true,
});

export const auth = () => axiosApi.get<User>('me').then((res) => res.data);
export const login = ({ email, password }: { email: string, password: string }) => axiosApi.post<User>('login', { email, password }).then((res) => res.data);
export const signup = (data: User) => axiosApi.post<User>('signup', data).then((res) => res.data);
export const logout = () => axiosApi.post('logout').then((res) => res.data);

export const getUser = () => axiosApi.get<User>('user').then((res) => res.data);
export const getUserCounts = () => axiosApi.get<UserCounts>('user/counts').then((res) => res.data);
export const updateUser = (data: Partial<User>) => axiosApi.put<User>('user', data).then((res) => res.data);
export const syncFromLinkedin = (linkedinUsername: string | null) => axiosApi.post('user/linkedin', { linkedinUsername }).then((res) => res.data);

export const getProfile = () => axiosApi.get<Profile>('profile').then((res) => res.data);
export const updateProfile = (data: Partial<Profile>) => axiosApi.put<Profile>('profile', data).then((res) => res.data);

export const getExperiences = () => axiosApi.get<Experience[]>('experiences').then((res) => res.data);
export const createExperience = (data: Experience) => axiosApi.post<Experience>('experiences', data).then((res) => res.data);
export const getExperience = (id: string) => axiosApi.get<Experience>(`experiences/${id}`).then((res) => res.data);
export const updateExperience = (id: string, data: Partial<Experience>) => axiosApi.put<Experience>(`experiences/${id}`, data).then((res) => res.data);
export const deleteExperience = (id: string) => axiosApi.delete<Experience>(`experiences/${id}`).then((res) => res.data);

export const getEducations = () => axiosApi.get<Education[]>('educations').then((res) => res.data);
export const createEducation = (data: Education) => axiosApi.post<Education>('educations', data).then((res) => res.data);
export const getEducation = (id: string) => axiosApi.get<Education>(`educations/${id}`).then((res) => res.data);
export const updateEducation = (id: string, data: Partial<Education>) => axiosApi.put<Education>(`educations/${id}`, data).then((res) => res.data);
export const deleteEducation = (id: string) => axiosApi.delete<Education>(`educations/${id}`).then((res) => res.data);

export const getProjects = () => axiosApi.get<Project[]>('projects').then((res) => res.data);
export const createProject = (data: Project) => axiosApi.post<Project>('projects', data).then((res) => res.data);
export const getProject = (id: string) => axiosApi.get<Project>(`projects/${id}`).then((res) => res.data);
export const updateProject = (id: string, data: Partial<Project>) => axiosApi.put<Project>(`projects/${id}`, data).then((res) => res.data);
export const deleteProject = (id: string) => axiosApi.delete<Project>(`projects/${id}`).then((res) => res.data);

export const getVolunteerWorks = () => axiosApi.get<VolunteerWork[]>('volunteer-works').then((res) => res.data);
export const createVolunteerWork = (data: VolunteerWork) => axiosApi.post<VolunteerWork>('volunteer-works', data).then((res) => res.data);
export const getVolunteerWork = (id: string) => axiosApi.get<VolunteerWork>(`volunteer-works/${id}`).then((res) => res.data);
export const updateVolunteerWork = (id: string, data: Partial<VolunteerWork>) => axiosApi.put<VolunteerWork>(`volunteer-works/${id}`, data).then((res) => res.data);
export const deleteVolunteerWork = (id: string) => axiosApi.delete<VolunteerWork>(`volunteer-works/${id}`).then((res) => res.data);

export const getJobs = () => axiosApi.get<Job[]>('jobs').then((res) => res.data);
export const createJob = (data: Job) => axiosApi.post<Job>('jobs', data).then((res) => res.data);
export const getJob = (id: string) => axiosApi.get<Job>(`jobs/${id}`).then((res) => res.data);
export const updateJob = (id: string, data: Partial<Job>) => axiosApi.put<Job>(`jobs/${id}`, data).then((res) => res.data);
export const deleteJob = (id: string) => axiosApi.delete<Job>(`jobs/${id}`).then((res) => res.data);
