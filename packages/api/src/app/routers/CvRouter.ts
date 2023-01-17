import * as express from 'express';
import { Cv } from '@prisma/client';
import { authenticate, AuthRequest } from '../services/auth';
import prisma from '../prisma';

const getPermittedCvData = (data: Cv) => {
	const {
		jobId, text,
	} = data;
	return {
		jobId,
		text,
	};
};

const CvRouter = express.Router();

CvRouter.get('/', authenticate, async (req: AuthRequest, res) => {
	try {
		const cvs = await prisma.cv.findMany({
			where: {
				userId: req.user.id,
			},
			orderBy: [
				{ createdAt: 'desc' },
			],
		});

		res.status(200).send(cvs);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

CvRouter.post('/', authenticate, async (req: AuthRequest, res) => {
	try {
		const permittedData = getPermittedCvData(req.body);

		const newCv = await prisma.cv.create({
			data: {
				...permittedData,
				userId: req.user.id,
			},
		});

		// call (not with async) a function that generates the cv

		res.status(200).send(newCv);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

CvRouter.get('/:cvId', authenticate, async (req: AuthRequest, res) => {
	const { cvId } = req.params;

	try {
		const cv = await prisma.cv.findUnique({
			where: {
				id: cvId,
			},
		});

		if (!cv || cv.userId !== req.user.id) {
			throw new Error('Cv not found');
		}

		res.status(200).send(cv);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

export default CvRouter;
