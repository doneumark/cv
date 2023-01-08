import { User as PrismaUser } from '@prisma/client';
import { Education } from './Education';
import { Profile } from './Profile';
import { VolunteerWork } from './VolunteerWork';
import { Experience } from './Experience';
import { Project } from './Project';

export interface User extends PrismaUser {
	profile: Profile;
	experiences: Experience[];
	educations: Education[];
	projects: Project[];
	volunteerWorks: VolunteerWork[];
}
