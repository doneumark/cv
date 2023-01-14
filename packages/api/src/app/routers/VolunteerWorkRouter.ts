import * as express from 'express';
import { VolunteerWork } from '@prisma/client';
import { authenticate, AuthRequest } from '../services/auth';
import prisma from '../prisma';

const getPermittedVolunteerWorkData = (data: VolunteerWork) => {
	const {
		title, description, cause, company, endsAtDay, endsAtMonth,
		endsAtYear, startsAtDay, startsAtMonth, startsAtYear,
	} = data;
	return {
		title,
		description,
		cause,
		company,
		endsAtDay,
		endsAtMonth,
		endsAtYear,
		startsAtDay,
		startsAtMonth,
		startsAtYear,
	};
};

const VolunteerWorkRouter = express.Router();

VolunteerWorkRouter.get('/', authenticate, async (req: AuthRequest, res) => {
	try {
		const volunteerWorks = await prisma.volunteerWork.findMany({
			where: {
				userId: req.user.id,
			},
			orderBy: [
				{ startsAtYear: 'desc' },
				{ startsAtMonth: 'desc' },
				{ startsAtDay: 'desc' },
			],
		});

		res.status(200).send(volunteerWorks);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

VolunteerWorkRouter.post('/', authenticate, async (req: AuthRequest, res) => {
	try {
		const permittedData = getPermittedVolunteerWorkData(req.body);

		const newVolunteerWork = await prisma.volunteerWork.create({
			data: {
				...permittedData,
				userId: req.user.id,
			},
		});

		res.status(200).send(newVolunteerWork);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

VolunteerWorkRouter.get('/:volunteerWorkId', authenticate, async (req: AuthRequest, res) => {
	const { volunteerWorkId } = req.params;

	try {
		const volunteerWork = await prisma.volunteerWork.findUnique({
			where: {
				id: volunteerWorkId,
			},
		});

		if (!volunteerWork || volunteerWork.userId !== req.user.id) {
			throw new Error('VolunteerWork not found');
		}

		res.status(200).send(volunteerWork);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

VolunteerWorkRouter.post('/:volunteerWorkId', authenticate, async (req: AuthRequest, res) => {
	const { volunteerWorkId } = req.params;

	try {
		const volunteerWork = await prisma.volunteerWork.findUnique({
			where: {
				id: volunteerWorkId,
			},
		});

		if (!volunteerWork || volunteerWork.userId !== req.user.id) {
			throw new Error('VolunteerWork not found');
		}

		const permittedData = getPermittedVolunteerWorkData(volunteerWork);

		const duplicatedVolunteerWork = await prisma.volunteerWork.create({
			data: {
				...permittedData,
				userId: req.user.id,
			},
		});

		res.status(200).send(duplicatedVolunteerWork);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

VolunteerWorkRouter.put('/:volunteerWorkId', authenticate, async (req: AuthRequest, res) => {
	const { volunteerWorkId } = req.params;

	try {
		const volunteerWork = await prisma.volunteerWork.findUnique({
			where: {
				id: volunteerWorkId,
			},
		});

		if (!volunteerWork || volunteerWork.userId !== req.user.id) {
			throw new Error('VolunteerWork not found');
		}

		const permittedData = getPermittedVolunteerWorkData(req.body);

		const updatedVolunteerWork = await prisma.volunteerWork.update({
			where: {
				id: volunteerWorkId,
			},
			data: permittedData,
		});

		res.status(200).send(updatedVolunteerWork);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

VolunteerWorkRouter.delete('/:volunteerWorkId', authenticate, async (req: AuthRequest, res) => {
	const { volunteerWorkId } = req.params;

	try {
		const volunteerWork = await prisma.volunteerWork.findUnique({
			where: {
				id: volunteerWorkId,
			},
		});

		if (!volunteerWork || volunteerWork.userId !== req.user.id) {
			throw new Error('VolunteerWork not found');
		}

		const deletedVolunteerWork = await prisma.volunteerWork.delete({
			where: {
				id: volunteerWorkId,
			},
		});

		res.status(200).send(deletedVolunteerWork);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

export default VolunteerWorkRouter;
