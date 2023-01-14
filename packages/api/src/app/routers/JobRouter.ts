import * as express from 'express';
import { Job } from '@prisma/client';
import { authenticate, AuthRequest } from '../services/auth';
import prisma from '../prisma';

const getPermittedJobData = (data: Job) => {
	const {
		title, description,
	} = data;
	return {
		title,
		description,
	};
};

const JobRouter = express.Router();

JobRouter.get('/', authenticate, async (req: AuthRequest, res) => {
	try {
		const jobs = await prisma.job.findMany({
			where: {
				userId: req.user.id,
			},
			orderBy: [
				{ createdAt: 'desc' },
			],
		});

		res.status(200).send(jobs);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

JobRouter.post('/', authenticate, async (req: AuthRequest, res) => {
	try {
		const permittedData = getPermittedJobData(req.body);

		const newJob = await prisma.job.create({
			data: {
				...permittedData,
				userId: req.user.id,
			},
		});

		res.status(200).send(newJob);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

JobRouter.get('/:jobId', authenticate, async (req: AuthRequest, res) => {
	const { jobId } = req.params;

	try {
		const job = await prisma.job.findUnique({
			where: {
				id: jobId,
			},
		});

		if (!job || job.userId !== req.user.id) {
			throw new Error('Job not found');
		}

		res.status(200).send(job);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

JobRouter.post('/:jobId', authenticate, async (req: AuthRequest, res) => {
	const { jobId } = req.params;

	try {
		const job = await prisma.job.findUnique({
			where: {
				id: jobId,
			},
		});

		if (!job || job.userId !== req.user.id) {
			throw new Error('Job not found');
		}

		const permittedData = getPermittedJobData(job);

		const duplicatedJob = await prisma.job.create({
			data: {
				...permittedData,
				userId: req.user.id,
			},
		});

		res.status(200).send(duplicatedJob);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

JobRouter.put('/:jobId', authenticate, async (req: AuthRequest, res) => {
	const { jobId } = req.params;

	try {
		const job = await prisma.job.findUnique({
			where: {
				id: jobId,
			},
		});

		if (!job || job.userId !== req.user.id) {
			throw new Error('Job not found');
		}

		const permittedData = getPermittedJobData(req.body);

		const updatedJob = await prisma.job.update({
			where: {
				id: jobId,
			},
			data: permittedData,
		});

		res.status(200).send(updatedJob);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

JobRouter.delete('/:jobId', authenticate, async (req: AuthRequest, res) => {
	const { jobId } = req.params;

	try {
		const job = await prisma.job.findUnique({
			where: {
				id: jobId,
			},
		});

		if (!job || job.userId !== req.user.id) {
			throw new Error('Job not found');
		}

		const deletedJob = await prisma.job.delete({
			where: {
				id: jobId,
			},
		});

		res.status(200).send(deletedJob);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

export default JobRouter;
