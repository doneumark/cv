import * as express from 'express';
import { authenticate, AuthRequest } from '../services/auth';
import prisma from '../prisma';

const JobRouter = express.Router();

JobRouter.get('/', authenticate, async (req: AuthRequest, res) => {
	try {
		const jobs = await prisma.profile.findMany({
			where: { userId: req.user.id },
			orderBy: {
				createdAt: 'desc',
			},
		});

		res.status(200).send(jobs);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

JobRouter.post('/', authenticate, async (req: AuthRequest, res) => {
	try {
		const { title, description } = req.body;

		const job = await prisma.job.create({
			data: {
				title,
				description,
				userId: req.user.id,
			},
		});

		res.status(200).send(job);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

export default JobRouter;
