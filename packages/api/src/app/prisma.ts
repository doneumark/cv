import { PrismaClient } from '@prisma/client';
import { getLinkedinDataFromUsername } from './services/linkedin';

const prismaBase = new PrismaClient();

export default prismaBase.$extends({
	result: {
		user: {
			syncFromLinkedin: {
				needs: { id: true, linkedinUsername: true },
				compute(user) {
					return async () => {
						const linkedinData = await getLinkedinDataFromUsername(user.linkedinUsername);
						return prismaBase.user.update({
							where: { id: user.id },
							data: {
								profile: {
									create: {
										headline: linkedinData.headline,
										occupation: linkedinData.occupation,
										summary: linkedinData.summary,
									},
								},
								educations: {
									create: linkedinData.education.map((education) => ({
										school: education.school,
										degree: education.degree_name,
										field: education.field_of_study,
										startsAtDay: education.starts_at.day,
										startsAtMonth: education.starts_at.month,
										startsAtYear: education.starts_at.year,
										endsAtDay: education.ends_at.day,
										endsAtMonth: education.ends_at.month,
										endsAtYear: education.ends_at.year,
									})),
								},
								experiences: {
									create: linkedinData.experiences.map((experience) => ({
										company: experience.company,
										title: experience.title,
										startsAtDay: experience.starts_at.day,
										startsAtMonth: experience.starts_at.month,
										startsAtYear: experience.starts_at.year,
										endsAtDay: experience.ends_at.day,
										endsAtMonth: experience.ends_at.month,
										endsAtYear: experience.ends_at.year,
									})),
								},
								projects: {
									create: linkedinData.accomplishment_projects.map((project) => ({
										title: project.title,
										description: project.description,
										startsAtDay: project.starts_at.day,
										startsAtMonth: project.starts_at.month,
										startsAtYear: project.starts_at.year,
										endsAtDay: project.ends_at.day,
										endsAtMonth: project.ends_at.month,
										endsAtYear: project.ends_at.year,
									})),
								},
								volunteerWorks: {
									create: linkedinData.volunteer_work.map((volunteer) => ({
										title: volunteer.title,
										description: volunteer.description,
										cause: volunteer.cause,
										company: volunteer.company,
										startsAtDay: volunteer.starts_at.day,
										startsAtMonth: volunteer.starts_at.month,
										startsAtYear: volunteer.starts_at.year,
										endsAtDay: volunteer.ends_at.day,
										endsAtMonth: volunteer.ends_at.month,
										endsAtYear: volunteer.ends_at.year,
									})),
								},
							},
						});
					};
				},
			},
			comparePassword: {
				needs: { password: true },
				compute(user) {
					return (password: string): boolean => (user.password === password);
				},
			},
		},
	},
});
