import * as express from 'express';
import { Experience } from '@prisma/client';
import { authenticate, AuthRequest } from '../services/auth';
import prisma from '../prisma';

const getPermittedExperienceData = (data: Experience) => {
	const {
		title, description, company, endsAtDay, endsAtMonth,
		endsAtYear, startsAtDay, startsAtMonth, startsAtYear,
		isSelected,
	} = data;
	return {
		title,
		description,
		company,
		endsAtDay,
		endsAtMonth,
		endsAtYear,
		startsAtDay,
		startsAtMonth,
		startsAtYear,
		isSelected,
	};
};

const ExperienceRouter = express.Router();

ExperienceRouter.get('/', authenticate, async (req: AuthRequest, res) => {
	try {
		const experiences = await prisma.experience.findMany({
			where: {
				userId: req.user.id,
			},
			orderBy: [
				{ startsAtYear: 'desc' },
				{ startsAtMonth: 'desc' },
				{ startsAtDay: 'desc' },
			],
		});

		res.status(200).send(experiences);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

ExperienceRouter.post('/', authenticate, async (req: AuthRequest, res) => {
	try {
		const permittedData = getPermittedExperienceData(req.body);

		const newExperience = await prisma.experience.create({
			data: {
				...permittedData,
				userId: req.user.id,
			},
		});

		res.status(200).send(newExperience);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

ExperienceRouter.get('/:experienceId', authenticate, async (req: AuthRequest, res) => {
	const { experienceId } = req.params;

	try {
		const experience = await prisma.experience.findUnique({
			where: {
				id: experienceId,
			},
		});

		if (!experience || experience.userId !== req.user.id) {
			throw new Error('Experience not found');
		}

		res.status(200).send(experience);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

ExperienceRouter.post('/:experienceId', authenticate, async (req: AuthRequest, res) => {
	const { experienceId } = req.params;

	try {
		const experience = await prisma.experience.findUnique({
			where: {
				id: experienceId,
			},
		});

		if (!experience || experience.userId !== req.user.id) {
			throw new Error('Experience not found');
		}

		const permittedData = getPermittedExperienceData(experience);

		const duplicatedExperience = await prisma.experience.create({
			data: {
				...permittedData,
				userId: req.user.id,
			},
		});

		res.status(200).send(duplicatedExperience);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

ExperienceRouter.put('/:experienceId', authenticate, async (req: AuthRequest, res) => {
	const { experienceId } = req.params;

	try {
		const experience = await prisma.experience.findUnique({
			where: {
				id: experienceId,
			},
		});

		if (!experience || experience.userId !== req.user.id) {
			throw new Error('Experience not found');
		}

		const permittedData = getPermittedExperienceData(req.body);

		const updatedExperience = await prisma.experience.update({
			where: {
				id: experienceId,
			},
			data: permittedData,
		});

		res.status(200).send(updatedExperience);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

ExperienceRouter.delete('/:experienceId', authenticate, async (req: AuthRequest, res) => {
	const { experienceId } = req.params;

	try {
		const experience = await prisma.experience.findUnique({
			where: {
				id: experienceId,
			},
		});

		if (!experience || experience.userId !== req.user.id) {
			throw new Error('Experience not found');
		}

		const deletedExperience = await prisma.experience.delete({
			where: {
				id: experienceId,
			},
		});

		res.status(200).send(deletedExperience);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

export default ExperienceRouter;
