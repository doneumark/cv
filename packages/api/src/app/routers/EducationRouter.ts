import * as express from 'express';
import { Education } from '@prisma/client';
import { authenticate, AuthRequest } from '../services/auth';
import prisma from '../prisma';

const getPermittedEducationData = (data: Education) => {
	const {
		field, grade, school, degreeName, description, endsAtDay, endsAtMonth,
		endsAtYear, startsAtDay, startsAtMonth, startsAtYear,
		isSelected,
	} = data;
	return {
		field,
		grade,
		school,
		degreeName,
		description,
		endsAtDay,
		endsAtMonth,
		endsAtYear,
		startsAtDay,
		startsAtMonth,
		startsAtYear,
		isSelected,
	};
};

const EducationRouter = express.Router();

EducationRouter.get('/', authenticate, async (req: AuthRequest, res) => {
	try {
		const educations = await prisma.education.findMany({
			where: {
				userId: req.user.id,
			},
			orderBy: [
				{ startsAtYear: 'desc' },
				{ startsAtMonth: 'desc' },
				{ startsAtDay: 'desc' },
			],
		});

		res.status(200).send(educations);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

EducationRouter.post('/', authenticate, async (req: AuthRequest, res) => {
	try {
		const permittedData = getPermittedEducationData(req.body);

		const newEducation = await prisma.education.create({
			data: {
				...permittedData,
				userId: req.user.id,
			},
		});

		res.status(200).send(newEducation);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

EducationRouter.get('/:educationId', authenticate, async (req: AuthRequest, res) => {
	const { educationId } = req.params;

	try {
		const education = await prisma.education.findUnique({
			where: {
				id: educationId,
			},
		});

		if (!education || education.userId !== req.user.id) {
			throw new Error('Education not found');
		}

		res.status(200).send(education);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

EducationRouter.post('/:educationId', authenticate, async (req: AuthRequest, res) => {
	const { educationId } = req.params;

	try {
		const education = await prisma.education.findUnique({
			where: {
				id: educationId,
			},
		});

		if (!education || education.userId !== req.user.id) {
			throw new Error('Education not found');
		}

		const permittedData = getPermittedEducationData(education);

		const duplicatedEducation = await prisma.education.create({
			data: {
				...permittedData,
				userId: req.user.id,
			},
		});

		res.status(200).send(duplicatedEducation);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

EducationRouter.put('/:educationId', authenticate, async (req: AuthRequest, res) => {
	const { educationId } = req.params;

	try {
		const education = await prisma.education.findUnique({
			where: {
				id: educationId,
			},
		});

		if (!education || education.userId !== req.user.id) {
			throw new Error('Education not found');
		}

		const permittedData = getPermittedEducationData(req.body);

		const updatedEducation = await prisma.education.update({
			where: {
				id: educationId,
			},
			data: permittedData,
		});

		res.status(200).send(updatedEducation);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

EducationRouter.delete('/:educationId', authenticate, async (req: AuthRequest, res) => {
	const { educationId } = req.params;

	try {
		const education = await prisma.education.findUnique({
			where: {
				id: educationId,
			},
		});

		if (!education || education.userId !== req.user.id) {
			throw new Error('Education not found');
		}

		const deletedEducation = await prisma.education.delete({
			where: {
				id: educationId,
			},
		});

		res.status(200).send(deletedEducation);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

export default EducationRouter;
